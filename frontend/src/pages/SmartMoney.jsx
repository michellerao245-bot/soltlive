// src/pages/SmartMoney.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchTokens } from '../services/api';
import WhaleActivity from '../components/WhaleActivity';

const SmartMoney = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTokens();
  }, [chainFilter]);

  const loadTokens = async () => {
    setLoading(true);
    try {
      const data = await fetchTokens(chainFilter, 1, 100);
      if (data.success) {
        // Sort by volume to find high activity tokens
        const sorted = data.data.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));
        setTokens(sorted.slice(0, 20));
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            🧠 Smart Money
          </h1>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading smart money data...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Top Tokens by Volume */}
              <div className="lg:col-span-2 bg-[#131722] border border-gray-800 rounded-xl p-4">
                <h2 className="text-lg font-bold text-white mb-3">🔥 Top Active Tokens</h2>
                <div className="space-y-2">
                  {tokens.slice(0, 10).map((token, i) => (
                    <div
                      key={token.pair_address}
                      className="flex items-center justify-between p-3 bg-[#1e232e] rounded-lg hover:bg-[#2a2f3a] cursor-pointer transition"
                      onClick={() => navigate(`/token/${token.pair_address}`)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm w-6">{i + 1}</span>
                        <span className="font-bold text-white">{token.symbol}</span>
                        <span className="text-xs text-gray-400">{token.chain?.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white">${token.price?.toFixed(4) || 'N/A'}</span>
                        <span className={`text-sm ${token.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {token.change_24h >= 0 ? '+' : ''}{token.change_24h?.toFixed(2)}%
                        </span>
                        <span className="text-gray-400 text-sm">
                          Vol: ${(token.volume_24h || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Whale Activity */}
              <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
                <WhaleActivity />
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default SmartMoney;