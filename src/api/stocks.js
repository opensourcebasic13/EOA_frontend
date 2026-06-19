import { get, hasBackend } from "./client";

const DUMMY_TRENDING = [
  { rank: 1,  name: "테슬라",          ticker: "TSLA",  tweets: "24,851", tweetChange: "23.4%", tweetDir: "up",   price: "181.06달러",   priceChange: "2.57%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/TSLA" },
  { rank: 2,  name: "엔비디아",        ticker: "NVDA",  tweets: "18,932", tweetChange: "12.8%", tweetDir: "up",   price: "1,037.89달러", priceChange: "1.12%",  priceDir: "down", logo: "https://assets.parqet.com/logos/symbol/NVDA" },
  { rank: 3,  name: "팔란티어",        ticker: "PLTR",  tweets: "12,309", tweetChange: "45.6%", tweetDir: "up",   price: "23.48달러",    priceChange: "4.18%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/PLTR" },
  { rank: 4,  name: "AMD",             ticker: "AMD",   tweets: "9,842",  tweetChange: "15.7%", tweetDir: "up",   price: "167.18달러",   priceChange: "1.35%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/AMD" },
  { rank: 5,  name: "마이크로소프트",  ticker: "MSFT",  tweets: "9,102",  tweetChange: "3.6%",  tweetDir: "down", price: "420.72달러",   priceChange: "0.21%",  priceDir: "down", logo: "https://assets.parqet.com/logos/symbol/MSFT" },
  { rank: 6,  name: "애플",            ticker: "AAPL",  tweets: "8,245",  tweetChange: "5.2%",  tweetDir: "down", price: "192.58달러",   priceChange: "0.53%",  priceDir: "down", logo: "https://assets.parqet.com/logos/symbol/AAPL" },
  { rank: 7,  name: "아마존",          ticker: "AMZN",  tweets: "6,723",  tweetChange: "8.9%",  tweetDir: "up",   price: "186.67달러",   priceChange: "0.73%",  priceDir: "down", logo: "https://assets.parqet.com/logos/symbol/AMZN" },
  { rank: 8,  name: "구글",            ticker: "GOOGL", tweets: "5,876",  tweetChange: "7.2%",  tweetDir: "up",   price: "176.45달러",   priceChange: "0.94%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/GOOGL" },
  { rank: 9,  name: "넷플릭스",        ticker: "NFLX",  tweets: "4,912",  tweetChange: "6.7%",  tweetDir: "up",   price: "550.12달러",   priceChange: "1.24%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/NFLX" },
  { rank: 10, name: "메타",            ticker: "META",  tweets: "4,521",  tweetChange: "2.1%",  tweetDir: "down", price: "512.33달러",   priceChange: "1.82%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/META" },
  { rank: 11, name: "인텔",            ticker: "INTC",  tweets: "3,812",  tweetChange: "18.4%", tweetDir: "up",   price: "133.99달러",   priceChange: "10.64%", priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/INTC" },
  { rank: 12, name: "마이크론",        ticker: "MU",    tweets: "3,245",  tweetChange: "14.2%", tweetDir: "up",   price: "112.45달러",   priceChange: "8.70%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/MU" },
  { rank: 13, name: "SPCX",            ticker: "SPCX",  tweets: "2,901",  tweetChange: "4.8%",  tweetDir: "down", price: "185.00달러",   priceChange: "3.56%",  priceDir: "down", logo: "https://assets.parqet.com/logos/symbol/SPCX" },
  { rank: 14, name: "브로드컴",        ticker: "AVGO",  tweets: "2,634",  tweetChange: "9.3%",  tweetDir: "up",   price: "411.35달러",   priceChange: "4.70%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/AVGO" },
  { rank: 15, name: "TSMC",            ticker: "TSM",   tweets: "2,187",  tweetChange: "11.6%", tweetDir: "up",   price: "462.12달러",   priceChange: "6.94%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/TSM" },
  { rank: 16, name: "ASML",            ticker: "ASML",  tweets: "1,943",  tweetChange: "3.2%",  tweetDir: "down", price: "1,929.68달러", priceChange: "3.31%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/ASML" },
  { rank: 17, name: "퀄컴",            ticker: "QCOM",  tweets: "1,720",  tweetChange: "8.8%",  tweetDir: "up",   price: "226.11달러",   priceChange: "6.17%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/QCOM" },
  { rank: 18, name: "어플라이드 머티리얼즈", ticker: "AMAT", tweets: "1,534", tweetChange: "7.1%", tweetDir: "up",  price: "617.11달러",   priceChange: "4.08%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/AMAT" },
  { rank: 19, name: "램 리서치",       ticker: "LRCX",  tweets: "1,312",  tweetChange: "6.4%",  tweetDir: "up",   price: "389.04달러",   priceChange: "3.97%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/LRCX" },
  { rank: 20, name: "KLA",             ticker: "KLAC",  tweets: "1,098",  tweetChange: "12.1%", tweetDir: "up",   price: "259.56달러",   priceChange: "8.73%",  priceDir: "up",   logo: "https://assets.parqet.com/logos/symbol/KLAC" },
];

const LOGO_MAP = {
  TSLA:  "https://assets.parqet.com/logos/symbol/TSLA",
  NVDA:  "https://assets.parqet.com/logos/symbol/NVDA",
  AAPL:  "https://assets.parqet.com/logos/symbol/AAPL",
  MSFT:  "https://assets.parqet.com/logos/symbol/MSFT",
  AMZN:  "https://assets.parqet.com/logos/symbol/AMZN",
  GOOGL: "https://assets.parqet.com/logos/symbol/GOOGL",
  META:  "https://assets.parqet.com/logos/symbol/META",
  AMD:   "https://assets.parqet.com/logos/symbol/AMD",
  PLTR:  "https://assets.parqet.com/logos/symbol/PLTR",
  NFLX:  "https://assets.parqet.com/logos/symbol/NFLX",
  INTC:  "https://assets.parqet.com/logos/symbol/INTC",
  MU:    "https://assets.parqet.com/logos/symbol/MU",
  SPCX:  "https://assets.parqet.com/logos/symbol/SPCX",
  AVGO:  "https://assets.parqet.com/logos/symbol/AVGO",
  TSM:   "https://assets.parqet.com/logos/symbol/TSM",
  ASML:  "https://assets.parqet.com/logos/symbol/ASML",
  QCOM:  "https://assets.parqet.com/logos/symbol/QCOM",
  AMAT:  "https://assets.parqet.com/logos/symbol/AMAT",
  LRCX:  "https://assets.parqet.com/logos/symbol/LRCX",
  KLAC:  "https://assets.parqet.com/logos/symbol/KLAC",
};

function transformTrending(s) {
  const tweetDir = (s.one_hour_change_rate ?? 0) >= 0 ? "up" : "down";
  const priceDir = (s.price_change_rate    ?? 0) >= 0 ? "up" : "down";
  const currency = s.currency === "KRW" ? "원" : "달러";
  return {
    rank:        s.rank,
    name:        s.name,
    ticker:      s.ticker,
    logo:        s.logo_url || LOGO_MAP[s.ticker] || "",
    tweets:      s.tweet_volume?.toLocaleString() ?? "-",
    tweetChange: s.tweetChange ?? `${Math.abs(s.one_hour_change_rate ?? 0).toFixed(1)}%`,
    tweetDir,
    price:       s.current_price ? `${Number(s.current_price).toLocaleString()}${currency}` : "-",
    priceChange: `${Math.abs(s.price_change_rate ?? 0).toFixed(2)}%`,
    priceDir,
  };
}

export async function fetchTrending() {
  if (!hasBackend) return DUMMY_TRENDING;
  try {
    const data = await get("/api/stocks/trending/");
    const live = data.map(transformTrending);
    if (live.length >= 20) return live;
    // 백엔드 데이터가 20개 미만이면 DUMMY로 부족한 순위 채우기
    const liveTickers = new Set(live.map(s => s.ticker));
    const filler = DUMMY_TRENDING.filter(s => !liveTickers.has(s.ticker));
    const merged = [...live, ...filler].slice(0, 20).map((s, i) => ({ ...s, rank: i + 1 }));
    return merged;
  } catch {
    return DUMMY_TRENDING;
  }
}

export async function fetchStock(ticker) {
  if (!hasBackend) return null;
  try {
    return await get(`/api/stocks/${ticker}/`);
  } catch {
    return null;
  }
}

export async function searchStocks(query) {
  if (!hasBackend) return [];
  try {
    return await get(`/api/stocks/search/?q=${encodeURIComponent(query)}`);
  } catch {
    return [];
  }
}

export async function fetchChart(ticker) {
  if (!hasBackend) return null;
  try {
    return await get(`/api/stocks/${ticker}/chart/`);
  } catch {
    return null;
  }
}
