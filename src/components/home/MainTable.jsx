import { useNavigate } from "react-router-dom";
import LogoImg from "../common/LogoImg";

const trendingStocks = [
  { rank: 1,  name: "테슬라",       ticker: "TSLA",       tweets: "24,851", tweetChange: "23.4%", tweetDir: "up",   price: "181.06달러",   priceChange: "2.57%", priceDir: "up",   logo: "https://logo.clearbit.com/tesla.com" },
  { rank: 2,  name: "엔비디아",     ticker: "NVDA",       tweets: "18,932", tweetChange: "12.8%", tweetDir: "up",   price: "1,037.89달러", priceChange: "1.12%", priceDir: "down", logo: "https://logo.clearbit.com/nvidia.com" },
  { rank: 3,  name: "팔란티어",     ticker: "PLTR",       tweets: "12,309", tweetChange: "45.6%", tweetDir: "up",   price: "23.48달러",    priceChange: "4.18%", priceDir: "up",   logo: "https://logo.clearbit.com/palantir.com" },
  { rank: 4,  name: "AMD",          ticker: "AMD",        tweets: "9,842",  tweetChange: "15.7%", tweetDir: "up",   price: "167.18달러",   priceChange: "1.35%", priceDir: "up",   logo: "https://logo.clearbit.com/amd.com" },
  { rank: 5,  name: "마이크로소프트", ticker: "MSFT",       tweets: "9,102",  tweetChange: "3.6%",  tweetDir: "down", price: "420.72달러",   priceChange: "0.21%", priceDir: "down", logo: "https://logo.clearbit.com/microsoft.com" },
  { rank: 6,  name: "애플",         ticker: "AAPL",       tweets: "8,245",  tweetChange: "5.2%",  tweetDir: "down", price: "192.58달러",   priceChange: "0.53%", priceDir: "down", logo: "https://logo.clearbit.com/apple.com" },
  { rank: 7,  name: "삼성전자",     ticker: "005930.KS",  tweets: "6,723",  tweetChange: "8.9%",  tweetDir: "up",   price: "77,500원",     priceChange: "0.64%", priceDir: "down", logo: "https://logo.clearbit.com/samsung.com" },
  { rank: 8,  name: "SK하이닉스",   ticker: "000660.KS",  tweets: "5,876",  tweetChange: "10.1%", tweetDir: "up",   price: "194,000원",    priceChange: "1.36%", priceDir: "up",   logo: "https://logo.clearbit.com/skhynix.com" },
  { rank: 9,  name: "코인베이스",   ticker: "COIN",       tweets: "4,912",  tweetChange: "6.7%",  tweetDir: "up",   price: "233.41달러",   priceChange: "0.98%", priceDir: "up",   logo: "https://logo.clearbit.com/coinbase.com" },
  { rank: 10, name: "아마존",       ticker: "AMZN",       tweets: "4,521",  tweetChange: "2.1%",  tweetDir: "down", price: "186.67달러",   priceChange: "0.73%", priceDir: "down", logo: "https://logo.clearbit.com/amazon.com" },
];

function MainTable() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 min-w-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">실시간 트윗량 많은 주식</h2>
            <span className="text-gray-400 text-sm cursor-pointer">ℹ</span>
          </div>
          <button className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
            더보기 →
          </button>
        </div>

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
            {trendingStocks.map((s) => (
              <tr
                key={s.rank}
                onClick={() => navigate(`/search?q=${encodeURIComponent(s.name)}`)}
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

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
          <p>* 트윗량은 최근 1시간 기준이며, 5분마다 업데이트됩니다.</p>
          <p>↺ 마지막 업데이트: 2026.05.28 10:30</p>
        </div>
      </div>
    </main>
  );
}

export default MainTable;
