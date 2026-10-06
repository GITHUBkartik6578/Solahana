import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Percent, Building2, FileText, ShieldCheck, Users } from 'lucide-react';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const STEPS = [
  {
    title: ['Strategic', 'Tax Optimization'],
    desc: 'Smart asset allocation, capital gains harvesting, and proactive tax planning under applicable regimes.',
    icon: Percent,
    to: '/tax-planning',
  },
  {
    title: ['Business &', 'Corporate Structuring'],
    desc: 'Tailored tax-efficient frameworks for entrepreneurs, professionals, and LLPs to optimize cash flows.',
    icon: Building2,
    to: '/tax-planning',
  },
  {
    title: ['Will Planning'],
    desc: 'Legally sound and watertight wills to ensure the precise, peaceful distribution of your personal assets.',
    icon: FileText,
    to: '/estate-planning',
  },
  {
    title: ['Private Family Trusts'],
    desc: 'Institutional-grade trust structuring for asset protection, privacy, and smooth generational wealth transfer.',
    icon: ShieldCheck,
    to: '/estate-planning',
  },
  {
    title: ['Succession &', 'Estate Planning'],
    desc: 'Structured legacy roadmaps, inter-generational gifting, and seamless transition frameworks for families.',
    icon: Users,
    to: '/estate-planning',
  },
];

// desktop staircase geometry (px): each step sits STEP higher than the one before
const STEP = 54;
const COL = 20.5; // % between card left edges

function StepCard({ step, index }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        to={step.to}
        className="group relative flex h-full flex-col rounded-2xl border border-[#E4C98F] bg-gradient-to-br from-white via-[#FEFDF9] to-[#FBF3E1] p-5 shadow-[0_14px_32px_rgba(15,31,69,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgba(15,31,69,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F5BC7]/25"
      >
        <div className="flex items-start justify-between">
          <span style={serif} className="text-[26px] font-bold leading-none text-[#C9922E]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Icon className="h-9 w-9 text-[#C9922E]" strokeWidth={1.3} />
        </div>
        <span className="mt-2 block h-[2px] w-6 rounded-full bg-[#C9922E]" />
        <h3 style={serif} className="mt-3 text-[17px] font-bold leading-[1.2] text-[#0F1F45]">
          {step.title[0]}
          {step.title[1] && <span className="block">{step.title[1]}</span>}
        </h3>
        <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-[#475569]">{step.desc}</p>
        <span className="mt-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#C9922E] text-[#B8862B] transition-colors group-hover:bg-[#0F1F45] group-hover:text-white">
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function TaxLegacySection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#F6F8FD] to-white py-14 sm:py-16 lg:py-20"
      aria-label="Tax and legacy architecture"
    >
      <style>{`
        @media (min-width: 1280px) {
          .tl-step { left: var(--l); bottom: var(--b); }
        }
      `}</style>
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative xl:h-[650px]">
          {/* gold climbing line behind the steps (desktop) */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block"
            viewBox="0 0 1000 650"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 95 362 C 170 358, 230 325, 300 308 S 430 272, 505 254 S 640 218, 710 200 S 850 160, 915 146"
              stroke="#C9922E"
              strokeOpacity="0.75"
              strokeWidth="1.6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center xl:absolute xl:left-0 xl:top-0 xl:mx-0 xl:w-[50%] xl:max-w-none xl:text-left"
          >
            <span className="inline-flex items-center gap-3 font-sora text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.3em] text-[#9A7220]">
              <span className="h-px w-8 bg-[#C9922E]/60" />
              Tax &amp; Legacy Architecture
            </span>
            <h2 style={serif} className="mt-4 text-[32px] sm:text-[42px] xl:text-[clamp(34px,3.4vw,46px)] font-bold leading-[1.1] tracking-tight text-[#0F1F45]">
              Build Wealth.
              <span className="block xl:whitespace-nowrap">
                Protect It. <span className="text-[#B8862B]">Pass It Forward.</span>
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base sm:text-[17px] leading-relaxed text-[#475569] xl:mx-0 xl:max-w-[430px]">
              From tax-efficient structuring to succession, we help you preserve wealth today and transition it with clarity tomorrow.
            </p>
          </motion.div>

          {/* steps */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:mt-0 xl:block">
            {STEPS.map((step, i) => (
              <div key={step.title.join(' ')} className="tl-step xl:absolute xl:h-[280px] xl:w-[19%]" style={{ '--l': `${i * COL}%`, '--b': `${i * STEP}px` }}>
                <StepCard step={step} index={i} />
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-10 flex flex-col items-center text-center xl:absolute xl:bottom-2 xl:right-0 xl:mt-0 xl:w-[38%] xl:items-start xl:text-left"
          >
            <p style={serif} className="text-[20px] sm:text-[22px] font-bold leading-snug text-[#0F1F45]">
              Your wealth is more than a portfolio.
              <span className="block text-[#B8862B]">It is a legacy in the making.</span>
            </p>
            <Link
              to="/tax-planning"
              className="group mt-5 inline-flex items-center gap-2.5 rounded-full bg-[#0F1F45] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(15,31,69,0.3)] transition-all hover:shadow-[0_14px_34px_rgba(15,31,69,0.42)]"
            >
              Explore Tax &amp; Legacy Planning
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
