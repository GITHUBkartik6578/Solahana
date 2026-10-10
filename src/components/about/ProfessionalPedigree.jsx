import React from 'react';
import { motion } from 'framer-motion';

import credentialsArt from '../../assets/about-credentials.webp';

/** "Professional Pedigree & Experience" band (artwork supplied by the owner, text is part of the image). */
export default function ProfessionalPedigree() {
  return (
    <section className="bg-white" aria-label="Professional pedigree and experience">
      <motion.figure
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="m-0"
      >
        <img
          src={credentialsArt}
          alt="Our experience and credentials. Professional Pedigree and Experience. A strong foundation of knowledge, experience and real-world execution across markets and clients. CWM Certified: global professional standard in wealth management and financial strategy. 25 plus Years Mastery: decades of leadership experience in banking, financial services and wealth structuring. Community Leadership: active involvement in professional and local business initiatives across Mumbai."
          width="1600"
          height="400"
          loading="lazy"
          draggable="false"
          className="mx-auto block h-auto w-full max-w-[1920px]"
        />
      </motion.figure>
    </section>
  );
}
