import React from 'react';
import { motion } from 'framer-motion';

import aboutHero from '../../assets/about-hero.webp';

export default function AboutHero() {
  return (
    <section className="relative bg-white pt-20 pb-6 sm:pt-24 sm:pb-8 overflow-hidden" aria-label="About SOLAHANA">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <h1 className="sr-only">About SOLAHANA: Amit R. Pandey, Chartered Wealth Manager (CWM)</h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto w-fit max-w-full overflow-hidden rounded-2xl shadow-[0_18px_44px_rgba(15,31,69,0.18)] ring-1 ring-[#C9922E]/40 sm:rounded-3xl"
        >
          <img
            src={aboutHero}
            alt="Amit R. Pandey, Chartered Wealth Manager (CWM), MBA, ex-banker with 25+ years of experience in financial services. Comprehensive financial planning for a secure and prosperous future."
            width="1280"
            height="853"
            className="block h-auto w-full lg:max-h-[calc(100svh-132px)] lg:w-auto lg:max-w-full"
            draggable="false"
          />
        </motion.div>
      </div>
    </section>
  );
}
