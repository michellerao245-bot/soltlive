// src/services/paymentService.js
import { ethers } from 'ethers';
import walletService from './walletService';

class PaymentService {
  // Get SOLT token contract
  getTokenContract(signer) {
    const tokenAddress = import.meta.env.VITE_PAYMENT_TOKEN;
    const abi = [
      'function transfer(address to, uint256 amount) returns (bool)',
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function allowance(address owner, address spender) view returns (uint256)',
      'function approve(address spender, uint256 amount) returns (bool)'
    ];
    
    return new ethers.Contract(tokenAddress, abi, signer);
  }

  // Get payment wallet address
  getPaymentWallet() {
    return import.meta.env.VITE_PAYMENT_WALLET;
  }

  // Get SOLT price in USD
  getSOLTPrice() {
    return parseFloat(import.meta.env.VITE_SOLT_PRICE_USD || '0.032');
  }

  // Calculate SOLT amount from USD
  calculateSOLTAmount(usdAmount) {
    const price = this.getSOLTPrice();
    if (price === 0) return '0';
    const soltAmount = usdAmount / price;
    return soltAmount.toString();
  }

  // Get decimals
  getDecimals() {
    return parseInt(import.meta.env.VITE_PAYMENT_DECIMALS || '18');
  }

  // Make payment
  async makePayment(usdAmount, paymentFor = 'Advertise') {
    try {
      // Check if wallet is connected
      if (!walletService.isConnected) {
        throw new Error('Please connect your wallet first');
      }

      // Get signer
      const signer = walletService.signer;
      if (!signer) {
        throw new Error('Wallet signer not available');
      }

      // Calculate SOLT amount
      const soltAmount = this.calculateSOLTAmount(usdAmount);
      if (soltAmount === '0') {
        throw new Error('Invalid amount');
      }

      // Get contract
      const contract = this.getTokenContract(signer);
      const paymentWallet = this.getPaymentWallet();
      const decimals = this.getDecimals();

      // Convert amount to wei
      const amountInWei = ethers.utils.parseUnits(soltAmount, decimals);

      // Check balance
      const walletAddress = walletService.address;
      const balance = await contract.balanceOf(walletAddress);
      
      if (balance.lt(amountInWei)) {
        throw new Error(`Insufficient SOLT balance. Need ${parseFloat(soltAmount).toFixed(2)} SOLT`);
      }

      // Check allowance
      const allowance = await contract.allowance(walletAddress, walletService.address);
      if (allowance.lt(amountInWei)) {
        // Approve first
        const approveTx = await contract.approve(walletService.address, amountInWei);
        await approveTx.wait();
      }

      // Send transaction
      const tx = await contract.transfer(paymentWallet, amountInWei);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        return {
          success: true,
          transactionHash: receipt.transactionHash,
          amount: soltAmount,
          usdAmount: usdAmount,
          paymentFor: paymentFor,
          from: walletAddress,
          to: paymentWallet
        };
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // User rejected transaction
      if (error.code === 4001) {
        throw new Error('You rejected the transaction. Payment cancelled.');
      }
      
      throw error;
    }
  }

  // Validate payment
  async validatePayment(transactionHash) {
    try {
      const provider = walletService.provider;
      if (!provider) {
        throw new Error('Provider not available');
      }

      const receipt = await provider.getTransactionReceipt(transactionHash);
      
      if (!receipt) {
        return { success: false, message: 'Transaction not found' };
      }

      if (receipt.status === 1) {
        return { success: true, receipt };
      } else {
        return { success: false, message: 'Transaction failed' };
      }
    } catch (error) {
      console.error('Validation error:', error);
      return { success: false, message: error.message };
    }
  }

  // Get payment plan details
  getPaymentPlans() {
    return [
      {
        id: 'basic',
        name: 'Basic',
        price: 50,
        features: ['1 Banner Ad', 'Basic Analytics', '24/7 Support'],
        duration: '7 days'
      },
      {
        id: 'standard',
        name: 'Standard',
        price: 150,
        features: ['2 Banner Ads', 'Video Ad', 'Advanced Analytics', 'Priority Support'],
        duration: '30 days'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 350,
        features: ['5 Banner Ads', 'Video Ad + Boost', 'Full Analytics', 'Dedicated Support', 'Featured Listing'],
        duration: '90 days'
      }
    ];
  }

  // Check if transaction is confirmed
  async isTransactionConfirmed(txHash) {
    try {
      const provider = walletService.provider;
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) return false;
      
      // Check if transaction has enough confirmations (at least 12)
      const currentBlock = await provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;
      
      return confirmations >= 12;
    } catch (error) {
      console.error('Error checking confirmations:', error);
      return false;
    }
  }
}

// Export singleton
const paymentService = new PaymentService();
export default paymentService;