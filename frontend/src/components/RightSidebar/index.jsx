import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import WhaleActivity from "../WhaleActivity";
import YourWatchlist from "./YourWatchlist";
import PortfolioSnapshot from "./PortfolioSnapshot";
import TokenSignals from "./TokenSignals";
import MarketHeatmap from "./MarketHeatmap";
import SubscriptionCard from "./SubscriptionCard";
import TransactionFee from "./TransactionFee";

// ====================================
// 📢 Sponsored Banner
// ====================================

const SponsoredBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-wider text-yellow-400">
          Sponsored
        </span>

        <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
          AD
        </span>
      </div>

      {/* Banner */}
      <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-5 text-center">

        <div className="text-4xl mb-3">
          🚀
        </div>

        <h2 className="text-white font-bold text-lg">
          Advertise Your Project
        </h2>

        <p className="text-gray-400 text-xs mt-2">
          Promote your Token, NFT, Exchange, Website or Telegram Channel
          to thousands of crypto traders.
        </p>

        <div className="mt-4 space-y-1 text-[11px] text-gray-300">
          <p>✅ Banner Ads</p>
          <p>✅ Featured Listings</p>
          <p>✅ Homepage Promotion</p>
          <p>✅ Fast Approval</p>
        </div>

        <button
          onClick={() => navigate("/advertise")}
          className="w-full mt-5 bg-purple-600 hover:bg-purple-700 transition rounded-lg py-2 font-semibold text-white"
        >
          Get Started →
        </button>

        <p className="text-[10px] text-gray-500 mt-3">
          Reach thousands of crypto investors every day.
        </p>
      </div>
    </div>
  );
};

// ====================================
// ➕ Add Token Box
// ====================================

const AddTokenBox = ({ onTokenAdd }) => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToken = async () => {
    if (!tokenAddress.trim()) return;

    setIsAdding(true);

    try {
      const response = await fetch(
        "https://ecobackend-two.vercel.app/api/tokens/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: tokenAddress.trim(),
          }),
        }
      );

      if (response.ok) {
        alert("✅ Token added successfully!");
        setTokenAddress("");

        if (onTokenAdd) {
          onTokenAdd();
        }
      } else {
        alert("❌ Failed to add token");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error adding token");
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
          placeholder="Enter token contract address..."
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="flex-1 bg-[#1e232e] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-green-500"
        />

        <button
          onClick={handleAddToken}
          disabled={isAdding || !tokenAddress.trim()}
          className="bg-green-500/20 text-green-400 px-4 rounded-lg text-xs hover:bg-green-500/30 transition disabled:opacity-50"
        >
          {isAdding ? "⏳" : "Add"}
        </button>
      </div>

      <p className="text-[10px] text-gray-500 mt-2">
        Add any BSC, Ethereum, Base, Arbitrum or Solana token.
      </p>
    </div>
  );
};

// ====================================
// RIGHT SIDEBAR
// ====================================

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