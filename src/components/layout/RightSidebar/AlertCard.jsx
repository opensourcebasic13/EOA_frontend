function AlertCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span>🔔</span>
        <h3 className="font-bold text-gray-900">맞춤 알림</h3>
      </div>
      <p className="text-xs text-gray-400 mb-4">관심 종목 변화 알림</p>
      <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
        알림 설정하기
      </button>
    </div>
  );
}

export default AlertCard;
