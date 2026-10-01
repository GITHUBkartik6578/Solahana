import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  UserCheck, 
  Calculator, 
  Award, 
  RefreshCcw, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Compass
} from 'lucide-react';

export default function WhyChooseSolahana() {
  const features = [
    {
      title: 'Goal-Based Planning',
      desc: 'Align every rupee directly with concrete life targets such as early retirement, education, and home ownership.',
      icon: Target,
    },
    {
      title: 'Personalized Financial Strategy',
      desc: 'Custom wealth blueprint matched to your specific salary, liabilities, cashflow, and risk capacity.',
      icon: UserCheck,
    },
    {
      title: 'Tax Efficient Planning',
      desc: 'Proactive optimization across Section 80C, Section 80D, NPS, and automated capital gains harvesting.',
      icon: Calculator,
    },
    {
      title: 'Dedicated Financial Experts',
      desc: 'SEBI registered wealth advisors providing zero-commission, transparent, and unbiased fiduciary guidance.',
      icon: Award,
    },
    {
      title: 'Regular Portfolio Review',
      desc: 'Annual rebalancing, risk monitoring, and strategy updates as your income increases or priorities evolve.',
      icon: RefreshCcw,
    },
  ];

  return (
    <section className="relative z-10 py-24 bg-[#FFFFFF] border-t border-[#E4E8F0] overflow-hidden text-left">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/10 text-xs font-semibold text-[#2F5BC7] border border-[#E4E8F0]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span className="font-sora tracking-wide uppercase text-[11px] font-bold">THE SOLAHANA ADVANTAGE</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight"
          >
            Why Families Trust SOLAHANA for{' '}
            <span className="text-[#2F5BC7] font-serif-luxury">Financial Planning</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed"
          >
            A thoughtful, unbiased approach to long-term wealth building, protection, and peace of mind.
          </motion.p>
        </div>


        {/* SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* ========================================== */}
          {/* LEFT SIDE: FIDUCIARY EXCELLENCE CARD */}
          {/* ========================================== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            <div className="rounded-3xl p-7 bg-white border border-[#E4E8F0] shadow-xl text-left space-y-6">
              
              {/* Top Card Header */}
              <div className="pb-4 border-b border-[#E4E8F0] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A3170] text-white flex items-center justify-center font-bold shadow-md">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-serif-luxury font-bold text-[#0F1F45]">Fiduciary Excellence</div>
                    <div className="text-[10px] text-[#475569]">SEBI Registered Planning • Zero Conflict</div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-num font-bold text-[10px] border border-emerald-200">
                  100% Unbiased
                </span>
              </div>

              {/* Central Graphic Feature List */}
              <div className="space-y-4 font-inter text-xs text-[#475569]">
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E4E8F0] flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F1F45] block">Goal Alignment over Stock Tickers</strong>
                    Focusing on your retirement age, education funds, and family security rather than speculative market noise.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E4E8F0] flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F1F45] block">Institutional Discipline</strong>
                    Structuring your assets across direct mutual funds, bonds, PMS, and emergency reserves with bank-grade safety.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E4E8F0] flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#0F1F45] block">Proactive Tax Harvesting</strong>
                    Preventing tax leakage so every saved rupee compounds toward your early retirement.
                  </div>
                </div>
              </div>

              {/* Trust Badge Bar */}
              <div className="pt-4 border-t border-[#E4E8F0] flex items-center justify-between text-xs text-[#475569] font-sora">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> SEBI-Registered Fiduciary
                </span>
                <span className="text-[#2F5BC7] font-bold">50,000+ Families</span>
              </div>

            </div>
          </motion.div>

          {/* ========================================== */}
          {/* RIGHT SIDE: FIVE FEATURE CARDS */}
          {/* ========================================== */}
          <div className="lg:col-span-7 space-y-4">
            {features.map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ x: 6 }}
                  className="group p-5 rounded-2xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-md transition-all duration-300 flex items-start space-x-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#E4E8F0] text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#475569] font-inter mt-1 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
