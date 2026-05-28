import { get, hasBackend } from "./client";

const DUMMY_TWEETS = [
  { user: "전기차 투자자", handle: "@ev_investor",   time: "25분",  avatar: "https://i.pravatar.cc/40?img=11", tag: "긍정", hot: false, text: "테슬라 1분기 실적 발표 예정. 삼성 목표가 나타나고 있는 듯. 2분기 가이던스도 기대됩니다.", hashtags: ["#테슬라", "#TSLA", "#실적"],        comments: 34, retweets: 128, likes: 512 },
  { user: "AI 인사이트",  handle: "@AIinsight_kr",  time: "41분",  avatar: "https://i.pravatar.cc/40?img=15", tag: "긍정", hot: false, text: "머스크가 밝힌 시장 휴머노이드 전략, 결국 테슬라의 시장 가치를 재평가하게 만들 것 같습니다.", hashtags: ["#테슬라", "#AI", "#휴머노이드"],    comments: 28, retweets: 96,  likes: 401 },
  { user: "미주 주식 트레이더", handle: "@usstock_trader", time: "1시간", avatar: "https://i.pravatar.cc/40?img=3",  tag: "긍정", hot: true,  text: "오늘 급등랠리 기대감에 주가 강세. 자율주행 발전 방향이 더 구체화됐긴!", hashtags: ["#테슬라", "#로보택시", "#자율주행"], comments: 19, retweets: 73,  likes: 287 },
  { user: "베어마켓 경고", handle: "@bear_warning",  time: "1시간", avatar: "https://i.pravatar.cc/40?img=25", tag: "부정", hot: false, text: "밸류에이션 여전히 부담입니다. 급락, 경쟁, 수요 둔화 리스크 간과하면 안 됨.",   hashtags: ["#테슬라", "#리스크", "#밸류에이션"], comments: 51, retweets: 62,  likes: 193 },
  { user: "차트맨",       handle: "@chart_man",     time: "2시간", avatar: "https://i.pravatar.cc/40?img=32", tag: "중립", hot: false, text: "TSLA 180 지지선 테스트 중. 돌파 시 190~195 간의 랠리 가능.",                hashtags: ["#테슬라", "#TSLA", "#차트분석"],    comments: 22, retweets: 45,  likes: 156 },
];

function relativeTime(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}분`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간`;
  return `${Math.floor(hours / 24)}일`;
}

function transform(t) {
  return {
    user:     t.author_name,
    handle:   t.author_handle,
    time:     relativeTime(t.posted_at),
    avatar:   `https://i.pravatar.cc/40?u=${encodeURIComponent(t.author_handle)}`,
    tag:      t.sentiment_label,
    hot:      t.is_hot,
    text:     t.text,
    hashtags: t.hashtags ?? [],
    comments: t.reply_count,
    retweets: t.repost_count,
    likes:    t.like_count,
  };
}

export async function fetchHotTweets(ticker) {
  if (!hasBackend) return DUMMY_TWEETS;
  try {
    const data = await get(`/api/stocks/${ticker}/tweets/hot/`);
    return data.map(transform);
  } catch {
    return DUMMY_TWEETS;
  }
}
