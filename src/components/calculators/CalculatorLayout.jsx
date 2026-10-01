import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  RotateCcw, 
  BookmarkPlus, 
  Share2, 
  ChevronRight, 
  ArrowLeft,
  PieChart,
  Percent,
  Layers,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import calculationService from '../../services/calculationService';

export const CALCULATOR_META = [
  {
    id: 'sip',
    type: 'SIP',
    path: '/calculators/sip',
    title: 'SIP Calculator',
    shortDesc: 'Calculate wealth creation with regular SIPs & optional annual step-up.',
    icon: TrendingUp,
    badge: 'Popular',
    category: 'Investing',
  },
  {
    id: 'emi',
    type: 'EMI',
    path: '/calculators/emi',
    title: 'EMI Calculator',
    shortDesc: 'Compute monthly home, car, or personal loan EMIs & interest schedule.',
    icon: Calculator,
    badge: 'Loans',
    category: 'Loans',
  },
  {
    id: 'retirement',
    type: 'RETIREMENT',
    path: '/calculators/retirement',
    title: 'Retirement Planner',
    shortDesc: 'Plan your inflation-adjusted target corpus & monthly FIRE savings.',
    icon: ShieldCheck,
    badge: 'Wealth',
    category: 'Retirement',
  },
  {
    id: 'goal-planner',
    type: 'GOAL_PLANNER',
    path: '/calculators/goal-planner',
    title: 'Goal Planner',
    shortDesc: 'Structure investments for children education, home purchase & major goals.',
    icon: Target,
    badge: 'Goals',
    category: 'Planning',
  },
  {
    id: 'lumpsum',
    type: 'LUMPSUM',
    path: '/calculators/lumpsum',
    title: 'Lumpsum Calculator',
    shortDesc: 'Simulate one-time investment compounding returns over custom timelines.',
    icon: PieChart,
    badge: 'Investment',
    category: 'Investing',
  },
  {
    id: 'fd',
    type: 'FD',
    path: '/calculators/fd',
    title: 'FD Calculator',
    shortDesc: 'Calculate Fixed Deposit maturity amounts & compound interest yield.',
    icon: Building2,
    badge: 'Fixed Income',
    category: 'Savings',
  },
  {
    id: 'inflation',
    type: 'INFLATION',
    path: '/calculators/inflation',
    title: 'Inflation Calculator',
    shortDesc: 'Measure future purchasing power loss & inflation-adjusted future cost.',
    icon: Percent,
    badge: 'Economics',
    category: 'Planning',
  },
];

export default function CalculatorLayout({ title, subtitle, icon: HeaderIcon, onReset, getSavePayload, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, openAuthModal } = useAuth();
  
  const [toastMessage, setToastMessage] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [calcNameInput, setCalcNameInput] = useState('');
  const [savingLoading, setSavingLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  const currentCalc = CALCULATOR_META.find(c => c.path === location.pathname) || CALCULATOR_META[0];

  const handleActionToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleInitiateSave = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const defaultName = `${currentCalc.title} - ${new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`;
    setCalcNameInput(defaultName);
    setSaveError('');
    setSaveModalOpen(true);
  };

  const handleConfirmSave = async (e) => {
    e.preventDefault();
    if (!calcNameInput.trim()) {
      setSaveError('Please enter a calculation title');
      return;
    }

    setSavingLoading(true);
    setSaveError('');

    try {
      const payload = getSavePayload ? getSavePayload() : {};
      await calculationService.saveCalculation({
        calculatorType: currentCalc.type,
        calculationName: calcNameInput.trim(),
        inputs: payload.inputs || {},
        results: payload.results || {},
      });

      setSaveModalOpen(false);
      handleActionToast('Calculation Saved Successfully');
    } catch (err) {
      console.error('[Save Calculation Error]:', err);
      setSaveError(err.response?.data?.message || err.message || 'Failed to save calculation.');
    } finally {
      setSavingLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FFFFFF] text-[#0F1F45] relative overflow-hidden">
      {/* Background Ambient Lighting */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#F7F8FB]/60 rounded-full blur-[120px] pointer-events-none" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 px-5 py-3.5 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/50 text-xs font-semibold text-[#5A7FD6] shadow-[0_10px_30px_rgba(26,49,112,0.3)] flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#2F5BC7]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Calculation Modal */}
      <AnimatePresence>
        {saveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSaveModalOpen(false)}
              className="absolute inset-0 bg-[#FFFFFF]/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl z-10 text-left"
            >
              <button
                onClick={() => setSaveModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#F7F8FB] hover:bg-[#EEF2FB] text-[#5B6B84] hover:text-[#2F5BC7] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <BookmarkPlus className="w-5 h-5 text-[#5A7FD6]" />
                <span className="text-xs font-mono text-[#5A7FD6] uppercase tracking-wider">
                  SOLAHANA SAVED WEALTH ENGINE
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl font-bold text-[#0F1F45] mb-2">
                Save Calculation Plan
              </h3>
              <p className="text-xs text-[#5B6B84] font-light mb-6">
                Name your financial calculation to revisit, track, or recalculate anytime from your user dashboard.
              </p>

              {saveError && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                  {saveError}
                </div>
              )}

              <form onSubmit={handleConfirmSave} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5A7FD6] mb-1.5">
                    Calculation Name / Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={calcNameInput}
                    onChange={(e) => setCalcNameInput(e.target.value)}
                    className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-3 px-4 text-[#0F1F45] text-xs font-semibold focus:outline-none transition-all"
                    placeholder="e.g. My Early Retirement Goal 2035"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSaveModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E4E8F0] text-xs text-[#5B6B84] hover:text-[#2F5BC7] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingLoading}
                    className="gold-glow-button px-5 py-2.5 rounded-xl text-xs font-bold text-[#0F1F45] flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow"
                  >
                    {savingLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-4 h-4" />
                        <span>Confirm & Save</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumbs & Back Link */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/calculators')}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#5B6B84] hover:text-[#5A7FD6] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Calculators</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#5B6B84]/70">
            <span>Solahana</span>
            <ChevronRight className="w-3 h-3 text-[#2F5BC7]" />
            <span>Calculators</span>
            <ChevronRight className="w-3 h-3 text-[#2F5BC7]" />
            <span className="text-[#5A7FD6] font-semibold">{currentCalc.title}</span>
          </div>
        </div>

        {/* Header Banner */}
        <div className="relative mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#F7F8FB]/90 via-[#F7F8FB]/95 to-[#F7F8FB] border border-[#2F5BC7]/30 shadow-2xl backdrop-blur-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#2F5BC7]/15 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#2F5BC7]/15 border border-[#2F5BC7]/40 text-[#5A7FD6] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(26,49,112,0.3)]">
                {HeaderIcon ? <HeaderIcon className="w-7 h-7" /> : <Calculator className="w-7 h-7" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#5A7FD6] px-2.5 py-0.5 rounded-full bg-[#2F5BC7]/15 border border-[#2F5BC7]/30">
                    {currentCalc.badge || 'FINTECH PLANNING'}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Live Precision Engine
                  </span>
                </div>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0F1F45] tracking-tight">
                  {title}
                </h1>
                <p className="text-xs text-[#5B6B84] max-w-2xl font-light leading-relaxed">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              {onReset && (
                <button
                  onClick={onReset}
                  className="px-3.5 py-2 rounded-xl bg-[#F7F8FB] hover:bg-[#F7F8FB]/80 border border-[#E4E8F0] text-xs font-semibold text-[#0F1F45] hover:text-[#5A7FD6] transition-all flex items-center gap-1.5 cursor-pointer shadow"
                  title="Reset inputs to defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={handleInitiateSave}
                className="px-4 py-2 rounded-xl gold-glow-button text-xs font-bold text-[#0F1F45] flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save Calculation</span>
              </button>

              <button
                onClick={() => handleActionToast('Shareable link copied to clipboard')}
                className="p-2 rounded-xl bg-[#F7F8FB] hover:bg-[#F7F8FB]/80 border border-[#E4E8F0] text-[#5B6B84] hover:text-[#2F5BC7] transition-all cursor-pointer shadow"
                title="Share calculation"
              >
                <Share2 className="w-4 h-4 text-[#5A7FD6]" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Navigator + Active Calculator Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Calculator Switcher (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-3 sticky top-28">
            <div className="p-4 rounded-2xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/25 backdrop-blur-xl">
              <h3 className="text-xs font-bold font-serif-luxury text-[#5A7FD6] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Calculators Engine</span>
                <Layers className="w-3.5 h-3.5 text-[#2F5BC7]" />
              </h3>

              <div className="space-y-1.5">
                {CALCULATOR_META.map((calc) => {
                  const CalcIcon = calc.icon;
                  const isActive = location.pathname === calc.path;

                  return (
                    <button
                      key={calc.id}
                      onClick={() => navigate(calc.path)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? 'bg-[#1A3170] text-white font-bold shadow-lg shadow-[#2F5BC7]/20'
                          : 'text-[#5B6B84] hover:text-white hover:bg-[#FFFFFF]/80 border border-transparent hover:border-[#2F5BC7]/20'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isActive ? 'bg-[#FFFFFF]/20 text-[#0F1F45]' : 'bg-[#2F5BC7]/10 text-[#2F5BC7]'
                      }`}>
                        <CalcIcon className="w-4 h-4" />
                      </div>
                      <span className="truncate flex-1">{calc.title}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#0F1F45]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Link to Saved Calculations Page */}
            {user && (
              <button
                onClick={() => navigate('/dashboard/calculations')}
                className="w-full p-3.5 rounded-2xl bg-[#F7F8FB]/90 border border-[#2F5BC7]/40 hover:bg-[#2F5BC7]/20 transition-all text-xs font-bold text-[#5A7FD6] flex items-center justify-between cursor-pointer shadow"
              >
                <div className="flex items-center gap-2">
                  <BookmarkPlus className="w-4 h-4 text-[#2F5BC7]" />
                  <span>My Saved Calculations</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* SEBI Compliance Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#F7F8FB]/50 to-[#F7F8FB] border border-[#E4E8F0] text-left space-y-2">
              <div className="flex items-center gap-2 text-[#5A7FD6] text-[11px] font-semibold font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>SOLAHANA PRECISION</span>
              </div>
              <p className="text-[11px] text-[#5B6B84]/70 font-light leading-relaxed">
                All projections account for compound interest formulas used by top Indian asset management companies and SEBI standards.
              </p>
            </div>
          </aside>

          {/* Active Calculator Main Area */}
          <main className="lg:col-span-9 space-y-8">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
