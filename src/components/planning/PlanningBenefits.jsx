import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import BuildWealthIllustration from '../illustrations/BuildWealthIllustration';
import ProtectFamilyIllustration from '../illustrations/ProtectFamilyIllustration';
import SaveTaxesIllustration from '../illustrations/SaveTaxesIllustration';
import AchieveGoalsIllustration from '../illustrations/AchieveGoalsIllustration';

export default function PlanningBenefits() {
  const benefits = [
    {
      badge: 'WEALTH CREATION',
      heading: 'Watch Your Savings Actually Grow',
      desc: "What's left after bills goes into SIPs linked to your goals, every month, without you having to remember.",
      cta: 'Start Growing',
      link: '/investments',
      illustrationComponent: BuildWealthIllustration,
      frameClass: 'max-w-[480px] sm:max-w-[520px] aspect-[993/733]',
      reverse: false,
    },
    {
      badge: 'RISK PROTECTION',
      heading: "Keep Your Family Safe From Big Shocks",
      desc: "Term cover, health insurance with a top-up and a 6 to 12 month emergency fund, so one bad event doesn't undo years of savings.",
      cta: 'Check My Cover',
      link: '/contact',
      illustrationComponent: ProtectFamilyIllustration,
      frameClass: 'max-w-[420px] sm:max-w-[480px] aspect-[983/716]',
      reverse: true,
    },
    {
      badge: 'TAX OPTIMIZATION',
      heading: 'Pay Less Tax, Without the March Rush',
      desc: 'We plan 80C, 80D and NPS at the start of the year and choose the right tax regime for you.',
      cta: 'Plan My Taxes',
      link: '/tax-planning',
      illustrationComponent: SaveTaxesIllustration,
      frameClass: 'max-w-[480px] sm:max-w-[520px] aspect-[980/681]',
      reverse: false,
    },
    {
      badge: 'GOAL MILESTONES',
      heading: 'Hit Your Big Goals on Time',
      desc: "A home, your child's college, retiring when you want: each goal gets its own timeline and its own fund.",
      cta: 'Plan My Goals',
      link: '/contact',
      illustrationComponent: AchieveGoalsIllustration,
      frameClass: 'max-w-[420px] sm:max-w-[480px] aspect-[987/713]',
      reverse: true,
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2F5BC7]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20 md:space-y-28">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHAT YOU GET</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
            What Changes When You Have a Plan
          </h2>
          <p className="text-base text-[#475569] font-inter max-w-2xl mx-auto">
            Less guessing, less stress, and real progress on the things you care about.
          </p>
        </div>

        {/* 4 Alternating Benefit Sections */}
        {benefits.map((b, idx) => {
          const IllustrationComp = b.illustrationComponent;
          return (
            <div
              key={idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                b.reverse ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, x: b.reverse ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`lg:col-span-6 space-y-5 text-left ${
                  b.reverse ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <span className="text-[10px] font-sora font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-[#EEF2FB] text-[#1A3170] inline-block">
                  {b.badge}
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
                  {b.heading}
                </h3>

                <p className="text-sm sm:text-base text-[#475569] font-inter leading-relaxed max-w-xl line-clamp-2">
                  {b.desc}
                </p>

                <div className="pt-2">
                  <Link
                    to={b.link}
                    className="gold-glow-button px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wide inline-flex items-center space-x-2 group shadow-sm"
                  >
                    <span>{b.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>

              {/* Illustration Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className={`lg:col-span-6 flex items-center justify-center ${
                  b.reverse ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div
                  className={`w-full rounded-3xl bg-white border border-[#E4E8F0] shadow-lg backdrop-blur-xl flex items-center justify-center overflow-hidden ${
                    b.frameClass ?? 'max-w-[480px] sm:max-w-[520px] aspect-[4/3] p-3'
                  }`}
                >
                  <IllustrationComp />
                </div>
              </motion.div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
