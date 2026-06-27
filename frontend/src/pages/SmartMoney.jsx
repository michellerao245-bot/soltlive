// src/pages/SmartMoney.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const SmartMoney = () => {
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
          <h1 className="text-3xl font-bold text-white">🧠 Smart Money</h1>
          <div className="mt-6 bg-[#131722] border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 text-lg">🐋 Smart money tracking coming soon</p>
            <p className="text-gray-500 text-sm mt-2">Track whale wallets and smart investors</p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SmartMoney;