import { get, hasBackend } from "./client";

const DUMMY_TRENDING = [
  { rank: 1,  name: "테슬라",        ticker: "TSLA",      tweets: "24,851", tweetChange: "23.4%", tweetDir: "up",   price: "181.06달러",   priceChange: "2.57%", priceDir: "up",   logo: "https://logo.clearbit.com/tesla.com" },
  { rank: 2,  name: "엔비디아",      ticker: "NVDA",      tweets: "18,932", tweetChange: "12.8%", tweetDir: "up",   price: "1,037.89달러", priceChange: "1.12%", priceDir: "down", logo: "https://logo.clearbit.com/nvidia.com" },
  { rank: 3,  name: "팔란티어",      ticker: "PLTR",      tweets: "12,309", tweetChange: "45.6%", tweetDir: "up",   price: "23.48달러",    priceChange: "4.18%", priceDir: "up",   logo: "https://logo.clearbit.com/palantir.com" },
  { rank: 4,  name: "AMD",           ticker: "AMD",       tweets: "9,842",  tweetChange: "15.7%", tweetDir: "up",   price: "167.18달러",   priceChange: "1.35%", priceDir: "up",   logo: "https://logo.clearbit.com/amd.com" },
  { rank: 5,  name: "마이크로소프트", ticker: "MSFT",      tweets: "9,102",  tweetChange: "3.6%",  tweetDir: "down", price: "420.72달러",   priceChange: "0.21%", priceDir: "down", logo: "https://logo.clearbit.com/microsoft.com" },
  { rank: 6,  name: "애플",          ticker: "AAPL",      tweets: "8,245",  tweetChange: "5.2%",  tweetDir: "down", price: "192.58달러",   priceChange: "0.53%", priceDir: "down", logo: "https://logo.clearbit.com/apple.com" },
  { rank: 7,  name: "아마존",   ticker: "AMZN",  tweets: "6,723",  tweetChange: "8.9%",  tweetDir: "up",   price: "186.67달러", priceChange: "0.73%", priceDir: "down", logo: "https://logo.clearbit.com/amazon.com" },
  { rank: 8,  name: "구글",    ticker: "GOOGL", tweets: "5,876",  tweetChange: "7.2%",  tweetDir: "up",   price: "176.45달러", priceChange: "0.94%", priceDir: "up",   logo: "https://logo.clearbit.com/google.com" },
  { rank: 9,  name: "넷플릭스", ticker: "NFLX",  tweets: "4,912",  tweetChange: "6.7%",  tweetDir: "up",   price: "550.12달러", priceChange: "1.24%", priceDir: "up",   logo: "https://logo.clearbit.com/netflix.com" },
  { rank: 10, name: "메타",    ticker: "META",  tweets: "4,521",  tweetChange: "2.1%",  tweetDir: "down", price: "512.33달러", priceChange: "1.82%", priceDir: "up",   logo: "https://logo.clearbit.com/meta.com" },
];

function transformTrending(s) {
  const tweetDir = (s.one_hour_change_rate ?? 0) >= 0 ? "up" : "down";
  const priceDir = (s.price_change_rate    ?? 0) >= 0 ? "up" : "down";
  const currency = s.currency === "KRW" ? "원" : "달러";
  return {
    rank:        s.rank,
    name:        s.name,
    ticker:      s.ticker,
    logo:        s.logo_url ?? "",
    tweets:      s.tweet_volume?.toLocaleString() ?? "-",
    tweetChange: `${Math.abs(s.one_hour_change_rate ?? 0).toFixed(1)}%`,
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
    return data.map(transformTrending);
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
