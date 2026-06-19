export const QUERY_TO_TICKER = {
  테슬라:         "TSLA",  TSLA:  "TSLA",
  엔비디아:       "NVDA",  NVDA:  "NVDA",
  팔란티어:       "PLTR",  PLTR:  "PLTR",
  AMD:            "AMD",
  마이크로소프트: "MSFT",  MSFT:  "MSFT",
  애플:           "AAPL",  AAPL:  "AAPL",
  아마존:         "AMZN",  AMZN:  "AMZN",
  메타:           "META",  META:  "META",
  구글:           "GOOGL", GOOGL: "GOOGL",
  넷플릭스:       "NFLX",  NFLX:  "NFLX",
  인텔:           "INTC",  INTC:  "INTC",
  마이크론:       "MU",    MU:    "MU",
  SPCX:           "SPCX",
  브로드컴:       "AVGO",  AVGO:  "AVGO",
  TSMC:           "TSM",   TSM:   "TSM",
  ASML:           "ASML",
  퀄컴:           "QCOM",  QCOM:  "QCOM",
  "어플라이드 머티리얼즈": "AMAT", AMAT: "AMAT",
  "램 리서치":    "LRCX",  LRCX:  "LRCX",
  KLA:            "KLAC",  KLAC:  "KLAC",
};

function editDistance(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

// 부분입력·오타를 허용하는 ticker 조회
// 우선순위: 1) exact  2) 앞글자 일치(접두사)  3) 포함  4) 레벤슈타인 거리 ≤ 2
export function resolveTicker(query) {
  const q = (query ?? "").trim();
  if (!q) return null;

  if (QUERY_TO_TICKER[q]) return QUERY_TO_TICKER[q];

  const qLow = q.toLowerCase();
  const entries = Object.entries(QUERY_TO_TICKER);

  for (const [key, ticker] of entries)
    if (key.toLowerCase().startsWith(qLow)) return ticker;

  for (const [key, ticker] of entries) {
    const k = key.toLowerCase();
    if (k.includes(qLow) || qLow.includes(k)) return ticker;
  }

  if (q.length >= 3) {
    let best = null, bestDist = 3;
    for (const [key, ticker] of entries) {
      const dist = editDistance(qLow, key.toLowerCase());
      if (dist < bestDist) { bestDist = dist; best = ticker; }
    }
    if (best) return best;
  }

  return null;
}
