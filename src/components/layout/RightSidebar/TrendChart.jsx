function TrendChart() {
  // 더미 트렌드 데이터
  const points = [30, 45, 35, 55, 40, 65, 50, 75, 60, 85, 70, 95, 80, 90, 78, 92];
  const points2 = [20, 30, 25, 40, 30, 50, 38, 58, 45, 65, 52, 72, 60, 70, 62, 75];

  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 260, h = 90;

  const toXY = (arr) =>
    arr.map((p, i) => ({
      x: (i / (arr.length - 1)) * w,
      y: h - ((p - min) / (max - min)) * (h - 10) - 5,
    }));

  const pts1 = toXY(points);
  const pts2 = toXY(points2);

  const makePath = (pts) =>
    pts.map(({ x, y }, i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

  const path1 = makePath(pts1);
  const path2 = makePath(pts2);
  const areaPath = `${path1} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-blue-500 font-bold">↗</span>
        <h3 className="font-bold text-gray-900">실시간 트렌드</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">1시간 단위 트렌드 분석</p>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* 채움 영역 */}
        <path d={areaPath} fill="url(#chartGrad1)" />
        {/* 메인 라인 (보라) */}
        <path d={path1} fill="none" stroke="#6366f1" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
        {/* 보조 라인 (분홍) */}
        <path d={path2} fill="none" stroke="#f472b6" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* 범례 */}
      <div className="flex items-center gap-4 mt-2">
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" /> TSLA
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <span className="w-3 h-0.5 bg-pink-400 inline-block rounded" /> NVDA
        </span>
      </div>
    </div>
  );
}

export default TrendChart;
