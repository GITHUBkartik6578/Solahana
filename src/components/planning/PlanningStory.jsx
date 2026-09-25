import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, FileText, Wallet, ShieldCheck, Target, Receipt, RefreshCw } from 'lucide-react';

/* ----------------------------------------------------------- */
/* What actually changes in a year                              */
/* ----------------------------------------------------------- */
const CHANGES = [
  { before: 'Money leaves and you’re not sure where.', after: 'You know exactly what goes where, every month.' },
  { before: 'Savings sit idle in the account till something comes up.', after: 'Savings move on their own, on salary day.' },
  { before: 'Five policies, no idea if the family is covered.', after: 'One clear answer on what your family gets, and when.' },
  { before: 'Tax-saving bought in a March panic.', after: 'Tax planned in April, around goals you already have.' },
  { before: '“We’ll think about the house next year.”', after: 'A date and an amount for the house, on paper.' },
  { before: 'A quiet worry you don’t talk about at home.', after: 'A plan your family can see and understand.' },
];

export function TwelveMonths() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#F7F8FB] border-y border-[#E4E8F0] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E8F0] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
            One year from now
          </span>
          <h2 className="mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
            Same salary. <span className="gold-gradient-text" style={{ display: 'inline' }}>Completely different feeling.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">
            Nothing dramatic happens. A few quiet things just stop being your problem.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#E4E8F0] shadow-[0_2px_8px_rgba(15,31,69,0.05),0_20px_50px_rgba(15,31,69,0.06)] overflow-hidden">
          <div className="grid grid-cols-2 text-[11px] font-bold uppercase tracking-[0.16em]">
            <p className="px-5 sm:px-8 py-4 text-[#8A96AB] bg-[#F7F8FB] border-b border-[#E4E8F0]">Today</p>
            <p className="px-5 sm:px-8 py-4 text-[#1A3170] bg-[#EEF2FB] border-b border-l border-[#E4E8F0]">After a year with a plan</p>
          </div>

          {CHANGES.map((c, i) => (
            <motion.div
              key={c.before}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="grid grid-cols-2"
            >
              <div className={`flex gap-3 px-5 sm:px-8 py-4 sm:py-5 ${i < CHANGES.length - 1 ? 'border-b border-[#EEF1F6]' : ''}`}>
                <X className="w-4 h-4 mt-0.5 text-[#C0C8D6] shrink-0" strokeWidth={3} />
                <p className="text-sm text-[#8A96AB] leading-snug">{c.before}</p>
              </div>
              <div className={`flex gap-3 px-5 sm:px-8 py-4 sm:py-5 border-l border-[#EEF1F6] bg-[#FBFCFE] ${i < CHANGES.length - 1 ? 'border-b' : ''}`}>
                <span className="w-4 h-4 mt-0.5 rounded-full bg-[#2F5BC7] text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5" strokeWidth={4} />
                </span>
                <p className="text-sm font-semibold text-[#0F1F45] leading-snug">{c.after}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* What you actually walk away with                             */
/* ----------------------------------------------------------- */
const DELIVERABLES = [
  { icon: FileText, title: 'Your written plan', desc: 'Not advice you half-remember from a call. A document with actions, amounts and dates.' },
  { icon: Wallet, title: 'A cash-flow map', desc: 'Where your money goes each month, and the exact amount that can go towards goals.' },
  { icon: ShieldCheck, title: 'An insurance review', desc: 'Every policy you own, checked: keep, stop, or top up, with the reason written down.' },
  { icon: Target, title: 'A goal sheet', desc: 'Each goal with its own amount, date and monthly number, so nothing competes.' },
  { icon: Receipt, title: 'A tax plan', desc: 'Old or new regime, and how your tax saving fits the goals you already have.' },
  { icon: RefreshCw, title: 'A review every year', desc: 'A raise, a baby, a new city: the plan gets updated instead of going stale.' },
];

export function WhatYouGet() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
            What you actually get
          </span>
          <h2 className="mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
            Six things you can <span className="gold-gradient-text" style={{ display: 'inline' }}>hold in your hand.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">
            A plan you can read, show your family, and follow without us in the room.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {DELIVERABLES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.08 }}
              className="group h-full rounded-3xl bg-[#F7F8FB] border border-[#E4E8F0] p-6 sm:p-7 hover:bg-white hover:border-[#CBD6EE] hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,31,69,0.10)] transition-all duration-300"
            >
              <span className="w-12 h-12 rounded-2xl bg-white shadow-[0_4px_12px_rgba(15,31,69,0.08)] flex items-center justify-center text-[#1A3170] group-hover:bg-[#1A3170] group-hover:text-[#E6C27A] transition-colors duration-300">
                <Icon className="w-6 h-6" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-[#0F1F45]">{title}</h3>
              <p className="mt-2 text-sm text-[#475569] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* Honesty builds more trust than promises                      */
/* ----------------------------------------------------------- */
const RIGHT_FIT = [
  'You want one plan instead of scattered products',
  'You’re ready to be honest about income, loans and spending',
  'You want things explained in plain language',
  'You’re planning for years, not for next quarter',
];
const WRONG_FIT = [
  'You want hot stock tips or quick multibagger calls',
  'You want someone to guarantee returns',
  'You want to time the market every few weeks',
  'You want a plan, but not the conversation behind it',
];

export function HonestFit() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-ink-band overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold uppercase tracking-[0.16em] text-[#E6C27A]">
            Being straight with you
          </span>
          <h2 className="mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold text-white leading-tight [text-wrap:balance]">
            We’re not the right fit for everyone.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#AEBBD3]">
            Better you know now than three months in.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          <div className="rounded-3xl bg-white/[0.06] border border-white/12 p-7">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#E6C27A]">We work well together if</h3>
            <ul className="mt-5 space-y-3.5">
              {RIGHT_FIT.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[15px] text-white leading-snug">
                  <span className="w-5 h-5 mt-0.5 rounded-full bg-[#C9A04F] text-[#0F1F45] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" strokeWidth={4} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-7">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#7F8DA8]">Probably not us if</h3>
            <ul className="mt-5 space-y-3.5">
              {WRONG_FIT.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[15px] text-[#AEBBD3] leading-snug">
                  <X className="w-4 h-4 mt-1 text-[#7F8DA8] shrink-0" strokeWidth={3} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/our-process"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 text-sm font-bold text-white hover:bg-white/10 transition-colors"
          >
            See exactly how we work <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
