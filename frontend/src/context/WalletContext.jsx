// src/context/WalletContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import walletService from '../services/walletService';

const WalletContext = createContext(null);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState({
    address: null,
    isConnected: false,
    chainId: null,
    balance: '0',
    tokenBalance: '0'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Connect wallet
  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await walletService.connectWallet();
      setWallet({
        address: result.address,
        isConnected: true,
        chainId: result.chainId,
        balance: await walletService.getBalance(result.address),
        tokenBalance: await walletService.getTokenBalance()
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    setLoading(true);
    try {
      await walletService.disconnectWallet();
      setWallet({
        address: null,
        isConnected: false,
        chainId: null,
        balance: '0',
        tokenBalance: '0'
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update wallet data
  const updateWalletData = async () => {
    if (!wallet.isConnected || !wallet.address) return;
    
    try {
      const balance = await walletService.getBalance(wallet.address);
      const tokenBalance = await walletService.getTokenBalance();
      setWallet(prev => ({
        ...prev,
        balance,
        tokenBalance
      }));
    } catch (err) {
      console.error('Failed to update wallet data:', err);
    }
  };

  // Listen for account changes
  useEffect(() => {
    const handleAccountChange = () => {
      const status = walletService.getConnectionStatus();
      if (status.isConnected && status.address) {
        setWallet(prev => ({
          ...prev,
          address: status.address,
          chainId: status.chainId,
          isConnected: true
        }));
        updateWalletData();
      } else {
        setWallet(prev => ({
          ...prev,
          address: null,
          isConnected: false
        }));
      }
    };

    const handleChainChange = () => {
      const status = walletService.getConnectionStatus();
      if (status.chainId) {
        setWallet(prev => ({
          ...prev,
          chainId: status.chainId
        }));
      }
    };

    window.addEventListener('walletAccountChanged', handleAccountChange);
    window.addEventListener('walletChainChanged', handleChainChange);

    return () => {
      window.removeEventListener('walletAccountChanged', handleAccountChange);
      window.removeEventListener('walletChainChanged', handleChainChange);
    };
  }, []);

  const value = {
    wallet,
    loading,
    error,
    connect,
    disconnect,
    updateWalletData,
    isMetaMaskInstalled: walletService.isMetaMaskInstalled(),
    formatAddress: walletService.formatAddress.bind(walletService)
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};