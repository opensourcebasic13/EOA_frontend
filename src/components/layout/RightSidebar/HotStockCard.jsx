import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTrending } from "../../../api/stocks";

function HotStockCard() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchTrending().then(data => {
      const hot = data
        .filter(s => s.priceDir === "up")
        .sort((a, b) => parseFloat(b.priceChange) - parseFloat(a.priceChange))
        .slice(0, 3);
      setStocks(hot.length > 0 ? hot : data.slice(0, 3));
    });
  }, []);

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

      {stocks.length === 0 ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {stocks.map((s) => (
            <div
              key={s.ticker}
              onClick={() => navigate(`/search?q=${encodeURIComponent(s.ticker)}`)}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-lg px-1 transition"
            >
              <div>
                <p className="font-bold text-gray-900 text-sm">{s.ticker}</p>
                <p className="text-xs text-gray-400">{s.name}</p>
              </div>
              <span className={`font-semibold text-sm ${s.priceDir === "up" ? "text-red-500" : "text-blue-500"}`}>
                {s.priceDir === "up" ? "▲" : "▼"} {s.priceChange}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HotStockCard;