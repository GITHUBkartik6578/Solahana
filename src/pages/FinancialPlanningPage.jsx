import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowDown, Phone, ShieldCheck, Layers, Handshake, Home, Briefcase, TrendingUp, Receipt,
  Armchair, Users, Scroll, Landmark, Scale, Building2, GraduationCap, Wallet, HeartPulse, Umbrella, KeyRound, LifeBuoy,
  Coins, BarChart3, Sprout, FileText, Compass, Search, PencilRuler, Presentation, Rocket, Eye,
} from 'lucide-react';

import heroPhoto from '../assets/about-photo.webp';
import compassArt from '../assets/services/financial.webp';
import investArt from '../assets/services/investment.webp';
import retireArt from '../assets/services/retirement.webp';
import riskArt from '../assets/services/risk.webp';
import taxArt from '../assets/services/tax.webp';
import estateArt from '../assets/services/estate.webp';
import cashArt from '../assets/services/cashflow.webp';
import growthArt from '../assets/stages/05.webp';
import legacyArt from '../assets/stages/08.webp';
import umbrellaArt from '../assets/stages/06.webp';
import { openConsultation } from '../data/whoWeServe';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
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
  { icon: Layers, label: 'Institutional Planning Partners' },
  { icon: Handshake, label: 'Execution through Regulated Partners' },
];

const WEALTH_NODES = [
  { label: 'Business & Income', icon: Briefcase },
  { label: 'Investments', icon: TrendingUp },
  { label: 'Tax', icon: Receipt },
  { label: 'Retirement', icon: Armchair },
  { label: 'Next Generation', icon: Users },
  { label: 'Estate & Legacy', icon: Scroll },
  { label: 'Insurance & Protection', icon: ShieldCheck },
  { label: 'Lifestyle', icon: Home },
];

const ARCHITECTURE = [
  { title: 'Financial Planning', desc: 'A complete view of your current position and future goals.', art: compassArt, to: '/goals' },
  { title: 'Investment Planning', desc: 'Portfolio strategies aligned to your objectives and risk capacity.', art: investArt, to: '/investments' },
  { title: 'Retirement & Cash Flow Planning', desc: 'Inflation-adjusted planning for financial independence.', art: retireArt, to: '/calculators/retirement' },
  { title: 'Risk Planning', desc: 'Protecting your family and wealth from uncertainties.', art: riskArt, to: '/risk-management' },
  { title: 'Tax Planning', desc: 'Strategic tax optimisation for today and your legacy.', art: taxArt, to: '/tax-planning' },
  { title: 'Estate & Succession Planning', desc: 'Securing and transferring wealth across generations.', art: estateArt, to: '/estate-planning' },
];

const FAMILY_OFFICE = [
  { title: 'Family Governance', desc: 'Defining how financial decisions are made across generations.', icon: Landmark },
  { title: 'Intergenerational Wealth', desc: 'Preparing assets, responsibility and financial education for the next generation.', icon: GraduationCap },
  { title: 'Business – Personal Wealth Integration', desc: 'Aligning entrepreneurial cash flows with personal wealth objectives.', icon: Building2 },
  { title: 'Family Constitution & Succession Framework', desc: 'Creating clarity around ownership, succession and continuity.', icon: Scale },
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
  { title: 'Liquidity Capital', desc: 'For immediate and near-term requirements.', art: cashArt },
  { title: 'Core Wealth', desc: 'Long-term diversified wealth creation.', art: growthArt },
  { title: 'Growth Capital', desc: 'Higher growth opportunities aligned to your risk appetite.', art: investArt },
  { title: 'Legacy Capital', desc: 'Capital designed for future generations.', art: legacyArt },
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
  { title: 'Tax Efficiency', desc: 'Strategic structuring across income, investments and succession.', icon: Receipt },
  { title: 'Legacy Continuity', desc: 'Wills, trusts and nominations planned with expert professionals.', icon: FileText },
];

const JOURNEY = [
  { n: '01', title: 'Discover', desc: 'Understand your financial landscape and aspirations.', icon: Compass },
  { n: '02', title: 'Diagnose', desc: 'Detailed analysis of assets, liabilities and cash flows.', icon: Search },
  { n: '03', title: 'Architect', desc: 'Design your customised wealth blueprint.', icon: PencilRuler },
  { n: '04', title: 'Present', desc: 'Discuss and refine the plan with you.', icon: Presentation },
  { n: '05', title: 'Implement', desc: 'Execute through regulated partners.', icon: Rocket },
  { n: '06', title: 'Steward', desc: 'Ongoing monitoring, reviews and updates.', icon: Sprout },
];

/* ------------------------------------------------------------------ */
/* small pieces                                                        */
/* ------------------------------------------------------------------ */
function Eyebrow({ children, light }) {
  return (
    <p className={`inline-flex items-center gap-3 font-sora text-[11.5px] font-bold uppercase tracking-[0.3em] ${light ? 'text-[#E2B24E]' : 'text-[#9A7220]'}`}>
      <span className="h-px w-8 bg-[#C9922E]/70" />
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
      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:min-h-[clamp(500px,calc(100svh-80px),680px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="py-10 lg:py-12">
          <Eyebrow light>Financial Planning</Eyebrow>
          <h1 style={serif} className="mt-5 text-[38px] font-bold leading-[1.08] tracking-tight text-white sm:text-[50px] lg:text-[clamp(40px,3.9vw,56px)]">
            Architecting Wealth.
            <span className="block text-[#E2B24E]">Preserving Legacy.</span>
          </h1>
          <p className="mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-slate-200 sm:text-[17px]">
            A structured financial planning framework for families seeking clarity across wealth, cash flows, investments, risk, taxation, retirement and succession.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={book}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.4)] transition-transform hover:-translate-y-0.5"
            >
              Request a Private Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={scrollToFramework}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
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
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto h-[360px] w-full max-w-[560px] self-end sm:h-[440px] lg:h-full lg:max-h-[680px] lg:max-w-none"
        >
          <img
            src={heroPhoto}
            alt="Amit R. Pandey, Chartered Wealth Manager"
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover object-[60%_20%] [mask-image:linear-gradient(to_right,transparent,black_22%,black_100%)] lg:[mask-image:linear-gradient(to_right,transparent,black_28%)]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0F1F45] to-transparent" />
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
          <h2 style={serif} className="mt-4 text-[32px] font-bold leading-[1.12] tracking-tight text-[#0F1F45] sm:text-[42px]">
            Your Wealth Is Connected.
            <span className="block text-[#B8862B]">Your Advice Should Be Too.</span>
          </h2>
          <GoldRule />
          <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-[#475569]">
            Most families deal with multiple advisors working in isolation — investment agents, insurance brokers, tax consultants and legal experts. This leads to a fragmented view and missed opportunities.
          </p>
          <span className="mt-6 block h-px w-14 bg-[#C9922E]/50" />
          <p style={serif} className="mt-6 max-w-[40ch] text-[20px] font-bold leading-snug text-[#0F1F45]">
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
              <div
                key={n.label}
                style={{ left: `${50 + 41 * Math.cos(a)}%`, top: `${50 + 41 * Math.sin(a)}%` }}
                className="absolute flex w-[96px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 text-center sm:w-[110px]"
              >
                <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[#E4D2A6] bg-white text-[#B8862B] shadow-[0_8px_20px_rgba(15,31,69,0.12)] sm:h-14 sm:w-14">
                  <Icon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.6} />
                </span>
                <span className="text-[11px] font-semibold leading-tight text-[#0F1F45] sm:text-[12px]">{n.label}</span>
              </div>
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
          <h2 style={serif} className="mx-auto mt-4 max-w-3xl text-[30px] font-bold leading-[1.15] tracking-tight text-white sm:text-[40px]">
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
                <div className="relative h-[150px] overflow-hidden bg-[#0A1836]">
                  <img src={c.art} alt="" loading="lazy" draggable="false" className="h-full w-full object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-105" />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#102552] to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 style={serif} className="text-[18px] font-bold leading-tight text-white">{c.title}</h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-slate-300">{c.desc}</p>
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
            <h2 style={serif} className="mt-4 text-[30px] font-bold leading-[1.15] tracking-tight text-[#0F1F45] sm:text-[40px]">Private Family Office Services</h2>
            <GoldRule />
          </div>
          <p className="text-[15.5px] leading-relaxed text-[#475569]">
            For business families and high-net-worth individuals, we offer a deeper layer of planning focused on governance, continuity and legacy.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILY_OFFICE.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border border-[#E7DFCF] bg-white p-6 shadow-[0_12px_30px_rgba(15,31,69,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,31,69,0.14)]"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A3170] to-[#0F1F45] text-[#E2B24E]">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h3 style={serif} className="mt-5 text-[18px] font-bold leading-tight text-[#0F1F45]">{c.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#475569]">{c.desc}</p>
              </motion.div>
            );
          })}
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
            <h2 style={serif} className="mt-4 text-[30px] font-bold leading-[1.15] tracking-tight text-white sm:text-[40px]">
              We Don’t Just Look at Your Assets.
              <span className="block text-[#E2B24E]">We Map Your Money.</span>
            </h2>
          </div>
          <p className="text-[15.5px] leading-relaxed text-slate-300">
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
            <h2 style={serif} className="mt-4 text-[30px] font-bold leading-[1.15] tracking-tight text-[#0F1F45] sm:text-[40px]">Capital With a Purpose</h2>
            <GoldRule />
          </div>
          <p className="text-[15.5px] leading-relaxed text-[#475569]">
            A multi-asset approach designed around your goals, time horizon and risk profile.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPITAL.map((c, i) => (
            <motion.div
              key={c.title}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="flex items-center gap-4 rounded-2xl border border-[#E7DFCF] bg-white p-4 shadow-[0_10px_26px_rgba(15,31,69,0.06)]"
            >
              <img src={c.art} alt="" loading="lazy" draggable="false" className="h-[88px] w-[72px] shrink-0 rounded-xl bg-[#0A1836] object-cover object-[center_40%]" />
              <div>
                <h3 style={serif} className="text-[17px] font-bold leading-tight text-[#0F1F45]">{c.title}</h3>
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
    <section className="bg-[#F7F8FB] py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-8">
        <motion.div {...fade} className="relative overflow-hidden rounded-3xl bg-[#0A1836] p-7 sm:p-10">
          <img src={umbrellaArt} alt="" loading="lazy" draggable="false" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0A1836] via-[#0A1836]/85 to-[#0A1836]/20" />
          <div className="relative">
            <Eyebrow light>Risk &amp; Protection</Eyebrow>
            <h2 style={serif} className="mt-4 max-w-md text-[28px] font-bold leading-[1.15] text-white sm:text-[36px]">Protect the Architecture Before You Grow It.</h2>
            <ul className="mt-8 grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-6">
              {PROTECTION.map((p) => {
                const Icon = p.icon;
                return (
                  <li key={p.label} className="flex flex-col items-center text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E2B24E]/60 bg-[#0A1836]/60 text-[#E2B24E] backdrop-blur-sm">
                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                    </span>
                    <span className="mt-2 text-[12.5px] font-semibold text-white">{p.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>

        <motion.div {...fade} transition={{ duration: 0.55, delay: 0.1 }} className="rounded-3xl border border-[#E7DFCF] bg-white p-7 shadow-[0_14px_36px_rgba(15,31,69,0.07)] sm:p-10">
          <Eyebrow>Tax &amp; Estate Planning</Eyebrow>
          <h2 style={serif} className="mt-4 text-[28px] font-bold leading-[1.15] text-[#0F1F45] sm:text-[34px]">
            Efficiency Today.
            <span className="block text-[#B8862B]">Legacy Tomorrow.</span>
          </h2>
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TAX_ESTATE.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="rounded-2xl border border-[#E7DFCF] bg-gradient-to-br from-white to-[#FBF3E1] p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A3170] to-[#0F1F45] text-[#E2B24E]">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <h3 style={serif} className="mt-4 text-[16.5px] font-bold text-[#0F1F45]">{t.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-snug text-[#475569]">{t.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
            <Link to="/tax-planning" className="inline-flex items-center gap-1.5 text-[#1A3170] underline-offset-4 hover:underline">Tax planning <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/estate-planning" className="inline-flex items-center gap-1.5 text-[#1A3170] underline-offset-4 hover:underline">Estate planning <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </motion.div>
      </div>
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
            <h2 style={serif} className="mt-4 text-[30px] font-bold leading-[1.15] tracking-tight text-[#0F1F45] sm:text-[40px]">A Structured 6-Step Process</h2>
            <GoldRule />
          </div>
          <p className="text-[15.5px] leading-relaxed text-[#475569]">
            A disciplined and transparent process to build your customised financial plan and help you stay on track.
          </p>
        </motion.div>

        <ol className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-4">
          <span aria-hidden="true" className="absolute left-[8%] right-[8%] top-[34px] hidden h-px bg-gradient-to-r from-[#C9922E]/20 via-[#C9922E] to-[#C9922E]/20 lg:block" />
          {JOURNEY.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li key={s.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-[#C9922E] bg-white text-[#0F1F45] shadow-[0_10px_24px_rgba(201,146,46,0.25)]">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                  <span style={serif} className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F1F45] text-[11px] font-bold text-[#E2B24E]">{s.n}</span>
                </span>
                <h3 style={serif} className="mt-4 text-[18px] font-bold text-[#0F1F45]">{s.title}</h3>
                <p className="mt-1.5 max-w-[24ch] text-[13px] leading-snug text-[#475569]">{s.desc}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="bg-[#F7F8FB] pb-16 pt-4 sm:pb-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#1A3170] px-7 py-12 sm:px-12 sm:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#C9922E]/25 blur-[90px]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 style={serif} className="text-[30px] font-bold leading-[1.12] text-white sm:text-[42px]">
                Your Wealth Deserves
                <span className="block text-[#E2B24E]">a Master Plan.</span>
              </h2>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-slate-200">
                Begin a private conversation with Solahana and take the first step towards a more secure and fulfilling future.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
              <button
                type="button"
                onClick={book}
                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-8 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.4)] transition-transform hover:-translate-y-0.5"
              >
                Request a Private Consultation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a href="tel:+917304442171" className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-[#E6C27A] transition-colors hover:text-white">
                <Phone className="h-4 w-4" />
                Or call +91 73044 42171
              </a>
            </div>
          </div>
        </motion.div>
      </div>
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
