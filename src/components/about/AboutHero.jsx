import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import aboutHero from '../../assets/about-hero.webp';

const IMG_W = 2000;
const IMG_H = 1333;

// clickable areas drawn over the banner (coordinates on a 2000 x 1333 grid)
const PLANNING_LINKS = [
  // round icons on the white panel
  { label: 'Financial Planning', to: '/financial-planning', x: 1031, y: 548, w: 140, h: 170 },
  { label: 'Investment Planning', to: '/investments', x: 1176, y: 548, w: 140, h: 170 },
  { label: 'Retirement Planning', to: '/calculators/retirement', x: 1325, y: 548, w: 140, h: 170 },
  { label: 'Risk Planning', to: '/risk-management', x: 1477, y: 548, w: 140, h: 170 },
  { label: 'Tax Planning', to: '/tax-planning', x: 1626, y: 548, w: 140, h: 170 },
  { label: 'Estate Planning', to: '/estate-planning', x: 1780, y: 548, w: 140, h: 170 },
  // book spines on the left of the desk
  { label: 'Financial Planning', to: '/financial-planning', x: 0, y: 722, w: 432, h: 64 },
  { label: 'Investment Strategy', to: '/investments', x: 0, y: 790, w: 432, h: 56 },
  { label: 'Risk Management', to: '/risk-management', x: 0, y: 848, w: 432, h: 56 },
  { label: 'Retirement Planning', to: '/calculators/retirement', x: 0, y: 905, w: 432, h: 56 },
  { label: 'Tax Planning', to: '/tax-planning', x: 0, y: 962, w: 436, h: 58 },
  { label: 'Estate Planning', to: '/estate-planning', x: 0, y: 1022, w: 440, h: 66 },
];

const pct = (v, total) => `${(v / total) * 100}%`;

export default function AboutHero() {
  return (
    <section className="relative bg-[#0B1A3C] pt-[80px] overflow-hidden" aria-label="About SOLAHANA">
      <h1 className="sr-only">About SOLAHANA: Amit R. Pandey, Chartered Wealth Manager (CWM)</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full"
      >
        <img
          src={aboutHero}
          alt="Amit R. Pandey, Chartered Wealth Manager (CWM), MBA, ex-banker with 25+ years of experience in financial services. Comprehensive financial planning for a secure and prosperous future."
          width="1600"
          height="1066"
          className="block h-auto w-full"
          draggable="false"
        />

        {PLANNING_LINKS.map((l) => (
          <Link
            key={`${l.label}-${l.x}-${l.y}`}
            to={l.to}
            aria-label={l.label}
            title={l.label}
            style={{ left: pct(l.x, IMG_W), top: pct(l.y, IMG_H), width: pct(l.w, IMG_W), height: pct(l.h, IMG_H) }}
            className="absolute rounded-xl outline-none transition-all duration-200 hover:bg-[#C9922E]/15 hover:ring-2 hover:ring-[#E2B24E]/80 focus-visible:ring-2 focus-visible:ring-[#E2B24E]"
          />
        ))}
      </motion.div>
    </section>
  );
}
