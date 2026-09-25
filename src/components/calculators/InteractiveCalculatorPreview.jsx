import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Sparkles, PieChart, ShieldCheck } from 'lucide-react';

export default function InteractiveCalculatorPreview() {
  const [monthlySip, setMonthlySip] = useState(50000);
  const [years, setYears] = useState(15);
  const [returnRate, setReturnRate] = useState(12);

  // Compound interest calculation formula
  const months = years * 12;
  const i = returnRate / 12 / 100;
  const totalInvested = monthlySip * months;
  const totalCorpus = Math.round(monthlySip * ((Math.pow(1 + i, months) - 1) / i) * (1 + i));
  const estimatedReturns = Math.max(0, totalCorpus - totalInvested);
  const returnsPercent = Math.round((estimatedReturns / totalCorpus) * 100);

  const formatCurrency = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    } else if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF]">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/3 w-[650px] h-[400px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>INTERACTIVE ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            A Preview Of How SOLAHANA Calculators Work.
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B84] font-inter">
            Adjust the sliders below to test our real-time SIP compounding model.
          </p>
        </div>

        {/* Master Interactive Calculator Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#F7F8FB]/95 via-[#F7F8FB]/75 to-[#F7F8FB]/95 border border-[#2F5BC7]/40 shadow-[0_25px_60px_rgba(2,11,45,0.9)] backdrop-blur-2xl text-left space-y-8"
        >
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2F5BC7]/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5A7FD6] to-[#1A3170] p-[1px]">
                <div className="w-full h-full bg-[#FFFFFF] rounded-[15px] flex items-center justify-center text-[#5A7FD6]">
                  <Calculator className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif-luxury text-[#0F1F45]">SIP Compounding Engine</h3>
                <p className="text-xs text-[#5B6B84]">Live Interactive Simulation • Real-Time Math</p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
              LIVE MATH CALCULATING
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Interactive Sliders */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Slider 1: Monthly SIP */}
              <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 space-y-3">
                <div className="flex items-center justify-between text-xs font-sora">
                  <span className="text-[#0F1F45] font-semibold">Monthly SIP Amount</span>
                  <span className="text-[#5A7FD6] font-bold text-sm">₹{monthlySip.toLocaleString('en-IN')} / mo</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={monthlySip}
                  onChange={(e) => setMonthlySip(Number(e.target.value))}
                  className="w-full h-2 bg-[#F7F8FB] rounded-lg appearance-none cursor-pointer accent-[#5A7FD6]"
                />
                <div className="flex justify-between text-[10px] text-[#5B6B84]">
                  <span>₹5,000/mo</span>
                  <span>₹75,000/mo</span>
                  <span>₹1,50,000/mo</span>
                </div>
              </div>

              {/* Slider 2: Investment Period */}
              <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 space-y-3">
                <div className="flex items-center justify-between text-xs font-sora">
                  <span className="text-[#0F1F45] font-semibold">Investment Horizon (Years)</span>
                  <span className="text-[#5A7FD6] font-bold text-sm">{years} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-[#F7F8FB] rounded-lg appearance-none cursor-pointer accent-[#5A7FD6]"
                />
                <div className="flex justify-between text-[10px] text-[#5B6B84]">
                  <span>1 Year</span>
                  <span>15 Years</span>
                  <span>30 Years</span>
                </div>
              </div>

              {/* Slider 3: Expected Return Rate */}
              <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 space-y-3">
                <div className="flex items-center justify-between text-xs font-sora">
                  <span className="text-[#0F1F45] font-semibold">Expected Annual Return (CAGR)</span>
                  <span className="text-[#5A7FD6] font-bold text-sm">{returnRate}%</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="16"
                  step="0.5"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                  className="w-full h-2 bg-[#F7F8FB] rounded-lg appearance-none cursor-pointer accent-[#5A7FD6]"
                />
                <div className="flex justify-between text-[10px] text-[#5B6B84]">
                  <span>6% (Fixed Debt)</span>
                  <span>12% (Balanced Equity)</span>
                  <span>16% (Growth)</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Output Results & Donut Chart Visual */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Output Result Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-[#FFFFFF]/90 border border-[#2F5BC7]/20">
                  <span className="text-[10px] text-[#5B6B84] uppercase">Total Invested</span>
                  <p className="text-base font-bold font-sora text-[#0F1F45] mt-1">{formatCurrency(totalInvested)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFFFFF]/90 border border-[#2F5BC7]/20">
                  <span className="text-[10px] text-[#5B6B84] uppercase">Est. Returns</span>
                  <p className="text-base font-bold font-sora text-emerald-400 mt-1">+{formatCurrency(estimatedReturns)}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F7F8FB] border border-[#5A7FD6]/50 shadow-[0_0_20px_rgba(26,49,112,0.2)]">
                  <span className="text-[10px] text-[#5A7FD6] font-bold uppercase">Total Target Corpus</span>
                  <p className="text-lg font-bold font-sora text-[#5A7FD6] mt-1">{formatCurrency(totalCorpus)}</p>
                </div>
              </div>

              {/* Live Visual Graph Box */}
              <div className="p-6 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#0F1F45] font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#2F5BC7]" />
                    Compounding Growth Curve ({years} Yrs)
                  </span>
                  <span className="text-[#5A7FD6] font-sora font-bold">{returnsPercent}% Wealth Gain</span>
                </div>

                <div className="h-28 w-full pt-4 relative">
                  <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="calcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5A7FD6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#2F5BC7" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 85 Q 150 75 250 45 T 400 10 L 400 100 L 0 100 Z" fill="url(#calcGrad)" />
                    <path d="M 0 85 Q 150 75 250 45 T 400 10" fill="none" stroke="#5A7FD6" strokeWidth="3" />
                  </svg>
                </div>

                <div className="pt-2 border-t border-[#2F5BC7]/15 flex items-center justify-between text-[11px] text-[#5B6B84]">
                  <span>Formula: Goal-Based SIP Compound Model</span>
                  <span className="text-[#5A7FD6] font-sora font-semibold">Zero Commission Direct</span>
                </div>
              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
