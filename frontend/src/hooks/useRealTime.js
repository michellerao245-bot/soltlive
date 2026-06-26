import { useState, useEffect, useRef } from 'react';

export const useRealTime = (initialData, interval = 3000) => {
  const [data, setData] = useState(initialData);
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isLive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setData(prev => {
        const newData = { ...prev };
        // Update prices with small random changes
        if (newData.tokens) {
          newData.tokens = newData.tokens.map(token => ({
            ...token,
            price: token.price * (1 + (Math.random() - 0.5) * 0.002),
            change5m: token.change5m + (Math.random() - 0.5) * 0.2,
            change1h: token.change1h + (Math.random() - 0.5) * 0.1,
            volume: token.volume * (1 + (Math.random() - 0.5) * 0.01),
            transactions: token.transactions + Math.floor(Math.random() * 5),
            buyers: token.buyers + Math.floor(Math.random() * 3),
            sellers: token.sellers + Math.floor(Math.random() * 2),
          }));
        }
        return newData;
      });
    }, interval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive]);

  return { data, setData, isLive, setIsLive };
};