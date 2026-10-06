import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Coins, Armchair, ShieldCheck, FileText, Users, GraduationCap, BarChart3 } from 'lucide-react';

import aboutPhoto from '../../assets/about-photo.webp';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const PLANNINGS = [
  { label: ['Financial', 'Planning'], to: '/financial-planning', icon: TrendingUp },
  { label: ['Investment', 'Planning'], to: '/investments', icon: Coins },
  { label: ['Retirement', 'Planning'], to: '/calculators/retirement', icon: Armchair },
  { label: ['Risk', 'Planning'], to: '/risk-management', icon: ShieldCheck },
  { label: ['Tax', 'Planning'], to: '/tax-planning', icon: FileText },
  { label: ['Estate', 'Planning'], to: '/estate-planning', icon: Users },
];

const STRENGTHS = [
  { icon: GraduationCap, title: 'Qualified & Experienced', text: 'Chartered Wealth Manager with 25+ years in financial services.' },
  { icon: BarChart3, title: 'Comprehensive Approach', text: 'Integrated planning across investments, risk, tax, retirement and estate planning.' },
  { icon: ShieldCheck, title: 'Ethical & Transparent', text: 'Client-first, unbiased and compliant financial planning.' },
  { icon: Users, title: 'Long-Term Partnership', text: 'Focused on your goals, priorities and financial well-being at every life stage.' },
];

export default function AboutHero() {
  return (
    <section
      className="relative bg-white pt-[80px]"
      aria-label="About SOLAHANA"
    >
      {/* whole hero fits one screen on desktop: viewport height minus the navbar */}
      <div className="grid grid-cols-1 lg:h-[clamp(520px,calc(100svh-80px),780px)] lg:grid-cols-[auto_1fr] lg:grid-rows-[minmax(0,1fr)_auto]">
        {/* photo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative h-[300px] overflow-hidden sm:h-[380px] lg:row-span-1 lg:h-full lg:aspect-[1331/1459]"
        >
          <img
            src={aboutPhoto}
            alt="Amit R. Pandey, Chartered Wealth Manager (CWM), at his desk"
            width="1331"
            height="1459"
            className="h-full w-full object-cover object-[60%_20%]"
            draggable="false"
          />
          <span className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-[#C9922E]/60 lg:block" />
        </motion.div>

        {/* details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-[#FBF7EE] to-[#F3E9D6] px-5 py-10 sm:px-8 lg:py-0"
        >
          <div className="w-full max-w-[760px] text-center">
            <h1 className="sr-only">About SOLAHANA: Amit R. Pandey, Chartered Wealth Manager (CWM)</h1>
            <p style={{ ...serif, fontSize: 'clamp(46px, 9.5vh, 92px)' }} className="font-black leading-none tracking-tight text-[#0F1F45]" aria-hidden="true">
              CWM<sup className="align-super text-[0.28em] font-bold">®</sup>
            </p>
            <p className="mt-2 font-sora text-[11px] font-semibold uppercase tracking-[0.34em] text-[#0F1F45] sm:text-[13px]">
              Chartered Wealth Manager
            </p>

            <div className="mx-auto mt-3 flex max-w-[420px] items-center gap-3">
              <span className="h-px flex-1 bg-[#C9922E]/70" />
              <span className="h-1.5 w-1.5 rotate-45 bg-[#C9922E]" />
              <span className="h-px flex-1 bg-[#C9922E]/70" />
            </div>

            <h2 style={{ ...serif, fontSize: 'clamp(30px, 6vh, 56px)' }} className="mt-3 font-bold leading-[1.05] text-[#0F1F45]">
              Amit R. Pandey
            </h2>
            <p style={serif} className="mt-1 text-[17px] font-bold text-[#0F1F45] sm:text-[19px]">
              Chartered Wealth Manager (CWM<sup className="text-[0.6em]">®</sup>)
            </p>
            <p className="mt-1.5 text-[13px] font-medium text-[#1E293B] sm:text-[15px]">
              MBA <span className="mx-1.5 text-[#C9922E]">|</span> Ex-Banker <span className="mx-1.5 text-[#C9922E]">|</span> 25+ Years of Experience in Financial Services
            </p>

            <span className="mx-auto mt-3 block h-px w-full max-w-[560px] bg-[#C9922E]/40" />
            <p style={serif} className="mt-3 text-[13px] text-[#334155] sm:text-[15px]">
              Comprehensive Financial Planning for a Secure and Prosperous Future
            </p>

            <ul className="mt-4 grid grid-cols-3 gap-x-1 gap-y-4 sm:grid-cols-6 sm:gap-x-0">
              {PLANNINGS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <li key={p.to} className={i > 0 ? 'sm:border-l sm:border-[#C9922E]/30' : ''}>
                    <Link
                      to={p.to}
                      className="group flex flex-col items-center gap-1.5 rounded-xl px-1 py-1.5 outline-none transition-transform duration-200 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#C9922E]"
                    >
                      <span
                        style={{ width: 'clamp(50px, 8.4vh, 72px)', height: 'clamp(50px, 8.4vh, 72px)' }}
                        className="flex items-center justify-center rounded-full bg-gradient-to-b from-[#1A3170] to-[#0F1F45] text-[#E2B24E] ring-2 ring-[#C9922E] shadow-[0_8px_18px_rgba(15,31,69,0.3)] transition-shadow duration-200 group-hover:shadow-[0_12px_26px_rgba(201,146,46,0.5)]"
                      >
                        <Icon className="h-1/2 w-1/2" strokeWidth={1.6} />
                      </span>
                      <span style={serif} className="text-[12px] font-bold leading-tight text-[#0F1F45] sm:text-[13px]">
                        {p.label[0]}
                        <span className="block">{p.label[1]}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        {/* strengths strip */}
        <div className="bg-gradient-to-r from-[#0C1C42] via-[#0F1F45] to-[#0C1C42] lg:col-span-2">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:px-8 lg:py-3.5">
            {STRENGTHS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className={`flex items-center gap-3 lg:px-5 ${i > 0 ? 'lg:border-l lg:border-[#C9922E]/30' : ''}`}>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2B24E] text-[#E2B24E]">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p style={serif} className="text-[14px] font-bold leading-tight text-white">{s.title}</p>
                    <p className="mt-0.5 text-[11.5px] leading-snug text-slate-300">{s.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
