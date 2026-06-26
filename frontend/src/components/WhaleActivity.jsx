import React, { useState, useEffect } from 'react';

const WhaleActivity = () => {
  const [whales, setWhales] = useState([
    { wallet: '0x83A...7E2', amount: '+$1.2M', time: '2 min ago', type: 'buy' },
    { wallet: '0x91D...8AF', amount: '-$0.8M', time: '15 min ago', type: 'sell' },
    { wallet: '0xA12...5CE', amount: '+$2.4M', time: '1h ago', type: 'buy' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const actions = ['buy', 'sell'];
      const amounts = ['+$0.3M', '+$0.7M', '+$1.5M', '-$0.4M', '-$0.9M', '+$2.1M'];
      const wallets = ['0x7B1...3F9', '0xC4D...2A8', '0xE5F...6B1'];
      const newWhale = {
        wallet: wallets[Math.floor(Math.random() * wallets.length)],
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        time: 'Just now',
        type: actions[Math.floor(Math.random() * actions.length)],
      };
      setWhales(prev => [newWhale, ...prev.slice(0, 4)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1e232e] border border-gray-700 rounded-xl p-3">
      <h3 className="text-xs font-medium text-gray-300 flex items-center gap-2 mb-3">
        <span className="text-xl">🐋</span> Whale Activity
        <span className="text-[10px] text-green-400 ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> LIVE
        </span>
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        {whales.map((w, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs border-b border-gray-800 pb-2 last:border-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-gray-400 text-[11px]">{w.wallet}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${w.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {w.type === 'buy' ? 'BUY' : 'SELL'}
              </span>
            </div>
            <div className="text-right">
              <span className={w.type === 'buy' ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                {w.amount}
              </span>
              <div className="text-[10px] text-gray-500">{w.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(WhaleActivity);