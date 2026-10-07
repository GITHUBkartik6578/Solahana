import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Phone, Route, Users, SearchCheck, FileText, RefreshCw } from 'lucide-react';
import ProcessJourney from '../components/our-process/ProcessJourney';
import PrepChecklist from '../components/our-process/PrepChecklist';
import ProcessFaq from '../components/our-process/ProcessFaq';
import { HERO_FACTS, PRINCIPLES, STEPS } from '../data/ourProcess';
import { openConsultation } from '../data/whoWeServe';

const EASE = [0.22, 1, 0.36, 1];
const BOOK = { goal: 'Financial Planning', message: 'I’d like to book the free intro conversation.' };

const STEP_ICONS = [Phone, Users, SearchCheck, FileText, RefreshCw];

/** The five steps as a connected, clickable path (replaces the photo fan). */
function StepsPath({ reduceMotion }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return (
    <div className="relative mx-auto hidden w-full max-w-[470px] lg:block">
      <span aria-hidden="true" className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(closest-side,rgba(230,194,122,0.35),transparent)]" />
      <ol className="relative space-y-3">
        <span aria-hidden="true" className="absolute bottom-6 left-[41px] top-6 w-[2px] rounded-full bg-gradient-to-b from-[#E6C27A] via-[#C9922E] to-[#E6C27A]/30" />
        {STEPS.map((s, i) => {
          const Icon = STEP_ICONS[i % STEP_ICONS.length];
          return (
            <motion.li
              key={s.id}
              initial={reduceMotion ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: EASE }}
              style={{ marginLeft: `${i * 14}px` }}
              className="relative"
            >
              <button
                type="button"
                onClick={() => go(s.id)}
                className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-[#E4D2A6] bg-white/95 px-3.5 py-3 text-left shadow-[0_12px_28px_rgba(15,31,69,0.10)] outline-none backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9922E] hover:shadow-[0_18px_36px_rgba(201,146,46,0.25)] focus-visible:ring-2 focus-visible:ring-[#C9922E]"
              >
                <span className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#1A3170] to-[#0F1F45] text-[#E6C27A] ring-4 ring-white">
                  <Icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E6C27A] font-serif-luxury text-[11px] font-bold text-[#0F1F45]">
                    {i + 1}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif-luxury text-[17px] font-bold leading-tight text-[#0F1F45]">{s.short}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-[#64748B]">{s.outcome}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#C9922E] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
              </button>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

export default function OurProcessPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative z-10 bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F4FA] via-[#F7F8FB] to-white pb-10 pt-24 sm:pb-12 sm:pt-28">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-[-12%] h-[640px] w-[640px] rounded-full bg-[#2F5BC7]/[0.07] blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[2%] top-[8%] h-[360px] w-[360px] rounded-full bg-[#C9A04F]/[0.14] blur-[100px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10 lg:px-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#2F5BC7]">
              <Route className="h-4 w-4 text-[#C9A04F]" />
              Our process
            </p>
            <h1 className="mt-4 font-serif-luxury text-[36px] font-bold leading-[1.08] tracking-[-0.02em] text-[#0F1F45] [text-wrap:balance] sm:text-[52px] lg:text-[56px]">
              Five steps from first call to <span className="text-[#B8862B]">a plan you can follow.</span>
            </h1>
            <span aria-hidden="true" className="mt-5 block h-[4px] w-20 rounded-full" style={{ background: 'var(--grad-gold)' }} />
            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[#475569] sm:text-lg">
              You always know what happens next, and why. No surprises, and no step you can’t say no to.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
              {HERO_FACTS.map((f) => (
                <li key={f} className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0F1F45]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A04F]/20 text-[#A67C2E]">
                    <Check className="h-3 w-3" strokeWidth={3.2} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="#global-consultation-section"
                onClick={(e) => {
                  e.preventDefault();
                  openConsultation(BOOK);
                }}
                className="gold-glow-button group"
              >
                <span>Book my free intro call</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#step-1"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#2F5BC7] underline-offset-4 hover:text-[#1A3170] hover:underline"
              >
                See the five steps
              </a>
            </div>
          </motion.div>

          <StepsPath reduceMotion={reduceMotion} />
        </div>
      </section>

      <ProcessJourney />
      <PrepChecklist />

      {/* Principles */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-2xl font-serif-luxury text-[28px] font-bold leading-tight text-[#0F1F45] [text-wrap:balance] sm:text-[34px]">
            Three things stay the same at every step
          </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'var(--grad-gold)' }} />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-3xl border border-[#E4E8F0] bg-gradient-to-b from-white to-[#F9F6EC] p-7 shadow-[0_1px_2px_rgba(15,31,69,0.04),0_14px_36px_rgba(15,31,69,0.05)]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-[#0F1F45] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" style={{ background: 'var(--grad-gold)' }}>
                    <Icon className="h-6 w-6" strokeWidth={2.1} />
                  </span>
                  <h3 className="mt-5 font-serif-luxury text-[20px] font-bold text-[#0F1F45]">{p.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-[#475569]">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessFaq />

      {/* Closing band, leads into the consultation form below */}
      <section className="bg-ink-band py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-serif-luxury text-[28px] font-bold leading-tight text-white [text-wrap:balance] sm:text-[38px]">
              Step 1 is a short, free conversation.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#C7D2E6]">
              Tell us where you are today. We’ll tell you honestly whether and how we can help.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#global-consultation-section"
              onClick={(e) => {
                e.preventDefault();
                openConsultation(BOOK);
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Book my free intro call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="tel:+917304442171"
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-[#E6C27A] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Phone className="h-4 w-4" />
              Or call +91 73044 42171
            </a>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link to="/who-we-serve" className="inline-flex items-center gap-2 text-sm font-semibold text-[#AEBBD3] underline-offset-4 hover:text-white hover:underline">
            Not sure it’s for you? See who we work with <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
