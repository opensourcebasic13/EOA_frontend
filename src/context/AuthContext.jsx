import { createContext, useContext, useState } from "react";
import { watchStocks as INITIAL_WATCHLIST } from "../data/watchStocks";

const AuthContext = createContext(null);

const INITIAL_USER = {
  name: "김나연",
  email: "rlawldks7788@gmail.com",
  phone: "010-1234-5678",
  joinDate: "2024년 1월 15일",
  avatar: "https://i.pravatar.cc/100?img=47",
};

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser]             = useState(INITIAL_USER);
  const [watchlist, setWatchlist]   = useState(INITIAL_WATCHLIST);

  const login  = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  // 유저 정보 부분 업데이트 (avatar 등)
  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

  // 관심 종목 추가 (중복 방지)
  const addToWatchlist = (stock) => {
    setWatchlist(prev => {
      if (prev.find(s => s.name === stock.name)) return prev;
      return [...prev, stock];
    });
  };

  // 관심 종목 삭제
  const removeFromWatchlist = (name) => {
    setWatchlist(prev => prev.filter(s => s.name !== name));
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, user, login, logout, updateUser,
      watchlist, addToWatchlist, removeFromWatchlist,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
