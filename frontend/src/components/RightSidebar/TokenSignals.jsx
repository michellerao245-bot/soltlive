// src/components/RightSidebar/TokenSignals.jsx
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const TokenSignals = ({ tokens }) => {
  const signals = tokens?.slice(0, 4).map(token => ({
    ...token,
    signal: token?.change_24h > 10 ? 'Strong Buy' :
            token?.change_24h > 5 ? 'Buy' :
            token?.change_24h < -5 ? 'Sell' :
            token?.change_24h < -10 ? 'Strong Sell' : 'Hold',
    signalColor: token?.change_24h > 10 ? 'text-green-400 bg-green-500/20' :
                  token?.change_24h > 5 ? 'text-green-300 bg-green-500/10' :
                  token?.change_24h < -5 ? 'text-red-400 bg-red-500/20' :
                  token?.change_24h < -10 ? 'text-red-500 bg-red-500/30' :
                  'text-yellow-400 bg-yellow-500/20',
  })) || [];

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
        <TrendingUp size={14} /> Token Signals
      </h3>

      <div className="space-y-2">
        {signals.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-3">No signals available</p>
        ) : (
          signals.map((token) => (
            <div key={token.pair_address || token.token_address} className="flex items-center justify-between p-2 bg-[#1e232e] rounded-lg">
              <div>
                <span className="text-sm font-medium">{token.symbol}</span>
                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${token.signalColor}`}>
                  {token.signal}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-white">
                  ${token.price?.toFixed(4) || 'N/A'}
                </span>
                <span className={`text-[10px] ml-1 ${
                  token.change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {token.change_24h >= 0 ? '+' : ''}{token.change_24h?.toFixed(2)}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(TokenSignals);