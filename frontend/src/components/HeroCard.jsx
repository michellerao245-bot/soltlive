import React from 'react';
import { TrendingUp, TrendingDown, Clock, Flame } from 'lucide-react';

const mockData = {
  gainers: [{ symbol: 'DOGE', change: 8.4 }, { symbol: 'SOL', change: 4.2 }],
  losers: [{ symbol: 'PEPE', change: -2.1 }, { symbol: 'SHIB', change: -1.3 }],
  recent: [{ symbol: 'NEW', time: '2 min ago' }, { symbol: 'MEME', time: '10 min ago' }],
  viewed: [{ symbol: 'BNB', views: '12.4K' }, { symbol: 'SOL', views: '8.7K' }],
};

const HeroCards = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
    <Card title="Top Gainers" icon={<TrendingUp className="text-green-400" />} items={mockData.gainers} type="change" />
    <Card title="Top Losers" icon={<TrendingDown className="text-red-400" />} items={mockData.losers} type="change" />
    <Card title="Recently Added" icon={<Clock className="text-blue-400" />} items={mockData.recent} type="time" />
    <Card title="Most Viewed" icon={<Flame className="text-orange-400" />} items={mockData.viewed} type="views" />
  </div>
);

const Card = ({ title, icon, items, type }) => (
  <div className="bg-[#1e232e] border border-gray-700 rounded-xl p-4 hover:border-green-500/30 transition">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h3 className="text-sm font-medium text-gray-300">{title}</h3>
    </div>
    <div className="space-y-1">
      {items.map((item, idx) => (
        <div key={idx} className="flex justify-between text-sm">
          <span className="text-white">{item.symbol}</span>
          {type === 'change' && (
            <span className={item.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {item.change >= 0 ? '+' : ''}{item.change}%
            </span>
          )}
          {type === 'time' && <span className="text-gray-400 text-xs">{item.time}</span>}
          {type === 'views' && <span className="text-gray-400 text-xs">{item.views}</span>}
        </div>
      ))}
    </div>
  </div>
);

export default React.memo(HeroCards);