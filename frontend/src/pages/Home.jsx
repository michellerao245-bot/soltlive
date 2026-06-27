// src/pages/Home.jsx (Sirf return statement ko update karo ya poora replace kar lo)
import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import TrendingBar from '../components/TrendingBar';
import TopCards from '../components/TopCards';
import TokenTable from '../components/TokenTable';
import WhaleActivity from '../components/WhaleActivity';
import Footer from '../components/Footer';
import { useTokens } from '../hooks/useTokens'; 

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
    // 1. Root Wrapper: full screen width set karo aur hidden locks bypass karo
    <div className="min-h-screen w-full bg-[#0b0e14] text-white flex overflow-x-hidden">
      
      {/* 2. Sidebar Layout Wrapper: flex-shrink-0 lagaya taaki grid isko press na kare */}
      <div className="flex-shrink-0 z-30">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* 3. Main Dashboard Side Area: Isko bacha hua width ('flex-1') do aur horizontal screen crash handle karo */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Header
          onChainFilter={handleChainFilter}
          chainFilter={chainFilter}
          toggleTheme={toggleTheme}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <StatsBar />
        <TrendingBar />
        <TopCards />

        {/* Responsive Content Area */}
        <div className="flex-1 p-4 pt-0 w-full">
          <div className="flex flex-col lg:flex-row gap-4 w-full">
            
            {/* Table Panel Side */}
            <div className="flex-1 min-w-0">
              <div className="bg-[#131722] border border-gray-800 rounded-xl overflow-hidden w-full">
                <TokenTable
                  tokens={tokens}
                  onSelect={(token) => navigate(`/token/${token.pairAddress || token.token_address}`)}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                />

                {/* Loading indicator */}
                {loading && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    ⏳ Loading more tokens...
                  </div>
                )}

                {/* Sentinel for infinite scroll */}
                {!loading && hasMore && (
                  <div ref={lastTokenRef} className="h-4" />
                )}

                {/* All loaded */}
                {!hasMore && tokens.length > 0 && (
                  <div className="text-center py-4 text-gray-500 text-xs">
                    🎉 All {tokens.length} tokens loaded
                  </div>
                )}
              </div>
            </div>

            {/* Whale Activity Right Side Widget */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
              <WhaleActivity />
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;