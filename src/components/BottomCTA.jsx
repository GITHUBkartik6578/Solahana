import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Calendar, ShieldCheck, Lock } from 'lucide-react';

export default function BottomCTA({ onOpenSearch }) {
  return (
    <section className="relative z-10 py-24 bg-[#FFFFFF] border-t border-[#2F5BC7]/20 overflow-hidden">
      
      {/* Central Golden Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#2F5BC7]/12 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[36px] p-8 sm:p-14 bg-gradient-to-r from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border-2 border-[#2F5BC7]/40 backdrop-blur-2xl text-center space-y-6 shadow-[0_30px_90px_rgba(2,11,45,0.95),0_0_40px_rgba(26,49,112,0.3)] relative overflow-hidden"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#5A7FD6] border border-[#2F5BC7]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6] animate-pulse" />
            <span className="font-sora tracking-wide uppercase text-[10px]">TAKE THE FIRST STEP</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight">
            Start Planning Your Financial Future Today.
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#5B6B84] font-inter max-w-xl mx-auto leading-relaxed">
            A thoughtful financial strategy built around your life goals. Talk to a SEBI registered wealth advisor and organize your wealth with complete peace of mind.
          </p>

          {/* Golden Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="gold-glow-button group w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your First Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={onOpenSearch}
              className="px-7 py-4 rounded-full text-sm font-semibold text-[#0F1F45] hover:text-[#5A7FD6] bg-[#FFFFFF]/80 hover:bg-[#FFFFFF] border border-[#2F5BC7]/30 hover:border-[#2F5BC7]/60 backdrop-blur-xl transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <span>Explore Goal Calculators</span>
            </button>
          </div>

          {/* Security Subtext */}
          <div className="pt-6 border-t border-[#2F5BC7]/15 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5B6B84]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> SEBI-Registered Fiduciary
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#5A7FD6]" /> 256-Bit SSL Encryption
            </span>
            <span>•</span>
            <span>Zero Sales Pressure</span>
          </div>

        </motion.div>
      </div>

    </section>
  );
}
