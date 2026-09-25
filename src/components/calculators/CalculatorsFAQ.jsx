import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Which calculator should I use first?",
    answer: "We recommend starting with the Emergency Fund Calculator or the SIP Calculator. Establishing a secure 6-month safety net is the foundational first step of any Solahana financial roadmap, followed closely by estimating regular monthly compounding via SIPs."
  },
  {
    question: "Are these calculators suitable for beginners?",
    answer: "Yes, absolutely. Our calculators are designed with elegant simplicity. They translate complex financial compounding, tax adjustments, and loan amortization schedules into visual graphs and clean summary metrics that anyone can understand instantly."
  },
  {
    question: "Can I use calculators for multiple goals?",
    answer: "Yes. You can use our Goal Calculator and SIP Planner independently for separate life objectives—such as purchasing a home, funding higher education, or building a retirement corpus—and then aggregate them into your total monthly commitment."
  },
  {
    question: "What's the difference between SIP and Lumpsum?",
    answer: "A SIP (Systematic Investment Plan) involves depositing a fixed amount regularly (e.g. monthly), leveraging rupee cost averaging over time. A Lumpsum calculator estimates growth for a single one-time investment over your desired time horizon."
  },
  {
    question: "How often should I revisit my calculations?",
    answer: "We advise reviewing your calculations annually, or whenever significant life events occur (such as a career promotion, marriage, home purchase, or change in income). Annual reviews help adjust for inflation and shifting market return expectations."
  }
];

export const CalculatorsFAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#2F5BC7]/5 rounded-full blur-[150px] pointer-events-none" />

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
              CALCULATOR HELP
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-5xl font-bold text-[#0F1F45] mb-6 leading-tight"
          >
            Frequently Asked Questions About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
              Financial Calculators.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#5B6B84] text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto"
          >
            Everything you need to know about using Solahana’s financial tools effectively for your personalized wealth planning journey.
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
