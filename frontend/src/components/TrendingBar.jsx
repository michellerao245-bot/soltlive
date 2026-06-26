import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const initialPrices = {
  BNB: { price: 641.92, change: 5.3, badge: '💎 Gem' },
  PEPE: { price: 0.00001245, change: -2.4, badge: '🐋 Whale Buy' },
  DOGE: { price: 0.1268, change: 7.9, badge: '💎 Gem' },
  FLOKI: { price: 0.000189, change: 5.8, badge: '🚀 New ATH' },
  SHIB: { price: 0.0000234, change: 0.6, badge: '🐋 Whale Buy' },
  SOL: { price: 143.01, change: 4.4, badge: '🔥 Hot' },
};

const TrendingBar = () => {
  const [prices, setPrices] = useState(initialPrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const newPrices = { ...prev };
        Object.keys(newPrices).forEach((key) => {
          const change = (Math.random() - 0.5) * 0.6;
          newPrices[key].price *= (1 + change / 100);
          newPrices[key].change += change * 0.5;
          if (Math.random() > 0.92) {
            const badges = ['🔥 Hot', '🐋 Whale Buy', '🚀 New ATH', '💎 Gem', '📈 Pumping'];
            newPrices[key].badge = badges[Math.floor(Math.random() * badges.length)];
          }
        });
        return newPrices;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#131722] border-b border-gray-800 px-4 py-1.5 overflow-x-auto">
      <div className="flex items-center gap-4 text-sm whitespace-nowrap">
        <span className="text-green-400 font-semibold flex items-center gap-1 text-xs">
          <TrendingUp size={14} /> Trending
        </span>
        {Object.entries(prices).map(([symbol, data]) => (
          <div
            key={symbol}
            className="flex items-center gap-2 hover:bg-[#1e232e] px-2 py-1 rounded cursor-pointer transition"
          >
            <span className="font-medium text-white text-sm">{symbol}</span>
            <span className="text-gray-400 text-xs">${data.price.toFixed(4)}</span>
            <span className={`text-xs font-medium ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%
            </span>
            {data.badge && (
              <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded-full text-yellow-400">
                {data.badge}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(TrendingBar);