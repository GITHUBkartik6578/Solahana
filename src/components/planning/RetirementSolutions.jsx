import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Wallet, FileCheck, ShieldPlus } from 'lucide-react';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative h-full overflow-hidden rounded-3xl bg-white border border-[#E4E8F0] p-7 sm:p-8 text-left shadow-[0_2px_8px_rgba(15,31,69,0.04),0_14px_34px_rgba(15,31,69,0.06)] hover:-translate-y-1 hover:border-[#CBD6EE] hover:shadow-[0_20px_44px_rgba(15,31,69,0.12)] transition-all duration-300"
              >
                {/* accent bar */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1A3170] via-[#2F5BC7] to-[#C9A04F] opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="absolute -right-3 -bottom-6 text-[96px] leading-none font-serif-luxury font-bold text-[#F1F4FA] select-none pointer-events-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                <div className="relative flex items-start gap-5">
                  <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1A3170] to-[#0F1F45] text-[#E6C27A] flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(26,49,112,0.25)] group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded-full bg-[#FDF3E2] text-[#B07A16]">
                      {sol.tag}
                    </span>
                    <h3 className="mt-3 text-xl font-bold text-[#0F1F45] font-sora leading-snug">
                      {sol.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#475569] leading-relaxed">
                      {sol.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
