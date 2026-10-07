import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PROCESS_FAQS } from '../../data/ourProcess';

/** Short answers about how the process works (native <details>, so it works without JS). */
export default function ProcessFaq() {
  return (
    <section className="bg-[#F7F8FB] py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif-luxury text-[28px] font-bold leading-tight text-[#0F1F45] [text-wrap:balance] sm:text-[34px]">
          Questions about the process
        </h2>
        <span aria-hidden="true" className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'var(--grad-gold)' }} />
        <div className="mt-8 space-y-3">
          {PROCESS_FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-[#E4E8F0] bg-white px-5 py-4 shadow-[0_8px_22px_rgba(15,31,69,0.05)] open:border-[#D9C08A]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-bold text-[#0F1F45] outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BC7] [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-[#A67C2E] transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
