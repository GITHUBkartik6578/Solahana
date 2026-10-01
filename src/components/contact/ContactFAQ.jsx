import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How long is the first consultation?",
    answer: "Our initial consultation typically lasts 45 minutes. This provides ample time to review your current financial snapshot, discuss your primary life goals, and answer key questions about our fee-only wealth planning framework."
  },
  {
    question: "Who is financial planning suitable for?",
    answer: "Financial planning is valuable for anyone seeking structured clarity over their money—from young professionals building their first wealth portfolio to business owners, families planning higher education, and individuals preparing for early retirement (FIRE)."
  },
  {
    question: "Can I discuss multiple financial goals?",
    answer: "Yes, absolutely. In fact, holistic financial planning works best when all goals (retirement, child education, home purchase, emergency reserves, tax optimization) are structured together into one unified cash flow model."
  },
  {
    question: "Is online consultation available?",
    answer: "Yes. We conduct seamless, high-definition 1-on-1 video consultations via Google Meet or Zoom for clients across India and globally (NRIs). In-person meetings are also available at our Mumbai office in Andheri West."
  },
  {
    question: "What should I prepare before the meeting?",
    answer: "No extensive paperwork is needed prior to the first call. Having a general idea of your monthly savings, existing investments, outstanding loans, and upcoming financial milestones is all you need to get started."
  }
];

export const ContactFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#2F5BC7]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A3170]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
              PRE-BOOKING FAQ
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-5xl font-bold text-[#0F1F45] mb-6 leading-tight"
          >
            Before Booking Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
              Consultation.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#5B6B84] text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto"
          >
            Answers to common questions regarding session duration, preparation, planning scope, and meeting format.
          </motion.p>
        </div>

        {/* Accordion container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`rounded-2xl transition-all duration-300 border ${
                  isOpen
                    ? 'bg-gradient-to-r from-[#F7F8FB] to-[#F7F8FB] border-[#2F5BC7]/50 shadow-xl shadow-[#2F5BC7]/5'
                    : 'bg-[#F7F8FB]/40 border-[#E4E8F0] hover:border-[#E4E8F0]'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      isOpen ? 'bg-[#1A3170] text-white' : 'bg-[#F7F8FB] text-[#5A7FD6]'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="font-playfair text-lg md:text-xl font-medium text-[#0F1F45]">
                      {faq.question}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#2F5BC7]/20 text-[#5A7FD6]' : 'text-[#5B6B84]'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 text-[#5B6B84] text-base leading-relaxed font-light pl-18 border-t border-[#E4E8F0]">
                        {faq.answer}
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
};
