import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsBar from '../components/StatsBar';
import TrendingBar from '../components/TrendingBar';
import TopCards from '../components/TopCards';
import TokenTable from '../components/TokenTable';
import WhaleActivity from '../components/WhaleActivity';
import Footer from '../components/Footer';
import { useRealTime } from '../hooks/useRealTime';

const generateTokens = () => {
  const symbols = ['BNB', 'PEPE', 'DOGE', 'FLOKI', 'SHIB', 'SOL', 'AVAX', 'MATIC'];
  const names = ['Binance Coin', 'Pepe', 'Dogecoin', 'Floki', 'Shiba Inu', 'Solana', 'Avalanche', 'Polygon'];
  const chains = ['bsc', 'ethereum', 'bsc', 'ethereum', 'ethereum', 'solana', 'avalanche', 'polygon'];
  const dexs = ['Pancake', 'Uniswap', 'Pancake', 'Uniswap', 'Uniswap', 'Raydium', 'Trader Joe', 'Quickswap'];

  return symbols.map((sym, i) => ({
    symbol: sym,
    name: names[i],
    price: 100 + Math.random() * 500,
    change5m: (Math.random() - 0.5) * 2,
    change1h: (Math.random() - 0.5) * 4,
    change6h: (Math.random() - 0.5) * 8,
    change24h: (Math.random() - 0.5) * 15,
    volume: 100000 + Math.random() * 5000000,
    liquidity: 1000000 + Math.random() * 50000000,
    fdv: 1000000000 + Math.random() * 100000000000,
    marketCap: 500000000 + Math.random() * 50000000000,
    transactions: Math.floor(100 + Math.random() * 5000),
    buyers: Math.floor(50 + Math.random() * 500),
    sellers: Math.floor(50 + Math.random() * 400),
    age: `${Math.floor(1 + Math.random() * 20)}${['m', 'y'][Math.floor(Math.random() * 2)]}`,
    chain: chains[i],
    dex: dexs[i],
    pairAddress: `0x${Math.random().toString(16).slice(2, 10)}...`,
    sparkline: Array.from({ length: 30 }, () => Math.random() * 100 + 50),
  }));
};

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [chainFilter, setChainFilter] = useState('all');
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist')) || []; } catch { return []; }
  });
  const navigate = useNavigate();

  const { data, setData } = useRealTime({ tokens: generateTokens() });

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
  }, []);

  const handleChainFilter = useCallback((chain) => setChainFilter(chain), []);

  const toggleWatchlist = useCallback((address) => {
    const newList = watchlist.includes(address) ? watchlist.filter(a => a !== address) : [...watchlist, address];
    setWatchlist(newList);
    localStorage.setItem('watchlist', JSON.stringify(newList));
  }, [watchlist]);

  const filteredTokens = useCallback(() => {
    return data.tokens.filter(t => {
      const matchChain = chainFilter === 'all' || t.chain === chainFilter;
      return matchChain;
    });
  }, [data.tokens, chainFilter]);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          onChainFilter={handleChainFilter}
          chainFilter={chainFilter}
          toggleTheme={toggleTheme}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <StatsBar />
        <TrendingBar />
        <TopCards />

        <div className="flex-1 p-4 pt-0">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="bg-[#131722] border border-gray-800 rounded-xl overflow-hidden">
                <TokenTable
                  tokens={filteredTokens()}
                  onSelect={(token) => navigate(`/token/${token.pairAddress}`)}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                />
              </div>
            </div>
            <div className="w-full lg:w-72 xl:w-80 space-y-4">
              <WhaleActivity />
              {/* Additional widgets can go here */}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;