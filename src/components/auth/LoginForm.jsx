import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [keep, setKeep] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = () => {
    navigate("/home");
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-10">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">로그인</h2>
      <p className="text-gray-500 text-sm mb-8 leading-relaxed">
        계정에 로그인하고 관심 주식과<br />실시간 트렌드를 확인하세요
      </p>

      <div className="space-y-5">
        {/* 이메일/아이디 */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">이메일 또는 아이디</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉</span>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="이메일 또는 아이디를 입력하세요"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
          </div>
        </div>

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">비밀번호</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
            />
            <button
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm hover:text-gray-600"
            >
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

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
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-md shadow-blue-200/40 active:scale-[0.98]"
        >
          로그인
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
