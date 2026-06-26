// src/components/TokenList.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Star, StarOff, ExternalLink } from 'lucide-react';
import Sparkline from './Sparkline'; // new component

const formatCurrency = (value) => {
  if (!value) return 'N/A';
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
};

const generateSparkline = () => Array.from({ length: 20 }, () => Math.random() * 100 + 50);

const TokenList = ({ searchQuery, chainFilter, onSelect }) => {
  const [tokens, setTokens] = useState([]);
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist')) || []; } catch { return []; }
  });

  useEffect(() => {
    // Replace with API call to your backend
    const mock = [
      { symbol: 'BNB', name: 'Binance Coin', price: 615.23, change24h: 3.2, volume: 1520000, liquidity: 33168623, fdv: 94000000000, age: '2y', makers: 128, txns: 8241, pairAddress: '0x16b9...', chain: 'bsc', sparkline: generateSparkline() },
      { symbol: 'PEPE', name: 'Pepe', price: 0.00001245, change24h: -2.1, volume: 890000, liquidity: 1230000, fdv: 5600000000, age: '8m', makers: 67, txns: 3210, pairAddress: '0xab...', chain: 'ethereum', sparkline: generateSparkline() },
      // ... more tokens
    ];
    setTokens(mock);
  }, []);

  const filtered = useMemo(() => {
    return tokens.filter(t => {
      const matchSearch = t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchChain = chainFilter === 'all' || t.chain === chainFilter;
      return matchSearch && matchChain;
    });
  }, [tokens, searchQuery, chainFilter]);

  const toggleWatchlist = useCallback((address) => {
    const newList = watchlist.includes(address) ? watchlist.filter(a => a !== address) : [...watchlist, address];
    setWatchlist(newList);
    localStorage.setItem('watchlist', JSON.stringify(newList));
  }, [watchlist]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-gray-800">
          <tr>
            <th className="py-2 px-2 text-left"><Star size={14} /></th>
            <th className="py-2 px-2 text-left">Token</th>
            <th className="py-2 px-2 text-right">Price</th>
            <th className="py-2 px-2 text-right">24h%</th>
            <th className="py-2 px-2 text-right">Volume</th>
            <th className="py-2 px-2 text-right">Liquidity</th>
            <th className="py-2 px-2 text-right">FDV</th>
            <th className="py-2 px-2 text-right">Age</th>
            <th className="py-2 px-2 text-right">Makers</th>
            <th className="py-2 px-2 text-right">Txns</th>
            <th className="py-2 px-2 text-center">Chart</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="11" className="text-center py-10 text-gray-500">No tokens found</td></tr>
          ) : (
            filtered.map((token) => {
              const isWatchlisted = watchlist.includes(token.pairAddress);
              return (
                <tr
                  key={token.pairAddress}
                  className="border-b border-gray-800 hover:bg-[#1e232e] cursor-pointer transition"
                  onClick={() => onSelect(token)}
                >
                  <td className="py-2 px-2" onClick={(e) => { e.stopPropagation(); toggleWatchlist(token.pairAddress); }}>
                    {isWatchlisted ? <Star size={16} className="text-yellow-400" /> : <StarOff size={16} className="text-gray-500" />}
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{token.symbol}</span>
                      <span className="text-gray-400 text-xs">{token.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right font-mono">${token.price.toFixed(4)}</td>
                  <td className={`py-2 px-2 text-right font-medium ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                  </td>
                  <td className="py-2 px-2 text-right">{formatCurrency(token.volume)}</td>
                  <td className="py-2 px-2 text-right">{formatCurrency(token.liquidity)}</td>
                  <td className="py-2 px-2 text-right">{formatCurrency(token.fdv)}</td>
                  <td className="py-2 px-2 text-right text-gray-400">{token.age}</td>
                  <td className="py-2 px-2 text-right">{token.makers}</td>
                  <td className="py-2 px-2 text-right">{token.txns}</td>
                  <td className="py-2 px-2 text-center">
                    <Sparkline data={token.sparkline} color={token.change24h >= 0 ? '#22c55e' : '#ef4444'} />
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

export default React.memo(TokenList);