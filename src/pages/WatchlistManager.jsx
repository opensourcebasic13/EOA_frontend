import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import LogoImg from "../components/common/LogoImg";


const ALL_STOCKS = [
  { name: "테슬라",       ticker: "TSLA",       price: "181.06달러",   change: "2.57%",  dir: "up",   logo: "https://logo.clearbit.com/tesla.com",        tweets: "24,851", tweetChange: "23.4%", tweetDir: "up"   },
  { name: "엔비디아",     ticker: "NVDA",       price: "1,037.89달러", change: "1.12%",  dir: "down", logo: "https://logo.clearbit.com/nvidia.com",        tweets: "18,932", tweetChange: "12.8%", tweetDir: "up"   },
  { name: "팔란티어",     ticker: "PLTR",       price: "23.48달러",    change: "4.18%",  dir: "up",   logo: "https://logo.clearbit.com/palantir.com",      tweets: "12,309", tweetChange: "45.6%", tweetDir: "up"   },
  { name: "AMD",          ticker: "AMD",        price: "167.18달러",   change: "1.35%",  dir: "up",   logo: "https://logo.clearbit.com/amd.com",           tweets: "9,842",  tweetChange: "15.7%", tweetDir: "up"   },
  { name: "마이크로소프트",ticker: "MSFT",      price: "420.72달러",   change: "0.21%",  dir: "down", logo: "https://logo.clearbit.com/microsoft.com",     tweets: "9,102",  tweetChange: "3.6%",  tweetDir: "down" },
  { name: "애플",         ticker: "AAPL",       price: "192.58달러",   change: "0.53%",  dir: "down", logo: "https://logo.clearbit.com/apple.com",         tweets: "8,245",  tweetChange: "5.2%",  tweetDir: "down" },
  { name: "삼성전자",     ticker: "005930.KS",  price: "77,500원",     change: "0.64%",  dir: "down", logo: "https://logo.clearbit.com/samsung.com",       tweets: "6,723",  tweetChange: "8.9%",  tweetDir: "up"   },
  { name: "SK하이닉스",   ticker: "000660.KS",  price: "194,000원",    change: "1.36%",  dir: "up",   logo: "https://logo.clearbit.com/skhynix.com",       tweets: "5,876",  tweetChange: "10.1%", tweetDir: "up"   },
  { name: "코인베이스",   ticker: "COIN",       price: "233.41달러",   change: "0.98%",  dir: "up",   logo: "https://logo.clearbit.com/coinbase.com",      tweets: "4,912",  tweetChange: "6.7%",  tweetDir: "up"   },
  { name: "아마존",       ticker: "AMZN",       price: "186.67달러",   change: "0.73%",  dir: "down", logo: "https://logo.clearbit.com/amazon.com",        tweets: "4,521",  tweetChange: "2.1%",  tweetDir: "down" },
  { name: "메타",         ticker: "META",       price: "512.33달러",   change: "1.82%",  dir: "up",   logo: "https://logo.clearbit.com/meta.com",          tweets: "7,341",  tweetChange: "18.3%", tweetDir: "up"   },
  { name: "구글",         ticker: "GOOGL",      price: "176.45달러",   change: "0.94%",  dir: "up",   logo: "https://logo.clearbit.com/google.com",        tweets: "5,123",  tweetChange: "7.2%",  tweetDir: "up"   },
];

const RECOMMENDED = [
  { ...ALL_STOCKS[2], reason: "트윗량 급등", reasonIcon: "🚀" },  
  { ...ALL_STOCKS[3], reason: "상승 모멘텀",  reasonIcon: "📈" }, 
  { ...ALL_STOCKS[0], reason: "트윗 1위",     reasonIcon: "🔥" }, 
  { ...ALL_STOCKS[10], reason: "AI 관심 급증", reasonIcon: "🤖" }, 
  { ...ALL_STOCKS[11], reason: "안정 성장",   reasonIcon: "💡" },  
  { ...ALL_STOCKS[8], reason: "코인 연동",    reasonIcon: "₿"  }, 
];


function RecommendedCard({ stock, isAdded, onAdd }) {
  const isUp = stock.dir === "up";
  const isTweetUp = stock.tweetDir === "up";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
      {/* 추천 이유 뱃지 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {stock.reasonIcon} {stock.reason}
        </span>
        <span className={`text-xs font-semibold ${isTweetUp ? "text-red-500" : "text-blue-500"}`}>
          트윗 {isTweetUp ? "▲" : "▼"} {stock.tweetChange}
        </span>
      </div>

      {/* 종목 정보 */}
      <div className="flex items-center gap-3 mb-3">
        <LogoImg src={stock.logo} name={stock.name} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{stock.name}</p>
          <p className="text-xs text-gray-400">{stock.ticker}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-900">{stock.price}</p>
          <p className={`text-xs font-semibold ${isUp ? "text-red-500" : "text-blue-500"}`}>
            {isUp ? "▲" : "▼"} {stock.change}
          </p>
        </div>
      </div>

      {/* 추가 버튼 */}
      <button
        onClick={onAdd}
        disabled={isAdded}
        className={`w-full py-2 rounded-lg text-sm font-semibold transition
          ${isAdded
            ? "bg-gray-100 text-gray-400 cursor-default"
            : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
      >
        {isAdded ? "✓ 추가됨" : "+ 관심종목 추가"}
      </button>
    </div>
  );
}


export default function WatchlistManager() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery]   = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  // 다른 곳 누르면 드롭다운 닫힘
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isInWatchlist = (name) => watchlist.some(s => s.name === name);

  // 검색 결과 필터링
  const searchResults = ALL_STOCKS.filter(s => {
    if (!searchQuery.trim()) return false;
    return (
      s.name.includes(searchQuery) ||
      s.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddFromSearch = (stock) => {
    addToWatchlist(stock);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-5">

        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition w-fit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          뒤로가기
        </button>

        {/* 타이틀 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">관심 종목 관리</h1>
          <p className="text-sm text-gray-400 mt-1">관심 종목을 추가하거나 삭제할 수 있습니다.</p>
        </div>

        <div className="flex gap-6 items-start">

          {/* 관심 종목 */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">

              {/* 헤더 */}
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-base font-bold text-gray-900">나의 관심 종목</h2>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 font-medium">
                  {watchlist.length}개
                </span>
              </div>

              {/* 검색 + 추가 */}
              <div className="relative mb-5" ref={searchRef}>
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="종목명 또는 티커 검색해서 추가..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition"
                />

                {/* 검색 드롭다운 */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden">
                    {searchResults.map(s => {
                      const added = isInWatchlist(s.name);
                      return (
                        <button
                          key={s.name}
                          onClick={() => !added && handleAddFromSearch(s)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition
                            ${added
                              ? "opacity-50 cursor-default bg-gray-50"
                              : "hover:bg-blue-50"
                            }`}
                        >
                          <LogoImg src={s.logo} name={s.name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                            <p className="text-xs text-gray-400">{s.ticker}</p>
                          </div>
                          <span className={`text-xs font-semibold shrink-0
                            ${added ? "text-gray-400" : "text-blue-600"}`}>
                            {added ? "✓ 추가됨" : "+ 추가"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 관심 종목 목록 */}
              {watchlist.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">⭐</p>
                  <p className="text-sm font-semibold text-gray-500">관심 종목이 없습니다</p>
                  <p className="text-xs text-gray-400 mt-1">위 검색창에서 종목을 추가해보세요!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {watchlist.map((stock) => (
                    <div
                      key={stock.name}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 group transition"
                    >
                      <LogoImg src={stock.logo} name={stock.name} />

                      {/* 종목 정보 */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => navigate(`/search?q=${encodeURIComponent(stock.name)}`)}
                      >
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">
                          {stock.name}
                        </p>
                        <p className="text-xs text-gray-400">{stock.ticker}</p>
                      </div>

                      {/* 가격 */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-gray-800">{stock.price}</p>
                        <p className={`text-xs font-semibold ${stock.dir === "up" ? "text-red-500" : "text-blue-500"}`}>
                          {stock.dir === "up" ? "▲" : "▼"} {stock.change}
                        </p>
                      </div>

                      {/* 삭제 버튼 (hover 시 표시) */}
                      <button
                        onClick={() => removeFromWatchlist(stock.name)}
                        title="삭제"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 transition opacity-0 group-hover:opacity-100 shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/*추천 종목 */}
          <div className="w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🔥</span>
                <h3 className="font-bold text-gray-900">지금 뜨는 종목</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">트윗량 급증 · 상승세 종목 추천</p>

              <div className="space-y-3">
                {RECOMMENDED.map(stock => (
                  <RecommendedCard
                    key={stock.name}
                    stock={stock}
                    isAdded={isInWatchlist(stock.name)}
                    onAdd={() => addToWatchlist(stock)}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

