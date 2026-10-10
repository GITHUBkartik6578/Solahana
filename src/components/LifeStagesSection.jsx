import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, BarChart3, Users, Home, Coins, Umbrella, HeartPulse } from 'lucide-react';

import stage1 from '../assets/stages/01.webp';
import stage2 from '../assets/stages/02.webp';
import stage3 from '../assets/stages/03.webp';
import stage4 from '../assets/stages/04.webp';
import stage5 from '../assets/stages/05.webp';
import stage6 from '../assets/stages/06.webp';
import stage7 from '../assets/stages/07.webp';
import stage8 from '../assets/stages/08.webp';
import LifeJourneyWalker from './LifeJourneyWalker';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const STAGES = [
  {
    age: 'Age 18–23',
    title: 'Education & Foundation',
    focus: 'Building financial literacy, early habit building, and setting up the right foundational financial systems.',
    icon: BookOpen,
    photo: stage1,
    to: '/goals',
  },
  {
    age: 'Age 24–28',
    title: 'Career Acceleration & First Salary',
    focus: 'Managing first inflows, emergency funds, initiating systematic SIPs, and foundational risk cover.',
    icon: BarChart3,
    photo: stage2,
    to: '/financial-planning',
  },
  {
    age: 'Age 29–35',
    title: 'Marriage & Family Milestones',
    focus: 'Joint goal planning, lifestyle asset acquisition, housing, and expanding family protection plans.',
    icon: Users,
    photo: stage3,
    to: '/goals',
  },
  {
    age: 'Age 36–40',
    title: 'Property & Asset Expansion',
    focus: 'Real estate acquisition, core portfolio scaling, and children’s education corpus setup.',
    icon: Home,
    photo: stage4,
    to: '/investments',
  },
  {
    age: 'Age 41–50',
    title: 'Core Wealth & Portfolio Scaling',
    focus: 'High-alpha allocations via PMS/AIF, business scaling support, and multi-asset diversification.',
    icon: Coins,
    photo: stage5,
    to: '/investments',
  },
  {
    age: 'Age 51–55',
    title: 'Retirement & Income Structuring',
    focus: 'Consolidating corpus, shifting toward secure cash-flow assets, and tax optimization.',
    icon: Umbrella,
    photo: stage6,
    to: '/calculators/retirement',
  },
  {
    age: 'Age 56–65',
    title: 'Health Protection & Preservation',
    focus: 'Comprehensive healthcare coverage, capital preservation, and risk mitigation.',
    icon: HeartPulse,
    photo: stage7,
    to: '/risk-management',
  },
  {
    age: 'Age 68+',
    title: 'Estate & Succession Planning',
    focus: 'Wealth transfer frameworks, wills, trusts, and seamless legacy transition for the next generation.',
    icon: Users,
    photo: stage8,
    to: '/estate-planning',
  },
];

// age range of each card, used by the walker under the cards
const WALK_STAGES = [
  { from: 18, to: 23 },
  { from: 24, to: 28 },
  { from: 29, to: 35 },
  { from: 36, to: 40 },
  { from: 41, to: 50 },
  { from: 51, to: 55 },
  { from: 56, to: 65 },
  { from: 68, to: 68, open: true },
];

function useIsXL() {
  const q = '(min-width: 1280px)';
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const fn = (e) => setOn(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return on;
}

// Each step sits this much higher than the one before it (desktop staircase)
const STEP = 34;

function StageCard({ stage, index }) {
  const Icon = stage.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="xl:mt-[var(--lift)]"
      style={{ '--lift': `${(STAGES.length - 1 - index) * STEP}px` }}
    >
      <Link
        to={stage.to}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl xl:min-h-[262px] border border-[#E7DFCF] bg-[#FEFDF9] shadow-[0_12px_30px_rgba(15,31,69,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgba(15,31,69,0.2)] data-[active=true]:-translate-y-1.5 data-[active=true]:border-[#C9922E] data-[active=true]:shadow-[0_18px_40px_rgba(201,146,46,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F5BC7]/25"
      >
        {/* photo + number badge */}
        <div className="relative h-[84px] w-full overflow-hidden bg-[#F1E9D8]">
          <img src={stage.photo} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" draggable="false" />
          <span
            style={serif}
            className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F1F45] text-[12px] font-bold text-[#F1D9A3] ring-2 ring-[#C9922E] shadow-[0_4px_10px_rgba(15,31,69,0.35)]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 text-left">
          <p style={serif} className="text-[15px] font-bold leading-none text-[#0F1F45]">
            {stage.age}
          </p>
          <h3 style={serif} className="mt-1.5 text-[12.5px] font-bold leading-[1.15] text-[#0F1F45]">
            {stage.title}
          </h3>
          <Icon className="mt-2 h-4 w-4 text-[#C9922E]" strokeWidth={1.7} />
          <p className="mt-1.5 text-[10.5px] leading-[1.35] text-[#475569]">
            <span className="font-bold text-[#0F1F45]">Focus: </span>
            {stage.focus}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function LifeStagesSection() {
  const isXL = useIsXL();
  const wrapRef = useRef(null);
  const gridRef = useRef(null);
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#FBF8F3] to-white py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-xl xl:max-w-[470px] text-center xl:text-left mx-auto xl:mx-0"
        >
          <span className="inline-flex items-center gap-3 font-sora text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.28em] text-[#9A7220]">
            <span className="h-px w-8 bg-[#C9922E]/60" />
            A plan for every stage of life
          </span>
          <h2 style={serif} className="mt-3 text-[32px] sm:text-[40px] lg:text-[46px] font-bold leading-[1.05] tracking-tight text-[#0F1F45]">
            From Today
            <span className="block text-[#B8862B]">to Generations</span>
          </h2>
          <p className="mt-3 text-[14.5px] sm:text-[15.5px] leading-[1.55] text-[#475569]">
            Comprehensive financial planning across every stage of life — building security, wealth and legacy for you and your family.
          </p>
        </motion.div>

        {/* Staircase (desktop) / grid (smaller screens) */}
        <div ref={wrapRef} className="relative mt-8 xl:-mt-36">
          <div ref={gridRef} className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 xl:items-start xl:gap-3.5">
            {STAGES.map((stage, i) => (
              <StageCard key={stage.age} stage={stage} index={i} />
            ))}
          </div>

          {/* a person walks along the ribbon and ages with the cards (desktop staircase) */}
          {isXL && <LifeJourneyWalker stages={WALK_STAGES} wrapRef={wrapRef} gridRef={gridRef} />}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10 flex flex-col items-center justify-between gap-5 sm:flex-row"
        >
          <p className="text-center text-xs font-semibold uppercase leading-relaxed tracking-[0.22em] text-[#64748B] sm:text-left">
            Different stages. One financial partner.
            <br />
            For a brighter tomorrow.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#0F1F45] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(15,31,69,0.3)] transition-all hover:shadow-[0_14px_34px_rgba(15,31,69,0.42)]"
          >
            Plan my stage
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
