import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { openConsultation } from '../../data/whoWeServe';

// <page>-p0..p3 (pillar cards), <page>-s0..s2 (stewardship cards) and <page>-hero
const ART = import.meta.glob('../../assets/planning/*.webp', { eager: true, import: 'default' });
const art = (cfg, name) => ART[`../../assets/planning/${cfg.art}-${name}.webp`];

const serif = { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" };

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

const ask = (cfg, title) => openConsultation({ goal: cfg.goal, message: `I’d like to know more about ${title}.` });

/** Dark band with four photo cards (e.g. "The Spectrum of Strategic & Alternative Funds"). Set cfg.pillarBadge for the icon badge on each photo. */
export function PhotoPillars({ cfg, sectionId }) {
  const p = cfg.pillars;
  return (
    <section id={sectionId} className="scroll-mt-20 bg-gradient-to-b from-[#07122b] to-[#0A1836] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="text-center">
          <p className="font-sora text-[12px] font-bold uppercase tracking-[0.28em] text-[#E2B24E]">{p.eyebrow}</p>
          <h2 style={serif} className="[text-wrap:balance] mx-auto mt-4 max-w-4xl text-[30px] font-medium leading-[1.12] text-white sm:text-[42px]">{p.title}</h2>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.items.map((c, i) => (
            <motion.article
              key={c.title}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group flex flex-col overflow-hidden rounded-md border border-white/[0.08] bg-[#0E2048] transition-all duration-300 hover:-translate-y-1 hover:border-[#E2B24E]/50"
            >
              <div className="relative">
                <div className="overflow-hidden bg-[#07122b]">
                  <img
                    src={art(cfg, `p${i}`)}
                    alt={c.title}
                    loading="lazy"
                    draggable="false"
                    className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                {cfg.pillarBadge && (
                  <span className="absolute bottom-0 left-4 z-10 flex h-11 w-11 translate-y-1/2 items-center justify-center rounded-full border border-[#E2B24E]/80 bg-[#0A1836] text-[#E2B24E] shadow-[0_6px_16px_rgba(0,0,0,0.45)]">
                    <c.icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                )}
              </div>
              <div className={`flex flex-1 flex-col px-5 pb-5 ${cfg.pillarBadge ? 'pt-8' : 'pt-4'}`}>
                <h3 style={serif} className="text-[21px] font-semibold leading-[1.15] text-white">{c.title}</h3>
                <p className="[text-wrap:pretty] mt-2.5 flex-1 text-[14px] leading-relaxed text-slate-300">{c.desc}</p>
                <button
                  type="button"
                  onClick={() => ask(cfg, c.title)}
                  aria-label={`Ask about ${c.title}`}
                  className="mt-5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#E2B24E]/80 text-[#E2B24E] transition-all duration-300 hover:bg-[#E2B24E] hover:text-[#0F1F45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B24E]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "Beyond Standard Planning": light band with three photo cards. */
export function PhotoStewardship({ cfg }) {
  const s = cfg.stewardship;
  return (
    <section className="bg-[#FBF9F4] py-14 sm:py-16">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <div>
            <p className="font-sora text-[12px] font-bold uppercase tracking-[0.28em] text-[#C9922E]">Beyond Standard Planning</p>
            <h2 style={serif} className="[text-wrap:balance] mt-3 text-[30px] font-medium leading-[1.12] text-[#0F1F45] sm:text-[42px]">{s.title}</h2>
          </div>
          <p className="[text-wrap:pretty] max-w-[60ch] text-[14.5px] leading-relaxed text-[#475569] lg:justify-self-end">{s.text}</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-3">
          {s.items.map((c, i) => (
            <motion.article key={c.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="group">
              <div className="overflow-hidden rounded-lg shadow-[0_10px_26px_rgba(15,31,69,0.14)]">
                <img
                  src={art(cfg, `s${i}`)}
                  alt={c.title}
                  loading="lazy"
                  draggable="false"
                  className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-4 font-sans text-[16.5px] font-bold leading-snug text-[#0F1F45]">{c.title}</h3>
              <p className="[text-wrap:pretty] mt-1.5 text-[14.5px] leading-relaxed text-[#475569]">{c.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Hero: text on the left, the page's own photo bleeding to the right edge. Uses cfg.eyebrow / title / text / primaryCta / trust. */
export function PhotoHero({ cfg }) {
  const goConsult = () => openConsultation({ goal: cfg.goal, message: `I’d like to request a private consultation on ${cfg.goal.toLowerCase()}.` });
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C] pt-[80px]">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 h-[420px] w-[420px] rounded-full bg-[#C9922E]/10 blur-[120px]" />
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-stretch gap-0 px-4 sm:px-6 lg:min-h-[clamp(520px,calc(100svh-80px),660px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 flex flex-col justify-center py-10 lg:py-12">
          <p className="font-sora text-[11.5px] font-bold uppercase tracking-[0.26em] text-[#E2B24E]">{cfg.eyebrow}</p>
          <h1 style={serif} className="[text-wrap:balance] mt-5 text-[38px] font-medium leading-[1.06] text-white sm:text-[50px] lg:text-[clamp(42px,4.2vw,62px)]">
            <span className="block text-[#E2B24E]">{cfg.titleGold.join(' ')}</span>
            {cfg.titleWhite.join(' ')}
          </h1>
          <p className="[text-wrap:pretty] mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-slate-200 sm:text-[16.5px]">{cfg.text}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={goConsult}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-6 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.35)] transition-transform hover:-translate-y-0.5"
            >
              {cfg.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={goConsult}
              className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Request a Private Consultation
            </button>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cfg.trust.map((t) => (
              <li key={t.label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2B24E]/70 text-[#E2B24E]">
                  <t.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <span className="text-[12.5px] font-medium leading-snug text-slate-100">{t.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* photo: bleeds to the screen edge on the right, fades into the navy on the left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto h-[320px] w-full max-w-[560px] overflow-hidden sm:h-[420px] lg:mx-0 lg:h-auto lg:w-[calc(100%+max(0px,(100vw-1320px)/2)+2rem)] lg:max-w-none [mask-image:linear-gradient(to_right,transparent,black_18%)]"
        >
          <img src={art(cfg, 'hero')} alt={cfg.eyebrow} draggable="false" className="absolute inset-0 h-full w-full object-cover object-[50%_28%]" />
        </motion.div>
      </div>
    </section>
  );
}

/** "Moving Beyond ..." philosophy: heading + text on the left, three icon cards on the right. */
export function IconPhilosophy({ cfg }) {
  const p = cfg.philosophy;
  return (
    <section className="bg-[#FDFCF8] py-14 sm:py-16">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:px-8">
        <motion.div {...fade}>
          <p className="font-sora text-[12px] font-bold uppercase tracking-[0.28em] text-[#C9922E]">{p.eyebrow}</p>
          <h2 style={serif} className="[text-wrap:balance] mt-3 text-[32px] font-medium leading-[1.12] text-[#0F1F45] sm:text-[42px]">{p.title.join(' ')}</h2>
          <span aria-hidden="true" className="mt-4 block h-[2px] w-9 bg-[#E08A1E]" />
          <p className="[text-wrap:pretty] mt-5 max-w-[56ch] text-[15px] leading-relaxed text-[#475569]">{p.text}</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {p.cards.map((c, i) => (
            <motion.div
              key={c.title}
              {...fade}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-xl border border-[#EFE9D8] bg-white/80 p-5 shadow-[0_8px_24px_rgba(15,31,69,0.05)]"
            >
              <c.icon className="h-10 w-10 text-[#E08A1E]" strokeWidth={1.4} />
              <h3 className="mt-3 font-sans text-[15px] font-bold leading-snug text-[#0F1F45]">{c.title}</h3>
              <p className="[text-wrap:pretty] mt-2 text-[13px] leading-relaxed text-[#64748B]">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
