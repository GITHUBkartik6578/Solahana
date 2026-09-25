import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, TrendingUp, Wallet, ShieldCheck } from 'lucide-react';

export default function WhyRetirementMatters() {
  const cards = [
    {
      icon: Landmark,
      title: 'Retirement Corpus',
      description: 'Build a dedicated, inflation-adjusted nest egg to comfortably sustain 25+ post-retirement years without lifestyle compromise.',
    },
    {
      icon: TrendingUp,
      title: 'Inflation Protection',
      description: 'Defend your purchasing power against rising medical and living costs using growth-oriented multi-asset portfolios.',
    },
    {
      icon: Wallet,
      title: 'Monthly Income Planning',
      description: 'Structure predictable, tax-efficient monthly cashflows via Systematic Withdrawal Plans (SWP) and annuity laddering.',
    },
    {
      icon: ShieldCheck,
      title: 'Wealth Preservation',
      description: 'Safeguard your accumulated principal while balancing equity-debt allocations to ensure your capital outlives retirement.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            FINANCIAL SECURITY FOR LIFE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Why Retirement Planning Matters
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            A structured retirement strategy ensures complete financial independence, medical security, and lifelong peace of mind.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E4E8F0] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between group"
              >
                <div>
                  {/* Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/40 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white flex items-center justify-center mb-5 transition-colors duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] mb-2 group-hover:text-[#2F5BC7] transition-colors">
                    {card.title}
                  </h3>

                  {/* Max 2-line Description */}
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Gold Accent Bar */}
                <div className="mt-6 w-full h-1 rounded-full bg-[#F7F8FB] group-hover:bg-[#2F5BC7]/40 transition-colors" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
