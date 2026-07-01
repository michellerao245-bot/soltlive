import React, { useState } from "react";

const plans = [
  {
    id: "1day",
    title: "1 Day",
    price: 5,
    description: "Advertise for 24 hours",
  },
  {
    id: "7days",
    title: "7 Days",
    price: 20,
    description: "Advertise for one week",
  },
  {
    id: "30days",
    title: "30 Days",
    price: 50,
    description: "Advertise for one month",
  },
];

const PlanSelector = ({ onNext, onBack }) => {
  const [selectedPlan, setSelectedPlan] = useState(plans[0]);

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-white mb-2">
        Select Advertising Plan
      </h2>

      <p className="text-gray-400 mb-6">
        Choose the duration for your advertisement.
      </p>

      <div className="space-y-4">

        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
            className={`cursor-pointer rounded-xl border p-4 transition ${
              selectedPlan.id === plan.id
                ? "border-green-500 bg-green-500/10"
                : "border-gray-700 bg-[#1e232e] hover:border-green-500/50"
            }`}
          >
            <div className="flex items-center justify-between">

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {plan.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {plan.description}
                </p>
              </div>

              <div className="text-2xl font-bold text-green-400">
                ${plan.price}
              </div>

            </div>
          </div>
        ))}

      </div>

      <div className="flex gap-3 mt-8">

        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition"
        >
          ← Back
        </button>

        <button
          onClick={() => onNext(selectedPlan)}
          className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition"
        >
          Continue →
        </button>

      </div>

    </div>
  );
};

export default PlanSelector;