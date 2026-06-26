// src/components/TrendingBar.jsx
import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';

const initialPrices = {
  BNB: { price: 615.23, change: 3.2, badge: '🔥 Hot' },
  PEPE: { price: 0.00001245, change: -2.1, badge: '🐋 Whale Buy' },
  DOGE: { price: 0.128, change: 8.4, badge: '🚀 New ATH' },
  FLOKI: { price: 0.000189, change: 5.6, badge: '' },
  SHIB: { price: 0.0000234, change: -1.3, badge: '' },
  SOL: { price: 142.5, change: 4.2, badge: '' },
};

const TrendingBar = () => {
  const [prices, setPrices] = useState(initialPrices);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const newPrices = { ...prev };
        Object.keys(newPrices).forEach((key) => {
          const change = (Math.random() - 0.5) * 0.8;
          newPrices[key].price *= (1 + change / 100);
          newPrices[key].change += change * 0.5;
          // random badge update
          if (Math.random() > 0.95) {
            const badges = ['🔥 Hot', '🐋 Whale Buy', '🚀 New ATH', '💎 Gem'];
            newPrices[key].badge = badges[Math.floor(Math.random() * badges.length)];
          }
        });
        return newPrices;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#131722] border-b border-gray-800 px-4 py-2 overflow-x-auto">
      <div className="flex items-center gap-6 text-sm whitespace-nowrap">
        <span className="text-green-400 font-semibold flex items-center gap-1">
          <TrendingUp size={16} /> Trending
        </span>
        {Object.entries(prices).map(([symbol, data]) => (
          <div
            key={symbol}
            className="flex items-center gap-2 hover:bg-[#1e232e] px-3 py-1 rounded-lg cursor-pointer transition"
          >
            <span className="font-medium text-white">{symbol}</span>
            <span className="text-gray-400 text-xs">${data.price.toFixed(4)}</span>
            <span className={data.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%
            </span>
            {data.badge && (
              <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded-full text-yellow-400">
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