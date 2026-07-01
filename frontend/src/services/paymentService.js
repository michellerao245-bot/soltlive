// src/services/paymentService.js

import { getWalletAddress } from "../utils/paymentHelper";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://ecobackend-two.vercel.app/api";

/**
 * Submit Advertisement
 */
export const submitAdvertisement = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/advertisements`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return {
      success: response.ok,
      data: result,
      message: result.message || "Advertisement submitted",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to submit advertisement.",
    };
  }
};

/**
 * Verify Payment
 */
export const verifyPayment = async (transactionHash) => {
  try {
    const response = await fetch(`${API_BASE}/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionHash,
      }),
    });

    const result = await response.json();

    return {
      success: response.ok,
      data: result,
      message: result.message,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Payment verification failed.",
    };
  }
};

/**
 * Upload Banner
 */
export const uploadBanner = async (file) => {
  try {
    const formData = new FormData();
    formData.append("banner", file);

    const response = await fetch(`${API_BASE}/advertisements/upload`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    return {
      success: response.ok,
      url: result.url,
      message: result.message,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Banner upload failed.",
    };
  }
};

/**
 * Fetch Payment Settings
 */
export const getPaymentSettings = async () => {
  return {
    success: true,
    wallet: getWalletAddress(),
  };
};

/**
 * Fetch Advertisement Status
 */
export const getAdvertisementStatus = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/advertisements/${id}`);

    const result = await response.json();

    return {
      success: response.ok,
      data: result,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to fetch advertisement.",
    };
  }
};

/**
 * Delete Advertisement
 */
export const deleteAdvertisement = async (id) => {
  try {
    const response = await fetch(`${API_BASE}/advertisements/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    return {
      success: response.ok,
      message: result.message,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to delete advertisement.",
    };
  }
};