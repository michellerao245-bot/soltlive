// src/pages/RugCheck.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchTokenDetails } from '../services/api';

const RugCheck = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
  };

  const handleCheck = async () => {
    if (!address.trim()) {
      setError('Please enter a token address');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchTokenDetails(address.trim());
      if (data && data.success) {
        setResult(data);
      } else {
        setError(data?.error || 'Token not found or invalid address');
      }
    } catch (err) {
      setError(err.message || 'Failed to check token');
    } finally {
      setLoading(false);
    }
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
            🛡️ Rug Check
          </h1>

          {/* Search */}
          <div className="bg-[#131722] border border-gray-800 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter token address (e.g., 0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 bg-[#1e232e] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-green-500 text-white"
              />
              <button
                onClick={handleCheck}
                disabled={loading}
                className="bg-green-500/20 text-green-400 px-6 py-2 rounded-lg hover:bg-green-500/30 transition disabled:opacity-50"
              >
                {loading ? 'Checking...' : '🔍 Check'}
              </button>
            </div>
            {error && (
              <div className="mt-3 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">
                  {result.token?.symbol || 'N/A'} ({result.token?.name || 'N/A'})
                </h2>
                <span className="text-xs text-gray-400">Chain: {result.chain?.toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Price</p>
                  <p className="text-white font-bold">${result.token?.price || 'N/A'}</p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Liquidity</p>
                  <p className="text-white font-bold">${(result.liquidity?.total || 0).toLocaleString()}</p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Security Score</p>
                  <p className={`font-bold ${
                    (result.security?.score || 0) >= 80 ? 'text-green-400' :
                    (result.security?.score || 0) >= 60 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {result.security?.score || 'N/A'}%
                  </p>
                </div>
                <div className="bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs">Honeypot</p>
                  <p className={`font-bold ${result.security?.honeypot ? 'text-red-400' : 'text-green-400'}`}>
                    {result.security?.honeypot ? '⚠️ Yes' : '✅ No'}
                  </p>
                </div>
              </div>

              {/* Risk Details */}
              {result.risk && (
                <div className="mt-4 bg-[#1e232e] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-2">Risk Analysis</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-lg text-xs ${
                      result.risk.level === 'Safe' ? 'bg-green-500/20 text-green-400' :
                      result.risk.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {result.risk.level}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs bg-blue-500/20 text-blue-400">
                      Score: {result.risk.score}
                    </span>
                  </div>
                  {result.aiVerdict && (
                    <p className="text-gray-300 text-sm mt-2">{result.aiVerdict}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RugCheck;