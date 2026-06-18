import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, DEFAULT_ALARM } from "../context/AuthContext";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import LogoImg from "../components/common/LogoImg";
import { fetchTrending } from "../api/stocks";

const PRICE_OPTIONS  = [1, 3, 5, 10];
const TWEET_OPTIONS  = [20, 50, 100, 200];

function AlarmModal({ stock, alarm, onClose, onToggle, onUpdate, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900">{stock.name} 알림 설정</p>
            <p className="text-xs text-gray-400 mt-0.5">{stock.ticker}</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition">
            ✕
          </button>
        </div>

        {/* 알림 ON/OFF */}
        <div className="flex items-center justify-between py-3 border-y border-gray-100">
          <div>
            <p className="text-sm font-semibold text-gray-800">알림 받기</p>
            <p className="text-xs text-gray-400 mt-0.5">조건 충족 시 앱 알림 발송</p>
          </div>
          <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200
              ${alarm.enabled ? "bg-blue-600" : "bg-gray-200"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
              ${alarm.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>

        {/* 임계값 설정 */}
        <div className={`flex flex-col gap-4 transition-opacity ${alarm.enabled ? "opacity-100" : "opacity-40 pointer-events-none"}`}>

          {/* 주가 변동 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">📈 주가 변동 알림</p>
            <div className="flex gap-2">
              {PRICE_OPTIONS.map(v => (
                <button key={v}
                  onClick={() => onUpdate({ priceThreshold: v })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition
                    ${alarm.priceThreshold === v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"}`}>
                  ±{v}%
                </button>
              ))}
            </div>
          </div>

          {/* 트윗량 급증 */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">💬 트윗량 급증 알림</p>
            <div className="flex gap-2">
              {TWEET_OPTIONS.map(v => (
                <button key={v}
                  onClick={() => onUpdate({ tweetThreshold: v })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition
                    ${alarm.tweetThreshold === v
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-200 hover:border-blue-300"}`}>
                  +{v}%
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-gray-400 leading-relaxed">
            * 두 조건 중 하나라도 충족되면 알림이 발송됩니다.<br />
            * 임계값은 추후 종목별 변동성 데이터 기반으로 자동 보정될 예정입니다.
          </p>
        </div>

        <button onClick={onConfirm}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
          {alarm.enabled ? "알림 설정하기" : "확인"}
        </button>
      </div>
    </div>
  );
}

function AlarmToast({ stock, visible, onClose }) {
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  return (
    <div style={{ transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
      className={`fixed top-5 right-5 z-50 w-80
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 pt-3 pb-1">
          <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center text-xs">🔔</div>
          <span className="text-xs text-gray-400 font-medium flex-1">EOA 알림</span>
          <span className="text-xs text-gray-500">{time}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition ml-1 text-xs">✕</button>
        </div>
        <div className="px-4 pb-4 pt-1">
          <p className="text-sm leading-relaxed">
            🔔 <span className="font-bold text-blue-400">[{stock?.name}]</span> 알림이 설정되었습니다.
            조건 충족 시 알림을 보내드릴게요!
          </p>
        </div>
      </div>
    </div>
  );
}


const REASON_LIST = [
  { reason: "트윗 1위",     reasonIcon: "🔥" },
  { reason: "트윗량 급등",  reasonIcon: "🚀" },
  { reason: "상승 모멘텀",  reasonIcon: "📈" },
  { reason: "AI 관심 급증", reasonIcon: "🤖" },
  { reason: "안정 성장",    reasonIcon: "💡" },
  { reason: "스트리밍 강세", reasonIcon: "🎬" },
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
  const { watchlist, addToWatchlist, removeFromWatchlist, getAlarm, toggleAlarm, updateAlarm } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery]   = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [alarmModal, setAlarmModal]     = useState(null);
  const [toast, setToast]               = useState({ visible: false, stock: null });
  const [allStocks, setAllStocks]       = useState([]);
  const [recommended, setRecommended]   = useState([]);
  const toastTimer                      = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    fetchTrending().then(data => {
      const normalized = data.map(s => ({
        ...s,
        change: s.priceChange,
        dir:    s.priceDir,
      }));
      setAllStocks(normalized);
      setRecommended(
        normalized.slice(0, 6).map((s, i) => ({
          ...s,
          reason:     REASON_LIST[i].reason,
          reasonIcon: REASON_LIST[i].reasonIcon,
        }))
      );
    });
  }, []);

  useEffect(() => {
    if (toast.visible) {
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
    }
    return () => clearTimeout(toastTimer.current);
  }, [toast.visible]);

  const handleToggleAlarm = async (stock) => {
    const wasEnabled = getAlarm(stock.name).enabled;

    if (!wasEnabled) {
      // 알람 켤 때 브라우저 알림 권한 요청
      if (Notification.permission === "denied") {
        alert("브라우저 알림이 차단되어 있습니다.\n주소창 왼쪽 자물쇠 아이콘 → 알림 → 허용으로 변경해주세요.");
        return;
      }
      if (Notification.permission === "default") {
        const result = await Notification.requestPermission();
        if (result !== "granted") return;
      }
    }

    toggleAlarm(stock.name);
    if (!wasEnabled) setToast({ visible: true, stock });
  };

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
  const searchResults = allStocks.filter(s => {
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
      <AlarmToast
        stock={toast.stock}
        visible={toast.visible}
        onClose={() => setToast(t => ({ ...t, visible: false }))}
      />
      {alarmModal && (
        <AlarmModal
          stock={alarmModal}
          alarm={getAlarm(alarmModal.name)}
          onClose={() => setAlarmModal(null)}
          onToggle={() => handleToggleAlarm(alarmModal)}
          onUpdate={(updates) => updateAlarm(alarmModal.name, updates)}
          onConfirm={() => {
            if (getAlarm(alarmModal.name).enabled) {
              setToast({ visible: true, stock: alarmModal });
            }
            setAlarmModal(null);
          }}
        />
      )}
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

                      {/* 알림 버튼 */}
                      <button
                        onClick={() => setAlarmModal(stock)}
                        title="알림 설정"
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition shrink-0
                          ${getAlarm(stock.name).enabled
                            ? "bg-blue-100 text-blue-500"
                            : "text-gray-300 hover:bg-gray-100 hover:text-gray-500 opacity-0 group-hover:opacity-100"
                          }`}
                      >
                        {getAlarm(stock.name).enabled ? "🔔" : "🔕"}
                      </button>

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
                {recommended.map(stock => (
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

