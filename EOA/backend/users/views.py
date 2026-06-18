from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(["POST"])
def signup(request):
    username = request.data.get("username", "").strip()
    email = request.data.get("email", "").strip()
    password = request.data.get("password", "")
    password_confirm = request.data.get("password_confirm", "")

    errors = {}

    if not username:
        errors["username"] = ["아이디를 입력하세요."]
    elif len(username) < 4:
        errors["username"] = ["아이디는 4자 이상이어야 합니다."]
    elif User.objects.filter(username=username).exists():
        errors["username"] = ["이미 사용 중인 아이디입니다."]

    if not email:
        errors["email"] = ["이메일을 입력하세요."]
    elif User.objects.filter(email=email).exists():
        errors["email"] = ["이미 사용 중인 이메일입니다."]

    if not password:
        errors["password"] = ["비밀번호를 입력하세요."]
    elif password != password_confirm:
        errors["password_confirm"] = ["비밀번호가 일치하지 않습니다."]
    else:
        try:
            validate_password(password)
        except ValidationError as e:
            errors["password"] = list(e.messages)

    if errors:
        return Response(
            {"success": False, "message": "입력값을 확인하세요.", "errors": errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(username=username, email=email, password=password)
    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {"success": True, "message": "회원가입이 완료되었습니다.", "token": token.key},
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
def login(request):
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")

    if not username or not password:
        return Response(
            {
                "success": False,
                "message": "아이디와 비밀번호를 입력하세요.",
                "errors": {"non_field_errors": ["아이디와 비밀번호를 입력하세요."]},
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {
                "success": False,
                "message": "아이디 또는 비밀번호가 올바르지 않습니다.",
                "errors": {"non_field_errors": ["아이디 또는 비밀번호가 올바르지 않습니다."]},
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {
            "success": True,
            "message": "로그인에 성공했습니다.",
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }
    )


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({"success": True, "message": "로그아웃 되었습니다."})


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response(
        {
            "success": True,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }
    )
