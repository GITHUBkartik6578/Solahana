import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AREAS = [
  {
    title: 'Goal-Based Planning',
    desc: 'SMART strategies tailored to achieve specific financial objectives.',
    to: '/goals',
  },
  {
    title: 'Retirement Planning',
    desc: 'Secure your future with long-term investment solutions.',
    to: '/calculators/retirement',
  },
  {
    title: 'Investment Planning',
    desc: 'Filter and manage investments based on your goals, risk tolerance, and market conditions.',
    to: '/investments',
  },
  {
    title: 'Debt Management',
    desc: 'Efficient repayment strategies to minimize interest costs.',
  },
  {
    title: 'Tax Planning',
    desc: 'Legal methods to minimize tax liabilities and retain more of your income.',
    to: '/tax-planning',
  },
  {
    title: 'Legacy & Inheritance Planning',
    desc: 'Estate planning to ensure seamless asset transfer to beneficiaries.',
    to: '/estate-planning',
  },
  {
    title: 'Emergency Planning',
    desc: 'Build an emergency fund to handle unexpected financial challenges.',
  },
  {
    title: 'Insurance Guidance',
    desc: 'Find the right health and term insurance plans to safeguard your financial stability.',
    to: '/risk-management',
  },
];

export default function PlanningCoverage() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#EEF3FB] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
            What we cover
          </span>
          <h2 className="mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
            Eight areas, <span className="gold-gradient-text" style={{ display: 'inline' }}>one connected plan.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">
            Everything that touches your money, planned together so nothing is left to chance.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {AREAS.map(({ title, desc, to }, i) => {
            const body = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1A3170] text-base font-bold text-white transition-colors group-hover:bg-[#C58A1B]">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[#0B1738] font-sora">{title}</h3>
                  <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-[#334155]">{desc}</p>
                  {to && (
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2F5BC7]">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  )}
                </div>
              </>
            );
            const cls =
              'group flex h-full items-start gap-4 rounded-2xl border-2 border-[#C9D6EE] bg-white p-5 sm:p-6 shadow-[0_10px_28px_rgba(26,49,112,0.12)] transition-all duration-300';
            return (
              <motion.li className="h-full"
                key={title}
                initial={{ y: 14 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
              >
                {to ? (
                  <Link to={to} className={`${cls} hover:-translate-y-0.5 hover:border-[#2F5BC7]/40 hover:shadow-[0_14px_34px_rgba(26,49,112,0.12)]`}>
                    {body}
                  </Link>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
