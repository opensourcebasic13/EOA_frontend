import { get, hasBackend } from "./client";

const DUMMY = {
  TSLA: {
    ticker: "TSLA",
    summary_ko: "테슬라는 로보택시 기대감과 양호한 인도량으로 주목받고 있으나, 높은 밸류에이션에 대한 우려도 함께 나타나고 있습니다.",
    main_sentiment: "positive",
    sentiment_scores: { positive: 62.5, negative: 24.0, neutral: 13.5 },
    keywords: ["robotaxi", "delivery", "valuation", "FSD", "earnings"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  NVDA: {
    ticker: "NVDA",
    summary_ko: "엔비디아는 AI 가속기 수요 급증으로 높은 성장세를 보이고 있으며, 데이터센터 매출 확대가 주요 긍정 요인으로 작용하고 있습니다.",
    main_sentiment: "positive",
    sentiment_scores: { positive: 74.2, negative: 14.3, neutral: 11.5 },
    keywords: ["AI", "GPU", "datacenter", "H100", "Blackwell"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  PLTR: {
    ticker: "PLTR",
    summary_ko: "팔란티어는 미 정부·국방 계약 확대와 AI 플랫폼 수요 증가로 급격한 트윗 상승세를 보이고 있습니다.",
    main_sentiment: "positive",
    sentiment_scores: { positive: 70.1, negative: 18.2, neutral: 11.7 },
    keywords: ["AIP", "government", "defense", "AI", "contracts"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  AMD: {
    ticker: "AMD",
    summary_ko: "AMD는 데이터센터용 MI300X 칩 수요 강세로 긍정적 전망이 우세하나, 엔비디아와의 경쟁 심화 우려도 존재합니다.",
    main_sentiment: "positive",
    sentiment_scores: { positive: 58.3, negative: 27.4, neutral: 14.3 },
    keywords: ["MI300X", "datacenter", "NVIDIA", "competition", "AI"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  MSFT: {
    ticker: "MSFT",
    summary_ko: "마이크로소프트는 Azure AI 서비스 성장세가 안정적이며, 코파일럿 확산에 따른 장기 수익 기대감이 반영되고 있습니다.",
    main_sentiment: "neutral",
    sentiment_scores: { positive: 45.2, negative: 22.1, neutral: 32.7 },
    keywords: ["Azure", "Copilot", "AI", "cloud", "OpenAI"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  AAPL: {
    ticker: "AAPL",
    summary_ko: "애플은 AI 기능 탑재 신제품 기대감이 있으나, 중국 시장 수요 둔화 우려로 혼재된 감성이 나타나고 있습니다.",
    main_sentiment: "neutral",
    sentiment_scores: { positive: 41.0, negative: 35.5, neutral: 23.5 },
    keywords: ["iPhone", "China", "AI", "Vision Pro", "services"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  "005930.KS": {
    ticker: "005930.KS",
    summary_ko: "삼성전자는 HBM 공급 확대와 파운드리 수주 기대감이 있으나, 메모리 가격 하락 압박이 우려 요인으로 지목되고 있습니다.",
    main_sentiment: "neutral",
    sentiment_scores: { positive: 38.4, negative: 38.1, neutral: 23.5 },
    keywords: ["HBM", "foundry", "memory", "반도체", "DRAM"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  "000660.KS": {
    ticker: "000660.KS",
    summary_ko: "SK하이닉스는 HBM3E 양산 성공과 엔비디아 납품 확대로 강한 긍정 심리가 형성되고 있습니다.",
    main_sentiment: "positive",
    sentiment_scores: { positive: 68.9, negative: 17.3, neutral: 13.8 },
    keywords: ["HBM3E", "NVIDIA", "메모리", "AI", "양산"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  COIN: {
    ticker: "COIN",
    summary_ko: "코인베이스는 비트코인 강세장 진입 기대와 미국 크립토 규제 완화 흐름으로 긍정적 분위기가 우세합니다.",
    main_sentiment: "positive",
    sentiment_scores: { positive: 60.2, negative: 25.1, neutral: 14.7 },
    keywords: ["Bitcoin", "regulation", "crypto", "ETF", "SEC"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  AMZN: {
    ticker: "AMZN",
    summary_ko: "아마존은 AWS 클라우드 성장 둔화 우려와 광고 수익 호조가 혼재되어 중립적 시각이 지배적입니다.",
    main_sentiment: "neutral",
    sentiment_scores: { positive: 44.3, negative: 29.8, neutral: 25.9 },
    keywords: ["AWS", "advertising", "cloud", "Bedrock", "AI"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  META: {
    ticker: "META",
    summary_ko: "메타는 Llama AI 모델 공개와 광고 매출 성장으로 긍정 심리가 강하게 나타나고 있습니다.",
    main_sentiment: "positive",
    sentiment_scores: { positive: 66.7, negative: 19.8, neutral: 13.5 },
    keywords: ["Llama", "AI", "advertising", "VR", "Instagram"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
  GOOGL: {
    ticker: "GOOGL",
    summary_ko: "구글은 Gemini AI 모델 경쟁력과 광고 시장 점유율 유지로 안정적 긍정 심리를 보이고 있습니다.",
    main_sentiment: "positive",
    sentiment_scores: { positive: 55.8, negative: 22.4, neutral: 21.8 },
    keywords: ["Gemini", "AI", "search", "advertising", "cloud"],
    model_info: { summary_model: "mT5", sentiment_model: "FinBERT" },
    analyzed_at: "2026-05-28T10:10:00Z",
  },
};

function transform(raw) {
  const scores = {
    positive: Math.round(raw.sentiment_scores.positive * 10) / 10,
    negative: Math.round(raw.sentiment_scores.negative * 10) / 10,
    neutral:  Math.round(raw.sentiment_scores.neutral  * 10) / 10,
  };
  const main = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  return {
    ticker: raw.ticker,
    summary_ko: raw.summary_ko ?? null,
    main_sentiment: main,
    sentiment_scores: scores,
    keywords: raw.keywords ?? [],
    model_info: typeof raw.model_info === "string"
      ? { summary_model: raw.model_info, sentiment_model: raw.model_info }
      : (raw.model_info ?? { summary_model: "-", sentiment_model: "-" }),
    analyzed_at: raw.analyzed_at ?? new Date().toISOString(),
  };
}

export async function fetchAnalysis(ticker) {
  if (!hasBackend) {
    await new Promise((r) => setTimeout(r, 700));
    return DUMMY[ticker] ?? null;
  }
  try {
    const res = await get(`/api/stocks/${ticker}/analysis/`);
    return transform(res.data);
  } catch {
    return null;
  }
}
