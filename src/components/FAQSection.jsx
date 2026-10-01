import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Sparkles } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is financial planning?',
      a: 'It’s simply a plan for your money. We look at what you earn, spend, owe and own, then map out how you’ll reach your goals, like a home, your children’s education and retirement, while staying protected along the way.',
    },
    {
      q: 'How is SOLAHANA different from investment apps?',
      a: 'Investment apps help you buy things. We help you decide what’s worth buying in the first place. We start with your goals, insurance and taxes, and only then choose investments that fit.',
    },
    {
      q: 'Can I plan for multiple goals together?',
      a: 'Yes. Most people have several goals at once. We give each goal its own amount, timeline and investments, so saving for a home doesn’t eat into your retirement.',
    },
    {
      q: 'Does SOLAHANA help with tax planning?',
      a: 'Yes. We compare the old and new tax regimes for you and use 80C, 80D and NPS where they make sense, so you save tax without buying products you don’t need.',
    },
    {
      q: 'Can I review my financial plan regularly?',
      a: 'Yes, and you should. We review your plan every year, and any time life changes: a new job, a raise, a new baby.',
    },
    {
      q: 'Who should use SOLAHANA?',
      a: 'Anyone who wants their money organised: salaried professionals, business owners, NRI families and young earners just getting started.',
    },
  ];

  return (
    <section className="relative z-10 py-8 sm:py-10 lg:py-12 bg-[#EEF2FB] border-t border-[#2F5BC7]/20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-5 sm:mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#1A3170] border border-[#2F5BC7]/35 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span className="font-sora tracking-wide uppercase text-[11px]">FREQUENTLY ASKED QUESTIONS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight"
          >
            Clear Answers to Your{' '}
            <span className="gold-gradient-text italic font-serif-luxury">Financial Questions</span>
          </motion.h2>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl bg-white border border-[#2F5BC7]/20 overflow-hidden shadow-sm hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif-luxury font-bold text-lg text-[#0F1F45] hover:text-[#2F5BC7] transition-colors"
                >
                  <span>{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 flex items-center justify-center shrink-0 text-[#2F5BC7]">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-sm text-[#475569] font-inter leading-relaxed border-t border-[#2F5BC7]/10 pt-4"
                    >
                      {faq.a}
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
