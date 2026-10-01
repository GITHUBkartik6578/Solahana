import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TaxCTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#FFFFFF] border-t border-[#E4E8F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-10 sm:p-14 lg:p-16 rounded-3xl bg-white border border-[#E4E8F0] shadow-xl space-y-8"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5" />
            <span>START OPTIMIZING TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
            Stop Overpaying Taxes. Build Lasting Wealth.
          </h2>

          <p className="text-base sm:text-lg text-[#475569] font-inter max-w-2xl mx-auto leading-relaxed">
            Schedule a 1-on-1 confidential tax strategy call with a SEBI Registered SOLAHANA Wealth Advisor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="gold-glow-button group w-full sm:w-auto"
            >
              <span>Schedule Tax Planning Call</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[#2F5BC7]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Confidential • Zero Commission • SEBI Registered Fiduciary</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
