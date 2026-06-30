// src/pages/Home.jsx
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import TrendingBar from '../components/TrendingBar';
import TopCards from '../components/TopCards';
import TokenTable from '../components/TokenTable';
import Footer from '../components/Footer';
import { useTokens } from '../hooks/useTokens';
import RightSidebar from '../components/RightSidebar'; // ✅ IMPORT ADD KARO

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist')) || []; } catch { return []; }
  });
  const navigate = useNavigate();

  const { tokens, loading, hasMore, fetchMore } = useTokens(chainFilter);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
  }, []);

  const handleChainFilter = useCallback((chain) => setChainFilter(chain), []);

  const toggleWatchlist = useCallback((address) => {
    const newList = watchlist.includes(address) ? watchlist.filter(a => a !== address) : [...watchlist, address];
    setWatchlist(newList);
    localStorage.setItem('watchlist', JSON.stringify(newList));
  }, [watchlist]);

  const observerRef = useRef();
  const lastTokenRef = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, fetchMore]);

  return (
    <div className="min-h-screen w-full bg-[#0b0e14] text-white flex overflow-x-hidden">
      {/* Sidebar - Fixed position */}
      <div className="flex-shrink-0 z-30">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <Header
          onChainFilter={handleChainFilter}
          chainFilter={chainFilter}
          toggleTheme={toggleTheme}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Stats Bar */}
        <StatsBar />

        {/* Trending Bar */}
        <TrendingBar />

        {/* Top Cards */}
        <TopCards />

        {/* Main Content Area */}
        <div className="flex-1 p-4 pt-0 w-full">
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            {/* Token Table */}
            <div className="flex-1 min-w-0">
              <div className="bg-[#131722] border border-gray-800 rounded-xl overflow-hidden w-full">
                <TokenTable
                  tokens={tokens}
                  onSelect={(token) => {
                    const address = token.pair_address || token.token_address || token.pairAddress;
                    if (address) {
                      navigate(`/token/${address}`);
                    } else {
                      console.error('No address for token:', token);
                    }
                  }}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                />

                {/* Loading Indicator */}
                {loading && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    ⏳ Loading more tokens...
                  </div>
                )}

                {/* Infinite Scroll Sentinel */}
                {!loading && hasMore && (
                  <div ref={lastTokenRef} className="h-4" />
                )}

                {/* All Loaded */}
                {!hasMore && tokens.length > 0 && (
                  <div className="text-center py-4 text-gray-500 text-xs">
                    🎉 All {tokens.length} tokens loaded
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Right Sidebar - All Widgets! */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
              <RightSidebar watchlist={watchlist} tokens={tokens} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;