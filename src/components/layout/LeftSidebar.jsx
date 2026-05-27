import { useNavigate, useSearchParams } from "react-router-dom";
import LogoImg from "../common/LogoImg";
import { useAuth } from "../../context/AuthContext";

function LeftSidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { watchlist } = useAuth();

  const activeQuery = searchParams.get("q") ?? "";
  const isActive = (s) => activeQuery === s.name || activeQuery === s.ticker;

  return (
    <aside className="w-52 shrink-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">관심 주식</h2>

        {watchlist.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            관심 종목이 없습니다.<br />
            <span
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => navigate("/watchlist")}
            >
              + 종목 추가하기
            </span>
          </p>
        ) : (
          <div className="space-y-1">
            {watchlist.map((s) => (
              <div
                key={s.name}
                onClick={() => navigate(`/search?q=${encodeURIComponent(s.name)}`)}
                className={`flex items-center gap-3 px-2 py-2.5 rounded-xl cursor-pointer transition
                  ${isActive(s)
                    ? "bg-blue-50 border-l-[3px] border-blue-500 pl-[5px]"
                    : "hover:bg-gray-50 border-l-[3px] border-transparent pl-[5px]"
                  }`}
              >
                <LogoImg src={s.logo} name={s.name} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive(s) ? "text-blue-700" : "text-gray-900"}`}>
                    {s.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{s.price}</p>
                </div>
                <span className={`text-xs font-semibold shrink-0 ${s.dir === "up" ? "text-red-500" : "text-blue-500"}`}>
                  {s.dir === "up" ? "▲" : "▼"} {s.change}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/watchlist")}
          className="mt-4 w-full text-blue-600 text-sm font-semibold hover:underline flex items-center justify-center gap-1 transition"
        >
          ★ 관심 종목 관리
        </button>
      </div>
    </aside>
  );
}

export default LeftSidebar;
