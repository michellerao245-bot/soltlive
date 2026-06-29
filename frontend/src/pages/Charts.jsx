// src/pages/Charts.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  // Load tokens
  useEffect(() => {
    loadTokens();
  }, [chainFilter]);

  const loadTokens = async () => {
    setLoading(true);
    try {
      const data = await fetchTokens(chainFilter, 1, 100);
      if (data.success && data.data.length > 0) {
        setTokens(data.data);
        setSelectedToken(data.data[0]);
      } else {
        setTokens([]);
        setSelectedToken(null);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      setTokens([]);
      setSelectedToken(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate chart data when selected token changes (with symbol)
  useEffect(() => {
    if (selectedToken && selectedToken.price) {
      // ✅ Pass symbol to generate unique chart
      const data = generateCandleData(
        selectedToken.price || 100,
        selectedToken.symbol || 'TOKEN',
        100
      );
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [selectedToken, timeframe]);

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
  };

  const handleTokenSelect = (e) => {
    const token = tokens.find(t => t.pair_address === e.target.value);
    setSelectedToken(token || null);
  };

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  // ✅ Memoize chart data
  const memoizedChartData = useMemo(() => chartData, [chartData]);

  // ✅ Loading state
  if (loading) {
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
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-400">Loading tokens...</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

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
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              📊 Charts
            </h1>

            {/* Token Selector */}
            <select
              className="bg-[#1e232e] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-green-500 text-white min-w-[180px]"
              onChange={handleTokenSelect}
              value={selectedToken?.pair_address || ''}
            >
              {tokens.length === 0 ? (
                <option value="">No tokens available</option>
              ) : (
                tokens.map((token) => (
                  <option key={token.pair_address} value={token.pair_address}>
                    {token.symbol} - ${token.price?.toFixed(4) || 'N/A'}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Token Info Bar */}
          {selectedToken ? (
            <>
              <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedToken.symbol} / USD
                    </h2>
                    <p className="text-gray-400 text-sm">{selectedToken.name}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
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
                <div className="flex flex-wrap gap-2 mt-4">
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

              {/* Candle Chart */}
              <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
                {memoizedChartData && memoizedChartData.length > 0 ? (
                  <>
                    <CandleChart data={memoizedChartData} height={450} />

                    {/* Stats below chart */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="bg-[#1e232e] p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Open</p>
                        <p className="text-white font-bold">
                          ${memoizedChartData[memoizedChartData.length - 1]?.open?.toFixed(4) || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-[#1e232e] p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">High</p>
                        <p className="text-white font-bold">
                          ${Math.max(...memoizedChartData.map(d => d.high))?.toFixed(4) || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-[#1e232e] p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Low</p>
                        <p className="text-white font-bold">
                          ${Math.min(...memoizedChartData.map(d => d.low))?.toFixed(4) || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-[#1e232e] p-3 rounded-lg">
                        <p className="text-gray-400 text-xs">Close</p>
                        <p className="text-white font-bold">
                          ${memoizedChartData[memoizedChartData.length - 1]?.close?.toFixed(4) || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[450px] flex items-center justify-center text-gray-400">
                    {selectedToken ? '⏳ Generating chart data...' : '📊 Select a token to view chart'}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-12 text-center">
              <p className="text-gray-400 text-lg">📊 No tokens available</p>
              <p className="text-gray-500 text-sm mt-2">Try changing the chain filter</p>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Charts;