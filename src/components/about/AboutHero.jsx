import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, ShieldCheck, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutHero({ onExplorePhilosophy, onOpenSearch }) {
  return (
    <section className="relative pt-24 pb-14 md:pt-32 md:pb-20 overflow-hidden bg-[#F7F8FB]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2F5BC7]/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column — Editorial Heading & Copy */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-5 text-left"
          >
            {/* Small Gold Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full gold-badge text-xs font-semibold uppercase tracking-widest text-[#1A3170]">
              <Compass className="w-3.5 h-3.5 text-[#C9A04F]" />
              <span>ABOUT SOLAHANA</span>
            </div>

            {/* Main Editorial Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold text-[#0F1F45] leading-[1.15] tracking-tight">
              We Help Families Make <br />
              <span className="gold-gradient-text italic font-serif-luxury">Sense of Their Money.</span>
            </h1>

            {/* Subtitle (50% shorter) */}
            <p className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed max-w-xl font-normal line-clamp-2">
              No jargon and no product-pushing. Just a clear plan for your goals, explained in plain language, by a team that sticks with you.
            </p>

            {/* Action Button (Single Primary Gold CTA Button) */}
            <div className="pt-2">
              <Link
                to="/contact"
                className="gold-glow-button px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wide inline-flex items-center space-x-2.5 group shadow-md"
              >
                <span>Start Your Financial Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#2F5BC7]/20 max-w-xl">
              <div>
                <p className="text-2xl font-bold font-sora text-[#2F5BC7]">100%</p>
                <p className="text-xs text-[#64748B] mt-0.5">Goal-first advice</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-sora text-[#2F5BC7]">1:1</p>
                <p className="text-xs text-[#64748B] mt-0.5">Your own advisor</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-sora text-[#2F5BC7]">Zero</p>
                <p className="text-xs text-[#64748B] mt-0.5">Jargon</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column — Visual Illustration Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="rounded-3xl p-8 bg-white border border-[#2F5BC7]/30 shadow-xl space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">
                Advice That Starts With You
              </h3>
              <p className="text-sm text-[#475569] font-inter leading-relaxed">
                SOLAHANA started with a simple belief: families deserve advice that's clear, honest and built around their goals, not around which product pays the most.
              </p>
              <div className="p-4 rounded-xl bg-[#F7F8FB] border border-[#2F5BC7]/20 text-xs text-[#1A3170] font-sora font-semibold">
                Advice That Starts With You
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
