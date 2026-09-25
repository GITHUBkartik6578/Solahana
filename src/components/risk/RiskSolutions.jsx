import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, FileText, Activity, Users, Lock, ArrowUpRight } from 'lucide-react';

export default function RiskSolutions({ onSelectSolution }) {
  const solutions = [
    {
      icon: ShieldCheck,
      title: 'Life Insurance Planning',
      desc: 'Pure term cover structuring calculated to replace Human Life Value (HLV) and protect dependents.',
    },
    {
      icon: HeartPulse,
      title: 'Health Insurance Planning',
      desc: 'Comprehensive base health policies paired with high-deductible super top-up medical shields.',
    },
    {
      icon: FileText,
      title: 'Term Insurance Planning',
      desc: 'High-sum-assured term protection with critical illness and accidental disability rider add-ons.',
    },
    {
      icon: Activity,
      title: 'Critical Illness Planning',
      desc: 'Lumpsum payout protection against major medical diagnoses, treatment costs, and income loss.',
    },
    {
      icon: Users,
      title: 'Family Protection Planning',
      desc: '360° risk audit covering home loans, child education liabilities, and dependent family security.',
    },
    {
      icon: Lock,
      title: 'Wealth Protection Planning',
      desc: '6-month liquid emergency reserves and asset ring-fencing strategies against market shocks.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            PROTECTION SOLUTIONS SUITE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Risk Management Solutions
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Comprehensive risk protection strategies engineered to ring-fence your family and capital.
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
                  <span>Explore Protection</span>
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
