import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, ShieldCheck, Lock } from 'lucide-react';

export default function FinalCTA({ onOpenSearch }) {
  return (
    <section className="relative z-10 py-12 sm:py-20 lg:py-28 bg-[#F7F8FB] border-t border-[#2F5BC7]/20 overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-[#2F5BC7]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[30px] sm:rounded-[40px] p-5 sm:p-16 bg-white border-2 border-[#2F5BC7]/30 backdrop-blur-2xl text-center space-y-5 sm:space-y-6 shadow-xl relative overflow-hidden"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#1A3170] border border-[#2F5BC7]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F] animate-pulse" />
            <span className="font-sora tracking-wide uppercase text-[10px]">START YOUR ROADMAP</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight">
            Let's Build Your Financial Future — Together.
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#475569] font-inter max-w-2xl mx-auto leading-relaxed">
            Whether your goal is buying a home, planning retirement, saving taxes or building wealth, SOLAHANA helps you take the next step with complete confidence.
          </p>

          {/* Dual Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="gold-glow-button px-9 py-4 rounded-full text-sm font-bold text-white tracking-wide flex items-center justify-center space-x-3 shadow-md group w-full sm:w-auto"
            >
              <span>Start Your Comprehensive Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/contact"
              className="px-7 py-4 rounded-full text-sm font-semibold text-[#0F1F45] hover:text-[#2F5BC7] bg-[#F7F8FB] hover:bg-white border border-[#2F5BC7]/30 hover:border-[#2F5BC7] backdrop-blur-xl transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 text-[#2F5BC7]" />
              <span>Book Consultation</span>
            </Link>
          </div>

          {/* Security Subtext */}
          <div className="pt-6 border-t border-[#2F5BC7]/15 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> SEBI-Registered Fiduciary
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#2F5BC7]" /> Bank-Grade 256-Bit SSL
            </span>
            <span>•</span>
            <span>Zero Sales Pressure</span>
          </div>

        </motion.div>
      </div>

    </section>
  );
}
