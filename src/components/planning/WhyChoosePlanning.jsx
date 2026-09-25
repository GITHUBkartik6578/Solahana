import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, Compass, Award, Sparkles } from 'lucide-react';

export default function WhyChoosePlanning() {
  const features = [
    {
      title: 'Personalized Financial Planning',
      desc: 'Every suggestion starts from your income, your loans and your goals, not a template.',
      icon: UserCheck,
      badge: 'Made for you'
    },
    {
      title: 'Transparent Planning Process',
      desc: "You always know what you're paying for, and there's no pressure to buy products.",
      icon: ShieldCheck,
      badge: 'No sales pressure'
    },
    {
      title: 'Goal-Based Wealth Strategy',
      desc: "Each goal gets its own investments, matched to when you'll need the money.",
      icon: Compass,
      badge: 'Goal by goal'
    },
    {
      title: 'One Complete Platform',
      desc: 'Goals, insurance, taxes and investments, all in one place with one team.',
      icon: Award,
      badge: 'One team'
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#F7F8FB] border-b border-[#E4E8F0]">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#2F5BC7]/6 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WHY SOLAHANA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
            Why Choose SOLAHANA
          </h2>
          <p className="text-base text-[#475569] font-inter max-w-2xl mx-auto">
            Honest advice, a clear process and one team that knows your whole financial picture.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {features.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-7 sm:p-8 rounded-3xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors flex items-center justify-center font-bold shadow-sm">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-sora font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F7F8FB] text-[#1A3170] border border-[#E4E8F0]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] font-inter leading-relaxed line-clamp-2">
                    {feat.desc}
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
