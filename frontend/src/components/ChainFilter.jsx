import React from 'react';

const chains = ['all', 'ethereum', 'bsc', 'base', 'solana', 'arbitrum', 'polygon'];

const ChainFilter = ({ chainFilter, onChainFilter }) => {
  return (
    <div className="flex items-center gap-1 bg-[#1e232e] rounded-lg p-1">
      {chains.map((chain) => (
        <button
          key={chain}
          onClick={() => onChainFilter(chain)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition ${
            chainFilter === chain ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          {chain === 'all' ? 'All' : chain.charAt(0).toUpperCase() + chain.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default React.memo(ChainFilter);