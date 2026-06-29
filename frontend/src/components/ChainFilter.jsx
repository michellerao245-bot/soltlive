// src/components/ChainFilter.jsx
import React from 'react';

const chains = [
  { id: 'all', label: 'All' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'bsc', label: 'BSC' },
  { id: 'base', label: 'Base' },
  { id: 'solana', label: 'Solana' },
  { id: 'arbitrum', label: 'Arbitrum' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'avalanche', label: 'Avalanche' },
  { id: 'optimism', label: 'Optimism' },
];

const ChainFilter = ({ chainFilter, onChainFilter }) => {
  return (
    <div className="flex items-center gap-1 bg-[#1e232e] rounded-lg p-1 overflow-x-auto">
      {chains.map((chain) => (
        <button
          key={chain.id}
          onClick={() => onChainFilter(chain.id)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition whitespace-nowrap ${
            chainFilter === chain.id ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white'
          }`}
        >
          {chain.label}
        </button>
      ))}
    </div>
  );
};

export default React.memo(ChainFilter);