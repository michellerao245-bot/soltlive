// src/components/RightSidebar/TransactionFee.jsx
import React, { useState } from 'react';
import { DollarSign, Zap, Shield, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionFee = () => {
  const [amount, setAmount] = useState('');
  const [feeType, setFeeType] = useState('standard');
  const [isCalculating, setIsCalculating] = useState(false);

  const feeRates = {
    standard: { rate: 0.1, label: 'Standard', time: '~30s', color: 'text-blue-400' },
    priority: { rate: 0.25, label: 'Priority', time: '~15s', color: 'text-yellow-400' },
    instant: { rate: 0.5, label: 'Instant', time: '~5s', color: 'text-green-400' },
  };

  const currentFee = feeRates[feeType];
  const inputAmount = parseFloat(amount) || 0;
  const feeAmount = (inputAmount * currentFee.rate) / 100;
  const totalAmount = inputAmount + feeAmount;

  const handleAmountChange = (e) => {
    const val = e.target.value;
    if (val === '' || parseFloat(val) >= 0) {
      setAmount(val);
    }
  };

  const handleQuickAmount = (val) => {
    setAmount(val.toString());
  };

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <DollarSign size={14} className="text-yellow-400" /> Transaction Fee
        </h3>
        <span className="text-[10px] text-gray-500">Estimated</span>
      </div>

      {/* Amount Input */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-400">Amount (USD)</label>
          <div className="flex gap-1">
            {[100, 500, 1000].map((val) => (
              <button
                key={val}
                onClick={() => handleQuickAmount(val)}
                className="text-[10px] px-2 py-0.5 rounded bg-[#1e232e] text-gray-400 hover:text-white hover:bg-[#2a2f3a] transition"
              >
                ${val}
              </button>
            ))}
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full bg-[#1e232e] border border-gray-700 rounded-lg pl-8 pr-4 py-2 outline-none focus:border-green-500 text-white text-sm"
          />
        </div>
      </div>

      {/* Fee Type Selector */}
      <div className="flex gap-2 mb-3">
        {Object.keys(feeRates).map((key) => {
          const fee = feeRates[key];
          const isActive = feeType === key;
          return (
            <button
              key={key}
              onClick={() => setFeeType(key)}
              className={`flex-1 text-[10px] font-medium py-1.5 rounded-lg transition ${
                isActive
                  ? `${fee.color} bg-${key === 'standard' ? 'blue' : key === 'priority' ? 'yellow' : 'green'}-500/20 border border-${
                      key === 'standard' ? 'blue' : key === 'priority' ? 'yellow' : 'green'
                    }-500/30`
                  : 'bg-[#1e232e] text-gray-400 hover:text-white'
              }`}
            >
              {fee.label}
              <span className="block text-[8px] text-gray-500">{fee.time}</span>
            </button>
          );
        })}
      </div>

      {/* Fee Display */}
      {inputAmount > 0 && (
        <div className="bg-[#1e232e] rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Amount</span>
            <span className="text-white">${inputAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              Fee ({currentFee.rate}%)
              <Info size={12} className="text-gray-500" />
            </span>
            <span className={currentFee.color}>${feeAmount.toFixed(4)}</span>
          </div>
          <div className="border-t border-gray-700 pt-2 flex justify-between text-sm font-bold">
            <span className="text-gray-300">Total</span>
            <span className="text-white">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          className="flex-1 bg-green-500/20 text-green-400 text-xs font-medium py-2 rounded-lg hover:bg-green-500/30 transition flex items-center justify-center gap-1"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <ArrowUpRight size={14} /> Send
        </button>
        <button
          className="flex-1 bg-blue-500/20 text-blue-400 text-xs font-medium py-2 rounded-lg hover:bg-blue-500/30 transition flex items-center justify-center gap-1"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <ArrowDownRight size={14} /> Receive
        </button>
      </div>

      {/* Fee Savings Info */}
      <div className="mt-3 text-[10px] text-center text-gray-500">
        <Shield size={12} className="inline mr-1" />
        Estimated gas fees: ${(inputAmount * 0.001).toFixed(4)}
        <span className="ml-2 text-gray-600">|</span>
        <Zap size={12} className="inline mx-1" />
        {feeType === 'instant' ? '⚡ Fastest' : feeType === 'priority' ? '⚡ Faster' : '⏳ Standard'}
      </div>
    </div>
  );
};

export default React.memo(TransactionFee);