import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function GoalTransition() {
  return (
    <section className="relative z-10 py-16 bg-[#FFFFFF] border-t border-[#2F5BC7]/15 text-center overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-[#2F5BC7]/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full gold-badge text-xs font-semibold text-[#5A7FD6]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6]" />
          <span className="font-sora tracking-wide uppercase text-[10px]">TAILORED GOAL ROADMAP</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight"
        >
          Planning for Every Goal in Your Life
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base text-[#5B6B84] font-inter max-w-lg mx-auto"
        >
          Explore the financial goals SOLAHANA helps you plan for.
        </motion.p>

        {/* Subtle Gold Animated Downward Arrow */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="pt-6 flex justify-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#2F5BC7]/15 border border-[#2F5BC7]/35 text-[#5A7FD6] flex items-center justify-center shadow-[0_0_15px_rgba(26,49,112,0.3)]">
            <ArrowDown className="w-5 h-5" />
          </div>
        </motion.div>

      </div>

    </section>
  );
}
