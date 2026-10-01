import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Target } from 'lucide-react';

export default function GoalsCTA({ onStartPlanning, onBookConsultation }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-[#FFFFFF] border-t border-[#2F5BC7]/20">
      
      {/* Premium Gold Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-gradient-to-r from-[#2F5BC7]/20 via-[#5A7FD6]/15 to-transparent blur-[150px] pointer-events-none rounded-full" />

      {/* Floating Particle Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-10 left-1/3 w-2 h-2 rounded-full bg-[#5A7FD6] animate-ping" />
        <div className="absolute bottom-12 right-1/3 w-2 h-2 rounded-full bg-[#1A3170] animate-ping" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-10 sm:p-14 lg:p-16 rounded-3xl bg-gradient-to-b from-[#F7F8FB]/95 via-[#F7F8FB]/75 to-[#F7F8FB]/95 border border-[#2F5BC7]/40 shadow-[0_25px_60px_rgba(2,11,45,0.9)] backdrop-blur-2xl space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#2F5BC7]/40 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora shadow-[0_0_20px_rgba(26,49,112,0.3)]">
            <Target className="w-3.5 h-3.5 text-[#2F5BC7]" />
            <span>BUILD YOUR GOAL ROADMAP</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-[#0F1F45] leading-tight tracking-tight">
            Your Goals Deserve More Than <br />
            <span className="text-gradient-gold">A Savings Account.</span>
          </h2>

          {/* Description */}
          <p className="text-base sm:text-xl text-[#5B6B84] font-inter max-w-2xl mx-auto leading-relaxed">
            Start creating a financial roadmap built around the future you want. From home purchases to retirement, SOLAHANA ensures every rupee has a purpose.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartPlanning}
              className="w-full sm:w-auto gold-glow-button px-9 py-4 rounded-full text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center space-x-2.5 group"
            >
              <span>Start Planning Today</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onBookConsultation}
              className="w-full sm:w-auto px-9 py-4 rounded-full text-xs sm:text-sm font-semibold text-[#0F1F45] hover:text-[#5A7FD6] bg-[#FFFFFF]/80 hover:bg-[#F7F8FB] border border-[#2F5BC7]/40 hover:border-[#2F5BC7]/70 transition-all flex items-center justify-center space-x-2"
            >
              <span>Book Consultation</span>
            </button>
          </div>

          {/* Footnote Trust Badge */}
          <div className="pt-8 border-t border-[#2F5BC7]/15 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5B6B84] font-inter">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
              <span>100% Goal-Aligned Fiduciary Planning</span>
            </div>
            <span className="hidden sm:inline text-[#2F5BC7]/40">•</span>
            <div>
              <span>SEBI-Registered Planning Standard</span>
            </div>
            <span className="hidden sm:inline text-[#2F5BC7]/40">•</span>
            <div>
              <span>Zero Product Commissions</span>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
