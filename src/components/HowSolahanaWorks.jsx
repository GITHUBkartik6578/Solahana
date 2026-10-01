import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  Layers, 
  Target, 
  RefreshCcw, 
} from 'lucide-react';

export default function HowSolahanaWorks() {
  const steps = [
    {
      num: '01',
      title: 'UNDERSTAND',
      subtitle: 'Comprehensive Financial Audit',
      desc: 'We begin by understanding your financial situation, monthly cashflow, existing investments, insurance coverage, and immediate and long-term life goals.',
      icon: Search,
      tags: ['Income & Expenses', 'Risk Capacity', 'Life Goals Audit'],
    },
    {
      num: '02',
      title: 'ORGANIZE',
      subtitle: 'Structuring Your Wealth',
      desc: 'We organize your income, savings, liabilities, emergency reserves, and financial priorities into a clean, disciplined structure.',
      icon: Layers,
      tags: ['Liquidity Allocation', 'Debt Optimization', 'Emergency Fund'],
    },
    {
      num: '03',
      title: 'PLAN',
      subtitle: 'Goal-Aligned Blueprint',
      desc: 'We create a thoughtful financial strategy around retirement, wealth creation, tax optimization, children’s education, and family risk protection.',
      icon: Target,
      tags: ['Retirement FIRE', 'Tax Optimization', 'Multi-Asset PMS/SIP'],
    },
    {
      num: '04',
      title: 'REVIEW',
      subtitle: 'Evolving With Your Life',
      desc: 'Your financial plan grows with your life through regular periodic reviews, rebalancing alerts, and strategy adjustments as your income grows.',
      icon: RefreshCcw,
      tags: ['Annual Rebalance', 'Tax Loss Harvesting', 'Milestone Check'],
    },
  ];

  return (
    <section className="relative z-10 py-12 sm:py-20 lg:py-24 bg-[#EEF2FB] border-t border-[#2F5BC7]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#1A3170] border border-[#2F5BC7]/35 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F] animate-pulse" />
            <span className="font-sora tracking-wide uppercase text-[11px]">OUR PLANNING PROCESS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-[1.2]"
          >
            A Simple 4-Step Start To{' '}
            <span className="gold-gradient-text italic font-serif-luxury">
              Financial Clarity
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed"
          >
            How SOLAHANA turns complex financial decisions into a structured, goal-aligned roadmap.
          </motion.p>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group p-6 rounded-3xl bg-white border border-[#2F5BC7]/20 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-serif-luxury font-bold text-[#2F5BC7]/40 group-hover:text-[#2F5BC7]">
                      {step.num}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-sora font-bold text-[#1A3170] uppercase tracking-widest">
                      {step.title}
                    </span>
                    <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] mt-0.5">
                      {step.subtitle}
                    </h3>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed font-inter">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#2F5BC7]/15 flex flex-wrap gap-1.5">
                  {step.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-0.5 rounded bg-[#F7F8FB] text-[10px] text-[#64748B] font-sora">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
