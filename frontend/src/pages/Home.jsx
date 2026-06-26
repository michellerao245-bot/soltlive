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
import { useTokens } from '../hooks/useTokens'; // 🔥 Real data hook

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist')) || []; } catch { return []; }
  });
  const navigate = useNavigate();

  // 🔥 Use real tokens hook with infinite scroll
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

  // 🔥 Infinite Scroll Observer
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
    <div className="min-h-screen bg-[#0b0e14] text-white flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-screen">
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

        <div className="flex-1 p-4 pt-0">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="bg-[#131722] border border-gray-800 rounded-xl overflow-hidden">
                <TokenTable
                  tokens={tokens}
                  onSelect={(token) => navigate(`/token/${token.pairAddress}`)}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                />

                {/* 🔥 Loading indicator */}
                {loading && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    ⏳ Loading more tokens...
                  </div>
                )}

                {/* 🔥 Sentinel for infinite scroll */}
                {!loading && hasMore && (
                  <div ref={lastTokenRef} className="h-4" />
                )}

                {/* 🔥 All loaded */}
                {!hasMore && tokens.length > 0 && (
                  <div className="text-center py-4 text-gray-500 text-xs">
                    🎉 All {tokens.length} tokens loaded
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-72 xl:w-80 space-y-4">
              <WhaleActivity />
              {/* Additional widgets yahan aa sakte hain */}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;