import { useNavigate } from "react-router-dom";

const hotStocks = [
  { ticker: "NVDA", name: "엔비디아", change: "12.8%", dir: "up" },
  { ticker: "TSLA", name: "테슬라", change: "8.9%", dir: "up" },
  { ticker: "PLTR", name: "팔란티어", change: "45.6%", dir: "up" },
];

function HotStockCard() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span>🔥</span>
                <h3 className="font-bold text-gray-900">핫한 종목 발견</h3>
              </div>
              <button
                onClick={() => navigate("/hot")}
                className="text-xs text-blue-500 hover:text-blue-700 font-semibold transition"
              >
                더보기 →
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">상승 트렌드 빠르게 포착</p>
            <div className="space-y-3">
              {hotStocks.map((s) => (
                <div
                  key={s.ticker}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(s.name)}`)}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-1 transition"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{s.ticker}</p>
                    <p className="text-xs text-gray-400">{s.name}</p>
                  </div>
                  <span className="text-red-500 font-semibold text-sm">▲ {s.change}</span>
                </div>
              ))}
            </div>
          </div>
  );
}

export default HotStockCard;