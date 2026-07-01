import React, { useState } from "react";
import QRCode from "react-qr-code";
import { PAYMENT_CONFIG } from "../../config/payment";

const CryptoPayment = ({
  formData,
  plan,
  paymentMethod,
  onSuccess,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [amountCopied, setAmountCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(
        PAYMENT_CONFIG.walletAddress
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      alert("Failed to copy wallet address");
    }
  };

  const copyAmount = async () => {
    try {
      await navigator.clipboard.writeText(
        String(plan.price)
      );

      setAmountCopied(true);

      setTimeout(() => {
        setAmountCopied(false);
      }, 2000);
    } catch (err) {
      alert("Failed to copy amount");
    }
  };

  const handlePaid = () => {
    onSuccess();
  };

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-2">
        Crypto Payment
      </h2>

      <p className="text-gray-400 mb-6">
        Send the payment using the information below.
      </p>

      {/* QR CODE */}

      <div className="flex justify-center mb-6">

        <div className="bg-white rounded-xl p-4">
          <QRCode
            value={PAYMENT_CONFIG.walletAddress}
            size={180}
          />
        </div>

      </div>

      {/* NETWORK */}

      <div className="bg-[#1e232e] rounded-lg p-4 mb-4">

        <p className="text-xs text-gray-500">
          Network
        </p>

        <p className="text-lg font-bold text-blue-400">
          {PAYMENT_CONFIG.network}
        </p>

      </div>

      {/* TOKEN */}

      <div className="bg-[#1e232e] rounded-lg p-4 mb-4">

        <p className="text-xs text-gray-500">
          Payment Token
        </p>

        <p className="text-lg font-bold text-green-400">
          {PAYMENT_CONFIG.token}
        </p>

      </div>

      {/* WALLET */}

      <div className="bg-[#1e232e] rounded-lg p-4 mb-4">

        <p className="text-xs text-gray-500 mb-2">
          Wallet Address
        </p>

        <p className="text-xs text-white break-all">
          {PAYMENT_CONFIG.walletAddress}
        </p>

        <button
          onClick={copyAddress}
          className="mt-3 bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm text-white transition"
        >
          {copied ? "✅ Copied" : "Copy Address"}
        </button>

      </div>

      {/* PAYMENT DETAILS */}

      <div className="bg-[#1e232e] rounded-lg p-4 mb-4">

        <div className="flex justify-between">
          <span className="text-gray-400">
            Project
          </span>

          <span className="text-white">
            {formData.projectName}
          </span>
        </div>

        <div className="flex justify-between mt-3">
          <span className="text-gray-400">
            Plan
          </span>

          <span className="text-white">
            {plan.title}
          </span>
        </div>

        <div className="flex justify-between mt-3 items-center">

          <span className="text-gray-400">
            Amount
          </span>

          <div className="flex items-center gap-2">

            <span className="text-green-400 text-xl font-bold">
              ${plan.price} {PAYMENT_CONFIG.token}
            </span>

            <button
              onClick={copyAmount}
              className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white transition"
            >
              {amountCopied ? "Copied" : "Copy"}
            </button>

          </div>

        </div>

      </div>

      {/* NOTICE */}

      <div className="mt-6 rounded-lg bg-yellow-500/10 border border-yellow-500/30 p-4">

        <p className="text-yellow-300 text-sm leading-6">
          • Send exactly <strong>${plan.price}</strong> using
          <strong> {PAYMENT_CONFIG.token}</strong>.
          <br />
          • Network:
          <strong> {PAYMENT_CONFIG.network}</strong>.
          <br />
          • Make sure the wallet address is correct before sending.
          <br />
          • After completing the payment click
          <strong> I've Paid</strong>.
          <br />
          • Your advertisement will be reviewed before it goes live.
        </p>

      </div>

      {/* ACTION BUTTONS */}

      <div className="flex gap-3 mt-6">

        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
        >
          ← Back
        </button>

        <button
          onClick={handlePaid}
          className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition"
        >
          I've Paid
        </button>

      </div>

    </div>
  );
};

export default CryptoPayment;