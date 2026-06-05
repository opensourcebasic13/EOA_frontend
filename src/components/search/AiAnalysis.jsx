import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAnalysis } from "../../api/analysis";
import { QUERY_TO_TICKER } from "../../utils/tickerMap";

const SENTIMENT = {
  positive: { label: "긍정", bg: "bg-red-100",  text: "text-red-600",  bar: "bg-red-400"  },
  negative: { label: "부정", bg: "bg-blue-100", text: "text-blue-600", bar: "bg-blue-400" },
  neutral:  { label: "중립", bg: "bg-gray-100", text: "text-gray-600", bar: "bg-gray-300" },
};

function formatDate(iso) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  const hh   = String(d.getHours()).padStart(2, "0");
  const min  = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

function Skeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="h-5 w-32 bg-gray-200 rounded-lg" />
        <div className="h-4 w-24 bg-gray-100 rounded-lg" />
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-5/6 bg-gray-100 rounded" />
        <div className="h-4 w-4/6 bg-gray-100 rounded" />
      </div>
      <div className="space-y-3 mb-6">
        {[0.6, 0.35, 0.2].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-10 bg-gray-100 rounded" />
            <div className="h-3 rounded bg-gray-200" style={{ width: `${w * 100}%` }} />
            <div className="h-3 w-8 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {[60, 72, 80, 56, 68].map((w, i) => (
          <div key={i} className="h-6 bg-gray-100 rounded-full" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

function Empty({ message }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center py-10">
      <p className="text-3xl mb-3">🤖</p>
      <p className="text-sm font-semibold text-gray-500">{message}</p>
    </div>
  );
}

export default function AiAnalysis() {
  const [searchParams] = useSearchParams();
  const query  = searchParams.get("q") || "테슬라";
  const ticker = QUERY_TO_TICKER[query] ?? null;

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    if (!ticker) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);
    setData(null);

    fetchAnalysis(ticker)
      .then((result) => {
        if (!result) setError(true);
        else setData(result);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <Skeleton />;
  if (error || !data) return <Empty message="AI 분석 결과를 불러올 수 없습니다." />;

  const main   = SENTIMENT[data.main_sentiment] ?? SENTIMENT.neutral;
  const scores = [
    { key: "positive", value: data.sentiment_scores.positive },
    { key: "negative", value: data.sentiment_scores.negative },
    { key: "neutral",  value: data.sentiment_scores.neutral  },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h3 className="text-base font-bold text-gray-900">AI 분석 요약</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${main.bg} ${main.text}`}>
            {main.label}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">
            {data.model_info.summary_model} · {data.model_info.sentiment_model}
          </p>
          <p className="text-xs text-gray-300 mt-0.5">{formatDate(data.analyzed_at)} 분석</p>
        </div>
      </div>

      {data.summary_ko && (
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 mb-5 border-l-4 border-blue-200">
          {data.summary_ko}
        </p>
      )}

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-3">감성 분석</p>
        <div className="flex rounded-full overflow-hidden h-3 mb-3">
          {scores.map(({ key, value }) => (
            <div
              key={key}
              className={`${SENTIMENT[key].bar} transition-all`}
              style={{ width: `${value}%` }}
              title={`${SENTIMENT[key].label} ${value}%`}
            />
          ))}
        </div>
        <div className="flex gap-4">
          {scores.map(({ key, value }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${SENTIMENT[key].bar}`} />
              <span className="text-xs text-gray-500">{SENTIMENT[key].label}</span>
              <span className={`text-xs font-bold ${SENTIMENT[key].text}`}>{value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">주요 키워드</p>
        <div className="flex flex-wrap gap-2">
          {data.keywords.map((kw) => (
            <span
              key={kw}
              className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium hover:bg-blue-100 transition cursor-pointer"
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
