import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { scrollToConsultation } from '../../utils/consultation';

// The sentences people actually say about their money, and what a plan does about each one.
const WORRIES = [
  {
    said: 'I earn well, but I don’t know where it all goes.',
    who: 'The one most people start with',
    answer: {
      headline: 'You get a clear picture of your money, first.',
      body: 'Before anything is bought or sold, we map every rupee: what comes in, what goes out, what’s left. Most people find money they didn’t know they had.',
      points: ['A month-by-month cash-flow map', 'The leaks, named honestly', 'A savings amount that fits your life'],
    },
  },
  {
    said: 'I have five policies and I’m not sure why.',
    who: 'Bought in a March rush',
    answer: {
      headline: 'We check what you already own, before selling you anything.',
      body: 'Most families are over-insured in the wrong places and under-covered where it matters. We review every policy you hold and tell you what to keep, what to stop, and what’s missing.',
      points: ['A policy-by-policy review', 'Cover sized to your family', 'No product pushed on you'],
    },
  },
  {
    said: 'I keep meaning to start investing. It’s been two years.',
    who: 'Waiting for the “right time”',
    answer: {
      headline: 'We make starting the easiest part.',
      body: 'No jargon, no 40 fund options. You get a small number of choices that match your goals and how much risk actually lets you sleep, set up on your salary date.',
      points: ['SIPs that run automatically', 'Linked to real goals, not trends', 'Reviewed every year'],
    },
  },
  {
    said: 'What happens to my family if something happens to me?',
    who: 'The question nobody says out loud',
    answer: {
      headline: 'We plan for the worst so you can stop imagining it.',
      body: 'The right term cover, health cover for your family and parents, and an emergency fund that means a hard month stays just a hard month.',
      points: ['Term cover that replaces your income', 'Health cover for city hospital costs', '6 months of expenses, liquid'],
    },
  },
  {
    said: 'Will I have enough to retire without asking anyone for money?',
    who: 'Asked more often after 40',
    answer: {
      headline: 'We put a number on it, then build towards it.',
      body: 'We work out what your lifestyle will cost at 60, with inflation, and plan a monthly income for after the salary stops, so you stay independent.',
      points: ['Your retirement number, in writing', 'A monthly income plan', 'Reviewed as your salary grows'],
    },
  },
  {
    said: 'I file my taxes. I don’t know if I’m saving the right way.',
    who: 'Every February, this one',
    answer: {
      headline: 'We plan tax in April, not in March.',
      body: 'Old regime or new, 80C, 80D and NPS: we work out what actually saves you the most, using things you already need, not policies bought in a hurry.',
      points: ['Old vs new regime, compared for you', 'Tax saving tied to your goals', 'Planned at the start of the year'],
    },
  },
];

export default function IsThisYou() {
  const [active, setActive] = useState(0);
  const current = WORRIES[active];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
            Sound familiar?
          </span>
          <h2 className="mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
            Most people don’t need more products. They need{' '}
            <span className="gold-gradient-text" style={{ display: 'inline' }}>one honest answer.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">
            Pick the sentence that sounds most like you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* The sentences */}
          <ul className="lg:col-span-5 space-y-2.5">
            {WORRIES.map((w, i) => {
              const isActive = i === active;
              return (
                <li key={w.said}>
                  <button
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className={`w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-300 ${
                      isActive
                        ? 'bg-[#0F1F45] border-[#0F1F45] shadow-[0_16px_36px_rgba(15,31,69,0.22)]'
                        : 'bg-white border-[#E4E8F0] hover:border-[#CBD6EE] hover:bg-[#F7F8FB]'
                    }`}
                  >
                    <span className={`block text-[15px] font-semibold leading-snug ${isActive ? 'text-white' : 'text-[#0F1F45]'}`}>
                      “{w.said}”
                    </span>
                    <span className={`block text-[11px] mt-1.5 ${isActive ? 'text-[#E6C27A]' : 'text-[#8A96AB]'}`}>
                      {w.who}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* The answer */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-[#E4E8F0] bg-gradient-to-br from-white to-[#F4F6FB] p-7 sm:p-9 shadow-[0_2px_8px_rgba(15,31,69,0.05),0_20px_50px_rgba(15,31,69,0.07)] min-h-[360px] flex flex-col">
              <span className="absolute top-0 left-9 right-9 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-[#C9A04F] to-transparent" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.said}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2F5BC7]">What we do about it</p>
                  <h3 className="mt-3 text-[24px] sm:text-[28px] font-serif-luxury font-bold text-[#0F1F45] leading-snug">
                    {current.answer.headline}
                  </h3>
                  <p className="mt-4 text-[15px] text-[#475569] leading-relaxed">{current.answer.body}</p>

                  <ul className="mt-6 space-y-3">
                    {current.answer.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 text-[15px] text-[#0F1F45]">
                        <span className="w-5 h-5 mt-0.5 rounded-full bg-[#2F5BC7] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" strokeWidth={3.5} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <button onClick={() => scrollToConsultation()} className="gold-glow-button group">
                      <span>Talk this through, free</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
