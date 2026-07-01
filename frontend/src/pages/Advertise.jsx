// src/pages/Advertise.jsx
import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import paymentService from '../services/paymentService';
import { CheckCircle, XCircle, Loader, Video, Image, Upload, AlertCircle, Check, X, Clock, DollarSign, Zap, Shield, Star } from 'lucide-react';

const Advertise = () => {
  const { wallet, connect } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    website: '',
    telegram: '',
    twitter: '',
    bannerFile: null,
    videoFile: null,
    bannerPreview: null,
    videoPreview: null
  });
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Payment plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 50,
      features: ['1 Banner Ad', 'Basic Analytics', '24/7 Support'],
      duration: '7 days',
      icon: Shield,
      color: 'blue'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 150,
      features: ['2 Banner Ads', 'Video Ad', 'Advanced Analytics', 'Priority Support'],
      duration: '30 days',
      icon: Star,
      color: 'green'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 350,
      features: ['5 Banner Ads', 'Video Ad + Boost', 'Full Analytics', 'Dedicated Support', 'Featured Listing'],
      duration: '90 days',
      icon: Zap,
      color: 'purple'
    }
  ];

  // Handle file uploads
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'banner') {
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        bannerFile: file,
        bannerPreview: preview
      }));
    } else if (type === 'video') {
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        videoFile: file,
        videoPreview: preview
      }));
      setShowVideo(true);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    if (!wallet.isConnected) {
      alert('Please connect your wallet first!');
      await connect();
      return;
    }

    if (!selectedPlan) {
      alert('Please select a payment plan first!');
      return;
    }

    if (!formData.projectName || !formData.description) {
      alert('Please fill in project name and description!');
      return;
    }

    if (!formData.bannerFile) {
      alert('Please upload a banner image!');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const result = await paymentService.makePayment(
        selectedPlan.price,
        `Advertise - ${selectedPlan.name} Plan`
      );

      if (result.success) {
        setPaymentStatus('success');
        // Show transaction hash
        setPaymentStatus(prev => ({
          ...prev,
          txHash: result.transactionHash,
          amount: result.amount
        }));

        // Store submission data
        const submissionData = {
          ...formData,
          plan: selectedPlan.name,
          price: selectedPlan.price,
          transactionHash: result.transactionHash,
          timestamp: new Date().toISOString()
        };
        
        // Save to localStorage for now (replace with API call)
        const submissions = JSON.parse(localStorage.getItem('advertise_submissions') || '[]');
        submissions.push(submissionData);
        localStorage.setItem('advertise_submissions', JSON.stringify(submissions));

        // Show success message
        alert('✅ Payment successful! Your advertisement will be reviewed and published soon.');
        
        // Reset form
        setFormData({
          projectName: '',
          description: '',
          website: '',
          telegram: '',
          twitter: '',
          bannerFile: null,
          videoFile: null,
          bannerPreview: null,
          videoPreview: null
        });
        setSelectedPlan(null);
        setShowVideo(false);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus('error');
      alert(`❌ Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render payment status
  const renderPaymentStatus = () => {
    if (!paymentStatus) return null;

    if (paymentStatus === 'processing') {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] border border-gray-700 rounded-2xl p-8 max-w-md w-full">
            <div className="flex flex-col items-center">
              <Loader className="w-16 h-16 text-green-400 animate-spin" />
              <h3 className="text-xl font-bold text-white mt-4">Processing Payment</h3>
              <p className="text-gray-400 text-center mt-2">
                Please confirm the transaction in MetaMask...
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'success') {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] border border-green-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-400" />
              <h3 className="text-xl font-bold text-white mt-4">Payment Successful!</h3>
              <p className="text-gray-400 text-center mt-2">
                Transaction Hash: 
                <span className="text-green-400 block text-xs font-mono mt-1 break-all">
                  {paymentStatus.txHash}
                </span>
              </p>
              <p className="text-gray-400 text-center mt-2">
                Amount: {parseFloat(paymentStatus.amount).toFixed(2)} SOLT
              </p>
              <button
                onClick={() => setPaymentStatus(null)}
                className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'error') {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex flex-col items-center">
              <XCircle className="w-16 h-16 text-red-400" />
              <h3 className="text-xl font-bold text-white mt-4">Payment Failed</h3>
              <p className="text-gray-400 text-center mt-2">
                {paymentStatus.message || 'Transaction failed. Please try again.'}
              </p>
              <button
                onClick={() => setPaymentStatus(null)}
                className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0a16] py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Advertise Your Project
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get your project in front of thousands of crypto enthusiasts. 
            Choose a plan that fits your needs.
          </p>
        </div>

        {/* Wallet Status */}
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${wallet.isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-white">
              {wallet.isConnected ? `Connected: ${wallet.address ? wallet.address.slice(0,6)+'...'+wallet.address.slice(-4) : ''}` : 'Wallet not connected'}
            </span>
          </div>
          {!wallet.isConnected && (
            <button
              onClick={connect}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors text-sm"
            >
              Connect Wallet
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plans */}
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan?.id === plan.id;
            const priceInSolt = (plan.price / paymentService.getSOLTPrice()).toFixed(2);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`bg-[#1a1a2e] border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'border-green-500 shadow-lg shadow-green-500/10 scale-105' 
                    : 'border-gray-700/50 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl bg-${plan.color}-500/20`}>
                    <Icon className={`w-6 h-6 text-${plan.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-white">${plan.price}</p>
                  <p className="text-sm text-gray-400">{parseFloat(priceInSolt).toFixed(2)} SOLT</p>
                  <p className="text-xs text-gray-500 mt-1">Duration: {plan.duration}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full py-2 rounded-xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Form */}
        {selectedPlan && (
          <div className="mt-8 bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Ad Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                    className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500 h-24 resize-none"
                    placeholder="Describe your project"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
                    placeholder="https://your-project.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Telegram</label>
                    <input
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => setFormData({...formData, telegram: e.target.value})}
                      className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 block mb-1">Twitter</label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                      className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Banner Image *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'banner')}
                      className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-8 text-center text-gray-400 cursor-pointer hover:border-green-500 transition-colors"
                    />
                    <Image className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-gray-600 pointer-events-none" />
                  </div>
                  {formData.bannerPreview && (
                    <div className="mt-2">
                      <img 
                        src={formData.bannerPreview} 
                        alt="Banner preview" 
                        className="w-full h-32 object-cover rounded-xl border border-gray-700"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">Video Ad</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-8 text-center text-gray-400 cursor-pointer hover:border-green-500 transition-colors"
                    />
                    <Video className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-gray-600 pointer-events-none" />
                  </div>
                  {showVideo && formData.videoPreview && (
                    <div className="mt-2">
                      <video 
                        src={formData.videoPreview} 
                        controls 
                        className="w-full max-h-48 rounded-xl border border-gray-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || !wallet.isConnected}
              className={`w-full mt-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                isProcessing || !wallet.isConnected
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 hover:scale-[1.02]'
              } text-white flex items-center justify-center gap-2`}
            >
              {isProcessing ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Processing...
                </>
              ) : !wallet.isConnected ? (
                'Connect Wallet First'
              ) : (
                <>
                  <DollarSign size={20} />
                  Pay ${selectedPlan.price} ({parseFloat((selectedPlan.price / paymentService.getSOLTPrice())).toFixed(2)} SOLT)
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-2">
              By clicking pay, you agree to our terms and conditions
            </p>
          </div>
        )}
      </div>

      {/* Payment Status Modal */}
      {renderPaymentStatus()}
    </div>
  );
};

export default Advertise;