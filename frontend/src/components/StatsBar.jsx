import React, { useState, useEffect } from 'react';

const StatsBar = () => {
  const [stats, setStats] = useState({
    volume: '5.8B',
    pairs: '1.2M',
    tokens: '670K',
    transactions: '8.4M',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        volume: `$${(parseFloat(prev.volume.replace(/[^0-9.]/g, '')) + (Math.random() - 0.5) * 0.1).toFixed(1)}B`,
        pairs: `${(parseFloat(prev.pairs.replace(/[^0-9.]/g, '')) + (Math.random() - 0.5) * 0.01).toFixed(1)}M`,
        tokens: `${Math.floor(parseFloat(prev.tokens.replace(/[^0-9.]/g, '')) + (Math.random() - 0.5) * 10)}K`,
        transactions: `${(parseFloat(prev.transactions.replace(/[^0-9.]/g, '')) + (Math.random() - 0.5) * 0.1).toFixed(1)}M`,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#131722] border-b border-gray-800 px-4 py-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider">24h Volume</p>
        <p className="text-lg font-bold text-white">${stats.volume}</p>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Pairs</p>
        <p className="text-lg font-bold text-white">{stats.pairs}</p>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Tokens</p>
        <p className="text-lg font-bold text-white">{stats.tokens}</p>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] uppercase tracking-wider">Transactions</p>
        <p className="text-lg font-bold text-white">{stats.transactions}</p>
      </div>
    </div>
  );
};

export default React.memo(StatsBar);