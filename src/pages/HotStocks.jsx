import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import LogoImg from "../components/common/LogoImg";
import { fetchTrending } from "../api/stocks";

// 정렬 옵션
const SORT_OPTIONS = [
  { key: "score",       label: "🔥 종합 점수" },
  { key: "tweets",      label: "💬 트윗량"    },
  { key: "change",      label: "📈 주가 상승률" },
  { key: "tweetChange", label: "🚀 트윗 급등률" },
];

// 점수 계산: 트윗량 × 주가상승률 (둘 다 높아야 핫)
function calcScore(s) {
  return s.tweets * parseFloat(s.change);
}

const RANK_MEDAL = ["🥇", "🥈", "🥉"];

// ── 문자 알림 토스트 ──────────────────────────────────────
function SmsToast({ stock, visible, onClose }) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div
      style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
      className={`fixed top-5 right-5 z-50 w-80
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
    >
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden">
        {/* 상단 앱 표시 */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <div className="w-5 h-5 rounded-md bg-green-500 flex items-center justify-center text-xs">💬</div>
          <span className="text-xs text-gray-400 font-medium flex-1">메시지</span>
          <span className="text-xs text-gray-500">{time}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition ml-1 text-xs">✕</button>
        </div>

        {/* 발신자 */}
        <div className="px-4 pb-1">
          <p className="text-xs font-bold text-gray-300">EOA 알림</p>
        </div>

        {/* 메시지 본문 */}
        <div className="px-4 pb-4">
          <p className="text-sm leading-relaxed">
            📲 <span className="font-bold text-green-400">[{stock?.name}]</span> 알람이 설정되었습니다.{"\n"}
            급등 시 문자로 알려드릴게요!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HotStocks() {
  const navigate  = useNavigate();
  const { watchlist, addToWatchlist } = useAuth();
  const [allStocks, setAllStocks] = useState([]);
  const [sortKey, setSortKey]   = useState("score");
  const [alarms, setAlarms]     = useState(new Set());
  const [toast, setToast]       = useState({ visible: false, stock: null });
  const toastTimer              = useRef(null);

  useEffect(() => {
    const load = () => fetchTrending().then(data => {
      setAllStocks(data.map(s => ({
        ...s,
        change: s.priceChange.replace("%", ""),
        dir:    s.priceDir,
        tweets: parseInt(s.tweets.replace(/,/g, ""), 10) || 0,
        tweetChange: (s.tweetChange ?? "0%").replace("%", ""),
      })));
    });
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  // 토스트 자동 닫기 (3.5초)
  useEffect(() => {
    if (toast.visible) {
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
    }
    return () => clearTimeout(toastTimer.current);
  }, [toast.visible]);

  const handleAlarm = (stock) => {
    setAlarms((prev) => {
      const next = new Set(prev);
      if (next.has(stock.name)) {
        next.delete(stock.name);
      } else {
        next.add(stock.name);
        // 토스트 띄우기
        setToast({ visible: true, stock });
      }
      return next;
    });
  };

  const isInWatchlist = (name) => watchlist.some((s) => s.name === name);

  // 상승 종목만 필터링 후 정렬
  const hotList = allStocks
    .filter((s) => s.dir === "up")
    .sort((a, b) => {
      if (sortKey === "score")       return calcScore(b) - calcScore(a);
      if (sortKey === "tweets")      return b.tweets - a.tweets;
      if (sortKey === "change")      return parseFloat(b.change) - parseFloat(a.change);
      if (sortKey === "tweetChange") return parseFloat(b.tweetChange) - parseFloat(a.tweetChange);
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 문자 알림 토스트 */}
      <SmsToast
        stock={toast.stock}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />

      <Header />

      <div className="max-w-3xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

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
          <h1 className="text-2xl font-bold text-gray-900">🔥 핫한 종목 발견</h1>
          <p className="text-sm text-gray-400 mt-1">
            트윗량이 많고 주가가 오른 종목을 한눈에 확인하세요.
          </p>
        </div>

        {/* 정렬 탭 */}
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortKey(opt.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                ${sortKey === opt.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 종목 리스트 */}
        <div className="flex flex-col gap-3">
          {hotList.map((stock, idx) => {
            const added = isInWatchlist(stock.name);
            const score = Math.round(calcScore(stock)).toLocaleString();

            return (
              <div
                key={stock.ticker}
                className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition"
              >
                {/* 순위 */}
                <div className="w-9 text-center shrink-0">
                  {idx < 3
                    ? <span className="text-2xl">{RANK_MEDAL[idx]}</span>
                    : <span className="text-lg font-bold text-gray-300">{idx + 1}</span>
                  }
                </div>

                {/* 로고 */}
                <LogoImg src={stock.logo} name={stock.name} />

                {/* 종목 정보 */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(stock.name)}`)}
                >
                  <p className="text-sm font-bold text-gray-900 hover:text-blue-600 transition truncate">
                    {stock.name}
                  </p>
                  <p className="text-xs text-gray-400">{stock.ticker}</p>
                </div>

                {/* 주가 변동 */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{stock.price}</p>
                  <p className="text-xs font-semibold text-red-500">▲ {stock.change}%</p>
                </div>

                {/* 트윗 정보 */}
                <div className="text-right shrink-0 hidden sm:block">
                  <p className="text-sm font-bold text-gray-700">
                    {stock.tweets.toLocaleString()}
                    <span className="text-xs font-normal text-gray-400 ml-1">트윗</span>
                  </p>
                  <p className={`text-xs font-semibold
                    ${stock.tweetDir === "up" ? "text-red-500" : "text-blue-500"}`}>
                    {stock.tweetDir === "up" ? "▲" : "▼"} {stock.tweetChange}%
                  </p>
                </div>

                {/* 점수 뱃지 */}
                <div className="shrink-0 hidden md:flex flex-col items-center">
                  <span className="text-xs text-gray-400 mb-0.5">점수</span>
                  <span className="text-sm font-bold text-orange-500">{score}</span>
                </div>

                {/* 알람 버튼 */}
                <button
                  onClick={() => handleAlarm(stock)}
                  title={alarms.has(stock.name) ? "알람 해제" : "알람 설정"}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition
                    ${alarms.has(stock.name)
                      ? "bg-yellow-100 text-yellow-500"
                      : "bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-400"
                    }`}
                >
                  {alarms.has(stock.name) ? "🔔" : "🔕"}
                </button>

                {/* 관심 추가 버튼 */}
                <button
                  onClick={() => !added && addToWatchlist({ ...stock, change: `${stock.change}%`, tweets: stock.tweets.toLocaleString(), tweetChange: `${stock.tweetChange}%` })}
                  disabled={added}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition
                    ${added
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {added ? "✓ 추가됨" : "+ 추가"}
                </button>
              </div>
            );
          })}
        </div>
        
        {hotList.length === 0 && (
          <div className="text-center py-24">
            <p className="text-4xl mb-3">📉</p>
            <p className="text-sm font-semibold text-gray-500">현재 상승 중인 종목이 없습니다.</p>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
