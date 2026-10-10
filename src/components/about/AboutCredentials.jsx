import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Users } from 'lucide-react';
import { serif } from './aboutStyles';

const CREDENTIALS = [
  {
    icon: GraduationCap,
    title: <>CWM<sup className="text-[0.55em]">®</sup> Certified</>,
    text: 'Global professional standard in wealth management and financial strategy.',
  },
  {
    icon: Briefcase,
    title: '25+ Years Mastery',
    text: 'Decades of leadership experience in banking, financial services and wealth structuring.',
  },
  {
    icon: Users,
    title: 'Community Leadership',
    text: 'Active involvement in professional and local business initiatives across Mumbai.',
  },
];

export default function AboutCredentials() {
  return (
    <section aria-labelledby="about-credentials-heading" className="bg-[#F5F4F1] py-9 sm:py-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:gap-10 lg:px-10">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#D98A1B]">Our Experience &amp; Credentials</p>
          <h2 id="about-credentials-heading" style={serif} className="mt-2 text-[34px] font-semibold leading-[1.08] text-[#0F1F45] sm:text-[44px]">
            Professional
            <br />
            Pedigree &amp; Experience
          </h2>
          <span className="mt-4 block h-[3px] w-14 bg-[#E08A1E]" />
          <p className="mt-4 max-w-[34rem] text-[15.5px] leading-[1.6] text-[#475569]">
            A strong foundation of knowledge, experience and real-world execution across markets and clients.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CREDENTIALS.map((c, i) => (
            <motion.li
              key={c.text}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="rounded-xl border border-[#EDEAE2] bg-white/80 px-5 py-5 shadow-[0_8px_24px_rgba(15,31,69,0.06)]"
            >
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-[1.5px] border-[#E08A1E] text-[#E08A1E]">
                <c.icon className="h-6 w-6" strokeWidth={1.7} />
              </span>
              <h3 style={serif} className="mt-4 text-[22px] font-semibold leading-tight text-[#0F1F45]">{c.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-[1.55] text-[#475569]">{c.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
