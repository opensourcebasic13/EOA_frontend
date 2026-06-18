import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchTrending } from "../api/stocks";

const POLL_INTERVAL = 10 * 1000;       // 테스트용 10초 (실제 배포 시 5 * 60 * 1000)
const COOLDOWN      = 30 * 1000;       // 테스트용 30초 (실제 배포 시 30 * 60 * 1000)

export function useAlarmPoller() {
  const { watchlist, alarms, isLoggedIn } = useAuth();

  // interval 내부에서 항상 최신 값 참조하도록 ref 사용
  const watchlistRef = useRef(watchlist);
  const alarmsRef    = useRef(alarms);
  const lastNotified = useRef({});

  useEffect(() => { watchlistRef.current = watchlist; }, [watchlist]);
  useEffect(() => { alarmsRef.current    = alarms;    }, [alarms]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const check = async () => {
      if (Notification.permission !== "granted") return;

      const hasEnabled = Object.values(alarmsRef.current).some(a => a?.enabled);
      if (!hasEnabled) return;

      try {
        const trending = await fetchTrending();
        const now = Date.now();

        watchlistRef.current.forEach(stock => {
          const alarm = alarmsRef.current[stock.name];
          if (!alarm?.enabled) return;

          // 쿨다운 체크
          if (now - (lastNotified.current[stock.ticker] || 0) < COOLDOWN) return;

          const fresh = trending.find(s => s.ticker === stock.ticker);
          if (!fresh) return;

          const priceChange = parseFloat(fresh.priceChange);
          const tweetChange = parseFloat(fresh.tweetChange);

          if (priceChange >= alarm.priceThreshold) {
            new Notification(`${stock.name} 주가 변동 알림`, {
              body: `주가가 ${fresh.priceDir === "up" ? "▲" : "▼"} ${priceChange}% 변동했습니다. (설정 임계값 ±${alarm.priceThreshold}%)`,
              icon: stock.logo || "/favicon.ico",
              tag: `price-${stock.ticker}`,
            });
            lastNotified.current[stock.ticker] = now;
          } else if (tweetChange >= alarm.tweetThreshold) {
            new Notification(`${stock.name} 트윗 급증 알림`, {
              body: `트윗량이 ${tweetChange}% 급증했습니다. (설정 임계값 +${alarm.tweetThreshold}%)`,
              icon: stock.logo || "/favicon.ico",
              tag: `tweet-${stock.ticker}`,
            });
            lastNotified.current[stock.ticker] = now;
          }
        });
      } catch {
        // 네트워크 오류 무시
      }
    };

    // 마운트 즉시 한 번 체크 후 이후 주기적으로 체크
    check();
    const interval = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [isLoggedIn]);
}
