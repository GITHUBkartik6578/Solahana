import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import RetirementIllustration from '../illustrations/RetirementIllustration';
import RetirementCoupleIllustration from '../illustrations/RetirementCoupleIllustration';

export default function RetirementBenefits() {
  return (
    <section className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            THE SOLAHANA ADVANTAGE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Comprehensive Retirement Benefits
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Discover why senior professionals, business owners, and families rely on SOLAHANA for lifelong financial peace of mind.
          </p>
        </div>

        {/* Row 1: Left Illustration + Right Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex justify-center"
          >
            <RetirementIllustration />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E8F0] text-xs font-semibold text-[#2F5BC7] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
              <span>Lifestyle Continuity</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
              Maintain Your Lifestyle &amp; Beat Inflation Effortlessly
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Retirement isn’t about stopping life—it’s about pursuing your passions without monetary stress. SOLAHANA calculates your inflation-adjusted cost of living so your purchasing power remains intact throughout retirement.
            </p>

            <ul className="space-y-3">
              {[
                'Calculates medical and lifestyle inflation (6-7% p.a. adjusted)',
                'Builds passive income streams matching your current standard of living',
                'Multi-asset compounding to keep your capital growing above inflation',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#0F1F45] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Row 2: Left Text + Right Illustration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 lg:order-1 order-2 text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E8F0] text-xs font-semibold text-[#2F5BC7] shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-[#2F5BC7]" />
              <span>Tax-Efficient Drawdowns</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
              Systematic Withdrawal Plans (SWP) with Zero Capital Exhaustion
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Traditional fixed deposits subject your entire interest to full slab taxes. SOLAHANA structures Systematic Withdrawal Plans (SWP) in equity and hybrid funds, ensuring only capital gains are taxed at favorable rates while preserving principal.
            </p>

            <ul className="space-y-3">
              {[
                'Tax-optimized monthly cashflow routing for lowest slab impact',
                'Dynamic asset rebalancing to protect principal in bear markets',
                'Seamless wealth transfer and estate planning integration',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#0F1F45] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 lg:order-2 order-1 flex justify-center"
          >
            <div className="w-full max-w-[480px] p-6 rounded-3xl bg-white border border-[#E4E8F0] shadow-xl">
              <RetirementCoupleIllustration />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
