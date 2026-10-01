import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, PieChart, ShieldCheck } from 'lucide-react';

export default function WhyInvestingMatters() {
  const cards = [
    {
      icon: TrendingUp,
      title: 'Wealth Creation',
      description: 'Systematically compound capital across inflation-beating asset classes to build long-term generational wealth.',
    },
    {
      icon: Target,
      title: 'Goal-Based Investing',
      description: 'Map investments directly to specific life targets such as home purchases, education funds, and early retirement.',
    },
    {
      icon: PieChart,
      title: 'Portfolio Diversification',
      description: 'Balance risk intelligently across mutual funds, domestic equity, fixed-income bonds, and international assets.',
    },
    {
      icon: ShieldCheck,
      title: 'Long-Term Growth',
      description: 'Defend purchasing power against inflation through disciplined asset allocation and periodic portfolio reviews.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            STRATEGIC WEALTH CREATION
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Why Investment Planning Matters
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            A structured investment strategy transforms arbitrary savings into goal-driven wealth compounding.
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
                  {/* Icon Box */}
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/40 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white flex items-center justify-center mb-5 transition-colors duration-300 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] mb-2 group-hover:text-[#2F5BC7] transition-colors">
                    {card.title}
                  </h3>

                  {/* Description (max 2 lines) */}
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2">
                    {card.description}
                  </p>
                </div>

                {/* Accent line */}
                <div className="mt-6 w-full h-1 rounded-full bg-[#F7F8FB] group-hover:bg-[#2F5BC7]/40 transition-colors" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
