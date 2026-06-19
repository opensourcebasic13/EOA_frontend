import { useState } from "react";
import logo from "../assets/logo.png";
import Footer from "../components/layout/Footer.jsx";
import LoginForm from "../components/auth/LoginForm.jsx";

/* ── 관심 주식 데이터 ── */
const stocks = [
  { name: "테슬라",     price: "181.06달러",   change: "2.57%", dir: "up",   logo: "https://assets.parqet.com/logos/symbol/TSLA" },
  { name: "엔비디아",   price: "1,037.89달러", change: "1.12%", dir: "down", logo: "https://assets.parqet.com/logos/symbol/NVDA" },
  { name: "팔란티어",   price: "23.48달러",    change: "4.18%", dir: "up",   logo: "https://assets.parqet.com/logos/symbol/PLTR" },
  { name: "메타",       price: "512.33달러",   change: "1.82%", dir: "up",   logo: "https://assets.parqet.com/logos/symbol/META" },
  { name: "넷플릭스",   price: "550.12달러",   change: "1.24%", dir: "up",   logo: "https://assets.parqet.com/logos/symbol/NFLX" },
];

/* ── 서비스 특징 카드 ── */
const features = [
  { icon: "↗", title: "실시간 트렌드",   desc: "시간 단위 트렌드 분석" },
  { icon: "🔥", title: "핫한 종목 발견", desc: "상승 트렌드를 빠르게 포착" },
  { icon: "🔔", title: "맞춤 알림",      desc: "관심 종목 변화 알림" },
];

/* ── 로고 이미지 (로딩 실패 시 이니셜 표시) ── */
function StockLogo({ src, name }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
        {name[0]}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-9 h-9 rounded-full object-contain border border-gray-100 shrink-0"
      onError={() => setErr(true)}
    />
  );
}

/* ── 메인 Login 페이지 ── */
export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* ── 헤더 ── */}
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <img src={logo} alt="EOA" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-gray-900">EOA(EARS OF ANTS)</h1>
        </div>
      </header>

      {/* ── 메인 콘텐츠 ── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-8 py-10 flex gap-10 items-start">

        {/* ── 왼쪽: 서비스 소개 ── */}
        <div className="flex-1 min-w-0">

          {/* 브레드크럼 */}
          <p className="text-blue-600 text-sm font-semibold mb-4 flex items-center gap-1">
            📊 실시간·트렌드·인사이트
          </p>

          {/* 메인 타이틀 */}
          <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
            실시간 트윗 기반<br />주식 트렌드 분석
          </h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            트위터에서 이야기되는 종목을 실시간으로 분석하고<br />
            트렌드 변화를 한눈에 확인하세요.
          </p>

          {/* 관심 주식 목록 */}
          <h3 className="text-base font-bold text-gray-900 mb-3">관심 주식</h3>
          <div className="space-y-2 mb-4">
            {stocks.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-2xl border border-gray-200 px-5 py-3.5 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <StockLogo src={s.logo} name={s.name} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.price}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${s.dir === "up" ? "text-red-500" : "text-blue-500"}`}>
                  {s.dir === "up" ? "▲" : "▼"} {s.change}
                </span>
              </div>
            ))}
          </div>

          {/* 관심 종목 관리 버튼 */}
          <button className="w-full text-center text-blue-600 text-sm font-semibold hover:underline mb-8 flex items-center justify-center gap-1 py-2">
            ↗ 관심 종목 관리
          </button>

          {/* 특징 카드 3개 */}
          <div className="grid grid-cols-3 gap-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
              >
                <div className="text-xl mb-2">{f.icon}</div>
                <p className="text-sm font-bold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 오른쪽: 로그인 폼 ── */}
        <div className="w-[420px] shrink-0 sticky top-10">
          <LoginForm />
        </div>
      </main>

      {/* ── 푸터 ── */}
      <Footer />
    </div>
  );
}
