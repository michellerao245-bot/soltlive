// src/pages/Holders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchTokens } from '../services/api';

const Holders = () => {
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
        // Sort by holder count (if available)
        const sorted = data.data.sort((a, b) => (b.holders || 0) - (a.holders || 0));
        setTokens(sorted);
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
            👥 Holders
          </h1>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading holder data...</div>
          ) : (
            <div className="bg-[#131722] border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-400 border-b border-gray-800">
                    <tr>
                      <th className="py-3 px-4 text-left">#</th>
                      <th className="py-3 px-4 text-left">Token</th>
                      <th className="py-3 px-4 text-right">Price</th>
                      <th className="py-3 px-4 text-right">Holders</th>
                      <th className="py-3 px-4 text-right">Volume</th>
                      <th className="py-3 px-4 text-right">Liquidity</th>
                      <th className="py-3 px-4 text-right">Chain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.slice(0, 50).map((token, i) => (
                      <tr
                        key={token.pair_address}
                        className="border-b border-gray-800 hover:bg-[#1e232e] cursor-pointer transition"
                        onClick={() => navigate(`/token/${token.pair_address}`)}
                      >
                        <td className="py-3 px-4 text-gray-500 text-xs">{i + 1}</td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-white">{token.symbol}</span>
                            <span className="text-gray-400 text-xs ml-2">{token.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-white">
                          ${token.price?.toFixed(4) || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right text-white">
                          {token.holders?.toLocaleString() || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          ${(token.volume_24h || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-gray-300">
                          ${(token.liquidity || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                            {token.chain?.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Holders;