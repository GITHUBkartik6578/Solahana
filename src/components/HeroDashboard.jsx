import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  ShieldCheck, 
  GraduationCap, 
  Calculator, 
  PiggyBank, 
  TrendingUp, 
  Award,
  CheckCircle2,
  Clock,
  Zap,
  Sparkles,
  Lock,
  Heart
} from 'lucide-react';

export default function HeroDashboard() {
  return (
    <div className="relative w-full h-[620px] lg:h-[680px] flex items-center justify-center perspective-1000 select-none">
      
      {/* Central Golden Lighting Backdrop Glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#2F5BC7]/20 via-[#5A7FD6]/10 to-transparent rounded-full blur-[110px] pointer-events-none" />

      {/* ========================================== */}
      {/* CENTRAL MAIN LARGE DASHBOARD CARD          */}
      {/* ========================================== */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[340px] sm:w-[420px] lg:w-[460px] bg-gradient-to-b from-[#F7F8FB]/90 via-[#F7F8FB]/95 to-[#F7F8FB] border-2 border-[#5A7FD6]/40 rounded-[36px] p-6 sm:p-7 shadow-[0_30px_90px_rgba(2,11,45,0.95),0_0_35px_rgba(26,49,112,0.25)] backdrop-blur-2xl z-20 text-left"
      >
        {/* Dashboard Top Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#2F5BC7]/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A7FD6] via-[#1A3170] to-[#1A3170] p-[1px] shadow-[0_0_15px_rgba(26,49,112,0.4)]">
              <div className="w-full h-full bg-[#FFFFFF] rounded-[11px] flex items-center justify-center text-[#5A7FD6]">
                <Target className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-xs font-serif-luxury font-bold text-[#0F1F45] flex items-center gap-1.5">
                SOLAHANA Life Plan
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#2F5BC7]/20 text-[#5A7FD6] border border-[#2F5BC7]/40 font-sora">
                  ACTIVE
                </span>
              </div>
              <div className="text-[10px] text-[#5B6B84]">Master Financial Roadmap • 2026-2045</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider font-sora text-[#5B6B84]">Overall Plan Score</div>
            <div className="text-sm font-num font-bold text-[#5A7FD6] flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 74% On Track
            </div>
          </div>
        </div>

        {/* WIDGET 6 (INSIDE): NET WORTH OVERVIEW */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF]/80 border border-[#2F5BC7]/25 mb-5 space-y-1.5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2F5BC7]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#5B6B84] font-sora uppercase text-[10px] tracking-wider">Total Net Worth Overview</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-num font-bold text-[10px] border border-emerald-400/30">
              +14.2% YoY Growth
            </span>
          </div>

          <div className="text-3xl font-num font-bold text-[#0F1F45] tracking-tight flex items-baseline gap-1">
            <span className="text-[#2F5BC7] text-xl font-normal">₹</span>1,84,50,000
          </div>

          <div className="text-[11px] text-[#5B6B84] flex items-center justify-between pt-1">
            <span>Goal Allocation: <strong className="text-[#5A7FD6] font-num">85% Disciplined</strong></span>
            <span className="text-emerald-400 font-num">+₹22.8L Capital Gains</span>
          </div>
        </div>

        {/* WIDGET 1 (INSIDE): RETIREMENT GOAL PROGRESS */}
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-[#F7F8FB]/60 border border-[#2F5BC7]/20 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#5A7FD6]" />
                <span className="font-semibold text-[#0F1F45]">Early Retirement FIRE (Age 48)</span>
              </div>
              <span className="text-xs font-bold text-[#5A7FD6] font-num">68%</span>
            </div>

            {/* Circular / Horizontal Progress Bar */}
            <div className="w-full h-2.5 bg-[#FFFFFF] rounded-full overflow-hidden border border-[#2F5BC7]/20">
              <div className="h-full bg-gradient-to-r from-[#5A7FD6] via-[#1A3170] to-[#1A3170] rounded-full w-[68%] shadow-[0_0_10px_#2F5BC7]" />
            </div>

            <div className="flex justify-between text-[10px] text-[#5B6B84] font-num">
              <span>Target: ₹10.0 Cr by 2045</span>
              <span className="text-emerald-400 font-semibold">₹6.8 Cr Accumulated</span>
            </div>
          </div>

          {/* WIDGET 3 (INSIDE): CHILD EDUCATION GOAL */}
          <div className="p-3.5 rounded-xl bg-[#F7F8FB]/40 border border-[#E4E8F0]/15 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-[#0F1F45]">Child Higher Education Fund</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-num">82%</span>
            </div>

            <div className="w-full h-2.5 bg-[#FFFFFF] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full w-[82%]" />
            </div>

            <div className="flex justify-between text-[10px] text-[#5B6B84] font-num">
              <span>University Fund</span>
              <span>₹41.0L / ₹50.0L Target</span>
            </div>
          </div>
        </div>

        {/* Dashboard Footer Badge */}
        <div className="mt-5 pt-3 border-t border-[#2F5BC7]/15 flex items-center justify-between text-[11px] text-[#5B6B84]">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#2F5BC7]" /> 100% Inflation Protected
          </span>
          <span className="text-[#5A7FD6] font-semibold font-sora">
            Next Milestone: 2028
          </span>
        </div>
      </motion.div>


      {/* ========================================== */}
      {/* 6 OVERLAPPING FLOATING LUXURY WIDGETS      */}
      {/* ========================================== */}

      {/* FLOATING WIDGET A: Retirement Goal Progress (Top Left) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="absolute -top-6 -left-2 sm:left-2 lg:left-[-35px] glass-card px-4 py-3 rounded-2xl flex items-center space-x-3.5 z-30 shadow-2xl border-l-4 border-l-[#5A7FD6]"
      >
        <div className="relative w-10 h-10 rounded-full bg-[#2F5BC7]/15 border-2 border-[#2F5BC7] flex items-center justify-center text-[#5A7FD6] font-num font-bold text-xs">
          68%
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Retirement Goal Progress</div>
          <div className="text-xs font-bold text-[#0F1F45] font-num">
            Target ₹10 Cr <span className="text-[10px] text-emerald-400 font-normal">by 2045</span>
          </div>
        </div>
      </motion.div>

      {/* FLOATING WIDGET B: Emergency Fund (Top Right) */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
        className="absolute top-2 -right-2 sm:right-2 lg:right-[-35px] glass-card px-4 py-3 rounded-2xl flex items-center space-x-3.5 z-30 shadow-2xl"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Emergency Shield Fund</div>
          <div className="text-xs font-bold text-emerald-400 font-num">
            ₹12,00,000 <span className="text-[9px] text-[#5B6B84] font-normal">• 6 Months Shielded</span>
          </div>
        </div>
      </motion.div>

      {/* FLOATING WIDGET C: Tax Planning Reminder (Middle Right) */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-1/2 -right-4 sm:right-0 lg:right-[-45px] -translate-y-1/2 glass-card px-4 py-3 rounded-2xl flex items-center space-x-3.5 z-30 shadow-2xl"
      >
        <div className="w-10 h-10 rounded-xl bg-[#2F5BC7]/20 border border-[#2F5BC7]/40 flex items-center justify-center text-[#5A7FD6]">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Tax Planning Reminder</div>
          <div className="text-xs font-bold text-[#5A7FD6] font-num">
            ₹48,500 Tax Saved <span className="text-[9px] text-[#5B6B84] font-normal">Sec 80C & 80D</span>
          </div>
        </div>
      </motion.div>

      {/* FLOATING WIDGET D: Monthly Savings Progress (Bottom Left) */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-16 -left-4 sm:left-4 lg:left-[-40px] glass-card px-4 py-3 rounded-2xl flex items-center space-x-3.5 z-30 shadow-2xl"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <PiggyBank className="w-5 h-5" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#E4E8F0] animate-ping" />
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Monthly Savings Progress</div>
          <div className="text-xs font-bold text-[#0F1F45] font-num">
            ₹50,000/mo <span className="text-[10px] text-[#5A7FD6]">SIP Compounding</span>
          </div>
        </div>
      </motion.div>

      {/* FLOATING WIDGET E: Goal Completion Percentage (Bottom Center/Right) */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -bottom-4 right-4 sm:right-10 lg:right-4 glass-card px-5 py-3 rounded-2xl flex items-center space-x-3.5 z-30 shadow-2xl border-t-2 border-t-[#5A7FD6]"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A7FD6] to-[#1A3170] text-white flex items-center justify-center font-bold">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Goal Completion Rate</div>
          <div className="text-xs font-bold text-[#0F1F45] font-num">
            74% Overall Plan Score <span className="text-[10px] text-emerald-400">On Track</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
