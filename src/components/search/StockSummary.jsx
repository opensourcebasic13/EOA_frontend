import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LogoImg from "../common/LogoImg";
import SearchChart from "./SearchChart";
import { fetchStock } from "../../api/stocks";
import { QUERY_TO_TICKER } from "../../utils/tickerMap";

const stockDB = {
  테슬라:       { ticker: "TSLA",      name: "테슬라",        price: "181.06",   currency: "달러", change: "2.57",  changeAbs: "+4.53",  dir: "up",   mktCap: "5,752.3억 달러",  volume: "1,253.4만", high: "182.35달러",   low: "176.52달러",   high52: "299.29달러", low52: "138.80달러", logo: "https://logo.clearbit.com/tesla.com" },
  TSLA:         { ticker: "TSLA",      name: "테슬라",        price: "181.06",   currency: "달러", change: "2.57",  changeAbs: "+4.53",  dir: "up",   mktCap: "5,752.3억 달러",  volume: "1,253.4만", high: "182.35달러",   low: "176.52달러",   high52: "299.29달러", low52: "138.80달러", logo: "https://logo.clearbit.com/tesla.com" },
  엔비디아:     { ticker: "NVDA",      name: "엔비디아",      price: "1,037.89", currency: "달러", change: "1.12",  changeAbs: "-11.74", dir: "down", mktCap: "25,540억 달러",   volume: "4,512.1만", high: "1,053.22달러", low: "1,021.45달러", high52: "1,099.23달러", low52: "410.54달러", logo: "https://logo.clearbit.com/nvidia.com" },
  NVDA:         { ticker: "NVDA",      name: "엔비디아",      price: "1,037.89", currency: "달러", change: "1.12",  changeAbs: "-11.74", dir: "down", mktCap: "25,540억 달러",   volume: "4,512.1만", high: "1,053.22달러", low: "1,021.45달러", high52: "1,099.23달러", low52: "410.54달러", logo: "https://logo.clearbit.com/nvidia.com" },
  팔란티어:     { ticker: "PLTR",      name: "팔란티어",      price: "23.48",    currency: "달러", change: "4.18",  changeAbs: "+0.94",  dir: "up",   mktCap: "504.1억 달러",    volume: "82.3만",    high: "24.10달러",    low: "22.75달러",    high52: "27.50달러",  low52: "14.21달러",  logo: "https://logo.clearbit.com/palantir.com" },
  PLTR:         { ticker: "PLTR",      name: "팔란티어",      price: "23.48",    currency: "달러", change: "4.18",  changeAbs: "+0.94",  dir: "up",   mktCap: "504.1억 달러",    volume: "82.3만",    high: "24.10달러",    low: "22.75달러",    high52: "27.50달러",  low52: "14.21달러",  logo: "https://logo.clearbit.com/palantir.com" },
  삼성전자:     { ticker: "005930.KS", name: "삼성전자",      price: "77,500",   currency: "원",   change: "0.64",  changeAbs: "-500",   dir: "down", mktCap: "463.2조 원",      volume: "1,234.5만", high: "78,100원",     low: "77,200원",     high52: "88,800원",   low52: "65,900원",   logo: "https://logo.clearbit.com/samsung.com" },
  SK하이닉스:   { ticker: "000660.KS", name: "SK하이닉스",    price: "194,000",  currency: "원",   change: "1.36",  changeAbs: "+2,600", dir: "up",   mktCap: "141.2조 원",      volume: "3,421.8만", high: "195,500원",    low: "192,000원",    high52: "238,000원",  low52: "148,500원",  logo: "https://logo.clearbit.com/skhynix.com" },
  애플:         { ticker: "AAPL",      name: "애플",          price: "192.58",   currency: "달러", change: "0.53",  changeAbs: "-1.03",  dir: "down", mktCap: "29,720억 달러",   volume: "5,643.2만", high: "193.89달러",   low: "191.24달러",   high52: "199.62달러", low52: "164.08달러", logo: "https://logo.clearbit.com/apple.com" },
  AAPL:         { ticker: "AAPL",      name: "애플",          price: "192.58",   currency: "달러", change: "0.53",  changeAbs: "-1.03",  dir: "down", mktCap: "29,720억 달러",   volume: "5,643.2만", high: "193.89달러",   low: "191.24달러",   high52: "199.62달러", low52: "164.08달러", logo: "https://logo.clearbit.com/apple.com" },
  AMD:          { ticker: "AMD",       name: "AMD",           price: "167.18",   currency: "달러", change: "1.35",  changeAbs: "+2.23",  dir: "up",   mktCap: "2,701.2억 달러",  volume: "6,234.5만", high: "168.45달러",   low: "165.20달러",   high52: "227.30달러", low52: "141.91달러", logo: "https://logo.clearbit.com/amd.com" },
  마이크로소프트: { ticker: "MSFT",    name: "마이크로소프트", price: "420.72",   currency: "달러", change: "0.21",  changeAbs: "-0.88",  dir: "down", mktCap: "31,267.8억 달러", volume: "1,987.3만", high: "422.85달러",   low: "419.33달러",   high52: "468.35달러", low52: "362.90달러", logo: "https://logo.clearbit.com/microsoft.com" },
  MSFT:         { ticker: "MSFT",      name: "마이크로소프트", price: "420.72",  currency: "달러", change: "0.21",  changeAbs: "-0.88",  dir: "down", mktCap: "31,267.8억 달러", volume: "1,987.3만", high: "422.85달러",   low: "419.33달러",   high52: "468.35달러", low52: "362.90달러", logo: "https://logo.clearbit.com/microsoft.com" },
  코인베이스:   { ticker: "COIN",      name: "코인베이스",    price: "233.41",   currency: "달러", change: "0.98",  changeAbs: "+2.27",  dir: "up",   mktCap: "592.4억 달러",    volume: "5,432.1만", high: "236.85달러",   low: "229.60달러",   high52: "283.12달러", low52: "117.89달러", logo: "https://logo.clearbit.com/coinbase.com" },
  아마존:       { ticker: "AMZN",      name: "아마존",        price: "186.67",   currency: "달러", change: "0.73",  changeAbs: "-1.37",  dir: "down", mktCap: "19,551.2억 달러", volume: "3,215.7만", high: "188.90달러",   low: "185.21달러",   high52: "224.46달러", low52: "153.28달러", logo: "https://logo.clearbit.com/amazon.com" },
};

const TABS = ["1일", "5일", "1개월", "3개월", "1년", "5년"];

function StockSummary() {
  const [searchParams] = useSearchParams();
  const query  = searchParams.get("q") || "테슬라";
  const ticker = QUERY_TO_TICKER[query] ?? null;

  const dummy  = stockDB[query] ?? stockDB["테슬라"];
  const [stock,     setStock]     = useState(dummy);
  const [activeTab, setActiveTab] = useState("1일");
  const [starred,   setStarred]   = useState(false);

  useEffect(() => {
    setStock(stockDB[query] ?? stockDB["테슬라"]);
    if (!ticker) return;

    fetchStock(ticker).then((data) => {
      if (!data) return;
      const dir      = data.price_change_rate >= 0 ? "up" : "down";
      const currency = data.currency === "KRW" ? "원" : "달러";
      setStock((prev) => ({
        ...prev,
        name:      data.name ?? prev.name,
        ticker:    data.ticker ?? prev.ticker,
        logo:      data.logo   ?? prev.logo,
        price:     Number(data.current_price).toLocaleString(),
        currency,
        change:    Math.abs(data.price_change_rate).toFixed(2),
        changeAbs: `${data.price_change >= 0 ? "+" : ""}${data.price_change}`,
        dir,
      }));
    });
  }, [query, ticker]);

  const isUp       = stock.dir === "up";
  const priceColor = isUp ? "text-red-500" : "text-blue-500";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">

      <div className="flex items-center gap-3 mb-5">
        <LogoImg src={stock.logo} name={stock.name} size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">{stock.name}</h2>
            <span className="text-gray-400 text-base font-medium">({stock.ticker})</span>
            <button
              onClick={() => setStarred(!starred)}
              className={`text-xl transition ${starred ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`}
            >
              {starred ? "★" : "☆"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">실시간 주가 및 핫한 트윗</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold text-gray-900 tracking-tight">{stock.price}</span>
          <span className="text-xl text-gray-400 mb-1">{stock.currency}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-base font-bold ${priceColor}`}>
            {isUp ? "▲" : "▼"} {stock.change}%
          </span>
          <span className={`text-base font-semibold ${priceColor}`}>
            {stock.changeAbs}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">5월 18일 10:30 기준 (미 동부시간)</p>
      </div>

      <div className="grid grid-cols-3 gap-x-6 gap-y-4 border-t border-b border-gray-100 py-5 mb-5">
        {[
          { label: "시가총액",  value: stock.mktCap  ?? "-" },
          { label: "거래량",    value: stock.volume  ?? "-" },
          { label: "오늘 고가", value: stock.high    ?? "-" },
          { label: "오늘 저가", value: stock.low     ?? "-" },
          { label: "52주 최고", value: stock.high52  ?? "-" },
          { label: "52주 최저", value: stock.low52   ?? "-" },
        ].map(item => (
          <div key={item.label}>
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className="text-sm font-semibold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <SearchChart dir={stock.dir} />
    </div>
  );
}

export default StockSummary;
