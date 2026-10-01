import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Wallet, FileCheck, ShieldPlus, ArrowUpRight } from 'lucide-react';

export default function RetirementSolutions() {
  const solutions = [
    {
      icon: Flame,
      title: 'Early FIRE Accelerator',
      tag: 'FIRE Framework',
      desc: 'High-growth multi-asset portfolios structured for early financial independence in your 40s or 50s.',
    },
    {
      icon: Wallet,
      title: 'Post-Retirement SWP Cashflow',
      tag: 'Monthly Income',
      desc: 'Tax-efficient systematic withdrawal strategies providing steady monthly income without depleting principal.',
    },
    {
      icon: FileCheck,
      title: 'NPS & Pension Optimization',
      tag: 'Tax Efficiency',
      desc: 'Maximized Section 80CCD tax benefits paired with structured annuity selection for lifetime security.',
    },
    {
      icon: ShieldPlus,
      title: 'Senior Healthcare Shield',
      tag: 'Risk Management',
      desc: 'Dedicated medical buffer safeguarding your retirement nest egg against unexpected healthcare inflation.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            TAILORED SOLUTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Retirement Planning Solutions
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Comprehensive financial strategies engineered around your retirement age, income requirements, and risk appetite.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-7 sm:p-8 rounded-3xl bg-[#F7F8FB] border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#2F5BC7]/40 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase font-mono font-semibold px-2.5 py-1 rounded-full bg-white border border-[#E4E8F0] text-[#2F5BC7]">
                      {sol.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors mb-2">
                    {sol.title}
                  </h3>

                  <p className="text-sm text-[#475569] leading-relaxed">
                    {sol.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4E8F0]/60 flex items-center justify-between text-xs font-semibold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                  <span>Explore Strategy</span>
                  <ArrowUpRight className="w-4 h-4 text-[#2F5BC7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
