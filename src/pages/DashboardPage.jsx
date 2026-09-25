import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Video, 
  PhoneCall, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Loader2,
  RefreshCw,
  User,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import consultationService from '../services/consultationService';
import calculationService from '../services/calculationService';
import { BookmarkPlus, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/calculatorEngine';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // STEP 2: Initialize safely - Never initialize with undefined
  const [consultations, setConsultations] = useState([]);
  const [recentCalculations, setRecentCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchRecentCalculations = async () => {
    try {
      const data = await calculationService.getMyCalculations({ sort: 'newest' });
      setRecentCalculations(Array.isArray(data) ? data.slice(0, 3) : []);
    } catch (err) {
      console.warn('[Dashboard recent calculations error]:', err);
      setRecentCalculations([]);
    }
  };

  const fetchConsultations = async () => {
    setLoading(true);
    setError('');
    try {
      // STEP 1 & 2: Call GET /api/consultations/my and receive response.data.data array directly
      const consultationList = await consultationService.getMyConsultations({
        status: statusFilter || undefined,
      });

      // STEP 2 & 6: Guarantee array state, fallback to empty array on any abnormality
      setConsultations(Array.isArray(consultationList) ? consultationList : []);
    } catch (err) {
      console.error('[Dashboard fetch error]:', err);
      setError(err.response?.data?.message || err.message || 'Unable to load consultations.');
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
    fetchRecentCalculations();
  }, [statusFilter]);

  // STEP 5: Cancel Flow - Re-fetch GET /api/consultations/my after cancel
  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this pending consultation?')) return;
    setCancellingId(id);
    try {
      await consultationService.cancelConsultation(id);
      await fetchConsultations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel consultation');
    } finally {
      setCancellingId(null);
    }
  };

  // STEP 3: Safe Rendering Array Guard - Never call .map() on undefined
  const validConsultations = Array.isArray(consultations) ? consultations : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2F5BC7]/20 text-[#5A7FD6] border border-[#2F5BC7]/40 flex items-center gap-1.5 w-fit">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Confirmed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'Completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 w-fit">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getModeIcon = (mode) => {
    if (mode === 'Video Call') return <Video className="w-4 h-4 text-[#2F5BC7]" />;
    if (mode === 'Phone Call') return <PhoneCall className="w-4 h-4 text-[#2F5BC7]" />;
    return <Building className="w-4 h-4 text-[#2F5BC7]" />;
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#FFFFFF] text-[#0F1F45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Profile Summary */}
        <div className="mb-10 p-8 rounded-3xl bg-white/95 border border-[#2F5BC7]/35 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-xs font-semibold text-[#1A3170] mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              SOLAHANA CLIENT DASHBOARD
            </div>
            <h1 className="font-serif-luxury text-3xl md:text-4xl font-bold text-[#0F1F45]">
              Welcome back, <span className="text-[#1A3170]">{user?.name}</span>
            </h1>
            <p className="text-[#64748B] text-sm mt-1">
              Manage your private 1-on-1 financial planning consultations and milestone planning sessions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchConsultations}
              className="p-3 rounded-xl bg-[#F7F8FB] hover:bg-white border border-[#2F5BC7]/30 text-[#0F1F45] transition-colors cursor-pointer shadow-sm"
              title="Refresh Consultations"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="gold-glow-button px-5 py-3 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Briefcase className="w-4 h-4" />
              <span>Book New Session</span>
            </button>
          </div>
        </div>

        {/* Section Heading & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-serif-luxury text-2xl font-bold text-[#0F1F45] flex items-center gap-2">
            My Consultations
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#1A3170]">
              {validConsultations.length}
            </span>
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#64748B]">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#2F5BC7]/30 rounded-xl px-3 py-1.5 text-[#0F1F45] focus:outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* STEP 4 & 6: Loading, Error & Empty States */}
        {loading ? (
          /* STEP 6: Skeleton Loader */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-[#2F5BC7]/20 animate-pulse space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-[#F7F8FB] rounded w-1/3" />
                  <div className="h-6 bg-[#2F5BC7]/20 rounded-full w-20" />
                </div>
                <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#2F5BC7]/10">
                  <div className="h-4 bg-[#F7F8FB] rounded w-2/3" />
                  <div className="h-4 bg-[#F7F8FB] rounded w-1/2" />
                </div>
                <div className="h-4 bg-[#F7F8FB] rounded w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* STEP 6: API Failure Retry State */
          <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-red-700 text-sm flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2 text-red-600 font-semibold">
              <AlertCircle className="w-5 h-5" />
              <span>Unable to load consultations.</span>
            </div>
            <p className="text-xs text-[#64748B] max-w-md">{error}</p>
            <button
              onClick={fetchConsultations}
              className="px-6 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 border border-red-300 text-red-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : validConsultations.length === 0 ? (
          /* STEP 4: Empty State Card */
          <div className="py-16 px-6 text-center rounded-3xl bg-white border border-[#2F5BC7]/30 space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 flex items-center justify-center text-[#1A3170]">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#0F1F45]">No consultations booked yet.</h3>
            <p className="text-[#64748B] text-xs max-w-md mx-auto">
              You haven't booked any planning sessions yet. Connect with our certified wealth team to structure your goals.
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="gold-glow-button px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              Book Your First Consultation
            </button>
          </div>
        ) : (
          /* STEP 3: Safe Map Rendering */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Array.isArray(consultations) ? consultations : []).map((item) => (
              <motion.div
                key={item._id || item.id || Math.random()}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-white border border-[#2F5BC7]/30 shadow-md flex flex-col justify-between space-y-4 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-serif-luxury text-lg font-bold text-[#0F1F45]">
                      {item.goal || 'Financial Planning'}
                    </h3>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#2F5BC7]/15 text-xs">
                    <div className="flex items-center gap-2 text-[#475569]">
                      <Calendar className="w-4 h-4 text-[#2F5BC7]" />
                      <span>
                        {item.preferredDate
                          ? new Date(item.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'TBD'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#475569]">
                      <Clock className="w-4 h-4 text-[#2F5BC7]" />
                      <span>{item.preferredTime || 'TBD'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#475569]">
                      {getModeIcon(item.consultationMode)}
                      <span>{item.consultationMode || 'Video Call'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[#475569]">
                      <User className="w-4 h-4 text-[#2F5BC7]" />
                      <span>{item.fullName || user?.name || 'Client'}</span>
                    </div>
                  </div>

                  {item.message && (
                    <p className="text-xs text-[#64748B] line-clamp-2 mt-3 italic bg-[#F7F8FB] p-2.5 rounded-lg border border-[#2F5BC7]/15">
                      "{item.message}"
                    </p>
                  )}

                  {item.status === 'Confirmed' && item.meetingLink && (
                    <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-700">
                      <span className="truncate">Meeting Link: {item.meetingLink}</span>
                      <a
                        href={item.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold flex items-center gap-1 hover:bg-blue-700 transition-colors"
                      >
                        Join <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-[#94A3B8]">
                    {item.createdAt ? `Booked on ${new Date(item.createdAt).toLocaleDateString('en-IN')}` : ''}
                  </span>

                  {item.status === 'Pending' && (
                    <button
                      onClick={() => handleCancelBooking(item._id)}
                      disabled={cancellingId === item._id}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                    >
                      {cancellingId === item._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      <span>Cancel Request</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Recent Calculations Section */}
        <div className="pt-8 border-t border-[#2F5BC7]/20 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-[#0F1F45] flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-[#1A3170]" />
                <span>Recent Calculations</span>
              </h2>
              <p className="text-xs text-[#64748B] font-light">
                Your last 3 saved financial compounding plans.
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard/calculations')}
              className="px-4 py-2 rounded-xl bg-white hover:bg-[#F7F8FB] border border-[#2F5BC7]/30 text-xs font-bold text-[#1A3170] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>View All Calculations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentCalculations.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-[#2F5BC7]/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-[#0F1F45]">No saved calculations yet</div>
                <div className="text-xs text-[#64748B]">Use our financial calculators to compute wealth targets and save them to your account.</div>
              </div>
              <button
                onClick={() => navigate('/calculators')}
                className="gold-glow-button px-4 py-2 rounded-xl text-xs font-bold text-white shrink-0 cursor-pointer shadow"
              >
                Explore Calculators
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentCalculations.map((calc) => (
                <div
                  key={calc._id || calc.id || Math.random()}
                  className="p-5 rounded-2xl bg-white border border-[#2F5BC7]/30 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] transition-all space-y-3 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#1A3170] px-2 py-0.5 rounded bg-[#2F5BC7]/10 border border-[#2F5BC7]/25">
                      {calc.calculatorType}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] font-mono">
                      {calc.createdAt ? new Date(calc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                    </span>
                  </div>

                  <div className="font-semibold text-sm text-[#0F1F45] truncate">
                    {calc.calculationName || calc.title || 'Saved Plan'}
                  </div>

                  <button
                    onClick={() => {
                      const typeUpper = (calc.calculatorType || 'SIP').toUpperCase();
                      const routeMap = {
                        'SIP': '/calculators/sip',
                        'EMI': '/calculators/emi',
                        'RETIREMENT': '/calculators/retirement',
                        'GOAL_PLANNER': '/calculators/goal-planner',
                        'LUMPSUM': '/calculators/lumpsum',
                        'FD': '/calculators/fd',
                        'INFLATION': '/calculators/inflation',
                      };
                      navigate(routeMap[typeUpper] || '/calculators/sip', { state: { prefill: calc.inputs } });
                    }}
                    className="w-full py-2 rounded-xl bg-[#F7F8FB] hover:bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-xs text-[#1A3170] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Recalculate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
