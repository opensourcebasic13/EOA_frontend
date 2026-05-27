import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import SearchResult from "./pages/SearchResult";
import Profile from "./pages/Profile";
import WatchlistManager from "./pages/WatchlistManager";
import HotStocks from "./pages/HotStocks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/search" element={<SearchResult />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/watchlist" element={<WatchlistManager />} />
      <Route path="/hot" element={<HotStocks />} />
    </Routes>
  );
}

export default App;
