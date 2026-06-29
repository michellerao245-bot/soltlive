// src/utils/currency.js
export const getCurrency = () => {
  return localStorage.getItem('preferredCurrency') || 'USD';
};

export const getCurrencyRate = () => {
  const rates = {
    USD: 1, EUR: 0.93, GBP: 0.79, INR: 83.5,
    JPY: 157.5, AUD: 1.51, CAD: 1.37, CHF: 0.91,
    CNY: 7.27, KRW: 1380,
  };
  const currency = getCurrency();
  return rates[currency] || 1;
};

export const getCurrencySymbol = () => {
  const symbols = {
    USD: '$', EUR: '€', GBP: '£', INR: '₹',
    JPY: '¥', AUD: 'A$', CAD: 'C$', CHF: 'Fr',
    CNY: '¥', KRW: '₩',
  };
  const currency = getCurrency();
  return symbols[currency] || '$';
};

export const formatCurrency = (value) => {
  if (!value || value === 0) return 'N/A';
  const rate = getCurrencyRate();
  const symbol = getCurrencySymbol();
  const converted = value * rate;
  
  if (converted >= 1e9) return `${symbol}${(converted / 1e9).toFixed(2)}B`;
  if (converted >= 1e6) return `${symbol}${(converted / 1e6).toFixed(2)}M`;
  if (converted >= 1e3) return `${symbol}${(converted / 1e3).toFixed(2)}K`;
  return `${symbol}${converted.toFixed(2)}`;
};