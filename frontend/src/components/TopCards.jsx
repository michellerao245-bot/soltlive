import React from 'react';
import { TrendingUp, TrendingDown, Rocket, Flame, Crown, Gem, Zap } from 'lucide-react';

const TopCards = () => {
  const cards = [
    { title: '🔥 Trending', icon: Flame, color: 'text-orange-400', items: ['PEPE +42%', 'DOGE +38%', 'FLOKI +31%'] },
    { title: '🚀 New Listings', icon: Rocket, color: 'text-blue-400', items: ['NEW 2m', 'MEME 10m', 'MOON 18m'] },
    { title: '🐋 Whale Buys', icon: Crown, color: 'text-purple-400', items: ['+$1.2M', '+$2.4M', '+$0.8M'] },
    { title: '📈 Top Gainers', icon: TrendingUp, color: 'text-green-400', items: ['DOGE +38%', 'SOL +22%', 'AVAX +18%'] },
    { title: '📉 Top Losers', icon: TrendingDown, color: 'text-red-400', items: ['PEPE -12%', 'SHIB -8%', 'MATIC -6%'] },
    { title: '💎 Gems', icon: Gem, color: 'text-cyan-400', items: ['FLOKI', 'BONK', 'WIF'] },
    { title: '⚡ Boosted', icon: Zap, color: 'text-yellow-400', items: ['BNB +5%', 'SOL +4%', 'AVAX +3%'] },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 p-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-[#1e232e] border border-gray-700 rounded-xl p-3 hover:border-green-500/30 transition">
          <div className="flex items-center gap-2 mb-2">
            <card.icon className={`${card.color}`} size={16} />
            <h3 className="text-xs font-medium text-gray-300">{card.title}</h3>
          </div>
          <div className="space-y-1">
            {card.items.map((item, idx) => (
              <div key={idx} className="text-sm text-white">{item}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(TopCards);