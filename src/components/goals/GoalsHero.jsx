import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import GoalPlanningIllustration from '../illustrations/GoalPlanningIllustration';
import ScaledStage from '../common/ScaledStage';

export default function GoalsHero({ onStartPlanning, onExploreCategories }) {
  const benefits = [
    'Milestone-Linked Investment Portfolios',
    'Inflation-Adjusted Target Corpus Calculation',
    'Automated Step-Up & Risk Ring-Fencing'
  ];

  return (
    <section className="relative overflow-hidden bg-[#F7F8FB] pt-20">
<ScaledStage>
<div className="relative pt-4 pb-14 @3xl:pt-12 @3xl:pb-20">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-[#2F5BC7]/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 relative z-10">
        <div className="grid grid-cols-1 @5xl:grid-cols-12 gap-10 @5xl:gap-8 items-center">
          
          {/* Left Column — Editorial Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="@5xl:col-span-6 space-y-5 text-left"
          >
            {/* Small Gold Label */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full gold-badge text-[#1A3170] text-xs font-semibold uppercase tracking-widest font-sora">
              <Compass className="w-3.5 h-3.5 text-[#C9A04F]" />
              <span>GOALS & RISK PLANNING</span>
            </div>

            {/* One Hero Heading */}
            <h1 className="text-4xl @2xl:text-5xl @5xl:text-6xl font-serif-luxury font-bold text-[#0F1F45] leading-[1.15] tracking-tight">
              Every Dream Begins With <br />
              A <span className="gold-gradient-text italic font-serif-luxury">Financial Goal</span>.
            </h1>

            {/* One Short Description */}
            <p className="text-base @2xl:text-lg text-[#475569] font-inter leading-relaxed max-w-xl font-normal line-clamp-2">
              Whether planning your dream home, child’s education, risk shield, or retirement, turn goals into achievable blueprints.
            </p>

            {/* 3 Benefit Bullets */}
            <div className="space-y-2.5 pt-1">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-center space-x-2.5 text-xs @2xl:text-sm text-[#0F1F45] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#2F5BC7] shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            {/* One CTA Button */}
            <div className="pt-3">
              <Link
                to="/contact"
                className="gold-glow-button px-8 py-4 rounded-full text-xs @2xl:text-sm font-bold tracking-wide inline-flex items-center space-x-2.5 group shadow-md"
              >
                <span>Plan Your Goals & Risk Shield</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column — Large Vector Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="@5xl:col-span-6 relative flex items-center justify-center"
          >
            <div className="w-full max-w-[480px] @2xl:max-w-[540px] @5xl:max-w-[620px] aspect-square relative flex items-center justify-center p-2 rounded-3xl bg-white/70 border border-[#2F5BC7]/20 shadow-xl backdrop-blur-xl overflow-hidden">
              <GoalPlanningIllustration />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
</ScaledStage>
</section>
  );
}
