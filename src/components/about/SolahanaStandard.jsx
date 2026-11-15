import React from 'react';
import { motion } from 'framer-motion';

import standardArt from '../../assets/about-standard.webp';

/** "The Solahana Standard: Placing Your Interests First" band (artwork supplied by the owner, text is part of the image). */
export default function SolahanaStandard() {
  return (
    <section className="bg-[#FAF9F6]" aria-label="The Solahana Standard: placing your interests first">
      <motion.figure
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="m-0"
      >
        <img
          src={standardArt}
          alt="The Solahana Standard. Placing Your Interests First. Four principles: independence, transparency, diagnostic rigor and institutional execution."
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
