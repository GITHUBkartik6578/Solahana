import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Check, Users, Globe, Briefcase, UserRound, BarChart3, ShieldCheck, GraduationCap, Landmark, Target,
} from 'lucide-react';
import { openConsultation } from '../data/whoWeServe';
import HeroBanner from '../components/common/HeroBanner';
import heroBanner from '../assets/who-we-serve-hero.webp';

// Photography: sharp originals already used across the site (swap these files for new photos, no code change needed)
import heroPhoto from '../assets/planning/pms-hero.webp';
import photoFamilies from '../assets/who-we-serve-families.webp';
import photoNri from '../assets/who-we-serve-nri.webp';
import photoBusiness from '../assets/who-we-serve-business.webp';
import photoSenior from '../assets/who-we-serve-senior.webp';
import photoFiduciary from '../assets/who-we-serve-fiduciary.webp';
import photoCta from '../assets/planning/fp-cta.webp';

const serif = { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" };

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

const HERO_CHIPS = [
  { icon: BarChart3, label: 'Wealth Today' },
  { icon: Users, label: 'Family Tomorrow' },
  { icon: ShieldCheck, label: 'Legacy Forever' },
];

// `id` keeps the old deep links (/who-we-serve#families, #nri, #business-owners, #salaried) working.
const SEGMENTS = [
  {
    id: 'families',
    icon: Users,
    photo: photoFamilies,
    title: 'High-Net-Worth & Ultra-HNI Families',
    desc: 'Multi-generational wealth preservation, private family trusts, asset structuring, and estate planning.',
    points: ['Family office solutions', 'Legacy and succession planning', 'Tax-efficient wealth transfer', 'Global asset coordination'],
    to: '/estate-planning',
  },
  {
    id: 'nri',
    icon: Globe,
    photo: photoNri,
    title: 'Non-Resident Indians (NRIs)',
    desc: 'Cross-border asset coordination, repatriation rules, FEMA compliance, and strategic Indian market investments.',
    points: ['India & global portfolio alignment', 'FEMA and regulatory guidance', 'Remote wealth management', 'Seamless reporting and updates'],
    to: '/investments',
  },
  {
    id: 'business-owners',
    icon: Briefcase,
    photo: photoBusiness,
    title: 'Successful Business Owners & Entrepreneurs',
    desc: 'Business-to-personal wealth bridging, corporate surplus structuring, risk mitigation, and liquidity planning.',
    points: ['Separate business and personal risk', 'Corporate treasury investments', 'Liquidity and exit planning', 'Wealth creation beyond business'],
    to: '/tax-planning',
  },
  {
    id: 'salaried',
    icon: UserRound,
    photo: photoSenior,
    title: 'Senior Professionals & Corporate Leaders',
    desc: 'ESOP structuring, retirement cash-flow modeling, tax-efficient portfolio scaling, and goal-based planning.',
    points: ['ESOP and equity compensation', 'Retirement income planning', 'Tax-efficient growth strategies', 'Transition from active to passive income'],
    to: '/calculators/retirement',
  },
];

const DISTINCTIONS = [
  { icon: GraduationCap, title: 'Certified Expertise', desc: 'Strategic guidance rooted in rigorous CWM® and CFP® methodologies.' },
  { icon: ShieldCheck, title: 'Independent Model', desc: 'Zero product pushing; your portfolio is built strictly on merit and your family’s best interests.' },
  { icon: Landmark, title: 'Institutional Execution', desc: 'Safe and transparent routing through verified SEBI and AMFI-registered channel partners.' },
];

const COMMITMENTS = [
  { icon: Target, label: 'Personalised Strategy' },
  { icon: Users, label: 'Experienced Guidance' },
  { icon: ShieldCheck, label: 'Long-Term Partnership' },
  { icon: BarChart3, label: 'Generational Prosperity' },
];

function Eyebrow({ children, light }) {
  return (
    <p className={`inline-flex items-center gap-3 font-sora text-[12px] font-bold uppercase tracking-[0.28em] ${light ? 'text-[#E2B24E]' : 'text-[#9A7220]'}`}>
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

function RoundIcon({ icon: Icon, size = 'h-11 w-11', iconSize = 'h-5 w-5' }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full border border-[#E2B24E]/70 text-[#E2B24E]`}>
      <Icon className={iconSize} strokeWidth={1.6} />
    </span>
  );
}

/** "Different journeys" panel, shown over the desktop hero banner */
function JourneysPanel() {
  return (
    <div className="absolute right-8 top-[9%] w-[200px] rounded-xl bg-[#07122b]/55 p-4 backdrop-blur-[2px]">
      <p style={serif} className="text-[19px] font-semibold uppercase leading-[1.25] tracking-[0.04em] text-white">
        Different Journeys.<br />A Common Destination.
      </p>
      <span aria-hidden="true" className="mt-3 block h-[2px] w-10 bg-[#C9922E]" />
      <ul className="mt-4 space-y-3">
        {HERO_CHIPS.map((c) => (
          <li key={c.label} className="flex items-center gap-3">
            <RoundIcon icon={c.icon} size="h-10 w-10" iconSize="h-[18px] w-[18px]" />
            <span className="text-[13px] font-semibold leading-tight text-white">{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Hero() {
  const navigate = useNavigate();
  return (
    <>
    {/* Desktop: the ready-made hero banner; its two buttons get invisible click areas */}
    <HeroBanner
      src={heroBanner}
      alt="Who We Serve. Tailored Wealth Architecture for Distinct Ambitions."
      ratio={1599 / 650}
      fit={0.93}
      minH={400}
      overlay={<JourneysPanel />}
      hotspots={[
        { label: 'Schedule Your Private Consultation', onClick: () => openConsultation(), style: { left: '3.9%', top: '86%', width: '26.7%', height: '9.2%' } },
        { label: 'Explore Our Approach', onClick: () => navigate('/our-process'), style: { left: '31.9%', top: '86%', width: '16.4%', height: '9.2%' } },
      ]}
    />

    {/* Tablet / mobile: live-text hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C] pt-[80px] lg:hidden">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-[480px] w-[480px] rounded-full bg-[#C9922E]/15 blur-[120px]" />
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:min-h-[clamp(520px,calc(100svh-80px),680px)] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 py-10 lg:max-w-[52%] lg:py-12">
          <Eyebrow light>Who We Serve</Eyebrow>
          <h1 style={serif} className="[text-wrap:balance] mt-5 text-[40px] font-semibold leading-[1.06] text-white sm:text-[52px] lg:text-[clamp(44px,4.4vw,64px)]">
            Tailored Wealth Architecture for <span className="text-[#E2B24E]">Distinct Ambitions.</span>
          </h1>
          <p className="[text-wrap:pretty] mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-slate-200 sm:text-[17px]">
            Whether you are scaling a business, managing a multi-generational estate, or navigating cross-border investments as an NRI—Solahana delivers objective, fiduciary wealth management backed by CWM® expertise.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <GoldBtn onClick={() => openConsultation()}>Schedule Your Private Consultation</GoldBtn>
            <Link
              to="/our-process"
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Our Approach
            </Link>
          </div>

          {/* mobile: chips sit under the buttons */}
          <ul className="mt-8 grid grid-cols-3 gap-3 lg:hidden">
            {HERO_CHIPS.map((c) => (
              <li key={c.label} className="flex flex-col items-center gap-2 text-center">
                <RoundIcon icon={c.icon} />
                <span className="text-[12.5px] font-semibold text-slate-100">{c.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto h-[300px] w-full max-w-[560px] overflow-hidden sm:h-[380px] lg:absolute lg:bottom-0 lg:right-0 lg:top-[80px] lg:h-auto lg:w-[54%] lg:max-w-[880px] [mask-image:linear-gradient(to_right,transparent,black_14%)]"
        >
          <img src={heroPhoto} alt="Solahana advisor looking over the city skyline at dusk" draggable="false" className="absolute inset-0 h-full w-full object-cover object-[60%_40%]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[46%] bg-gradient-to-l from-[#0A1836] from-30% via-[#0A1836]/90 to-transparent" />
        </motion.div>

      </div>
    </section>
    </>
  );
}

function Segments() {
  return (
    <section id="segments" className="scroll-mt-20 bg-[#FEFDF9] pb-10 pt-16 sm:pt-20 lg:pb-12 lg:pt-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <Eyebrow>Our Core Client Segments</Eyebrow>
            <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.1] text-[#0F1F45] sm:text-[46px]">
              Four Distinct Journeys. One Trusted Partner.
            </h2>
          </div>
          <p className="[text-wrap:pretty] max-w-[56ch] text-[16px] leading-relaxed text-[#475569]">
            Every individual, family, and business has unique financial goals and challenges. Solahana crafts customized wealth architectures designed around your specific life stage and ambitions.
          </p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SEGMENTS.map((s, i) => (
            <motion.article
              key={s.id}
              id={s.id}
              {...fade}
              transition={{ duration: 0.55, delay: i * 0.06 }}
              className="group flex scroll-mt-28 flex-col overflow-hidden rounded-2xl border border-[#E7E2D5] bg-white shadow-[0_10px_30px_rgba(15,31,69,0.07)] transition-shadow hover:shadow-[0_18px_44px_rgba(15,31,69,0.14)]"
            >
              <div className="relative aspect-[241/130] overflow-hidden bg-[#0F1F45]">
                <img src={s.photo} alt={s.title} loading="lazy" draggable="false" className="h-full w-full object-cover" />
              </div>
              <div className="relative flex flex-1 flex-col px-6 pb-6 pt-9">
                <span className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#E2B24E] bg-[#0F1F45] text-[#E2B24E] shadow-[0_8px_20px_rgba(15,31,69,0.3)]">
                  <s.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <h3 style={serif} className="[text-wrap:balance] text-[23px] font-semibold leading-tight text-[#0F1F45]">{s.title}</h3>
                <p className="[text-wrap:pretty] mt-3 text-[14.5px] leading-relaxed text-[#475569]">{s.desc}</p>
                <ul className="mt-4 space-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-[14px] font-medium leading-snug text-[#1E293B]">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#C9922E]/20 text-[#9A7220]">
                        <Check className="h-3 w-3" strokeWidth={3.2} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link to={s.to} className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-bold text-[#9A7220] transition-colors hover:text-[#0F1F45]">
                  Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fiduciary() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#F7F8FB] to-[#EEF1F8]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div className="relative h-[280px] overflow-hidden sm:h-[340px] lg:ml-[min(0px,calc((1320px-100vw)/2))] lg:h-[400px]">
          <img src={photoFiduciary} alt="Solahana adviser at his desk" loading="lazy" draggable="false" className="absolute inset-0 h-full w-full object-cover object-[55%_20%]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/4 bg-gradient-to-r from-transparent to-[#F7F8FB] lg:block" />
        </div>
        <motion.div {...fade} className="px-4 py-10 sm:px-8 lg:py-8 lg:pl-10 lg:pr-8">
          <Eyebrow>The Fiduciary Distinction</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mt-3 text-[28px] font-semibold leading-[1.1] text-[#0F1F45] sm:text-[36px]">
            Engineered for Absolute Clarity and Zero Bias
          </h2>
          <p className="[text-wrap:pretty] mt-3 max-w-[62ch] text-[14.5px] leading-relaxed text-[#475569]">
            Our advice is not driven by sales targets or proprietary products. It is driven solely by your goals, backed by professional expertise and executed through trusted institutions.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {DISTINCTIONS.map((d) => (
              <div key={d.title} className="rounded-2xl border border-[#E7E2D5] bg-white p-4 shadow-[0_8px_24px_rgba(15,31,69,0.06)]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#E6C27A] to-[#C9922E] text-[#0F1F45]">
                  <d.icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <h3 className="mt-3 font-sans text-[14.5px] font-bold leading-snug text-[#0F1F45]">{d.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-[1.5] text-[#475569]">{d.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C]">
      <img src={photoCta} alt="" aria-hidden="true" loading="lazy" draggable="false" className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[58%] object-cover opacity-80 [mask-image:linear-gradient(to_right,transparent,black_35%)] lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] bg-gradient-to-r from-transparent via-[#0A1836]/45 to-[#0A1836]/70 lg:block" />
      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-8">
        <motion.div {...fade}>
          <Eyebrow light>Your Journey. Our Commitment.</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mt-4 text-[34px] font-semibold leading-[1.08] text-[#E2B24E] sm:text-[48px]">
            Find Your Tailored Financial Roadmap.
          </h2>
          <p className="[text-wrap:pretty] mt-4 max-w-[48ch] text-[16px] leading-relaxed text-slate-200">
            Let’s discuss how our independent family office framework fits your unique journey.
          </p>
          <GoldBtn onClick={() => openConsultation()} className="mt-7">Schedule Your Private Consultation</GoldBtn>
        </motion.div>
        <motion.ul {...fade} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:pl-16">
          {COMMITMENTS.map((c) => (
            <li key={c.label} className="flex items-center gap-4">
              <RoundIcon icon={c.icon} size="h-12 w-12" />
              <span className="text-[15px] font-semibold text-white">{c.label}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default function WhoWeServePage() {
  return (
    <div className="relative z-10 bg-white">
      <Hero />
      <Segments />
      <Fiduciary />
      <Closing />
    </div>
  );
}
