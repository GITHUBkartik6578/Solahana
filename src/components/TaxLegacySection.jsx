import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Percent, Building2, FileText, ShieldCheck, Users } from 'lucide-react';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const COPPER = '#A9591F';

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

// desktop: cards sit alternately lower / higher, like the approved design (px offsets from the top of the row)
const OFFSETS = [36, 0, 32, 0, 36];

function StepCard({ step, index }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="xl:[margin-top:var(--off)]"
      style={{ '--off': `${OFFSETS[index]}px` }}
    >
      <Link
        to={step.to}
        className="group relative flex h-full flex-col rounded-xl border border-[#EFE9E0] bg-white p-4 shadow-[0_10px_28px_rgba(15,31,69,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(15,31,69,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F5BC7]/25"
      >
        {/* icon on a soft peach disc with a pale blue shape behind it */}
        <span className="relative block h-[46px] w-[72px]">
          <span aria-hidden="true" className="absolute left-5 top-1.5 h-9 w-11 rounded-r-full bg-[#DFE8FB]" />
          <span aria-hidden="true" className="absolute left-0 top-0 h-[46px] w-[46px] rounded-full bg-[#FBEADB]" />
          <Icon className="absolute left-[12px] top-[12px] h-[22px] w-[22px] text-[#0F1F45]" strokeWidth={1.5} />
        </span>
        <span style={{ ...serif, color: COPPER }} className="mt-3 block text-[20px] font-medium leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span aria-hidden="true" className="mt-2 block h-[2px] w-6 rounded-full" style={{ background: COPPER }} />
        <h3 style={serif} className="mt-2 text-[16px] font-bold leading-[1.18] text-[#0F1F45]">
          {step.title[0]}
          {step.title[1] && <span className="block">{step.title[1]}</span>}
        </h3>
        <p className="mt-1.5 flex-1 text-[12px] leading-[1.5] text-[#64748B]">{step.desc}</p>
        <span
          className="mt-3 flex h-8 w-8 items-center justify-center rounded-full border transition-colors group-hover:bg-[#0F1F45] group-hover:text-white"
          style={{ borderColor: COPPER, color: COPPER }}
        >
          <ArrowRight className="h-4 w-4" />
        </span>
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
        <div className="mt-5 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:mt-1 xl:grid-cols-5">
          {STEPS.map((step, i) => (
            <StepCard key={step.title.join(' ')} step={step} index={i} />
          ))}
        </div>

        {/* closing line + button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-5 flex flex-col items-center text-center"
        >
          <p style={serif} className="text-[18px] font-bold leading-snug text-[#0F2A6B] sm:text-[21px]">
            Your wealth is more than a portfolio.
            <span className="block" style={{ color: COPPER }}>It is a legacy in the making.</span>
          </p>
          <Link
            to="/tax-planning"
            className="group mt-3 inline-flex items-center gap-2.5 rounded-full bg-[#0F2A6B] px-6 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_10px_26px_rgba(15,42,107,0.3)] transition-all hover:bg-[#0F1F45] hover:shadow-[0_14px_34px_rgba(15,31,69,0.42)]"
          >
            Explore Tax &amp; Legacy Planning
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
