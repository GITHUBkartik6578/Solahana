import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, TrendingUp, Sunrise } from 'lucide-react';
import MascotScene from './MascotScene';

const CHIPS = [
  { label: 'Monthly Income Plan', sub: 'A paycheck after you retire', icon: Banknote, pos: 'top-[18%] left-[2%] sm:top-[13%] sm:left-[8%]', delay: 1.2, drift: -6 },
  { label: 'Inflation-Proofed', sub: 'Planned for rising costs', icon: TrendingUp, pos: 'top-[4%] right-[12%] sm:top-[7%] sm:right-[0%]', delay: 1.4, drift: 6 },
  { label: 'Your Retirement Age', sub: 'Early or on time — your call', icon: Sunrise, pos: 'bottom-[1%] right-[6%]', delay: 1.6, drift: -5 },
];

function SunriseArch({ reduce }) {
  return (
    <svg viewBox="0 0 200 250" className="w-full h-auto overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id="archClip">
          <path d="M16 244 V104 A84 84 0 0 1 184 104 V244 Z" />
        </clipPath>
        <linearGradient id="archSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF8E6" />
          <stop offset="70%" stopColor="#F6DFA0" />
          <stop offset="100%" stopColor="#EBC56E" />
        </linearGradient>
        <linearGradient id="archRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6E1A0" />
          <stop offset="50%" stopColor="#C89B3C" />
          <stop offset="100%" stopColor="#9A7326" />
        </linearGradient>
      </defs>

      <g clipPath="url(#archClip)">
        <rect x="0" y="0" width="200" height="250" fill="url(#archSky)" />

        {/* Rising sun + slowly turning rays */}
        <motion.g
          initial={reduce ? false : { y: 36 }}
          animate={{ y: 0 }}
          transition={{ duration: 1.6, delay: 0.5, ease: 'easeOut' }}
        >
          <motion.g
            style={{ transformOrigin: '100px 150px' }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <rect key={i} x="98.5" y="72" width="3" height="20" rx="1.5" fill="#E5A93A" opacity="0.55" transform={`rotate(${i * 30} 100 150)`} />
            ))}
          </motion.g>
          <circle cx="100" cy="150" r="36" fill="#F2B544" />
          <circle cx="100" cy="150" r="28" fill="#F8CB5C" />
        </motion.g>

        {/* Hills */}
        <path d="M0 176 C 40 150, 80 158, 110 172 C 140 186, 170 160, 200 166 V250 H0 Z" fill="#1E3470" />
        <path d="M0 200 C 50 180, 90 190, 130 200 C 160 208, 185 196, 200 198 V250 H0 Z" fill="#14224F" />

        {/* Road narrowing into the horizon (perspective) */}
        <path d="M66 250 C 84 226, 112 214, 101 196 C 97 189, 101 182, 104.5 177 L107.5 177 C 106 182, 105 189, 109 196 C 122 214, 108 230, 134 250 Z" fill="#E5C158" />
        <path d="M100 250 C 106 230, 118 214, 105 196 C 101 189, 104 183, 106 177" fill="none" stroke="#14224F" strokeWidth="1.4" strokeDasharray="5 5" />

        {/* Retired couple on a bench, watching the sunrise */}
        <g transform="translate(18 150) scale(1.3)">
          <rect x="0" y="22" width="44" height="4" rx="2" fill="#E5C158" />
          <rect x="3" y="26" width="3" height="10" fill="#E5C158" />
          <rect x="38" y="26" width="3" height="10" fill="#E5C158" />
          <rect x="0" y="12" width="44" height="3" rx="1.5" fill="#E5C158" />
          {/* him */}
          <circle cx="13" cy="4" r="5" fill="#F2C99A" />
          <path d="M9 1.5 Q13 -3 17 1.5" fill="#E8E8E8" />
          <rect x="8" y="9" width="10" height="14" rx="4" fill="#F8F7F3" />
          {/* her */}
          <circle cx="30" cy="4" r="5" fill="#F2C99A" />
          <path d="M25.5 3 Q30 -3.5 34.5 3 Q34 0 30 -0.5 Q26 0 25.5 3 Z" fill="#E8E8E8" />
          <rect x="25" y="9" width="10" height="14" rx="4" fill="#C89B3C" />
        </g>
      </g>

      {/* Arch rim */}
      <path d="M16 244 V104 A84 84 0 0 1 184 104 V244" fill="none" stroke="url(#archRim)" strokeWidth="6" strokeLinecap="round" />
      <line x1="8" y1="244" x2="192" y2="244" stroke="#C89B3C" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export default function RetirementMascotIllustration() {
  return (
    <MascotScene alt="SOLAHANA rupee mascot presenting a retired couple watching the sunrise" chips={CHIPS}>
      {(reduce) => (
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute right-[5%] bottom-[14%] w-[38%] drop-shadow-[0_24px_34px_rgba(20,34,79,0.22)]"
        >
          <SunriseArch reduce={reduce} />
        </motion.div>
      )}
    </MascotScene>
  );
}
