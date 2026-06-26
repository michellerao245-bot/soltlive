// src/hooks/useTokens.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Backend API URL (Vercel wala)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://ecobackend-two.vercel.app/api';

export const useTokens = (chain, limit = 50) => {
  const [tokens, setTokens] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchTokens = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/tokens`, {
        params: { chain, page, limit, sort: 'volume24h', order: 'desc' },
      });
      const { data, pagination } = response.data;
      
      setTokens(prev => [...prev, ...data]);
      setHasMore(page < pagination.totalPages);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chain, page, limit, loading, hasMore]);

  // Reset when chain changes
  useEffect(() => {
    setTokens([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [chain]);

  // Initial fetch
  useEffect(() => {
    fetchTokens();
  }, [chain]);

  return { tokens, loading, hasMore, error, fetchMore: fetchTokens };
};