import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import LogoImg from "../components/common/LogoImg";
import { fetchTrending } from "../api/stocks";

const TIME_OPTIONS = [
  { key: "now",  label: "현재"     },
  { key: "1h",   label: "1시간 전" },
  { key: "3h",   label: "3시간 전" },
  { key: "5h",   label: "5시간 전" },
  { key: "12h",  label: "12시간 전"},
  { key: "24h",  label: "24시간 전"},
];

// 시간대별 더미 스냅샷 (현재 대비 순위/트윗량 변화 시뮬레이션)
const SNAPSHOTS = {
  "1h": [
    { rank:1,  name:"테슬라",        ticker:"TSLA",  tweets:"22,403", tweetChange:"18.2%", tweetDir:"up",   price:"180.22달러",   priceChange:"2.11%", priceDir:"up",   logo:"https://logo.clearbit.com/tesla.com" },
    { rank:2,  name:"엔비디아",      ticker:"NVDA",  tweets:"17,540", tweetChange:"9.8%",  tweetDir:"up",   price:"1,030.45달러", priceChange:"0.88%", priceDir:"down", logo:"https://logo.clearbit.com/nvidia.com" },
    { rank:3,  name:"팔란티어",      ticker:"PLTR",  tweets:"11,820", tweetChange:"38.4%", tweetDir:"up",   price:"22.91달러",    priceChange:"3.74%", priceDir:"up",   logo:"https://logo.clearbit.com/palantir.com" },
    { rank:4,  name:"AMD",           ticker:"AMD",   tweets:"9,215",  tweetChange:"11.3%", tweetDir:"up",   price:"165.80달러",   priceChange:"0.97%", priceDir:"up",   logo:"https://logo.clearbit.com/amd.com" },
    { rank:5,  name:"메타",          ticker:"META",  tweets:"8,901",  tweetChange:"22.5%", tweetDir:"up",   price:"509.17달러",   priceChange:"1.52%", priceDir:"up",   logo:"https://logo.clearbit.com/meta.com" },
    { rank:6,  name:"마이크로소프트", ticker:"MSFT", tweets:"8,744",  tweetChange:"2.1%",  tweetDir:"down", price:"421.10달러",   priceChange:"0.18%", priceDir:"down", logo:"https://logo.clearbit.com/microsoft.com" },
    { rank:7,  name:"애플",          ticker:"AAPL",  tweets:"7,982",  tweetChange:"4.3%",  tweetDir:"down", price:"193.00달러",   priceChange:"0.41%", priceDir:"down", logo:"https://logo.clearbit.com/apple.com" },
    { rank:8,  name:"구글",          ticker:"GOOGL", tweets:"4,890",  tweetChange:"6.1%",  tweetDir:"up",   price:"175.80달러",   priceChange:"0.71%", priceDir:"up",   logo:"https://logo.clearbit.com/google.com" },
    { rank:9,  name:"넷플릭스",      ticker:"NFLX",  tweets:"4,312",  tweetChange:"4.8%",  tweetDir:"up",   price:"548.60달러",   priceChange:"0.98%", priceDir:"up",   logo:"https://logo.clearbit.com/netflix.com" },
    { rank:10, name:"아마존",        ticker:"AMZN",  tweets:"4,301",  tweetChange:"1.8%",  tweetDir:"down", price:"185.90달러",   priceChange:"0.62%", priceDir:"down", logo:"https://logo.clearbit.com/amazon.com" },
  ],
  "3h": [
    { rank:1,  name:"엔비디아",      ticker:"NVDA",  tweets:"20,104", tweetChange:"25.3%", tweetDir:"up",   price:"1,025.30달러", priceChange:"1.45%", priceDir:"up",   logo:"https://logo.clearbit.com/nvidia.com" },
    { rank:2,  name:"테슬라",        ticker:"TSLA",  tweets:"19,872", tweetChange:"14.6%", tweetDir:"up",   price:"178.55달러",   priceChange:"1.82%", priceDir:"up",   logo:"https://logo.clearbit.com/tesla.com" },
    { rank:3,  name:"팔란티어",      ticker:"PLTR",  tweets:"10,930", tweetChange:"29.1%", tweetDir:"up",   price:"22.14달러",    priceChange:"3.02%", priceDir:"up",   logo:"https://logo.clearbit.com/palantir.com" },
    { rank:4,  name:"마이크로소프트", ticker:"MSFT", tweets:"9,550",  tweetChange:"5.4%",  tweetDir:"up",   price:"422.44달러",   priceChange:"0.35%", priceDir:"up",   logo:"https://logo.clearbit.com/microsoft.com" },
    { rank:5,  name:"애플",          ticker:"AAPL",  tweets:"8,820",  tweetChange:"7.8%",  tweetDir:"up",   price:"194.20달러",   priceChange:"0.85%", priceDir:"up",   logo:"https://logo.clearbit.com/apple.com" },
    { rank:6,  name:"AMD",           ticker:"AMD",   tweets:"8,600",  tweetChange:"8.2%",  tweetDir:"up",   price:"164.50달러",   priceChange:"0.61%", priceDir:"up",   logo:"https://logo.clearbit.com/amd.com" },
    { rank:7,  name:"메타",          ticker:"META",  tweets:"7,210",  tweetChange:"15.7%", tweetDir:"up",   price:"506.80달러",   priceChange:"1.10%", priceDir:"up",   logo:"https://logo.clearbit.com/meta.com" },
    { rank:8,  name:"넷플릭스",      ticker:"NFLX",  tweets:"5,120",  tweetChange:"6.3%",  tweetDir:"up",   price:"547.40달러",   priceChange:"0.72%", priceDir:"up",   logo:"https://logo.clearbit.com/netflix.com" },
    { rank:9,  name:"구글",          ticker:"GOOGL", tweets:"4,710",  tweetChange:"4.5%",  tweetDir:"up",   price:"175.10달러",   priceChange:"0.58%", priceDir:"up",   logo:"https://logo.clearbit.com/google.com" },
    { rank:10, name:"아마존",        ticker:"AMZN",  tweets:"4,120",  tweetChange:"1.3%",  tweetDir:"down", price:"185.20달러",   priceChange:"0.48%", priceDir:"down", logo:"https://logo.clearbit.com/amazon.com" },
  ],
  "5h": [
    { rank:1,  name:"테슬라",        ticker:"TSLA",  tweets:"17,650", tweetChange:"10.3%", tweetDir:"up",   price:"177.30달러",   priceChange:"1.20%", priceDir:"up",   logo:"https://logo.clearbit.com/tesla.com" },
    { rank:2,  name:"엔비디아",      ticker:"NVDA",  tweets:"16,890", tweetChange:"8.4%",  tweetDir:"up",   price:"1,018.70달러", priceChange:"0.92%", priceDir:"up",   logo:"https://logo.clearbit.com/nvidia.com" },
    { rank:3,  name:"마이크로소프트", ticker:"MSFT", tweets:"11,240", tweetChange:"9.1%",  tweetDir:"up",   price:"423.10달러",   priceChange:"0.42%", priceDir:"up",   logo:"https://logo.clearbit.com/microsoft.com" },
    { rank:4,  name:"애플",          ticker:"AAPL",  tweets:"9,640",  tweetChange:"11.2%", tweetDir:"up",   price:"195.10달러",   priceChange:"1.02%", priceDir:"up",   logo:"https://logo.clearbit.com/apple.com" },
    { rank:5,  name:"팔란티어",      ticker:"PLTR",  tweets:"9,210",  tweetChange:"21.5%", tweetDir:"up",   price:"21.50달러",    priceChange:"2.41%", priceDir:"up",   logo:"https://logo.clearbit.com/palantir.com" },
    { rank:6,  name:"AMD",           ticker:"AMD",   tweets:"8,120",  tweetChange:"5.8%",  tweetDir:"up",   price:"163.30달러",   priceChange:"0.48%", priceDir:"up",   logo:"https://logo.clearbit.com/amd.com" },
    { rank:7,  name:"메타",          ticker:"META",  tweets:"6,980",  tweetChange:"10.4%", tweetDir:"up",   price:"504.60달러",   priceChange:"0.78%", priceDir:"up",   logo:"https://logo.clearbit.com/meta.com" },
    { rank:8,  name:"구글",          ticker:"GOOGL", tweets:"4,520",  tweetChange:"3.2%",  tweetDir:"up",   price:"174.50달러",   priceChange:"0.42%", priceDir:"up",   logo:"https://logo.clearbit.com/google.com" },
    { rank:9,  name:"넷플릭스",      ticker:"NFLX",  tweets:"4,210",  tweetChange:"5.1%",  tweetDir:"up",   price:"546.80달러",   priceChange:"0.62%", priceDir:"up",   logo:"https://logo.clearbit.com/netflix.com" },
    { rank:10, name:"아마존",        ticker:"AMZN",  tweets:"3,890",  tweetChange:"1.9%",  tweetDir:"down", price:"184.70달러",   priceChange:"0.34%", priceDir:"down", logo:"https://logo.clearbit.com/amazon.com" },
  ],
  "12h": [
    { rank:1,  name:"애플",          ticker:"AAPL",  tweets:"15,220", tweetChange:"18.9%", tweetDir:"up",   price:"196.80달러",   priceChange:"1.54%", priceDir:"up",   logo:"https://logo.clearbit.com/apple.com" },
    { rank:2,  name:"테슬라",        ticker:"TSLA",  tweets:"14,800", tweetChange:"7.2%",  tweetDir:"up",   price:"175.90달러",   priceChange:"0.88%", priceDir:"up",   logo:"https://logo.clearbit.com/tesla.com" },
    { rank:3,  name:"엔비디아",      ticker:"NVDA",  tweets:"13,540", tweetChange:"5.1%",  tweetDir:"up",   price:"1,010.20달러", priceChange:"0.54%", priceDir:"up",   logo:"https://logo.clearbit.com/nvidia.com" },
    { rank:4,  name:"마이크로소프트", ticker:"MSFT", tweets:"10,890", tweetChange:"6.4%",  tweetDir:"up",   price:"424.50달러",   priceChange:"0.61%", priceDir:"up",   logo:"https://logo.clearbit.com/microsoft.com" },
    { rank:5,  name:"구글",          ticker:"GOOGL", tweets:"7,650",  tweetChange:"12.3%", tweetDir:"up",   price:"173.90달러",   priceChange:"0.98%", priceDir:"up",   logo:"https://logo.clearbit.com/google.com" },
    { rank:6,  name:"메타",          ticker:"META",  tweets:"6,410",  tweetChange:"7.8%",  tweetDir:"up",   price:"502.40달러",   priceChange:"0.52%", priceDir:"up",   logo:"https://logo.clearbit.com/meta.com" },
    { rank:7,  name:"팔란티어",      ticker:"PLTR",  tweets:"6,080",  tweetChange:"14.2%", tweetDir:"up",   price:"20.80달러",    priceChange:"1.92%", priceDir:"up",   logo:"https://logo.clearbit.com/palantir.com" },
    { rank:8,  name:"AMD",           ticker:"AMD",   tweets:"5,940",  tweetChange:"3.5%",  tweetDir:"up",   price:"162.10달러",   priceChange:"0.32%", priceDir:"up",   logo:"https://logo.clearbit.com/amd.com" },
    { rank:9,  name:"아마존",        ticker:"AMZN",  tweets:"5,620",  tweetChange:"5.8%",  tweetDir:"up",   price:"184.10달러",   priceChange:"0.38%", priceDir:"up",   logo:"https://logo.clearbit.com/amazon.com" },
    { rank:10, name:"넷플릭스",      ticker:"NFLX",  tweets:"3,840",  tweetChange:"3.6%",  tweetDir:"up",   price:"544.20달러",   priceChange:"0.44%", priceDir:"up",   logo:"https://logo.clearbit.com/netflix.com" },
  ],
  "24h": [
    { rank:1,  name:"애플",          ticker:"AAPL",  tweets:"12,890", tweetChange:"15.2%", tweetDir:"up",   price:"198.40달러",   priceChange:"2.10%", priceDir:"up",   logo:"https://logo.clearbit.com/apple.com" },
    { rank:2,  name:"마이크로소프트", ticker:"MSFT", tweets:"12,350", tweetChange:"8.9%",  tweetDir:"up",   price:"426.30달러",   priceChange:"0.82%", priceDir:"up",   logo:"https://logo.clearbit.com/microsoft.com" },
    { rank:3,  name:"테슬라",        ticker:"TSLA",  tweets:"11,240", tweetChange:"5.6%",  tweetDir:"up",   price:"174.20달러",   priceChange:"0.55%", priceDir:"up",   logo:"https://logo.clearbit.com/tesla.com" },
    { rank:4,  name:"엔비디아",      ticker:"NVDA",  tweets:"10,820", tweetChange:"4.2%",  tweetDir:"up",   price:"1,002.80달러", priceChange:"0.38%", priceDir:"up",   logo:"https://logo.clearbit.com/nvidia.com" },
    { rank:5,  name:"구글",          ticker:"GOOGL", tweets:"8,940",  tweetChange:"16.4%", tweetDir:"up",   price:"172.30달러",   priceChange:"1.24%", priceDir:"up",   logo:"https://logo.clearbit.com/google.com" },
    { rank:6,  name:"아마존",        ticker:"AMZN",  tweets:"7,130",  tweetChange:"9.7%",  tweetDir:"up",   price:"182.60달러",   priceChange:"0.74%", priceDir:"up",   logo:"https://logo.clearbit.com/amazon.com" },
    { rank:7,  name:"메타",          ticker:"META",  tweets:"5,980",  tweetChange:"6.3%",  tweetDir:"up",   price:"499.80달러",   priceChange:"0.34%", priceDir:"up",   logo:"https://logo.clearbit.com/meta.com" },
    { rank:8,  name:"AMD",           ticker:"AMD",   tweets:"5,120",  tweetChange:"2.8%",  tweetDir:"up",   price:"160.50달러",   priceChange:"0.22%", priceDir:"up",   logo:"https://logo.clearbit.com/amd.com" },
    { rank:9,  name:"넷플릭스",      ticker:"NFLX",  tweets:"3,980",  tweetChange:"4.2%",  tweetDir:"up",   price:"542.10달러",   priceChange:"0.56%", priceDir:"up",   logo:"https://logo.clearbit.com/netflix.com" },
    { rank:10, name:"팔란티어",      ticker:"PLTR",  tweets:"4,510",  tweetChange:"10.8%", tweetDir:"up",   price:"20.10달러",    priceChange:"1.34%", priceDir:"up",   logo:"https://logo.clearbit.com/palantir.com" },
  ],
};

const RANK_MEDAL = ["🥇", "🥈", "🥉"];

export default function TweetTrending() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("now");
  const [liveStocks, setLiveStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending()
      .then(setLiveStocks)
      .finally(() => setLoading(false));
  }, []);

  const stocks = period === "now" ? liveStocks : SNAPSHOTS[period];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

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
          <h1 className="text-2xl font-bold text-gray-900">💬 실시간 트윗량 많은 주식</h1>
          <p className="text-sm text-gray-400 mt-1">
            시간대별 X(트위터) 언급량 기준 상위 종목을 확인하세요.
          </p>
        </div>

        {/* 시간대 선택 */}
        <div className="flex gap-2 flex-wrap">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setPeriod(opt.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition
                ${period === opt.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {loading && period === "now" ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-left">
                  <th className="pb-3 pr-4 font-medium">순위</th>
                  <th className="pb-3 pr-4 font-medium">종목</th>
                  <th className="pb-3 pr-4 font-medium">트윗량</th>
                  <th className="pb-3 pr-4 font-medium">1시간 변화</th>
                  <th className="pb-3 pr-4 font-medium">주가</th>
                  <th className="pb-3 font-medium">주가 등락</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((s, idx) => (
                  <tr
                    key={s.ticker}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(s.ticker)}`)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="py-4 pr-4">
                      {idx < 3
                        ? <span className="text-xl">{RANK_MEDAL[idx]}</span>
                        : <span className="text-gray-400 font-medium">{s.rank}</span>
                      }
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <LogoImg src={s.logo} name={s.name} />
                        <div>
                          <p className="font-semibold text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.ticker}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-medium text-gray-800">{s.tweets}</td>
                    <td className="py-4 pr-4">
                      <span className={`font-semibold ${s.tweetDir === "up" ? "text-red-500" : "text-blue-500"}`}>
                        {s.tweetDir === "up" ? "▲" : "▼"} {s.tweetChange}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-gray-800">{s.price}</td>
                    <td className="py-4">
                      <span className={`font-semibold ${s.priceDir === "up" ? "text-red-500" : "text-blue-500"}`}>
                        {s.priceDir === "up" ? "▲" : "▼"} {s.priceChange}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
            <p>* 트윗량은 {period === "now" ? "최근 1시간" : TIME_OPTIONS.find(t => t.key === period)?.label} 기준이며, 5분마다 업데이트됩니다.</p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
