// src/pages/Advertise.jsx
import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import paymentService from '../services/paymentService';
import { 
  CheckCircle, XCircle, Loader, Video, Image, 
  AlertCircle, Check, X, DollarSign, Zap, 
  Shield, Star, History, Play, ImageIcon,
  ExternalLink, Clock, User, Mail, Globe
} from 'lucide-react';

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
  const [previousSubmissions, setPreviousSubmissions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Load previous submissions
  useEffect(() => {
    const submissions = JSON.parse(localStorage.getItem('advertise_submissions') || '[]');
    setPreviousSubmissions(submissions);
  }, []);

  // Payment plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 5,
      features: ['1 Banner Ad', 'Basic Analytics', '24/7 Support'],
      duration: '1 day',
      icon: Shield,
      color: 'blue'
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 20,
      features: ['2 Banner Ads', 'Video Ad', 'Advanced Analytics', 'Priority Support'],
      duration: '7 days',
      icon: Star,
      color: 'green'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 50,
      features: ['5 Banner Ads', 'Video Ad + Boost', 'Full Analytics', 'Dedicated Support', 'Featured Listing'],
      duration: '30 days',
      icon: Zap,
      color: 'purple'
    }
  ];

  // Handle file uploads
  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    if (type === 'banner') {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file for banner');
        return;
      }
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        bannerFile: file,
        bannerPreview: preview
      }));
    } else if (type === 'video') {
      if (!file.type.startsWith('video/')) {
        alert('Please upload a video file');
        return;
      }
      const preview = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        videoFile: file,
        videoPreview: preview
      }));
      setShowVideo(true);
    }
  };

  // Remove file
  const removeFile = (type) => {
    if (type === 'banner') {
      if (formData.bannerPreview) {
        URL.revokeObjectURL(formData.bannerPreview);
      }
      setFormData(prev => ({
        ...prev,
        bannerFile: null,
        bannerPreview: null
      }));
    } else if (type === 'video') {
      if (formData.videoPreview) {
        URL.revokeObjectURL(formData.videoPreview);
      }
      setFormData(prev => ({
        ...prev,
        videoFile: null,
        videoPreview: null
      }));
      setShowVideo(false);
    }
  };

  // Load previous submission
  const loadPreviousSubmission = (submission) => {
    setFormData({
      projectName: submission.projectName || '',
      description: submission.description || '',
      website: submission.website || '',
      telegram: submission.telegram || '',
      twitter: submission.twitter || '',
      bannerFile: null,
      videoFile: null,
      bannerPreview: submission.bannerPreview || null,
      videoPreview: submission.videoPreview || null
    });
    setSelectedPlan(plans.find(p => p.name === submission.plan) || null);
    setShowHistory(false);
    setEditMode(true);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.projectName || !formData.description) {
      alert('Please fill in project name and description!');
      return false;
    }

    if (!selectedPlan) {
      alert('Please select a payment plan!');
      return false;
    }

    if (!formData.bannerPreview && !formData.videoPreview) {
      alert('Please upload at least one file (Banner Image or Video Ad)!');
      return false;
    }

    return true;
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

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const soltPrice = paymentService.getSOLTPrice();
      const soltAmount = (selectedPlan.price / soltPrice).toFixed(2);

      const result = await paymentService.makePayment(
        selectedPlan.price,
        `Advertise - ${selectedPlan.name} Plan`
      );

      if (result.success) {
        setPaymentStatus({
          status: 'success',
          txHash: result.transactionHash,
          amount: result.amount,
          usdAmount: selectedPlan.price
        });

        const submissionData = {
          ...formData,
          plan: selectedPlan.name,
          price: selectedPlan.price,
          soltAmount: soltAmount,
          transactionHash: result.transactionHash,
          timestamp: new Date().toISOString(),
          status: 'pending',
          hasBanner: !!formData.bannerPreview,
          hasVideo: !!formData.videoPreview
        };
        
        const submissions = JSON.parse(localStorage.getItem('advertise_submissions') || '[]');
        submissions.push(submissionData);
        localStorage.setItem('advertise_submissions', JSON.stringify(submissions));
        setPreviousSubmissions(submissions);

        setTimeout(() => {
          setPaymentStatus(null);
          alert('✅ Payment successful! Your advertisement will be reviewed and published soon.');
          resetForm();
        }, 3000);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setPaymentStatus({
        status: 'error',
        message: error.message
      });
      setTimeout(() => setPaymentStatus(null), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset form
  const resetForm = () => {
    if (formData.bannerPreview) {
      URL.revokeObjectURL(formData.bannerPreview);
    }
    if (formData.videoPreview) {
      URL.revokeObjectURL(formData.videoPreview);
    }
    
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
    setEditMode(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

    if (paymentStatus.status === 'success') {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] border border-green-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-400 animate-bounce" />
              <h3 className="text-xl font-bold text-white mt-4">Payment Successful!</h3>
              <p className="text-gray-400 text-center mt-2">
                Transaction Hash: 
                <span className="text-green-400 block text-xs font-mono mt-1 break-all">
                  {paymentStatus.txHash}
                </span>
              </p>
              <p className="text-gray-400 text-center mt-2">
                Amount: {parseFloat(paymentStatus.amount).toFixed(2)} SOLT (${paymentStatus.usdAmount})
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (paymentStatus.status === 'error') {
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
      {/* Rest of your JSX here... */}
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Advertise Your Project
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get your project in front of thousands of crypto enthusiasts. 
            Choose a plan that fits your needs.
          </p>
        </div>

        {/* Wallet Status */}
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-4 mb-8 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${wallet.isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-white text-sm">
              {wallet.isConnected 
                ? `Connected: ${wallet.address ? wallet.address.slice(0,6)+'...'+wallet.address.slice(-4) : ''}` 
                : 'Wallet not connected'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {previousSubmissions.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors text-sm flex items-center gap-2"
              >
                <History size={16} />
                History ({previousSubmissions.length})
              </button>
            )}
            {!wallet.isConnected && (
              <button
                onClick={connect}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors text-sm"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan?.id === plan.id;
            const priceInSolt = (plan.price / paymentService.getSOLTPrice()).toFixed(2);

            return (
              <div
                key={plan.id}
                className={`bg-[#1a1a2e] border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? 'border-green-500 shadow-lg shadow-green-500/10 scale-105' 
                    : 'border-gray-700/50 hover:border-gray-600 hover:scale-[1.02]'
                }`}
                onClick={() => setSelectedPlan(plan)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl bg-${plan.color}-500/20`}>
                    <Icon className={`w-6 h-6 text-${plan.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-white">${plan.price}</p>
                  <p className="text-sm text-gray-400">{priceInSolt} SOLT</p>
                  <p className="text-xs text-gray-500 mt-1">Duration: {plan.duration}</p>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
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
                  {isSelected ? '✓ Selected' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Form */}
        {selectedPlan && (
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editMode ? 'Edit Ad Details' : 'Ad Details'}
              </h2>
              {editMode && (
                <button
                  onClick={() => {
                    resetForm();
                    setEditMode(false);
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-sm text-yellow-400 flex items-center gap-2">
                <AlertCircle size={16} />
                Upload at least one file (Banner Image OR Video Ad)
              </p>
            </div>

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
                  <label className="text-sm text-gray-400 block mb-1">
                    Banner Image <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'banner')}
                      className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-8 text-center text-gray-400 cursor-pointer hover:border-green-500 transition-colors"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                      <Image className="w-8 h-8 text-gray-600" />
                      <span className="text-xs text-gray-500 mt-1">Optional</span>
                    </div>
                  </div>
                  {formData.bannerPreview && (
                    <div className="mt-2 relative group">
                      <img 
                        src={formData.bannerPreview} 
                        alt="Banner preview" 
                        className="w-full h-32 object-cover rounded-xl border border-gray-700"
                      />
                      <button
                        onClick={() => removeFile('banner')}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Video Ad <span className="text-gray-500">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                      className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl px-4 py-8 text-center text-gray-400 cursor-pointer hover:border-green-500 transition-colors"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                      <Video className="w-8 h-8 text-gray-600" />
                      <span className="text-xs text-gray-500 mt-1">Optional</span>
                    </div>
                  </div>
                  {formData.videoPreview && (
                    <div className="mt-2 relative group">
                      <video 
                        src={formData.videoPreview} 
                        controls 
                        className="w-full max-h-48 rounded-xl border border-gray-700"
                      />
                      <button
                        onClick={() => removeFile('video')}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={14} className="text-white" />
                      </button>
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
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25'
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

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Previous Submissions</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            {previousSubmissions.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No previous submissions</p>
            ) : (
              <div className="space-y-3">
                {previousSubmissions.map((sub, idx) => (
                  <div key={idx} className="bg-[#0a0a16] border border-gray-700/50 rounded-xl p-4 hover:border-gray-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{sub.projectName}</h3>
                        <p className="text-sm text-gray-400">{sub.plan} Plan - ${sub.price}</p>
                        <p className="text-xs text-gray-500">{formatDate(sub.timestamp)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {sub.hasBanner && <ImageIcon size={12} className="text-blue-400" />}
                          {sub.hasVideo && <Play size={12} className="text-purple-400" />}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          sub.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          sub.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {sub.status || 'pending'}
                        </span>
                        <button
                          onClick={() => loadPreviousSubmission(sub)}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          title="Load this submission"
                        >
                          <Check size={14} className="text-blue-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Status */}
      {renderPaymentStatus()}
    </div>
  );
};

// ✅ IMPORTANT: Make sure this export is at the end
export default Advertise;