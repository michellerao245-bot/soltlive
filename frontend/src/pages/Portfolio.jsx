// src/pages/Portfolio.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Portfolio = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
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
          <h1 className="text-3xl font-bold text-white">💼 Portfolio</h1>
          <div className="mt-6 bg-[#131722] border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-lg">📊 Connect your wallet to view portfolio</p>
            <button className="mt-4 bg-green-500/20 text-green-400 px-6 py-2 rounded-lg hover:bg-green-500/30 transition">
              Connect Wallet
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Portfolio;