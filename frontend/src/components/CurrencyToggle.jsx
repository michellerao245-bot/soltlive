// src/components/CurrencyToggle.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';

// ✅ Sabhi currencies ki real-time rates fetch karo
const fetchAllRates = async () => {
  try {
    // CoinGecko se USD ke against sabhi rates
    const response = await fetch(
      'https://api.coingecko.com/api/v3/exchange_rates'
    );
    const data = await response.json();
    const rates = data.rates || {};
    
    // ✅ Rate mapping (CoinGecko se)
    return {
      USD: 1,
      EUR: rates.eur?.value || 0.93,
      GBP: rates.gbp?.value || 0.79,
      INR: rates.inr?.value || 83.5,
      JPY: rates.jpy?.value || 157.5,
      AUD: rates.aud?.value || 1.51,
      CAD: rates.cad?.value || 1.37,
      CHF: rates.chf?.value || 0.91,
      CNY: rates.cny?.value || 7.27,
      KRW: rates.krw?.value || 1380,
    };
  } catch (error) {
    console.error('Rate fetch error:', error);
    // ✅ Fallback rates
    return {
      USD: 1, EUR: 0.93, GBP: 0.79, INR: 83.5,
      JPY: 157.5, AUD: 1.51, CAD: 1.37, CHF: 0.91,
      CNY: 7.27, KRW: 1380,
    };
  }
};

const currencies = {
  USD: { symbol: '$', label: 'USD' },
  EUR: { symbol: '€', label: 'EUR' },
  GBP: { symbol: '£', label: 'GBP' },
  INR: { symbol: '₹', label: 'INR' },
  JPY: { symbol: '¥', label: 'JPY' },
  AUD: { symbol: 'A$', label: 'AUD' },
  CAD: { symbol: 'C$', label: 'CAD' },
  CHF: { symbol: 'Fr', label: 'CHF' },
  CNY: { symbol: '¥', label: 'CNY' },
  KRW: { symbol: '₩', label: 'KRW' },
};

const CurrencyToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('preferredCurrency') || 'USD';
  });
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ Sabhi rates fetch karo
  useEffect(() => {
    const loadRates = async () => {
      const newRates = await fetchAllRates();
      setRates(newRates);
      setLoading(false);
    };
    
    loadRates();

    // ✅ Har 5 minute me update karo
    const interval = setInterval(async () => {
      const newRates = await fetchAllRates();
      setRates(newRates);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Currency change event
  useEffect(() => {
    localStorage.setItem('preferredCurrency', selectedCurrency);
    const rate = rates[selectedCurrency] || 1;
    window.dispatchEvent(new CustomEvent('currencyChange', {
      detail: { currency: selectedCurrency, rate }
    }));
  }, [selectedCurrency, rates]);

  const handleSelect = (key) => {
    setSelectedCurrency(key);
    setIsOpen(false);
  };

  const currentRate = rates[selectedCurrency] || 1;
  const currentSymbol = currencies[selectedCurrency]?.symbol || '$';

  // ✅ Loading state
  if (loading) {
    return (
      <div className="text-gray-400 text-xs px-2 py-1">
        <span className="animate-pulse">⟳</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white flex items-center gap-1 transition text-xs px-2 py-1 rounded hover:bg-[#1e232e]"
      >
        <DollarSign size={14} />
        <span className="font-medium">{selectedCurrency}</span>
        <ChevronDown size={12} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-28 bg-[#1e232e] border border-gray-700 rounded-lg shadow-xl z-30 py-1 max-h-60 overflow-y-auto">
          {Object.keys(currencies).map((key) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full px-3 py-1.5 text-xs text-left hover:bg-[#2a2f3a] transition flex items-center justify-between ${
                selectedCurrency === key ? 'text-green-400' : 'text-gray-300'
              }`}
            >
              <span>{currencies[key].symbol}</span>
              <span>{key}</span>
              <span className="text-[10px] text-gray-500">
                {rates[key]?.toFixed(2) || '-'}
              </span>
              {selectedCurrency === key && (
                <span className="text-green-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyToggle;