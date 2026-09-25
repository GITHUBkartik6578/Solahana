import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function TaxFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'Should I choose the New Tax Regime or the Old Tax Regime?',
      a: 'The optimal regime depends on your total deductions under Section 80C, 80D, HRA, and Home Loan interest. Generally, if your total deductions exceed ₹3.75 Lakhs, the Old Tax Regime provides higher net savings. SOLAHANA advisors run comparative scenarios before you commit.',
    },
    {
      q: 'What is Tax Loss Harvesting and how does it reduce my tax bill?',
      a: 'Tax loss harvesting involves selling investments that are sitting at a loss to offset capital gains realized from profitable sales during the same financial year. This minimizes your overall net taxable capital gains liability legally.',
    },
    {
      q: 'Is NPS (National Pension System) mandatory for tax saving?',
      a: 'NPS is optional, but Section 80CCD(1B) provides an exclusive ₹50,000 deduction over and above the ₹1.5 Lakh 80C limit. For individuals in the 30% tax slab, this yields an instant tax saving of ₹15,600 every year.',
    },
    {
      q: 'When should I start tax planning for the financial year?',
      a: 'Tax planning should begin in April at the start of the financial year. Setting up systematic monthly SIPs prevents March panic buying of inappropriate products with long lock-ins.',
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TAX PLANNING FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Frequently Asked Tax Questions
          </h2>
          <p className="text-base text-[#475569] font-inter">
            Clear, authoritative answers to common tax queries for Indian investors.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-[#E4E8F0] overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif-luxury text-base font-bold text-[#0F1F45]">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-[#FFFFFF] border border-[#E4E8F0] flex items-center justify-center text-[#2F5BC7] shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-[#1A3170] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-xs text-[#475569] font-inter leading-relaxed border-t border-[#E4E8F0]/50 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
