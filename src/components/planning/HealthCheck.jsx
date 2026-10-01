import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { scrollToConsultation } from '../../utils/consultation';

/**
 * A short self-check. It is deliberately about habits and cover, never about
 * recommending products — the score only shows where the gaps are.
 */
const QUESTIONS = [
  {
    id: 'emergency',
    area: 'Emergency fund',
    q: 'If your income stopped today, how long could your savings cover expenses?',
    options: [
      { label: 'Six months or more', score: 2 },
      { label: 'A month or two', score: 1 },
      { label: 'Honestly, not long', score: 0 },
    ],
    fix: 'Build an emergency fund of six months of expenses, kept separate and liquid.',
  },
  {
    id: 'cover',
    area: 'Protection',
    q: 'Do you know exactly what your family would receive if something happened to you?',
    options: [
      { label: 'Yes, the amount and the policy', score: 2 },
      { label: 'Roughly, not exactly', score: 1 },
      { label: 'No idea', score: 0 },
    ],
    fix: 'Check your term and health cover against what your family actually needs, not what was sold.',
  },
  {
    id: 'invest',
    area: 'Investing',
    q: 'How does your money get invested each month?',
    options: [
      { label: 'Automatically, on a set date', score: 2 },
      { label: 'When I remember or have a surplus', score: 1 },
      { label: 'It mostly sits in the bank', score: 0 },
    ],
    fix: 'Automate investing on salary day, so it happens before spending does.',
  },
  {
    id: 'goals',
    area: 'Goals',
    q: 'Do your big goals have an amount and a date?',
    options: [
      { label: 'Yes, written down somewhere', score: 2 },
      { label: 'In my head, not on paper', score: 1 },
      { label: 'Not really', score: 0 },
    ],
    fix: 'Give every goal its own amount, date and monthly number, so they stop competing.',
  },
  {
    id: 'tax',
    area: 'Tax',
    q: 'When do you usually sort out your tax saving?',
    options: [
      { label: 'Early in the financial year', score: 2 },
      { label: 'Somewhere in the middle', score: 1 },
      { label: 'January to March rush', score: 0 },
    ],
    fix: 'Plan tax in April around goals you already have, instead of buying in a March rush.',
  },
  {
    id: 'review',
    area: 'Reviews',
    q: 'When did you last review everything together: money, cover and goals?',
    options: [
      { label: 'Within the last year', score: 2 },
      { label: 'A couple of years ago', score: 1 },
      { label: 'Never done it', score: 0 },
    ],
    fix: 'Review the whole picture once a year, and after any big life change.',
  },
];

const MAX = QUESTIONS.length * 2;

const verdictFor = (pct) => {
  if (pct >= 80) return { title: 'You’re in good shape.', line: 'The basics are handled. What’s left is fine-tuning: tax efficiency, goal timelines and making sure nothing drifts as your income grows.', tone: 'good' };
  if (pct >= 50) return { title: 'A solid start, with real gaps.', line: 'You’re doing several things right, but a few pieces are missing. Those gaps are usually the ones that hurt most when life throws something at you.', tone: 'mid' };
  return { title: 'Worth fixing, sooner rather than later.', line: 'Nothing here is unusual: most people start exactly where you are. The good news is that the first few fixes make the biggest difference.', tone: 'low' };
};

export default function HealthCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const done = step >= QUESTIONS.length;

  const score = useMemo(() => Object.values(answers).reduce((a, b) => a + b, 0), [answers]);
  const pct = Math.round((score / MAX) * 100);
  const verdict = verdictFor(pct);
  const gaps = QUESTIONS.filter((q) => (answers[q.id] ?? 0) < 2);

  const choose = (qid, value) => {
    setAnswers((a) => ({ ...a, [qid]: value }));
    window.setTimeout(() => setStep((s) => s + 1), 180);
  };

  const reset = () => { setAnswers({}); setStep(0); };
  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#F7F8FB] border-y border-[#E4E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E8F0] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
            Free · 2 minutes · No sign-up
          </span>
          <h2 className="mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
            How healthy is your money, <span className="gold-gradient-text" style={{ display: 'inline' }}>really?</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">
            Six honest questions. You’ll see where you stand and what to fix first.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#E4E8F0] shadow-[0_2px_8px_rgba(15,31,69,0.05),0_24px_56px_rgba(15,31,69,0.08)] overflow-hidden">
          {/* progress */}
          <div className="h-1.5 bg-[#EEF1F6]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#2F5BC7] to-[#1A3170]"
              animate={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>

          <div className="p-6 sm:p-9">
            <AnimatePresence mode="wait">
              {!done ? (
                <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2F5BC7]">{q.area}</span>
                    <span className="text-xs font-semibold text-[#8A96AB]">Question {step + 1} of {QUESTIONS.length}</span>
                  </div>

                  <h3 className="mt-4 text-[22px] sm:text-[26px] font-serif-luxury font-bold text-[#0F1F45] leading-snug">{q.q}</h3>

                  <div className="mt-7 space-y-3">
                    {q.options.map((o) => (
                      <button
                        key={o.label}
                        onClick={() => choose(q.id, o.score)}
                        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 rounded-2xl border border-[#E4E8F0] bg-white hover:border-[#1A3170] hover:bg-[#F7F8FB] transition-all group"
                      >
                        <span className="text-[15px] font-semibold text-[#0F1F45]">{o.label}</span>
                        <ArrowRight className="w-4 h-4 text-[#CBD6EE] group-hover:text-[#1A3170] group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>

                  {step > 0 && (
                    <button onClick={() => setStep((s) => s - 1)} className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#5B6B84] hover:text-[#1A3170]">
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    {/* score dial */}
                    <div className="relative w-28 h-28 shrink-0 mx-auto sm:mx-0">
                      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#EEF1F6" strokeWidth="12" />
                        <motion.circle
                          cx="60" cy="60" r="52" fill="none" stroke="#2F5BC7" strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 52}
                          initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - pct / 100) }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[26px] font-bold text-[#0F1F45] leading-none">{pct}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A96AB] mt-1">out of 100</span>
                      </span>
                    </div>

                    <div className="text-center sm:text-left">
                      <h3 className="text-[24px] sm:text-[28px] font-serif-luxury font-bold text-[#0F1F45]">{verdict.title}</h3>
                      <p className="mt-2 text-[15px] text-[#475569] leading-relaxed">{verdict.line}</p>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl bg-[#F7F8FB] border border-[#E4E8F0] p-5 sm:p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2F5BC7]">
                      {gaps.length ? `What to fix first (${gaps.length})` : 'Nothing major to fix'}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {gaps.length ? (
                        gaps.map((g) => (
                          <li key={g.id} className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 mt-0.5 text-[#C9A04F] shrink-0" />
                            <span className="text-sm text-[#0F1F45] leading-snug">
                              <strong className="font-bold">{g.area}: </strong>{g.fix}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start gap-3">
                          <span className="w-5 h-5 mt-0.5 rounded-full bg-[#2F5BC7] text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" strokeWidth={3.5} />
                          </span>
                          <span className="text-sm text-[#0F1F45]">The basics are covered. An advisor can help you fine-tune the rest.</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-7 flex flex-col sm:flex-row items-center gap-3">
                    <button onClick={() => scrollToConsultation()} className="gold-glow-button group w-full sm:w-auto">
                      <span>Get these fixed, free call</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#E4E8F0] text-sm font-bold text-[#1A3170] hover:border-[#CBD6EE] hover:bg-[#F7F8FB] transition-all">
                      <RotateCcw className="w-4 h-4" /> Start again
                    </button>
                  </div>

                  <p className="mt-5 text-[11px] text-[#8A96AB] leading-relaxed">
                    This is a general self-check, not financial advice. Your answers stay on your device — nothing is sent anywhere.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
