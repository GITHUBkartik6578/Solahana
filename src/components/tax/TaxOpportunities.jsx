import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, DollarSign, Percent } from 'lucide-react';

export default function TaxOpportunities() {
  const opps = [
    {
      title: 'Tax Slabs Comparison',
      desc: 'Comparative evaluation between Old Tax Regime and New Tax Regime (Section 115BAC) based on your custom deduction profile.',
      icon: Percent,
      tag: 'Regime Selector',
    },
    {
      title: 'Section 80D Health Insurance',
      desc: 'Claim up to ₹25,000 for self & family, plus an additional ₹50,000 for senior citizen parents.',
      icon: DollarSign,
      tag: 'Medical Exemption',
    },
    {
      title: 'Capital Gains Threshold Strategy',
      desc: 'Utilize the ₹1.25 Lakh annual tax-free LTCG threshold on equity investments under updated tax rules.',
      icon: TrendingUp,
      tag: 'Equities & Mutual Funds',
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF] border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TAX SAVINGS OPPORTUNITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Key Tax Deductions You Might Be Missing
          </h2>
          <p className="text-base text-[#475569] font-inter">
            Unlock additional legally approved statutory exemptions tailored to modern Indian professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opps.map((op, idx) => {
            const IconComp = op.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-7 rounded-3xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm transition-all text-left flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-sora font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-[#FFFFFF] text-[#2F5BC7] border border-[#E4E8F0]">
                      {op.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                    {op.title}
                  </h3>
                  <p className="text-xs text-[#475569] font-inter leading-relaxed">
                    {op.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
