// src/components/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell, DollarSign, LogIn, Globe, Settings, Menu, Sun, Moon, Search, Star, User } from 'lucide-react';
import ChainFilter from './ChainFilter'; // new component
import SearchDropdown from './SearchDropdown'; // new component

const Header = ({ onChainFilter, chainFilter, toggleTheme, theme, isSidebarOpen, setIsSidebarOpen }) => {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

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

  return (
    <header className="bg-[#131722] border-b border-gray-800 px-4 py-2 flex items-center justify-between sticky top-0 z-20 gap-3 flex-wrap">
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-gray-400 hover:text-white">
        <Menu size={24} />
      </button>

      <ChainFilter chainFilter={chainFilter} onChainFilter={onChainFilter} />

      <div className="flex-1 max-w-2xl min-w-[200px] relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search token, pair, or address... (Ctrl+K)"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="w-full bg-[#1e232e] border border-gray-700 rounded-lg pl-10 pr-4 py-2 outline-none focus:border-green-500 text-white placeholder-gray-400 text-sm"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">Ctrl+K</kbd>
        </div>
        {showDropdown && <SearchDropdown searchQuery={search} />}
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> LIVE
        </span>
        <button className="text-gray-400 hover:text-white relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="text-gray-400 hover:text-white"><Globe size={18} /></button>
        <button className="text-gray-400 hover:text-white"><DollarSign size={16} /></button>
        <button className="text-gray-400 hover:text-white"><Star size={16} /></button>
        <button onClick={toggleTheme} className="text-gray-400 hover:text-white">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-green-500/30 transition">
          <LogIn size={16} /> Connect
        </button>
        <button className="text-gray-400 hover:text-white"><User size={18} /></button>
      </div>
    </header>
  );
};

export default React.memo(Header);