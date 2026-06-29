// src/components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, DollarSign, LogIn, Globe, Settings, Menu, Sun, Moon,
  Search, Star, User, TrendingUp, TrendingDown, Rocket, Flame, BarChart2,
  Wallet, ChevronDown, Monitor, RefreshCw
} from 'lucide-react';
import ChainFilter from './ChainFilter';
import SearchDropdown from './SearchDropdown';
import CurrencyToggle from './CurrencyToggle'; // ✅ Import CurrencyToggle

const Header = ({
  onChainFilter,
  chainFilter,
  toggleTheme,
  theme,
  isSidebarOpen,
  setIsSidebarOpen,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Keyboard shortcut (Ctrl+K)
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

  // Quick links with working paths
  const quickLinks = [
    { label: 'Trending', icon: Flame, path: '/trending' },
    { label: 'New Pairs', icon: Rocket, path: '/new-pairs' },
    { label: 'Gainers', icon: TrendingUp, path: '/gainers' },
    { label: 'Losers', icon: TrendingDown, path: '/losers' },
    { label: 'MultiCharts', icon: Monitor, path: '/multicharts' },
  ];

  const moreLinks = [
    { label: 'Watchlist', icon: Star, path: '/watchlist' },
    { label: 'Portfolio', icon: Wallet, path: '/portfolio' },
    { label: 'Charts', icon: BarChart2, path: '/charts' },
    { label: 'Smart Money', icon: Settings, path: '/smart-money' },
  ];

  return (
    <header className="bg-[#131722] border-b border-gray-800 px-3 py-2 flex items-center justify-between sticky top-0 z-20 gap-2 flex-wrap">
      {/* Mobile Menu */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden text-gray-400 hover:text-white transition"
      >
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
            onClick={() => {
              navigate(link.path);
              setShowMore(false);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[#1e232e] text-gray-400 hover:text-white transition"
          >
            <link.icon size={14} />
            <span>{link.label}</span>
          </button>
        ))}
        
        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#1e232e] rounded transition"
          >
            <ChevronDown size={14} />
          </button>
          {showMore && (
            <div className="absolute right-0 mt-1 w-48 bg-[#1e232e] border border-gray-700 rounded-lg shadow-xl py-1 z-30">
              {moreLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setShowMore(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-[#2a2f3a] hover:text-white transition"
                >
                  <link.icon size={14} />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
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
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full bg-[#1e232e] border border-gray-700 rounded-lg pl-9 pr-12 py-1.5 outline-none focus:border-green-500 text-white placeholder-gray-400 text-sm"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">Ctrl+K</kbd>
        </div>
        {showDropdown && <SearchDropdown searchQuery={search} onClose={() => setShowDropdown(false)} />}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Live Indicator */}
        <span className="flex items-center gap-1 text-green-400 text-[10px] font-medium hidden md:flex">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> LIVE
        </span>
        
        {/* Refresh Button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-gray-400 hover:text-white transition hidden lg:block"
            title="Refresh data"
          >
            <RefreshCw size={16} />
          </button>
        )}
        
        {/* Notification */}
        <button className="text-gray-400 hover:text-white relative hidden lg:block transition">
          <Bell size={16} />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        
        {/* Globe */}
        <button className="text-gray-400 hover:text-white hidden md:block transition"><Globe size={16} /></button>
        
        {/* ✅ Currency Toggle - Working! */}
        <CurrencyToggle />
        
        {/* Watchlist */}
        <button
          onClick={() => navigate('/watchlist')}
          className="text-gray-400 hover:text-white hidden md:block transition"
          title="Watchlist"
        >
          <Star size={16} />
        </button>
        
        {/* Connect Wallet */}
        <button
          onClick={() => alert('Wallet connect coming soon!')}
          className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-green-500/30 transition"
        >
          <LogIn size={14} /> Connect
        </button>
        
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="text-gray-400 hover:text-white hidden sm:block transition">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        
        {/* User Profile */}
        <button
          onClick={() => navigate('/settings')}
          className="text-gray-400 hover:text-white hidden sm:block transition"
        >
          <User size={16} />
        </button>
      </div>
    </header>
  );
};

export default React.memo(Header);