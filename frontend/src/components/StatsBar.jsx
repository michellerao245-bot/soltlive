import React from 'react';

const stats = [
  { label: '24h Volume', value: '$5.8B' },
  { label: 'Pairs', value: '1.2M' },
  { label: 'Tokens', value: '670K' },
  { label: 'Transactions', value: '8.4M' },
];

const StatsBar = () => (
  <div className="bg-[#131722] border-b border-gray-800 px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <div key={stat.label}>
        <p className="text-gray-400 text-xs">{stat.label}</p>
        <p className="text-lg font-bold text-white">{stat.value}</p>
      </div>
    ))}
  </div>
);

export default React.memo(StatsBar);