import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import EstatePlanningIllustration from '../illustrations/EstatePlanningIllustration';
import FamilyFinancialPlanningIllustration from '../illustrations/FamilyFinancialPlanningIllustration';

export default function EstateBenefits({ onStartEstatePlanning }) {
  const scrollToConsultation = () => {
    const el = document.getElementById('global-consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onStartEstatePlanning) {
      onStartEstatePlanning();
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            ESTATE BENEFITS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Enduring Legacy &amp; Total Peace of Mind
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Discover how structured succession planning preserves your life's earnings for future generations.
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
            <EstatePlanningIllustration />
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
              <span>Wealth Protection</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
              Preserve Family Wealth &amp; Protect Loved Ones
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Without a clear estate framework, family assets can become trapped in prolonged probate litigation. SOLAHANA structures legally sound Wills and Trusts so your family receives their rightful inheritance smoothly.
            </p>

            <ul className="space-y-3">
              {[
                '100% legally compliant Will execution registered under Indian Law',
                'Private Family Trusts to shield assets from commercial or personal liabilities',
                'Designated guardian and minor child financial protection provisions',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#0F1F45] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div>
              <button
                onClick={scrollToConsultation}
                className="btn-gold px-6 py-3 rounded-full font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Start Estate Planning</span>
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
              <span>Multi-Generational Legacy</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
              Transfer Assets Smoothly &amp; Build a Lasting Legacy
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Define clear asset allocation guidelines across real estate, mutual funds, demat portfolios, and business equity so your family vision endures across generations.
            </p>

            <ul className="space-y-3">
              {[
                'Seamless transfer of demat accounts, properties, and bank deposits to nominees',
                'Business succession planning to ensure operational continuity for family enterprises',
                'Philanthropic trust setup for charitable giving and community impact',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#0F1F45] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div>
              <button
                onClick={scrollToConsultation}
                className="btn-gold px-6 py-3 rounded-full font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Request Estate Consultation</span>
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
              <FamilyFinancialPlanningIllustration />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
