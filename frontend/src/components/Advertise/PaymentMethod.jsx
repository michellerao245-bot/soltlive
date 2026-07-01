import React, { useState } from "react";

const PaymentMethod = ({ plan, onNext, onBack }) => {
  const [method, setMethod] = useState("crypto");

  const handleContinue = () => {
    onNext(method);
  };

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-6">

      <h2 className="text-xl font-bold text-white mb-2">
        Payment Method
      </h2>

      <p className="text-sm text-gray-400 mb-6">
        Choose how you want to pay.
      </p>

      {/* Crypto */}

      <div
        onClick={() => setMethod("crypto")}
        className={`cursor-pointer rounded-xl border p-4 mb-4 transition ${
          method === "crypto"
            ? "border-green-500 bg-green-500/10"
            : "border-gray-700 bg-[#1e232e]"
        }`}
      >
        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-white font-semibold">
              🟡 Crypto
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Pay using BNB, USDT, SOLT or other supported tokens.
            </p>
          </div>

          {method === "crypto" && (
            <div className="text-green-400 text-xl">
              ✓
            </div>
          )}

        </div>
      </div>

      {/* UPI */}

      <div
        onClick={() => setMethod("upi")}
        className={`cursor-pointer rounded-xl border p-4 transition ${
          method === "upi"
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-700 bg-[#1e232e]"
        }`}
      >
        <div className="flex items-center justify-between">

          <div>
            <h3 className="text-white font-semibold">
              🔵 UPI
            </h3>

            <p className="text-xs text-yellow-400 mt-1">
              Coming Soon
            </p>
          </div>

          {method === "upi" && (
            <div className="text-blue-400 text-xl">
              ✓
            </div>
          )}

        </div>
      </div>

      {/* Summary */}

      <div className="mt-6 bg-[#1e232e] rounded-lg border border-gray-700 p-4">

        <div className="flex justify-between mb-2">
          <span className="text-gray-400">
            Selected Plan
          </span>

          <span className="text-white">
            {plan.title}
          </span>
        </div>

        <div className="flex justify-between mb-2">
          <span className="text-gray-400">
            Payment Method
          </span>

          <span className="text-green-400 capitalize">
            {method}
          </span>
        </div>

        <div className="flex justify-between">

          <span className="text-gray-400">
            Total
          </span>

          <span className="text-green-400 font-bold text-lg">
            ${plan.price}
          </span>

        </div>

      </div>

      {/* Buttons */}

      <div className="flex gap-3 mt-6">

        <button
          onClick={onBack}
          className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg text-white transition"
        >
          ← Back
        </button>

        <button
          onClick={handleContinue}
          className="flex-1 bg-green-600 hover:bg-green-500 py-3 rounded-lg text-white font-semibold transition"
        >
          Continue Payment →
        </button>

      </div>

    </div>
  );
};

export default PaymentMethod;