// src/hooks/useLivePrice.js
import { useState, useEffect, useRef } from 'react';

const fetchINRRate = async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/exchange_rates'
    );
    const data = await response.json();
    return data.rates?.inr?.value || 94.50;
  } catch (error) {
    console.error('Rate fetch error:', error);
    return 94.50;
  }
};

export const useLivePrice = (initialPrice) => {
  const [price, setPrice] = useState(initialPrice);
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('preferredCurrency') || 'USD';
  });
  const [rate, setRate] = useState(1);
  const intervalRef = useRef(null);

  // ✅ Currency change listen karo
  useEffect(() => {
    const handleCurrencyChange = (e) => {
      const newCurrency = e.detail?.currency || localStorage.getItem('preferredCurrency') || 'USD';
      setCurrency(newCurrency);
      
      if (newCurrency === 'INR') {
        fetchINRRate().then(newRate => setRate(newRate));
      } else {
        const rates = { USD: 1, EUR: 0.93, GBP: 0.79, JPY: 157.5 };
        setRate(rates[newCurrency] || 1);
      }
    };

    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => window.removeEventListener('currencyChange', handleCurrencyChange);
  }, []);

  // ✅ Every 10 seconds price update karo
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      // ✅ Small random change for live feel
      const change = (Math.random() - 0.5) * 0.002;
      setPrice(prev => prev * (1 + change));
    }, 10000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // ✅ Currency rate update karo
  useEffect(() => {
    if (currency === 'INR') {
      fetchINRRate().then(newRate => setRate(newRate));
    }
  }, [currency]);

  const getSymbol = () => {
    const symbols = {
      USD: '$', EUR: '€', GBP: '£', INR: '₹',
      JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'Fr',
      CNY: '¥', KRW: '₩',
    };
    return symbols[currency] || '$';
  };

  const formattedPrice = price * rate;
  const symbol = getSymbol();

  return {
    price,
    formattedPrice,
    symbol,
    currency,
    rate,
    setPrice,
  };
};