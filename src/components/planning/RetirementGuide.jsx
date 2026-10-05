import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Target,
  PieChart,
  UserCheck,
  Briefcase,
  Building2,
  Globe,
  Landmark,
  Users,
  Hourglass,
  Palmtree,
  TrendingUp,
  HeartPulse,
  Sprout,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import { SectionHead } from './PlanningGuide';
import { scrollToConsultation } from '../../utils/consultation';

const rise = (i = 0, step = 0.07) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.42, delay: i * step },
});

function TalkToPlanner({ label = 'Talk to a retirement planner', dark = false }) {
  return (
    <button
      type="button"
      onClick={() => scrollToConsultation()}
      className={`group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold transition-all cursor-pointer ${
        dark
          ? 'bg-white text-[#0F1F45] hover:bg-[#F1F4FA]'
          : 'bg-[#0F1F45] text-white shadow-[0_10px_30px_rgba(15,31,69,0.25)] hover:shadow-[0_15px_40px_rgba(15,31,69,0.35)]'
      }`}
    >
      <PhoneCall className="w-4 h-4" />
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

/* ----------------------------------------------------------- */
/* 1. Your partner in building a retirement plan                */
/* ----------------------------------------------------------- */
const PILLARS = [
  {
    icon: Target,
    tone: 'bg-[#EEF2FB] text-[#2F5BC7]',
    title: 'Planning around your retirement goal',
    body: 'We start with the life you want after work: the age you stop, where you live, how you spend your days. That becomes a monthly income target, adjusted for inflation, and every rupee you invest is tied to it.',
  },
  {
    icon: PieChart,
    tone: 'bg-[#FDF3E2] text-[#C58A1B]',
    title: 'The right mix of investments',
    body: 'Mutual funds, NPS, EPF and PPF, bonds and fixed income, each used for what it does best. Growth while you earn, stability as you get closer, and a steady payout once you retire.',
  },
  {
    icon: UserCheck,
    tone: 'bg-[#E7F6EE] text-[#1F8A5B]',
    title: 'One planner who knows your story',
    body: 'You work with one dedicated planner who reviews your plan every year and whenever life changes, so you never have to explain your situation from scratch.',
  },
];

const SEGMENTS = [
  { icon: Briefcase, title: 'Salaried professionals', desc: 'Make the most of EPF, NPS and your salary hikes, and build a corpus that replaces your pay cheque.' },
  { icon: Building2, title: 'Business owners', desc: 'No employer pension? We separate business and personal money and build a retirement fund of your own.' },
  { icon: Globe, title: 'NRIs', desc: 'Planning across countries: NRE and NRO accounts, tax in two places, and a corpus for wherever you settle.' },
  { icon: Landmark, title: 'Government employees', desc: 'Make your pension and NPS work together, and fill the gap between them and the lifestyle you want.' },
  { icon: Users, title: 'Couples planning together', desc: 'Two incomes, one retirement. We plan for both of you, including the years one partner may be on their own.' },
  { icon: Hourglass, title: 'Close to retirement', desc: 'Five to ten years to go? We protect what you have built and set up the income you will draw on.' },
];

function SegmentCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SEGMENTS.length;

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), 4000);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  const s = SEGMENTS[i];
  const Icon = s.icon;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="h-full rounded-3xl bg-white border border-[#E4E8F0] p-7 sm:p-9 text-center shadow-[0_2px_8px_rgba(15,31,69,0.05),0_20px_50px_rgba(15,31,69,0.07)] flex flex-col"
    >
      <h3 className="text-xl sm:text-2xl font-bold text-[#0F1F45] font-sora">A plan for every kind of earner</h3>

      <div className="relative flex-1 flex items-center mt-6">
        <button
          type="button"
          onClick={() => setI((v) => (v - 1 + n) % n)}
          aria-label="Previous"
          className="absolute left-0 z-10 w-9 h-9 rounded-full border border-[#E4E8F0] bg-white flex items-center justify-center text-[#475569] hover:border-[#2F5BC7] hover:text-[#2F5BC7] cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full px-12"
          >
            <span className="mx-auto w-16 h-16 rounded-full bg-[#FDF3E2] flex items-center justify-center text-[#C58A1B]">
              <Icon className="w-7 h-7" strokeWidth={1.75} />
            </span>
            <p className="mt-5 text-lg font-bold text-[#0F1F45]">{s.title}</p>
            <p className="mt-2 text-sm text-[#475569] leading-relaxed max-w-sm mx-auto">{s.desc}</p>
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setI((v) => (v + 1) % n)}
          aria-label="Next"
          className="absolute right-0 z-10 w-9 h-9 rounded-full border border-[#E4E8F0] bg-white flex items-center justify-center text-[#475569] hover:border-[#2F5BC7] hover:text-[#2F5BC7] cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-7 flex justify-center gap-2">
        {SEGMENTS.map((seg, k) => (
          <button
            key={seg.title}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Show ${seg.title}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${k === i ? 'w-6 bg-[#1A3170]' : 'w-2 bg-[#CBD6EE] hover:bg-[#9AA9C7]'}`}
          />
        ))}
      </div>
    </div>
  );
}

export function RetirementPartner() {
  const [open, setOpen] = useState(0);

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Built around you"
          title="Your partner in building"
          accent="a retirement that works."
          sub="More than a product list. A clear, written route to the retirement you have in mind."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <div className="space-y-4">
            {PILLARS.map(({ icon: Icon, tone, title, body }, k) => {
              const isOpen = open === k;
              return (
                <motion.div
                  key={title}
                  {...rise(k)}
                  className={`rounded-2xl border bg-white transition-all ${
                    isOpen ? 'border-[#CBD6EE] shadow-[0_14px_34px_rgba(15,31,69,0.08)]' : 'border-[#E4E8F0] shadow-[0_2px_8px_rgba(15,31,69,0.04)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : k)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
                  >
                    <span className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
                      <Icon className="w-5 h-5" strokeWidth={2} />
                    </span>
                    <span className="flex-1 font-bold text-[#0F1F45]">{title}</span>
                    <ChevronDown className={`w-5 h-5 text-[#8A96AB] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 pl-[84px] text-sm text-[#475569] leading-relaxed">{body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <motion.div {...rise(1)}>
            <SegmentCarousel />
          </motion.div>
        </div>

        <div className="mt-10 text-center">
          <TalkToPlanner />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 2. Why planning for retirement can't wait                    */
/* ----------------------------------------------------------- */
const URGENCY = [
  {
    icon: Palmtree,
    title: 'Freedom to do what you love',
    desc: 'Travel, a hobby, time with grandchildren or a small venture of your own. A funded retirement turns “someday” into a real plan.',
    big: 'Work by choice',
    small: 'not because the bills need paying',
  },
  {
    icon: TrendingUp,
    title: 'Prices keep climbing, savings alone fall behind',
    desc: 'Money sitting in a savings account grows slower than prices. Your corpus has to beat inflation, not just exist.',
    big: '₹2.87 L',
    small: 'what ₹50,000 of monthly expenses today could cost in 30 years at 6% inflation',
  },
  {
    icon: HeartPulse,
    title: 'Longer lives need longer income',
    desc: 'People are living well into their 80s. Your money has to keep paying out for as long as you do, medical costs included.',
    big: '25–30 years',
    small: 'how long a retirement may need to be funded',
  },
  {
    icon: Sprout,
    title: 'Starting early is the easy way',
    desc: 'Every year you wait, the monthly amount needed goes up. Start early and compounding does most of the heavy lifting.',
    big: '₹3.5 Cr vs ₹1 Cr',
    small: '₹10,000 a month at 12% till 60, started at 30 vs started at 40',
  },
  {
    icon: ShieldCheck,
    title: 'Your family stays free to chase their goals',
    desc: 'A self-funded retirement means your children can spend on their own homes and families, not on supporting you.',
    big: 'Independent',
    small: 'for every year after work',
  },
];

export function RetirementCantWait() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = URGENCY.length;

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), 5000);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  const s = URGENCY[i];
  const Icon = s.icon;

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Why start now"
          title="Why retirement planning"
          accent="can’t wait."
          sub="The earlier you begin, the more time your money gets to grow, and the less you need to put in each month."
        />

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
        >
          {/* Visual panel */}
          <div className="lg:col-span-6 relative rounded-3xl bg-ink-band overflow-hidden min-h-[280px] sm:min-h-[320px] p-8 sm:p-10 flex flex-col justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <Icon className="absolute top-8 right-8 w-24 h-24 sm:w-28 sm:h-28 text-white/10" strokeWidth={1.25} />
                <p className="text-[38px] sm:text-[48px] leading-none font-serif-luxury font-bold text-white">{s.big}</p>
                <p className="mt-3 max-w-sm text-sm sm:text-base text-[#C9D3E6]">{s.small}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text + controls */}
          <div className="lg:col-span-6">
            <ol className="space-y-2">
              {URGENCY.map((u, k) => {
                const on = k === i;
                const UIcon = u.icon;
                return (
                  <li key={u.title}>
                    <button
                      type="button"
                      onClick={() => setI(k)}
                      aria-current={on}
                      className={`w-full text-left rounded-2xl px-5 py-4 transition-all cursor-pointer ${
                        on ? 'bg-[#F4F7FD] border border-[#CBD6EE]' : 'border border-transparent hover:bg-[#F7F8FB]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            on ? 'bg-[#1A3170] text-[#E6C27A]' : 'bg-[#EEF2FB] text-[#2F5BC7]'
                          }`}
                        >
                          <UIcon className="w-4 h-4" />
                        </span>
                        <span className={`font-bold ${on ? 'text-[#0F1F45]' : 'text-[#475569]'}`}>{u.title}</span>
                      </span>
                      <AnimatePresence initial={false}>
                        {on && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden pl-12 text-sm text-[#475569] leading-relaxed"
                          >
                            <span className="block pt-2">{u.desc}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <p className="mt-6 text-xs text-[#8A96AB] text-center lg:text-left">
          Figures are illustrations based on the assumptions shown, not promised returns.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 3. How a plan plays out: illustrative examples               */
/* ----------------------------------------------------------- */
const SCENARIOS = [
  {
    stage: 'Starting early',
    who: 'Age 30, salaried',
    plan: '₹15,000 a month into a goal-based SIP, kept going till 60.',
    figure: '≈ ₹5.3 Cr',
    figureLabel: 'Projected corpus at 60',
    assumption: 'Assumes 12% yearly return.',
  },
  {
    stage: 'Catching up',
    who: 'Age 45, business owner',
    plan: '₹30,000 a month, raised by 10% every year as income grows.',
    figure: '≈ ₹2.4 Cr',
    figureLabel: 'Projected corpus at 60',
    assumption: 'Assumes 11% yearly return.',
  },
  {
    stage: 'Drawing income',
    who: 'Age 60, just retired',
    plan: '₹1.5 Cr corpus paying ₹75,000 a month, raised 5% every year.',
    figure: '≈ 24 years',
    figureLabel: 'How long the income lasts',
    assumption: 'Assumes 8% yearly return after retirement.',
  },
];

export function RetirementScenarios() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-[#EEF3FB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="What a plan can do"
          title="Real numbers,"
          accent="at every stage of life."
          sub="Three examples of how retirement planning plays out, whether you start early, start late, or are already retired."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SCENARIOS.map((s, k) => (
            <motion.div
              key={s.stage}
              {...rise(k)}
              className="h-full flex flex-col rounded-3xl bg-white border border-[#C9D6EE] p-6 sm:p-7 shadow-[0_10px_28px_rgba(26,49,112,0.08)]"
            >
              <span className="self-start rounded-full bg-[#EEF2FB] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2F5BC7]">
                {s.stage}
              </span>
              <p className="mt-4 text-lg font-bold text-[#0F1F45]">{s.who}</p>
              <p className="mt-2 text-sm text-[#475569] leading-relaxed flex-1">{s.plan}</p>
              <div className="mt-6 pt-5 border-t border-[#EEF1F6]">
                <p className="text-[30px] leading-none font-serif-luxury font-bold text-[#C58A1B]">{s.figure}</p>
                <p className="mt-1.5 text-xs font-semibold text-[#64748B]">{s.figureLabel}</p>
                <p className="mt-3 text-[11px] text-[#8A96AB]">{s.assumption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-[#64748B]">
          Illustrative examples, not client results. Returns are assumptions and are not guaranteed.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- */
/* 4. Closing call to action                                    */
/* ----------------------------------------------------------- */
export function RetirementClosingCTA() {
  return (
    <section className="relative py-16 sm:py-20 bg-white border-t border-[#E4E8F0]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[30px] sm:text-[42px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
          Your retirement won’t plan itself.{' '}
          <span className="text-[#C58A1B]">Let’s plan it together.</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-[#475569]">
          A free first call to understand where you are today. No obligation, no product pitch.
        </p>
        <div className="mt-8">
          <TalkToPlanner label="Book my free planning call" />
        </div>
      </div>
    </section>
  );
}
