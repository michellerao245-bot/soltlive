// src/pages/MultiCharts.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MultiCharts = () => {
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
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <div className="flex-1 p-4">
          <h1 className="text-3xl font-bold text-white">📊 MultiCharts</h1>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 h-64 flex items-center justify-center">
              <p className="text-gray-400">📈 Chart 1</p>
            </div>
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 h-64 flex items-center justify-center">
              <p className="text-gray-400">📈 Chart 2</p>
            </div>
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 h-64 flex items-center justify-center">
              <p className="text-gray-400">📈 Chart 3</p>
            </div>
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 h-64 flex items-center justify-center">
              <p className="text-gray-400">📈 Chart 4</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MultiCharts;