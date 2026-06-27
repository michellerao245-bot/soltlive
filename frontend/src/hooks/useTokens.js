// src/hooks/useTokens.js
import { useState, useEffect, useCallback } from 'react';
import { fetchTokens } from '../services/api';

export const useTokens = (chain, limit = 50) => {
  const [tokens, setTokens] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const loadTokens = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetchTokens(chain, page, limit);
      if (response.success) {
        setTokens(prev => [...prev, ...response.data]);
        setHasMore(page < response.pagination.totalPages);
        setPage(prev => prev + 1);
      } else {
        setError(response.error || 'Failed to fetch');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chain, page, limit, loading, hasMore]);

  useEffect(() => {
    setTokens([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [chain]);

  useEffect(() => {
    loadTokens();
  }, [chain]);

  return { tokens, loading, hasMore, error, fetchMore: loadTokens };
};