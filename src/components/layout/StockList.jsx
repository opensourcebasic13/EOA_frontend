import { useState } from "react";

const stocks = [
  { name: "삼성전자",  price: "77,500원",    change: "0.64%", dir: "down", logo: "https://logo.clearbit.com/samsung.com" },
  { name: "SK하이닉스", price: "194,000원",   change: "1.36%", dir: "up",   logo: "https://logo.clearbit.com/skhynix.com" },
  { name: "테슬라",    price: "181.06달러",   change: "2.57%", dir: "up",   logo: "https://logo.clearbit.com/tesla.com" },
  { name: "엔비디아",  price: "1,037.89달러", change: "1.12%", dir: "down", logo: "https://logo.clearbit.com/nvidia.com" },
  { name: "애플",      price: "192.58달러",   change: "0.53%", dir: "down", logo: "https://logo.clearbit.com/apple.com" },
];

function StockLogo({ src, name }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
        {name[0]}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      className="w-9 h-9 rounded-full object-contain border border-gray-100 shrink-0"
      onError={() => setErr(true)}
    />
  );
}

function StockList() {
  return (
    <div className="space-y-2">
      {stocks.map((s) => (
        <div
          key={s.name}
          className="bg-white rounded-2xl border border-gray-200 px-5 py-3.5 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <StockLogo src={s.logo} name={s.name} />
            <div>
              <p className="text-sm font-semibold text-gray-900">{s.name}</p>
              <p className="text-xs text-gray-500">{s.price}</p>
            </div>
          </div>
          <span className={`text-sm font-semibold ${s.dir === "up" ? "text-red-500" : "text-blue-500"}`}>
            {s.dir === "up" ? "▲" : "▼"} {s.change}
          </span>
        </div>
      ))}
    </div>
  );
}

export default StockList;
