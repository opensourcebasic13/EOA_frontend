import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", pw: "", pwConfirm: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.id) e.id = "아이디를 입력하세요.";
    else if (form.id.length < 4) e.id = "아이디는 4자 이상이어야 합니다.";
    if (!form.pw) e.pw = "비밀번호를 입력하세요.";
    else if (form.pw.length < 6) e.pw = "비밀번호는 6자 이상이어야 합니다.";
    if (form.pw !== form.pwConfirm) e.pwConfirm = "비밀번호가 일치하지 않습니다.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setDone(true);
  };

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
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">아이디</label>
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) => {
                    setForm({ ...form, id: e.target.value });
                    setErrors({ ...errors, id: "" });
                  }}
                  placeholder="아이디를 입력하세요 (4자 이상)"
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 outline-none transition ${
                    errors.id
                      ? "border-red-400 focus:ring-2 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  }`}
                />
                {errors.id && <p className="mt-1.5 text-xs text-red-500">{errors.id}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">비밀번호</label>
                <input
                  type="password"
                  value={form.pw}
                  onChange={(e) => {
                    setForm({ ...form, pw: e.target.value });
                    setErrors({ ...errors, pw: "" });
                  }}
                  placeholder="비밀번호를 입력하세요 (6자 이상)"
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 outline-none transition ${
                    errors.pw
                      ? "border-red-400 focus:ring-2 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  }`}
                />
                {errors.pw && <p className="mt-1.5 text-xs text-red-500">{errors.pw}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">비밀번호 확인</label>
                <input
                  type="password"
                  value={form.pwConfirm}
                  onChange={(e) => {
                    setForm({ ...form, pwConfirm: e.target.value });
                    setErrors({ ...errors, pwConfirm: "" });
                  }}
                  placeholder="비밀번호를 다시 입력하세요"
                  className={`w-full px-4 py-3 rounded-xl border bg-gray-50 text-sm text-gray-900 outline-none transition ${
                    errors.pwConfirm
                      ? "border-red-400 focus:ring-2 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                  }`}
                />
                {errors.pwConfirm && <p className="mt-1.5 text-xs text-red-500">{errors.pwConfirm}</p>}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-200/40 active:scale-[0.98] mt-2"
              >
                회원가입
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              이미 계정이 있으신가요?{' '}
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
