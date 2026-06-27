// src/pages/Charts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchTokens } from '../services/api';

const Charts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
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
        setTokens(data.data);
        if (data.data.length > 0) {
          setSelectedToken(data.data[0]);
        }
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
            📊 Charts
          </h1>
          
          {/* Token Selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              className="bg-[#1e232e] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-green-500 text-white"
              onChange={(e) => {
                const token = tokens.find(t => t.pair_address === e.target.value);
                setSelectedToken(token);
              }}
              value={selectedToken?.pair_address || ''}
            >
              {tokens.map((token) => (
                <option key={token.pair_address} value={token.pair_address}>
                  {token.symbol} - ${token.price?.toFixed(2) || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          {/* Chart Area */}
          {selectedToken ? (
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedToken.symbol} / USD
                  </h2>
                  <p className="text-gray-400 text-sm">{selectedToken.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    ${selectedToken.price?.toFixed(4) || 'N/A'}
                  </p>
                  <p className={`text-sm ${selectedToken.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedToken.change_24h >= 0 ? '+' : ''}{selectedToken.change_24h?.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Mini Chart - Real Data Display */}
              <div className="h-64 bg-[#1e232e] rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <p className="text-lg">📈 Price Chart</p>
                  <p className="text-sm mt-2">
                    Current: ${selectedToken.price?.toFixed(4)} | 
                    24h Vol: ${(selectedToken.volume_24h || 0).toLocaleString()}
                  </p>
                  <p className="text-xs mt-4 text-gray-500">
                    💡 Sparkline chart coming with WebSocket integration
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Price</p>
                  <p className="text-white font-bold">${selectedToken.price?.toFixed(4) || 'N/A'}</p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">24h Change</p>
                  <p className={`font-bold ${selectedToken.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedToken.change_24h >= 0 ? '+' : ''}{selectedToken.change_24h?.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Volume</p>
                  <p className="text-white font-bold">${(selectedToken.volume_24h || 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Liquidity</p>
                  <p className="text-white font-bold">${(selectedToken.liquidity || 0).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400">No tokens found</p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Charts;