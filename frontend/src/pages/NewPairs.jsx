// src/pages/NewPairs.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TokenTable from '../components/TokenTable';
import Footer from '../components/Footer';
import { fetchTokens } from '../services/api';

const NewPairs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chainFilter, setChainFilter] = useState('all');
  const navigate = useNavigate();

  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist')) || []; } catch { return []; }
  });

  useEffect(() => {
    loadNewPairs();
  }, []);

  const loadNewPairs = async () => {
    setLoading(true);
    try {
      const data = await fetchTokens(chainFilter, 1, 50);
      if (data.success) {
        // Sort by created_at (newest first)
        const sorted = data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setTokens(sorted);
      }
    } catch (error) {
      console.error('Error loading new pairs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
  };

  const toggleWatchlist = (address) => {
    const newList = watchlist.includes(address) ? watchlist.filter(a => a !== address) : [...watchlist, address];
    setWatchlist(newList);
    localStorage.setItem('watchlist', JSON.stringify(newList));
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          onChainFilter={setChainFilter}
          chainFilter={chainFilter}
          toggleTheme={toggleTheme}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🚀 New Pairs
          </h1>
          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading new pairs...</div>
          ) : (
            <div className="bg-[#131722] border border-gray-800 rounded-xl overflow-hidden">
              <TokenTable
                tokens={tokens}
                onSelect={(token) => navigate(`/token/${token.pair_address}`)}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default NewPairs;