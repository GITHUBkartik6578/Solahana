import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import financialArt from '../assets/services/financial.webp';
import retirementArt from '../assets/services/retirement.webp';
import investmentArt from '../assets/services/investment.webp';
import taxArt from '../assets/services/tax.webp';
import cashflowArt from '../assets/services/cashflow.webp';
import goalArt from '../assets/services/goal.webp';
import riskArt from '../assets/services/risk.webp';
import estateArt from '../assets/services/estate.webp';

const SERVICES = [
  {
    title: ['Financial', 'Planning'],
    art: financialArt,
    desc: 'Bring your income, expenses, assets and goals together in one clear plan.',
    link: '/financial-planning',
  },
  {
    title: ['Retirement', 'Planning'],
    art: retirementArt,
    desc: 'Build a steady, comfortable income for a worry-free tomorrow.',
    link: '/calculators/retirement',
  },
  {
    title: ['Investment', 'Planning'],
    art: investmentArt,
    desc: 'Invest wisely with a strategy aligned to your goals and risk comfort.',
    link: '/investments',
  },
  {
    title: ['Tax', 'Planning'],
    art: taxArt,
    desc: 'Plan your taxes with clarity and efficiency.',
    link: '/tax-planning',
  },
  {
    title: ['Cash Flow', 'Management'],
    art: cashflowArt,
    desc: 'Track, optimise and manage your money with complete clarity.',
    link: '/financial-planning',
  },
  {
    title: ['Goal', 'Planning'],
    art: goalArt,
    desc: 'Turn your dreams — home, children’s education, travel and more — into a clear roadmap.',
    link: '/goals',
  },
  {
    title: ['Risk', 'Management'],
    art: riskArt,
    desc: 'Protect what matters with the right insurance and risk cover for you and your family.',
    link: '/risk-management',
  },
  {
    title: ['Estate', 'Planning'],
    art: estateArt,
    desc: 'Create a lasting legacy with a clear, well-structured plan for your family.',
    link: '/estate-planning',
  },
];

export default function TrustStrip() {
  return (
    <section className="relative z-20 py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-[#FBF8F3] to-white overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-14"
        >
          <span className="inline-flex items-center gap-3 font-sora text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.3em] text-[#9A7220]">
            <span className="h-px w-8 bg-[#C9922E]/60" />
            What we do
            <span className="h-px w-8 bg-[#C9922E]/60" />
          </span>
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="mt-5 text-[30px] sm:text-[40px] lg:text-[48px] font-bold text-[#0F1F45] leading-[1.12] tracking-tight"
          >
            Everything Your Wealth Needs.
            <span className="block text-[#B8862B]">One Clear Plan.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-[#475569]">
            From everyday finances to long-term legacy, we bring every important decision together.
          </p>
        </motion.div>

        {/* 4 x 2 service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {SERVICES.map(({ title, art, desc, link }, idx) => (
            <motion.div
              key={title.join(' ')}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (idx % 4) * 0.06 }}
              className="h-full"
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-[#FBF8F3] border border-[#EDE6D8] shadow-[0_14px_36px_rgba(15,31,69,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_54px_rgba(15,31,69,0.2)]">
                {/* Illustration with its number */}
                <Link to={link} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/5] sm:aspect-[2/3] w-full">
                  <img
                    src={art}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-bottom"
                    draggable="false"
                  />
                  <span className="absolute left-5 top-4 font-serif-luxury text-[28px] leading-none text-[#F1D9A3]">
                    {String(idx + 1).padStart(2, '0')}
                    <span className="mt-2 block h-px w-6 bg-[#F1D9A3]/80" />
                  </span>
                </Link>

                {/* Copy */}
                <div className="flex flex-1 flex-col px-6 pb-6 pt-1 text-left">
                  <h3
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className="text-[24px] font-bold leading-[1.15] text-[#0F1F45]"
                  >
                    {title[0]}
                    <br />
                    {title[1]}
                  </h3>
                  <span className="mt-4 h-[2px] w-9 rounded-full bg-[#C9922E]" />
                  <p className="mt-4 text-[15px] leading-relaxed text-[#475569]">{desc}</p>
                  <div className="mt-auto pt-6">
                    <Link
                      to={link}
                      className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#0F1F45] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,31,69,0.25)] transition-all hover:shadow-[0_12px_28px_rgba(15,31,69,0.38)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F5BC7]/30"
                    >
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
