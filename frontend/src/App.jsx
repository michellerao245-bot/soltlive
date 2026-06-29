// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TokenPage from "./pages/TokenPage"; // 👈 Yeh pehle se sahi bani hui hai!
import Trending from "./pages/Trending";
import NewPairs from "./pages/NewPairs";
import Watchlist from "./pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import Charts from "./pages/Charts";
import SmartMoney from "./pages/SmartMoney";
import RugCheck from "./pages/RugCheck";
import Holders from "./pages/Holders";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Gainers from "./pages/Gainers";
import Losers from "./pages/Losers";
import MultiCharts from "./pages/MultiCharts";
import Search from "./pages/Search";
// ❌ YAHAN JO import TokenDetails waali line thi use HATA DO!

export default function App() {
  return (
    <Routes>
      {/* ✅ Main Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/token/:pairAddress" element={<TokenPage />} />
      {/* ❌ YAHAN JO <Route path="/token/:address" element={<TokenDetails />} /> tha use bhi HATA DO! */}
      
      {/* ✅ Sidebar Navigation Routes */}
      <Route path="/trending" element={<Trending />} />
      <Route path="/new-pairs" element={<NewPairs />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/charts" element={<Charts />} />
      <Route path="/smart-money" element={<SmartMoney />} />
      <Route path="/rug-check" element={<RugCheck />} />
      <Route path="/holders" element={<Holders />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/settings" element={<Settings />} />
      
      {/* ✅ Header Quick Links Routes */}
      <Route path="/gainers" element={<Gainers />} />
      <Route path="/losers" element={<Losers />} />
      <Route path="/multicharts" element={<MultiCharts />} />
      
      {/* ✅ Search Route */}
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}