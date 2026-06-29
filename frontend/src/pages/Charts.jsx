// src/pages/Charts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CandleChart from '../components/CandleChart';
import { generateCandleData } from '../utils/mockChartData';
import { fetchTokens } from '../services/api';

const Charts = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1D');
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

  // Generate candle data for selected token
  const candleData = selectedToken 
    ? generateCandleData(selectedToken.price || 100, 100)
    : [];

  // Timeframe options
  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

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
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              📊 Charts
            </h1>
            
            {/* Token Selector */}
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
                  {token.symbol} - ${token.price?.toFixed(4) || 'N/A'}
                </option>
              ))}
            </select>
          </div>

          {/* Token Info Bar */}
          {selectedToken && (
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 mb-4">
              <div className="flex flex-wrap items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedToken.symbol} / USD
                  </h2>
                  <p className="text-gray-400 text-sm">{selectedToken.name}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-gray-400 text-xs">Price</p>
                    <p className="text-2xl font-bold text-white">
                      ${selectedToken.price?.toFixed(4) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">24h Change</p>
                    <p className={`text-lg font-bold ${
                      selectedToken.change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedToken.change_24h >= 0 ? '+' : ''}{selectedToken.change_24h?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Volume</p>
                    <p className="text-lg font-bold text-white">
                      ${(selectedToken.volume_24h || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeframe Selector */}
              <div className="flex gap-2 mt-4">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                      timeframe === tf
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-[#1e232e] text-gray-400 hover:text-white hover:bg-[#2a2f3a]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Candle Chart */}
          {selectedToken ? (
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
              <CandleChart 
                data={candleData} 
                height={450}
              />
              
              {/* Stats below chart */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Open</p>
                  <p className="text-white font-bold">
                    ${candleData[candleData.length - 1]?.open?.toFixed(4) || 'N/A'}
                  </p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">High</p>
                  <p className="text-white font-bold">
                    ${candleData.reduce((max, d) => d.high > max ? d.high : max, 0)?.toFixed(4) || 'N/A'}
                  </p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Low</p>
                  <p className="text-white font-bold">
                    ${candleData.reduce((min, d) => d.low < min ? d.low : min, Infinity)?.toFixed(4) || 'N/A'}
                  </p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Close</p>
                  <p className="text-white font-bold">
                    ${candleData[candleData.length - 1]?.close?.toFixed(4) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-400">Select a token to view chart</p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Charts;