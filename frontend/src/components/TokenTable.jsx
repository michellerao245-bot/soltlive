import React, { useState, useMemo, useCallback } from 'react';
import { Star, StarOff, ExternalLink, Copy, Share2, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import Sparkline from './Sparkline';
import TokenRowActions from './TokenRowActions';

const formatCurrency = (value) => {
  if (!value) return 'N/A';
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const formatPrice = (value) => {
  if (!value) return 'N/A';
  if (value < 0.000001) return value.toFixed(10);
  if (value < 0.001) return value.toFixed(8);
  if (value < 1) return value.toFixed(6);
  return value.toFixed(2);
};

const TokenTable = ({ tokens: initialTokens, onSelect, watchlist, toggleWatchlist }) => {
  const [tokens, setTokens] = useState(initialTokens);

  // Real-time updates will be handled by parent via useRealTime

  const getChainColor = (chain) => {
    const colors = {
      bsc: 'bg-yellow-500/20 text-yellow-400',
      ethereum: 'bg-purple-500/20 text-purple-400',
      solana: 'bg-green-500/20 text-green-400',
      polygon: 'bg-blue-500/20 text-blue-400',
      arbitrum: 'bg-blue-400/20 text-blue-300',
      base: 'bg-blue-600/20 text-blue-400',
      avalanche: 'bg-red-500/20 text-red-400',
    };
    return colors[chain] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-gray-800 sticky top-0 bg-[#0b0e14]">
          <tr>
            <th className="py-2 px-2 text-left w-8">#</th>
            <th className="py-2 px-2 text-left w-8"><Star size={14} /></th>
            <th className="py-2 px-2 text-left">Token</th>
            <th className="py-2 px-2 text-right">Price</th>
            <th className="py-2 px-2 text-right">5m</th>
            <th className="py-2 px-2 text-right">1h</th>
            <th className="py-2 px-2 text-right">6h</th>
            <th className="py-2 px-2 text-right">24h</th>
            <th className="py-2 px-2 text-right">Volume</th>
            <th className="py-2 px-2 text-right">Liquidity</th>
            <th className="py-2 px-2 text-right">FDV</th>
            <th className="py-2 px-2 text-right">MC</th>
            <th className="py-2 px-2 text-right">Txns</th>
            <th className="py-2 px-2 text-right">Buyers</th>
            <th className="py-2 px-2 text-right">Sellers</th>
            <th className="py-2 px-2 text-right">Age</th>
            <th className="py-2 px-2 text-center">Chart</th>
            <th className="py-2 px-2 text-center w-8"></th>
          </tr>
        </thead>
        <tbody>
          {tokens.length === 0 ? (
            <tr><td colSpan="18" className="text-center py-10 text-gray-500">No tokens found</td></tr>
          ) : (
            tokens.map((token, index) => {
              const isWatchlisted = watchlist.includes(token.pairAddress);
              return (
                <tr
                  key={token.pairAddress}
                  className="border-b border-gray-800 hover:bg-[#1e232e] cursor-pointer transition group"
                  onClick={() => onSelect(token)}
                >
                  <td className="py-2 px-2 text-gray-500 text-xs">{index + 1}</td>
                  <td className="py-2 px-2" onClick={(e) => { e.stopPropagation(); toggleWatchlist(token.pairAddress); }}>
                    {isWatchlisted ? <Star size={16} className="text-yellow-400" /> : <StarOff size={16} className="text-gray-500 hover:text-yellow-400 transition" />}
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-xs font-bold">
                        {token.symbol?.[0] || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-white">{token.symbol}</span>
                          <span className="text-gray-400 text-xs">{token.name}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${getChainColor(token.chain)}`}>
                            {token.chain?.toUpperCase() || 'BSC'}
                          </span>
                          <span className="text-[10px] text-gray-500">{token.dex || 'Pancake'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-white">${formatPrice(token.price)}</td>
                  <td className={`py-2 px-2 text-right text-xs ${token.change5m >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change5m >= 0 ? '+' : ''}{token.change5m?.toFixed(2)}%
                  </td>
                  <td className={`py-2 px-2 text-right text-xs ${token.change1h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change1h >= 0 ? '+' : ''}{token.change1h?.toFixed(2)}%
                  </td>
                  <td className={`py-2 px-2 text-right text-xs ${token.change6h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change6h >= 0 ? '+' : ''}{token.change6h?.toFixed(2)}%
                  </td>
                  <td className={`py-2 px-2 text-right font-medium ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h?.toFixed(2)}%
                  </td>
                  <td className="py-2 px-2 text-right">{formatCurrency(token.volume)}</td>
                  <td className="py-2 px-2 text-right">{formatCurrency(token.liquidity)}</td>
                  <td className="py-2 px-2 text-right">{formatCurrency(token.fdv)}</td>
                  <td className="py-2 px-2 text-right">{formatCurrency(token.marketCap)}</td>
                  <td className="py-2 px-2 text-right">{token.transactions || 0}</td>
                  <td className="py-2 px-2 text-right text-green-400">{token.buyers || 0}</td>
                  <td className="py-2 px-2 text-right text-red-400">{token.sellers || 0}</td>
                  <td className="py-2 px-2 text-right text-gray-400 text-xs">{token.age || 'N/A'}</td>
                  <td className="py-2 px-2">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Sparkline data={token.sparkline} color={token.change24h >= 0 ? '#22c55e' : '#ef4444'} />
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <TokenRowActions token={token} />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(TokenTable);