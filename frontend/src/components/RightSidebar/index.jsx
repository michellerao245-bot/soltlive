// src/components/RightSidebar/index.jsx (PART 1)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import WhaleActivity from '../WhaleActivity';
import YourWatchlist from './YourWatchlist';
import PortfolioSnapshot from './PortfolioSnapshot';
import TokenSignals from './TokenSignals';
import MarketHeatmap from './MarketHeatmap';
import SubscriptionCard from './SubscriptionCard';
import TransactionFee from './TransactionFee';

// ============================
// 📢 SPONSORED BANNER
// ============================
const SponsoredBanner = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/advertise');
  };

  return (
    <div className="bg-[#1a1f2e] border border-gray-700 rounded-xl p-4">
      {/* Sponsored Label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          📢 Sponsored
        </span>

        <span className="text-[8px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
          AD
        </span>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-lg p-4 text-center border border-purple-500/20">

        <div className="text-3xl mb-2">
          📈
        </div>

        <h4 className="text-sm font-bold text-white">
          Advertise with us
        </h4>

        <p className="text-xs text-gray-300 mt-1">
          Increase your reach & grow your brand
        </p>

        <p className="text-[10px] text-gray-400 mt-1">
          🚀 Reach thousands of crypto traders
        </p>

        <button
          onClick={handleGetStarted}
          className="mt-4 bg-purple-500/30 text-purple-400 text-xs font-medium px-4 py-2 rounded-lg hover:bg-purple-500/50 transition-all duration-200 hover:scale-105"
        >
          Get Started →
        </button>
      </div>

      <p className="text-[9px] text-gray-500 text-center mt-2">
        Promote your token • NFT • Exchange • Website
      </p>
    </div>
  );
};

// ============================
// ➕ ADD TOKEN BOX
// ============================
const AddTokenBox = ({ onTokenAdd }) => {
  const [tokenAddress, setTokenAddress] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToken = async () => {
    if (!tokenAddress.trim()) return;

    setIsAdding(true);

    try {
      const response = await fetch(
        'https://ecobackend-two.vercel.app/api/tokens/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: tokenAddress.trim(),
          }),
        }
      );

      if (response.ok) {
        alert('✅ Token added successfully!');
        setTokenAddress('');

        if (onTokenAdd) {
          onTokenAdd();
        }
      } else {
        alert('❌ Failed to add token');
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error adding token');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">

      <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
        ➕ Add Token
      </h3>

      <div className="flex gap-2">

        <input
          type="text"
          placeholder="Enter token address..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="flex-1 bg-[#1e232e] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-green-500 placeholder-gray-500"
        />

        <button
          onClick={handleAddToken}
          disabled={isAdding || !tokenAddress.trim()}
          className="bg-green-500/20 text-green-400 px-3 py-2 rounded-lg text-xs hover:bg-green-500/30 disabled:opacity-50"
        >
          {isAdding ? '⏳' : 'Add'}
        </button>

      </div>

      <p className="text-[10px] text-gray-500 mt-2">
        Add any BSC / ETH / Solana token to track.
      </p>

    </div>
  );
};

// ============================
// RIGHT SIDEBAR Part 2
// ============================

const RightSidebar = ({ watchlist, tokens, onTokenAdd }) => {
  return (
    <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">

      {/* 📢 Advertise */}
      <SponsoredBanner />

      {/* ➕ Add Token */}
      <AddTokenBox onTokenAdd={onTokenAdd} />

      {/* 👑 Subscription */}
      <SubscriptionCard />

      {/* 💼 Portfolio */}
      <PortfolioSnapshot />

      {/* ⭐ Watchlist */}
      <YourWatchlist
        watchlist={watchlist}
        tokens={tokens}
      />

      {/* 💳 Transaction Fee */}
      <TransactionFee />

      {/* 🎯 Token Signals */}
      <TokenSignals
        tokens={tokens}
      />

      {/* 🌡️ Market Heatmap */}
      <MarketHeatmap
        tokens={tokens}
      />

      {/* 🐋 Whale Activity */}
      <WhaleActivity />

    </div>
  );
};

export default React.memo(RightSidebar);