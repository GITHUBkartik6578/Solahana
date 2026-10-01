import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Home,
  GraduationCap,
  ShieldCheck,
  Target,
  TrendingUp,
  Compass,
  ShieldAlert,
  Scroll,
  Route,
  Sunrise,
  Users,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Spine runs from the centre of the first stage node to the centre of the last one
// (7 equal-height rows inside a 1.25rem vertical padding)
const SPINE_INSET = {
  top: 'calc(1.25rem + (100% - 2.5rem) / 14)',
  bottom: 'calc(1.25rem + (100% - 2.5rem) / 14)',
};

// The three moments almost every Indian family lives through
const MOMENTS = [
  {
    when: 'A Tuesday night',
    quote: 'How much will the hospital need?',
    line: 'Nobody plans for the 2 a.m. call. The right health and term cover means your family worries about getting better, not about arranging money.',
    handledBy: 'Health & term cover',
    icon: ShieldCheck,
  },
  {
    when: 'One evening in June',
    quote: 'Papa, I got in.',
    line: 'She earned the seat. The fees shouldn’t decide whether she takes it. A fund started years earlier turns that evening into pure celebration.',
    handledBy: 'Education fund',
    icon: GraduationCap,
  },
  {
    when: 'The last day of the month',
    quote: 'The salary didn’t come this time.',
    line: 'After 35 years of working, the income stops but life doesn’t. A retirement plan keeps the money coming, so nothing about your lifestyle has to shrink.',
    handledBy: 'Retirement income',
    icon: Sunrise,
  },
];

export default function WhatIsFinancialPlanning() {
  // Ordered the way a planner actually sequences a plan: protect first, then grow, then secure & pass on
  const journeyMilestones = [
    { name: 'Emergency Fund', desc: '6 Months Shield', icon: ShieldAlert, phase: 'Foundation' },
    { name: 'Family Protection', desc: 'Term & Health Cover', icon: ShieldCheck },
    { name: 'Wealth Creation', desc: 'Disciplined SIPs', icon: TrendingUp, phase: 'Growth' },
    { name: 'Dream Home', desc: 'Down Payment Fund', icon: Home },
    { name: 'Child Education', desc: 'Higher Studies Fund', icon: GraduationCap },
    { name: 'Retirement FIRE', desc: 'Freedom Corpus', icon: Target, phase: 'Freedom & Legacy' },
    { name: 'Estate Planning', desc: 'Wills & Trust Legacy', icon: Scroll },
  ];

  return (
    <section className="relative z-10 py-8 sm:py-10 lg:py-12 bg-[#F7F8FB] border-t border-[#2F5BC7]/20 overflow-hidden">
      
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 left-10 w-[600px] h-[600px] bg-[#2F5BC7]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section heading — a plan is about people, not products */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            Why a plan matters
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[30px] sm:text-[40px] lg:text-[46px] font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-[1.15] [text-wrap:balance]"
          >
            A plan isn’t about money.
            <br />
            It’s about{' '}
            <span className="gold-gradient-text" style={{ display: 'inline' }}>the people you’d do anything for.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto"
          >
            Three moments come to almost every family. A plan decides how each one feels.
          </motion.p>
        </div>

        {/* Three moments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-14 sm:mb-16">
          {MOMENTS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.article
                key={m.quote}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="group relative flex flex-col h-full rounded-3xl bg-white border border-[#E4E8F0] p-7 sm:p-8 shadow-[0_2px_6px_rgba(15,31,69,0.05)] hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(15,31,69,0.10)] hover:border-[#CBD6EE] transition-all duration-300"
              >
                <span className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-[#C9A04F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8A96AB]">{m.when}</span>

                <p className="mt-4 text-[22px] sm:text-[24px] font-serif-luxury font-bold text-[#0F1F45] leading-snug">
                  “{m.quote}”
                </p>

                <p className="mt-4 text-[15px] text-[#475569] leading-relaxed flex-1">{m.line}</p>

                <div className="mt-7 pt-5 border-t border-[#EEF1F6] flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#EEF2FB] text-[#1A3170] flex items-center justify-center shrink-0 group-hover:bg-[#1A3170] group-hover:text-[#E6C27A] transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[11px] font-semibold text-[#8A96AB]">What handles it</span>
                    <span className="block text-sm font-bold text-[#0F1F45]">{m.handledBy}</span>
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-base sm:text-lg text-[#0F1F45] font-serif-luxury font-bold max-w-2xl mx-auto mb-12 sm:mb-14"
        >
          You can’t choose when these moments arrive.
          <span className="block text-[#2F5BC7] mt-1">You can choose to be ready for them.</span>
        </motion.p>

        {/* TWO-COLUMN LAYOUT WITH EQUAL HEIGHT STRETCH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* LEFT SIDE: LIFE MILESTONE WORKFLOW (matches right column height) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative h-full min-h-[600px] sm:min-h-[650px] lg:min-h-[670px] rounded-3xl bg-white border border-[#E4E8F0] shadow-[0_20px_50px_rgba(26,49,112,0.12)] flex flex-col overflow-hidden"
          >
            {/* Gold ribbon header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-gradient-to-r from-[#1A3170] via-[#1A3170] to-[#1A3170] shrink-0">
              <div className="text-xs font-serif-luxury font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4" />
                SOLAHANA Life Milestone Map
              </div>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-black/15 text-white font-sora font-semibold text-[10px] border border-white/30 uppercase tracking-wider">
                Integrated Strategy
              </span>
            </div>

            {/* Workflow body */}
            <div className="relative flex-1 flex flex-col px-4 sm:px-6 py-5">
              {/* Spine: faint track + gold fill that draws down on scroll */}
              <div className="absolute left-[34px] sm:left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-[#E4E8F0]" style={SPINE_INSET} />
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.2 }}
                className="absolute left-[34px] sm:left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#1A3170] via-[#1A3170] to-[#1A3170] origin-top"
                style={SPINE_INSET}
              />

              {journeyMilestones.map((m, idx) => {
                const IconComponent = m.icon;
                const isLeft = idx % 2 === 0;
                return (
                  <div
                    key={m.name}
                    className="relative flex-1 grid grid-cols-[40px_1fr] sm:grid-cols-[1fr_56px_1fr] items-center gap-x-3 sm:gap-x-0 group"
                  >
                    {/* Stage node on the spine */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.3 + idx * 0.15 }}
                      className="col-start-1 sm:col-start-2 row-start-1 justify-self-center relative z-10 w-9 h-9 rounded-full bg-white border-2 border-[#2F5BC7] text-[#1A3170] font-num font-bold text-xs flex items-center justify-center shadow-[0_0_0_5px_rgba(26,49,112,0.12)] group-hover:bg-[#0F1F45] group-hover:border-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors duration-300"
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </motion.div>

                    {/* Milestone card */}
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -16 : 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: 0.35 + idx * 0.15 }}
                      className={`col-start-2 row-start-1 ${
                        isLeft ? 'sm:col-start-1 sm:justify-self-end sm:mr-3' : 'sm:col-start-3 sm:justify-self-start sm:ml-3'
                      } w-full sm:w-[212px]`}
                    >
                      <div className="relative flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-[#E4E8F0] shadow-[0_6px_16px_rgba(26,49,112,0.10)] group-hover:bg-[#0F1F45] group-hover:border-[#0F1F45] group-hover:shadow-[0_12px_28px_rgba(15,23,42,0.25)] group-hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1A3170] via-[#1A3170] to-[#1A3170] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <IconComponent className="w-[18px] h-[18px]" />
                        </div>
                        <div className="min-w-0 text-left">
                          {m.phase && (
                            <div className="sm:hidden text-[9px] font-sora font-bold uppercase tracking-widest text-[#2F5BC7] leading-none mb-1">
                              {m.phase}
                            </div>
                          )}
                          <div className="text-[13px] font-semibold text-[#0F1F45] group-hover:text-white leading-tight transition-colors whitespace-nowrap">
                            {m.name}
                          </div>
                          <div className="text-[11px] text-[#64748B] group-hover:text-[#2F5BC7] leading-tight mt-0.5 transition-colors whitespace-nowrap">
                            {m.desc}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Phase label in the empty half of the row (desktop) */}
                    {m.phase && (
                      <div
                        className={`hidden sm:block row-start-1 ${
                          isLeft ? 'col-start-3 ml-4 text-left' : 'col-start-1 mr-4 text-right'
                        }`}
                      >
                        <div className="text-[9px] font-sora font-bold uppercase tracking-[0.2em] text-[#8A96AB]">
                          Phase {m.phase === 'Foundation' ? '01' : m.phase === 'Growth' ? '02' : '03'}
                        </div>
                        <div className="text-xs font-serif-luxury font-bold text-[#1A3170]">
                          {m.phase}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#E4E8F0] text-center text-xs text-[#64748B] font-sora shrink-0">
              One plan that grows with you, stage by stage.
            </div>
          </motion.div>

          {/* RIGHT SIDE: gateways to the dedicated pages (full details live there) */}
          <div className="lg:col-span-6 grid gap-5 content-stretch">
            {[
              {
                to: '/our-process',
                eyebrow: 'Our Process',
                title: 'How we build your plan',
                desc: 'Five clear steps, from a free intro call to yearly reviews. No surprises along the way.',
                items: ['Intro conversation', 'Detailed discussion', 'Financial review', 'Your written plan', 'Action & reviews'],
                numbered: true,
                icon: Route,
              },
              {
                to: '/who-we-serve',
                eyebrow: 'Who We Serve',
                title: 'Built around your life stage',
                desc: 'Salaried, business owners, families, NRIs, young professionals and retirees.',
                items: ['Salaried Professionals', 'Business Owners', 'Families', 'NRI Families', 'Young Professionals', 'Retirees'],
                numbered: false,
                icon: Users,
              },
            ].map((c, idx) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.to}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link
                    to={c.to}
                    className="group flex flex-col h-full p-6 sm:p-7 rounded-3xl bg-white border border-[#E4E8F0] shadow-[0_1px_2px_rgba(15,31,69,0.04),0_12px_32px_rgba(15,31,69,0.06)] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,31,69,0.10)] transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl bg-[#1A3170] text-white flex items-center justify-center ring-4 ring-[#C9A04F]/15">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">{c.eyebrow}</span>
                    </div>
                    <h3 className="mt-4 text-xl sm:text-2xl font-bold text-[#0F1F45]">{c.title}</h3>
                    <p className="mt-2 text-sm text-[#475569] leading-relaxed">{c.desc}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {c.items.map((it, i) => (
                        <li key={it} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F8FB] border border-[#E4E8F0] text-xs font-semibold text-[#0F1F45]">
                          {c.numbered && <span className="text-[#C9A04F] font-bold">{i + 1}</span>}
                          {it}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1A3170] group-hover:text-[#2F5BC7] transition-colors">
                      {c.to === '/our-process' ? 'See the full process' : 'Find where you fit'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>

    </section>
  );
}
