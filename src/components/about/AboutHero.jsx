import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChartColumnIncreasing, Coins, Armchair, ShieldCheck, FileText, Users, GraduationCap } from 'lucide-react';

import person from '../../assets/about-person.webp';

const playfair = { fontFamily: "'Playfair Display', Georgia, serif" };
const serif = { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" };

const PLANNING_LINKS = [
  { label: ['Financial', 'Planning'], to: '/financial-planning', icon: ChartColumnIncreasing },
  { label: ['Investment', 'Planning'], to: '/investments', icon: Coins },
  { label: ['Retirement', 'Planning'], to: '/calculators/retirement', icon: Armchair },
  { label: ['Risk', 'Planning'], to: '/risk-management', icon: ShieldCheck },
  { label: ['Tax', 'Planning'], to: '/tax-planning', icon: FileText },
  { label: ['Estate', 'Planning'], to: '/estate-planning', icon: Users },
];

const STRENGTHS = [
  { icon: GraduationCap, title: 'Qualified & Experienced', text: 'Chartered Wealth Manager with 25+ years in financial services.' },
  { icon: ChartColumnIncreasing, title: 'Comprehensive Approach', text: 'Integrated planning across investments, risk, tax, retirement and estate planning.' },
  { icon: ShieldCheck, title: 'Ethical & Transparent', text: 'Client-first, unbiased and compliant financial planning.' },
  { icon: Users, title: 'Long-Term Partnership', text: 'Focused on your goals, priorities and financial well-being at every life stage.' },
];

/* About hero: the portrait on the left, the credentials panel (live text, six planning links) on the right,
   and the four strengths underneath. Everything but the portrait is real text, so it stays sharp. */
export default function AboutHero() {
  return (
    <section className="relative bg-[#0B1A3C] pt-[80px]" aria-label="About SOLAHANA">
      <h1 className="sr-only">About SOLAHANA: Amit R. Pandey, Chartered Wealth Manager (CWM)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        {/* portrait */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative h-[320px] overflow-hidden sm:h-[420px] lg:h-auto lg:aspect-[1.2]"
        >
          <img
            src={person}
            alt="Amit R. Pandey, Chartered Wealth Manager (CWM), at his desk"
            width="1280"
            height="853"
            draggable="false"
            fetchpriority="high"
            className="absolute inset-0 h-full w-full select-none object-cover object-[30%_20%]"
          />
        </motion.div>

        {/* credentials panel */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="@container flex flex-col items-center justify-center bg-[linear-gradient(135deg,#F8F4EC_0%,#FFFFFF_55%,#EFE9DC_100%)] px-5 py-8 text-center sm:px-8"
        >
          <p style={{ ...playfair, fontSize: 'clamp(54px, 24cqw, 112px)' }} className="font-black leading-none tracking-tight text-[#0F1F45]" aria-hidden="true">
            CWM<sup className="align-super text-[0.26em] font-bold">®</sup>
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#0F1F45] sm:text-[13px]">Chartered Wealth Manager</p>
          <div className="mt-3 flex w-full max-w-[420px] items-center gap-3">
            <span className="h-px flex-1 bg-[#C9922E]/70" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#C9922E]" />
            <span className="h-px flex-1 bg-[#C9922E]/70" />
          </div>
          <h2 style={{ ...playfair, fontSize: 'clamp(30px, 10.5cqw, 52px)' }} className="mt-4 font-bold leading-[1.05] text-[#0F1F45]">Amit R. Pandey</h2>
          <p style={{ ...playfair, fontSize: 'clamp(15px, 4.4cqw, 21px)' }} className="mt-1 font-bold text-[#0F1F45]">
            Chartered Wealth Manager (CWM<sup className="text-[0.6em]">®</sup>)
          </p>
          <p className="mt-2 text-[13px] font-medium text-[#1E293B] sm:text-[14.5px]">
            MBA <span className="mx-1.5 text-[#C9922E]">|</span> Ex-Banker <span className="mx-1.5 text-[#C9922E]">|</span> 25+ Years of Experience in Financial Services
          </p>
          <span className="mt-3 block h-px w-full max-w-[460px] bg-[#C9922E]/45" />
          <p style={{ ...serif, fontSize: 'clamp(13px, 3.6cqw, 17px)' }} className="mt-3 text-[#334155]">
            Comprehensive Financial Planning for a Secure and Prosperous Future
          </p>

          <ul className="mt-5 grid w-full max-w-[560px] grid-cols-3 gap-x-1 gap-y-4 sm:grid-cols-6">
            {PLANNING_LINKS.map((l, i) => {
              const Icon = l.icon;
              return (
                <li key={l.to + i} className={i > 0 ? 'sm:border-l sm:border-[#C9922E]/30' : ''}>
                  <Link to={l.to} className="group flex flex-col items-center gap-1.5 rounded-xl px-0.5 py-1 outline-none transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#C9922E]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-[#1A3170] to-[#0F1F45] text-[#E2B24E] ring-2 ring-[#C9922E] shadow-[0_6px_16px_rgba(15,31,69,0.3)] transition-shadow group-hover:shadow-[0_10px_22px_rgba(201,146,46,0.5)]">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <span style={playfair} className="text-[11.5px] font-bold leading-tight text-[#0F1F45]">
                      {l.label[0]}
                      <span className="block">{l.label[1]}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      {/* strengths strip */}
      <div className="bg-gradient-to-r from-[#0C1C42] via-[#0F1F45] to-[#0C1C42]">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:px-8">
          {STRENGTHS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className={`flex items-center gap-3 lg:px-5 ${i > 0 ? 'lg:border-l lg:border-[#C9922E]/30' : ''}`}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2B24E] text-[#E2B24E]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p style={playfair} className="text-[14px] font-bold leading-tight text-white">{s.title}</p>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-slate-300">{s.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
