import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { openConsultation } from '../../data/whoWeServe';
import HeroBanner from '../common/HeroBanner';

// Photos cropped from the design mock-ups and upscaled: planning/<page>-<name>.webp
const ART = import.meta.glob('../../assets/planning/*.webp', { eager: true, import: 'default' });
const art = (cfg, name) => ART[`../../assets/planning/${cfg.art}-${name}.webp`];
const artFile = (file) => ART[`../../assets/planning/${file}.webp`];
const heroSrc = (cfg) => (cfg.heroFile ? artFile(cfg.heroFile) : art(cfg, 'hero'));
const ctaSrc = (cfg) => (cfg.ctaFile ? artFile(cfg.ctaFile) : art(cfg, 'cta'));

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const fade = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55 },
};

const consult = (cfg, what) =>
  openConsultation({ goal: cfg.goal, message: what ? `I’d like to know more about ${what}.` : `I’d like to request a private consultation on ${cfg.goal.toLowerCase()}.` });

function Eyebrow({ children, light, center }) {
  return (
    <p className={`inline-flex items-center gap-3 font-sora text-[11.5px] font-bold uppercase tracking-[0.3em] ${light ? 'text-[#E2B24E]' : 'text-[#9A7220]'}`}>
      <span className="h-px w-8 bg-[#C9922E]/70" />
      {children}
      {center && <span className="h-px w-8 bg-[#C9922E]/70" />}
    </p>
  );
}

function GoldRule({ center }) {
  return <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full bg-[#C9922E] ${center ? 'mx-auto' : ''}`} />;
}

function Lines({ lines }) {
  return lines.map((l) => (
    <span key={l} className="block">
      {l}
    </span>
  ));
}

/* ------------------------------------------------------------------ */
function Hero({ cfg }) {
  const goCalc = () => {
    const el = cfg.calculatorId && document.getElementById(cfg.calculatorId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else consult(cfg);
  };
  const b = cfg.banner;
  return (
    <>
    {/* Optional full-width hero banner (desktop only); its two baked-in buttons get invisible click areas */}
    {b && (
      <HeroBanner
        src={artFile(b.file)}
        alt={b.alt}
        ratio={b.ratio}
        maxVw={b.maxVw}
        fit={b.fit}
        minH={b.minH}
        hotspots={[
          { label: cfg.primaryCta, onClick: goCalc, style: b.primary },
          { label: 'Request a Private Consultation', onClick: () => consult(cfg), style: b.secondary },
        ]}
      />
    )}
    <section className={`relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C] pt-[80px]${b ? ' lg:hidden' : ''}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-[480px] w-[480px] rounded-full bg-[#C9922E]/15 blur-[120px]" />
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-6 px-4 sm:px-6 lg:min-h-[clamp(520px,calc(100svh-80px),700px)] lg:grid-cols-1 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 py-10 lg:max-w-[52%] lg:py-12">
          <Eyebrow light>{cfg.eyebrow}</Eyebrow>
          <h1 style={serif} className="[text-wrap:balance] mt-5 text-[34px] font-semibold leading-[1.1] tracking-[-0.01em] text-white sm:text-[44px] lg:text-[clamp(34px,3.5vw,50px)]">
            <span className="text-[#E2B24E]"><Lines lines={cfg.titleGold} /></span>
            <Lines lines={cfg.titleWhite} />
          </h1>
          <p className="[text-wrap:pretty] mt-5 max-w-[56ch] text-[15px] leading-relaxed text-slate-200 sm:text-[16.5px]">{cfg.text}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={goCalc}
              className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.4)] transition-transform hover:-translate-y-0.5"
            >
              {cfg.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              type="button"
              onClick={() => consult(cfg)}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Request a Private Consultation
            </button>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cfg.trust.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.label} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2B24E]/60 text-[#E2B24E]">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </span>
                  <span className="text-[12.5px] font-semibold leading-snug text-slate-100">{t.label}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`${cfg.heroClear ? '[container-type:size] ' : ''}relative mx-auto h-[360px] w-full max-w-[560px] overflow-hidden sm:h-[440px] lg:absolute lg:bottom-0 lg:right-0 lg:top-[80px] lg:h-auto lg:w-[50%] lg:self-stretch lg:max-w-none`}
        >
          {/* soft copy of the photo fills the space beside it */}
          <img src={heroSrc(cfg)} alt="" aria-hidden="true" draggable="false" className={`absolute inset-0 h-full w-full scale-125 object-cover blur-2xl ${cfg.heroClear ? 'opacity-40 [mask-image:linear-gradient(to_right,transparent,black_40%)]' : 'opacity-50'}`} />
          <div
            style={cfg.heroClear ? { aspectRatio: cfg.heroAspect, width: `min(100cqw, ${cfg.heroAspect * 100}cqh)` } : { aspectRatio: cfg.heroAspect }}
            className={`absolute right-0 max-w-none [mask-image:linear-gradient(to_right,transparent,black_22%)] ${cfg.heroClear ? 'bottom-0' : 'inset-y-0 h-full'}`}
          >
            <img src={heroSrc(cfg)} alt="Amit R. Pandey, Chartered Wealth Manager" draggable="false" className="h-full w-full" />
            {cfg.taglineBox && (
              <p
                style={{ ...serif, left: `${cfg.taglineBox.x * 100}%`, top: `${cfg.taglineBox.y * 100}%`, width: `${cfg.taglineBox.w * 100}%`, textAlign: cfg.taglineBox.align }}
                className="absolute hidden text-[19px] font-medium italic leading-snug text-[#F1D9A3] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] sm:block lg:text-[23px]"
              >
                {cfg.tagline.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </p>
            )}
          </div>
          {/* heroClear: the photo already carries its own navy lead-in on the left, so no overlay tints the subject */}
          {!cfg.heroClear && <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0F1F45] via-transparent to-transparent" />}
        </motion.div>
      </div>
    </section>
    </>
  );
}

function Philosophy({ cfg }) {
  const p = cfg.philosophy;
  return (
    <section className="bg-[#FEFDF9] py-16 sm:py-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-8">
        <motion.div {...fade}>
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mt-4 text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#0F1F45] sm:text-[38px]">
            <Lines lines={p.title} />
          </h2>
          <GoldRule />
          <p className="[text-wrap:pretty] mt-5 max-w-[58ch] text-[15.5px] leading-relaxed text-[#475569]">{p.text}</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {p.cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-[#E7DFCF] bg-white p-5 shadow-[0_12px_30px_rgba(15,31,69,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,31,69,0.14)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1A3170] to-[#0F1F45] text-[#E2B24E]">
                  <Icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h3 style={serif} className="mt-4 text-[16.5px] font-semibold leading-tight text-[#0F1F45]">{c.title}</h3>
                <p className="[text-wrap:pretty] mt-2 text-[13px] leading-relaxed text-[#475569]">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Pillars({ cfg, sectionId }) {
  const p = cfg.pillars;
  return (
    <section id={sectionId} className="scroll-mt-20 bg-gradient-to-b from-[#0A1836] to-[#0F1F45] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="text-center">
          <Eyebrow light center>{p.eyebrow}</Eyebrow>
          <h2 style={serif} className="[text-wrap:balance] mx-auto mt-4 max-w-3xl text-[28px] font-semibold leading-[1.15] tracking-[-0.01em] text-white sm:text-[38px]">{p.title}</h2>
          <GoldRule center />
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {p.items.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.button
                type="button"
                key={c.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                onClick={() => consult(cfg, c.title)}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#102552] text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E2B24E]/60 hover:shadow-[0_22px_44px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2B24E]"
              >
                <div className="relative h-[150px] overflow-hidden bg-[#0A1836]">
                  <img src={art(cfg, `p${i}`)} alt="" loading="lazy" draggable="false" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#102552] to-transparent" />
                  {cfg.pillarBadge && (
                    <span className="absolute bottom-2 left-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#E2B24E]/70 bg-[#0A1836]/85 text-[#E2B24E]">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 style={serif} className="text-[18px] font-semibold leading-tight text-white">{c.title}</h3>
                  <p className="[text-wrap:pretty] mt-2 flex-1 text-[13px] leading-relaxed text-slate-300">{c.desc}</p>
                  <span className="mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#E2B24E]/70 text-[#E2B24E] transition-all duration-300 group-hover:bg-[#E2B24E] group-hover:text-[#0F1F45]">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Stewardship({ cfg }) {
  const s = cfg.stewardship;
  return (
    <section className="bg-[#F7F8FB] py-16 sm:py-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <Eyebrow>Beyond Standard Planning</Eyebrow>
            <h2 style={serif} className="[text-wrap:balance] mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#0F1F45] sm:text-[38px]">{s.title}</h2>
            <GoldRule />
          </div>
          <p className="[text-wrap:pretty] text-[15px] leading-relaxed text-[#475569]">{s.text}</p>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {s.items.map((c, i) => {
            return (
              <motion.div
                key={c.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#E7DFCF] bg-white shadow-[0_12px_30px_rgba(15,31,69,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,31,69,0.14)]"
              >
                <div className="relative h-[150px] overflow-hidden bg-[#0A1836]">
                  <img src={art(cfg, `s${i}`)} alt="" loading="lazy" draggable="false" className="h-full w-full object-cover" />
                </div>
                <div className={`flex-1 p-6 ${cfg.stewardDark ? 'bg-[#0F1F45]' : ''}`}>
                  <h3 style={serif} className={`text-[18px] font-semibold leading-tight ${cfg.stewardDark ? 'text-white' : 'text-[#0F1F45]'}`}>{c.title}</h3>
                  <p className={`mt-2 text-[13.5px] leading-relaxed ${cfg.stewardDark ? 'text-slate-300' : 'text-[#475569]'}`}>{c.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Lifecycle({ cfg }) {
  const l = cfg.lifecycle;
  return (
    <section className="bg-[#FEFDF9] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="grid grid-cols-1 items-end gap-5 lg:grid-cols-[1fr_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <Eyebrow>{l.eyebrow}</Eyebrow>
            <h2 style={serif} className="[text-wrap:balance] mt-4 text-[28px] font-semibold leading-[1.15] tracking-[-0.01em] text-[#0F1F45] sm:text-[38px]">{l.title}</h2>
            <GoldRule />
          </div>
          <p className="[text-wrap:pretty] text-[15px] leading-relaxed text-[#475569]">{l.text}</p>
        </motion.div>

        <ol className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <span aria-hidden="true" className="absolute left-[12%] right-[12%] top-[34px] hidden h-px bg-gradient-to-r from-[#C9922E]/20 via-[#C9922E] to-[#C9922E]/20 lg:block" />
          {l.steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li key={s.title} {...fade} transition={{ duration: 0.5, delay: i * 0.08 }} className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-[#C9922E] bg-white text-[#0F1F45] shadow-[0_10px_24px_rgba(201,146,46,0.25)]">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                  <span style={serif} className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F1F45] text-[11px] font-semibold text-[#E2B24E]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
                <h3 style={serif} className="mt-4 text-[17.5px] font-semibold leading-tight text-[#0F1F45]">{s.title}</h3>
                <p className="mt-1.5 max-w-[28ch] text-[13px] leading-snug text-[#475569]">{s.desc}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Cta({ cfg }) {
  const c = cfg.cta;
  return (
    <section className="bg-[#F7F8FB] pb-16 pt-4 sm:pb-20">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <motion.div {...fade} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#1A3170] px-7 py-12 sm:px-12 sm:py-14">
          <img src={ctaSrc(cfg)} alt="" aria-hidden="true" loading="lazy" draggable="false" className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[62%] object-cover opacity-95 [mask-image:linear-gradient(to_right,transparent,black_30%)] lg:block" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[#C9922E]/25 blur-[90px]" />
          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div>
              <Eyebrow light>{c.eyebrow}</Eyebrow>
              <h2 style={serif} className="[text-wrap:balance] mt-4 text-[28px] font-semibold leading-[1.12] text-[#E2B24E] sm:text-[40px]">
                <Lines lines={c.title} />
              </h2>
              <p className="[text-wrap:pretty] mt-4 max-w-[52ch] text-[16px] leading-relaxed text-slate-200">{c.text}</p>
              <button
                type="button"
                onClick={() => consult(cfg)}
                className="group mt-7 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.4)] transition-transform hover:-translate-y-0.5"
              >
                {c.button}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <ul className="rounded-2xl border border-white/10 bg-[#0A1836]/90 p-5 backdrop-blur-sm sm:p-6">
              {c.benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.label} className="flex items-center gap-4 border-b border-white/10 py-3 first:pt-0 last:border-0 last:pb-0">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2B24E]/60 text-[#E2B24E]">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-[14.5px] font-semibold leading-snug text-white">{b.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Hero, philosophy, four pillars, stewardship and lifecycle. Calculators (if any) go after this, then <PlanningCta />. */
export function PlanningTop({ config, pillarsId }) {
  return (
    <>
      <Hero cfg={config} />
      <Philosophy cfg={config} />
      <Pillars cfg={config} sectionId={pillarsId} />
      <Stewardship cfg={config} />
      <Lifecycle cfg={config} />
    </>
  );
}

export function PlanningCta({ config }) {
  return <Cta cfg={config} />;
}

