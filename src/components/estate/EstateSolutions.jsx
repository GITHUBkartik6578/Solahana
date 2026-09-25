import React from 'react';
import { motion } from 'framer-motion';
import { Scroll, Landmark, Share2, Users, Briefcase, Award, ArrowUpRight } from 'lucide-react';

export default function EstateSolutions({ onSelectSolution }) {
  const solutions = [
    {
      icon: Scroll,
      title: 'Will Planning',
      desc: 'Legally binding Will drafting to ensure smooth asset distribution and zero family conflict.',
    },
    {
      icon: Landmark,
      title: 'Trust Planning',
      desc: 'Private Family Trust formation for asset protection, minor care, and estate tax shielding.',
    },
    {
      icon: Share2,
      title: 'Asset Distribution Planning',
      desc: 'Mapping real estate, equities, business shares, and liquidity seamlessly to designated heirs.',
    },
    {
      icon: Users,
      title: 'Family Wealth Transfer',
      desc: 'Structured succession frameworks for multi-generational wealth continuity and zero probate delays.',
    },
    {
      icon: Briefcase,
      title: 'Succession Planning',
      desc: 'Structuring business ownership transfer and operational management for family enterprises.',
    },
    {
      icon: Award,
      title: 'Legacy Planning',
      desc: 'Philanthropic foundation structuring and multi-generational family legacy governance.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            ESTATE SERVICES SUITE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Estate Planning Solutions
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Tailored legal and financial solutions designed to protect your wealth and preserve your legacy.
          </p>
        </div>

        {/* 6 Premium Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => onSelectSolution && onSelectSolution(sol.title)}
                className="p-7 sm:p-8 rounded-3xl bg-[#F7F8FB] border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#2F5BC7]/40 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#2F5BC7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors mb-2">
                    {sol.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-3">
                    {sol.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4E8F0]/60 flex items-center justify-between text-xs font-semibold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                  <span>Explore Solution</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
