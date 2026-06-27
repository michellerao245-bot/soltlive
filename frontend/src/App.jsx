import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TokenPage from "./pages/TokenPage";

// ✅ Temporary placeholder components
const Trending = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">🔥 Trending</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const NewPairs = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">🚀 New Pairs</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const Watchlist = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">⭐ Watchlist</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const Portfolio = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">💼 Portfolio</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const Charts = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">📊 Charts</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const SmartMoney = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">🧠 Smart Money</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const RugCheck = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">🛡️ Rug Check</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const Holders = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">👥 Holders</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const Leaderboard = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

const Settings = () => (
  <div className="min-h-screen bg-[#0b0e14] text-white p-10">
    <h1 className="text-3xl font-bold">⚙️ Settings</h1>
    <p className="text-gray-400 mt-2">Coming soon...</p>
  </div>
);

export default function App() {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/token/:pairAddress" element={<TokenPage />} />
      
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
    </Routes>
  );
}