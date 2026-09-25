import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Award, TrendingUp, Calculator, ShieldCheck, Scroll, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlanningAreas() {
  const services = [
    {
      title: 'Financial Planning',
      desc: 'One plan for your cashflow, emergency fund and life goals.',
      icon: PieChart,
      link: '/financial-planning',
      badge: 'The full picture'
    },
    {
      title: 'Retirement Planning',
      desc: 'A retirement fund plus a steady monthly income for later.',
      icon: Award,
      link: '/calculators/retirement',
      badge: 'Retire well'
    },
    {
      title: 'Investment Planning',
      desc: 'SIPs in funds chosen for your goals and your comfort with risk.',
      icon: TrendingUp,
      link: '/investments',
      badge: 'Goal-based'
    },
    {
      title: 'Tax Planning',
      desc: 'Plan 80C, 80D and NPS early and choose the right regime.',
      icon: Calculator,
      link: '/tax-planning',
      badge: 'Save tax'
    },
    {
      title: 'Risk Management',
      desc: "Term life and health cover sized for your family's needs.",
      icon: ShieldCheck,
      link: '/contact',
      badge: 'Family Cover'
    },
    {
      title: 'Estate Planning',
      desc: 'A will, nominees and papers in order for the next generation.',
      icon: Scroll,
      link: '/goals',
      badge: 'Peace of mind'
    },
  ];

  return (
    <section id="planning-solutions" className="py-16 md:py-24 relative overflow-hidden bg-[#FFFFFF] border-b border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Compass className="w-3.5 h-3.5" />
            <span>OUR SERVICES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
            Everything in One Plan
          </h2>
          <p className="text-base text-[#475569] font-inter max-w-2xl mx-auto">
            Six parts of your financial life, handled by one team that sees the full picture.
          </p>
        </div>

        {/* 6 Equal-Height Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {services.map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-7 sm:p-8 rounded-3xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between group h-full"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors flex items-center justify-center font-bold shadow-sm">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-sora font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F7F8FB] text-[#1A3170] border border-[#E4E8F0]">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] font-inter leading-relaxed line-clamp-2">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#E4E8F0]/60 mt-6">
                  <Link
                    to={srv.link}
                    className="text-xs font-bold text-[#1A3170] hover:text-[#2F5BC7] inline-flex items-center space-x-1.5 transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <span>Learn more</span>
                    <span>→</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
