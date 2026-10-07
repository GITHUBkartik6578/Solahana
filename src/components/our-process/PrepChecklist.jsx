import React from 'react';
import { Check } from 'lucide-react';
import { PREP_ITEMS } from '../../data/ourProcess';

/** What to keep handy for the detailed discussion. Nothing here is mandatory. */
export default function PrepChecklist() {
  return (
    <section className="bg-gradient-to-b from-white to-[#F7F8FB] py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:px-8">
        <div>
          <h2 className="font-serif-luxury text-[28px] font-bold leading-tight text-[#0F1F45] [text-wrap:balance] sm:text-[34px]">
            Nice to have handy for step 2
          </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'var(--grad-gold)' }} />
          <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-[#475569]">
            None of this is needed for the first call. If something is missing later, that is fine too.
          </p>
        </div>
        <ul className="grid gap-3">
          {PREP_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-2xl border border-[#E4E8F0] bg-white px-4 py-3.5 shadow-[0_8px_22px_rgba(15,31,69,0.05)]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#C9A04F]/20 text-[#A67C2E]">
                <Check className="h-3.5 w-3.5" strokeWidth={3.2} />
              </span>
              <span className="text-[15.5px] font-semibold leading-snug text-[#0F1F45]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
