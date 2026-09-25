import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Sunrise,
  TrendingUp,
  Receipt,
  Wallet,
  Target,
  ShieldCheck,
  Scroll,
} from 'lucide-react';

const SERVICES = [
  {
    title: 'Financial Planning',
    icon: Compass,
    desc: 'Your salary, savings, loans, insurance and goals brought together in one clear plan you can actually follow.',
    link: '/financial-planning',
  },
  {
    title: 'Retirement Planning',
    icon: Sunrise,
    desc: 'We work out how much you’ll need and build a steady monthly income for life after your salary stops.',
    link: '/goals',
  },
  {
    title: 'Investment Planning',
    icon: TrendingUp,
    desc: 'Goal-based SIPs in funds that match your timeline and comfort with risk, reviewed regularly, not forgotten.',
    link: '/investments',
  },
  {
    title: 'Tax Planning',
    icon: Receipt,
    desc: 'Old or new regime, 80C, 80D and NPS, planned early in the year around your goals, not in a March rush.',
    link: '/tax-planning',
  },
  {
    title: 'Cash Flow Management',
    icon: Wallet,
    desc: 'See where your money goes each month, cut the leaks, and build an emergency fund you won’t need to touch.',
    link: '/financial-planning',
  },
  {
    title: 'Goal Planning',
    icon: Target,
    desc: 'Your home, your children’s education, a wedding: each goal gets its own fund and timeline, so none compete.',
    link: '/goals',
  },
  {
    title: 'Risk Management',
    icon: ShieldCheck,
    desc: 'The right health and term cover for your family, so one bad month or a hospital bill doesn’t undo years of saving.',
    link: '/risk-management',
  },
  {
    title: 'Estate Planning',
    icon: Scroll,
    desc: 'A clear will, correct nominees on every account and documents in one place, so things are simple for your family.',
    link: '/estate-planning',
  },
];

export default function TrustStrip() {
  return (
    <section className="relative z-20 py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" /> What we do
          </span>
          <h2 className="mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
            Everything your money needs, <span className="gold-gradient-text">in one plan.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">
            Start with what worries you most. We connect the rest.
          </p>
        </motion.div>

        {/* 4 x 2 service grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {SERVICES.map(({ title, icon: Icon, desc, link }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (idx % 4) * 0.06 }}
              className="h-full"
            >
              <Link
                to={link}
                className="group relative flex flex-col items-center text-center h-full px-6 pt-9 pb-7 rounded-2xl bg-[#F1F4FA] border border-[#E4E8F0] shadow-[0_2px_6px_rgba(15,31,69,0.06)] hover:bg-white hover:border-[#CBD6EE] hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,31,69,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F5BC7]/25 transition-all duration-300"
              >
                {/* gold top accent on hover */}
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-0 group-hover:w-2/3 rounded-b-full bg-gradient-to-r from-[#E6C27A] via-[#C9A04F] to-[#A67C2E] transition-all duration-500" />

                <span className="relative w-16 h-16 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-white shadow-[0_4px_14px_rgba(15,31,69,0.08)] group-hover:bg-[#1A3170] transition-colors duration-300" />
                  <Icon className="relative w-8 h-8 text-[#1A3170] group-hover:text-[#E6C27A] transition-colors duration-300" strokeWidth={1.75} />
                </span>

                <h3 className="mt-6 text-[15px] font-extrabold uppercase tracking-[0.06em] text-[#0F1F45] leading-snug">
                  {title}
                </h3>
                <span className="mt-3 w-8 h-[2px] rounded-full bg-[#C9A04F]/70" />

                <p className="mt-4 text-sm text-[#475569] leading-relaxed">{desc}</p>

                <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#2F5BC7] opacity-70 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
