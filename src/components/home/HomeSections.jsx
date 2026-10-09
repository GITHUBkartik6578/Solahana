import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Play, Gem, ChartColumnIncreasing, Users, ShieldCheck, Video, Volume2, Captions, Settings, PictureInPicture2, Maximize, ShieldPlus, Ban, FileText, Handshake, Armchair, Percent, Target,
  Globe, Earth, Building2, Plus, Coins,
} from 'lucide-react';
import { openConsultation } from '../../data/whoWeServe';
import founderPhoto from '../../assets/home-founder-card.webp';
import mountainArt from '../../assets/our-process-hero.webp';

// Set this to the YouTube / Vimeo link when the welcome video is ready; until then the video card says "Coming soon".
const WELCOME_VIDEO_URL = '';

const serif = { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" };
const playfair = { fontFamily: "'Playfair Display', Georgia, serif" };
const script = { fontFamily: "'Great Vibes', 'Alex Brush', cursive" };

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

function Eyebrow({ children, light, className = '' }) {
  return (
    <p className={`font-sora text-[11.5px] font-bold uppercase tracking-[0.28em] ${light ? 'text-[#E2B24E]' : 'text-[#C9922E]'} ${className}`}>
      {children}
    </p>
  );
}

function GoldArrowBtn({ children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-6 py-3 text-[13.5px] font-bold text-[#0F1F45] shadow-[0_10px_26px_rgba(201,146,46,0.32)] transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* 2. A personal welcome (video + client-first band)                   */
/* ------------------------------------------------------------------ */
const WELCOME_POINTS = [
  { icon: Gem, label: ['Independent', 'Guidance'] },
  { icon: ChartColumnIncreasing, label: ['Long-Term', 'Perspective'] },
  { icon: Users, label: ['Family-Centric', 'Approach'] },
];

const PLAYER_ICONS = [Captions, Settings, PictureInPicture2, Maximize];

/* video card styled like a player; "Coming soon" until WELCOME_VIDEO_URL is set */
function VideoCard() {
  return (
    <motion.div
      {...fade}
      className="relative isolate overflow-hidden rounded-xl bg-[#0A1428] shadow-[0_18px_44px_rgba(15,31,69,0.28)]"
      style={{ aspectRatio: '16 / 10.6' }}
    >
      {/* blurred study: dark shelves, warm lamp light, plant */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(180px_120px_at_78%_26%,rgba(201,146,46,0.35),transparent_70%),radial-gradient(160px_220px_at_10%_70%,rgba(40,90,70,0.45),transparent_70%),linear-gradient(135deg,#0A1428_0%,#101C36_55%,#1A2238_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#0A1428]/45 backdrop-blur-[3px]" />

      <div className="absolute inset-x-0 top-[9%] flex flex-col items-center px-4 text-center">
        <span className="relative flex h-[84px] w-[84px] items-center justify-center rounded-full border border-white/25 bg-[#0A1428]/55 text-[#F2B93B] sm:h-[96px] sm:w-[96px] lg:h-[104px] lg:w-[104px]">
          <Video className="h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11" strokeWidth={1.8} />
        </span>
        <p style={playfair} className="mt-4 text-[30px] font-semibold uppercase leading-none tracking-[0.02em] text-white sm:text-[38px] lg:text-[clamp(32px,2.9vw,44px)]">
          Coming <span className="text-[#F2B93B]">Soon</span>
        </p>
        <p className="mt-3 max-w-[22rem] text-[14px] leading-snug text-white/90 sm:text-[16px] lg:text-[17px]">
          Stay tuned for an exclusive message
          <br />
          from Amit R. Pandey
        </p>
      </div>

      {/* player bar */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8 text-white">
        <span className="block h-[3px] w-full rounded-full bg-white/35" />
        <div className="mt-3 flex items-center gap-3.5 sm:gap-4">
          <Play className="h-5 w-5 fill-current" />
          <Volume2 className="h-5 w-5" strokeWidth={1.8} />
          <span className="text-[12.5px] tabular-nums">0:00 / 1:28</span>
          <span className="ml-auto flex items-center gap-3.5 sm:gap-4">
            {PLAYER_ICONS.map((Icon, i) => <Icon key={i} className="h-5 w-5" strokeWidth={1.8} />)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function PersonalWelcome() {
  const [soon, setSoon] = useState(false);
  const watch = () => {
    if (WELCOME_VIDEO_URL) window.open(WELCOME_VIDEO_URL, '_blank', 'noopener');
    else setSoon(true);
  };
  return (
    <>
      <section className="bg-white pt-8 pb-8 sm:pt-10 lg:pt-7 lg:pb-9">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)_minmax(0,0.5fr)] lg:gap-9 lg:px-8">
          <VideoCard />

          <motion.div {...fade}>
            <p className="font-sora text-[11.5px] font-bold uppercase tracking-[0.28em] text-[#E08A1E]">A Personal Welcome from Solahana</p>
            <h2 style={playfair} className="[text-wrap:balance] mt-3 text-[32px] font-bold leading-[1.1] text-[#0A1836] sm:text-[40px] lg:text-[clamp(34px,3.1vw,46px)]">
              Wealth is not about having more products. It is about having a <span className="text-[#E08A1E]">better plan.</span>
            </h2>
            <p className="[text-wrap:pretty] mt-4 max-w-[48ch] text-[14.5px] leading-[1.55] text-[#334155] sm:text-[15px]">
              In this short video, I share my approach to wealth planning, our philosophy, and how Solahana works with families to create long-term financial clarity.
            </p>
            <p style={playfair} className="mt-4 text-[20px] font-bold text-[#0A1836]">Amit R. Pandey, CWM<sup className="text-[0.55em] leading-none">®</sup></p>
            <p className="text-[13.5px] text-[#334155]">MBA <span className="mx-1 text-[#0A1836]">|</span> Ex-Banker <span className="mx-1 text-[#0A1836]">|</span> 25+ Years in Financial Services</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={watch}
                className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-md bg-gradient-to-b from-[#FBE08E] to-[#F3C95F] px-6 py-3.5 text-[15px] font-semibold text-[#0A1836] shadow-[0_8px_22px_rgba(243,201,95,0.4)] transition-transform hover:-translate-y-0.5"
              >
                Watch the Full Video
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              {soon && <span role="status" className="text-[13px] font-semibold text-[#9A7220]">Coming soon</span>}
            </div>
          </motion.div>

          <motion.div {...fade} className="relative lg:self-stretch lg:border-l lg:border-[#EEE9DD] lg:pl-6">
            <ul className="divide-y divide-[#EEE9DD]">
              {WELCOME_POINTS.map((p) => (
                <li key={p.label[0]} className="flex items-center gap-3.5 py-4 first:pt-0 lg:py-[22px] lg:first:pt-1">
                  <p.icon className="h-9 w-9 shrink-0 text-[#E08A1E]" strokeWidth={1.6} />
                  <span className="text-[15px] leading-snug text-[#0A1836]">{p.label[0]}<br />{p.label[1]}</span>
                </li>
              ))}
            </ul>
            <p style={script} className="mt-4 whitespace-nowrap text-[40px] leading-none text-[#C9922E] lg:mt-6 lg:text-[clamp(30px,2.5vw,44px)]">Amit R. Pandey</p>
          </motion.div>
        </div>
      </section>
      <ClientFirstBand />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Client first band (sits directly under the welcome)              */
/* ------------------------------------------------------------------ */
const CLIENT_FIRST = [
  { icon: Ban, label: ['No Proprietary Products', 'or Sales Targets'], to: '/disclosures' },
  { icon: FileText, label: ['Transparent Framework', 'and Clear Disclosure'], to: '/disclosures' },
  { icon: Handshake, label: ['Execution via SEBI/AMFI', 'Registered Partners'], to: '/disclosures' },
];

/* navy shield with a gold rim and star */
function ShieldBadge() {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 92" className="h-[84px] w-[74px] shrink-0">
      <defs>
        <linearGradient id="cf-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2C46B" />
          <stop offset="1" stopColor="#C98A2B" />
        </linearGradient>
      </defs>
      <path d="M40 3 L73 15 V44 C73 66 58 80 40 89 C22 80 7 66 7 44 V15 Z" fill="url(#cf-rim)" />
      <path d="M40 10 L67 20 V44 C67 62 54 74 40 82 C26 74 13 62 13 44 V20 Z" fill="#0F1F45" />
      <path d="M40 22 L60 29 V44 C60 57 51 66 40 72 C29 66 20 57 20 44 V29 Z" fill="none" stroke="#E8BC6B" strokeWidth="1.6" />
      <path d="M40 31 L44.2 40 L54 41.2 L46.8 47.8 L48.8 57.4 L40 52.6 L31.2 57.4 L33.2 47.8 L26 41.2 L35.8 40 Z" fill="#FFE9B0" />
    </svg>
  );
}

export function ClientFirstBand() {
  return (
    <section className="bg-[#FBF1E6]">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,2.15fr)] lg:gap-8 lg:px-8">
        <motion.div {...fade} className="flex items-center gap-5">
          <ShieldBadge />
          <div>
            <p className="text-[22px] font-semibold uppercase leading-[1.15] tracking-[0.04em] text-[#0A1836] sm:text-[24px]">Client First.<br />Product Neutral.</p>
            <p className="mt-1 text-[13.5px] uppercase tracking-[0.08em] text-[#475569]">Built around your goals.</p>
          </div>
        </motion.div>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-0 lg:border-l lg:border-[#E7D6B8]">
          {CLIENT_FIRST.map((c, i) => (
            <li key={c.label[0]} className={`${i > 0 ? 'sm:border-l sm:border-[#E7D6B8]' : ''} sm:px-6`}>
              <Link to={c.to} className="group flex items-center gap-4">
                <span className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-full border-2 border-[#E08A1E] text-[#E08A1E]">
                  <c.icon className="h-8 w-8" strokeWidth={1.5} />
                </span>
                <span className="text-[15px] leading-snug text-[#0A1836] group-hover:underline">{c.label[0]}<br />{c.label[1]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Wealth architecture: connected planning, six pillars, universe   */
/* ------------------------------------------------------------------ */
const CONNECTED = [
  { icon: ChartColumnIncreasing, title: 'Invest', sub: 'Grow Your Wealth', to: '/investments' },
  { icon: ShieldPlus, title: 'Protect', sub: 'Manage Life’s Risks', to: '/risk-management' },
  { icon: Armchair, title: 'Retire', sub: 'Ensure Income', to: '/calculators/retirement' },
  { icon: Percent, title: 'Tax', sub: 'Keep More of What You Earn', to: '/tax-planning' },
  { icon: Users, title: 'Estate', sub: 'Preserve for Generations', to: '/estate-planning' },
];

const PILLARS = [
  { icon: Target, label: ['Financial', 'Planning'], to: '/financial-planning' },
  { icon: ChartColumnIncreasing, label: ['Investment', 'Planning'], to: '/investments' },
  { icon: Armchair, label: ['Retirement', 'Planning'], to: '/calculators/retirement' },
  { icon: ShieldPlus, label: ['Risk', 'Planning'], to: '/risk-management' },
  { icon: Percent, label: ['Tax', 'Planning'], to: '/tax-planning' },
  { icon: Users, label: ['Estate', 'Planning'], to: '/estate-planning' },
];

const UNIVERSE = [
  { icon: ChartColumnIncreasing, label: ['Mutual Funds', '& SIPs'], to: '/invest/mutual-funds' },
  { icon: Globe, label: ['Direct Equities', '& Global Investing'], to: '/invest/domestic-equity' },
  { icon: Coins, label: ['PMS, AIF & SIF'], to: '/invest/pms-aif-sif' },
  { icon: Building2, label: ['Real Estate', '& REITs'], to: '/invest/real-estate' },
  { icon: FileText, label: ['Bonds, NCDs', '& Fixed Income'], to: '/invest/bonds' },
  { icon: Earth, label: ['International', 'Investing'], to: '/invest/international-equity' },
];

/* faint snow-capped range behind the top-right of the header */
function HeaderMountains() {
  return (
    <svg aria-hidden="true" viewBox="0 0 360 200" preserveAspectRatio="xMaxYMax slice" className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[300px] lg:block">
      <defs>
        <linearGradient id="wa-m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EA3C9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#DCE3F0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wa-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="wa-mask"><rect width="360" height="200" fill="url(#wa-fade)" /></mask>
      </defs>
      <g mask="url(#wa-mask)">
        <path d="M60 200 L130 120 L170 150 L240 50 L290 110 L330 30 L360 70 L360 200 Z" fill="url(#wa-m)" />
        <path d="M240 50 L222 80 L238 74 L252 92 L268 72 L290 110 L262 70 Z" fill="#fff" fillOpacity="0.7" />
        <path d="M330 30 L312 62 L326 56 L340 72 L360 70 L346 48 Z" fill="#fff" fillOpacity="0.7" />
      </g>
    </svg>
  );
}

export function WealthArchitecture() {
  return (
    <section className="bg-white pb-10 pt-8 sm:pt-10">
      {/* header: statement + five connected areas */}
      <div className="relative overflow-hidden">
        <HeaderMountains />
        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-8 px-4 pb-7 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] lg:gap-6 lg:px-8">
          <motion.div {...fade}>
            <p className="font-sora text-[11.5px] font-bold uppercase tracking-[0.3em] text-[#E08A1E]">Your Complete Wealth Architecture</p>
            <h2 style={serif} className="[text-wrap:balance] mt-3 text-[34px] font-semibold leading-[1.08] text-[#0A1836] sm:text-[44px] lg:whitespace-nowrap lg:text-[clamp(34px,3vw,50px)]">
              Your Wealth Is Connected.<br className="hidden lg:block" /> Your Planning Should Be Too.
            </h2>
          </motion.div>
          <ul className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-y-0">
            {CONNECTED.map((c, i) => (
              <motion.li
                key={c.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="lg:border-l lg:border-[#EEE9DD] lg:px-2 lg:first:border-l-0 lg:first:pl-0"
              >
                <Link to={c.to} className="group flex flex-col items-center text-center">
                  <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#0A1836] text-[#E2B24E] shadow-[0_10px_24px_rgba(15,31,69,0.28)] transition-transform group-hover:-translate-y-1">
                    <c.icon className="h-8 w-8" strokeWidth={1.8} />
                  </span>
                  <span className="mt-3 text-[16.5px] font-bold text-[#0A1836]">{c.title}</span>
                  <span className="mt-0.5 max-w-[16ch] text-[13.5px] leading-snug text-[#475569]">{c.sub}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* six pillars + investment universe */}
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-8">
        <motion.div {...fade} className="rounded-2xl bg-[#0A1836] p-6 shadow-[0_16px_40px_rgba(15,31,69,0.25)]">
          <p className="font-sora text-[11.5px] font-bold uppercase tracking-[0.3em] text-[#E2B24E]">Our Planning Architectures</p>
          <h3 style={serif} className="mt-2 text-[28px] font-semibold leading-tight text-white sm:text-[32px]">Six Pillars for a Stronger Financial Life</h3>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((p) => (
              <li key={p.label[0]}>
                <Link to={p.to} className="group flex h-full items-center gap-2.5 rounded-md border border-white/15 bg-white/[0.03] px-3 py-4 transition-colors hover:border-[#E2B24E]/60 hover:bg-white/[0.07]">
                  <p.icon className="h-8 w-8 shrink-0 text-[#F0B94F]" strokeWidth={1.7} />
                  <span className="flex-1 text-[14px] leading-tight text-white">{p.label[0]}<br />{p.label[1]}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/70 text-white transition-colors group-hover:border-[#E2B24E] group-hover:bg-[#E2B24E] group-hover:text-[#0A1836]">
                    <Plus className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade} className="rounded-2xl border border-[#EEE9DD] bg-[#FEFDFB] p-6 shadow-[0_10px_30px_rgba(15,31,69,0.06)]">
          <p className="font-sora text-[11.5px] font-bold uppercase tracking-[0.3em] text-[#E08A1E]">Our Investment Universe</p>
          <h3 style={serif} className="mt-2 text-[28px] font-semibold leading-tight text-[#0A1836] sm:text-[32px]">Multiple Opportunities. One Framework.</h3>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {UNIVERSE.map((u) => (
              <li key={u.label[0]}>
                <Link to={u.to} className="group flex h-full items-center gap-2.5 rounded-md border border-[#EEE9DD] bg-white px-3 py-4 transition-shadow hover:shadow-[0_10px_24px_rgba(15,31,69,0.1)]">
                  <u.icon className="h-8 w-8 shrink-0 text-[#E08A1E]" strokeWidth={1.7} />
                  <span className="flex-1 text-[13.5px] leading-tight text-[#0A1836]">{u.label[0]}{u.label[1] && <><br />{u.label[1]}</>}</span>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E2B24E] text-[#E08A1E] transition-colors group-hover:bg-[#E2B24E] group-hover:text-[#0A1836]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Beyond investments: family wealth, founder's view, our process   */
/* ------------------------------------------------------------------ */
/* filled line-art icons for the family-wealth row (lucide has no filled equivalents) */
const svgProps = { viewBox: '0 0 48 48', fill: 'currentColor', 'aria-hidden': true };
const FamilyIcons = {
  governance: (c) => (
    <svg {...svgProps} className={c}>
      <path d="M2 38c0-6.500 3.600-10.500 9-10.500 1.700 0 3.100.4 4.300 1.100C12.300 31.200 10.700 34.700 10.700 38z" />
      <path d="M46 38c0-6.500-3.600-10.500-9-10.500-1.700 0-3.100.4-4.300 1.100 3 2.600 4.600 6.100 4.600 9.400z" />
      <circle cx="11" cy="20" r="5" />
      <circle cx="37" cy="20" r="5" />
      <circle cx="24" cy="15" r="7" />
      <path d="M11.500 42c0-8.500 5-13.500 12.500-13.500S36.500 33.500 36.500 42z" />
    </svg>
  ),
  tree: (c) => (
    <svg {...svgProps} className={c}>
      <path d="M24 3c-6.500 0-11 4.300-11 9.500 0 .9.1 1.700.4 2.500C9.800 16.300 7.500 19.700 7.500 23.500c0 5.800 4.700 9.800 10.500 9.800H22V45h4V33.300h4c5.800 0 10.500-4 10.500-9.800 0-3.800-2.300-7.200-5.900-8.500.3-.8.400-1.600.4-2.500C35 7.300 30.500 3 24 3z" />
    </svg>
  ),
  coins: (c) => (
    <svg {...svgProps} className={c}>
      {[31, 20, 9].map((y) => (
        <g key={y}>
          <path d={`M9 ${y + 3}v6.500c0 3 6.700 5.500 15 5.500s15-2.500 15-5.500V${y + 3}z`} />
          <ellipse cx="24" cy={y + 3} rx="15" ry="5.500" stroke="#FFF7EA" strokeWidth="1.600" />
        </g>
      ))}
    </svg>
  ),
  network: (c) => (
    <svg {...svgProps} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className={c}>
      <circle cx="24" cy="9" r="5" />
      <circle cx="24" cy="26" r="3.500" />
      <circle cx="10" cy="38" r="5" />
      <circle cx="38" cy="38" r="5" />
      <path d="M24 14v8.500M21.500 28.500 13.500 34M26.500 28.500 34.500 34" />
    </svg>
  ),
  growth: (c) => (
    <svg {...svgProps} className={c}>
      <rect x="5" y="30" width="10" height="15" rx="1.500" />
      <rect x="19" y="22" width="10" height="23" rx="1.500" />
      <rect x="33" y="13" width="10" height="32" rx="1.500" />
      <path d="M4 21 17 11l8 6.500L40 5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 4.500h10V14.500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const FAMILY = [
  { icon: FamilyIcons.governance, label: ['Family', 'Governance'], to: '/estate-planning' },
  { icon: FamilyIcons.tree, label: ['Intergenerational', 'Wealth'], to: '/estate-planning' },
  { icon: FamilyIcons.coins, label: ['Cash Flow', 'Architecture'], to: '/financial-planning' },
  { icon: FamilyIcons.network, label: ['Succession', 'Planning'], to: '/estate-planning' },
  { icon: FamilyIcons.growth, label: ['Business–Personal', 'Wealth Integration'], to: '/who-we-serve#business-owners', bare: true },
];

const STEPS = [
  { n: '01', title: 'Discover', sub: 'Understand your goals' },
  { n: '02', title: 'Diagnose', sub: 'Deep financial analysis' },
  { n: '03', title: 'Architect', sub: 'Customised strategy' },
  { n: '04', title: 'Implement', sub: 'Execute via trusted partners' },
  { n: '05', title: 'Steward', sub: 'Ongoing monitoring & review' },
];

export function FamilyAndProcess() {
  const navigate = useNavigate();
  return (
    <section className="bg-white pb-6 pt-4 sm:pt-6">
      {/* family wealth + founder's perspective */}
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* sizes below scale with the column width (container query units) so nothing can overflow or collide with the card */}
        <motion.div {...fade} className="@container py-2">
          <p className="font-sora text-[12.5px] font-bold uppercase tracking-[0.34em] text-[#E08A1E] sm:text-[13px]">Beyond Investments</p>
          <h2 style={{ ...serif, fontSize: 'clamp(32px, 6.4cqw, 54px)' }} className="mt-3 font-semibold leading-[1.05] text-[#0A1836]">
            Family Wealth. For Generations.
          </h2>
          <ul className="mt-7 grid grid-cols-2 gap-x-2 gap-y-7 sm:grid-cols-5 sm:gap-y-0">
            {FAMILY.map((f, i) => (
              <li key={f.label[0]} className={`sm:px-0.5 ${i > 0 ? 'sm:border-l sm:border-[#EEE9DD]' : ''}`}>
                <Link to={f.to} className="group flex h-full flex-col items-center text-center">
                  <span
                    style={{ width: 'clamp(64px, 13cqw, 86px)', height: 'clamp(64px, 13cqw, 86px)' }}
                    className={`flex items-center justify-center text-[#E08A1E] transition-transform group-hover:-translate-y-1 ${f.bare ? '' : 'rounded-full border border-[#F0C98A] bg-[#FFF7EA]'}`}
                  >
                    {f.icon(f.bare ? 'h-[72%] w-[72%]' : 'h-[46%] w-[46%]')}
                  </span>
                  <span style={{ fontSize: 'clamp(12px, 2.35cqw, 15px)' }} className="mt-3 whitespace-nowrap leading-snug text-[#0A1836]">{f.label[0]}<br />{f.label[1]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div {...fade} className="@container relative isolate overflow-hidden rounded-xl bg-[#0A1836] shadow-[0_16px_40px_rgba(15,31,69,0.28)]">
          {/* founder portrait, bottom-right, fading into the navy */}
          <div
            className="absolute bottom-0 right-0 -z-10 hidden w-[41%] sm:block"
            style={{
              aspectRatio: '726 / 708',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%), linear-gradient(to bottom, transparent, black 26%)',
              maskImage: 'linear-gradient(to right, transparent, black 30%), linear-gradient(to bottom, transparent, black 26%)',
              WebkitMaskComposite: 'source-in',
              maskComposite: 'intersect',
            }}
          >
            <img src={founderPhoto} alt="Amit R. Pandey, Chartered Wealth Manager" loading="lazy" draggable="false" className="h-full w-full object-cover" />
          </div>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(420px_260px_at_88%_30%,rgba(201,146,46,0.2),transparent_70%)]" />

          <div style={{ minHeight: 'clamp(300px, 56cqw, 380px)' }} className="px-6 pb-7 pt-7 sm:px-8 sm:pb-8">
            <div className="sm:max-w-[60%]">
              <p className="font-sora text-[12.5px] font-bold uppercase tracking-[0.34em] text-[#E2B24E] sm:text-[13px]">Founder’s Perspective</p>
              <blockquote style={{ ...serif, fontSize: 'clamp(22px, 4.5cqw, 32px)' }} className="mt-4 font-medium leading-[1.2] text-white">
                “My role is not to add more products to your financial life. It is to bring <span className="text-[#F3C95F]">clarity</span> to <span className="text-[#F3C95F]">the decisions</span> that matter.”
              </blockquote>
              <span className="mt-5 block h-px w-24 bg-[#E2B24E]/60" />
              <p style={{ ...serif, fontSize: 'clamp(20px, 3.9cqw, 26px)' }} className="mt-4 font-semibold text-white">Amit R. Pandey, CWM<sup className="text-[0.55em] leading-none">®</sup></p>
              <p style={{ fontSize: 'clamp(11.5px, 2cqw, 14px)' }} className="mt-1 text-white/90">MBA <span className="mx-1 text-white/60">|</span> Ex-Banker <span className="mx-1 text-white/60">|</span> 25+ Years in Financial Services</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/our-process')}
              className="group mt-6 inline-flex cursor-pointer items-center justify-center gap-3 rounded-md bg-gradient-to-b from-[#FBE08E] to-[#F3C95F] px-5 py-3.5 text-[15px] font-semibold text-[#0A1836] shadow-[0_8px_22px_rgba(243,201,95,0.35)] transition-transform hover:-translate-y-0.5 sm:absolute sm:bottom-6 sm:right-5 sm:mt-0"
            >
              Explore My Approach
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* our process */}
      <div className="mx-auto mt-9 max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-6 border-t border-[#EEE9DD] pt-7 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,2.38fr)] lg:gap-6">
          <motion.div {...fade}>
            <p className="font-sora text-[12.5px] font-bold uppercase tracking-[0.34em] text-[#E08A1E] sm:text-[13px]">Our Process</p>
            <h2 style={serif} className="mt-2 text-[28px] font-semibold leading-tight text-[#0A1836] sm:text-[32px]">A Disciplined and Transparent Journey</h2>
          </motion.div>

          <ol className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-5 lg:flex lg:items-start lg:gap-0 lg:px-6">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.n}>
                <li className="lg:w-[clamp(96px,7.4vw,112px)] lg:shrink-0">
                  <Link to="/our-process" className="group flex flex-col items-center text-center">
                    <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#E8B26A] bg-white text-[20px] font-bold tracking-wide text-[#E08A1E] transition-colors group-hover:bg-[#E08A1E] group-hover:text-white">
                      {s.n}
                    </span>
                    <span className="mt-2.5 text-[16px] font-semibold text-[#0A1836]">{s.title}</span>
                    <span style={serif} className="mt-0.5 text-[15px] font-medium leading-snug text-[#475569] lg:whitespace-nowrap">{s.sub}</span>
                  </Link>
                </li>
                {i < STEPS.length - 1 && (
                  <li aria-hidden="true" className="hidden h-[56px] min-w-[24px] flex-1 items-center px-3 lg:flex">
                    <span className="h-px flex-1 bg-[#E08A1E]" />
                    <svg viewBox="0 0 8 10" className="-ml-px h-2.5 w-2 shrink-0 text-[#E08A1E]"><path d="M0 0 L8 5 L0 10 Z" fill="currentColor" /></svg>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Master plan CTA                                                  */
/* ------------------------------------------------------------------ */
const OUTCOMES = ['Clarity Today', 'Confident Tomorrow', 'Generational Prosperity'];

export function MasterPlanCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C]">
      {/* left half of the mountain art: the climber looking at the summit (no path icons) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-[38%] overflow-hidden opacity-90 [mask-image:linear-gradient(to_right,transparent,black_30%,black_80%,transparent)] lg:block">
        <img src={mountainArt} alt="" loading="lazy" draggable="false" className="h-full w-[200%] max-w-none object-cover object-[0%_36%]" />
      </div>
      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:px-8">
        <motion.div {...fade}>
          <Eyebrow light>Your Wealth Deserves a Master Plan</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mt-3 text-[34px] font-semibold leading-[1.08] text-[#E2B24E] sm:text-[44px]">Experience True Wealth Architecture.</h2>
          <p className="[text-wrap:pretty] mt-3 max-w-[56ch] text-[15.5px] leading-relaxed text-slate-100">
            Connect directly for a confidential, zero-obligation strategic consultation.
          </p>
          <GoldArrowBtn onClick={() => openConsultation()} className="mt-6">Schedule Your Private Consultation</GoldArrowBtn>
        </motion.div>
        <motion.ul {...fade} className="rounded-xl border border-white/10 bg-[#07122b]/60 p-5 backdrop-blur-sm lg:justify-self-end lg:min-w-[250px]">
          {OUTCOMES.map((o, i) => (
            <li key={o} className={`flex items-center gap-3 py-2.5 text-[14px] font-semibold text-white ${i > 0 ? 'border-t border-white/10' : ''}`}>
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E2B24E]/70 text-[#E2B24E]">
                <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              {o}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/** The rest of the approved home design, in order. PersonalWelcome and WealthArchitecture are rendered
 *  separately in App.jsx, right after the hero. */
export default function HomeSections() {
  return (
    <>
      <FamilyAndProcess />
      <MasterPlanCta />
    </>
  );
}
