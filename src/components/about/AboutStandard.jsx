import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ShieldPlus, ChartColumnIncreasing, Users } from 'lucide-react';
import { serif } from './aboutStyles';

const PILLARS = [
  {
    icon: Compass,
    title: ['Uncompromised', 'Independence'],
    text: 'Zero product bias; we do not manufacture any financial products, ensuring our strategic guidance is 100% aligned with your family’s goals.',
  },
  {
    icon: ShieldPlus,
    title: ['Absolute', 'Transparency'],
    text: 'Complete and unbiased disclosure of all material facts, strategies, and mechanisms so you can make confident decisions.',
  },
  {
    icon: ChartColumnIncreasing,
    title: ['Diagnostic', 'Rigor'],
    text: 'Deep analytical framework based on CWM® methodology to evaluate cash flows, risk, tax efficiency, and estate plans.',
  },
  {
    icon: Users,
    title: ['Seamless Institutional', 'Execution'],
    text: 'All transactional execution routed through verified SEBI and AMFI-registered institutional channel partners for complete safety and compliance.',
  },
];

export default function AboutStandard() {
  return (
    <section aria-labelledby="about-standard-heading" className="bg-[#FBFAF7] py-10 sm:py-12">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#D98A1B]">The Solahana Standard</p>
        <h2 id="about-standard-heading" style={serif} className="mt-2 text-[34px] font-semibold leading-tight text-[#0F1F45] sm:text-[44px]">
          Placing Your Interests First
        </h2>

        <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.li
              key={p.title.join(' ')}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-xl border border-[#EEE9DD] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(15,31,69,0.07)]"
            >
              <div className="flex items-center gap-3.5">
                <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#0A1836] text-[#E2B24E]">
                  <p.icon className="h-7 w-7" strokeWidth={1.7} />
                </span>
                <h3 style={serif} className="text-[21px] font-semibold leading-[1.1] text-[#0F1F45]">
                  {p.title[0]}
                  <br />
                  {p.title[1]}
                </h3>
              </div>
              <p className="mt-4 text-[14.5px] leading-[1.6] text-[#475569]">{p.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
