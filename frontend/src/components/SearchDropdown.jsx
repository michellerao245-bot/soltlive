import React, { useState, useEffect } from 'react';

const SearchDropdown = ({ searchQuery }) => {
  const [recent, setRecent] = useState([]);
  const popular = ['PEPE', 'FLOKI', 'DOGE', 'BNB', 'SOL'];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecent(stored);
  }, []);

  const addRecent = (term) => {
    const updated = [term, ...recent.filter((t) => t !== term)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Mock search results
  const results = searchQuery ? {
    tokens: ['PEPE', 'FLOKI', 'DOGE'],
    pairs: ['PEPE/USDT', 'DOGE/USDT', 'BNB/USDT'],
    wallets: ['0x83A...7E2', '0x91D...8AF'],
    contracts: ['0xbb4...', '0xab...'],
  } : null;

  return (
    <div className="absolute mt-1 w-full bg-[#1e232e] border border-gray-700 rounded-lg shadow-xl z-30 p-3 max-h-96 overflow-y-auto">
      {searchQuery && results ? (
        <div className="space-y-3">
          <Section title="Tokens" items={results.tokens} />
          <Section title="Pairs" items={results.pairs} />
          <Section title="Wallets" items={results.wallets} />
          <Section title="Contracts" items={results.contracts} />
        </div>
      ) : (
        <>
          {recent.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">Recent</p>
              {recent.map((s) => (
                <div key={s} className="px-3 py-1 hover:bg-[#2a2f3a] rounded cursor-pointer text-sm" onClick={() => addRecent(s)}>
                  {s}
                </div>
              ))}
            </div>
          )}
          <div>
            <p className="text-xs text-gray-400 mb-1">Popular</p>
            {popular.map((s) => (
              <div key={s} className="px-3 py-1 hover:bg-[#2a2f3a] rounded cursor-pointer text-sm" onClick={() => addRecent(s)}>
                {s}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Section = ({ title, items }) => (
  <div>
    <p className="text-xs text-gray-400 mb-1">{title}</p>
    {items.map((item) => (
      <div key={item} className="px-3 py-1 hover:bg-[#2a2f3a] rounded cursor-pointer text-sm flex items-center justify-between">
        <span>{item}</span>
        <span className="text-[10px] text-gray-500">→</span>
      </div>
    ))}
  </div>
);

export default React.memo(SearchDropdown);