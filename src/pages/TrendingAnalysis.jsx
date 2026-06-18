import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import LogoImg from "../components/common/LogoImg";
import { fetchTrending } from "../api/stocks";
import { fetchAnalysis } from "../api/analysis";

const TIME_OPTIONS = ["1H", "3H", "5H", "12H", "24H"];

const TREND_DATA = {
  "1H":  { TSLA: [30, 45, 40, 55, 50, 60, 58, 70], NVDA: [20, 32, 28, 44, 40, 50, 47, 60], PLTR: [10, 20, 17, 28, 23, 35, 31, 43] },
  "3H":  { TSLA: [20, 30, 45, 36, 50, 43, 55, 65], NVDA: [25, 30, 27, 40, 36, 48, 45, 56], PLTR: [15, 18, 26, 20, 32, 28, 38, 46] },
  "5H":  { TSLA: [18, 28, 38, 32, 46, 40, 52, 62], NVDA: [22, 28, 24, 38, 32, 45, 42, 54], PLTR: [12, 16, 24, 18, 30, 26, 36, 44] },
  "12H": { TSLA: [15, 26, 36, 50, 42, 56, 61, 75], NVDA: [20, 28, 38, 36, 45, 52, 50, 63], PLTR: [8, 15, 22, 30, 26, 38, 36, 48] },
  "24H": { TSLA: [10, 22, 38, 52, 46, 60, 65, 80], NVDA: [15, 26, 32, 46, 38, 52, 56, 68], PLTR: [5, 12, 21, 35, 28, 42, 38, 53] },
};

const STOCK_COLORS = {
  TSLA: "#6366f1",
  NVDA: "#f472b6",
  PLTR: "#fb923c",
};

const SENTIMENT_MAP = {
  TSLA:  { positive: 68, neutral: 22, negative: 10 },
  NVDA:  { positive: 62, neutral: 25, negative: 13 },
  PLTR:  { positive: 71, neutral: 18, negative: 11 },
  AMD:   { positive: 55, neutral: 30, negative: 15 },
  MSFT:  { positive: 70, neutral: 22, negative: 8  },
  AAPL:  { positive: 65, neutral: 28, negative: 7  },
  AMZN:  { positive: 60, neutral: 28, negative: 12 },
  META:  { positive: 66, neutral: 24, negative: 10 },
  GOOGL: { positive: 63, neutral: 27, negative: 10 },
  NFLX:  { positive: 58, neutral: 28, negative: 14 },
};

function parseTweetCount(str) {
  if (!str || str === "-") return 0;
  return parseInt(str.replace(/,/g, ""), 10) || 0;
}

function TrendLineChart({ period }) {
  const data = TREND_DATA[period];
  const w = 560, h = 140;
  const tickers = ["TSLA", "NVDA", "PLTR"];
  const allValues = Object.values(data).flat();
  const maxVal = Math.max(...allValues);
  const minVal = Math.min(...allValues);

  const toXY = (arr) =>
    arr.map((p, i) => ({
      x: (i / (arr.length - 1)) * (w - 20) + 10,
      y: h - 10 - ((p - minVal) / (maxVal - minVal)) * (h - 24),
    }));

  const makePath = (pts) =>
    pts.map(({ x, y }, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

  const timeLabels = period === "1H"  ? ["0분", "10분", "20분", "30분", "40분", "50분", "60분전", "현재"]
    : period === "3H"  ? ["3H", "2.5H", "2H", "1.5H", "1H", "45분", "30분", "현재"]
    : period === "5H"  ? ["5H", "4H", "3.5H", "3H", "2H", "1.5H", "1H", "현재"]
    : period === "12H" ? ["12H", "10H", "8H", "6H", "4H", "3H", "1H", "현재"]
    : ["24H", "20H", "16H", "12H", "8H", "5H", "2H", "현재"];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h + 24}`} className="w-full" style={{ minWidth: 320 }} preserveAspectRatio="xMidYMid meet">
        {tickers.map((ticker) => {
          const pts = toXY(data[ticker]);
          return (
            <path
              key={ticker}
              d={makePath(pts)}
              fill="none"
              stroke={STOCK_COLORS[ticker]}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
        {/* 마지막 점 강조 */}
        {tickers.map((ticker) => {
          const pts = toXY(data[ticker]);
          const last = pts[pts.length - 1];
          return (
            <circle key={ticker + "_dot"} cx={last.x} cy={last.y} r="4"
              fill={STOCK_COLORS[ticker]} />
          );
        })}
        {/* X축 시간 라벨 */}
        {[0, 3, 7].map((idx) => {
          const x = (idx / 7) * (w - 20) + 10;
          return (
            <text key={idx} x={x} y={h + 18} textAnchor="middle"
              fontSize="10" fill="#9ca3af">
              {timeLabels[idx]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function TrendingAnalysis() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("1H");
  const [sentimentMap, setSentimentMap] = useState(SENTIMENT_MAP);

  useEffect(() => {
    fetchTrending().then(data => {
      setStocks(data);
      setLoading(false);
      const tickers = data.slice(0, 8).map(s => s.ticker);
      Promise.all(tickers.map(t => fetchAnalysis(t))).then(results => {
        const map = {};
        tickers.forEach((t, i) => {
          if (results[i]) map[t] = results[i].sentiment_scores;
        });
        if (Object.keys(map).length > 0)
          setSentimentMap(prev => ({ ...prev, ...map }));
      });
    });
  }, []);

  const maxTweets = Math.max(...stocks.map((s) => parseTweetCount(s.tweets)), 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📊 실시간 트렌드 분석</h1>
            <p className="text-sm text-gray-400 mt-1">
              종목별 X 관심도 트렌드와 트윗량 변화를 한눈에 확인하세요.
            </p>
          </div>
          {/* 시간대 선택 */}
          <div className="flex gap-1 mt-1">
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setPeriod(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition
                  ${period === t
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 트렌드 라인 차트 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900">종목 관심도 추이</h2>
            <span className="text-xs text-gray-400">X 트윗 기반 · {period} 단위</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">X 언급량 기반 투자 관심도 지수</p>

          <TrendLineChart period={period} />

          <div className="flex items-center gap-5 mt-3">
            {["TSLA", "NVDA", "PLTR"].map((ticker) => (
              <span key={ticker} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="w-4 h-0.5 inline-block rounded"
                  style={{ backgroundColor: STOCK_COLORS[ticker] }}
                />
                {ticker}
              </span>
            ))}
          </div>
        </div>

        {/* 트윗량 바 차트 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-1">종목별 트윗량</h2>
          <p className="text-xs text-gray-400 mb-4">최근 1시간 기준 · 실시간 업데이트</p>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {stocks.slice(0, 8).map((s) => {
                const count = parseTweetCount(s.tweets);
                const pct = (count / maxTweets) * 100;
                return (
                  <div key={s.ticker} className="flex items-center gap-3">
                    <div className="w-24 shrink-0 flex items-center gap-2">
                      <LogoImg src={s.logo} name={s.name} size="sm" />
                      <span className="text-xs font-semibold text-gray-700 truncate">{s.ticker}</span>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: STOCK_COLORS[s.ticker] ?? "#6366f1" }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-16 text-right shrink-0">
                      {s.tweets}
                    </span>
                    <span className={`text-xs font-semibold w-14 text-right shrink-0
                      ${s.tweetDir === "up" ? "text-red-500" : "text-blue-500"}`}>
                      {s.tweetDir === "up" ? "▲" : "▼"} {s.tweetChange}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 감성 분석 현황 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 mb-1">투자 유형 분석</h2>
          <p className="text-xs text-gray-400 mb-4">X 반응 기반 투자자 유형 분류</p>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stocks.slice(0, 8).map((s) => {
                const sent = sentimentMap[s.ticker] ?? { positive: 50, neutral: 30, negative: 20 };
                return (
                  <div key={s.ticker}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-800">{s.name}</span>
                        <span className="text-xs text-gray-400">{s.ticker}</span>
                      </div>
                      <span className="text-xs font-semibold text-green-600">
                        긍정 {sent.positive}%
                      </span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden gap-px">
                      <div className="bg-green-400 transition-all" style={{ width: `${sent.positive}%` }} />
                      <div className="bg-gray-300 transition-all" style={{ width: `${sent.neutral}%` }} />
                      <div className="bg-red-400 transition-all" style={{ width: `${sent.negative}%` }} />
                    </div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-[10px] text-green-500">긍정 {sent.positive}%</span>
                      <span className="text-[10px] text-gray-400">중립 {sent.neutral}%</span>
                      <span className="text-[10px] text-red-400">부정 {sent.negative}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </div>
  );
}
