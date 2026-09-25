import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, RotateCcw, Bookmark, Sparkles, TrendingUp, Calendar, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { calculateRetirement, formatINR } from '../../utils/calculatorEngine';

import RetirementHero from '../planning/RetirementHero';
import WhyRetirementMatters from '../planning/WhyRetirementMatters';
import RetirementJourney from '../planning/RetirementJourney';
import RetirementSolutions from '../planning/RetirementSolutions';
import RetirementBenefits from '../planning/RetirementBenefits';
import RetirementFAQ from '../planning/RetirementFAQ';

export default function RetirementCalculator() {
  const location = useLocation();

  // Calculator State
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpensesNow, setMonthlyExpensesNow] = useState(75000);
  const [expectedInflation, setExpectedInflation] = useState(6);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [existingSavings, setExistingSavings] = useState(1000000);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const prefill = location.state?.prefill;
    if (prefill) {
      if (prefill.currentAge !== undefined) setCurrentAge(Number(prefill.currentAge));
      if (prefill.retirementAge !== undefined) setRetirementAge(Number(prefill.retirementAge));
      if (prefill.monthlyExpensesNow !== undefined) setMonthlyExpensesNow(Number(prefill.monthlyExpensesNow));
      if (prefill.expectedInflation !== undefined) setExpectedInflation(Number(prefill.expectedInflation));
      if (prefill.expectedReturn !== undefined) setExpectedReturn(Number(prefill.expectedReturn));
      if (prefill.existingSavings !== undefined) setExistingSavings(Number(prefill.existingSavings));
    }
  }, [location.state]);

  const result = useMemo(() => {
    return calculateRetirement(
      currentAge,
      retirementAge,
      monthlyExpensesNow,
      expectedInflation,
      expectedReturn,
      existingSavings
    );
  }, [currentAge, retirementAge, monthlyExpensesNow, expectedInflation, expectedReturn, existingSavings]);

  const handleReset = () => {
    setCurrentAge(30);
    setRetirementAge(60);
    setMonthlyExpensesNow(75000);
    setExpectedInflation(6);
    setExpectedReturn(12);
    setExistingSavings(1000000);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const scrollToConsultation = () => {
    const el = document.getElementById('global-consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('retirement-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      
      {/* 1. PREMIUM HERO SECTION */}
      <RetirementHero
        onStartPlanning={scrollToCalculator}
        onRequestCallback={scrollToConsultation}
      />

      {/* 2. WHY RETIREMENT PLANNING MATTERS */}
      <WhyRetirementMatters />

      {/* 3. RETIREMENT PLANNING JOURNEY (GOLD ROADMAP) */}
      <RetirementJourney />

      {/* 4. RETIREMENT PLANNING SOLUTIONS */}
      <RetirementSolutions />

      {/* 5. RETIREMENT BENEFITS SECTION */}
      <RetirementBenefits />

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <RetirementFAQ />

      {/* 7. RETIREMENT CALCULATOR (PENULTIMATE SECTION - SOLAHANA BRANDING) */}
      <section id="retirement-calculator" className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden border-t border-[#E4E8F0]">
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2F5BC7]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Calculator Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E8F0] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F5BC7]" />
              <span>INTELLIGENT CALCULATOR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45]">
              Retirement Corpus &amp; FIRE Calculator
            </h2>
            <p className="text-sm sm:text-base text-[#475569]">
              Calculate inflation-adjusted retirement corpus requirements, future monthly expenses, and required SIP cashflow.
            </p>
          </div>

          {/* Calculator Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Box: Inputs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E8F0] shadow-xl text-left space-y-6"
            >
              {/* Header inside inputs card */}
              <div className="flex items-center justify-between border-b border-[#E4E8F0]/60 pb-4">
                <h3 className="font-serif-luxury text-lg font-bold text-[#0F1F45] flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#2F5BC7]" />
                  <span>Retirement Parameters</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-[#64748B] hover:text-[#0F1F45] hover:border-[#2F5BC7] transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
                    title="Reset to default values"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="p-2 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-[#2F5BC7] hover:bg-[#F7F8FB] hover:border-[#2F5BC7] transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#2F5BC7]" />
                    <span>{isSaved ? 'Saved!' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Age Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F1F45]">Current Age (Years)</label>
                  <input
                    type="number"
                    min="18"
                    max="70"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-3 text-[#0F1F45] text-xs font-mono outline-none"
                  />
                  <input
                    type="range"
                    min="18"
                    max="70"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#F7F8FB] rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F1F45]">Retirement Age (Years)</label>
                  <input
                    type="number"
                    min={currentAge + 1}
                    max="85"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-3 text-[#0F1F45] text-xs font-mono outline-none"
                  />
                  <input
                    type="range"
                    min={currentAge + 1}
                    max="85"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#F7F8FB] rounded-lg"
                  />
                </div>
              </div>

              {/* Monthly Living Expenses Today */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-[#0F1F45]">Monthly Living Expenses Today</label>
                  <span className="font-mono text-sm font-bold text-[#2F5BC7]">{formatINR(monthlyExpensesNow)}</span>
                </div>
                <input
                  type="number"
                  min="10000"
                  max="2000000"
                  step="5000"
                  value={monthlyExpensesNow}
                  onChange={(e) => setMonthlyExpensesNow(Number(e.target.value))}
                  className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono outline-none"
                />
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={monthlyExpensesNow}
                  onChange={(e) => setMonthlyExpensesNow(Number(e.target.value))}
                  className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#F7F8FB] rounded-lg"
                />
              </div>

              {/* Inflation & Pre-Retirement Return */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F1F45]">Expected Inflation (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="15"
                    value={expectedInflation}
                    onChange={(e) => setExpectedInflation(Number(e.target.value))}
                    className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-3 text-[#0F1F45] text-xs font-mono outline-none"
                  />
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    value={expectedInflation}
                    onChange={(e) => setExpectedInflation(Number(e.target.value))}
                    className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#F7F8FB] rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0F1F45]">Expected Return (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="25"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-3 text-[#0F1F45] text-xs font-mono outline-none"
                  />
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="0.5"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#F7F8FB] rounded-lg"
                  />
                </div>
              </div>

              {/* Existing Retirement Savings */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-[#0F1F45]">Existing Retirement Savings / Investments</label>
                  <span className="font-mono text-sm font-bold text-emerald-700">{formatINR(existingSavings)}</span>
                </div>
                <input
                  type="number"
                  step="50000"
                  min="0"
                  max="100000000"
                  value={existingSavings}
                  onChange={(e) => setExistingSavings(Number(e.target.value))}
                  className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono outline-none"
                />
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="50000"
                  value={existingSavings}
                  onChange={(e) => setExistingSavings(Number(e.target.value))}
                  className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#F7F8FB] rounded-lg"
                />
              </div>
            </motion.div>

            {/* Right Box: Output & Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              {/* Primary Output Highlight Box */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#F7F8FB] to-white border-2 border-[#2F5BC7] shadow-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-bold">
                    REQUIRED RETIREMENT CORPUS AT AGE {retirementAge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/40 text-[#2F5BC7] text-[10px] font-mono font-semibold">
                    25+ Yrs Inflation Hedged
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-[#0F1F45]">
                  {formatINR(result.requiredCorpus)}
                </div>
                <p className="text-xs text-[#64748B] font-sans">
                  Estimated nest egg required to maintain your living standard with {expectedInflation}% expected annual inflation.
                </p>
              </div>

              {/* Secondary Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-emerald-500/30 shadow-sm space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-emerald-700">Required Monthly SIP</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-800">{formatINR(result.requiredMonthlySIP)}</div>
                  <div className="text-[10px] text-emerald-700/80 font-medium">To achieve corpus target</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E4E8F0] shadow-sm space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#2F5BC7]">Future Monthly Expense</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F1F45]">{formatINR(result.futureMonthlyExpense)}</div>
                  <div className="text-[10px] text-[#64748B] font-medium">At age {retirementAge}</div>
                </div>
              </div>

              {/* Progress Funding Bar */}
              <div className="p-5 rounded-2xl bg-white border border-[#E4E8F0] shadow-sm space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#64748B] font-semibold">Existing Savings Funding Progress</span>
                  <span className="text-emerald-700 font-bold">{result.progressPct}% Funded</span>
                </div>
                <div className="w-full bg-[#F7F8FB] h-3 rounded-full overflow-hidden border border-[#E4E8F0]">
                  <div
                    className="bg-gradient-to-r from-[#1A3170] to-emerald-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, result.progressPct)}%` }}
                  />
                </div>
              </div>

              {/* Recharts Area Chart */}
              <div className="p-6 rounded-3xl bg-white border border-[#E4E8F0] shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4E8F0]/60 pb-3">
                  <h4 className="text-xs font-bold font-mono text-[#0F1F45] uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#2F5BC7]" />
                    <span>Corpus Accumulation Path (Age {currentAge} → {retirementAge})</span>
                  </h4>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2F5BC7" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2F5BC7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E4E8F0" opacity={0.5} />
                      <XAxis dataKey="age" stroke="#64748B" fontSize={10} tickLine={false} />
                      <YAxis
                        stroke="#64748B"
                        fontSize={10}
                        tickLine={false}
                        tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E4E8F0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                          fontSize: '11px',
                          color: '#0F1F45',
                        }}
                        formatter={(val) => [formatINR(val), 'Projected Corpus']}
                        labelFormatter={(label) => `Age: ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="corpus"
                        stroke="#2F5BC7"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#goldAreaGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </section>

    </div>
  );
}
