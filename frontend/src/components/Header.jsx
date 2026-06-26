import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, DollarSign, LogIn, Globe, Settings, Menu, Sun, Moon,
  Search, Star, User, TrendingUp, Rocket, Flame, BarChart2,
  Wallet, ChevronDown, Monitor
} from 'lucide-react';
import ChainFilter from './ChainFilter';
import SearchDropdown from './SearchDropdown';

const Header = ({ onChainFilter, chainFilter, toggleTheme, theme, isSidebarOpen, setIsSidebarOpen }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        setShowDropdown(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const quickLinks = [
    { label: 'Trending', icon: Flame, path: '/trending' },
    { label: 'New Pairs', icon: Rocket, path: '/new-pairs' },
    { label: 'Gainers', icon: TrendingUp, path: '/gainers' },
    { label: 'Losers', icon: TrendingDown, path: '/losers' },
    { label: 'MultiCharts', icon: Monitor, path: '/multicharts' },
  ];

  return (
    <header className="bg-[#131722] border-b border-gray-800 px-3 py-2 flex items-center justify-between sticky top-0 z-20 gap-2 flex-wrap">
      {/* Mobile Menu */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-400 hover:text-white">
        <Menu size={22} />
      </button>

      {/* Chain Filter */}
      <div className="hidden sm:flex">
        <ChainFilter chainFilter={chainFilter} onChainFilter={onChainFilter} />
      </div>

      {/* Quick Links */}
      <div className="hidden md:flex items-center gap-1 text-xs">
        {quickLinks.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#1e232e] text-gray-400 hover:text-white transition"
          >
            <link.icon size={14} />
            <span>{link.label}</span>
          </button>
        ))}
        <button onClick={() => setShowMore(!showMore)} className="px-2 py-1 text-gray-400 hover:text-white">
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl min-w-[150px] relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search token, pair, or address... (Ctrl+K)"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full bg-[#1e232e] border border-gray-700 rounded-lg pl-9 pr-12 py-1.5 outline-none focus:border-green-500 text-white placeholder-gray-400 text-sm"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">Ctrl+K</kbd>
        </div>
        {showDropdown && <SearchDropdown searchQuery={search} />}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 text-green-400 text-[10px] font-medium hidden md:flex">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> LIVE
        </span>
        <button className="text-gray-400 hover:text-white relative hidden lg:block">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        <button className="text-gray-400 hover:text-white hidden md:block"><Globe size={16} /></button>
        <button className="text-gray-400 hover:text-white hidden lg:block"><DollarSign size={14} /></button>
        <button className="text-gray-400 hover:text-white hidden md:block"><Star size={16} /></button>
        <button onClick={toggleTheme} className="text-gray-400 hover:text-white hidden sm:block">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-500/30 transition">
          <LogIn size={14} /> Connect
        </button>
        <button className="text-gray-400 hover:text-white hidden sm:block"><User size={16} /></button>
      </div>
    </header>
  );
};

export default React.memo(Header);