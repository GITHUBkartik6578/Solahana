import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Receipt, 
  Home, 
  Crown, 
  ArrowRight 
} from 'lucide-react';

const popularTools = [
  {
    title: 'SIP Planner',
    subtitle: 'Systematic Wealth Building',
    description: 'Calculate step-up SIPs, inflation-adjusted targets, and expected corpus growth.',
    icon: TrendingUp,
    badge: 'Most Popular',
    calcType: 'sip'
  },
  {
    title: 'Retirement Planner',
    subtitle: 'Financial Independence',
    description: 'Determine your post-retirement corpus and sustainable monthly withdrawal limits.',
    icon: ShieldCheck,
    badge: 'Essential',
    calcType: 'retirement'
  },
  {
    title: 'Goal Planner',
    subtitle: 'Milestone Allocation',
    description: 'Structure dedicated monthly contributions tailored to key family and wealth goals.',
    icon: Target,
    badge: 'Goal-Based',
    calcType: 'goal'
  },
  {
    title: 'Tax Planner',
    subtitle: '80C & Capital Gains Optimization',
    description: 'Identify tax-saving investment opportunities under Old vs. New tax regimes.',
    icon: Receipt,
    badge: 'High Impact',
    calcType: 'tax'
  },
  {
    title: 'EMI Planner',
    subtitle: 'Mortgage & Loan Optimization',
    description: 'Evaluate principal repayment strategies to save interest and pay off debts earlier.',
    icon: Home,
    badge: 'Utility',
    calcType: 'emi'
  },
  {
    title: 'Wealth Planner',
    subtitle: 'Multi-Asset Portfolio Projection',
    description: 'Simulate combined equity, debt, and real estate compound asset allocation curves.',
    icon: Crown,
    badge: 'HNI Suite',
    calcType: 'wealth'
  }
];

export const PopularTools = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#F7F8FB]/60 via-[#F7F8FB] to-[#F7F8FB]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A3170]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
                PLANNING SUITE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-playfair text-3xl md:text-5xl font-bold text-[#0F1F45] leading-tight"
            >
              Popular Planning Tools At{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
                SOLAHANA
              </span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#5B6B84] text-base max-w-md font-light"
          >
            Explore our curated suite of luxury decision tools designed to turn complex financial equations into simple actionable strategies.
          </motion.p>
        </div>

        {/* Horizontal scroll grid on smaller screens, 3-col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-[#F7F8FB]/80 via-[#F7F8FB]/90 to-[#F7F8FB] border border-[#E4E8F0] hover:border-[#2F5BC7]/40 shadow-2xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Background gold accent beam */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#2F5BC7]/10 to-transparent rounded-tr-3xl pointer-events-none group-hover:from-[#2F5BC7]/20 transition-colors duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 flex items-center justify-center group-hover:bg-[#1A3170] transition-colors duration-300">
                      <Icon className="w-6 h-6 text-[#5A7FD6] group-hover:text-[#0F1F45] transition-colors duration-300" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#F7F8FB] border border-[#E4E8F0] text-[#5A7FD6]">
                      {tool.badge}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#5A7FD6] uppercase tracking-wider block mb-1">
                    {tool.subtitle}
                  </span>
                  <h3 className="font-playfair text-2xl font-bold text-[#0F1F45] mb-3 group-hover:text-[#5A7FD6] transition-colors duration-300">
                    {tool.title}
                  </h3>

                  <p className="text-[#5B6B84] text-sm leading-relaxed font-light mb-8">
                    {tool.description}
                  </p>
                </div>

                <a
                  href="#interactive-preview"
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-[#E4E8F0] group-hover:border-[#2F5BC7]/30 text-[#0F1F45] font-medium text-sm transition-colors duration-300"
                >
                  <span className="group-hover:text-[#5A7FD6] transition-colors duration-300">
                    Launch Tool
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F7F8FB] group-hover:bg-[#1A3170] flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-[#5B6B84] group-hover:text-[#0F1F45] transition-colors duration-300" />
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
