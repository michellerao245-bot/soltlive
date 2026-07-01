// src/pages/Admin/Advertisements.jsx
import React, { useState, useEffect, Component } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { 
  CheckCircle, XCircle, Clock, Eye, Trash2, 
  Filter, Search, Image, Video, 
  DollarSign, ExternalLink, RefreshCw,
  AlertTriangle, Shield, Zap, Star, LogIn,
  Bell, User, X, Loader,
  Calendar, Check, Play, ImageIcon
} from 'lucide-react';

// ========== ERROR BOUNDARY ==========
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Admin Panel Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a16] flex items-center justify-center p-4">
          <div className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-8 max-w-2xl w-full">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white text-center mb-4">Something went wrong</h2>
            <div className="bg-[#0a0a16] rounded-xl p-4 mb-4 overflow-auto max-h-60">
              <p className="text-red-400 text-sm font-mono break-all">{this.state.error?.toString()}</p>
              {this.state.errorInfo && (
                <pre className="text-xs text-gray-400 mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ========== ADMIN PANEL CONTENT ==========
const AdvertisementsContent = () => {
  const { wallet, connect, disconnect, loading } = useWallet();
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalRevenue: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const ownerWallet = import.meta.env.VITE_PAYMENT_WALLET || '0xC30050aBe984c3B3929822E3BbF33fbBE6b3C423';
  const isAdmin = wallet.isConnected && wallet.address?.toLowerCase() === ownerWallet.toLowerCase();

  // ---------- Helper functions ----------
  const loadSubmissions = () => {
    try {
      const data = JSON.parse(localStorage.getItem('advertise_submissions') || '[]');
      setSubmissions(data);
      filterSubmissions(data, filter, searchTerm);
      calculateStats(data);
    } catch (err) {
      console.error('Load submissions error:', err);
      setError('Failed to load submissions: ' + err.message);
    }
  };

  const filterSubmissions = (data, filterType, search) => {
    let filtered = data;
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.status === filterType);
    }
    if (search) {
      filtered = filtered.filter(item => 
        item.projectName?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()) ||
        item.transactionHash?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredSubmissions(filtered);
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      pending: data.filter(item => item.status === 'pending').length,
      approved: data.filter(item => item.status === 'approved').length,
      rejected: data.filter(item => item.status === 'rejected').length,
      totalRevenue: data
        .filter(item => item.status === 'approved')
        .reduce((sum, item) => sum + (item.price || 0), 0)
    });
  };

  const checkNewSubmissions = () => {
    try {
      const data = JSON.parse(localStorage.getItem('advertise_submissions') || '[]');
      const pending = data.filter(item => item.status === 'pending');
      if (pending.length > 0 && Notification.permission === 'granted') {
        new Notification('New Advertisement Submission!', {
          body: `${pending.length} new ad(s) waiting for approval`,
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.warn('Notification error:', err);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadSubmissions();
      checkNewSubmissions();
      // Auto-check every 30s
      const interval = setInterval(checkNewSubmissions, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  // ---------- Handlers ----------
  const updateStatus = (id, newStatus) => {
    const updated = submissions.map(item => {
      if (item.id === id || item.transactionHash === id) {
        return { ...item, status: newStatus, reviewedAt: new Date().toISOString() };
      }
      return item;
    });
    localStorage.setItem('advertise_submissions', JSON.stringify(updated));
    setSubmissions(updated);
    filterSubmissions(updated, filter, searchTerm);
    calculateStats(updated);
    alert(`✅ Advertisement ${newStatus === 'approved' ? 'Approved' : 'Rejected'} successfully!`);
  };

  const deleteAd = (id) => {
    if (!window.confirm('Are you sure you want to delete this advertisement?')) return;
    const updated = submissions.filter(item => item.id !== id && item.transactionHash !== id);
    localStorage.setItem('advertise_submissions', JSON.stringify(updated));
    setSubmissions(updated);
    filterSubmissions(updated, filter, searchTerm);
    calculateStats(updated);
    alert('🗑️ Advertisement deleted successfully!');
  };

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
    }
  };

  const handleSwitchWallet = async () => {
    try {
      setError(null);
      await disconnect();
      await connect();
    } catch (err) {
      console.error('Switch wallet error:', err);
      setError(err.message || 'Failed to switch wallet. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
      approved: { color: 'bg-green-500/20 text-green-400', icon: CheckCircle },
      rejected: { color: 'bg-red-500/20 text-red-400', icon: XCircle }
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon size={12} /> {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const configs = {
      Basic: { color: 'bg-blue-500/20 text-blue-400', icon: Shield },
      Standard: { color: 'bg-green-500/20 text-green-400', icon: Star },
      Premium: { color: 'bg-purple-500/20 text-purple-400', icon: Zap }
    };
    const config = configs[plan] || configs.Basic;
    const Icon = config.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
        <Icon size={12} /> {plan}
      </span>
    );
  };

  // ---------- Render states ----------
  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-[#0a0a16] flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-8 max-w-md w-full text-center">
          <Shield className="w-20 h-20 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-gray-400 mb-6">Please connect your wallet to access the admin panel.</p>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">{error}</div>}
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : <LogIn size={20} />}
            {loading ? 'Connecting...' : 'Connect Admin Wallet'}
          </button>
          <p className="text-xs text-gray-500 mt-4">Only the owner wallet can access this panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a16] flex items-center justify-center p-4">
        <div className="bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4 text-red-400 text-sm">{error}</div>}
          <div className="bg-[#0a0a16] rounded-xl p-3 mb-4 text-left">
            <p className="text-sm text-gray-400">Connected Wallet:</p>
            <p className="text-sm font-mono text-white break-all">{wallet.address}</p>
            <p className="text-sm text-gray-400 mt-2">Expected Owner Wallet:</p>
            <p className="text-sm font-mono text-green-400 break-all">{ownerWallet}</p>
          </div>
          <p className="text-gray-400 text-sm">You are connected with a different wallet. Please switch to the owner wallet.</p>
          <div className="flex flex-col gap-2 mt-4">
            <button onClick={handleSwitchWallet} disabled={loading} className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader className="animate-spin" size={16} /> : <RefreshCw size={16} />}
              Switch Wallet
            </button>
            <button onClick={() => window.location.href = '/'} className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors">
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Admin Dashboard (full) ----------
  return (
    <div className="min-h-screen bg-[#0a0a16] py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Advertisements Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage all advertisement submissions</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 bg-[#1a1a2e] border border-gray-700/50 rounded-xl hover:border-gray-600 transition-colors relative"
              >
                <Bell size={20} className="text-gray-400" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1a1a2e] border border-gray-700/50 rounded-xl shadow-2xl z-50">
                  <div className="p-3 border-b border-gray-700/50 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    <button onClick={() => { setNotifications([]); setShowNotifications(false); }} className="text-xs text-green-400 hover:text-green-300">
                      Clear all
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">No new notifications</div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} className="p-3 border-b border-gray-700/30 last:border-0 hover:bg-white/5 cursor-pointer">
                          <div className="flex items-start gap-2">
                            <Bell size={14} className="text-green-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-white">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatDate(notif.time)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={loadSubmissions}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-400">Total</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-[#1a1a2e] border border-yellow-500/30 rounded-xl p-4 relative">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            {stats.pending > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                {stats.pending}
              </span>
            )}
          </div>
          <div className="bg-[#1a1a2e] border border-green-500/30 rounded-xl p-4">
            <p className="text-sm text-gray-400">Approved</p>
            <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          </div>
          <div className="bg-[#1a1a2e] border border-red-500/30 rounded-xl p-4">
            <p className="text-sm text-gray-400">Rejected</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </div>
          <div className="bg-[#1a1a2e] border border-green-500/30 rounded-xl p-4">
            <p className="text-sm text-gray-400">Revenue</p>
            <p className="text-2xl font-bold text-green-400">${stats.totalRevenue}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search by project name, description, or transaction hash..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  filterSubmissions(submissions, filter, e.target.value);
                }}
                className="w-full bg-[#0a0a16] border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilter(status);
                    filterSubmissions(submissions, status, searchTerm);
                  }}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    filter === status ? 'bg-green-500 text-white' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#1a1a2e] border border-gray-700/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0a16] border-b border-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium">Project</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium hidden md:table-cell">Plan</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium hidden lg:table-cell">Files</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium hidden sm:table-cell">Amount</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs text-gray-400 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right text-xs text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr><td colSpan="7" className="px-4 py-8 text-center text-gray-400">No advertisements found</td></tr>
                ) : (
                  filteredSubmissions.map((sub, idx) => (
                    <tr key={idx} className="border-b border-gray-700/30 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium">{sub.projectName}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{sub.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">{getPlanBadge(sub.plan)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          {sub.hasBanner && <Image size={16} className="text-blue-400" />}
                          {sub.hasVideo && <Video size={16} className="text-purple-400" />}
                          {!sub.hasBanner && !sub.hasVideo && <span className="text-gray-500 text-xs">No files</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-white">${sub.price}</span>
                        <span className="text-xs text-gray-500 block">{(sub.soltAmount || 0)} SOLT</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">{getStatusBadge(sub.status || 'pending')}</td>
                      <td className="px-4 py-3 hidden lg:table-cell"><span className="text-sm text-gray-400">{formatDate(sub.timestamp)}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedAd(sub)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" title="View Details">
                            <Eye size={16} className="text-blue-400" />
                          </button>
                          {sub.status !== 'approved' && (
                            <button onClick={() => updateStatus(sub.transactionHash, 'approved')} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" title="Approve">
                              <CheckCircle size={16} className="text-green-400" />
                            </button>
                          )}
                          {sub.status !== 'rejected' && (
                            <button onClick={() => updateStatus(sub.transactionHash, 'rejected')} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" title="Reject">
                              <XCircle size={16} className="text-red-400" />
                            </button>
                          )}
                          <button onClick={() => deleteAd(sub.transactionHash)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors" title="Delete">
                            <Trash2 size={16} className="text-gray-500 hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Ad Details</h2>
              <button onClick={() => setSelectedAd(null)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Project Name</p><p className="text-white font-semibold">{selectedAd.projectName}</p></div>
                <div><p className="text-xs text-gray-500">Plan</p>{getPlanBadge(selectedAd.plan)}</div>
              </div>
              <div><p className="text-xs text-gray-500">Description</p><p className="text-white">{selectedAd.description}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Website</p><a href={selectedAd.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">{selectedAd.website || 'N/A'} <ExternalLink size={12} /></a></div>
                <div><p className="text-xs text-gray-500">Amount</p><p className="text-white">${selectedAd.price} ({(selectedAd.soltAmount || 0)} SOLT)</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Telegram</p><p className="text-white">{selectedAd.telegram || 'N/A'}</p></div>
                <div><p className="text-xs text-gray-500">Twitter</p><p className="text-white">{selectedAd.twitter || 'N/A'}</p></div>
              </div>
              <div><p className="text-xs text-gray-500">Transaction Hash</p><p className="text-xs font-mono text-green-400 break-all">{selectedAd.transactionHash}</p></div>
              <div><p className="text-xs text-gray-500">Files</p><div className="flex items-center gap-4 mt-2">
                {selectedAd.hasBanner && <div className="flex items-center gap-2"><Image size={16} className="text-blue-400" /><span className="text-sm text-white">Banner</span></div>}
                {selectedAd.hasVideo && <div className="flex items-center gap-2"><Video size={16} className="text-purple-400" /><span className="text-sm text-white">Video</span></div>}
              </div></div>
              <div><p className="text-xs text-gray-500">Status</p>{getStatusBadge(selectedAd.status || 'pending')}</div>
              <div><p className="text-xs text-gray-500">Submitted</p><p className="text-sm text-white">{formatDate(selectedAd.timestamp)}</p></div>
            </div>
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-700/50">
              {selectedAd.status !== 'approved' && (
                <button onClick={() => { updateStatus(selectedAd.transactionHash, 'approved'); setSelectedAd(null); }} className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Approve
                </button>
              )}
              {selectedAd.status !== 'rejected' && (
                <button onClick={() => { updateStatus(selectedAd.transactionHash, 'rejected'); setSelectedAd(null); }} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
                  <XCircle size={16} /> Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ========== EXPORT WRAPPED WITH ERROR BOUNDARY ==========
const Advertisements = () => (
  <ErrorBoundary>
    <AdvertisementsContent />
  </ErrorBoundary>
);

export default Advertisements;