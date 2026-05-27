const tagColors = {
  긍정: "bg-green-100 text-green-700",
  부정: "bg-red-100 text-red-600",
  중립: "bg-gray-100 text-gray-600",
};

export default function TweetCard({ tweet }) {
  return (
    <div className="border-b border-gray-100 last:border-0 py-5 first:pt-0">
      <div className="flex items-start gap-3">

        {/* 아바타 */}
        <img
          src={tweet.avatar}
          alt={tweet.user}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* 유저 정보 + 감성 배지 */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{tweet.user}</span>
              <span className="text-gray-400 text-xs">{tweet.handle} · {tweet.time}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {tweet.hot && <span className="text-base leading-none">🔥</span>}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[tweet.tag] ?? "bg-gray-100 text-gray-600"}`}>
                {tweet.tag}
              </span>
            </div>
          </div>

          {/* 트윗 내용 */}
          <p className="text-sm text-gray-700 leading-relaxed mb-2.5">{tweet.text}</p>

          {/* 해시태그 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tweet.hashtags.map(tag => (
              <span key={tag} className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer transition">
                {tag}
              </span>
            ))}
          </div>

          {/* 소셜 액션 (댓글 / 리트윗 / 좋아요) */}
          <div className="flex items-center gap-6 text-xs text-gray-400">

            {/* 댓글 */}
            <button className="flex items-center gap-1.5 hover:text-gray-600 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {tweet.comments}
            </button>

            {/* 리트윗 */}
            <button className="flex items-center gap-1.5 hover:text-green-500 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
              </svg>
              {tweet.retweets}
            </button>

            {/* 좋아요 */}
            <button className="flex items-center gap-1.5 hover:text-red-400 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z" />
              </svg>
              {tweet.likes}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
