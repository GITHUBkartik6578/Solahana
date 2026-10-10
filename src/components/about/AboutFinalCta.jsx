import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Coins, Sparkles } from 'lucide-react';
import { openConsultation } from '../../data/whoWeServe';
import { serif, GOLD_TEXT } from './aboutStyles';

const POINTS = [
  { icon: TrendingUp, label: 'Clear Strategies' },
  { icon: Coins, label: 'Long-Term Perspective' },
  { icon: Sparkles, label: 'Generational Prosperity' },
];

/* sunrise over layered ridges with a hiker on a rock (vector, so it stays sharp at any size) */
function SunriseHiker() {
  return (
    <svg aria-hidden="true" viewBox="0 70 800 200" preserveAspectRatio="xMaxYMax slice" className="absolute inset-y-0 right-0 h-full w-full lg:w-[68%]">
      <defs>
        <linearGradient id="cta-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14264F" />
          <stop offset="0.55" stopColor="#7A4F3E" />
          <stop offset="0.8" stopColor="#E08A3C" />
          <stop offset="1" stopColor="#F2B15C" />
        </linearGradient>
        <radialGradient id="cta-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF1C9" />
          <stop offset="0.25" stopColor="#FFC66B" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F29A3C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cta-r1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5B4A55" />
          <stop offset="1" stopColor="#2B2E4A" />
        </linearGradient>
        <linearGradient id="cta-r2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B3A52" />
          <stop offset="1" stopColor="#1B2444" />
        </linearGradient>
        <linearGradient id="cta-r3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#262B47" />
          <stop offset="1" stopColor="#0E1735" />
        </linearGradient>
        <linearGradient id="cta-left-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0A1836" stopOpacity="1" />
          <stop offset="0.45" stopColor="#0A1836" stopOpacity="0.2" />
          <stop offset="1" stopColor="#0A1836" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="300" fill="url(#cta-sky)" />
      <circle cx="470" cy="150" r="150" fill="url(#cta-sun)" />
      <circle cx="470" cy="150" r="14" fill="#FFF3D3" />
      {/* ridges, far to near */}
      <path d="M0 150 L70 118 L140 140 L210 96 L290 134 L370 104 L450 128 L540 88 L620 126 L700 98 L800 132 L800 300 L0 300 Z" fill="url(#cta-r1)" />
      <path d="M0 190 L90 150 L170 178 L260 128 L350 170 L430 146 L520 176 L610 140 L700 172 L800 150 L800 300 L0 300 Z" fill="url(#cta-r2)" />
      <path d="M180 300 L330 214 L420 244 L520 196 L620 236 L700 150 L760 118 L800 100 L800 300 Z" fill="url(#cta-r3)" />
      {/* foreground rock + hiker */}
      <path d="M596 300 L620 262 L650 246 L690 252 L720 232 L760 236 L800 214 L800 300 Z" fill="#0A0E1E" />
      <g fill="#05070F">
        {/* backpack */}
        <path d="M719 150 Q707 154 707 172 L708 206 Q716 210 724 206 L727 160 Z" />
        {/* torso + head */}
        <path d="M727 160 Q735 150 744 154 L748 176 L740 208 L726 208 Z" />
        <circle cx="742" cy="143" r="8.5" />
        {/* legs: one braced on the rock */}
        <path d="M728 206 L734 232 L728 252 L740 252 L744 232 L752 206 Z" />
        <path d="M744 206 L764 222 L772 236 L764 240 L754 228 L742 220 Z" />
        {/* arm resting on raised knee */}
        <path d="M742 166 L764 186 L768 202 L760 200 L752 192 L738 180 Z" />
      </g>
      <rect width="800" height="300" fill="url(#cta-left-fade)" />
    </svg>
  );
}

export default function AboutFinalCta() {
  return (
    <section aria-label="Schedule a private consultation" className="relative isolate overflow-hidden bg-[#0A1836] text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07122B] via-[#0A1836] to-[#0E1F46]" />
      <div className="absolute inset-0 -z-10 opacity-60 sm:opacity-100"><SunriseHiker /></div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#0A1836]/55 sm:hidden" />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-5 py-9 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#E2B24E]">Your Wealth. Our Commitment.</p>
          <h2 style={{ ...serif, ...GOLD_TEXT }} className="mt-3 text-[34px] font-semibold leading-[1.05] sm:text-[46px] lg:text-[clamp(40px,3.6vw,54px)]">
            Experience True Wealth Architecture.
          </h2>
          <p className="mt-3 max-w-[40rem] text-[15.5px] leading-snug text-white/95 sm:text-[17.5px]">
            Connect directly for a confidential, zero-obligation strategic consultation.
          </p>
          <button
            type="button"
            onClick={() => openConsultation()}
            className="mt-5 inline-flex items-center justify-center gap-3 rounded-md bg-gradient-to-b from-[#F6D488] to-[#E8B95F] px-6 py-3.5 text-[15px] font-semibold text-[#0F1F45] shadow-[0_10px_26px_rgba(226,178,78,0.28)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B24E]"
          >
            Schedule Your Private Consultation
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

        <ul className="space-y-3.5 lg:pl-6">
          {POINTS.map((p) => (
            <li key={p.label} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#E2B24E]/80 bg-[#0A1836]/60 text-[#E2B24E] backdrop-blur-[2px]">
                <p.icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <span className="text-[16px] font-medium text-white sm:text-[17px]">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
