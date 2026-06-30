// src/components/RightSidebar/MarketHeatmap.jsx
import React, { useState } from 'react';
import { Flame, TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react';

const MarketHeatmap = ({ tokens }) => {
  const [view, setView] = useState('gainers'); // 'gainers' | 'losers' | 'volume'
  const [timeframe, setTimeframe] = useState('24h');

  // Sort tokens based on view
  const sortedTokens = React.useMemo(() => {
    if (!tokens || tokens.length === 0) return [];

    let sorted = [...tokens];
    
    if (view === 'gainers') {
      sorted.sort((a, b) => (b.change_24h || 0) - (a.change_24h || 0));
    } else if (view === 'losers') {
      sorted.sort((a, b) => (a.change_24h || 0) - (b.change_24h || 0));
    } else if (view === 'volume') {
      sorted.sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));
    }

    return sorted.slice(0, 10);
  }, [tokens, view]);

  const getPriceChangeColor = (change) => {
    if (change > 10) return 'text-green-400 bg-green-500/20';
    if (change > 5) return 'text-green-300 bg-green-500/10';
    if (change < -10) return 'text-red-400 bg-red-500/20';
    if (change < -5) return 'text-red-300 bg-red-500/10';
    return 'text-yellow-400 bg-yellow-500/10';
  };

  const getIcon = (change) => {
    if (change > 5) return <TrendingUp size={12} className="text-green-400" />;
    if (change < -5) return <TrendingDown size={12} className="text-red-400" />;
    return <Minus size={12} className="text-yellow-400" />;
  };

  const getChangeText = (change) => {
    return `${change >= 0 ? '+' : ''}${change?.toFixed(2) || 0}%`;
  };

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Flame size={14} className="text-orange-400" /> Market Heatmap
        </h3>
        <div className="flex gap-1">
          {['24h', '7d', '30d'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`text-[9px] px-2 py-0.5 rounded transition ${
                timeframe === tf
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-[#1e232e] text-gray-500 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-1 mb-3">
        {[
          { key: 'gainers', label: '🚀 Gainers' },
          { key: 'losers', label: '📉 Losers' },
          { key: 'volume', label: '📊 Volume' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex-1 text-[10px] font-medium py-1 rounded-lg transition ${
              view === tab.key
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-[#1e232e] text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Heatmap Grid */}
      {sortedTokens.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-xs">
          No data available
        </div>
      ) : (
        <div className="space-y-1.5">
          {sortedTokens.map((token, index) => {
            const change = token.change_24h || 0;
            const isPositive = change >= 0;
            const intensity = Math.min(Math.abs(change) / 20, 1);

            return (
              <div
                key={token.pair_address || token.token_address || index}
                className={`flex items-center justify-between p-2 rounded-lg transition cursor-pointer hover:scale-[1.02] ${
                  isPositive
                    ? `bg-green-500/${Math.round(intensity * 10 + 5)}`
                    : `bg-red-500/${Math.round(intensity * 10 + 5)}`
                }`}
                style={{
                  backgroundColor: isPositive
                    ? `rgba(34, 197, 94, ${intensity * 0.2 + 0.05})`
                    : `rgba(239, 68, 68, ${intensity * 0.2 + 0.05})`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-4">{index + 1}</span>
                  <div className="flex items-center gap-1.5">
                    {token.logo ? (
                      <img src={token.logo} alt={token.symbol} className="w-4 h-4 rounded-full" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-[6px] font-bold">
                        {token.symbol?.[0] || '?'}
                      </div>
                    )}
                    <span className="text-sm font-medium text-white">{token.symbol}</span>
                    <span className="text-[10px] text-gray-500">{token.chain?.toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white">
                    ${token.price?.toFixed(4) || 'N/A'}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${getPriceChangeColor(change)} flex items-center gap-0.5`}>
                    {getIcon(change)}
                    {getChangeText(change)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-3 flex justify-between text-[10px] text-gray-500 border-t border-gray-800 pt-2">
        <span>🔥 Top {sortedTokens.length} movers</span>
        <span>Updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default React.memo(MarketHeatmap);