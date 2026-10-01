import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Award, GraduationCap, Calculator } from 'lucide-react';

export default function WhyPlanningMatters() {
  const cards = [
    {
      title: 'Wealth Creation',
      desc: 'Regular investing that grows quietly in the background.',
      icon: TrendingUp,
      badge: 'Steady growth'
    },
    {
      title: 'Retirement Planning',
      desc: 'A retirement fund that keeps your lifestyle going after work.',
      icon: Award,
      badge: 'Life after work'
    },
    {
      title: 'Child Education Planning',
      desc: 'A dedicated fund for college, in India or abroad, never touched for anything else.',
      icon: GraduationCap,
      badge: 'For their future'
    },
    {
      title: 'Tax Planning',
      desc: 'Use 80C, 80D and NPS well, and pick the right tax regime every year.',
      icon: Calculator,
      badge: 'Less tax, legally'
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#FFFFFF] border-y border-[#E4E8F0]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2F5BC7]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHY IT MATTERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
            Why Financial Planning Matters
          </h2>
          <p className="text-base text-[#475569] font-inter max-w-2xl mx-auto">
            Without a plan, money just happens. With one, it works toward the things you care about.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {cards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl p-6 sm:p-7 bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#E4E8F0] text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors duration-300 flex items-center justify-center font-bold shadow-sm">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-sora font-semibold px-2.5 py-1 rounded-full bg-[#F7F8FB] text-[#1A3170] border border-[#E4E8F0]">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#475569] font-inter leading-relaxed line-clamp-2">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
