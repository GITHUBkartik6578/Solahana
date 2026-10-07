import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check } from 'lucide-react';
import { STEPS } from '../../data/ourProcess';
import { openConsultation } from '../../data/whoWeServe';

const BOOK = { goal: 'Financial Planning', message: 'I’d like to book the free intro conversation.' };

/**
 * The five steps as one journey: a sticky rail on desktop (a gold line fills as you scroll),
 * a slim progress bar on phones, and one tall card per step.
 */
export default function ProcessJourney() {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef([]);

  // Which step is in the middle of the screen right now
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.dataset.index, e.isIntersecting));
        const current = [...seen.entries()].filter(([, on]) => on).map(([i]) => Number(i));
        if (current.length) setActive(Math.min(...current));
      },
      { rootMargin: '-38% 0px -52% 0px' },
    );
    sectionRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const fill = (active / (STEPS.length - 1)) * 100;

  return (
    <section className="bg-white pb-16 pt-6 sm:pb-24">
      {/* Phone progress bar */}
      <div className="sticky top-[80px] z-30 border-b border-[#E4E8F0] bg-white/92 backdrop-blur-md lg:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-bold text-[#0F1F45]">{STEPS[active].short}</span>
            <span className="shrink-0 font-semibold text-[#5B6B84]">
              Step {active + 1} of {STEPS.length}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E6EAF2]">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${((active + 1) / STEPS.length) * 100}%`, background: 'var(--grad-gold)' }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-10 px-4 sm:px-6 lg:mt-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-14 lg:px-8">
        {/* Desktop rail */}
        <nav aria-label="The five steps" className="hidden lg:block">
          <div className="sticky top-32">
          <ol className="relative">
            <span aria-hidden="true" className="absolute bottom-4 left-[17px] top-4 w-[2px] rounded-full bg-[#E6EAF2]" />
            <span
              aria-hidden="true"
              className="absolute left-[17px] top-4 w-[2px] rounded-full transition-[height] duration-500 ease-out"
              style={{ height: `calc((100% - 2rem) * ${fill / 100})`, background: 'var(--grad-gold)' }}
            />
            {STEPS.map((s, i) => {
              const done = i < active;
              const on = i === active;
              return (
                <li key={s.id} className="relative">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={on ? 'step' : undefined}
                    className="group flex w-full items-center gap-4 rounded-xl py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BC7]"
                  >
                    <span
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-serif-luxury text-sm font-bold transition-colors duration-300 ${
                        on
                          ? 'bg-[#1A3170] text-white ring-4 ring-[#C9A04F]/40'
                          : done
                            ? 'bg-[#C9A04F] text-white'
                            : 'border-2 border-[#CBD3E3] bg-white text-[#5B6B84] group-hover:border-[#2F5BC7]'
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" strokeWidth={3.2} /> : i + 1}
                    </span>
                    <span
                      className={`text-[15px] leading-snug transition-colors duration-300 ${
                        on ? 'font-bold text-[#0F1F45]' : 'font-semibold text-[#5B6B84] group-hover:text-[#1A3170]'
                      }`}
                    >
                      {s.short}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 rounded-2xl border border-[#E6D3A6] bg-gradient-to-b from-[#FBF7EC] to-white p-5 shadow-[0_10px_28px_rgba(15,31,69,0.06)]">
            <p className="font-serif-luxury text-[16px] font-bold leading-snug text-[#0F1F45]">Step 1 is free.</p>
            <p className="mt-1.5 text-[13.5px] leading-snug text-[#5B6B84]">A short call. No products, no pressure.</p>
            <a
              href="#global-consultation-section"
              onClick={(e) => {
                e.preventDefault();
                openConsultation(BOOK);
              }}
              className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#8A6420] underline-offset-4 hover:underline"
            >
              Book my intro call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
          </div>
        </nav>

        {/* The steps */}
        <div className="space-y-6 sm:space-y-8">
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <article
                key={s.id}
                id={s.id}
                data-index={i}
                ref={(el) => {
                  sectionRefs.current[i] = el;
                }}
                className={`relative scroll-mt-36 overflow-hidden rounded-3xl border bg-white transition-[box-shadow,border-color] duration-500 ${
                  on
                    ? 'border-[#D9C08A] shadow-[0_1px_2px_rgba(15,31,69,0.04),0_26px_60px_rgba(15,31,69,0.12)]'
                    : 'border-[#E4E8F0] shadow-[0_1px_2px_rgba(15,31,69,0.04),0_10px_28px_rgba(15,31,69,0.05)]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 z-20 h-[3px] transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-0'}`}
                  style={{ background: 'var(--grad-gold)' }}
                />
                <div
                  className={`grid ${
                    i % 2 === 0
                      ? 'md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_260px]'
                      : 'md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]'
                  }`}
                >
                  <div className={`relative p-6 sm:p-9 lg:p-10 ${i % 2 === 0 ? '' : 'md:order-2'}`}>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-5 right-4 select-none font-serif-luxury text-[120px] font-bold leading-none text-[#0F1F45]/[0.05] sm:right-7 sm:text-[160px]"
                    >
                      0{i + 1}
                    </span>
                    <p className="flex items-center gap-3 text-[13.5px] font-bold text-[#A67C2E]">
                      <span aria-hidden="true" className="h-[3px] w-8 rounded-full" style={{ background: 'var(--grad-gold)' }} />
                      Step {i + 1} of {STEPS.length}
                    </p>
                    <h2 className="mt-3 font-serif-luxury text-[27px] font-bold leading-[1.12] text-[#0F1F45] [text-wrap:balance] sm:text-[33px]">
                      {s.title}
                    </h2>
                    <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-[#475569]">{s.lead}</p>

                    <p className="mt-7 text-sm font-bold text-[#0F1F45]">{s.pointsTitle}</p>
                    <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex gap-2.5 text-[15px] font-semibold leading-snug text-[#0F1F45]">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2F5BC7] text-white">
                            <Check className="h-3 w-3" strokeWidth={3.4} />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-[#F6F1E4] px-4 py-3 text-[15px]">
                      <span className="font-bold text-[#8A6420]">You get:</span>
                      <span className="font-semibold text-[#0F1F45]">{s.outcome}</span>
                    </div>

                    {i < STEPS.length - 1 && (
                      <button
                        type="button"
                        onClick={() => goTo(i + 1)}
                        className="group mt-5 inline-flex items-center gap-2 rounded-full text-sm font-bold text-[#2F5BC7] outline-none transition-colors hover:text-[#1A3170] focus-visible:ring-2 focus-visible:ring-[#2F5BC7] focus-visible:ring-offset-2"
                      >
                        Next: {STEPS[i + 1].short}
                        <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                      </button>
                    )}
                  </div>

                  {/* Art tile */}
                  <div className={`relative order-first h-44 md:h-auto ${i % 2 === 0 ? 'md:order-none' : 'md:order-1'}`}>
                    <img
                      src={s.art}
                      alt={s.artAlt}
                      loading="lazy"
                      draggable={false}
                      className="absolute inset-0 h-full w-full object-cover object-[center_80%]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#E6C27A]/70 bg-[#0F1F45]/55 font-serif-luxury text-lg font-bold text-[#E6C27A] backdrop-blur-sm"
                    >
                      {i + 1}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
