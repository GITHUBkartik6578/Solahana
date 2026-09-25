import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, TrendingUp, CalendarCheck } from 'lucide-react';

export default function WhyChooseSolahanaTax() {
  const features = [
    {
      icon: UserCheck,
      title: 'Personalized Tax Planning',
      desc: 'Customized tax blueprints tailored specifically around your salary slabs, business income, and life milestones.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Planning Process',
      desc: 'SEBI-aligned fiduciary framework with zero hidden commissions or distributor kickbacks.',
    },
    {
      icon: TrendingUp,
      title: 'Tax-Efficient Wealth Strategy',
      desc: 'Integrated tax optimization across equities, direct mutual funds, real estate, bonds, and NPS.',
    },
    {
      icon: CalendarCheck,
      title: 'Year-Round Planning Support',
      desc: 'Proactive quarterly advance tax reviews and tax-loss harvesting guidance before March 31 deadlines.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            THE SOLAHANA DIFFERENCE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Why Choose SOLAHANA
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Disciplined tax architecture that turns tax liabilities into wealth-building opportunities.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E4E8F0] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/40 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white flex items-center justify-center mb-5 transition-colors shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors mb-2">
                    {feat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-3">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 w-full h-1 rounded-full bg-[#F7F8FB] group-hover:bg-[#2F5BC7]/40 transition-colors" />
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
