import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall, ShieldCheck } from 'lucide-react';
import heroArt from '../../assets/planning-hero.webp';

export default function PlanningHero({ onBookConsultation }) {
  const scrollToConsultation = () => {
    const el = document.getElementById('global-consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onBookConsultation) {
      onBookConsultation();
    }
  };

  return (
    <section className="relative pt-28 pb-14 sm:pt-32 sm:pb-20 bg-white overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 text-left space-y-6"
          >
            {/* Page Title */}
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2F5BC7]">Financial Planning</p>

            <h1 className="text-[34px] sm:text-[42px] lg:text-[50px] font-serif-luxury font-bold text-[#0F1F45] leading-[1.12] tracking-tight [text-wrap:balance]">
              You’re doing fine.
              <span className="block gold-gradient-text">You just can’t see the whole picture.</span>
            </h1>

            {/* Short 2-line Description */}
            <p className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl font-sans">
              Salary, savings, loans, insurance, taxes and goals sit in six different places. We bring them together into one plan, so you can finally see where you stand and what happens next.
            </p>

            {/* Key Bullets */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F45]">
                <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                <span>See where every rupee goes</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F45]">
                <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                <span>SIPs linked to your goals</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F45]">
                <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                <span>Old vs new tax regime, sorted</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0F1F45]">
                <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                <span>The right cover for your family</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={scrollToConsultation}
                className="btn-gold px-7 py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2F5BC7]/20 hover:shadow-xl transition-all cursor-pointer"
              >
                <span>Get My Plan</span>
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
              Goal-based planning • Plain-language advice • Yearly reviews
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
              alt="Person planning their finances on a laptop, surrounded by goals: home, education, retirement, insurance and savings"
              className="w-full max-w-[460px] sm:max-w-[520px] lg:max-w-[560px] h-auto select-none pointer-events-none"
              draggable="false"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
