import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import InsuranceProtectionIllustration from '../illustrations/InsuranceProtectionIllustration';
import ProtectFamilyIllustration from '../illustrations/ProtectFamilyIllustration';

export default function RiskBenefits({ onStartRiskPlanning }) {
  const scrollToCalculator = () => {
    const el = document.getElementById('risk-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (onStartRiskPlanning) {
      onStartRiskPlanning();
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            PROTECTION BENEFITS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Complete Peace of Mind for Your Loved Ones
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            A structured risk management blueprint guarantees that unforeseen medical or financial shocks never compromise your family’s future.
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
            <InsuranceProtectionIllustration />
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
              <span>Family Security</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
              Protect Your Family's Future &amp; Secure Your Income
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Human Life Value (HLV) modeling ensures your family receives adequate financial replacement so home loans, living standards, and child education goals stay 100% fulfilled.
            </p>

            <ul className="space-y-3">
              {[
                'Pure term cover calculated at 10x–15x annual income plus liabilities',
                'Accidental disability riders to protect earning capacity against injury',
                'Zero endowment drag so every premium rupee buys maximum risk cover',
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
                <span>Calculate Required Cover</span>
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
              <span>Medical Shield</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
              Plan for Medical Emergencies &amp; Build Confidence
            </h3>

            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Medical inflation in India runs at 14% p.a. A sudden hospitalization shouldn't drain your long-term mutual funds or retirement corpus.
            </p>

            <ul className="space-y-3">
              {[
                'High-deductible super top-up policies offering ₹1 Crore health cover at low premiums',
                'Critical illness riders providing instant cash payouts upon diagnosis',
                '6-month liquid emergency reserves isolated from market volatility',
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
                <span>Start Risk Planning</span>
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
              <ProtectFamilyIllustration />
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
