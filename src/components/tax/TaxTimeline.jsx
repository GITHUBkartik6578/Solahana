import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export default function TaxTimeline() {
  const steps = [
    {
      quarter: 'Q1 (Apr - Jun)',
      title: 'Declaration & Planning Strategy',
      desc: 'Set up automated monthly ELSS SIPs and submit proposed tax declarations to HR to avoid excess TDS deductions.',
    },
    {
      quarter: 'Q2 (Jul - Sep)',
      title: 'Mid-Year Portfolio Audit',
      desc: 'Evaluate capital gains realized from equity/debt sales and optimize asset location strategy.',
    },
    {
      quarter: 'Q3 (Oct - Dec)',
      title: 'Tax-Loss Harvesting Window',
      desc: 'Sell underperforming holdings to offset realized short/long term capital gains before calendar year end.',
    },
    {
      quarter: 'Q4 (Jan - Mar)',
      title: 'Final Proof Submission & ITR Readiness',
      desc: 'Submit final Section 80C, 80D, health insurance & NPS deposit proofs to ensure clean tax filing.',
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF] border-b border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Calendar className="w-3.5 h-3.5" />
            <span>ANNUAL ROADMAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Year-Round Tax Execution Timeline
          </h2>
          <p className="text-base text-[#475569] font-inter">
            A systematic four-quarter framework ensuring maximum savings without stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-7 rounded-3xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-[#1A3170] text-white font-sora font-bold text-xs">
                  {st.quarter}
                </span>
                <Clock className="w-5 h-5 text-[#2F5BC7]" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45]">{st.title}</h3>
              <p className="text-xs text-[#475569] font-inter leading-relaxed">{st.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
