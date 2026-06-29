import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { DollarSign, ChevronDown } from 'lucide-react';

const CurrencyToggle = () => {
  const { currency, changeCurrency, currencies } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (key) => {
    changeCurrency(key);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white flex items-center gap-1 transition text-xs"
      >
        <DollarSign size={14} />
        <span>{currency}</span>
        <ChevronDown size={12} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-24 bg-[#1e232e] border border-gray-700 rounded-lg shadow-xl z-30 py-1">
          {Object.keys(currencies).map((key) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full px-3 py-1.5 text-xs text-left hover:bg-[#2a2f3a] transition ${
                currency === key ? 'text-green-400' : 'text-gray-300'
              }`}
            >
              {currencies[key].symbol} {key}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyToggle;