import React from 'react';
import { motion } from 'framer-motion';

import founderNote from '../../assets/about-founder-note.webp';

/** Founder's note & philosophy banner (artwork supplied by the owner, the text is part of the image). */
export default function FounderNote() {
  return (
    <section className="bg-[#0A1836]" aria-label="Founder’s note and philosophy">
      <motion.figure
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="m-0"
      >
        <img
          src={founderNote}
          alt="Founder’s note and philosophy. Built on Trust. Backed by Decades of Rigor. “True wealth management is not about selling financial products; it is about standing shoulder-to-shoulder with families to protect their legacy and secure their future. With over 25 years of hands-on financial and banking experience, my commitment is simple: your best interests come first, always.” Amit R. Pandey, CWM®, Principal Officer and Wealth Architect."
          width="1600"
          height="600"
          loading="lazy"
          draggable="false"
          className="mx-auto block h-auto w-full max-w-[1920px]"
        />
      </motion.figure>
    </section>
  );
}
