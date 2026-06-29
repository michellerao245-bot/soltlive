// src/components/CurrencyToggle.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, ChevronDown } from 'lucide-react';

const currencies = {
  USD: { symbol: '$', rate: 1, label: 'USD' },
  EUR: { symbol: '€', rate: 0.93, label: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP' },
  INR: { symbol: '₹', rate: 83.5, label: 'INR' },
  JPY: { symbol: '¥', rate: 157.5, label: 'JPY' },
  AUD: { symbol: 'A$', rate: 1.51, label: 'AUD' },
  CAD: { symbol: 'C$', rate: 1.37, label: 'CAD' },
  CHF: { symbol: 'Fr', rate: 0.91, label: 'CHF' },
  CNY: { symbol: '¥', rate: 7.27, label: 'CNY' },
  KRW: { symbol: '₩', rate: 1380, label: 'KRW' },
};

const CurrencyToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    return localStorage.getItem('preferredCurrency') || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('preferredCurrency', selectedCurrency);
    // ✅ Trigger custom event for price updates
    window.dispatchEvent(new CustomEvent('currencyChange', { 
      detail: { currency: selectedCurrency, rate: currencies[selectedCurrency].rate } 
    }));
  }, [selectedCurrency]);

  const handleSelect = (key) => {
    setSelectedCurrency(key);
    setIsOpen(false);
  };

  const currentCurrency = currencies[selectedCurrency] || currencies.USD;

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