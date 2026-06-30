// src/components/RightSidebar/SubscriptionCard.jsx
import React, { useState, useEffect } from 'react';
import { Crown, Zap, Shield, Star, Check, X } from 'lucide-react';

const SubscriptionCard = () => {
  const [plan, setPlan] = useState('free');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [billingCycle, setBillingCycle] = useState('weekly');

  // ✅ Weekly Plans
  const plans = {
    free: {
      label: 'Free',
      price: '$0',
      period: '/week',
      features: [
        { name: 'Basic charts', included: true },
        { name: '5 watchlist items', included: true },
        { name: '24h price data', included: true },
        { name: 'Smart signals', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
      ],
      color: 'gray',
    },
    pro: {
      label: 'Pro',
      price: '$2.99',
      period: '/week',
      features: [
        { name: 'Basic charts', included: true },
        { name: '50 watchlist items', included: true },
        { name: '7d price data', included: true },
        { name: 'Smart signals', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
      ],
      color: 'green',
      popular: true,
    },
    elite: {
      label: 'Elite',
      price: '$5.99',
      period: '/week',
      features: [
        { name: 'All charts', included: true },
        { name: 'Unlimited watchlist', included: true },
        { name: '30d price data', included: true },
        { name: 'Smart signals', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
      ],
      color: 'yellow',
    },
  };

  // ✅ Monthly Plans (for comparison)
  const monthlyPlans = {
    pro: { price: '$9.99', period: '/month' },
    elite: { price: '$19.99', period: '/month' },
  };

  const currentPlan = plans[plan];
  const isPaidPlan = plan !== 'free';

  const handleSubscribe = () => {
    setIsSubscribed(true);
    // ✅ Payment integration yahan add karo
    alert(`✅ Subscribed to ${currentPlan.label} plan! (${currentPlan.price}${currentPlan.period})`);
  };

  const handleUnsubscribe = () => {
    setIsSubscribed(false);
    setPlan('free');
  };

  return (
    <div className="bg-[#131722] border border-gray-800 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Crown size={14} className="text-yellow-400" /> Subscription
        </h3>
        {isSubscribed && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400">
            ✅ Active
          </span>
        )}
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setBillingCycle('weekly')}
          className={`flex-1 text-[10px] font-medium py-1.5 rounded-lg transition ${
            billingCycle === 'weekly'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-[#1e232e] text-gray-400 hover:text-white'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setBillingCycle('monthly')}
          className={`flex-1 text-[10px] font-medium py-1.5 rounded-lg transition ${
            billingCycle === 'monthly'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-[#1e232e] text-gray-400 hover:text-white'
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Plan Cards */}
      <div className="space-y-3">
        {Object.keys(plans).map((key) => {
          const p = plans[key];
          const isActive = plan === key;
          const isPopular = p.popular;

          return (
            <div
              key={key}
              onClick={() => !isSubscribed && setPlan(key)}
              className={`relative p-3 rounded-lg border transition cursor-pointer ${
                isActive
                  ? `border-${p.color}-500/50 bg-${p.color}-500/10`
                  : 'border-gray-700 bg-[#1e232e] hover:border-gray-500'
              } ${isSubscribed && !isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isPopular && (
                <span className="absolute -top-2 right-3 text-[8px] px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                  ★ POPULAR
                </span>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">{p.label}</span>
                  {isActive && (
                    <span className="ml-2 text-[10px] text-green-400">✓ Selected</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white">
                    {billingCycle === 'weekly' ? p.price : monthlyPlans[key]?.price || p.price}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {billingCycle === 'weekly' ? p.period : monthlyPlans[key]?.period || p.period}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                {p.features.slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-center gap-1 text-[10px] text-gray-300">
                    {feature.included ? (
                      <Check size={10} className="text-green-400" />
                    ) : (
                      <X size={10} className="text-gray-500" />
                    )}
                    <span className={feature.included ? 'text-gray-300' : 'text-gray-500'}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscribe Button */}
      {isSubscribed ? (
        <button
          onClick={handleUnsubscribe}
          className="w-full mt-3 bg-red-500/20 text-red-400 text-xs font-medium py-2 rounded-lg hover:bg-red-500/30 transition"
        >
          Cancel Subscription
        </button>
      ) : (
        <button
          onClick={handleSubscribe}
          disabled={plan === 'free'}
          className={`w-full mt-3 text-xs font-medium py-2 rounded-lg transition ${
            plan === 'free'
              ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {plan === 'free' ? 'Free Plan Active' : `Subscribe to ${plans[plan].label}`}
        </button>
      )}

      {/* Savings Info */}
      {plan !== 'free' && billingCycle === 'weekly' && (
        <p className="mt-2 text-[10px] text-center text-gray-500">
          💰 Save 20% with monthly billing
        </p>
      )}
    </div>
  );
};

export default React.memo(SubscriptionCard);