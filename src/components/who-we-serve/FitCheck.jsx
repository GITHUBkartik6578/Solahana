import React from 'react';
import { Check, X } from 'lucide-react';
import { GOOD_FIT, NOT_A_FIT } from '../../data/whoWeServe';

export default function FitCheck() {
  return (
    <section className="bg-[#F7F8FB] py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif-luxury text-[28px] font-bold leading-tight text-[#0F1F45] [text-wrap:balance] sm:text-[34px]">
          Is Solahana the right fit for you?
        </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'var(--grad-gold)' }} />
        <p className="mt-4 max-w-2xl leading-relaxed text-[#475569]">We’d rather say it now than waste your time.</p>

        <div className="mt-10 grid overflow-hidden rounded-3xl border border-[#E4E8F0] bg-white shadow-[0_1px_2px_rgba(15,31,69,0.04),0_18px_44px_rgba(15,31,69,0.06)] md:grid-cols-2">
          <div className="p-7 sm:p-10">
            <h3 className="font-serif-luxury text-[19px] font-bold text-[#0F1F45]">We’ll work well together if you…</h3>
            <ul className="mt-6 space-y-4">
              {GOOD_FIT.map((item) => (
                <li key={item} className="flex gap-3 text-[15.5px] leading-snug text-[#0F1F45]">
                  <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F5BC7] text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#E4E8F0] bg-[#FBFBFD] p-7 sm:p-10 md:border-l md:border-t-0">
            <h3 className="font-serif-luxury text-[19px] font-bold text-[#0F1F45]">We’re probably not the right fit if you want…</h3>
            <ul className="mt-6 space-y-4">
              {NOT_A_FIT.map((item) => (
                <li key={item} className="flex gap-3 text-[15.5px] leading-snug text-[#475569]">
                  <span className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ECEFF4] text-[#5B6B84]">
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
