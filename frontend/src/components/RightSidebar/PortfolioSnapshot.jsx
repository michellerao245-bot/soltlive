// src/components/RightSidebar/PortfolioSnapshot.jsx
import React, { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const PortfolioSnapshot = () => {
  const [isConnected, setIsConnected] = useState(false);
  const totalBalance = 15234.50;
  const dailyChange = 423.12;
  const dailyChangePercent = 2.85;

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Wallet size={14} /> Portfolio
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded ${
          isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
        }`}>
          {isConnected ? '🟢 Connected' : '⚪ Disconnected'}
        </span>
      </div>

      {isConnected ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Balance</p>
              <p className="text-xl font-bold text-white">${totalBalance.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">24h Change</p>
              <p className={`text-sm font-medium ${dailyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {dailyChange >= 0 ? '+' : ''}${dailyChange.toFixed(2)}
                <span className="ml-1">({dailyChangePercent}%)</span>
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 bg-green-500/20 text-green-400 text-xs font-medium py-1.5 rounded-lg hover:bg-green-500/30 transition">
              Deposit
            </button>
            <button className="flex-1 bg-red-500/20 text-red-400 text-xs font-medium py-1.5 rounded-lg hover:bg-red-500/30 transition">
              Withdraw
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-2">
          <p className="text-xs text-gray-400">Connect wallet to view portfolio</p>
          <button 
            onClick={() => setIsConnected(true)}
            className="mt-2 bg-green-500/20 text-green-400 text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-green-500/30 transition"
          >
            🔗 Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(PortfolioSnapshot);