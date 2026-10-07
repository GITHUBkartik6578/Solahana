import React, { useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, CircleAlert } from 'lucide-react';
import { AUDIENCES, FOCUS_AREAS, openConsultation } from '../../data/whoWeServe';

const EASE = [0.22, 1, 0.36, 1];

/**
 * "Which one are you?" guide: six people stand on top of a panel.
 * Picking one (click, or arrow keys) swaps the panel to that person's plan.
 */
export default function AudienceGuide({ activeId, onSelect }) {
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef([]);
  const active = AUDIENCES.find((a) => a.id === activeId) ?? AUDIENCES[0];
  const ActiveIcon = active.icon;

  const moveTo = (i) => {
    const next = (i + AUDIENCES.length) % AUDIENCES.length;
    onSelect(AUDIENCES[next].id);
    tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (e, i) => {
    const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: AUDIENCES.length - 1 };
    if (e.key in keys) {
      e.preventDefault();
      moveTo(keys[e.key]);
    }
  };

  return (
    <div id="audience-guide" className="relative scroll-mt-24">
      {/* Old deep links (/who-we-serve#nri etc.) land here */}
      {AUDIENCES.map((a) => (
        <span key={a.id} id={a.id} className="absolute top-0 scroll-mt-28" aria-hidden="true" />
      ))}

      {/* The six people */}
      <div
        role="tablist"
        aria-label="Choose the description closest to you"
        className="relative z-10 grid grid-cols-6 gap-1 sm:gap-3 lg:gap-4 px-0.5 sm:px-4 lg:px-5"
      >
        {AUDIENCES.map((a, i) => {
          const selected = a.id === active.id;
          const Icon = a.icon;
          return (
            <motion.button
              key={a.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`audience-tab-${a.id}`}
              aria-selected={selected}
              aria-controls="audience-panel"
              aria-label={a.label}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(a.id)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.08, ease: EASE }}
              className="group relative flex min-w-0 flex-col items-center justify-end rounded-2xl text-center outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BC7] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F7F8FB] cursor-pointer"
            >
              {/* Speech bubble (desktop) */}
              <span
                className={`relative mb-5 hidden w-full max-w-[188px] rounded-2xl px-3.5 py-3 text-left transition-colors duration-200 lg:block ${
                  selected
                    ? 'bg-[#0F1F45] text-white shadow-[0_14px_30px_rgba(15,31,69,0.22)]'
                    : 'border border-[#E4E8F0] bg-white text-[#0F1F45] shadow-[0_1px_2px_rgba(15,31,69,0.04)] group-hover:border-[#C5D2EC]'
                }`}
              >
                <span className={`flex items-start gap-1.5 text-[12px] font-bold leading-tight ${selected ? 'text-[#E6C27A]' : 'text-[#2F5BC7]'}`}>
                  <Icon className="mt-px h-3.5 w-3.5 shrink-0" strokeWidth={2.4} />
                  <span>{a.label}</span>
                </span>
                <span className="mt-1.5 block text-[13.5px] font-semibold leading-snug">“{a.quote}”</span>
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-[7px] left-0 right-0 mx-auto h-3.5 w-3.5 rotate-45 ${
                    selected ? 'bg-[#0F1F45]' : 'border-b border-r border-[#E4E8F0] bg-white group-hover:border-[#C5D2EC]'
                  }`}
                />
              </span>

              {/* Short label (mobile + tablet) */}
              <span
                className={`mb-2 block text-[10.5px] font-bold leading-tight sm:text-xs lg:hidden ${
                  selected ? 'text-[#1A3170]' : 'text-[#5B6B84]'
                }`}
              >
                {a.shortLabel}
              </span>

              {/* The person, standing on the panel */}
              <span className="relative flex h-[112px] items-end justify-center sm:h-[150px] lg:h-[196px]">
                {selected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-[-18%] bottom-[2%] top-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(230,194,122,0.55),rgba(230,194,122,0.14)_65%,transparent)]"
                  />
                )}
                {selected && (
                  <motion.span
                    layoutId="audience-ground"
                    transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
                    aria-hidden="true"
                    className="absolute -bottom-2.5 -left-1/4 -right-1/4 h-6 rounded-[50%] bg-[radial-gradient(closest-side,rgba(201,160,79,0.8),rgba(201,160,79,0))]"
                  />
                )}
                <img
                  src={a.figure}
                  alt=""
                  draggable={false}
                  className={`relative h-full w-auto max-w-none select-none object-contain transition-[opacity,filter,transform] duration-300 ${
                    selected
                      ? 'scale-[1.03] opacity-100 drop-shadow-[0_12px_14px_rgba(15,31,69,0.22)]'
                      : 'opacity-70 saturate-[0.75] group-hover:opacity-100 group-hover:saturate-100'
                  }`}
                />
              </span>

              {/* "You are here" mark on the panel's top edge */}
              {selected && (
                <motion.span
                  layoutId="audience-marker"
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
                  aria-hidden="true"
                  className="absolute -bottom-[3px] left-0 right-0 mx-auto h-[4px] w-10 rounded-full bg-[#C9A04F] sm:w-14"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* The plan for whoever is selected */}
      <div
        id="audience-panel"
        role="tabpanel"
        aria-labelledby={`audience-tab-${active.id}`}
        className="relative rounded-3xl border border-[#E4E8F0] bg-white shadow-[0_1px_2px_rgba(15,31,69,0.04),0_28px_64px_rgba(15,31,69,0.09)]"
      >
        <span aria-hidden="true" className="absolute inset-x-8 top-0 h-[3px] rounded-b-full" style={{ background: 'var(--grad-gold)' }} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="grid gap-8 p-6 sm:p-9 lg:min-h-[468px] lg:grid-cols-[1.08fr_1fr] lg:gap-14 lg:p-12"
          >
            {/* Left: who you are */}
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FB] px-3 py-1.5 text-[12.5px] font-bold text-[#1A3170]">
                <ActiveIcon className="h-3.5 w-3.5 text-[#A67C2E]" strokeWidth={2.4} />
                {active.label}
              </p>
              <p className="mt-4 font-serif-luxury text-[17px] font-semibold leading-snug text-[#2F5BC7] lg:hidden">“{active.quote}”</p>
              <h2 className="mt-4 font-serif-luxury text-[27px] font-bold leading-[1.14] text-[#0F1F45] [text-wrap:balance] sm:text-[33px] lg:text-[38px]">
                {active.title}
              </h2>
              <p className="mt-4 max-w-[54ch] text-[16px] leading-relaxed text-[#475569]">{active.lead}</p>

              <p className="mt-8 text-sm font-bold text-[#0F1F45]">Sounds familiar?</p>
              <ul className="mt-3 space-y-2.5">
                {active.familiar.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-snug text-[#475569]">
                    <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A04F]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: where we'd start */}
            <div className="flex flex-col">
              <div className="rounded-2xl border border-[#E4E8F0] bg-[#F7F8FB] p-5 sm:p-7">
                <p className="text-sm font-bold text-[#0F1F45]">Where we’d start</p>
                <ol className="mt-4 space-y-4">
                  {active.start.map((step, i) => (
                    <li key={step} className="flex items-start gap-3.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A3170] font-serif-luxury text-[13px] font-bold text-white ring-2 ring-[#C9A04F]/70 ring-offset-2 ring-offset-[#F7F8FB]">
                        {i + 1}
                      </span>
                      <span className="pt-[3px] text-[15.5px] font-semibold leading-snug text-[#0F1F45]">{step}</span>
                    </li>
                  ))}
                </ol>

                <p className="mt-6 border-t border-[#E4E8F0] pt-5 text-[13px] font-semibold text-[#5B6B84]">Areas we’d focus on</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {active.focus.map((key) => (
                    <Link
                      key={key}
                      to={FOCUS_AREAS[key].to}
                      className="rounded-full border border-[#DCE3F0] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#1A3170] transition-colors hover:border-[#2F5BC7] hover:text-[#2F5BC7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BC7]"
                    >
                      {FOCUS_AREAS[key].label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href="#global-consultation-section"
                  onClick={(e) => {
                    e.preventDefault();
                    openConsultation(active.consult);
                  }}
                  className="gold-glow-button group"
                >
                  <span>{active.cta}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link
                  to={active.tool.to}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#2F5BC7] underline-offset-4 hover:text-[#1A3170] hover:underline"
                >
                  <Calculator className="h-4 w-4" />
                  Try the {active.tool.label}
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
