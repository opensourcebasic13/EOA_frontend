import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../../api/auth";
import { hasBackend } from "../../api/client";

export default function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", email: "", pw: "", pwConfirm: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.id) e.id = "아이디를 입력하세요.";
    else if (form.id.length < 4) e.id = "아이디는 4자 이상이어야 합니다.";
    if (!form.email) e.email = "이메일을 입력하세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "올바른 이메일 형식이 아닙니다.";
    if (!form.pw) e.pw = "비밀번호를 입력하세요.";
    else if (form.pw.length < 6) e.pw = "비밀번호는 6자 이상이어야 합니다.";
    else if (/^\d+$/.test(form.pw)) e.pw = "숫자만으로는 비밀번호를 설정할 수 없습니다.";
    if (form.pw !== form.pwConfirm) e.pwConfirm = "비밀번호가 일치하지 않습니다.";
    return e;
  };

  const translatePasswordError = (msg) => {
    if (!msg) return msg;
    if (msg.includes("too common")) return "너무 단순한 비밀번호입니다. 다른 비밀번호를 사용하세요.";
    if (msg.includes("entirely numeric")) return "숫자만으로는 비밀번호를 설정할 수 없습니다.";
    if (msg.includes("too short")) return "비밀번호는 6자 이상이어야 합니다.";
    if (msg.includes("too similar")) return "아이디와 너무 유사한 비밀번호입니다.";
    return msg;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setApiError("");

    if (!hasBackend) {
      setDone(true);
      return;
    }

    setLoading(true);
    try {
      await signupApi(form.id, form.email, form.pw);
      setDone(true);
    } catch (err) {
      if (!err.data) {
        setApiError("서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요.");
      } else {
        const d = err.data;
        const e = d.errors ?? d;
        const raw =
          e.username?.[0] ??
          e.email?.[0] ??
          e.password?.[0] ??
          e.password_confirm?.[0] ??
          d.message ??
          `오류가 발생했습니다. (${err.message})`;
        setApiError(translatePasswordError(raw));
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }));
      setErrors(prev => ({ ...prev, [key]: "" }));
      setApiError("");
    },
    className: `w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 outline-none transition ${
      errors[key]
        ? "border-red-400 focus:ring-2 focus:ring-red-50"
        : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
    }`,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {done ? (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-12 w-full text-center">
            <div className="text-5xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">회원가입 완료!</h2>
            <p className="text-gray-500 text-sm mb-8">
              <span className="font-semibold text-gray-800">{form.id}</span>님, 환영합니다.
              <br />EOA에서 실시간 주식 트렌드를 확인하세요.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              로그인 하러 가기
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-10 w-full">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition"
            >
              ← 로그인으로 돌아가기
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h2>
            <p className="text-gray-500 text-sm mb-8">EOA에 가입하고 실시간 주식 트렌드를 시작하세요.</p>

            <div className="space-y-5">
              {/* 아이디 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">아이디</label>
                <input type="text" placeholder="아이디를 입력하세요 (4자 이상)" {...field("id")} />
                {errors.id && <p className="mt-1.5 text-xs text-red-500">{errors.id}</p>}
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">이메일</label>
                <input type="email" placeholder="이메일을 입력하세요" {...field("email")} />
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">비밀번호</label>
                <input type="password" placeholder="비밀번호를 입력하세요 (6자 이상)" {...field("pw")} />
                <p className="mt-1 text-xs text-gray-400">6자 이상, 숫자만 사용 불가, 너무 단순한 비밀번호 불가</p>
                {errors.pw && <p className="mt-1 text-xs text-red-500">{errors.pw}</p>}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">비밀번호 확인</label>
                <input type="password" placeholder="비밀번호를 다시 입력하세요" {...field("pwConfirm")} />
                {errors.pwConfirm && <p className="mt-1.5 text-xs text-red-500">{errors.pwConfirm}</p>}
              </div>

              {/* API 에러 */}
              {apiError && <p className="text-xs text-red-500">{apiError}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition shadow-md shadow-blue-200/40 active:scale-[0.98] mt-2"
              >
                {loading ? "가입 중..." : "회원가입"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              이미 계정이 있으신가요?{" "}
              <button onClick={() => navigate("/login")} className="text-blue-600 font-semibold hover:underline">
                로그인
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
