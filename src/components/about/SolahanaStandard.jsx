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
          alt="The Solahana Standard. Placing Your Interests First. A disciplined, unbiased and client-centric approach to financial planning, built on transparency, expertise and your long-term goals. 01 Uncompromised Independence: zero product bias, we do not manufacture any financial products, ensuring our strategic guidance is 100 percent aligned with your family's goals. 02 Absolute Transparency: complete and unbiased disclosure of all material facts, strategies and mechanisms so you can make confident decisions. 03 Diagnostic Rigor: deep analytical framework based on CWM methodology to evaluate cash flows, risk, tax efficiency and estate plans. 04 Seamless Institutional Execution: all transactional execution routed through verified SEBI and AMFI-registered institutional channel partners for complete safety and compliance."
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
