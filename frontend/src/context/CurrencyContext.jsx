import React, { createContext, useState, useContext } from 'react';

const currencies = {
  USD: { symbol: '$', rate: 1, label: 'USD' },
  EUR: { symbol: '€', rate: 0.93, label: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP' },
  INR: { symbol: '₹', rate: 83.5, label: 'INR' },
  BTC: { symbol: '₿', rate: 0.000015, label: 'BTC' },
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('preferredCurrency') || 'USD';
  });

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
  };

  const convertPrice = (price) => {
    if (!price) return 'N/A';
    const rate = currencies[currency]?.rate || 1;
    const symbol = currencies[currency]?.symbol || '$';
    const converted = price * rate;
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, convertPrice, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);