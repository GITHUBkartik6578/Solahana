import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Target } from 'lucide-react';
import MascotScene from './MascotScene';

const CHIPS = [
  { label: 'Old vs New Regime', sub: 'We pick what saves you more', icon: Scale, pos: 'top-[10%] left-[2%] sm:top-[13%] sm:left-[8%]', delay: 1.8, drift: -6 },
  { label: 'Goal-Linked Savings', sub: 'Every rupee tied to a goal', icon: Target, pos: 'bottom-[1%] right-[6%]', delay: 2, drift: -5 },
];

const ROWS = [
  { code: '80C', note: 'ELSS · PPF · EPF', y: 62 },
  { code: '80D', note: 'Health cover', y: 96 },
  { code: 'NPS', note: '80CCD(1B)', y: 130 },
];

function TaxPlanDoc({ reduce }) {
  return (
    <svg viewBox="0 0 160 200" className="w-full h-auto overflow-visible" aria-hidden="true">
      {/* paper */}
      <rect x="4" y="4" width="152" height="192" rx="12" fill="#FFFFFF" stroke="#E4E8F0" strokeWidth="2" />
      <path d="M16 4 H144 A12 12 0 0 1 156 16 V38 H4 V16 A12 12 0 0 1 16 4 Z" fill="#14224F" />
      <text x="16" y="26" fill="#FFFFFF" fontSize="11" fontWeight="800" letterSpacing="1.2" fontFamily="Sora, Manrope, sans-serif">MY TAX PLAN</text>
      <circle cx="138" cy="21" r="9" fill="#C89B3C" />
      <text x="138" y="25.5" textAnchor="middle" fill="#14224F" fontSize="12" fontWeight="800">₹</text>

      {ROWS.map((r, i) => (
        <g key={r.code}>
          <text x="40" y={r.y} fill="#14224F" fontSize="13" fontWeight="800" fontFamily="Sora, Manrope, sans-serif">{r.code}</text>
          <text x="40" y={r.y + 13} fill="#64748B" fontSize="8.5" fontWeight="600" fontFamily="Manrope, sans-serif">{r.note}</text>
          <rect x="108" y={r.y - 8} width="36" height="7" rx="3.5" fill="#E4E8F0" />
          <motion.rect
            x="108"
            y={r.y - 8}
            height="7"
            rx="3.5"
            fill="#C89B3C"
            initial={reduce ? false : { width: 0 }}
            animate={{ width: 36 - i * 7 }}
            transition={{ duration: 0.6, delay: 0.9 + i * 0.35, ease: 'easeOut' }}
          />
          <motion.g
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 + i * 0.35, ease: 'backOut' }}
            style={{ transformOrigin: `22px ${r.y - 1}px` }}
          >
            <circle cx="22" cy={r.y - 1} r="8.5" fill="#E5C158" />
            <path d={`M18 ${r.y - 1} l3 3 l5.5 -6`} stroke="#14224F" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
          {i < ROWS.length - 1 && <line x1="16" y1={r.y + 22} x2="144" y2={r.y + 22} stroke="#E4E8F0" strokeWidth="1.2" />}
        </g>
      ))}

      {/* PLANNED stamp */}
      <motion.g
        initial={reduce ? false : { scale: 1.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, delay: 2.1, ease: 'easeIn' }}
        style={{ transformOrigin: '112px 168px' }}
      >
        <g transform="rotate(-14 112 168)">
          <circle cx="112" cy="168" r="23" fill="none" stroke="#C89B3C" strokeWidth="2.5" />
          <circle cx="112" cy="168" r="18.5" fill="#FFFBF0" stroke="#C89B3C" strokeWidth="1" />
          <text x="112" y="167" textAnchor="middle" fill="#9A7326" fontSize="6.8" fontWeight="800" letterSpacing="0.3" fontFamily="Sora, Manrope, sans-serif">PLANNED</text>
          <path d="M106 172 l4 4 l8 -8" stroke="#9A7326" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </motion.g>
    </svg>
  );
}

export default function TaxMascotIllustration() {
  return (
    <MascotScene alt="SOLAHANA rupee mascot presenting a tax plan covering 80C, 80D and NPS, planned from April" chips={CHIPS}>
      {(reduce) => (
        <>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-[9%] bottom-[15%] w-[35%] drop-shadow-[0_24px_34px_rgba(20,34,79,0.20)]"
          >
            <TaxPlanDoc reduce={reduce} />
          </motion.div>

          {/* April calendar: planning starts at the beginning of the year, not in March */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -14, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: 8 }}
            transition={{ duration: 0.5, delay: 1.2, ease: 'backOut' }}
            className="absolute right-[2%] top-[18%] sm:top-[16%] w-14 sm:w-[76px] rounded-xl overflow-hidden bg-white border border-[#E4E8F0] shadow-[0_12px_26px_rgba(20,34,79,0.16)] text-center z-10"
            aria-hidden="true"
          >
            <div className="bg-[#14224F] text-[#E5C158] text-[9px] sm:text-[11px] font-extrabold tracking-[0.2em] py-1">APRIL</div>
            <div className="font-serif-luxury font-bold text-[#14224F] text-2xl sm:text-[32px] leading-none py-1.5 sm:py-2">01</div>
          </motion.div>
        </>
      )}
    </MascotScene>
  );
}
