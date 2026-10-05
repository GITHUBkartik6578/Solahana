import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall, ShieldCheck } from 'lucide-react';
import heroArt from '../../assets/slides/retirement.webp';

export default function RetirementHero({ onStartPlanning, onRequestCallback }) {
  const scrollToCalculator = () => {
    const el = document.getElementById('retirement-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onStartPlanning) {
      onStartPlanning();
    }
  };

  const scrollToConsultation = () => {
    const el = document.getElementById('global-consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onRequestCallback) {
      onRequestCallback();
    }
  };

  return (
    <section className="relative pt-28 pb-14 sm:pt-32 sm:pb-20 bg-white overflow-hidden">

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-left space-y-6"
          >
            {/* Page Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight tracking-tight">
              Retirement Planning
            </h1>

            {/* Short 2-line Description */}
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl font-sans">
              Formulate a personalized retirement strategy with inflation protection, systematic withdrawal plans (SWP), and tax-optimized wealth longevity.
            </p>

            {/* Key Highlights Bullets */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F45]">
                <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                <span>Inflation-Adjusted Corpus</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F45]">
                <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                <span>Tax-Efficient Monthly Cashflows</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F45]">
                <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                <span>NPS &amp; Pension Optimization</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F45]">
                <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                <span>Legacy &amp; Estate Protection</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={scrollToCalculator}
                className="btn-gold px-7 py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2F5BC7]/20 hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Start Retirement Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToConsultation}
                className="px-6 py-3.5 rounded-full border border-[#2F5BC7]/50 hover:border-[#2F5BC7] text-[#0F1F45] hover:bg-[#F7F8FB] font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 text-[#2F5BC7]" />
                <span>Request a Callback</span>
              </button>
            </div>

            {/* Fiduciary Assurance Note */}
            <p className="text-xs text-[#64748B] flex items-center gap-1.5 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Zero-commission fiduciary planning • Customized for Indian senior professionals &amp; families
            </p>
          </motion.div>

          {/* Right Column: Premium Vector Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <img
              src={heroArt}
              alt="Man relaxing in an armchair, daydreaming of travel, cruises and time with family in retirement"
              className="w-full max-w-[480px] sm:max-w-[560px] lg:max-w-[600px] h-auto select-none pointer-events-none"
              draggable="false"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
