import React from 'react';
import { motion } from 'framer-motion';

import aboutHero from '../../assets/about-hero.webp';

export default function AboutHero() {
  return (
    <section className="relative bg-[#0B1A3C] pt-[80px] overflow-hidden" aria-label="About SOLAHANA">
      <h1 className="sr-only">About SOLAHANA: Amit R. Pandey, Chartered Wealth Manager (CWM)</h1>
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        src={aboutHero}
        alt="Amit R. Pandey, Chartered Wealth Manager (CWM), MBA, ex-banker with 25+ years of experience in financial services. Comprehensive financial planning for a secure and prosperous future."
        width="1280"
        height="853"
        className="block h-auto w-full"
        draggable="false"
      />
    </section>
  );
}
