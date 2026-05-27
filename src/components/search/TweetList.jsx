import { useState } from "react";
import TweetCard from "./TweetCard.jsx";

const TWEETS = [
  {
    user: "전기차 투자자",
    handle: "@ev_investor",
    time: "25분",
    avatar: "https://i.pravatar.cc/40?img=11",
    tag: "긍정",
    hot: false,
    text: "테슬라 1분기 실적 발표 예정. 삼성 목표가 나타나고 있는 듯. 2분기 가이던스도 기대됩니다.",
    hashtags: ["#테슬라", "#TSLA", "#실적"],
    comments: 34, retweets: 128, likes: 512,
  },
  {
    user: "AI 인사이트",
    handle: "@AIinsight_kr",
    time: "41분",
    avatar: "https://i.pravatar.cc/40?img=15",
    tag: "긍정",
    hot: false,
    text: "머스크가 밝힌 시장 휴머노이드 전략, 결국 테슬라의 시장 가치를 재평가하게 만들 것 같습니다.",
    hashtags: ["#테슬라", "#AI", "#휴머노이드"],
    comments: 28, retweets: 96, likes: 401,
  },
  {
    user: "미주 주식 트레이더",
    handle: "@usstock_trader",
    time: "1시간",
    avatar: "https://i.pravatar.cc/40?img=3",
    tag: "긍정",
    hot: true,
    text: "오늘 급등랠리 기대감에 주가 강세. 자율주행 발전 방향이 더 구체화됐긴!",
    hashtags: ["#테슬라", "#로보택시", "#자율주행"],
    comments: 19, retweets: 73, likes: 287,
  },
  {
    user: "베어마켓 경고",
    handle: "@bear_warning",
    time: "1시간",
    avatar: "https://i.pravatar.cc/40?img=25",
    tag: "부정",
    hot: false,
    text: "밸류에이션 여전히 부담입니다. 급락, 경쟁, 수요 둔화 리스크 간과하면 안 됨.",
    hashtags: ["#테슬라", "#리스크", "#밸류에이션"],
    comments: 51, retweets: 62, likes: 193,
  },
  {
    user: "차트맨",
    handle: "@chart_man",
    time: "2시간",
    avatar: "https://i.pravatar.cc/40?img=32",
    tag: "중립",
    hot: false,
    text: "TSLA 180 지지선 테스트 중. 돌파 시 190~195 간의 랠리 가능.",
    hashtags: ["#테슬라", "#TSLA", "#차트분석"],
    comments: 22, retweets: 45, likes: 156,
  },
];

const FILTERS = ["실시간", "인기순", "최신순"];

export default function TweetList() {
  const [filter, setFilter] = useState("실시간");
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900">지금 핫한 트윗</h3>
          <span className="text-gray-400 text-sm cursor-pointer" title="최근 1시간 기준 트윗량 상위 게시물">ⓘ</span>
        </div>

        {/* 필터 드롭다운 */}
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

      {/* 트윗 목록 */}
      <div>
        {TWEETS.map((tweet, i) => (
          <TweetCard key={i} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}
