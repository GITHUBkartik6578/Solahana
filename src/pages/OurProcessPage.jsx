import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Play, Users, BarChart3, ShieldCheck, Target, FileText, Settings, Cog, Search, Lightbulb,
  BookOpen, Scale, CircleCheck, CirclePlus, ChevronRight,
} from 'lucide-react';
import { openConsultation } from '../data/whoWeServe';

// Artwork cropped from the approved design (swap these files for higher-resolution originals, no code change needed)
import heroArt from '../assets/our-process-hero.webp';
import step1 from '../assets/our-process-step1.webp';
import step2 from '../assets/our-process-step2.webp';
import step3 from '../assets/our-process-step3.webp';
import step4 from '../assets/our-process-step4.webp';
import ctaArt from '../assets/our-process-cta.webp';

const serif = { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" };
const BOOK = { goal: 'Financial Planning', message: 'I’d like to book the free first call.' };

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

const HERO_CHIPS = [
  { icon: Users, label: ['Personalised', '& Collaborative'] },
  { icon: BarChart3, label: ['Objective', '& Transparent'] },
  { icon: ShieldCheck, label: ['Executed via', 'Regulated Partners'] },
];

// Milestones on the path, placed on the art (as % of the art). The labels were removed from the picture itself, so they are real, sharp text.
const MILESTONES = [
  { lines: ['Your', 'Financial Freedom'], x: 75.2, y: 14.6 },
  { lines: ['Generational', 'Wealth'], x: 65, y: 30.7 },
  { lines: ['Secure', 'Retirement'], x: 58, y: 43.2 },
  { lines: ['Grow', 'Investments'], x: 51, y: 54.5 },
  { lines: ['Protect', 'Your Family'], x: 63.4, y: 66.7 },
  { lines: ['Understand', 'Your Goals'], x: 49.6, y: 78.1 },
];

const STEPS = [
  {
    n: '01', title: ['Discovery &', 'Listening'], sub: 'The First Conversation', photo: step1, alt: 'An adviser talking with a client',
    objIcon: Target, objective: 'Understanding your unique story, aspirations, family milestones, and risk comfort.',
    doIcon: Users, what: 'We listen actively to your goals—whether it is funding children’s education, scaling a business, or securing a peaceful retirement—ensuring a completely customized approach from day one.',
  },
  {
    n: '02', title: ['Diagnostic', 'Deep-Dive'], sub: 'Financial Health Check', photo: step2, alt: 'Reviewing portfolio analytics on a laptop',
    objIcon: FileText, objective: 'Rigorous evaluation of your existing cash flows, tax structures, assets, and insurance covers.',
    doIcon: Search, what: 'Using advanced CWM® diagnostic frameworks, we analyze your portfolio gaps, tax inefficiencies, and risk exposures to identify immediate optimization opportunities.',
  },
  {
    n: '03', title: ['Strategy &', 'Roadmap Architecture'], sub: '', photo: step3, alt: 'A financial plan being drawn on paper',
    objIcon: BarChart3, objective: 'Designing a transparent, zero-bias master financial plan.',
    doIcon: Lightbulb, what: 'We create a clear, actionable blueprint encompassing asset allocation, risk mitigation, and estate structuring—tailored specifically to your family’s long-term timeline without any product-pushing pressure.',
  },
  {
    n: '04', title: ['Seamless Execution', '& Ongoing Review'], sub: '', photo: step4, alt: 'A handshake over the city skyline',
    objIcon: Settings, objective: 'Safe implementation and continuous monitoring.',
    doIcon: Cog, what: 'All transactional executions are routed strictly through verified SEBI and AMFI-registered institutional channel partners, followed by periodic reviews to adapt your plan as life evolves.',
  },
];

const PRINCIPLES = [
  { icon: BookOpen, title: 'Plain Language', desc: 'Complex financial concepts translated into simple, easy-to-understand terms.' },
  { icon: Users, title: 'Free First Call', desc: 'Zero-obligation initial consultation to see if we are the right fit for your family.' },
  { icon: Scale, title: 'Zero Product Bias', desc: 'Objective advice focused purely on what works best for your wealth.' },
];

const OUTCOMES = [
  { icon: Target, label: 'Clarity Today' },
  { icon: CircleCheck, label: 'Better Decisions' },
  { icon: ShieldCheck, label: 'Long-Term Wealth' },
  { icon: CirclePlus, label: 'Peace of Mind' },
];

function Eyebrow({ children, light }) {
  return (
    <p className={`inline-flex items-center gap-3 font-sora text-[12px] font-bold uppercase tracking-[0.28em] ${light ? 'text-[#E2B24E]' : 'text-[#C9922E]'}`}>
      {children}
    </p>
  );
}

function GoldBtn({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.35)] transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

function RoundIcon({ icon: Icon, size = 'h-11 w-11', iconSize = 'h-5 w-5', tone = 'gold' }) {
  const ring = tone === 'gold' ? 'border-[#E2B24E]/70 text-[#E2B24E]' : 'border-[#C9922E]/50 bg-[#C9922E]/10 text-[#C9922E]';
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full border ${ring}`}>
      <Icon className={iconSize} strokeWidth={1.6} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
function Hero() {
  const toJourney = () => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C] pt-[80px]">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 h-[420px] w-[420px] rounded-full bg-[#C9922E]/10 blur-[120px]" />
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 py-10 lg:py-14">
          <Eyebrow light>Our Process</Eyebrow>
          <h1 style={serif} className="[text-wrap:balance] mt-5 text-[40px] font-semibold leading-[1.06] text-white sm:text-[52px] lg:text-[clamp(44px,4.4vw,64px)]">
            A Structured Path to <span className="text-[#E2B24E]">Absolute Financial Clarity.</span>
          </h1>
          <p className="[text-wrap:pretty] mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-slate-200 sm:text-[17px]">
            No complex jargon, no hidden agendas. Our 4-step consultative process is designed to understand your life goals, evaluate your current financial health, and build a resilient, multi-generational roadmap.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <GoldBtn onClick={() => openConsultation(BOOK)}>Start Your Journey</GoldBtn>
            <button
              type="button"
              onClick={toJourney}
              className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-md border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#E2B24E] text-[#E2B24E]">
                <Play className="h-3 w-3 translate-x-[1px] fill-current" />
              </span>
              Watch How It Works
            </button>
          </div>
          <ul className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {HERO_CHIPS.map((c) => (
              <li key={c.label[0]} className="flex items-center gap-3">
                <RoundIcon icon={c.icon} size="h-12 w-12" iconSize="h-[22px] w-[22px]" />
                <span className="text-[13px] font-medium leading-snug text-slate-100">
                  {c.label[0]}<br />{c.label[1]}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Hero art: kept at its own aspect ratio so the milestone labels line up on every screen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto w-full max-w-[560px] overflow-hidden [container-type:inline-size] lg:mx-0 lg:w-[calc(100%+max(0px,(100vw-1320px)/2)+2rem)] lg:max-w-none [mask-image:linear-gradient(to_right,transparent,black_16%)]"
          style={{ aspectRatio: '476 / 384' }}
        >
          <img src={heroArt} alt="A professional looking up a glowing path to the summit: understand your goals, protect your family, grow investments, secure retirement, generational wealth, financial freedom" draggable="false" className="absolute inset-0 block h-full w-full select-none" />
          {MILESTONES.map((m) => (
            <span
              key={m.lines[0]}
              className="absolute flex flex-col whitespace-nowrap font-sans font-medium leading-[1.22] text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9),0_0_2px_rgba(0,0,0,0.8)]"
              style={{ left: `${m.x}%`, top: `${m.y}%`, fontSize: 'max(9px, 2.5cqw)' }}
            >
              <span>{m.lines[0]}</span>
              <span>{m.lines[1]}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" className="scroll-mt-20 bg-[#FEFDF9] pb-16 pt-14 sm:pt-16 lg:pb-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-12">
          <div>
            <Eyebrow>The 4-Step Collaborative Journey</Eyebrow>
            <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.1] text-[#0F1F45] sm:text-[48px]">
              From Conversation to Generational Wealth.
            </h2>
          </div>
          <p className="[text-wrap:pretty] max-w-[40ch] text-[15px] leading-relaxed text-[#475569] lg:justify-self-end">
            A clear, disciplined process to turn your aspirations into a practical, achievable roadmap.
          </p>
        </motion.div>

        <ol className="mt-10 grid grid-cols-1 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.n}
              {...fade}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="relative flex flex-col rounded-2xl border border-[#EFE9D8] bg-white/70 px-4 pb-6 pt-5 xl:rounded-none xl:border-0 xl:border-r xl:border-[#EFE9D8] xl:bg-transparent xl:last:border-r-0"
            >
              <div className="flex min-h-[84px] items-center gap-4">
                <span style={serif} className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border border-[#E6C27A] text-[28px] font-medium leading-none text-[#C9922E]">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <h3 style={serif} className="text-[22px] font-semibold leading-[1.1] text-[#0F1F45]">
                    {s.title[0]}<br />{s.title[1]}
                  </h3>
                  {s.sub && <p className="mt-1 text-[13.5px] text-[#475569]">{s.sub}</p>}
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-lg shadow-[0_10px_26px_rgba(15,31,69,0.16)]">
                <img src={s.photo} alt={s.alt} loading="lazy" draggable="false" className="block aspect-[225/152] w-full object-cover" />
              </div>

              <div className="mt-5 flex gap-3">
                <RoundIcon icon={s.objIcon} size="h-10 w-10" iconSize="h-[18px] w-[18px]" tone="soft" />
                <div>
                  <p className="text-[14.5px] font-bold text-[#0F1F45]">Objective</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-[#475569]">{s.objective}</p>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <RoundIcon icon={s.doIcon} size="h-10 w-10" iconSize="h-[18px] w-[18px]" tone="soft" />
                <div>
                  <p className="text-[14.5px] font-bold text-[#0F1F45]">What We Do</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-[#475569]">{s.what}</p>
                </div>
              </div>

              {/* arrow to the next step */}
              {i < STEPS.length - 1 && (
                <span aria-hidden="true" className="absolute -right-3 top-[232px] z-10 hidden h-6 w-6 items-center justify-center text-[#C9922E] xl:flex">
                  <ChevronRight className="h-6 w-6" strokeWidth={2.4} />
                </span>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="bg-[#F7F5EE] py-14 sm:py-16">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div>
            <Eyebrow>The Solahana Promise</Eyebrow>
            <h2 style={serif} className="mt-4 text-[34px] font-semibold leading-[1.1] text-[#0F1F45] sm:text-[48px]">Our Core Guiding Principles</h2>
          </div>
          <p className="[text-wrap:pretty] max-w-[48ch] text-[15px] leading-relaxed text-[#475569] lg:justify-self-end">
            These principles are at the heart of everything we do and ensure a trusted, long-term relationship with your family.
          </p>
        </motion.div>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.title}
              {...fade}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              className="flex items-center gap-5 rounded-2xl border border-[#EFE9D8] bg-white/80 p-6 shadow-[0_8px_24px_rgba(15,31,69,0.05)]"
            >
              <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F6D894] to-[#E2A93E] text-[#0F1F45]">
                <p.icon className="h-8 w-8" strokeWidth={1.8} />
              </span>
              <div>
                <h3 style={serif} className="text-[22px] font-semibold leading-tight text-[#0F1F45]">{p.title}</h3>
                <p className="mt-1.5 text-[15px] leading-snug text-[#475569]">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C]">
      <img src={ctaArt} alt="" aria-hidden="true" loading="lazy" draggable="false" className="pointer-events-none absolute inset-y-0 right-[16%] hidden h-full w-[48%] object-cover [mask-image:linear-gradient(to_right,transparent,black_30%,black_85%,transparent)] lg:block" />
      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:px-8">
        <motion.div {...fade}>
          <Eyebrow light>Your Future. A Clearer Path.</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.08] text-[#E2B24E] sm:text-[48px]">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="[text-wrap:pretty] mt-4 max-w-[52ch] text-[16px] leading-relaxed text-slate-100">
            Start with a simple, confidential, and pressure-free conversation.
          </p>
          <GoldBtn onClick={() => openConsultation(BOOK)} className="mt-7">Schedule Your Free Consultation</GoldBtn>
        </motion.div>
        <motion.ul {...fade} className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:justify-self-end">
          {OUTCOMES.map((o) => (
            <li key={o.label} className="flex items-center gap-4">
              <RoundIcon icon={o.icon} size="h-11 w-11" />
              <span className="text-[15px] font-semibold text-white">{o.label}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default function OurProcessPage() {
  return (
    <div className="relative z-10 bg-white">
      <Hero />
      <Journey />
      <Principles />
      <Closing />
    </div>
  );
}
