import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TweetCard from "./TweetCard.jsx";
import { fetchHotTweets } from "../../api/tweets";
import { QUERY_TO_TICKER } from "../../utils/tickerMap";

const FILTERS = ["실시간", "인기순", "최신순"];

export default function TweetList() {
  const [searchParams] = useSearchParams();
  const query  = searchParams.get("q") || "테슬라";
  const ticker = QUERY_TO_TICKER[query] ?? "TSLA";

  const [tweets,  setTweets]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("실시간");
  const [open,    setOpen]    = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchHotTweets(ticker)
      .then(setTweets)
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900">지금 핫한 트윗</h3>
          <span className="text-gray-400 text-sm cursor-pointer" title="최근 1시간 기준 트윗량 상위 게시물">ⓘ</span>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen(prev => !prev)}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
          >
            {filter}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open && (
            <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                    filter === f ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-5 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-4/5 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {tweets.map((tweet, i) => (
            <TweetCard key={i} tweet={tweet} />
          ))}
        </div>
      )}
    </div>
  );
}
