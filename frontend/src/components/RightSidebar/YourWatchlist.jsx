// src/components/RightSidebar/YourWatchlist.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const YourWatchlist = ({ watchlist, tokens }) => {
  const navigate = useNavigate();
  
  const watchlistTokens = tokens?.filter(t => 
    watchlist?.includes(t.pair_address || t.token_address)
  ) || [];

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Star size={14} /> Watchlist
        </h3>
        <span className="text-[10px] text-gray-500">{watchlistTokens.length}</span>
      </div>

      {watchlistTokens.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-3">
          ⭐ No tokens in watchlist
        </p>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
          {watchlistTokens.slice(0, 5).map((token) => (
            <div
              key={token.pair_address || token.token_address}
              onClick={() => navigate(`/token/${token.pair_address || token.token_address}`)}
              className="flex items-center justify-between p-2 bg-[#1e232e] rounded-lg hover:bg-[#2a2f3a] cursor-pointer transition"
            >
              <div className="flex items-center gap-2">
                {token.logo ? (
                  <img src={token.logo} alt={token.symbol} className="w-5 h-5 rounded-full" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500/30 to-blue-500/30 flex items-center justify-center text-[8px] font-bold">
                    {token.symbol?.[0] || '?'}
                  </div>
                )}
                <span className="text-sm font-medium">{token.symbol}</span>
                <span className="text-[10px] text-gray-500">{token.chain?.toUpperCase()}</span>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(YourWatchlist);