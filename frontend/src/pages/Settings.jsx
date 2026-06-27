// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Settings = () => {
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
          <h1 className="text-3xl font-bold text-white">⚙️ Settings</h1>
          <div className="mt-6 max-w-2xl space-y-4">
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-gray-400 text-sm">Toggle dark/light theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Default Chain</p>
                <p className="text-gray-400 text-sm">Select default blockchain</p>
              </div>
              <select className="bg-[#1e232e] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-green-500 text-white">
                <option value="all">All Chains</option>
                <option value="bsc">BSC</option>
                <option value="ethereum">Ethereum</option>
                <option value="solana">Solana</option>
              </select>
            </div>
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">API Endpoint</p>
                <p className="text-gray-400 text-sm">Current backend URL</p>
              </div>
              <span className="text-green-400 text-sm">https://ecobackend-two.vercel.app</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Settings;