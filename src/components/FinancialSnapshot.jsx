import React from 'react';
import { motion } from 'framer-motion';
import { 
  PiggyBank, 
  Target, 
  ShieldCheck, 
  PieChart, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Award
} from 'lucide-react';

export default function FinancialSnapshot() {
  return (
    <section className="relative z-10 py-8 sm:py-10 lg:py-12 bg-[#EEF2FB] border-t border-[#2F5BC7]/20 overflow-hidden">
      
      {/* Background Radial Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#2F5BC7]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-5 sm:mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#1A3170] border border-[#2F5BC7]/35 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span className="font-sora tracking-wide uppercase text-[11px]">FINANCIAL PLAN SNAPSHOT</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight"
          >
            Your Financial Snapshot{' '}
            <span className="gold-gradient-text italic font-serif-luxury">at a Glance</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed line-clamp-2"
          >
            A unified view of your savings progress, retirement target, emergency shield, and net worth allocation.
          </motion.p>
        </div>

        {/* MASTER DASHBOARD CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-6 sm:p-10 bg-white border border-[#2F5BC7]/30 backdrop-blur-2xl shadow-xl space-y-8"
        >
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#2F5BC7]/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1A3170] to-[#1A3170] text-white flex items-center justify-center font-bold shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45]">
                  Fiduciary Financial Health Monitor
                </h3>
                <p className="text-xs text-[#64748B] font-inter">
                  Real-time status of your goal-linked portfolios & protection shields
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-[#1A3170] font-sora bg-[#F7F8FB] px-3.5 py-1.5 rounded-full border border-[#2F5BC7]/30">
              <Lock className="w-3.5 h-3.5 text-[#2F5BC7]" />
              <span>100% Confidential Fiduciary Vault</span>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Emergency Shield */}
            <div className="p-5 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Liquid Reserves</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">₹18,50,000</div>
              <div className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> 8.5 Months Shield Active
              </div>
            </div>

            {/* Card 2: Goal Wealth SIP */}
            <div className="p-5 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Monthly Auto-SIP</span>
                <PiggyBank className="w-4 h-4 text-[#2F5BC7]" />
              </div>
              <div className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">₹75,000/mo</div>
              <div className="text-xs text-[#1A3170] font-medium">
                Linked to 4 Life Goals
              </div>
            </div>

            {/* Card 3: FIRE Retirement Target */}
            <div className="p-5 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>FIRE Age 48 Target</span>
                <Target className="w-4 h-4 text-[#2F5BC7]" />
              </div>
              <div className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">₹6.50 Crore</div>
              <div className="text-xs text-blue-700 font-medium">
                42% Milestone Achieved
              </div>
            </div>

            {/* Card 4: Tax Harvest Efficiency */}
            <div className="p-5 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Tax Saved FY26</span>
                <PieChart className="w-4 h-4 text-[#2F5BC7]" />
              </div>
              <div className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">₹1,46,800</div>
              <div className="text-xs text-emerald-700 font-medium">
                Sec 80C, 80D & LTCG
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
