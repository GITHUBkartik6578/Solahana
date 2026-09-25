import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Landmark, BarChart3, Globe, Rocket, ArrowUpRight } from 'lucide-react';

export default function InvestmentCategories() {
  const navigate = useNavigate();

  const solutions = [
    {
      icon: TrendingUp,
      title: 'Mutual Funds',
      route: '/invest/mutual-funds',
      desc: 'Direct SIP & lumpsum equity/hybrid funds with zero distributor commissions.',
    },
    {
      icon: Landmark,
      title: 'Bonds',
      route: '/invest/bonds',
      desc: 'High-yield government & corporate fixed-income bonds for capital preservation.',
    },
    {
      icon: BarChart3,
      title: 'Domestic Equity',
      route: '/invest/domestic-equity',
      desc: 'Curated Indian equity model portfolios and direct stock compounding strategies.',
    },
    {
      icon: Globe,
      title: 'International Equity',
      route: '/invest/international-equity',
      desc: 'Global stock portfolios and dollar-denominated US tech equity exposure.',
    },
    {
      icon: Rocket,
      title: 'IPO',
      route: '/invest/ipo',
      desc: 'Early bidding access to high-growth public market listings and institutional IPOs.',
    },
  ];

  return (
    <section id="investment-categories" className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            ASSET SOLUTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Investment Planning Solutions
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Diversify seamlessly across asset classes engineered for optimal risk-adjusted returns.
          </p>
        </div>

        {/* 5 Premium Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                onClick={() => navigate(sol.route)}
                className="p-6 rounded-3xl bg-[#F7F8FB] border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#2F5BC7]/40 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#2F5BC7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  <h3 className="text-base font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors mb-2">
                    {sol.title}
                  </h3>

                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                    {sol.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E8F0]/60 text-[11px] font-semibold text-[#2F5BC7] flex items-center justify-between">
                  <span>View Details</span>
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
