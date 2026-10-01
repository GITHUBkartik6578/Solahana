import React from 'react';
import { motion } from 'framer-motion';
import { Target, Home, GraduationCap, ShieldCheck, ShieldAlert, Sparkles, TrendingUp, PieChart } from 'lucide-react';

export default function GoalDashboardPreview() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF]">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/3 w-[650px] h-[400px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>UNIFIED DASHBOARD</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            Track Every Goal In One Place.
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B84] font-inter">
            Monitor your milestones, progress scores, emergency reserves, and asset allocations on a unified interactive dashboard.
          </p>
        </div>

        {/* Master Dashboard Mockup Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#F7F8FB]/95 via-[#F7F8FB]/75 to-[#F7F8FB]/95 border border-[#2F5BC7]/40 shadow-[0_25px_60px_rgba(2,11,45,0.9)] backdrop-blur-2xl text-left space-y-8"
        >
          
          {/* Top Bar Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2F5BC7]/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5A7FD6] to-[#1A3170] p-[1px]">
                <div className="w-full h-full bg-[#FFFFFF] rounded-[15px] flex items-center justify-center text-[#5A7FD6]">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif-luxury text-[#0F1F45]">SOLAHANA Master Life Plan</h3>
                <p className="text-xs text-[#5B6B84]">Client: Rajesh & Ananya Deshmukh • Plan ID: #SLH-9842</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="px-3.5 py-1.5 rounded-full bg-[#FFFFFF] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-sora font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Overall Goal Health Score: 78%</span>
              </div>
            </div>
          </div>

          {/* Grid Layout: 3 Columns on Large Screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Widget 1 — Dream Home Progress */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F1F45] flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#2F5BC7]" />
                  Dream Home Fund
                </span>
                <span className="text-xs font-bold font-sora text-[#5A7FD6]">85%</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[#5B6B84]">Target Corpus: ₹1.20 Cr</span>
                <span className="text-[#0F1F45] font-sora font-bold">Saved: ₹1.02 Cr</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F7F8FB] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#5A7FD6] to-[#1A3170] w-[85%]" />
              </div>
              <p className="text-[11px] text-[#5B6B84] pt-1">Target Date: Dec 2028 • On Track</p>
            </div>

            {/* Widget 2 — FIRE Retirement Progress */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F1F45] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                  FIRE Retirement Fund
                </span>
                <span className="text-xs font-bold font-sora text-[#5A7FD6]">68%</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[#5B6B84]">Target Corpus: ₹4.50 Cr</span>
                <span className="text-[#0F1F45] font-sora font-bold">Saved: ₹3.06 Cr</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F7F8FB] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#5A7FD6] to-[#1A3170] w-[68%]" />
              </div>
              <p className="text-[11px] text-[#5B6B84] pt-1">Target Age: 48 • +3 Yrs Ahead</p>
            </div>

            {/* Widget 3 — Education Fund Progress */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F1F45] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#2F5BC7]" />
                  Child Higher Education
                </span>
                <span className="text-xs font-bold font-sora text-[#5A7FD6]">72%</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-[#5B6B84]">Target Corpus: ₹45 Lakhs</span>
                <span className="text-[#0F1F45] font-sora font-bold">Saved: ₹32.4 Lakhs</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#F7F8FB] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#5A7FD6] to-[#1A3170] w-[72%]" />
              </div>
              <p className="text-[11px] text-[#5B6B84] pt-1">Target Date: Aug 2032 • On Track</p>
            </div>

            {/* Widget 4 — Emergency Fund Circular Progress */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#0F1F45] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#2F5BC7]" />
                  Emergency Shield
                </span>
                <p className="text-lg font-bold font-sora text-[#5A7FD6]">12 Months</p>
                <p className="text-[11px] text-[#5B6B84]">₹12.0 Lakh Liquid Cover</p>
              </div>

              {/* Circular Ring */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <path className="text-[#0F1F45]" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-[#5A7FD6]" strokeDasharray="100, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-[11px] font-bold font-sora text-[#0F1F45]">100%</span>
              </div>
            </div>

            {/* Widget 5 — Monthly Savings Target */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5B6B84]">Monthly Step-Up SIP</span>
                <span className="text-[#5A7FD6] font-bold">10% Step-Up</span>
              </div>
              <p className="text-xl font-bold font-sora text-[#0F1F45]">₹75,000 / mo</p>
              <div className="pt-2 border-t border-[#2F5BC7]/15 flex items-center justify-between text-[11px] text-[#5B6B84]">
                <span>Allocated Across 4 Goals</span>
                <span className="text-emerald-400 font-semibold font-sora">Auto-Debited</span>
              </div>
            </div>

            {/* Widget 6 — Asset Allocation Donut Visual */}
            <div className="p-5 rounded-2xl bg-[#FFFFFF]/85 border border-[#2F5BC7]/25 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#0F1F45] flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-[#2F5BC7]" />
                  Asset Allocation
                </span>
                <div className="space-y-0.5 text-[11px] text-[#5B6B84] pt-1">
                  <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#5A7FD6]" /> Equity: 65%</p>
                  <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Debt: 25%</p>
                  <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-600" /> Gold/SGB: 10%</p>
                </div>
              </div>

              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <path className="text-[#5A7FD6]" strokeDasharray="65, 100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-emerald-400" strokeDasharray="25, 100" strokeDashoffset="-65" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="absolute text-[10px] font-bold font-sora text-[#0F1F45]">MIX</span>
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="pt-4 border-t border-[#2F5BC7]/15 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5B6B84]">
            <span>Next Rebalancing Review: Dec 15, 2026</span>
            <span className="text-[#5A7FD6] font-semibold font-sora">Annual Tax Harvesting Active</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
