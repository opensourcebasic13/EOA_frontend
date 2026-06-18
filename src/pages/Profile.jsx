import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import LogoImg from "../components/common/LogoImg";

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <span className="flex items-center gap-2 text-sm text-gray-500 w-28 shrink-0">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900 flex-1 text-right">{value}</span>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, updateUser, watchlist } = useAuth();
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 연필 버튼 클릭 → 숨긴 파일 인풋 열기
  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 → base64로 변환해 localStorage에 영구 저장
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => updateUser({ avatar: ev.target.result });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto w-full px-6 py-8 flex flex-col gap-5">

        {/* 백 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition w-fit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          뒤로가기
        </button>

        {/* ── 프로필 카드 ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-5">
            {/* 아바타 */}
            <div className="relative shrink-0">
              {/* 숨긴 파일 인풋 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 border-2 border-gray-200 flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-500">{user.name?.[0] ?? "U"}</span>
                </div>
              )}

              {/* 연필 버튼 → 파일 선택 트리거 */}
              <button
                onClick={handleAvatarEditClick}
                className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow transition"
                title="프로필 사진 변경"
              >
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                </svg>
              </button>
            </div>

            {/* 이름 + 이메일 */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            </div>

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-500 border border-red-200 rounded-xl px-4 py-2 hover:bg-red-50 transition shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
              </svg>
              로그아웃
            </button>
          </div>
        </div>

        {/* ── 기본 정보 카드 ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-900 mb-2">기본 정보</h2>

          <InfoRow
            label="이름"
            value={user.name}
            icon={
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
              </svg>
            }
          />
          <InfoRow
            label="이메일"
            value={user.email}
            icon={
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </svg>
            }
          />
        </div>

        {/* 관심 주식 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <h2 className="text-base font-bold text-gray-900">나의 관심 주식</h2>
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                {watchlist.length}개
              </span>
            </div>
            <button
              onClick={() => navigate("/watchlist")}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              + 종목 추가
            </button>
          </div>

          <div className="space-y-1">
            {watchlist.map((stock) => (
              <div
                key={stock.name}
                onClick={() => navigate(`/search?q=${encodeURIComponent(stock.name)}`)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition group"
              >
                <LogoImg src={stock.logo} name={stock.name} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {stock.name}
                  </p>
                  <p className="text-xs text-gray-400">{stock.ticker}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-800">{stock.price}</p>
                  <p className={`text-xs font-semibold ${stock.dir === "up" ? "text-red-500" : "text-blue-500"}`}>
                    {stock.dir === "up" ? "▲" : "▼"} {stock.change}
                  </p>
                </div>

            
                <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/watchlist")}
            className="mt-4 w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition font-medium"
          >
            관심 종목 전체 관리 →
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}
