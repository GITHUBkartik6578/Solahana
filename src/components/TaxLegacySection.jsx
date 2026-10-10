import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import card1 from '../assets/tax-card-1.webp';
import card2 from '../assets/tax-card-2.webp';
import card3 from '../assets/tax-card-3.webp';
import card4 from '../assets/tax-card-4.webp';
import card5 from '../assets/tax-card-5.webp';
import familyArt from '../assets/tax-family.webp';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const COPPER = '#A9591F';

// each picture already carries its round icon badge and the soft wave into the card
const STEPS = [
  {
    title: ['Strategic', 'Tax Optimization'],
    desc: 'Smart asset allocation, capital gains harvesting, and proactive tax planning under applicable regimes.',
    img: card1,
    to: '/tax-planning',
  },
  {
    title: ['Business &', 'Corporate Structuring'],
    desc: 'Tailored tax-efficient frameworks for entrepreneurs, professionals, and LLPs to optimize cash flows.',
    img: card2,
    to: '/tax-planning',
  },
  {
    title: ['Will Planning'],
    desc: 'Legally sound and watertight wills to ensure the precise, peaceful distribution of your personal assets.',
    img: card3,
    to: '/estate-planning',
  },
  {
    title: ['Private Family Trusts'],
    desc: 'Institutional-grade trust structuring for asset protection, privacy, and smooth generational wealth transfer.',
    img: card4,
    to: '/estate-planning',
  },
  {
    title: ['Succession &', 'Estate Planning'],
    desc: 'Structured legacy roadmaps, inter-generational gifting, and seamless transition frameworks for families.',
    img: card5,
    to: '/estate-planning',
  },
];

function StepCard({ step, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="h-full"
    >
      <Link
        to={step.to}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#EFE9E0] bg-[#FBFAF6] shadow-[0_10px_28px_rgba(15,31,69,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,31,69,0.15)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F5BC7]/25"
      >
        <img src={step.img} alt="" aria-hidden="true" loading="lazy" draggable="false" width="229" height="135" className="block h-auto w-full select-none" />
        <div className="flex flex-1 flex-col px-4 pb-4 pt-1">
          <span style={{ ...serif, color: COPPER }} className="block text-[20px] font-medium leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 style={serif} className="mt-3 text-[17px] font-bold leading-[1.2] text-[#0F1F45]">
            {step.title[0]}
            {step.title[1] && <span className="block">{step.title[1]}</span>}
          </h3>
          <span aria-hidden="true" className="mt-2.5 block h-[2px] w-7 rounded-full" style={{ background: COPPER }} />
          <p className="mt-3 flex-1 text-[13px] leading-[1.55] text-[#64748B]">{step.desc}</p>
          <span
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border bg-white/70 px-5 py-2 text-[13.5px] font-semibold text-[#0F1F45] transition-colors group-hover:bg-[#0F1F45] group-hover:text-white"
            style={{ borderColor: COPPER }}
          >
            Explore
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TaxLegacySection() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF8] py-8 sm:py-9 lg:py-10" aria-label="Tax and legacy architecture">
      {/* soft decorative shapes */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full bg-[#E8EFFB]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-6 h-[560px] w-[560px] rounded-full border border-[#F1E3D1]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 -left-28 h-[360px] w-[360px] rounded-full bg-[#FCEFE2]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-10 h-[420px] w-[620px] rounded-[100%] border border-[#F1E3D1]" />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* family at sunrise, top right (desktop) */}
        <img
          src={familyArt}
          alt=""
          aria-hidden="true"
          loading="lazy"
          draggable="false"
          className="pointer-events-none absolute right-8 top-2 hidden h-[190px] w-auto select-none xl:block"
          style={{ WebkitMaskImage: 'radial-gradient(ellipse 62% 70% at 58% 52%, black 42%, transparent 100%)', maskImage: 'radial-gradient(ellipse 62% 70% at 58% 52%, black 42%, transparent 100%)' }}
        />

        {/* heading */}
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-3 font-sora text-[11px] font-semibold uppercase tracking-[0.26em]" style={{ color: COPPER }}>
            <span className="h-px w-8" style={{ background: COPPER }} />
            Tax &amp; Legacy Architecture
          </span>
          <h2 style={serif} className="mt-2 text-[28px] font-bold leading-[1.06] tracking-tight text-[#0F2A6B] sm:text-[36px] xl:text-[clamp(32px,3vw,42px)]">
            Build Wealth.
            <span className="block">
              Protect It. <span style={{ color: COPPER }}>Pass It Forward.</span>
            </span>
          </h2>
          <p className="mt-2 max-w-[440px] text-[14px] leading-snug text-[#6B7A99] sm:text-[15px]">
            From tax-efficient structuring to succession, we help you preserve wealth today and transition it with clarity tomorrow.
          </p>
        </motion.div>

        {/* steps */}
        <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {STEPS.map((step, i) => (
            <StepCard key={step.title.join(' ')} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
