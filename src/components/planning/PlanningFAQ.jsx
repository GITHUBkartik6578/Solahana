import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function PlanningFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is included in a SOLAHANA Financial Plan?',
      a: 'Everything your money touches: cashflow, emergency fund, goals, investments, taxes, insurance and your will.',
    },
    {
      q: 'How is SOLAHANA different from traditional financial advisors?',
      a: "We start with your goals and only suggest products that fit them. You won't be pushed into buying anything.",
    },
    {
      q: 'How long does it take to create my financial plan?',
      a: 'Your initial plan is presented within 5-7 business days after your confidential 1-on-1 discovery consultation.',
    },
    {
      q: 'Can I update my financial plan as my career advances?',
      a: 'Yes. Your plan is reviewed every year, and whenever something big changes in your life.',
    },
    {
      q: 'Is my personal and financial information secure?',
      a: 'Yes. Your information is kept confidential and shared only with the people working on your plan.',
    },
    {
      q: 'How do I get started with SOLAHANA Financial Planning?',
      a: "Tap 'Get My Plan' or 'Book a Free Call', and an advisor will call you for a short, free discovery chat.",
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#F7F8FB] border-t border-[#E4E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
            Financial Planning FAQ
          </h2>
          <p className="text-base text-[#475569] font-inter max-w-xl mx-auto">
            Straight answers about how we work, what you get and how to begin.
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
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="rounded-2xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-serif-luxury font-bold text-[#0F1F45] hover:text-[#2F5BC7] transition-colors">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-[#F7F8FB] border border-[#E4E8F0] flex items-center justify-center shrink-0 text-[#2F5BC7] transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#1A3170] text-white border-[#2F5BC7]' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#475569] font-inter leading-relaxed border-t border-[#E4E8F0]/40 pt-4">
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
    </>
  );
}
