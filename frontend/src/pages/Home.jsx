// src/pages/Home.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import TrendingBar from '../components/TrendingBar';
import HeroCards from '../components/HeroCards';
import TokenList from '../components/TokenList';
import WhaleActivity from '../components/WhaleActivity';
import Footer from '../components/Footer';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const navigate = useNavigate();

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
  }, []);

  const handleChainFilter = useCallback((chain) => setChainFilter(chain), []);

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
        
        <HeroCards />

        <div className="flex-1 p-4 pt-0">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <TokenList
                searchQuery={''} // will be managed by Header's search state; you can lift state up
                chainFilter={chainFilter}
                onSelect={(token) => navigate(`/token/${token.pairAddress}`)}
              />
            </div>
            <div className="w-full lg:w-80">
              <WhaleActivity />
              {/* You can also add Watchlist, LiveTrades, etc. */}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;