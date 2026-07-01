// src/utils/paymentHelper.js

import {
  getPaymentToken,
  getPaymentNetwork,
  getOwnerWallet,
  getAdvertisementPlans,
} from "../config/payment";

/**
 * Format Amount
 */
export const formatAmount = (amount) => {
  const value = Number(amount);

  if (Number.isNaN(value)) return "0";

  if (value >= 1) {
    return value.toFixed(2);
  }

  return value.toFixed(6);
};

/**
 * Payment Token
 */
export const getTokenSymbol = () => {
  return getPaymentToken();
};

/**
 * Payment Network
 */
export const getNetworkName = () => {
  return getPaymentNetwork();
};

/**
 * Owner Wallet
 */
export const getWalletAddress = () => {
  return getOwnerWallet();
};

/**
 * Advertisement Plans
 */
export const getPlans = () => {
  return getAdvertisementPlans();
};

/**
 * Get Plan Price
 */
export const getPrice = (planId) => {
  const plans = getAdvertisementPlans();
  return plans[planId]?.price || 0;
};

/**
 * Validate Wallet Address
 */
export const isValidWallet = (address) => {
  if (!address) return false;

  // Ethereum / BSC
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return true;
  }

  // Solana
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return true;
  }

  return false;
};

/**
 * Short Wallet
 */
export const shortWallet = (address) => {
  if (!address) return "";

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Copy Wallet
 */
export const copyWallet = async () => {
  try {
    await navigator.clipboard.writeText(getOwnerWallet());
    return true;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
};

/**
 * Calculate Expiry Date
 */
export const calculateExpiry = (planId) => {
  const date = new Date();

  switch (planId) {
    case "1_DAY":
      date.setDate(date.getDate() + 1);
      break;

    case "7_DAYS":
      date.setDate(date.getDate() + 7);
      break;

    case "30_DAYS":
      date.setDate(date.getDate() + 30);
      break;

    default:
      break;
  }

  return date;
};

/**
 * Format Date
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};