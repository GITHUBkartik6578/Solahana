import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function RetirementFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How much retirement corpus do I need in India?',
      a: 'Your required retirement corpus depends on your current monthly living expenses, target retirement age, expected inflation rate (typically 6% in India), and post-retirement life expectancy (25–30 years). SOLAHANA’s Retirement Calculator accurately projects your future inflation-adjusted monthly expenses and total nest egg requirement.',
    },
    {
      q: 'How does inflation affect my retirement savings?',
      a: 'Inflation erodes purchasing power over time. For example, at a 6% annual inflation rate, a monthly expense of ₹75,000 today will rise to over ₹4.3 Lakhs per month in 30 years. Without growth-oriented equity/hybrid investments, fixed income savings will fall short of meeting your retirement expenses.',
    },
    {
      q: 'What is a Systematic Withdrawal Plan (SWP) and how does it work?',
      a: 'A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount of money from your mutual fund investments on a monthly or quarterly basis. Unlike Fixed Deposit interest which is taxed at your income tax slab, SWP withdrawals are far more tax-efficient because only the gain portion of each redemption is taxed.',
    },
    {
      q: 'When should I start planning for retirement?',
      a: 'The best time to start retirement planning is as early as possible. Starting in your 20s or 30s allows compounding to do the heavy lifting, requiring a much smaller monthly SIP compared to starting in your 40s or 50s.',
    },
    {
      q: 'How can SOLAHANA help optimize my tax liabilities post-retirement?',
      a: 'SOLAHANA structures your retirement corpus into multi-asset buckets—utilizing tax-free Section 80CCD (NPS) provisions, equity long-term capital gains exemptions, and tax-efficient SWP drawdowns to ensure your monthly income faces minimal tax leakage.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F7F8FB] border border-[#E4E8F0] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Retirement Planning FAQs
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Clear, expert answers to help you navigate your journey toward financial freedom.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="rounded-2xl border border-[#E4E8F0] bg-[#F7F8FB] overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-serif-luxury font-bold text-base sm:text-lg text-[#0F1F45] hover:text-[#2F5BC7] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-white border border-[#E4E8F0] flex items-center justify-center text-[#2F5BC7] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#1A3170] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 sm:p-6 pt-0 border-t border-[#E4E8F0]/60 text-xs sm:text-sm text-[#475569] leading-relaxed font-sans text-left">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
