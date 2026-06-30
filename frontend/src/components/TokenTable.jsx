// src/components/TokenTable.jsx
import React, { useState, useEffect } from 'react';
import { Star, StarOff, ExternalLink } from 'lucide-react';

// ---------- CURRENCY HELPERS ----------
const getCurrency = () => {
  return localStorage.getItem('preferredCurrency') || 'USD';
};

const getCurrencyRate = () => {
  const currency = getCurrency();
  const fixedRates = {
    USD: 1, EUR: 0.93, GBP: 0.79, INR: 95.50,
    JPY: 157.5, AUD: 1.51, CAD: 1.37,
    CHF: 0.91, CNY: 7.27, KRW: 1380,
  };
  return fixedRates[currency] || 1;
};

const getCurrencySymbol = () => {
  const symbols = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹',
    JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'Fr',
    CNY: '¥', KRW: '₩',
  };
  const currency = getCurrency();
  return symbols[currency] || '$';
};

// ---------- FORMATTING HELPERS ----------
const formatCurrency = (value) => {
  if (!value || value === 0) return 'N/A';
  const rate = getCurrencyRate();
  const symbol = getCurrencySymbol();
  const converted = value * rate;
  
  if (converted >= 1e9) return `${symbol}${(converted / 1e9).toFixed(2)}B`;
  if (converted >= 1e6) return `${symbol}${(converted / 1e6).toFixed(2)}M`;
  if (converted >= 1e3) return `${symbol}${(converted / 1e3).toFixed(2)}K`;
  return `${symbol}${converted.toFixed(2)}`;
};

const formatPrice = (value) => {
  if (!value) return 'N/A';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return 'N/A';
  
  const rate = getCurrencyRate();
  const symbol = getCurrencySymbol();
  const converted = numValue * rate;
  
  if (converted < 0.000001) return `${symbol}${converted.toFixed(10)}`;
  if (converted < 0.001) return `${symbol}${converted.toFixed(8)}`;
  if (converted < 1) return `${symbol}${converted.toFixed(6)}`;
  return `${symbol}${converted.toFixed(2)}`;
};

const getChainBadge = (chain) => {
  const colors = {
    bsc: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    ethereum: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    solana: 'bg-green-500/20 text-green-400 border border-green-500/30',
    polygon: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    arbitrum: 'bg-blue-400/20 text-blue-300 border border-blue-400/30',
    base: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
    avalanche: 'bg-red-500/20 text-red-400 border border-red-500/30',
    optimism: 'bg-green-400/20 text-green-300 border border-green-400/30',
  };
  return colors[chain?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
};

// ---------- TOKEN LOGO COMPONENT ----------
const TokenLogo = ({ logo, symbol }) => {
  const [imgError, setImgError] = useState(false);

  if (logo && !imgError) {
    return (
      <img
        src={logo}
        alt={symbol || 'Token'}
        className="w-8 h-8 rounded-full object-cover bg-[#1e232e] border border-gray-700 flex-shrink-0"
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-xs font-bold text-white border border-gray-700 flex-shrink-0">
      {symbol?.[0]?.toUpperCase() || '?'}
    </div>
  );
};

// ---------- MAIN TABLE ----------
const TokenTable = ({ tokens, onSelect, watchlist, toggleWatchlist }) => {
  const [currency, setCurrency] = useState(getCurrency());

  useEffect(() => {
    const handleCurrencyChange = () => {
      setCurrency(getCurrency());
    };
    window.addEventListener('currencyChange', handleCurrencyChange);
    window.addEventListener('storage', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
      window.removeEventListener('storage', handleCurrencyChange);
    };
  }, []);

  if (!tokens || tokens.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p className="text-lg">🔍 No tokens found</p>
        <p className="text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-gray-800 sticky top-0 bg-[#0b0e14] z-10">
          <tr>
            <th className="py-3 px-2 text-left w-8">#</th>
            <th className="py-3 px-2 text-left w-8">
              <Star size={14} />
            </th>
            <th className="py-3 px-2 text-left min-w-[180px]">Token</th>
            <th className="py-3 px-2 text-right">Price</th>
            <th className="py-3 px-2 text-right">24h%</th>
            <th className="py-3 px-2 text-right">Volume</th>
            <th className="py-3 px-2 text-right">Liquidity</th>
            <th className="py-3 px-2 text-right">FDV</th>
            <th className="py-3 px-2 text-right">Market Cap</th>
            <th className="py-3 px-2 text-right">Chain</th>
            <th className="py-3 px-2 text-center">Chart</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => {
            // ✅ Unique key: use index as fallback if pair_address is duplicate
            const uniqueKey = token.pair_address 
              ? `${token.pair_address}-${index}`
              : `token-${index}`;
            const isWatchlisted = watchlist?.includes(uniqueKey) || false;

            return (
              <tr
                // ✅ FINAL FIX: Use index as part of key
                key={`row-${index}`}
                className="border-b border-gray-800 hover:bg-[#1e232e] cursor-pointer transition group"
                onClick={() => {
                  if (onSelect) {
                    onSelect(token);
                  }
                }}
              >
                {/* Rank */}
                <td className="py-3 px-2 text-gray-500 text-xs text-center">
                  {index + 1}
                </td>

                {/* Watchlist Star */}
                <td
                  className="py-3 px-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (toggleWatchlist) {
                      toggleWatchlist(uniqueKey);
                    }
                  }}
                >
                  {isWatchlisted ? (
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  ) : (
                    <StarOff size={16} className="text-gray-500 hover:text-yellow-400 transition" />
                  )}
                </td>

                {/* Token Info with Logo */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <TokenLogo logo={token.logo} symbol={token.symbol} />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white">{token.symbol || 'N/A'}</span>
                        <span className="text-gray-400 text-xs truncate max-w-[120px]">
                          {token.name || ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getChainBadge(token.chain)}`}>
                          {token.chain?.toUpperCase() || 'N/A'}
                        </span>
                        <span className="text-[10px] text-gray-500">{token.dex || ''}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price with Currency */}
                <td className="py-3 px-2 text-right font-mono text-white">
                  {formatPrice(token.price)}
                </td>

                {/* 24h Change */}
                <td className={`py-3 px-2 text-right font-medium ${
                  token.change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {token.change_24h !== undefined && token.change_24h !== null
                    ? `${token.change_24h >= 0 ? '+' : ''}${token.change_24h.toFixed(2)}%`
                    : 'N/A'}
                </td>

                {/* Volume with Currency */}
                <td className="py-3 px-2 text-right text-gray-300">
                  {formatCurrency(token.volume_24h || token.volume)}
                </td>

                {/* Liquidity with Currency */}
                <td className="py-3 px-2 text-right text-gray-300">
                  {formatCurrency(token.liquidity)}
                </td>

                {/* FDV with Currency */}
                <td className="py-3 px-2 text-right text-gray-300">
                  {formatCurrency(token.fdv)}
                </td>

                {/* Market Cap with Currency */}
                <td className="py-3 px-2 text-right text-gray-300">
                  {formatCurrency(token.market_cap)}
                </td>

                {/* Chain */}
                <td className="py-3 px-2 text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${getChainBadge(token.chain)}`}>
                    {token.chain?.toUpperCase() || 'N/A'}
                  </span>
                </td>

                {/* Chart placeholder */}
                <td className="py-3 px-2 text-center">
                  <ExternalLink size={14} className="text-gray-500 hover:text-white inline transition" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(TokenTable);