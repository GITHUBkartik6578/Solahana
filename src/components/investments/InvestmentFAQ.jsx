import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function InvestmentFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is SIP and how does it work?',
      a: 'A Systematic Investment Plan (SIP) is a disciplined method of investing a fixed rupee amount monthly into zero-commission direct mutual funds. It leverages rupee cost averaging (buying more units when prices drop) and compound growth without requiring market timing.'
    },
    {
      q: 'How much of my income should I invest monthly?',
      a: 'A general financial planning guideline is saving and investing 20% to 30% of your net monthly income. However, at SOLAHANA, we calculate your exact monthly SIP target based on your specific life goal deadlines and target corpus numbers.'
    },
    {
      q: 'Should I invest in separate funds for different goals?',
      a: 'Yes! Segregating investments into goal-based buckets (e.g. Home Fund vs FIRE Retirement) ensures that a short-term market dip won’t force you to liquidate long-term compounding assets, maintaining clear risk alignment.'
    },
    {
      q: 'How does asset diversification protect my portfolio?',
      a: 'Diversification spreads capital across uncorrelated asset classes (Equity, AAA Debt, Sovereign Gold Bonds, and Cash). When stock markets experience temporary corrections, debt and gold buffers stabilize your total net worth.'
    },
    {
      q: 'Can my investment portfolio be reviewed and rebalanced regularly?',
      a: 'Absolutely. SOLAHANA conducts structured annual rebalancing to reset asset weights back to your target allocation, while harvesting up to ₹1,00,000 of tax-free capital gains (LTCG) every financial year.'
    },
    {
      q: 'Is investing different from comprehensive financial planning?',
      a: 'Yes. Investing is simply allocating money into growth instruments. Financial planning is the overarching master blueprint that unifies cash flow management, tax harvesting, insurance shields, estate planning, and life goals.'
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <HelpCircle className="w-3.5 h-3.5 text-[#2F5BC7]" />
            <span>INVESTMENT ANSWERS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            Common Investment Questions.
          </h2>

          <p className="text-base text-[#5B6B84] font-inter">
            Clear, honest answers to help you navigate your wealth building journey.
          </p>
        </div>

        {/* Dark Glass Accordion Stack */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-2xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/25 overflow-hidden transition-all duration-300 backdrop-blur-xl shadow-[0_10px_30px_rgba(2,11,45,0.6)]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between space-x-4 focus:outline-none group"
                >
                  <span className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors">
                    {faq.q}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#2F5BC7]/30 flex items-center justify-center text-[#5A7FD6] shrink-0 group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm text-[#5B6B84] leading-relaxed border-t border-[#2F5BC7]/10 font-inter"
                    >
                      <p className="pt-4">{faq.a}</p>
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
