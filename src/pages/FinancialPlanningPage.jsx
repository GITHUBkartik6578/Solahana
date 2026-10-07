import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowDown, ShieldCheck, Layers, Handshake, Home, Briefcase, TrendingUp, Receipt,
  Armchair, Users, Scroll, Landmark, Scale, Building2, GraduationCap, Wallet, HeartPulse, Umbrella, KeyRound, LifeBuoy,
  Coins, BarChart3, Sprout, FileText, Compass, Search, PencilRuler, Presentation, Rocket, Eye,
} from 'lucide-react';

// Photos cropped from the owner's Financial Planning design and upscaled (src/assets/planning/fp-*.webp)
import heroPhoto from '../assets/planning/fp-hero-nocoin.webp';
import archFinancial from '../assets/services/financial.webp';
import archInvest from '../assets/services/investment.webp';
import archRetire from '../assets/services/retirement.webp';
import archRisk from '../assets/services/risk.webp';
import archTax from '../assets/services/tax.webp';
import archEstate from '../assets/services/estate.webp';
import foGovernance from '../assets/planning/fp-f0.webp';
import foGenerations from '../assets/planning/fp-f1.webp';
import foBusiness from '../assets/planning/fp-f2.webp';
import foConstitution from '../assets/planning/fp-f3.webp';
import capLiquidity from '../assets/planning/fp-c0.webp';
import capCore from '../assets/planning/fp-c1.webp';
import capGrowth from '../assets/planning/fp-c2.webp';
import capLegacy from '../assets/planning/fp-c3.webp';
import umbrellaArt from '../assets/planning/fp-risk.webp';
import ctaArt from '../assets/planning/fp-cta.webp';
import { openConsultation } from '../data/whoWeServe';

const serif = { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" };
const BOOK = { goal: 'Financial Planning', message: 'I’d like to request a private consultation.' };
const book = () => openConsultation(BOOK);

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */
const TRUST = [
  { icon: Eye, label: 'Holistic Wealth View' },
  { icon: Layers, label: 'Institutional Planning Framework' },
  { icon: Handshake, label: 'Execution through Regulated Partners' },
];

const WEALTH_NODES = [
  { label: 'Business & Income', icon: Briefcase, to: '/who-we-serve#business-owners' },
  { label: 'Investments', icon: TrendingUp, to: '/investments' },
  { label: 'Tax', icon: Receipt, to: '/tax-planning' },
  { label: 'Retirement', icon: Armchair, to: '/calculators/retirement' },
  { label: 'Next Generation', icon: Users, to: '/goals' },
  { label: 'Estate & Legacy', icon: Scroll, to: '/estate-planning' },
  { label: 'Insurance & Protection', icon: ShieldCheck, to: '/risk-management' },
  { label: 'Lifestyle', icon: Home, to: '/goals' },
];

const ARCHITECTURE = [
  { title: 'Financial Planning', desc: 'A complete view of your current position and future goals.', art: archFinancial, to: '/goals' },
  { title: 'Investment Planning', desc: 'Multi-asset strategies aligned to your risk capacity.', art: archInvest, to: '/investments' },
  { title: 'Retirement & Cash Flow Planning', desc: 'Inflation-adjusted planning for financial independence.', art: archRetire, to: '/calculators/retirement' },
  { title: 'Risk Planning', desc: 'Protecting your family and wealth from uncertainties.', art: archRisk, to: '/risk-management' },
  { title: 'Tax Planning', desc: 'Strategic tax optimization across life stages.', art: archTax, to: '/tax-planning' },
  { title: 'Estate & Succession Planning', desc: 'Securing and transferring wealth across generations.', art: archEstate, to: '/estate-planning' },
];

const FAMILY_OFFICE = [
  { title: 'Family Governance', desc: 'Defining how financial decisions are made across generations.', photo: foGovernance, icon: Landmark },
  { title: 'Intergenerational Wealth', desc: 'Preparing assets, responsibilities and financial education for the next generation.', photo: foGenerations, icon: GraduationCap },
  { title: 'Business – Personal Wealth Integration', desc: 'Aligning entrepreneurial cash flows with personal wealth milestones.', photo: foBusiness, icon: Building2 },
  { title: 'Family Constitution & Succession Framework', desc: 'Creating clarity around roles, ownership, succession and continuity.', photo: foConstitution, icon: Scale },
];

const CASH_FLOW = [
  { label: 'Income', icon: Wallet },
  { label: 'Lifestyle', icon: Home },
  { label: 'Business', icon: Briefcase },
  { label: 'Investments', icon: BarChart3 },
  { label: 'Tax', icon: Receipt },
  { label: 'Protection', icon: ShieldCheck },
  { label: 'Liquidity', icon: Coins },
  { label: 'Legacy', icon: Landmark },
];

const CAPITAL = [
  { title: 'Liquidity Capital', desc: 'For immediate and near-term requirements.', art: capLiquidity },
  { title: 'Core Wealth', desc: 'Long-term diversified wealth creation.', art: capCore },
  { title: 'Growth Capital', desc: 'Higher-growth opportunities aligned to your aspirations.', art: capGrowth },
  { title: 'Legacy Capital', desc: 'Capital designed for future generations.', art: capLegacy },
];

const PROTECTION = [
  { label: 'Life', icon: HeartPulse },
  { label: 'Health', icon: LifeBuoy },
  { label: 'Business', icon: Briefcase },
  { label: 'Liability', icon: Scale },
  { label: 'Key Person', icon: KeyRound },
  { label: 'Contingency', icon: Umbrella },
];

const TAX_ESTATE = [
  { title: 'Tax Efficiency', desc: 'Strategic structuring to optimize taxes and enhance after-tax wealth.', icon: Receipt },
  { title: 'Legacy Continuity', desc: 'Will, Trust, Nomination and Succession planning with expert professionals.', icon: FileText },
];

const JOURNEY = [
  { n: '01', title: 'Discover', desc: 'Understand your financial landscape and aspirations.', icon: Compass },
  { n: '02', title: 'Diagnose', desc: 'Detailed analysis of assets, liabilities and gaps.', icon: Search },
  { n: '03', title: 'Architect', desc: 'Design your customized wealth blueprint.', icon: PencilRuler },
  { n: '04', title: 'Present', desc: 'Discuss and refine the plan with you.', icon: Presentation },
  { n: '05', title: 'Implement', desc: 'Execute through regulated partners.', icon: Rocket },
  { n: '06', title: 'Steward', desc: 'Ongoing monitoring, reviews and updates.', icon: Sprout },
];

/* ------------------------------------------------------------------ */
/* small pieces                                                        */
/* ------------------------------------------------------------------ */
function Eyebrow({ children, light }) {
  return (
    <p className={`inline-flex items-center gap-3 font-sora text-[12px] font-semibold uppercase tracking-[0.28em] ${light ? 'text-[#E2B24E]' : 'text-[#9A7220]'}`}>
      {children}
    </p>
  );
}

function GoldRule({ center }) {
  return <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full bg-[#C9922E] ${center ? 'mx-auto' : ''}`} />;
}

function RoundBtn() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2B24E]/70 text-[#E2B24E] transition-all duration-300 group-hover:bg-[#E2B24E] group-hover:text-[#0F1F45]">
      <ArrowRight className="h-4 w-4" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* sections                                                            */
/* ------------------------------------------------------------------ */
function Hero() {
  const scrollToFramework = () => document.getElementById('planning-framework')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C] pt-[80px]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-[480px] w-[480px] rounded-full bg-[#C9922E]/15 blur-[120px]" />
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:min-h-[clamp(500px,calc(100svh-80px),680px)] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 py-10 lg:max-w-[50%] lg:py-12">
          <h1 style={serif} className="[text-wrap:balance] text-[44px] font-semibold leading-[1.02] text-white sm:text-[58px] lg:text-[clamp(50px,4.6vw,68px)]">
            <span className="block text-[#E2B24E]">Architecting Wealth.</span>
            Preserving Legacy.
          </h1>
          <p className="[text-wrap:pretty] mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-slate-200 sm:text-[17px]">
            A structured financial planning framework for families seeking clarity across wealth, cash flows, investments, risk, taxation, retirement and succession.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={book}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Request a Private Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={scrollToFramework}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Our Planning Framework
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TRUST.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.label} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2B24E]/60 text-[#E2B24E]">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-[13px] font-semibold leading-snug text-slate-100">{t.label}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto h-[340px] w-full max-w-[560px] overflow-hidden sm:h-[440px] lg:absolute lg:bottom-0 lg:right-0 lg:top-[80px] lg:h-auto lg:w-[54%] lg:max-w-none [mask-image:linear-gradient(to_right,transparent,black_10%)]"
        >
          <img
            src={heroPhoto}
            alt="Amit R. Pandey, Chartered Wealth Manager"
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover object-[12%_30%]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[#0F1F45] to-transparent lg:hidden" />
        </motion.div>
      </div>
    </section>
  );
}

function Problem() {
  return (
    <section className="bg-[#FEFDF9] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 lg:px-8">
        <motion.div {...fade}>
          <Eyebrow>The Problem</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mt-4 text-[36px] font-semibold leading-[1.08] text-[#0F1F45] sm:text-[48px]">
            Your Wealth Is Connected.
            <span className="block">Your Advice Should Be Too.</span>
          </h2>
          <GoldRule />
          <p className="[text-wrap:pretty] mt-6 max-w-[56ch] text-[16px] leading-relaxed text-[#475569]">
            Most families deal with multiple advisors working in isolation — investment agents, insurance brokers, tax consultants and legal experts. This leads to a fragmented view and missed opportunities.
          </p>
          <span className="mt-6 block h-px w-14 bg-[#C9922E]/50" />
          <p className="mt-6 max-w-[40ch] text-[17px] font-bold leading-snug text-[#0F1F45]">
            Solahana brings it all together through one consolidated wealth map.
          </p>
        </motion.div>

        <motion.div {...fade} className="relative mx-auto aspect-square w-full max-w-[460px]">
          <span aria-hidden="true" className="absolute inset-[6%] rounded-full border border-dashed border-[#C9922E]/50" />
          <div className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#1A3170] to-[#0F1F45] p-3 text-center shadow-[0_18px_40px_rgba(15,31,69,0.35)] ring-4 ring-[#E6C27A]/50">
            <span className="font-sora text-[11px] font-bold uppercase leading-snug tracking-[0.14em] text-white sm:text-[12.5px]">
              One consolidated wealth map
            </span>
          </div>
          {WEALTH_NODES.map((n, i) => {
            const a = (i / WEALTH_NODES.length) * 2 * Math.PI - Math.PI / 2;
            const Icon = n.icon;
            return (
              <Link
                key={n.label}
                to={n.to}
                style={{ left: `${50 + 41 * Math.cos(a)}%`, top: `${50 + 41 * Math.sin(a)}%` }}
                className="group absolute flex w-[96px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-2xl text-center outline-none focus-visible:ring-2 focus-visible:ring-[#C9922E] sm:w-[110px]"
              >
                <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[#E4D2A6] bg-white text-[#B8862B] shadow-[0_8px_20px_rgba(15,31,69,0.12)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#C9922E] group-hover:bg-[#0F1F45] group-hover:text-[#E2B24E] group-hover:shadow-[0_14px_28px_rgba(201,146,46,0.35)] sm:h-14 sm:w-14">
                  <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.6} />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-[#0F1F45] transition-colors group-hover:text-[#B8862B] sm:text-[12px]">{n.label}</span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section id="planning-framework" className="scroll-mt-20 bg-gradient-to-b from-[#0A1836] to-[#0F1F45] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="text-center">
          <Eyebrow light>Our Solahana Architecture</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mx-auto mt-4 max-w-3xl text-[34px] font-semibold leading-[1.1] text-white sm:text-[46px]">
            From Financial Complexity to One Master Blueprint
          </h2>
          <GoldRule center />
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {ARCHITECTURE.map((c, i) => (
            <motion.div key={c.title} {...fade} transition={{ duration: 0.5, delay: i * 0.06 }}>
              <Link
                to={c.to}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#102552] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E2B24E]/60 hover:shadow-[0_22px_44px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B24E]"
              >
                <div className="relative h-[190px] overflow-hidden bg-[#0F1F45]">
                  {/* soft backdrop: the same art enlarged and blurred so the sides blend in */}
                  <img src={c.art} alt="" aria-hidden="true" loading="lazy" draggable="false" className="absolute inset-0 h-full w-full scale-150 object-cover object-bottom blur-xl" />
                  {/* the artwork itself */}
                  <img
                    src={c.art}
                    alt=""
                    loading="lazy"
                    draggable="false"
                    className="absolute bottom-0 left-1/2 h-[128%] w-auto max-w-none -translate-x-1/2 transition-transform duration-500 group-hover:scale-105 [mask-image:linear-gradient(to_right,transparent_0%,black_20%,black_80%,transparent_100%)]"
                  />
                  <span className="absolute left-4 top-3 font-serif-luxury text-[24px] leading-none text-[#F1D9A3]">
                    {String(i + 1).padStart(2, '0')}
                    <span className="mt-1.5 block h-px w-5 bg-[#F1D9A3]/80" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[18px] font-semibold leading-tight text-white">{c.title}</h3>
                  <p className="[text-wrap:pretty] mt-2 flex-1 text-[13px] leading-relaxed text-slate-300">{c.desc}</p>
                  <div className="mt-4"><RoundBtn /></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FamilyOffice() {
  return (
    <section className="bg-[#F7F8FB] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <Eyebrow>Beyond Standard Planning</Eyebrow>
            <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.1] text-[#0F1F45] sm:text-[46px]">Private Family Office Services</h2>
            <GoldRule />
          </div>
          <p className="[text-wrap:pretty] text-[15.5px] leading-relaxed text-[#475569]">
            For business families and high-net-worth individuals, we offer a deeper layer of planning focused on governance, continuity and legacy.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILY_OFFICE.map((c, i) => (
            <motion.div key={c.title} {...fade} transition={{ duration: 0.5, delay: i * 0.07 }} className="group">
              <div className="h-[170px] overflow-hidden rounded-xl bg-[#0A1836] shadow-[0_12px_28px_rgba(15,31,69,0.12)]">
                <img src={c.photo} alt="" loading="lazy" draggable="false" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="mt-4 text-[16.5px] font-bold leading-snug text-[#0F1F45]">{c.title}</h3>
              <p className="[text-wrap:pretty] mt-1.5 text-[14px] leading-relaxed text-[#475569]">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CashFlow() {
  return (
    <section className="bg-gradient-to-b from-[#0A1836] to-[#0F1F45] py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <Eyebrow light>Cash Flow Intelligence</Eyebrow>
            <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.1] text-white sm:text-[46px]">
              We Don’t Just Look at Your Assets.
              <span className="block">We Map Your Money.</span>
            </h2>
          </div>
          <p className="[text-wrap:pretty] text-[15.5px] leading-relaxed text-slate-300">
            A detailed cash flow analysis helps us understand how your income, expenses, business cash flows and investments work together — so you can make better decisions today and tomorrow.
          </p>
        </motion.div>

        <ol className="mt-12 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 lg:grid-cols-8">
          {CASH_FLOW.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li key={s.label} {...fade} transition={{ duration: 0.45, delay: i * 0.06 }} className="relative flex flex-col items-center text-center">
                <span className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[#E2B24E]/60 bg-[#102552] text-[#E2B24E] shadow-[0_0_0_6px_rgba(226,178,78,0.08)]">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <span className="mt-3 text-[13.5px] font-semibold text-white">{s.label}</span>
                {i < CASH_FLOW.length - 1 && (
                  <ArrowRight aria-hidden="true" className="absolute right-[-14px] top-[24px] hidden h-4 w-4 text-[#E2B24E]/70 lg:block" />
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function CapitalSection() {
  return (
    <section className="bg-[#FEFDF9] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <Eyebrow>Investment Architecture</Eyebrow>
            <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.1] text-[#0F1F45] sm:text-[46px]">Capital With a Purpose</h2>
            <GoldRule />
          </div>
          <p className="[text-wrap:pretty] text-[15.5px] leading-relaxed text-[#475569]">
            A multi-asset approach designed around your goals, time horizon and risk profile.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPITAL.map((c, i) => (
            <motion.div
              key={c.title}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex items-center gap-4 rounded-xl bg-[#F1EEE7] p-3 transition-shadow hover:shadow-[0_12px_28px_rgba(15,31,69,0.1)]"
            >
              <img src={c.art} alt="" loading="lazy" draggable="false" className="h-[84px] w-[84px] shrink-0 rounded-lg bg-[#0A1836] object-cover" />
              <div>
                <h3 className="text-[17px] font-semibold leading-tight text-[#0F1F45]">{c.title}</h3>
                <p className="mt-1.5 text-[13px] leading-snug text-[#475569]">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RiskAndTax() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <motion.div {...fade} className="relative overflow-hidden bg-[#0A1836] px-6 py-14 sm:px-10 lg:py-16 lg:pl-[max(2rem,calc((100vw-1320px)/2+2rem))]">
        <img src={umbrellaArt} alt="" loading="lazy" draggable="false" className="absolute inset-y-0 right-0 h-full w-[62%] object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0A1836] via-[#0A1836]/85 to-transparent" />
        <div className="relative">
          <Eyebrow light>Risk &amp; Protection</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mt-4 max-w-md text-[34px] font-semibold leading-[1.1] text-white sm:text-[42px]">
            Protect the Architecture
            <span className="block">Before You Grow It.</span>
          </h2>
          <ul className="mt-9 flex flex-wrap items-start gap-x-1 gap-y-6">
            {PROTECTION.map((p, i) => {
              const Icon = p.icon;
              return (
                <li key={p.label} className="flex items-start">
                  <div className="flex w-[66px] flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E2B24E]/70 bg-[#0A1836]/70 text-[#E2B24E] backdrop-blur-sm">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </span>
                    <span className="mt-2 text-[12px] font-semibold text-white">{p.label}</span>
                  </div>
                  {i < PROTECTION.length - 1 && <span aria-hidden="true" className="mt-7 hidden h-px w-3 bg-[#E2B24E]/50 sm:block" />}
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>

      <motion.div {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="flex flex-col justify-center bg-[#F7F5EF] px-6 py-14 sm:px-10 lg:py-16 lg:pr-[max(2rem,calc((100vw-1320px)/2+2rem))]">
        <Eyebrow>Tax &amp; Estate Planning</Eyebrow>
        <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.1] text-[#0F1F45] sm:text-[42px]">
          Efficiency Today.
          <span className="block">Legacy Tomorrow.</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TAX_ESTATE.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="flex items-start gap-4 rounded-xl bg-white/80 p-5 shadow-[0_8px_22px_rgba(15,31,69,0.06)]">
                <Icon className="mt-0.5 h-9 w-9 shrink-0 text-[#B8862B]" strokeWidth={1.4} />
                <div>
                  <h3 className="text-[15px] font-bold text-[#0F1F45]">{t.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-snug text-[#475569]">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function Journey() {
  return (
    <section className="bg-[#FEFDF9] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <Eyebrow>The Solahana Wealth Planning Journey</Eyebrow>
            <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.1] text-[#0F1F45] sm:text-[46px]">A Structured 6-Step Process</h2>
            <GoldRule />
          </div>
          <p className="[text-wrap:pretty] text-[15.5px] leading-relaxed text-[#475569]">
            A disciplined and transparent process to build your customized financial plan and help you stay on track.
          </p>
        </motion.div>

        <ol className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {JOURNEY.map((st, i) => (
            <motion.li key={st.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="relative flex flex-col items-center text-center">
              <span className="relative z-10 flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#C9922E] bg-[#FEFDF9] font-sora text-[15px] font-semibold text-[#9A7220] shadow-[0_0_0_6px_rgba(201,146,46,0.08)]">
                {st.n}
              </span>
              {i < JOURNEY.length - 1 && (
                <span aria-hidden="true" className="absolute left-[calc(50%+40px)] right-[calc(-50%+40px)] top-[29px] hidden items-center lg:flex">
                  <span className="h-px flex-1 bg-[#C9922E]/60" />
                  <ArrowRight className="-ml-1 h-3.5 w-3.5 text-[#C9922E]" />
                </span>
              )}
              <h3 className="mt-4 text-[16px] font-bold text-[#0F1F45]">{st.title}</h3>
              <p className="mt-1.5 max-w-[22ch] text-[13px] leading-snug text-[#475569]">{st.desc}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-[#0A1836]">
      <img src={ctaArt} alt="" aria-hidden="true" loading="lazy" draggable="false" className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-cover sm:w-[72%] [mask-image:linear-gradient(to_right,transparent,black_35%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0A1836] via-[#0A1836]/85 to-[#0A1836]/10" />
      <motion.div {...fade} className="relative mx-auto max-w-[1320px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <h2 style={serif} className="[text-wrap:balance] text-[38px] font-semibold leading-[1.05] text-white sm:text-[52px]">
          <span className="block text-[#E2B24E]">Your Wealth Deserves</span>
          a Master Plan.
        </h2>
        <p className="[text-wrap:pretty] mt-4 max-w-[52ch] text-[16px] leading-relaxed text-slate-200">
          Begin a private conversation with Solahana and take the first step towards a more secure and fulfilling future.
        </p>
        <button
          type="button"
          onClick={book}
          className="group mt-7 inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.35)] transition-transform hover:-translate-y-0.5"
        >
          Request a Private Consultation
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>
    </section>
  );
}

export default function FinancialPlanningPage() {
  return (
    <div className="relative z-10">
      <Hero />
      <Problem />
      <Architecture />
      <FamilyOffice />
      <CashFlow />
      <CapitalSection />
      <RiskAndTax />
      <Journey />
      <ClosingCta />
    </div>
  );
}
