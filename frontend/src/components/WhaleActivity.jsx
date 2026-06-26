import React from 'react';

const whales = [
  { wallet: '0x83A...7E2', amount: '+$1.2M', time: '2 min ago', type: 'buy' },
  { wallet: '0x91D...8AF', amount: '-$0.8M', time: '15 min ago', type: 'sell' },
  { wallet: '0xA12...5CE', amount: '+$2.4M', time: '1h ago', type: 'buy' },
];

const WhaleActivity = () => (
  <div className="bg-[#1e232e] border border-gray-700 rounded-xl p-4">
    <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2 mb-3">
      <span className="text-2xl">🐋</span> Whale Activity
    </h3>
    <div className="space-y-3">
      {whales.map((w, idx) => (
        <div key={idx} className="flex items-center justify-between text-sm border-b border-gray-800 pb-2 last:border-0">
          <div>
            <span className="text-gray-400">{w.wallet}</span>
            <span className={`ml-2 text-xs ${w.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
              {w.type === 'buy' ? 'BUY' : 'SELL'}
            </span>
          </div>
          <div className="text-right">
            <span className={w.type === 'buy' ? 'text-green-400' : 'text-red-400'}>{w.amount}</span>
            <div className="text-xs text-gray-500">{w.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default React.memo(WhaleActivity);