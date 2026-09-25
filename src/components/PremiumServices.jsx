import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Receipt, Shield, Wallet, Globe, Sparkles, ChevronRight } from 'lucide-react';

export default function PremiumServices() {
  const serviceCards = [
    {
      title: 'Mutual Funds & Smart SIPs',
      description: 'Goal-based direct mutual fund investment strategies with zero commissions, automated rebalancing, and direct portfolio tracking.',
      icon: TrendingUp,
      stat: 'Zero Commission • Direct Funds',
      badge: 'Goal-Based',
    },
    {
      title: 'Tax Optimization Engine',
      description: 'Smart tax optimization for individuals and businesses under Section 80C, 80D, NPS, and automated LTCG tax-loss harvesting.',
      icon: Receipt,
      stat: 'Save up to ₹1,00,000 Tax',
      badge: 'Automated Tax',
    },
    {
      title: 'Retirement & FIRE Planning',
      description: 'Build an inflation-protected retirement corpus with personalized AI drawdown planning, pension structuring, and wealth longevity.',
      icon: Shield,
      stat: 'Inflation-Adjusted FIRE',
      badge: 'Retirement',
    },
    {
      title: 'Bonds & Fixed Income',
      description: 'Safe wealth capital preservation with AAA rated corporate bonds, Sovereign Gold Bonds (SGB), and capital-guaranteed debt yields.',
      icon: Wallet,
      stat: 'Yield up to 10.5% p.a.',
      badge: 'Fixed Yield',
    },
    {
      title: 'NRI Wealth Planning',
      description: 'Cross-border investment and tax planning for global Indians with FEMA compliance, NRE/NRO account rules, and DTAA double tax relief.',
      icon: Globe,
      stat: 'US, Gulf & UK Desk',
      badge: 'Global Desk',
    },
    {
      title: 'AI Wealth Advisor Co-Pilot',
      description: '24×7 AI assistant that continuously audits your multi-bank and demat portfolios, detecting risks, hidden fees, and rebalancing alerts.',
      icon: Sparkles,
      stat: '24/7 AI Co-Pilot',
      badge: 'Solahana AI',
      isFeatured: true,
    },
  ];

  return (
    <section className="relative z-10 py-24 bg-[#FFFFFF] border-t border-[#E4E8F0] overflow-hidden text-left">
      
      {/* Background Mesh Gradient Glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#2F5BC7]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#2F5BC7]/10 border border-[#E4E8F0] text-xs font-semibold text-[#2F5BC7]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span className="font-sora tracking-wide uppercase text-[10px] font-bold">Institutional Offerings</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight"
          >
            Everything You Need to Build Wealth —{' '}
            <span className="text-[#2F5BC7] font-serif-luxury">In One Place</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed"
          >
            AI-powered financial engineering combined with SEBI registered wealth planning for complete peace of mind.
          </motion.p>
        </div>

        {/* 6 Services Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceCards.map((card, index) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`group relative rounded-3xl p-7 bg-white border ${
                  card.isFeatured ? 'border-[#2F5BC7] shadow-md' : 'border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)]'
                } transition-all duration-300 overflow-hidden flex flex-col justify-between hover:shadow-xl`}
              >
                <div>
                  {/* Top Badge & Circular Gold Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#E4E8F0] flex items-center justify-center text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-all duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-sora font-semibold uppercase tracking-wider bg-[#FFFFFF] border border-[#E4E8F0] text-[#2F5BC7]">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors mb-3">
                    {card.title}
                  </h3>

                  <p className="text-xs text-[#475569] font-inter leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Footer Stat & Hover Link */}
                <div className="pt-5 border-t border-[#E4E8F0] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0F1F45] font-sora">
                    {card.stat}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E4E8F0] group-hover:bg-[#1A3170] group-hover:text-white transition-all flex items-center justify-center text-[#2F5BC7]">
                    <ChevronRight className="w-4 h-4" />
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
