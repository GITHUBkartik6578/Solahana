import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Sparkles } from 'lucide-react';

export default function AboutMissionVision() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-[#F7F8FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full gold-badge text-[#1A3170] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>PURPOSE & FUTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Our Mission & Vision
          </h2>
          <p className="text-sm sm:text-base text-[#475569] font-inter">
            What we do every day, and where we're headed.
          </p>
        </div>

        {/* Two Luxury Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 — MISSION */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-[#2F5BC7]/30 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] transition-all duration-300 shadow-lg text-left group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] flex items-center justify-center">
                <Target className="w-7 h-7" />
              </div>

              <span className="text-xs font-sora font-bold text-[#1A3170] uppercase tracking-widest px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30">
                OUR MISSION
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] mb-3 group-hover:text-[#2F5BC7] transition-colors">
              Clarity for Every Family
            </h3>

            <p className="text-base sm:text-lg text-[#0F1F45] font-serif-luxury italic leading-relaxed mb-4 font-medium">
              "To help families make confident money decisions with a plan they truly understand."
            </p>

            <p className="text-sm text-[#475569] font-inter leading-relaxed line-clamp-2">
              We replace guesswork with a simple plan built around your income, your goals and your comfort with risk.
            </p>
          </motion.div>

          {/* Card 2 — VISION */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-[#2F5BC7]/30 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] transition-all duration-300 shadow-lg text-left group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] flex items-center justify-center">
                <Eye className="w-7 h-7" />
              </div>

              <span className="text-xs font-sora font-bold text-[#1A3170] uppercase tracking-widest px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30">
                OUR VISION
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45] mb-3 group-hover:text-[#2F5BC7] transition-colors">
              Advice Families Can Trust
            </h3>

            <p className="text-base sm:text-lg text-[#0F1F45] font-serif-luxury italic leading-relaxed mb-4 font-medium">
              "To be the advisor Indian families trust first, because we put their interests first."
            </p>

            <p className="text-sm text-[#475569] font-inter leading-relaxed line-clamp-2">
              Honest, easy-to-understand financial advice for every family, not just the wealthy.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
