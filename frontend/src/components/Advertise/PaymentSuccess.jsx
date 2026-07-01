import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = ({ formData, plan }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-8 max-w-2xl mx-auto">

      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
          <span className="text-5xl">✅</span>
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-center text-white">
        Payment Submitted
      </h2>

      <p className="text-center text-gray-400 mt-3">
        Thank you for advertising on <span className="text-green-400">EcoLive</span>.
      </p>

      {/* Summary */}
      <div className="mt-8 bg-[#1e232e] rounded-xl border border-gray-700 p-5 space-y-3">

        <div className="flex justify-between">
          <span className="text-gray-400">Project</span>
          <span className="text-white font-medium">
            {formData?.projectName}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Website</span>
          <span className="text-white">
            {formData?.website}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Telegram</span>
          <span className="text-white">
            {formData?.telegram}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Selected Plan</span>
          <span className="text-green-400 font-semibold">
            {plan?.title}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-400">Amount</span>
          <span className="text-green-400 font-bold text-lg">
            ${plan?.price}
          </span>
        </div>

      </div>

      {/* Status */}
      <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-5">

        <h3 className="text-yellow-300 font-semibold mb-2">
          ⏳ Waiting for Admin Approval
        </h3>

        <p className="text-sm text-gray-300">
          We will verify your payment and review your advertisement.
          Once approved, your banner will automatically appear on EcoLive
          for the duration of your selected plan.
        </p>

      </div>

      {/* Next Steps */}
      <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-5">

        <h3 className="text-blue-300 font-semibold mb-2">
          What's Next?
        </h3>

        <ul className="text-sm text-gray-300 space-y-2 list-disc ml-5">
          <li>Payment verification.</li>
          <li>Banner quality review.</li>
          <li>Advertisement approval.</li>
          <li>Banner goes live automatically.</li>
        </ul>

      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8">

        <button
          onClick={() => navigate("/")}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition"
        >
          Back to Home
        </button>

        <button
          onClick={() => navigate("/advertise")}
          className="flex-1 bg-[#1e232e] hover:bg-[#2b3240] text-white py-3 rounded-lg border border-gray-700 transition"
        >
          Submit Another
        </button>

      </div>

    </div>
  );
};

export default PaymentSuccess;