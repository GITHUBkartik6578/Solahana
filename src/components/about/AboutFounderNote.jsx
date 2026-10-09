import React from 'react';
import { motion } from 'framer-motion';
import { serif, script } from './aboutStyles';

const BOOKS = [
  { label: 'Discipline', shift: 0, w: 100 },
  { label: 'Objectivity', shift: 3, w: 102 },
  { label: 'Integrity', shift: -1, w: 101 },
  { label: 'Long-Term Thinking', shift: 4, w: 104 },
];

/* four navy hardbacks with gold lettering, built live so the text stays sharp */
function BookStack() {
  return (
    <div className="relative" style={{ width: 'min(100%, 430px)' }}>
      {BOOKS.map((b) => (
        <div
          key={b.label}
          style={{ ...serif, width: `${b.w}%`, marginLeft: `${b.shift}%` }}
          className="relative -mt-px flex h-[54px] items-center justify-center rounded-[3px] border-y border-[#0A1124] bg-gradient-to-b from-[#16264F] via-[#0E1B3C] to-[#091227] pl-6 text-[18px] font-semibold uppercase tracking-[0.04em] text-[#E8BC6B] shadow-[0_6px_14px_rgba(0,0,0,0.45)] sm:h-[60px] sm:text-[20px]"
        >
          {/* cream page block on the spine side */}
          <span aria-hidden="true" className="absolute inset-y-[3px] left-0 w-4 rounded-l-[3px] bg-gradient-to-b from-[#EFE3C8] to-[#CDBB93]" />
          <span aria-hidden="true" className="absolute inset-y-0 left-6 w-px bg-[#E8BC6B]/50" />
          <span aria-hidden="true" className="absolute inset-y-0 left-[30px] w-px bg-[#E8BC6B]/50" />
          {b.label}
        </div>
      ))}
    </div>
  );
}

export default function AboutFounderNote() {
  return (
    <section aria-label="Founder's note and philosophy" className="relative isolate overflow-hidden bg-[#08142F] text-white">
      {/* right-hand scene: warm lamp light, bokeh, glossy desk */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(520px_360px_at_74%_38%,rgba(201,146,46,0.34),transparent_65%),radial-gradient(360px_260px_at_92%_70%,rgba(226,178,78,0.22),transparent_70%),radial-gradient(240px_200px_at_58%_30%,rgba(60,120,80,0.28),transparent_70%),linear-gradient(100deg,#07122B_0%,#08142F_46%,#0F1D3D_70%,#17140F_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 hidden h-[26%] bg-gradient-to-t from-[#2A1F0E]/70 via-[#0B1530]/40 to-transparent lg:block" />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-6 lg:px-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#E2B24E]">Founder&rsquo;s Note &amp; Philosophy</p>
          <h2 style={serif} className="mt-3 text-[34px] font-semibold leading-[1.08] text-white sm:text-[44px] lg:whitespace-nowrap lg:text-[clamp(38px,3.2vw,50px)]">
            Built on Trust. Backed by Decades of Rigor.
          </h2>
          <blockquote className="mt-5 max-w-[44rem] text-[16px] leading-[1.6] text-white/95 sm:text-[18px] lg:text-[19.5px]">
            “True wealth management is not about selling financial products; it is about standing shoulder-to-shoulder with families to protect their legacy and secure their future. With over 25 years of hands-on financial and banking experience, my commitment is simple: your best interests come first&mdash;always.”
          </blockquote>

          <p style={script} className="mt-6 text-[48px] leading-none text-[#F3D9A4] sm:text-[56px]">Amit R. Pandey</p>
          <p style={serif} className="mt-3 text-[20px] font-semibold text-white">Amit R. Pandey, CWM<sup className="text-[0.55em]">®</sup></p>
          <p className="text-[14.5px] text-white/90">Principal Officer &amp; Wealth Architect</p>
        </motion.div>

        {/* books + framed plaque */}
        <div aria-hidden="true" className="relative hidden items-end justify-center gap-5 lg:flex">
          <div className="mb-8 self-end">
            <BookStack />
            {/* fountain pen on the desk */}
            <span className="mt-3 block h-[7px] w-[72%] origin-left -rotate-[3deg] rounded-full bg-gradient-to-r from-[#0B0F1A] via-[#1B2236] to-[#C9922E] shadow-[0_3px_8px_rgba(0,0,0,0.5)]" />
          </div>
          <div className="mb-14 self-center rounded-[4px] border-[3px] border-[#C9922E]/80 bg-[#0E1B3C]/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.5)]">
            <div className="flex h-[210px] w-[170px] flex-col items-center justify-center gap-5 border border-[#C9922E]/70" style={serif}>
              <span className="text-[17px] font-semibold uppercase tracking-[0.04em] text-[#E8BC6B]">Families</span>
              <span className="text-[17px] font-semibold uppercase tracking-[0.04em] text-[#E8BC6B]">Businesses</span>
              <span className="text-[17px] font-semibold uppercase tracking-[0.04em] text-[#E8BC6B]">Generations</span>
              <span className="h-px w-8 bg-[#E8BC6B]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
