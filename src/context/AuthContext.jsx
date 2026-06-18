import { createContext, useContext, useState, useEffect } from "react";
import { watchStocks as INITIAL_WATCHLIST } from "../data/watchStocks";
import { loginApi, logoutApi, getMeApi, getWatchlistApi, addWatchlistApi, removeWatchlistApi } from "../api/auth";
import { fetchTrending } from "../api/stocks";
import { hasBackend } from "../api/client";

const AuthContext = createContext(null);

const INITIAL_USER = {
  name: "김단국",
  email: "rlawldks7788@gmail.com",
  avatar: null,
};

export const DEFAULT_ALARM = {
  enabled: false,
  priceThreshold: 3,
  tweetThreshold: 50,
};

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("eoa_token"))
  );
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("eoa_user");
      const savedUser = saved ? JSON.parse(saved) : {};
      return {
        ...INITIAL_USER,
        ...savedUser,
        avatar: localStorage.getItem("eoa_avatar") || null,
      };
    } catch {
      return { ...INITIAL_USER, avatar: localStorage.getItem("eoa_avatar") || null };
    }
  });
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem("eoa_watchlist");
      if (saved) return JSON.parse(saved);
      // 로그인 상태라면 서버 동기화 전까지 빈 배열, 비로그인이면 더미 데이터
      return localStorage.getItem("eoa_token") ? [] : INITIAL_WATCHLIST;
    } catch { return []; }
  });
  const [alarms, setAlarms] = useState(() => {
    try {
      const saved = localStorage.getItem("eoa_alarms");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const clearSessionData = () => {
    setWatchlist([]);
    setAlarms({});
    localStorage.removeItem("eoa_watchlist");
    localStorage.removeItem("eoa_alarms");
  };

  // 서버 watchlist(티커 목록)를 trending 데이터와 합쳐 상태 복원
  const syncWatchlistFromServer = async () => {
    try {
      const [serverList, trending] = await Promise.all([
        getWatchlistApi(),
        fetchTrending(),
      ]);
      const tickers = serverList.map(item => item.ticker ?? item);
      const merged = tickers
        .map(ticker => trending.find(s => s.ticker === ticker))
        .filter(Boolean);
      // 서버 응답이 빈 배열이어도 반드시 덮어써야 다른 계정 데이터가 남지 않음
      setWatchlist(merged);
      localStorage.setItem("eoa_watchlist", JSON.stringify(merged));
    } catch {
      // 네트워크 오류 시 현재 상태 유지
    }
  };

  // 앱 시작 시 토큰이 있으면 유저 정보 + watchlist 복원
  useEffect(() => {
    const token = localStorage.getItem("eoa_token");
    if (!token || !hasBackend) return;
    getMeApi()
      .then(me => {
        const name  = me.user?.username ?? me.username ?? "";
        const email = me.user?.email    ?? me.email    ?? "";
        if (name) {
          localStorage.setItem("eoa_user", JSON.stringify({ name, email }));
          setUser(prev => ({ ...prev, name, email }));
        }
        return syncWatchlistFromServer();
      })
      .catch(() => {
        localStorage.removeItem("eoa_token");
        setIsLoggedIn(false);
      });
  }, []);

  const login = async (username, password) => {
    if (!hasBackend) {
      setIsLoggedIn(true);
      return;
    }
    const data = await loginApi(username, password);
    localStorage.setItem("eoa_token", data.token);
    const name  = data.user?.username ?? data.username ?? username;
    const email = data.user?.email ?? "";
    localStorage.setItem("eoa_user", JSON.stringify({ name, email }));
    setUser(prev => ({ ...prev, name, email }));
    setIsLoggedIn(true);
    // 로그인 시 이전 계정 데이터 먼저 초기화한 후 서버에서 이 계정 데이터 로드
    clearSessionData();
    await syncWatchlistFromServer();
  };

  const logout = async () => {
    if (hasBackend) {
      await logoutApi().catch(() => {});
    }
    localStorage.removeItem("eoa_token");
    localStorage.removeItem("eoa_user");
    clearSessionData();
    setIsLoggedIn(false);
    setUser({ ...INITIAL_USER, avatar: localStorage.getItem("eoa_avatar") || null });
  };

  const updateUser = (updates) => {
    if (updates.avatar !== undefined) {
      if (updates.avatar) localStorage.setItem("eoa_avatar", updates.avatar);
      else localStorage.removeItem("eoa_avatar");
    }
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addToWatchlist = (stock) => {
    setWatchlist(prev => {
      if (prev.find(s => s.name === stock.name)) return prev;
      const next = [...prev, stock];
      localStorage.setItem("eoa_watchlist", JSON.stringify(next));
      return next;
    });
    if (hasBackend) addWatchlistApi(stock.ticker).catch(() => {});
  };

  const removeFromWatchlist = (name) => {
    setWatchlist(prev => {
      const target = prev.find(s => s.name === name);
      const next = prev.filter(s => s.name !== name);
      localStorage.setItem("eoa_watchlist", JSON.stringify(next));
      if (hasBackend && target) removeWatchlistApi(target.ticker).catch(() => {});
      return next;
    });
    setAlarms(prev => {
      const next = { ...prev };
      delete next[name];
      localStorage.setItem("eoa_alarms", JSON.stringify(next));
      return next;
    });
  };

  const getAlarm = (name) => alarms[name] ?? DEFAULT_ALARM;

  const toggleAlarm = (name) => {
    setAlarms(prev => {
      const cur = prev[name] ?? DEFAULT_ALARM;
      const next = { ...prev, [name]: { ...cur, enabled: !cur.enabled } };
      localStorage.setItem("eoa_alarms", JSON.stringify(next));
      return next;
    });
  };

  const updateAlarm = (name, updates) => {
    setAlarms(prev => {
      const cur = prev[name] ?? DEFAULT_ALARM;
      const next = { ...prev, [name]: { ...cur, ...updates } };
      localStorage.setItem("eoa_alarms", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, user, login, logout, updateUser,
      watchlist, addToWatchlist, removeFromWatchlist,
      getAlarm, toggleAlarm, updateAlarm,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
