import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calculator } from 'lucide-react';

export default function CalculatorsCTA({ onOpenSearch }) {
  return (
    <section className="relative z-10 py-20 bg-gradient-to-b from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border-t border-[#2F5BC7]/15 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[250px] bg-[#2F5BC7]/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#5A7FD6] border border-[#2F5BC7]/35 shadow-[0_0_15px_rgba(26,49,112,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6]" />
          <span className="font-sora tracking-wide uppercase text-[10px]">INTERACTIVE PLANNING TOOLS</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight"
        >
          See Where Your Money{' '}
          <span className="gold-gradient-text italic font-serif-luxury">Can Take You</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-[#5B6B84] font-inter max-w-xl mx-auto leading-relaxed"
        >
          Use SOLAHANA's planning tools to understand your next financial milestone and model your target wealth timeline.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-4 flex justify-center"
        >
          <button
            onClick={onOpenSearch}
            className="gold-glow-button group w-full sm:w-auto"
          >
            <Calculator className="w-4 h-4" />
            <span>Explore All Calculators</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>

    </section>
  );
}
