// src/config/payment.js

export const PAYMENT_CONFIG = {
  // Wallet
  ownerWallet: import.meta.env.VITE_OWNER_WALLET || "",

  // Network
  network: import.meta.env.VITE_PAYMENT_NETWORK || "BSC",

  // Payment Token
  token: import.meta.env.VITE_PAYMENT_TOKEN || "BNB",

  // Advertisement Prices
  plans: {
    "1_DAY": {
      name: "1 Day",
      price: Number(import.meta.env.VITE_AD_PRICE_1_DAY || 5),
    },

    "7_DAYS": {
      name: "7 Days",
      price: Number(import.meta.env.VITE_AD_PRICE_7_DAY || 20),
    },

    "30_DAYS": {
      name: "30 Days",
      price: Number(import.meta.env.VITE_AD_PRICE_30_DAY || 50),
    },
  },

  // Payment Status
  enabled: true,
};

// Helper Functions
export const getOwnerWallet = () => PAYMENT_CONFIG.ownerWallet;

export const getPaymentToken = () => PAYMENT_CONFIG.token;

export const getPaymentNetwork = () => PAYMENT_CONFIG.network;

export const getAdvertisementPlans = () => PAYMENT_CONFIG.plans;

export const getPlan = (plan) => PAYMENT_CONFIG.plans[plan];

export const getPlanPrice = (plan) =>
  PAYMENT_CONFIG.plans[plan]?.price || 0;