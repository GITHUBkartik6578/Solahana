import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Calendar, ArrowRight } from 'lucide-react';

export const CalculatorsCTA = () => {
  const scrollToGrid = (e) => {
    e.preventDefault();
    const elem = document.getElementById('calculator-categories');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-20 bg-gradient-to-b from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/30 shadow-2xl text-center"
        >
          {/* Concentric gold radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2F5BC7]/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2F5BC7]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Gold subtle border ring */}
          <div className="absolute inset-0 rounded-3xl border border-[#E4E8F0] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/15 border border-[#2F5BC7]/30 mb-6"
            >
              <Calculator className="w-4 h-4 text-[#5A7FD6]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
                TAKE THE FIRST STEP
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold text-[#0F1F45] mb-6 leading-tight"
            >
              Start Planning With Numbers That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
                Make Sense.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#334155] text-lg md:text-xl font-light mb-10 leading-relaxed"
            >
              Use SOLAHANA’s calculators to make confident, mathematical financial decisions before committing your wealth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#calculator-categories"
                onClick={scrollToGrid}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1A3170] via-[#1A3170] to-[#1A3170] text-white font-semibold text-base shadow-lg shadow-[#2F5BC7]/25 hover:shadow-xl hover:shadow-[#2F5BC7]/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                <span>Explore All Calculators</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] hover:border-[#2F5BC7]/50 text-[#0F1F45] font-semibold text-base hover:bg-[#EEF2FB] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Calendar className="w-5 h-5 text-[#5A7FD6]" />
                <span>Book Consultation</span>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
