// src/hooks/useWallet.js
import { useWalletContext } from '../context/WalletContext';

export const useWallet = () => {
  return useWalletContext();
};