// src/services/walletService.js
import { ethers } from 'ethers';

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.isConnected = false;
    this.chainId = null;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  }

  // Connect wallet
  async connectWallet() {
    try {
      if (!this.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      this.address = accounts[0];
      
      // Setup provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.isConnected = true;

      // Get chain ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      this.chainId = parseInt(chainId, 16);

      // Check if on correct network (BSC)
      const targetChainId = parseInt(import.meta.env.VITE_CHAIN_ID || '56');
      if (this.chainId !== targetChainId) {
        await this.switchNetwork(targetChainId);
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

      return {
        address: this.address,
        chainId: this.chainId,
        isConnected: this.isConnected
      };
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  }

  // Switch network
  async switchNetwork(targetChainId = 56) {
    try {
      const chainIdHex = `0x${targetChainId.toString(16)}`;
      
      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
      } catch (switchError) {
        // If network is not added, add it
        if (switchError.code === 4902) {
          await this.addNetwork(targetChainId);
        } else {
          throw switchError;
        }
      }

      this.chainId = targetChainId;
      return true;
    } catch (error) {
      console.error('Network switch error:', error);
      throw error;
    }
  }

  // Add BSC network
  async addNetwork(chainId = 56) {
    try {
      const chainIdHex = `0x${chainId.toString(16)}`;
      
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: chainIdHex,
          chainName: 'Binance Smart Chain',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://bsc-dataseed1.binance.org'],
          blockExplorerUrls: ['https://bscscan.com']
        }]
      });
    } catch (error) {
      console.error('Add network error:', error);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnectWallet() {
    try {
      // Remove event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', this.handleChainChanged);
      }
      
      this.provider = null;
      this.signer = null;
      this.address = null;
      this.isConnected = false;
      this.chainId = null;
      
      return true;
    } catch (error) {
      console.error('Disconnect error:', error);
      throw error;
    }
  }

  // Handle account changes
  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // User disconnected from MetaMask
      this.disconnectWallet();
    } else {
      // Account changed
      this.address = accounts[0];
      // Update UI or trigger re-render
      window.dispatchEvent(new Event('walletAccountChanged'));
    }
  }

  // Handle chain changes
  handleChainChanged(chainId) {
    this.chainId = parseInt(chainId, 16);
    window.dispatchEvent(new Event('walletChainChanged'));
  }

  // Get current wallet address
  getAddress() {
    return this.address;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      address: this.address,
      chainId: this.chainId
    };
  }

  // Get wallet balance
  async getBalance(address = null) {
    try {
      const targetAddress = address || this.address;
      if (!targetAddress) throw new Error('No wallet address available');
      
      const balance = await this.provider.getBalance(targetAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Balance fetch error:', error);
      throw error;
    }
  }

  // Get token balance (for SOLT)
  async getTokenBalance(tokenAddress = null) {
    try {
      if (!this.address) throw new Error('Wallet not connected');
      
      const contractAddress = tokenAddress || import.meta.env.VITE_PAYMENT_TOKEN;
      if (!contractAddress) throw new Error('Token address not configured');
      
      const contract = new ethers.Contract(
        contractAddress,
        ['function balanceOf(address) view returns (uint256)'],
        this.provider
      );
      
      const balance = await contract.balanceOf(this.address);
      const decimals = parseInt(import.meta.env.VITE_PAYMENT_DECIMALS || '18');
      return ethers.utils.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Token balance fetch error:', error);
      return '0';
    }
  }

  // Format address for display
  formatAddress(address = null) {
    const addr = address || this.address;
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }
}

// Export singleton instance
const walletService = new WalletService();
export default walletService;