const DUMMY_UP   = [177, 178.2, 176.8, 179.1, 178.3, 180.2, 179.8, 181.0, 180.5, 182.1, 181.3, 183.0, 182.4, 181.2, 183.1, 181.06];
const DUMMY_DOWN = [184, 183.5, 182.2, 183.1, 181.8, 180.3, 181.2, 179.6, 180.1, 178.4, 179.2, 177.8, 178.3, 177.2, 176.8, 176.0];
const DUMMY_VOL  = [0.5, 0.65, 0.42, 0.78, 0.55, 0.9, 0.68, 0.48, 0.82, 0.6, 0.74, 0.88, 0.76, 0.7, 0.58, 0.8];

function pickLabels(points, count = 6) {
  const step = Math.max(1, Math.floor((points.length - 1) / (count - 1)));
  return Array.from({ length: count }, (_, i) => {
    const idx = Math.min(i * step, points.length - 1);
    const d = new Date(points[idx].time);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });
}

function SearchChart({ dir = "up", points = null }) {
  const hasReal = points && points.length >= 2;

  const prices  = hasReal ? points.map(p => p.price) : (dir === "up" ? DUMMY_UP : DUMMY_DOWN);
  const rawVols = hasReal ? points.map(p => p.volume ?? 0) : DUMMY_VOL;

  const W = 560, H = 150, VOLUME_H = 28;
  const minVal = Math.min(...prices) - (hasReal ? (Math.max(...prices) - Math.min(...prices)) * 0.05 : 0.8);
  const maxVal = Math.max(...prices) + (hasReal ? (Math.max(...prices) - Math.min(...prices)) * 0.05 : 0.8);
  const refPrice = prices[0];

  const toY = (p) => H - ((p - minVal) / (maxVal - minVal)) * (H - 20) - 10;
  const xs  = prices.map((_, i) => (i / (prices.length - 1)) * W);
  const ys  = prices.map(toY);
  const refY = toY(refPrice);

  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;

  const color  = dir === "up" ? "#3b82f6" : "#ef4444";
  const volMax = Math.max(...rawVols) || 1;

  const yLabels = [maxVal, (maxVal + minVal) / 2, minVal].map(v => v.toFixed(0));
  const xLabels = hasReal
    ? pickLabels(points)
    : ["09:30", "10:00", "10:30", "11:00", "11:30", "12:00"];

  return (
    <div>
      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-xs text-gray-400 text-right shrink-0 w-8 py-1">
          {yLabels.map(l => <span key={l}>{l}</span>)}
        </div>

        <div className="flex-1 min-w-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 150 }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="sgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map(t => (
              <line key={t} x1="0" y1={H * t} x2={W} y2={H * t} stroke="#f1f5f9" strokeWidth="1" />
            ))}

            <line
              x1="0" y1={refY.toFixed(1)} x2={W} y2={refY.toFixed(1)}
              stroke="#ef4444" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.6"
            />

            <path d={areaPath} fill="url(#sgGrad)" />
            <path d={linePath} fill="none" stroke={color} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" />

            <circle cx={xs[xs.length - 1].toFixed(1)} cy={ys[ys.length - 1].toFixed(1)} r="4" fill={color} />
            <circle cx={xs[xs.length - 1].toFixed(1)} cy={ys[ys.length - 1].toFixed(1)} r="7" fill={color} opacity="0.2" />
          </svg>

          <div className="flex items-end gap-0.5 mt-1.5" style={{ height: VOLUME_H }}>
            {rawVols.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${(v / volMax) * VOLUME_H}px`,
                  backgroundColor: color,
                  opacity: 0.35,
                }}
              />
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {xLabels.map((l, i) => <span key={i}>{l}</span>)}
          </div>

          {hasReal && (
            <p className="text-[10px] text-gray-400 mt-1 text-right">
              실시간 데이터 · {points.length}개 포인트
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchChart;
