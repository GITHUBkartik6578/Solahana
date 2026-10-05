import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  X,
  Target,
  Wallet,
  Scale,
  PieChart,
  Gauge,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Layers,
  Receipt,
  Hourglass,
  HeartHandshake,
  User,
  Users,
  Briefcase,
  CreditCard,
  CalendarClock,
  Landmark,
  Percent,
  Globe,
  FileText,
  ClipboardList,
  Search,
  PlayCircle,
  Lock,
  MessageSquareText,
  Ear,
  BarChart3,
  LineChart,
  Coins,
  Building2,
  Gem,
  PiggyBank,
  Sparkles,
  Smile,
} from 'lucide-react';

/* ----------------------------------------------------------- */
/* Shared pieces                                                */
/* ----------------------------------------------------------- */
export function SectionHead({ eyebrow, title, accent, sub, dark = false, align = 'center' }) {
  const centered = align === 'center';
  return (
    <div className={`max-w-2xl mb-10 sm:mb-14 ${centered ? 'mx-auto text-center' : ''}`}>
      <span
        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] ${
          dark ? 'bg-white/10 border border-white/15 text-[#E6C27A]' : 'bg-[#EEF2FB] text-[#2F5BC7]'
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold leading-tight [text-wrap:balance] ${
          dark ? 'text-white' : 'text-[#0F1F45]'
        }`}
      >
        {title}{' '}
        {accent && (
          <span className={dark ? 'text-[#E6C27A]' : 'gold-gradient-text'} style={{ display: 'inline' }}>
            {accent}
          </span>
        )}
      </h2>
      {sub && <p className={`mt-4 text-base sm:text-lg ${dark ? 'text-[#AEBBD3]' : 'text-[#475569]'}`}>{sub}</p>}
    </div>
  );
}

const rise = (i = 0, step = 0.07) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.42, delay: i * step },
});

/* ----------------------------------------------------------- */
/* 1. What is financial planning?                               */
/* ----------------------------------------------------------- */
const DEFINITION_POINTS = [
  { title: 'Goals first, products later', desc: 'We begin with what you want your money to do, then pick the tools that fit.' },
  { title: 'Everything in one view', desc: 'Income, loans, insurance, savings and taxes are looked at together, not in pieces.' },
  { title: 'A living document', desc: 'Your plan is updated as life moves: a new job, a child, a move, a windfall.' },
];

export function WhatIsFinancialPlanning() {
  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
        <motion.div {...rise()} className="flex flex-col justify-center">
          <SectionHead
            align="left"
            eyebrow="What is financial planning?"
            title="A clear route from"
            accent="where you are to where you want to be."
          />
          <p className="-mt-4 text-base sm:text-lg text-[#334155] leading-relaxed">
            Financial planning is the habit of matching what you earn and own with what you want from life, and
            writing down exactly how you’ll get there. It answers three simple questions: what do I have, what do I
            need, and what should I do this month to close the gap?
          </p>
          <ul className="mt-7 space-y-4">
            {DEFINITION_POINTS.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#1A3170] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-bold text-[#0F1F45]">{p.title}</p>
                  <p className="text-sm text-[#475569] leading-relaxed">{p.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Visual: today → plan → tomorrow */}
        <motion.div {...rise(1)} className="flex flex-col justify-between rounded-3xl bg-[#F7F8FB] border border-[#E4E8F0] p-6 sm:p-8 lg:max-w-[560px] lg:w-full lg:justify-self-end">
          {[
            { tag: 'Where you are', title: 'Today', items: ['Salary & savings', 'Loans & EMIs', 'Policies you hold'], tone: 'muted' },
            { tag: 'The bridge', title: 'Your plan', items: ['Monthly amounts', 'Right cover', 'Tax-smart choices'], tone: 'brand' },
            { tag: 'Where you want to be', title: 'Your goals', items: ['Home & education', 'Retirement income', 'A legacy for family'], tone: 'gold' },
          ].map((b, i, arr) => (
            <React.Fragment key={b.title}>
              <div
                className={`flex-1 flex flex-col justify-center rounded-2xl p-5 sm:p-6 ${
                  b.tone === 'brand'
                    ? 'bg-[#1A3170] text-white shadow-[0_14px_34px_rgba(26,49,112,0.25)]'
                    : 'bg-white border border-[#E4E8F0]'
                }`}
              >
                <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${b.tone === 'brand' ? 'text-[#E6C27A]' : b.tone === 'gold' ? 'text-[#C9A04F]' : 'text-[#8A96AB]'}`}>
                  {b.tag}
                </p>
                <p className={`mt-1 text-lg font-bold ${b.tone === 'brand' ? 'text-white' : 'text-[#0F1F45]'}`}>{b.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {b.items.map((it) => (
                    <span
                      key={it}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        b.tone === 'brand' ? 'bg-white/12 text-white' : 'bg-[#F1F4FA] text-[#334155]'
                      }`}
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="w-5 h-5 rotate-90 text-[#9AA9C7]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 2. Key elements of financial planning                        */
/* ----------------------------------------------------------- */
const ELEMENTS = [
  { icon: Target, title: 'Clear goals', desc: 'Each goal gets a name, a target amount and a date, so it can be planned for properly.' },
  { icon: Scale, title: 'Net worth snapshot', desc: 'What you own minus what you owe. The honest starting line for every decision.' },
  { icon: Wallet, title: 'Cash flow', desc: 'Where the salary goes each month, and how much can be set aside for goals.' },
  { icon: Gauge, title: 'Risk profile', desc: 'How much ups and downs you can handle, both on paper and in your sleep.' },
  { icon: PieChart, title: 'Asset allocation', desc: 'The mix of equity, debt, gold and cash that suits each goal’s timeline.' },
  { icon: RefreshCw, title: 'Regular review', desc: 'Check-ins that keep the plan in step with your life and the markets.' },
];

export function KeyElements() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Key elements"
          title="Six building blocks"
          accent="every good plan stands on."
          sub="Before any product is discussed, these six pieces are put in place."
        />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ELEMENTS.map(({ icon: Icon, title, desc }, i) => (
            <motion.li
              key={title}
              {...rise(i % 3)}
              className="relative h-full rounded-3xl bg-[#F7F8FB] border border-[#E4E8F0] p-6 sm:p-7 hover:bg-white hover:border-[#CBD6EE] hover:shadow-[0_18px_40px_rgba(15,31,69,0.08)] transition-all duration-300"
            >
              <span className="absolute top-6 right-6 text-[40px] leading-none font-serif-luxury font-bold text-[#E4E8F0]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="relative w-12 h-12 rounded-2xl bg-white shadow-[0_4px_12px_rgba(15,31,69,0.08)] flex items-center justify-center text-[#1A3170]">
                <Icon className="w-6 h-6" strokeWidth={1.75} />
              </span>
              <h3 className="relative mt-5 text-lg font-bold text-[#0F1F45]">{title}</h3>
              <p className="relative mt-2 text-sm text-[#475569] leading-relaxed">{desc}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 3. Why is financial planning important?                      */
/* ----------------------------------------------------------- */
const REASONS = [
  { icon: TrendingUp, title: 'Rising prices', desc: 'Money left idle loses value every year. A plan makes sure savings grow faster than costs.' },
  { icon: ShieldCheck, title: 'Life’s surprises', desc: 'A job loss or a hospital bill shouldn’t undo years of saving. Planning builds the cushion first.' },
  { icon: Layers, title: 'Goals that compete', desc: 'Home, education and retirement all want the same salary. A plan decides what gets funded when.' },
  { icon: Receipt, title: 'Tax that leaks', desc: 'Last-minute tax saving often buys the wrong thing. Planned early, it supports your goals.' },
  { icon: Hourglass, title: 'Longer retirements', desc: 'People now live 20–30 years after work. That income has to be built well in advance.' },
  { icon: HeartHandshake, title: 'Peace of mind', desc: 'Knowing the numbers removes the quiet worry, and lets the family talk about money openly.' },
];

export function WhyPlanningImportant() {
  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Why it’s important"
          title="Without a plan, money still moves."
          accent="Just not where you meant it to."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Inflation callout */}
          <motion.div {...rise()} className="lg:col-span-4 rounded-3xl bg-ink-band p-7 sm:p-8 text-white overflow-hidden">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#E6C27A]">The quiet cost of waiting</p>
            <p className="mt-5 text-sm text-[#AEBBD3]">What ₹1,00,000 of expenses today could cost in 10 years at 6% inflation</p>
            <p className="mt-2 text-[44px] leading-none font-serif-luxury font-bold">₹1,79,000</p>
            <div className="mt-6 space-y-3">
              {[
                { label: 'Today', pct: 56, val: '₹1.00 L' },
                { label: 'In 10 years', pct: 100, val: '₹1.79 L' },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs text-[#AEBBD3]">
                    <span>{b.label}</span>
                    <span className="font-semibold text-white">{b.val}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#C9A04F] to-[#E6C27A]" style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-[#7F8DA8]">Illustration only. Actual inflation varies year to year.</p>
          </motion.div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REASONS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                {...rise(i % 2)}
                className="flex gap-4 rounded-2xl border border-[#E4E8F0] bg-[#FBFCFE] p-5"
              >
                <span className="w-10 h-10 rounded-xl bg-white shadow-[0_4px_12px_rgba(15,31,69,0.08)] flex items-center justify-center text-[#1A3170] shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="font-bold text-[#0F1F45]">{title}</h3>
                  <p className="mt-1 text-sm text-[#475569] leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 4. Factors affecting financial planning                      */
/* ----------------------------------------------------------- */
const PERSONAL_FACTORS = [
  { icon: User, title: 'Age & life stage', desc: 'A 28-year-old and a 52-year-old need very different mixes.' },
  { icon: Briefcase, title: 'Income & job stability', desc: 'Steady salary, business income or variable pay change how much risk is sensible.' },
  { icon: Users, title: 'Dependents', desc: 'Children, parents or a non-earning spouse raise the need for cover and buffers.' },
  { icon: CreditCard, title: 'Existing loans', desc: 'Home, car and personal loans decide how much is free to invest.' },
  { icon: Gauge, title: 'Comfort with risk', desc: 'How you react when markets fall matters as much as returns.' },
  { icon: CalendarClock, title: 'Time to each goal', desc: 'Money needed in 3 years sits very differently from money needed in 20.' },
];
const OUTSIDE_FACTORS = [
  { icon: Percent, title: 'Inflation', desc: 'Sets how fast your savings must grow just to stand still.' },
  { icon: Landmark, title: 'Interest rates', desc: 'Move EMIs, deposit returns and bond prices.' },
  { icon: Receipt, title: 'Tax rules', desc: 'Old vs new regime and changes in each Budget.' },
  { icon: Globe, title: 'Markets & economy', desc: 'Cycles that the plan is built to ride through, not react to.' },
];

export function FactorsAffectingPlanning() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#F7F8FB] border-y border-[#E4E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Factors that shape your plan"
          title="No two plans look alike,"
          accent="because no two lives do."
          sub="Some factors are about you, some are about the world around you. A good plan accounts for both."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div {...rise()} className="lg:col-span-7 rounded-3xl bg-white border border-[#E4E8F0] p-6 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#1A3170]">About you</h3>
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {PERSONAL_FACTORS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex gap-3">
                  <Icon className="w-5 h-5 mt-0.5 text-[#2F5BC7] shrink-0" strokeWidth={1.75} />
                  <div>
                    <p className="font-bold text-[#0F1F45] text-[15px]">{title}</p>
                    <p className="mt-0.5 text-sm text-[#475569] leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...rise(1)} className="lg:col-span-5 rounded-3xl bg-[#1A3170] p-6 sm:p-8 text-white">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#E6C27A]">The world around you</h3>
            <ul className="mt-5 space-y-5">
              {OUTSIDE_FACTORS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex gap-3">
                  <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[#E6C27A]" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-bold text-[15px]">{title}</p>
                    <p className="mt-0.5 text-sm text-[#C9D3E6] leading-relaxed">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 5. The financial planning process, step by step              */
/* ----------------------------------------------------------- */
const PROCESS = [
  { icon: Target, title: 'Set your goals', desc: 'We list what matters to you and put a cost and a date against each one.', out: 'A goal sheet' },
  { icon: ClipboardList, title: 'Gather the facts', desc: 'Income, expenses, loans, policies and investments, collected through a simple checklist.', out: 'Your complete picture' },
  { icon: Search, title: 'Study where you stand', desc: 'We check net worth, cash flow, cover and portfolio, and spot gaps and overlaps.', out: 'A gap report' },
  { icon: FileText, title: 'Build the plan', desc: 'Monthly amounts, the right mix of assets, insurance and tax steps, all tied to goals.', out: 'Your written plan' },
  { icon: PlayCircle, title: 'Put it into action', desc: 'SIPs are set up, cover is fixed and old clutter is cleaned up, one step at a time.', out: 'A plan that’s running' },
  { icon: RefreshCw, title: 'Review and adjust', desc: 'We meet at least once a year, and whenever life changes, to keep things on track.', out: 'A plan that stays current' },
];

export function PlanningProcessGuide() {
  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[110px]">
            <SectionHead
              align="left"
              eyebrow="The process"
              title="Financial planning,"
              accent="one step at a time."
              sub="Six steps, done in order. Each one ends with something you can see and keep."
            />
            <Link
              to="/our-process"
              className="-mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#2F5BC7] hover:gap-3 transition-all"
            >
              See our full process <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <ol className="lg:col-span-7 relative">
          <span className="absolute left-[23px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#CBD6EE] via-[#E4E8F0] to-transparent" aria-hidden="true" />
          {PROCESS.map(({ icon: Icon, title, desc, out }, i) => (
            <motion.li key={title} {...rise(0)} className="relative flex gap-5 pb-8 last:pb-0">
              <span className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-[#CBD6EE] flex items-center justify-center text-[#1A3170] shrink-0 shadow-[0_6px_16px_rgba(15,31,69,0.08)]">
                <Icon className="w-5 h-5" strokeWidth={1.75} />
              </span>
              <div className="flex-1 rounded-2xl border border-[#E4E8F0] bg-[#FBFCFE] p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C9A04F]">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-bold text-[#0F1F45]">{title}</h3>
                <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{desc}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#EEF2FB] px-3 py-1 text-xs font-semibold text-[#1A3170]">
                  <Check className="w-3 h-3" strokeWidth={3} /> You get: {out}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 6. How planning helps restructure a portfolio                */
/* ----------------------------------------------------------- */
const MIX = {
  before: [
    { label: 'Savings & FDs', pct: 50, color: '#9AA9C7' },
    { label: 'Insurance-cum-investment', pct: 20, color: '#C0C8D6' },
    { label: 'Equity', pct: 20, color: '#2F5BC7' },
    { label: 'Scattered funds', pct: 10, color: '#DCE3F0' },
  ],
  after: [
    { label: 'Equity funds', pct: 55, color: '#1A3170' },
    { label: 'Debt & bonds', pct: 25, color: '#2F5BC7' },
    { label: 'Gold', pct: 10, color: '#C9A04F' },
    { label: 'Emergency fund', pct: 10, color: '#9AA9C7' },
  ],
};
const RESTRUCTURE_STEPS = [
  { title: 'Clear the clutter', desc: 'Merge overlapping funds and close accounts that no longer serve a goal.' },
  { title: 'Fix the mix', desc: 'Rebalance equity, debt and gold to match each goal’s timeline and your comfort with risk.' },
  { title: 'Separate cover from investing', desc: 'Pure term and health cover for protection, and investments for growth.' },
  { title: 'Cut hidden costs', desc: 'Move away from high-charge products where it makes sense to.' },
  { title: 'Switch with tax in mind', desc: 'Time exits to use exemptions and avoid needless capital gains tax.' },
];

function MixBar({ title, rows }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#64748B]">{title}</p>
      <div className="mt-2 flex h-4 overflow-hidden rounded-full">
        {rows.map((r) => (
          <span key={r.label} style={{ width: `${r.pct}%`, background: r.color }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2 text-xs text-[#475569]">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: r.color }} />
            {r.label} <span className="ml-auto font-semibold text-[#0F1F45]">{r.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PortfolioRestructuring() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#EEF3FB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Restructuring portfolios"
          title="Already investing?"
          accent="Planning puts it in order."
          sub="Most portfolios grow by accident: a policy here, a tip there. Planning turns that collection into a structure with a purpose."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <motion.div {...rise()} className="rounded-3xl bg-white border border-[#C9D6EE] p-6 sm:p-8 shadow-[0_10px_28px_rgba(26,49,112,0.08)] space-y-7">
            <MixBar title="Before: built by accident" rows={MIX.before} />
            <div className="flex items-center gap-3 text-[#2F5BC7]">
              <span className="h-px flex-1 bg-[#E4E8F0]" />
              <ArrowRight className="w-4 h-4 rotate-90" />
              <span className="h-px flex-1 bg-[#E4E8F0]" />
            </div>
            <MixBar title="After: built for your goals" rows={MIX.after} />
            <p className="text-xs text-[#8A96AB]">Illustrative example for a 35-year-old with long-term goals. Your mix depends on your plan.</p>
          </motion.div>

          <ol className="space-y-3">
            {RESTRUCTURE_STEPS.map((s, i) => (
              <motion.li key={s.title} {...rise(i, 0.06)} className="flex gap-4 rounded-2xl bg-white border border-[#E4E8F0] p-5">
                <span className="w-9 h-9 rounded-full bg-[#1A3170] text-white text-sm font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div>
                  <h3 className="font-bold text-[#0F1F45]">{s.title}</h3>
                  <p className="mt-1 text-sm text-[#475569] leading-relaxed">{s.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 7. Investment instruments used in financial planning         */
/* ----------------------------------------------------------- */
const INSTRUMENT_GROUPS = [
  {
    key: 'growth',
    label: 'Growth',
    items: [
      { icon: LineChart, name: 'Mutual funds', use: 'Long-term goals through SIPs', risk: 'Moderate to high', to: '/invest/mutual-funds' },
      { icon: BarChart3, name: 'Direct equity', use: 'Wealth creation over 7+ years', risk: 'High', to: '/invest/domestic-equity' },
      { icon: Globe, name: 'International equity', use: 'Spreading beyond India', risk: 'High', to: '/invest/international-equity' },
      { icon: Sparkles, name: 'IPOs', use: 'A small slice for new listings', risk: 'High', to: '/invest/ipo' },
    ],
  },
  {
    key: 'stability',
    label: 'Stability',
    items: [
      { icon: Coins, name: 'Bonds', use: 'Regular income, lower swings', risk: 'Low to moderate', to: '/invest/bonds' },
      { icon: Landmark, name: 'Fixed deposits', use: 'Short-term goals and buffers', risk: 'Low' },
      { icon: PiggyBank, name: 'PPF', use: 'Tax-free, long-term savings', risk: 'Low' },
      { icon: Wallet, name: 'Liquid & debt funds', use: 'Emergency fund and parking money', risk: 'Low' },
    ],
  },
  {
    key: 'retirement',
    label: 'Retirement',
    items: [
      { icon: Hourglass, name: 'NPS', use: 'Retirement corpus with tax benefits', risk: 'Moderate' },
      { icon: Briefcase, name: 'EPF & VPF', use: 'Salary-linked retirement savings', risk: 'Low' },
      { icon: TrendingUp, name: 'Retirement-focused funds', use: 'Long horizon, steady discipline', risk: 'Moderate' },
    ],
  },
  {
    key: 'diversifiers',
    label: 'Diversifiers',
    items: [
      { icon: Gem, name: 'Gold ETFs & funds', use: 'A hedge when markets fall', risk: 'Moderate' },
      { icon: Building2, name: 'Real estate', use: 'Home ownership and rental income', risk: 'Moderate' },
      { icon: ShieldCheck, name: 'Term & health cover', use: 'Protection, not returns', risk: 'Protection' },
    ],
  },
];

export function InvestmentInstruments() {
  const [tab, setTab] = useState(INSTRUMENT_GROUPS[0].key);
  const group = INSTRUMENT_GROUPS.find((g) => g.key === tab);

  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Investment instruments"
          title="The tools a plan is"
          accent="built with."
          sub="Each instrument has a job. The plan decides which ones you need, how much, and for which goal."
        />

        <div role="tablist" aria-label="Instrument groups" className="flex flex-wrap justify-center gap-2 mb-8">
          {INSTRUMENT_GROUPS.map((g) => (
            <button
              key={g.key}
              role="tab"
              type="button"
              aria-selected={tab === g.key}
              onClick={() => setTab(g.key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                tab === g.key ? 'bg-[#1A3170] text-white' : 'bg-[#F1F4FA] text-[#475569] hover:bg-[#E4EAF5]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          role="tabpanel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {group.items.map(({ icon: Icon, name, use, risk, to }) => {
            const body = (
              <>
                <span className="w-11 h-11 rounded-2xl bg-[#EEF2FB] flex items-center justify-center text-[#1A3170] group-hover:bg-[#1A3170] group-hover:text-[#E6C27A] transition-colors">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-bold text-[#0F1F45]">{name}</h3>
                <p className="mt-1 text-sm text-[#475569] leading-relaxed">{use}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#F7F8FB] border border-[#E4E8F0] px-2.5 py-0.5 text-[11px] font-semibold text-[#64748B]">
                    Risk: {risk}
                  </span>
                  {to && <ArrowRight className="w-4 h-4 text-[#2F5BC7] transition-transform group-hover:translate-x-1" />}
                </div>
              </>
            );
            const cls = 'group flex h-full flex-col rounded-2xl border border-[#E4E8F0] bg-white p-5 transition-all duration-300';
            return to ? (
              <Link key={name} to={to} className={`${cls} hover:-translate-y-0.5 hover:border-[#CBD6EE] hover:shadow-[0_14px_32px_rgba(15,31,69,0.08)]`}>
                {body}
              </Link>
            ) : (
              <div key={name} className={cls}>
                {body}
              </div>
            );
          })}
        </motion.div>

        <p className="mt-6 text-center text-xs text-[#8A96AB]">
          Shown for understanding only. The right instruments for you come out of your plan, not a list.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 8. Benefits of financial planning                            */
/* ----------------------------------------------------------- */
const BENEFITS = [
  { icon: Target, title: 'Goals with dates', desc: 'Dreams turn into amounts and deadlines you can track.' },
  { icon: Wallet, title: 'Control over cash flow', desc: 'You know what to spend, save and invest each month.' },
  { icon: ShieldCheck, title: 'A family that’s protected', desc: 'The right cover, so one bad event doesn’t undo everything.' },
  { icon: Receipt, title: 'Lower tax, legally', desc: 'Deductions and regimes used with a purpose, not in a rush.' },
  { icon: TrendingUp, title: 'Steadier growth', desc: 'A mix that suits you, so you stay invested through cycles.' },
  { icon: CreditCard, title: 'Debt under control', desc: 'A clear order for paying off loans and avoiding new ones.' },
  { icon: Hourglass, title: 'A retirement you can count on', desc: 'Income planned for the years after work, not hoped for.' },
  { icon: Smile, title: 'Less money stress', desc: 'Fewer surprises, better decisions, calmer conversations at home.' },
];

export function PlanningBenefitsGrid() {
  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Benefits"
          title="What a plan"
          accent="does for you."
          sub="Eight changes people notice once their money has a plan behind it."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-3xl border border-[#E4E8F0] bg-[#E4E8F0]">
          {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} {...rise(i % 4, 0.05)} className="bg-white p-6 sm:p-7 hover:bg-[#FBFCFE] transition-colors">
              <Icon className="w-6 h-6 text-[#2F5BC7]" strokeWidth={1.75} />
              <h3 className="mt-4 font-bold text-[#0F1F45]">{title}</h3>
              <p className="mt-1.5 text-sm text-[#475569] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 9. Why Solahana?                                             */
/* ----------------------------------------------------------- */
const WHY_US = [
  { icon: Target, title: 'Goals before products', desc: 'Nothing is suggested until we know what it is for.' },
  { icon: Layers, title: 'One connected plan', desc: 'Investments, cover, tax and estate planned together.' },
  { icon: MessageSquareText, title: 'Plain language', desc: 'No jargon. Every number in your plan is explained.' },
  { icon: Lock, title: 'Your data stays private', desc: 'Shared only with the people working on your plan.' },
  { icon: RefreshCw, title: 'Reviewed every year', desc: 'Your plan keeps up as your life changes.' },
];

export function WhySolahanaPlanning() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#F7F8FB] border-y border-[#E4E8F0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Why Solahana?"
          title="Because you deserve a plan,"
          accent="not just a product."
          sub="What planning with Solahana looks like, in five promises we keep."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {WHY_US.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              {...rise(i, 0.06)}
              className="group h-full rounded-3xl bg-gradient-to-b from-[#1A3170] to-[#0F1F45] p-6 sm:last:col-span-2 lg:last:col-span-1 text-white shadow-[0_16px_36px_rgba(15,31,69,0.18)] hover:-translate-y-1 transition-transform duration-300"
            >
              <span className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Icon className="w-5 h-5 text-[#E6C27A]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-[17px] font-bold leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-[#C9D3E6] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 10. Who is a financial planner?                              */
/* ----------------------------------------------------------- */
const PLANNER_ROLES = [
  { icon: Ear, title: 'Listens', desc: 'Understands your family, work, worries and goals first.' },
  { icon: Search, title: 'Analyses', desc: 'Studies your numbers to find gaps, overlaps and risks.' },
  { icon: FileText, title: 'Plans', desc: 'Writes a clear, goal-linked plan with amounts and dates.' },
  { icon: Users, title: 'Stays with you', desc: 'Reviews and adjusts the plan as your life moves on.' },
];
const COMPARE = [
  { topic: 'Starts with', planner: 'Your goals', seller: 'A product to sell' },
  { topic: 'Looks at', planner: 'Your whole financial life', seller: 'One need at a time' },
  { topic: 'Measures success by', planner: 'Goals reached', seller: 'Products sold' },
  { topic: 'After the first meeting', planner: 'Regular reviews', seller: 'The next pitch' },
];

export function WhoIsFinancialPlanner() {
  return (
    <section className="relative py-14 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Who is a financial planner?"
          title="A partner for your money,"
          accent="over the long run."
          sub="A financial planner looks at your entire financial life and helps you make decisions that fit your goals, today and as things change."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLANNER_ROLES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} {...rise(i % 2)} className="rounded-2xl bg-[#F7F8FB] border border-[#E4E8F0] p-5">
                <span className="w-10 h-10 rounded-xl bg-white shadow-[0_4px_12px_rgba(15,31,69,0.08)] flex items-center justify-center text-[#1A3170]">
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-bold text-[#0F1F45]">{title}</h3>
                <p className="mt-1 text-sm text-[#475569] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...rise(1)} className="rounded-3xl border border-[#E4E8F0] overflow-hidden shadow-[0_2px_8px_rgba(15,31,69,0.05),0_20px_50px_rgba(15,31,69,0.06)]">
            <div className="grid grid-cols-[1.1fr_1fr_1fr] text-[11px] font-bold uppercase tracking-[0.14em]">
              <p className="px-4 sm:px-5 py-4 bg-[#F7F8FB] text-[#8A96AB]">&nbsp;</p>
              <p className="px-4 sm:px-5 py-4 bg-[#1A3170] text-white">A planner</p>
              <p className="px-4 sm:px-5 py-4 bg-[#F7F8FB] text-[#8A96AB]">A product seller</p>
            </div>
            {COMPARE.map((r, i) => (
              <div key={r.topic} className={`grid grid-cols-[1.1fr_1fr_1fr] text-sm ${i < COMPARE.length - 1 ? 'border-b border-[#EEF1F6]' : ''}`}>
                <p className="px-4 sm:px-5 py-4 font-semibold text-[#334155]">{r.topic}</p>
                <p className="px-4 sm:px-5 py-4 bg-[#F4F7FD] font-semibold text-[#0F1F45] flex gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-[#2F5BC7] shrink-0" strokeWidth={3} />
                  {r.planner}
                </p>
                <p className="px-4 sm:px-5 py-4 text-[#8A96AB] flex gap-2">
                  <X className="w-4 h-4 mt-0.5 text-[#C0C8D6] shrink-0" strokeWidth={3} />
                  {r.seller}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
