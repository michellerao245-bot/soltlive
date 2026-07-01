// src/components/Wallet/WalletButton.jsx
import React from 'react';
import { useWallet } from '../../hooks/useWallet';
import { LogIn, LogOut, Wallet } from 'lucide-react';

const WalletButton = () => {
  const { wallet, loading, connect, disconnect, formatAddress, isMetaMaskInstalled } = useWallet();

  const handleClick = async () => {
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    if (wallet.isConnected) {
      // Show disconnect option
      if (window.confirm('Are you sure you want to disconnect your wallet?')) {
        await disconnect();
      }
    } else {
      try {
        await connect();
      } catch (error) {
        console.error('Connection failed:', error);
        alert(error.message || 'Failed to connect wallet. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 cursor-wait"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-400 border-t-transparent"></div>
        <span>Connecting...</span>
      </button>
    );
  }

  if (!isMetaMaskInstalled) {
    return (
      <button
        onClick={handleClick}
        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300"
      >
        <Wallet size={14} />
        <span>Install MetaMask</span>
      </button>
    );
  }

  if (wallet.isConnected) {
    return (
      <button
        onClick={handleClick}
        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 group"
      >
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="font-mono text-sm">
          {formatAddress(wallet.address)}
        </span>
        <LogOut size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300"
    >
      <LogIn size={14} />
      <span>Connect</span>
    </button>
  );
};

export default WalletButton;