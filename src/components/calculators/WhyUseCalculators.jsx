import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Wallet, TrendingUp } from 'lucide-react';

const reasons = [
  {
    icon: Target,
    title: 'Better Planning',
    description: 'Make data-backed decisions before committing your capital to long-term financial instruments.',
    metric: '100% Data-Driven'
  },
  {
    icon: Compass,
    title: 'Realistic Goal Setting',
    description: 'Map out exact timeframes, inflation factors, and required monthly allocations for key milestones.',
    metric: 'Precision Forecasting'
  },
  {
    icon: Wallet,
    title: 'Monthly Budget Awareness',
    description: 'Seamlessly align current monthly cash flow with future investment commitments and loan obligations.',
    metric: 'Optimal Allocation'
  },
  {
    icon: TrendingUp,
    title: 'Long-Term Wealth Forecasting',
    description: 'Visualize the exponential power of compounding growth across 5, 10, or 20+ year horizons.',
    metric: 'Compounding Impact'
  }
];

export const WhyUseCalculators = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#2F5BC7]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A3170]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
              WHY CALCULATORS?
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-5xl font-bold text-[#0F1F45] mb-6 leading-tight"
          >
            Every Financial Decision Starts With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
              Clarity.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#5B6B84] text-base md:text-lg font-light leading-relaxed"
          >
            Mathematical confidence eliminates ambiguity. Solahana’s precision calculators provide the exact clarity you need to craft an unshakeable wealth roadmap.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-2xl bg-gradient-to-b from-[#F7F8FB]/70 to-[#031138]/90 border border-[#E4E8F0] hover:border-[#2F5BC7]/40 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                {/* Subtle card glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#2F5BC7]/0 via-[#2F5BC7]/0 to-[#2F5BC7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  <div className="w-14 h-14 rounded-xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 flex items-center justify-center mb-6 group-hover:bg-[#1A3170] group-hover:border-[#2F5BC7] transition-all duration-300">
                    <Icon className="w-7 h-7 text-[#5A7FD6] group-hover:text-[#0F1F45] transition-colors duration-300" />
                  </div>

                  <h3 className="font-playfair text-xl font-bold text-[#0F1F45] mb-3 group-hover:text-[#5A7FD6] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-[#5B6B84] text-sm leading-relaxed font-light mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E4E8F0] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#5A7FD6] tracking-wider uppercase">
                    {item.metric}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A3170]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
