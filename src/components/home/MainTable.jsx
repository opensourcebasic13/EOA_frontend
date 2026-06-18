import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoImg from "../common/LogoImg";
import { fetchTrending } from "../../api/stocks";


function MainTable() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending()
      .then(setStocks)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 min-w-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">실시간 트윗량 많은 주식</h2>
            <span className="text-gray-400 text-sm cursor-pointer">ℹ</span>
          </div>
          <button
            onClick={() => navigate("/tweet-trending")}
            className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
          >
            더보기 →
          </button>
        </div>

        {loading ? (
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
              {stocks.map((s) => (
                <tr
                  key={s.rank}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(s.ticker)}`)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="py-4 pr-4 text-gray-500 font-medium">{s.rank}</td>
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
          <p>* 트윗량은 최근 1시간 기준이며, 5분마다 업데이트됩니다.</p>
        </div>
      </div>
    </main>
  );
}

export default MainTable;
