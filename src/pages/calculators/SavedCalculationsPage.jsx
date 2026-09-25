import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BookmarkPlus, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  RotateCcw, 
  TrendingUp, 
  Calculator as CalcIcon, 
  ShieldCheck, 
  Target, 
  PieChart, 
  Building2, 
  Percent, 
  Calendar, 
  Clock, 
  X, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import calculationService from '../../services/calculationService';
import { formatINR } from '../../utils/calculatorEngine';
import { CALCULATOR_META } from '../../components/calculators/CalculatorLayout';

export default function SavedCalculationsPage() {
  const navigate = useNavigate();

  const [calculations, setCalculations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Detail Modal & Delete Confirmation Modal
  const [detailCalc, setDetailCalc] = useState(null);
  const [deleteConfirmCalc, setDeleteConfirmCalc] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchCalculations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await calculationService.getMyCalculations({
        type: selectedType,
        search: searchQuery || undefined,
        sort: sortBy,
      });
      setCalculations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Fetch Calculations Error]:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load saved calculations.');
      setCalculations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, [selectedType, sortBy]);

  // Handle Search submit / debounce
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCalculations();
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmCalc) return;
    setDeleteLoading(true);
    try {
      await calculationService.deleteCalculation(deleteConfirmCalc._id);
      setCalculations((prev) => prev.filter((item) => item._id !== deleteConfirmCalc._id));
      showToast('Calculation Deleted Successfully');
      setDeleteConfirmCalc(null);
    } catch (err) {
      console.error('[Delete Calculation Error]:', err);
      alert(err.response?.data?.message || 'Failed to delete calculation');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Recalculate
  const handleRecalculate = (calc) => {
    const typeUpper = (calc.calculatorType || 'SIP').toUpperCase();
    const typeRouteMap = {
      'SIP': '/calculators/sip',
      'EMI': '/calculators/emi',
      'RETIREMENT': '/calculators/retirement',
      'GOAL_PLANNER': '/calculators/goal-planner',
      'LUMPSUM': '/calculators/lumpsum',
      'FD': '/calculators/fd',
      'INFLATION': '/calculators/inflation',
    };
    const dest = typeRouteMap[typeUpper] || '/calculators/sip';
    
    // Navigate and pass prefill inputs state
    navigate(dest, { state: { prefill: calc.inputs } });
  };

  // Helper to format Key Result summary text for each calculator type
  const renderKeyResult = (calc) => {
    const res = calc.results || {};
    const type = (calc.calculatorType || '').toUpperCase();

    if (type === 'SIP') {
      return (
        <div className="space-y-0.5">
          <span className="text-[10px] text-emerald-400 font-mono uppercase">Future Value</span>
          <div className="text-lg font-bold font-mono text-[#5A7FD6]">{formatINR(res.futureValue)}</div>
        </div>
      );
    }

    if (type === 'EMI') {
      return (
        <div className="space-y-0.5">
          <span className="text-[10px] text-blue-300 font-mono uppercase">Monthly EMI</span>
          <div className="text-lg font-bold font-mono text-white">{formatINR(res.monthlyEMI)}</div>
        </div>
      );
    }

    if (type === 'RETIREMENT') {
      return (
        <div className="space-y-0.5">
          <span className="text-[10px] text-[#5A7FD6] font-mono uppercase">Required Corpus</span>
          <div className="text-lg font-bold font-mono text-[#5A7FD6]">{formatINR(res.requiredCorpus)}</div>
        </div>
      );
    }

    if (type === 'GOAL_PLANNER') {
      return (
        <div className="space-y-0.5">
          <span className="text-[10px] text-emerald-400 font-mono uppercase">Monthly SIP Needed</span>
          <div className="text-lg font-bold font-mono text-emerald-300">{formatINR(res.requiredMonthlySIP)}</div>
        </div>
      );
    }

    if (type === 'LUMPSUM') {
      return (
        <div className="space-y-0.5">
          <span className="text-[10px] text-[#5A7FD6] font-mono uppercase">Maturity Value</span>
          <div className="text-lg font-bold font-mono text-white">{formatINR(res.futureValue)}</div>
        </div>
      );
    }

    if (type === 'FD') {
      return (
        <div className="space-y-0.5">
          <span className="text-[10px] text-[#5A7FD6] font-mono uppercase">Maturity Amount</span>
          <div className="text-lg font-bold font-mono text-[#5A7FD6]">{formatINR(res.maturityAmount)}</div>
        </div>
      );
    }

    if (type === 'INFLATION') {
      return (
        <div className="space-y-0.5">
          <span className="text-[10px] text-rose-400 font-mono uppercase">Future Cost</span>
          <div className="text-lg font-bold font-mono text-white">{formatINR(res.futureCost)}</div>
        </div>
      );
    }

    return (
      <div className="text-sm font-mono font-bold text-[#5A7FD6]">
        {formatINR(res.futureValue || res.maturityAmount || res.monthlyEMI || 0)}
      </div>
    );
  };

  const getCalcIcon = (type) => {
    const t = (type || '').toUpperCase();
    if (t === 'SIP') return TrendingUp;
    if (t === 'EMI') return CalcIcon;
    if (t === 'RETIREMENT') return ShieldCheck;
    if (t === 'GOAL_PLANNER') return Target;
    if (t === 'LUMPSUM') return PieChart;
    if (t === 'FD') return Building2;
    if (t === 'INFLATION') return Percent;
    return BookmarkPlus;
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FFFFFF] text-[#0F1F45] relative overflow-hidden text-left">
      {/* Ambient Gold Blurs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 px-5 py-3.5 rounded-2xl bg-white border border-[#E4E8F0] text-xs font-semibold text-[#0F1F45] shadow-xl flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#2F5BC7]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailCalc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailCalc(null)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white border border-[#E4E8F0] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl z-10 text-left max-h-[85vh] overflow-y-auto">
              <button onClick={() => setDetailCalc(null)} className="absolute top-5 right-5 p-2 rounded-full bg-[#FFFFFF] hover:bg-[#F7F8FB] text-[#475569] transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <BookmarkPlus className="w-5 h-5 text-[#2F5BC7]" />
                <span className="text-xs font-mono text-[#2F5BC7] font-bold uppercase tracking-wider">
                  {detailCalc.calculatorType} SUMMARY
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl font-bold text-[#0F1F45] mb-1">
                {detailCalc.calculationName || detailCalc.title}
              </h3>
              <p className="text-xs text-[#475569] font-light mb-6">
                Saved on {new Date(detailCalc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>

              {/* Inputs Grid */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold text-[#2F5BC7] uppercase font-mono tracking-wider">Saved Inputs</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(detailCalc.inputs || {}).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E4E8F0]">
                      <span className="text-[10px] text-[#475569] font-mono uppercase block truncate">{key}</span>
                      <span className="text-xs font-bold font-mono text-[#0F1F45]">{typeof val === 'number' && val > 1000 ? formatINR(val) : String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Grid */}
              <div className="space-y-4 mb-6">
                <h4 className="text-xs font-bold text-[#2F5BC7] uppercase font-mono tracking-wider">Computed Outputs</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(detailCalc.results || {}).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0]">
                      <span className="text-[10px] text-[#2F5BC7] font-mono font-bold uppercase block truncate">{key}</span>
                      <span className="text-xs font-bold font-mono text-[#0F1F45]">{typeof val === 'number' && val > 100 ? formatINR(val) : String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E4E8F0]">
                <button onClick={() => setDetailCalc(null)} className="px-4 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F7F8FB] text-xs text-[#475569] font-semibold cursor-pointer">
                  Close
                </button>
                <button onClick={() => { const target = detailCalc; setDetailCalc(null); handleRecalculate(target); }} className="gold-glow-button px-5 py-2 rounded-xl text-xs font-bold text-[#0F1F45] flex items-center gap-2 cursor-pointer shadow">
                  <RotateCcw className="w-4 h-4" />
                  <span>Recalculate in Tool</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmCalc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirmCalc(null)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white border border-rose-200 rounded-3xl p-6 shadow-2xl z-10 text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0F1F45]">Delete Calculation?</h3>
                <p className="text-xs text-[#475569] font-light mt-1">
                  Are you sure you want to delete <strong>"{deleteConfirmCalc.calculationName || deleteConfirmCalc.title}"</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setDeleteConfirmCalc(null)} className="px-4 py-2 rounded-xl bg-[#FFFFFF] text-xs text-[#475569] font-semibold cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} disabled={deleteLoading} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white cursor-pointer shadow disabled:opacity-50">
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E4E8F0] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#2F5BC7] px-2.5 py-0.5 rounded-full bg-[#EEF2FB]">
                USER DASHBOARD
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl font-bold text-[#0F1F45]">
              My Saved Calculations
            </h1>
            <p className="text-xs text-[#475569] font-light">
              Revisit, track, or recalculate your saved SIP, EMI, Retirement, and Goal planning calculations.
            </p>
          </div>

          <button
            onClick={() => navigate('/calculators')}
            className="gold-glow-button px-5 py-2.5 rounded-xl text-xs font-bold text-[#0F1F45] flex items-center gap-2 self-start md:self-auto cursor-pointer shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Calculation</span>
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="p-4 rounded-2xl bg-white border border-[#E4E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#2F5BC7] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search calculation name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2 pl-10 pr-4 text-[#0F1F45] text-xs placeholder-[#475569]/60 focus:outline-none transition-colors"
            />
          </form>

          {/* Filters & Sorting */}
          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2 px-3 text-[#0F1F45] text-xs font-semibold"
            >
              <option value="ALL">All Calculators</option>
              <option value="SIP">SIP Calculator</option>
              <option value="EMI">EMI Calculator</option>
              <option value="RETIREMENT">Retirement Planner</option>
              <option value="GOAL_PLANNER">Goal Planner</option>
              <option value="LUMPSUM">Lumpsum Calculator</option>
              <option value="FD">FD Calculator</option>
              <option value="INFLATION">Inflation Calculator</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2 px-3 text-[#0F1F45] text-xs font-semibold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

        </div>

        {/* Calculations Cards Grid / Empty State */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#2F5BC7]/20 border-t-[#2F5BC7] rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#2F5BC7]">Loading saved wealth plans...</p>
          </div>
        ) : calculations.length === 0 ? (
          /* Luxury Empty State Illustration */
          <div className="py-20 px-6 text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#2F5BC7]/10 border border-[#E4E8F0] text-[#2F5BC7] flex items-center justify-center shadow-[0_0_30px_rgba(26,49,112,0.15)]">
              <BookmarkPlus className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#0F1F45]">
                No saved calculations yet.
              </h3>
              <p className="text-xs text-[#475569] font-light leading-relaxed">
                Use SOLAHANA's intelligent planning tools to compute SIP wealth, retirement corpus, or loan EMIs and save them to your account.
              </p>
            </div>

            <button
              onClick={() => navigate('/calculators')}
              className="gold-glow-button px-6 py-3 rounded-full text-xs font-bold text-[#0F1F45] inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Explore Calculators</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculations.map((calc) => {
              const CalcIcon = getCalcIcon(calc.calculatorType);

              return (
                <div
                  key={calc._id}
                  className="rounded-3xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group text-left"
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Type Badge */}
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-[#2F5BC7]/10 text-[#2F5BC7]">
                        <CalcIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2F5BC7] px-2.5 py-0.5 rounded-full bg-[#EEF2FB]">
                        {calc.calculatorType}
                      </span>
                    </div>

                    {/* Calculation Title */}
                    <div>
                      <h4 className="font-serif-luxury text-lg font-bold text-[#0F1F45] truncate group-hover:text-[#2F5BC7] transition-colors">
                        {calc.calculationName || calc.title}
                      </h4>
                      <span className="text-[11px] text-[#475569] font-mono">
                        Saved {new Date(calc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Key Result Summary */}
                    <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E4E8F0]">
                      {renderKeyResult(calc)}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-[#E4E8F0] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setDetailCalc(calc)}
                      className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] hover:bg-[#F7F8FB] text-xs font-semibold text-[#475569] hover:text-[#0F1F45] transition-colors flex items-center gap-1.5 cursor-pointer border border-[#E4E8F0]"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#2F5BC7]" />
                      <span>Details</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRecalculate(calc)}
                        className="px-3 py-1.5 rounded-lg bg-[#2F5BC7]/10 hover:bg-[#2F5BC7]/20 text-xs font-bold text-[#2F5BC7] transition-colors flex items-center gap-1.5 cursor-pointer border border-[#E4E8F0]"
                        title="Open calculator with prefilled inputs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Recalculate</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmCalc(calc)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete calculation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
