import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  Target, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function CalculatorsPreview({ onOpenSearch }) {
  const calculators = [
    {
      title: 'SIP & Compounding Calculator',
      description: 'Estimate how monthly disciplined investments grow over 5, 10, 15, or 25 years with step-up compounding.',
      icon: TrendingUp,
      previewWidget: 'sip',
      tag: 'Interactive Tool',
    },
    {
      title: 'EMI & Loan Repayment Calculator',
      description: 'Plan monthly home, auto, or personal loan repayments before borrowing to ensure your cashflow stays healthy.',
      icon: PieChart,
      previewWidget: 'emi',
      tag: 'Borrowing Health',
    },
    {
      title: 'FIRE Retirement Calculator',
      description: 'Understand how much corpus you need to retire comfortably by age 45-55 with 100% inflation protection.',
      icon: Target,
      previewWidget: 'retirement',
      tag: 'FIRE Simulation',
    },
    {
      title: 'Tax Saving & Regime Calculator',
      description: 'Compare Old vs New Tax Regime for FY 2025-26 and estimate legal savings under Section 80C, 80D & NPS.',
      icon: Calculator,
      previewWidget: 'tax',
      tag: 'Section 80C / 80D',
    },
  ];

  return (
    <section className="relative z-10 py-24 bg-gradient-to-b from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border-t border-[#2F5BC7]/15 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-[#2F5BC7]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#5A7FD6] border border-[#2F5BC7]/35 shadow-[0_0_15px_rgba(26,49,112,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6]" />
            <span className="font-sora tracking-wide uppercase text-[11px]">PLANNING TOOLS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight"
          >
            Financial Calculators That Help You{' '}
            <span className="gold-gradient-text italic font-serif-luxury">Plan Smarter</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5B6B84] font-inter leading-relaxed"
          >
            Simple interactive tools designed to answer your biggest money questions with mathematical precision.
          </motion.p>
        </div>

        {/* 2x2 Desktop Layout / Swipeable Cards on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {calculators.map((calc, idx) => {
            const IconComp = calc.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                onClick={onOpenSearch}
                className="group relative rounded-[28px] p-7 sm:p-8 bg-[#F7F8FB]/70 hover:bg-[#F7F8FB]/95 border border-[#2F5BC7]/25 hover:border-[#2F5BC7]/60 backdrop-blur-2xl transition-all duration-500 shadow-[0_15px_40px_rgba(2,11,45,0.8)] hover:shadow-[0_20px_50px_rgba(26,49,112,0.25)] cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Top Header: Gold Icon + Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5A7FD6]/25 via-[#2F5BC7]/15 to-[#F7F8FB] border border-[#2F5BC7]/40 flex items-center justify-center text-[#5A7FD6] shadow-[0_0_15px_rgba(26,49,112,0.3)] group-hover:rotate-6 transition-all duration-300">
                      <IconComp className="w-7 h-7" />
                    </div>

                    <span className="px-3 py-1 rounded-full text-[11px] font-bold font-sora tracking-wide bg-[#2F5BC7]/15 text-[#5A7FD6] border border-[#2F5BC7]/30">
                      {calc.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors duration-300 mb-3">
                    {calc.title}
                  </h3>

                  <p className="text-sm text-[#5B6B84] font-inter leading-relaxed mb-6">
                    {calc.description}
                  </p>

                  {/* Preview Visual Graph / Widget */}
                  <div className="p-4 rounded-2xl bg-[#FFFFFF]/80 border border-[#2F5BC7]/20 mb-6 space-y-2">
                    {calc.previewWidget === 'sip' && (
                      <div className="space-y-1.5 font-num">
                        <div className="flex justify-between text-xs text-[#5B6B84]">
                          <span>SIP: ₹25,000/mo @ 14% p.a.</span>
                          <span className="text-[#5A7FD6] font-bold">15 Yrs = ₹1.68 Cr</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#F7F8FB] overflow-hidden flex">
                          <div className="h-full bg-blue-400 w-[30%]" title="Invested 30%" />
                          <div className="h-full bg-gradient-to-r from-[#5A7FD6] to-[#1A3170] w-[70%]" title="Wealth Gain 70%" />
                        </div>
                      </div>
                    )}
                    {calc.previewWidget === 'emi' && (
                      <div className="space-y-1.5 font-num">
                        <div className="flex justify-between text-xs text-[#5B6B84]">
                          <span>Home Loan EMI @ 8.5%</span>
                          <span className="text-[#5A7FD6] font-bold">₹43,391/mo for ₹50L</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#F7F8FB] overflow-hidden flex">
                          <div className="h-full bg-emerald-400 w-[46%]" />
                          <div className="h-full bg-[#1A3170] w-[54%]" />
                        </div>
                      </div>
                    )}
                    {calc.previewWidget === 'retirement' && (
                      <div className="space-y-1.5 font-num">
                        <div className="flex justify-between text-xs text-[#5B6B84]">
                          <span>FIRE Target Corpus</span>
                          <span className="text-[#5A7FD6] font-bold">₹10.0 Cr Target</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#F7F8FB] overflow-hidden border border-[#2F5BC7]/30">
                          <div className="h-full bg-gradient-to-r from-[#5A7FD6] to-[#1A3170] w-[68%]" />
                        </div>
                      </div>
                    )}
                    {calc.previewWidget === 'tax' && (
                      <div className="space-y-1.5 font-num">
                        <div className="flex justify-between text-xs text-[#5B6B84]">
                          <span>Sec 80C + 80D Savings</span>
                          <span className="text-emerald-400 font-bold">₹48,500 Tax Saved</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#F7F8FB] overflow-hidden flex">
                          <div className="h-full bg-emerald-400 w-[85%]" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Open Calculator Link */}
                <div className="pt-4 border-t border-[#2F5BC7]/15 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5A7FD6] group-hover:text-[#2F5BC7] transition-colors">
                    Open Calculator →
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#2F5BC7]/15 border border-[#2F5BC7]/30 flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] group-hover:translate-x-1.5 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
