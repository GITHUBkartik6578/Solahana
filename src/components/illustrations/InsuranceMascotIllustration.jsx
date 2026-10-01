import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, Wallet, Check } from 'lucide-react';
import MascotScene from './MascotScene';

const CHIPS = [
  { label: 'Health + Top-up', sub: 'Hospital bills, handled', icon: HeartPulse, pos: 'top-[18%] left-[2%] sm:top-[13%] sm:left-[8%]', delay: 1.2, drift: -6 },
  { label: 'Term Life Cover', sub: "Your family's income, secured", icon: ShieldCheck, pos: 'top-[4%] right-[12%] sm:top-[7%] sm:right-[0%]', delay: 1.4, drift: 6 },
  { label: 'Emergency Fund', sub: '6 months of expenses, liquid', icon: Wallet, pos: 'bottom-[1%] right-[6%]', delay: 1.6, drift: -5 },
];

function FamilyShield() {
  return (
    <svg viewBox="0 0 200 230" className="w-full h-auto overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="shieldFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E3470" />
          <stop offset="100%" stopColor="#14224F" />
        </linearGradient>
        <linearGradient id="shieldRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6E1A0" />
          <stop offset="50%" stopColor="#C89B3C" />
          <stop offset="100%" stopColor="#9A7326" />
        </linearGradient>
      </defs>

      {/* Shield body */}
      <path
        d="M100 6 L186 38 V110 C186 166 148 204 100 224 C52 204 14 166 14 110 V38 Z"
        fill="url(#shieldFill)"
        stroke="url(#shieldRim)"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Inner rim */}
      <path
        d="M100 22 L172 49 V110 C172 157 140 190 100 208 C60 190 28 157 28 110 V49 Z"
        fill="none"
        stroke="#E5C158"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />

      {/* Home roofline sheltering the family */}
      <path d="M52 124 L100 84 L148 124" fill="none" stroke="#E5C158" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="124" y="90" width="9" height="20" rx="1.5" fill="#E5C158" />

      {/* Family */}
      <circle cx="78" cy="132" r="10" fill="#F2C99A" />
      <rect x="68" y="145" width="20" height="36" rx="9" fill="#E5C158" />

      <circle cx="122" cy="132" r="10" fill="#F2C99A" />
      <path d="M112 181 L115 150 Q122 142 129 150 L132 181 Z" fill="#C89B3C" />

      <circle cx="100" cy="150" r="7.5" fill="#F2C99A" />
      <rect x="92.5" y="160" width="15" height="21" rx="6.5" fill="#F6E1A0" />

      {/* Ground inside the shield */}
      <line x1="56" y1="183" x2="144" y2="183" stroke="#E5C158" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function InsuranceMascotIllustration() {
  return (
    <MascotScene alt="SOLAHANA rupee mascot presenting a shield that protects a family and their home" chips={CHIPS}>
      {(reduce) => (
        <>
          {/* Shield group */}
          <div className="absolute right-[5%] bottom-[14%] w-[40%]">
            {/* Protective pulse rings */}
            {!reduce &&
              [0, 1].map((i) => (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-[48%] w-[118%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2F5BC7]"
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: [0.75, 1.15], opacity: [0.45, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: 1.6 + i * 1.6, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              ))}
            <div
              className="absolute left-1/2 top-[48%] w-[118%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#2F5BC7]/30"
              aria-hidden="true"
            />

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative drop-shadow-[0_24px_34px_rgba(20,34,79,0.28)]"
            >
              <FamilyShield />
              {/* "Covered" check seal */}
              <motion.span
                initial={reduce ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.3, duration: 0.4, ease: 'backOut' }}
                className="absolute right-[2%] bottom-[18%] w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#F6E1A0] to-[#C89B3C] border-[3px] border-white shadow-md flex items-center justify-center"
                aria-hidden="true"
              >
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#14224F]" strokeWidth={3} />
              </motion.span>
            </motion.div>
          </div>
        </>
      )}
    </MascotScene>
  );
}
