import React from 'react';
import { motion } from 'framer-motion';
import { FileText, PieChart, ShieldCheck, RefreshCcw } from 'lucide-react';

export default function WhatYouReceive() {
  const deliverables = [
    {
      title: 'Comprehensive Wealth Blueprint',
      desc: 'A 30+ page detailed financial roadmap covering cashflow, emergency reserves, goal SIPs, insurance, and estate structure.',
      icon: FileText,
      badge: 'PDF Deliverable',
    },
    {
      title: 'Asset Allocation Matrix',
      desc: 'Custom allocation strategy across domestic equity, debt, international equity, and gold matched to risk profile.',
      icon: PieChart,
      badge: 'Portfolio Design',
    },
    {
      title: 'Tax Optimization Plan',
      desc: 'Annual strategy for Section 80C, Section 80D, NPS, and capital gains tax harvesting to minimize leakage.',
      icon: ShieldCheck,
      badge: 'Tax Strategy',
    },
    {
      title: 'Annual Portfolio Rebalancing',
      desc: 'Periodic monitoring and annual strategy alignment as income grows and life goals evolve.',
      icon: RefreshCcw,
      badge: 'Ongoing Support',
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <FileText className="w-3.5 h-3.5" />
            <span>CLIENT DELIVERABLES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            What You Receive as a SOLAHANA Client
          </h2>
          <p className="text-base text-[#475569] font-inter">
            Tangible, action-oriented documentation and ongoing institutional planning support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliverables.map((del, idx) => {
            const IconComp = del.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#2F5BC7] bg-[#FFFFFF] px-2.5 py-1 rounded border border-[#E4E8F0] uppercase">
                      {del.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                    {del.title}
                  </h3>
                  <p className="text-xs text-[#475569] font-inter leading-relaxed">
                    {del.desc}
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
