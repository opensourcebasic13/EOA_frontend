import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LogoImg from "../common/LogoImg";
import SearchChart from "./SearchChart";
import { fetchStock, fetchChart } from "../../api/stocks";
import { resolveTicker } from "../../utils/tickerMap";
import { useAuth } from "../../context/AuthContext";

const stockDB = {
  테슬라:        { ticker: "TSLA",  name: "테슬라",        price: "181.06",   currency: "달러", change: "2.57",  changeAbs: "+4.53",  dir: "up",   mktCap: "5,752.3억 달러",  volume: "1,253.4만", high: "182.35달러",   low: "176.52달러",   high52: "299.29달러",    low52: "138.80달러",  logo: "https://assets.parqet.com/logos/symbol/TSLA" },
  TSLA:          { ticker: "TSLA",  name: "테슬라",        price: "181.06",   currency: "달러", change: "2.57",  changeAbs: "+4.53",  dir: "up",   mktCap: "5,752.3억 달러",  volume: "1,253.4만", high: "182.35달러",   low: "176.52달러",   high52: "299.29달러",    low52: "138.80달러",  logo: "https://assets.parqet.com/logos/symbol/TSLA" },
  엔비디아:      { ticker: "NVDA",  name: "엔비디아",      price: "1,037.89", currency: "달러", change: "1.12",  changeAbs: "-11.74", dir: "down", mktCap: "25,540억 달러",   volume: "4,512.1만", high: "1,053.22달러", low: "1,021.45달러", high52: "1,099.23달러",  low52: "410.54달러",  logo: "https://assets.parqet.com/logos/symbol/NVDA" },
  NVDA:          { ticker: "NVDA",  name: "엔비디아",      price: "1,037.89", currency: "달러", change: "1.12",  changeAbs: "-11.74", dir: "down", mktCap: "25,540억 달러",   volume: "4,512.1만", high: "1,053.22달러", low: "1,021.45달러", high52: "1,099.23달러",  low52: "410.54달러",  logo: "https://assets.parqet.com/logos/symbol/NVDA" },
  팔란티어:      { ticker: "PLTR",  name: "팔란티어",      price: "23.48",    currency: "달러", change: "4.18",  changeAbs: "+0.94",  dir: "up",   mktCap: "504.1억 달러",    volume: "82.3만",    high: "24.10달러",    low: "22.75달러",    high52: "27.50달러",     low52: "14.21달러",   logo: "https://assets.parqet.com/logos/symbol/PLTR" },
  PLTR:          { ticker: "PLTR",  name: "팔란티어",      price: "23.48",    currency: "달러", change: "4.18",  changeAbs: "+0.94",  dir: "up",   mktCap: "504.1억 달러",    volume: "82.3만",    high: "24.10달러",    low: "22.75달러",    high52: "27.50달러",     low52: "14.21달러",   logo: "https://assets.parqet.com/logos/symbol/PLTR" },
  애플:          { ticker: "AAPL",  name: "애플",          price: "192.58",   currency: "달러", change: "0.53",  changeAbs: "-1.03",  dir: "down", mktCap: "29,720억 달러",   volume: "5,643.2만", high: "193.89달러",   low: "191.24달러",   high52: "199.62달러",    low52: "164.08달러",  logo: "https://assets.parqet.com/logos/symbol/AAPL" },
  AAPL:          { ticker: "AAPL",  name: "애플",          price: "192.58",   currency: "달러", change: "0.53",  changeAbs: "-1.03",  dir: "down", mktCap: "29,720억 달러",   volume: "5,643.2만", high: "193.89달러",   low: "191.24달러",   high52: "199.62달러",    low52: "164.08달러",  logo: "https://assets.parqet.com/logos/symbol/AAPL" },
  AMD:           { ticker: "AMD",   name: "AMD",           price: "167.18",   currency: "달러", change: "1.35",  changeAbs: "+2.23",  dir: "up",   mktCap: "2,701.2억 달러",  volume: "6,234.5만", high: "168.45달러",   low: "165.20달러",   high52: "227.30달러",    low52: "141.91달러",  logo: "https://assets.parqet.com/logos/symbol/AMD" },
  마이크로소프트: { ticker: "MSFT", name: "마이크로소프트", price: "420.72",   currency: "달러", change: "0.21",  changeAbs: "-0.88",  dir: "down", mktCap: "31,267.8억 달러", volume: "1,987.3만", high: "422.85달러",   low: "419.33달러",   high52: "468.35달러",    low52: "362.90달러",  logo: "https://assets.parqet.com/logos/symbol/MSFT" },
  MSFT:          { ticker: "MSFT", name: "마이크로소프트",  price: "420.72",   currency: "달러", change: "0.21",  changeAbs: "-0.88",  dir: "down", mktCap: "31,267.8억 달러", volume: "1,987.3만", high: "422.85달러",   low: "419.33달러",   high52: "468.35달러",    low52: "362.90달러",  logo: "https://assets.parqet.com/logos/symbol/MSFT" },
  아마존:        { ticker: "AMZN",  name: "아마존",        price: "186.67",   currency: "달러", change: "0.73",  changeAbs: "-1.37",  dir: "down", mktCap: "19,551.2억 달러", volume: "3,215.7만", high: "188.90달러",   low: "185.21달러",   high52: "224.46달러",    low52: "153.28달러",  logo: "https://assets.parqet.com/logos/symbol/AMZN" },
  AMZN:          { ticker: "AMZN",  name: "아마존",        price: "186.67",   currency: "달러", change: "0.73",  changeAbs: "-1.37",  dir: "down", mktCap: "19,551.2억 달러", volume: "3,215.7만", high: "188.90달러",   low: "185.21달러",   high52: "224.46달러",    low52: "153.28달러",  logo: "https://assets.parqet.com/logos/symbol/AMZN" },
  넷플릭스:      { ticker: "NFLX",  name: "넷플릭스",      price: "550.12",   currency: "달러", change: "1.24",  changeAbs: "+6.72",  dir: "up",   mktCap: "2,381.5억 달러",  volume: "2,134.2만", high: "553.40달러",   low: "545.80달러",   high52: "641.18달러",    low52: "394.85달러",  logo: "https://assets.parqet.com/logos/symbol/NFLX" },
  NFLX:          { ticker: "NFLX",  name: "넷플릭스",      price: "550.12",   currency: "달러", change: "1.24",  changeAbs: "+6.72",  dir: "up",   mktCap: "2,381.5억 달러",  volume: "2,134.2만", high: "553.40달러",   low: "545.80달러",   high52: "641.18달러",    low52: "394.85달러",  logo: "https://assets.parqet.com/logos/symbol/NFLX" },
  메타:          { ticker: "META",  name: "메타",          price: "512.33",   currency: "달러", change: "1.82",  changeAbs: "+9.18",  dir: "up",   mktCap: "13,042.8억 달러", volume: "2,843.1만", high: "514.90달러",   low: "508.72달러",   high52: "589.91달러",    low52: "367.29달러",  logo: "https://assets.parqet.com/logos/symbol/META" },
  META:          { ticker: "META",  name: "메타",          price: "512.33",   currency: "달러", change: "1.82",  changeAbs: "+9.18",  dir: "up",   mktCap: "13,042.8억 달러", volume: "2,843.1만", high: "514.90달러",   low: "508.72달러",   high52: "589.91달러",    low52: "367.29달러",  logo: "https://assets.parqet.com/logos/symbol/META" },
  구글:          { ticker: "GOOGL", name: "구글",          price: "176.45",   currency: "달러", change: "0.94",  changeAbs: "+1.64",  dir: "up",   mktCap: "21,580.3억 달러", volume: "2,198.4만", high: "178.22달러",   low: "175.10달러",   high52: "207.05달러",    low52: "155.00달러",  logo: "https://assets.parqet.com/logos/symbol/GOOGL" },
  GOOGL:         { ticker: "GOOGL", name: "구글",          price: "176.45",   currency: "달러", change: "0.94",  changeAbs: "+1.64",  dir: "up",   mktCap: "21,580.3억 달러", volume: "2,198.4만", high: "178.22달러",   low: "175.10달러",   high52: "207.05달러",    low52: "155.00달러",  logo: "https://assets.parqet.com/logos/symbol/GOOGL" },
  인텔:          { ticker: "INTC",  name: "인텔",          price: "133.99",   currency: "달러", change: "10.64", changeAbs: "+12.94", dir: "up",   mktCap: "5,760.1억 달러",  volume: "8,321.4만", high: "136.40달러",   low: "129.20달러",   high52: "51.28달러",     low52: "18.51달러",   logo: "https://assets.parqet.com/logos/symbol/INTC" },
  INTC:          { ticker: "INTC",  name: "인텔",          price: "133.99",   currency: "달러", change: "10.64", changeAbs: "+12.94", dir: "up",   mktCap: "5,760.1억 달러",  volume: "8,321.4만", high: "136.40달러",   low: "129.20달러",   high52: "51.28달러",     low52: "18.51달러",   logo: "https://assets.parqet.com/logos/symbol/INTC" },
  마이크론:      { ticker: "MU",    name: "마이크론",      price: "112.45",   currency: "달러", change: "8.70",  changeAbs: "+9.00",  dir: "up",   mktCap: "1,248.3억 달러",  volume: "3,412.7만", high: "114.80달러",   low: "108.30달러",   high52: "157.54달러",    low52: "67.63달러",   logo: "https://assets.parqet.com/logos/symbol/MU" },
  MU:            { ticker: "MU",    name: "마이크론",      price: "112.45",   currency: "달러", change: "8.70",  changeAbs: "+9.00",  dir: "up",   mktCap: "1,248.3억 달러",  volume: "3,412.7만", high: "114.80달러",   low: "108.30달러",   high52: "157.54달러",    low52: "67.63달러",   logo: "https://assets.parqet.com/logos/symbol/MU" },
  SPCX:          { ticker: "SPCX",  name: "SPCX",          price: "185.00",   currency: "달러", change: "3.56",  changeAbs: "-6.84",  dir: "down", mktCap: "-",               volume: "12.4만",    high: "190.20달러",   low: "183.50달러",   high52: "210.00달러",    low52: "155.00달러",  logo: "https://assets.parqet.com/logos/symbol/SPCX" },
  브로드컴:      { ticker: "AVGO",  name: "브로드컴",      price: "411.35",   currency: "달러", change: "4.70",  changeAbs: "+18.46", dir: "up",   mktCap: "19,321.4억 달러", volume: "1,823.5만", high: "415.80달러",   low: "403.20달러",   high52: "251.88달러",    low52: "117.40달러",  logo: "https://assets.parqet.com/logos/symbol/AVGO" },
  AVGO:          { ticker: "AVGO",  name: "브로드컴",      price: "411.35",   currency: "달러", change: "4.70",  changeAbs: "+18.46", dir: "up",   mktCap: "19,321.4억 달러", volume: "1,823.5만", high: "415.80달러",   low: "403.20달러",   high52: "251.88달러",    low52: "117.40달러",  logo: "https://assets.parqet.com/logos/symbol/AVGO" },
  TSMC:          { ticker: "TSM",   name: "TSMC",          price: "462.12",   currency: "달러", change: "6.94",  changeAbs: "+29.98", dir: "up",   mktCap: "23,940.8억 달러", volume: "2,134.6만", high: "468.30달러",   low: "450.10달러",   high52: "226.40달러",    low52: "127.58달러",  logo: "https://assets.parqet.com/logos/symbol/TSM" },
  TSM:           { ticker: "TSM",   name: "TSMC",          price: "462.12",   currency: "달러", change: "6.94",  changeAbs: "+29.98", dir: "up",   mktCap: "23,940.8억 달러", volume: "2,134.6만", high: "468.30달러",   low: "450.10달러",   high52: "226.40달러",    low52: "127.58달러",  logo: "https://assets.parqet.com/logos/symbol/TSM" },
  ASML:          { ticker: "ASML",  name: "ASML",          price: "1,929.68", currency: "달러", change: "3.31",  changeAbs: "+61.88", dir: "up",   mktCap: "7,621.3억 달러",  volume: "412.8만",   high: "1,945.00달러", low: "1,890.20달러", high52: "1,110.09달러",  low52: "628.00달러",  logo: "https://assets.parqet.com/logos/symbol/ASML" },
  퀄컴:          { ticker: "QCOM",  name: "퀄컴",          price: "226.11",   currency: "달러", change: "6.17",  changeAbs: "+13.12", dir: "up",   mktCap: "2,391.5억 달러",  volume: "2,341.2만", high: "229.40달러",   low: "219.80달러",   high52: "230.63달러",    low52: "143.97달러",  logo: "https://assets.parqet.com/logos/symbol/QCOM" },
  QCOM:          { ticker: "QCOM",  name: "퀄컴",          price: "226.11",   currency: "달러", change: "6.17",  changeAbs: "+13.12", dir: "up",   mktCap: "2,391.5억 달러",  volume: "2,341.2만", high: "229.40달러",   low: "219.80달러",   high52: "230.63달러",    low52: "143.97달러",  logo: "https://assets.parqet.com/logos/symbol/QCOM" },
  "어플라이드 머티리얼즈": { ticker: "AMAT", name: "어플라이드 머티리얼즈", price: "617.11", currency: "달러", change: "4.08", changeAbs: "+24.15", dir: "up", mktCap: "5,124.7억 달러", volume: "1,214.3만", high: "622.80달러", low: "601.40달러", high52: "255.89달러", low52: "134.20달러", logo: "https://assets.parqet.com/logos/symbol/AMAT" },
  AMAT:          { ticker: "AMAT",  name: "어플라이드 머티리얼즈", price: "617.11", currency: "달러", change: "4.08", changeAbs: "+24.15", dir: "up", mktCap: "5,124.7억 달러", volume: "1,214.3만", high: "622.80달러", low: "601.40달러", high52: "255.89달러", low52: "134.20달러", logo: "https://assets.parqet.com/logos/symbol/AMAT" },
  "램 리서치":   { ticker: "LRCX",  name: "램 리서치",     price: "389.04",   currency: "달러", change: "3.97",  changeAbs: "+14.86", dir: "up",   mktCap: "512.8억 달러",    volume: "823.4만",   high: "394.20달러",   low: "380.10달러",   high52: "116.94달러",    low52: "62.05달러",   logo: "https://assets.parqet.com/logos/symbol/LRCX" },
  LRCX:          { ticker: "LRCX",  name: "램 리서치",     price: "389.04",   currency: "달러", change: "3.97",  changeAbs: "+14.86", dir: "up",   mktCap: "512.8억 달러",    volume: "823.4만",   high: "394.20달러",   low: "380.10달러",   high52: "116.94달러",    low52: "62.05달러",   logo: "https://assets.parqet.com/logos/symbol/LRCX" },
  KLA:           { ticker: "KLAC",  name: "KLA",           price: "259.56",   currency: "달러", change: "8.73",  changeAbs: "+20.88", dir: "up",   mktCap: "365.2억 달러",    volume: "1,043.2만", high: "263.40달러",   low: "251.80달러",   high52: "107.62달러",    low52: "50.23달러",   logo: "https://assets.parqet.com/logos/symbol/KLAC" },
  KLAC:          { ticker: "KLAC",  name: "KLA",           price: "259.56",   currency: "달러", change: "8.73",  changeAbs: "+20.88", dir: "up",   mktCap: "365.2억 달러",    volume: "1,043.2만", high: "263.40달러",   low: "251.80달러",   high52: "107.62달러",    low52: "50.23달러",   logo: "https://assets.parqet.com/logos/symbol/KLAC" },
};

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function findSimilar(query) {
  const q = (query ?? "").toLowerCase().trim();
  if (!q) return null;
  const entries = Object.entries(stockDB);

  // 접두사 일치 ("테" → 테슬라, "넷플" → 넷플릭스)
  for (const [key, val] of entries)
    if (key.toLowerCase().startsWith(q)) return val;

  // 포함 관계
  for (const [key, val] of entries) {
    const k = key.toLowerCase();
    if (k.includes(q) || q.includes(k)) return val;
  }

  // 오타 보정: 레벤슈타인 거리 ≤ 2 (3자 이상 쿼리에만)
  if (q.length >= 3) {
    let best = null, bestDist = 3;
    for (const [key, val] of entries) {
      const dist = levenshtein(q, key.toLowerCase());
      if (dist < bestDist) { bestDist = dist; best = val; }
    }
    if (best) return best;
  }

  return null;
}

const TABS = ["1일", "5일", "1개월", "3개월", "1년", "5년"];

function formatUpdatedAt(isoString) {
  const d = new Date(isoString);
  const month = d.getMonth() + 1;
  const day   = d.getDate();
  const hour  = String(d.getHours()).padStart(2, "0");
  const min   = String(d.getMinutes()).padStart(2, "0");
  return `${month}월 ${day}일 ${hour}:${min}`;
}

function StockSummary() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query  = searchParams.get("q") || "";
  const ticker = resolveTicker(query);

  const exactMatch  = stockDB[query] ?? null;
  const similarMatch = exactMatch ? null : findSimilar(query);
  const dummy = exactMatch ?? similarMatch ?? null;

  const { watchlist, addToWatchlist, removeFromWatchlist, isLoggedIn } = useAuth();

  const [stock,      setStock]      = useState(dummy);
  const [chartPts,   setChartPts]   = useState(null);
  const [activeTab,  setActiveTab]  = useState("1일");
  const [toast,      setToast]      = useState("");

  const starred = stock ? watchlist.some(s => s.ticker === stock.ticker) : false;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const matched = stockDB[query] ?? findSimilar(query) ?? null;
    setStock(matched);
    setChartPts(null);
    const resolvedTicker = ticker ?? matched?.ticker ?? null;
    if (!matched || !resolvedTicker) return;

    const loadPrice = () => fetchStock(resolvedTicker).then((data) => {
      if (!data) return;
      const dir      = (data.price_change_rate ?? 0) >= 0 ? "up" : "down";
      const currency = data.currency === "KRW" ? "원" : "달러";
      const updatedAt = data.updated_at ? formatUpdatedAt(data.updated_at) : null;
      setStock((prev) => ({
        ...prev,
        logo:      data.logo_url ?? prev.logo,
        price:     data.current_price ? Number(data.current_price).toLocaleString() : prev.price,
        currency,
        change:    Math.abs(data.price_change_rate ?? 0).toFixed(2),
        changeAbs: data.price_change_amount != null
          ? `${data.price_change_amount >= 0 ? "+" : ""}${Number(data.price_change_amount).toFixed(2)}`
          : prev.changeAbs,
        dir,
        updatedAt,
      }));
    });

    const loadChart = () => fetchChart(resolvedTicker).then((pts) => {
      if (pts && pts.length >= 2) setChartPts(pts);
    });

    loadPrice();
    loadChart();
    const id = setInterval(() => { loadPrice(); loadChart(); }, 60000);
    return () => clearInterval(id);
  }, [query, ticker]);

  if (!stock) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 flex flex-col items-center text-center gap-4">
        <p className="text-5xl">🔍</p>
        <div>
          <p className="text-lg font-bold text-gray-800">
            "{query}" 종목을 찾을 수 없습니다
          </p>
          <p className="text-sm text-gray-400 mt-1">
            지원 종목: TSLA · NVDA · AAPL · MSFT · AMZN · GOOGL · META · AMD · PLTR · NFLX
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const isUp       = stock.dir === "up";
  const priceColor = isUp ? "text-red-500" : "text-blue-500";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 relative">
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg whitespace-nowrap animate-fade-in">
          {toast}
        </div>
      )}

      {similarMatch && !exactMatch && (
        <div className="mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-sm">
          <span className="text-amber-500">💡</span>
          <span className="text-amber-700">
            <span className="font-semibold">"{query}"</span> 검색 결과가 없어
            <span className="font-semibold"> {stock.name}({stock.ticker})</span> 정보를 표시합니다.
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-5">
        <LogoImg src={stock.logo} name={stock.name} size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{stock.name}</h2>
            <span className="text-gray-400 text-base font-medium">({stock.ticker})</span>
            <button
              onClick={() => {
                if (!isLoggedIn) { setToast("로그인 후 이용할 수 있습니다."); return; }
                if (starred) {
                  removeFromWatchlist(stock.name);
                  setToast(`${stock.name}을(를) 관심 종목에서 제거했습니다.`);
                } else {
                  addToWatchlist({
                    name:   stock.name,
                    ticker: stock.ticker,
                    logo:   stock.logo,
                    price:  `${stock.price}${stock.currency}`,
                    change: `${stock.change}%`,
                    dir:    stock.dir,
                  });
                  setToast(`${stock.name}을(를) 관심 종목에 추가했습니다.`);
                }
              }}
              className={`text-xl transition ${starred ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
              title={starred ? "관심 종목 해제" : "관심 종목 추가"}
            >
              {starred ? "★" : "☆"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">실시간 주가 및 핫한 트윗</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold text-gray-900 tracking-tight">{stock.price}</span>
          <span className="text-xl text-gray-400 mb-1">{stock.currency}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-base font-bold ${priceColor}`}>
            {isUp ? "▲" : "▼"} {stock.change}%
          </span>
          <span className={`text-base font-semibold ${priceColor}`}>
            {stock.changeAbs}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {stock.updatedAt ? `${stock.updatedAt} 기준` : "5월 18일 10:30 기준"} (미 동부시간)
        </p>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-4 border-t border-b border-gray-100 py-5 mb-5">
        {[
          { label: "시가총액",  value: stock.mktCap  ?? "-" },
          { label: "거래량",    value: stock.volume  ?? "-" },
          { label: "오늘 고가", value: stock.high    ?? "-" },
          { label: "오늘 저가", value: stock.low     ?? "-" },
          { label: "52주 최고", value: stock.high52  ?? "-" },
          { label: "52주 최저", value: stock.low52   ?? "-" },
        ].map(item => (
          <div key={item.label}>
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className="text-sm font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <SearchChart dir={stock.dir} points={chartPts} />
    </div>
  );
}

export default StockSummary;
