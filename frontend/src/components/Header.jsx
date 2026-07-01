// src/components/Wallet/WalletButton.jsx
import React, { useState } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { LogIn, LogOut, Wallet, ChevronDown, Copy, Check, ExternalLink } from 'lucide-react';

const WalletButton = () => {
  const { wallet, loading, connect, disconnect, formatAddress, isMetaMaskInstalled } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
      
      // Better error messages
      let errorMessage = 'Failed to connect wallet.';
      if (error.code === 4001) {
        errorMessage = 'Connection rejected. Please approve the connection in MetaMask.';
      } else if (error.message?.includes('already pending')) {
        errorMessage = 'Connection request already pending. Please check MetaMask.';
      } else if (error.message?.includes('User denied')) {
        errorMessage = 'You denied the connection request. Please try again.';
      } else {
        errorMessage = error.message || 'Failed to connect wallet. Please try again.';
      }
      
      alert(errorMessage);
    }
  };

  const handleDisconnect = async () => {
    setShowDropdown(false);
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      await disconnect();
    }
  };

  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openExplorer = () => {
    if (wallet.address) {
      window.open(`https://bscscan.com/address/${wallet.address}`, '_blank');
    }
  };

  // Loading state
  if (loading) {
    return (
      <button
        disabled
        className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 cursor-wait min-w-[130px] justify-center"
      >
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-400 border-t-transparent"></div>
        <span className="text-sm">Connecting...</span>
      </button>
    );
  }

  // MetaMask not installed
  if (!isMetaMaskInstalled) {
    return (
      <button
        onClick={handleConnect}
        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105"
      >
        <Wallet size={16} />
        <span className="text-sm font-medium">Install MetaMask</span>
      </button>
    );
  }

  // Wallet connected
  if (wallet.isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-3 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 group border border-green-500/20 hover:border-green-500/40"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-mono text-sm font-medium">
            {formatAddress(wallet.address)}
          </span>
          <ChevronDown 
            size={14} 
            className={`transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-[#1a1a2e] border border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-gray-700/50">
                <p className="text-xs text-gray-400 mb-1">Connected Wallet</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-sm text-white truncate flex-1">
                    {wallet.address}
                  </p>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} className="text-gray-400 hover:text-white" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-400 mt-1">Copied to clipboard!</p>
                )}
              </div>

              <div className="p-2">
                <button
                  onClick={openExplorer}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>View on BscScan</span>
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut size={14} />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Default: Not connected
  return (
    <button
      onClick={handleConnect}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 active:scale-95"
    >
      <LogIn size={16} />
      <span className="text-sm font-medium">Connect</span>
    </button>
  );
};

export default WalletButton;