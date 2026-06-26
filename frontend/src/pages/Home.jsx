// src/pages/Home.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// Sidebar abhi folder me nahi hai, isliye ise comment kiya hai taaki build pass ho sake
import Sidebar from '../components/Sidebar'; 
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import TrendingBar from '../components/TrendingBar';
import HeroCard from '../components/HeroCard'; // Sahi import naam
import TokenList from '../components/TokenList';
import WhaleActivity from '../components/WhaleActivity';
import ChainFilter from "../components/ChainFilter"; // Naya chain filter import
import Footer from '../components/Footer';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar nahi hai toh false rakha hai
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
      {/* Sidebar folder me aane par aap is line ko uncomment (// hata) sakte ho */}
      {/* <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} /> */}
      
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
        
        {/* Chain Filter ko yahan render kar diya hai */}
        <div className="p-4 pb-0">
          <ChainFilter currentChain={chainFilter} setChain={handleChainFilter} />
        </div>
        
        {/* HeroCards se 's' hata kar sahi component name render kiya */}
        <div className="p-4">
          <HeroCard />
        </div>

        <div className="flex-1 p-4 pt-0">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <TokenList
                searchQuery={''} // Header search state se link kar sakte ho baad me
                chainFilter={chainFilter}
                onSelect={(token) => navigate(`/token/${token.pairAddress}`)}
              />
            </div>
            <div className="w-full lg:w-80">
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