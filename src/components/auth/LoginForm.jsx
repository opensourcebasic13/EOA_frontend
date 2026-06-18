import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [keep, setKeep] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!id || !pw) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(id, pw);
      navigate("/home");
    } catch (err) {
      if (!err.data) {
        setError("서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인하세요.");
      } else {
        const d = err.data;
        const e = d.errors ?? d;
        setError(e.non_field_errors?.[0] ?? d.message ?? "아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">로그인</h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        계정에 로그인하고 관심 주식과<br />실시간 트렌드를 확인하세요
      </p>

      <div className="space-y-5">
        {/* 아이디 */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">아이디</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
              </svg>
            </div>
            <input
              type="text"
              value={id}
              onChange={(e) => { setId(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="아이디를 입력하세요"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">비밀번호</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2zm10-10V7a4 4 0 0 0-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="비밀번호를 입력하세요"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
              <button
                onClick={() => setShowPw(!showPw)}
                className="text-gray-400 hover:text-gray-600 text-sm"
              >
                {showPw ? "🙈" : "👁"}
              </button>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-xs text-red-500 -mt-2">{error}</p>
        )}

        {/* 로그인 유지 / 비밀번호 찾기 */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={keep}
              onChange={(e) => setKeep(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-700">로그인 상태 유지</span>
          </label>
          <button className="text-sm font-medium text-blue-600 hover:underline">비밀번호 찾기</button>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition shadow-md shadow-blue-200/40 active:scale-[0.98]"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </div>

      {/* 구분선 + 회원가입 */}
      <div className="mt-6 text-center">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <p className="text-sm text-gray-600">
          아직 회원이 아니신가요?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-semibold text-blue-600 hover:underline"
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
