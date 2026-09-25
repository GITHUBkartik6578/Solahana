import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import TaxPlanningIllustration from '../illustrations/TaxPlanningIllustration';
import SaveTaxesIllustration from '../illustrations/SaveTaxesIllustration';

export default function TaxBenefits({ onStartTaxPlanning }) {
  const scrollToCalculator = () => {
    const el = document.getElementById('tax-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onStartTaxPlanning) {
      onStartTaxPlanning();
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            TAX SAVING BENEFITS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Maximize Wealth &amp; Eliminate Tax Leakage
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Discover how structured tax planning optimizes your portfolio for maximum net returns every financial year.
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
            <TaxPlanningIllustration />
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
              <span>Yearly Tax Efficiency</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
              Save More Every Year &amp; Optimize Investments
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Without structured tax planning, high earners lose up to 30% of their investment gains to unoptimized taxes. SOLAHANA aligns your investments with tax laws so every saved rupee compounds in your portfolio.
            </p>

            <ul className="space-y-3">
              {[
                'Optimal Old vs New Tax Regime evaluation for lowest total tax outlay',
                'Leverage ₹1.5L Sec 80C, ₹75k Sec 80D, and ₹50k NPS Sec 80CCD (1B)',
                'Tax-loss harvesting to offset profitable capital gains legally',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#0F1F45] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div>
              <button
                onClick={scrollToCalculator}
                className="btn-gold px-6 py-3 rounded-full font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Calculate Tax Savings</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F5BC7]" />
              <span>Peace of Mind</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
              Protect Long-Term Wealth &amp; Plan Without Stress
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Avoid last-minute March 31 rush decisions into low-yielding insurance schemes. SOLAHANA provides proactive year-round tax roadmap updates and seamless advance tax planning.
            </p>

            <ul className="space-y-3">
              {[
                'Prevent hasty tax-saving purchases that lock capital in low-return assets',
                'Multi-asset Systematic Withdrawal Plans (SWP) with minimal slab impact',
                'HUF and family tax bracket optimization for multi-generational wealth',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#0F1F45] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div>
              <button
                onClick={scrollToCalculator}
                className="btn-gold px-6 py-3 rounded-full font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Start Tax Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 lg:order-2 order-1 flex justify-center"
          >
            <div className="w-full max-w-[480px] p-6 rounded-3xl bg-white border border-[#E4E8F0] shadow-xl">
              <SaveTaxesIllustration />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
