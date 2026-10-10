import React from 'react';
import { motion } from 'framer-motion';

import ctaArt from '../../assets/about-cta.webp';
import { scrollToConsultation } from '../../utils/consultation';

/**
 * "Experience True Wealth Architecture" banner (artwork supplied by the owner, text is part of the image).
 * An invisible button sits over the button drawn in the artwork so it is really clickable.
 */
export default function AboutClosingBanner() {
  return (
    <section className="bg-[#0A1836]" aria-label="Experience true wealth architecture">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-[1920px]"
      >
        <img
          src={ctaArt}
          alt="Your wealth. Our commitment. Experience True Wealth Architecture. Connect directly for a confidential, zero-obligation strategic consultation. Clear strategies, long-term perspective, generational prosperity."
          width="1600"
          height="600"
          loading="lazy"
          draggable="false"
          className="block h-auto w-full"
        />
        <button
          type="button"
          onClick={() => scrollToConsultation()}
          aria-label="Schedule your private consultation"
          style={{ left: '3.8%', top: '63.8%', width: '30.4%', height: '12.2%' }}
          className="absolute cursor-pointer rounded-md outline-none transition-all hover:bg-white/10 hover:ring-2 hover:ring-[#E6C27A]/80 focus-visible:ring-2 focus-visible:ring-[#E6C27A]"
        />
      </motion.div>
    </section>
  );
}
