import { useState, useEffect } from 'react';
import api from '../services/api';

const useTokenData = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await api.get('/market-data'); // API call
      setTokens(data);
    } catch (err) {
      console.error("Error fetching tokens:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Pehli baar load hoga

    // Har 30 seconds mein update karega
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { tokens, loading, refetch: fetchData };
};

export default useTokenData;