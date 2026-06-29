// src/services/api.js
import axios from 'axios';

// ✅ CORRECT BACKEND URL
const API_BASE_URL = 'https://ecobackend-two.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Fetch tokens with pagination
export const fetchTokens = async (chain = 'all', page = 1, limit = 50) => {
  try {
    const response = await api.get('/api/tokens', {
      params: { chain, page, limit, sort: 'volume_24h', order: 'desc' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return { success: false, data: [], pagination: { total: 0 } };
  }
};

// ✅ Fetch single token details
export const fetchTokenDetails = async (address) => {
  try {
    const response = await api.get('/api/presale/check', {
      params: { address }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching token details:', error);
    return null;
  }
};

// ✅ Fetch trending tokens with fallback
export const fetchTrending = async () => {
  try {
    const response = await api.get('/api/trending');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching trending:', error);
    // ✅ Return empty array instead of throwing error
    return [];
  }
};

// ✅ Fetch gainers (top performers)
export const fetchGainers = async (chain = 'all', limit = 20) => {
  try {
    const response = await api.get('/api/tokens', {
      params: { chain, page: 1, limit, sort: 'change_24h', order: 'desc' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching gainers:', error);
    return { success: false, data: [] };
  }
};

// ✅ Fetch losers (worst performers)
export const fetchLosers = async (chain = 'all', limit = 20) => {
  try {
    const response = await api.get('/api/tokens', {
      params: { chain, page: 1, limit, sort: 'change_24h', order: 'asc' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching losers:', error);
    return { success: false, data: [] };
  }
};

// ✅ Search tokens
export const searchTokens = async (query, chain = 'all') => {
  try {
    const response = await api.get('/api/tokens', {
      params: { chain, search: query, limit: 20 }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching tokens:', error);
    return { success: false, data: [] };
  }
};

export default api;