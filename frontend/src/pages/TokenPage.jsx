// src/pages/TokenPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CandleChart from '../components/CandleChart';
import { generateCandleData } from '../utils/mockChartData';
import { fetchTokens, fetchTokenDetails } from '../services/api';

const TokenPage = () => {
  const { pairAddress } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('1D');
  const navigate = useNavigate();

  useEffect(() => {
    if (pairAddress) {
      loadToken(pairAddress);
    }
  }, [pairAddress]);

  const loadToken = async (address) => {
    setLoading(true);
    setError(null);
    try {
      // Pehle tokens list me search karo
      const tokensData = await fetchTokens('all', 1, 100);
      if (tokensData.success) {
        const found = tokensData.data.find(
          t => t.pair_address === address || t.token_address === address
        );
        if (found) {
          setToken(found);
          setLoading(false);
          return;
        }
      }

      // Agar list me nahi mila toh details fetch karo
      const details = await fetchTokenDetails(address);
      if (details && details.success) {
        setToken(details);
      } else {
        setError('Token not found');
      }
    } catch (err) {
      console.error('Error loading token:', err);
      setError('Failed to load token data');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
  };

  // Generate chart data
  const chartData = token?.price 
    ? generateCandleData(token.price, token.symbol || 'TOKEN', 100)
    : [];

  const timeframes = ['1D', '1W', '1M', '3M', '1Y'];

  // Loading state
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
              <p className="text-gray-400">Loading token...</p>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !token) {
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
              <p className="text-red-400 text-xl">❌ Token not found</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition"
              >
                ← Back to Home
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // Success state with chart
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
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-1 transition"
          >
            ← Back to Home
          </button>

          {/* Token Header */}
          <div className="bg-[#131722] border border-gray-800 rounded-xl p-6 mb-4">
            <div className="flex items-center gap-4">
              {token.logo ? (
                <img
                  src={token.logo}
                  alt={token.symbol}
                  className="w-16 h-16 rounded-full object-cover border border-gray-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-2xl font-bold text-white border border-gray-700">
                  {token.symbol?.[0] || '?'}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-white">{token.symbol}</h1>
                <p className="text-gray-400">{token.name}</p>
                <span className="text-xs text-gray-500">{token.chain?.toUpperCase()}</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-[#1e232e] p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Price</p>
                <p className="text-xl font-bold text-white">${token.price?.toFixed(4) || 'N/A'}</p>
              </div>
              <div className="bg-[#1e232e] p-3 rounded-lg">
                <p className="text-gray-400 text-xs">24h Change</p>
                <p className={`text-xl font-bold ${token.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {token.change_24h >= 0 ? '+' : ''}{token.change_24h?.toFixed(2)}%
                </p>
              </div>
              <div className="bg-[#1e232e] p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Volume</p>
                <p className="text-xl font-bold text-white">${(token.volume_24h || 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#1e232e] p-3 rounded-lg">
                <p className="text-gray-400 text-xs">Liquidity</p>
                <p className="text-xl font-bold text-white">${(token.liquidity || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Candle Chart */}
          <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{token.symbol}/USD Chart</h2>
              <div className="flex gap-2">
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

            {chartData && chartData.length > 0 ? (
              <CandleChart data={chartData} height={400} />
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-400">
                No chart data available
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default TokenPage;