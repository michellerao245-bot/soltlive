import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Flame, Rocket, Star, Wallet, BarChart2, Zap, Settings,
  ChevronLeft, ChevronRight, Shield, Users, Award
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/trending', label: 'Trending', icon: Flame },
  { path: '/new-pairs', label: 'New Pairs', icon: Rocket },
  { path: '/watchlist', label: 'Watchlist', icon: Star },
  { path: '/portfolio', label: 'Portfolio', icon: Wallet },
  { path: '/charts', label: 'Charts', icon: BarChart2 },
  { path: '/smart-money', label: 'Smart Money', icon: Zap },
  { path: '/rug-check', label: 'Rug Check', icon: Shield },
  { path: '/holders', label: 'Holders', icon: Users },
  { path: '/leaderboard', label: 'Leaderboard', icon: Award },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-[#131722] border-r border-gray-800 transition-all duration-300 flex flex-col h-screen sticky top-0 overflow-y-auto`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        {isOpen ? (
          <h1 className="text-2xl font-bold text-green-400">SoltLive</h1>
        ) : (
          <span className="text-2xl font-bold text-green-400">EL</span>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                isActive ? 'bg-[#2a2f3a] text-green-400' : 'text-gray-400 hover:bg-[#1e232e] hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              {isOpen && isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        {isOpen ? 'v2.0.0' : 'v2.0.0'}
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);