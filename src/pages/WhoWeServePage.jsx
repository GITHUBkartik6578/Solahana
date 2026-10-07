import React, { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ArrowRight, Check, Phone, Users } from 'lucide-react';
import AudienceGuide from '../components/who-we-serve/AudienceGuide';
import FocusMap from '../components/who-we-serve/FocusMap';
import HowItWorks from '../components/who-we-serve/HowItWorks';
import FitCheck from '../components/who-we-serve/FitCheck';
import { DEFAULT_AUDIENCE, audienceFromHash, openConsultation } from '../data/whoWeServe';
import mascot from '../assets/hero-mascot.webp';

// Straight from our Process page: nothing here is a new claim.
const HERO_FACTS = ['Free first call', 'Plain language', 'No product pushing'];

export default function WhoWeServePage() {
  const { hash } = useLocation();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(
    () => audienceFromHash(typeof window === 'undefined' ? '' : window.location.hash) ?? DEFAULT_AUDIENCE,
  );

  // Links like /who-we-serve#nri open that guide (the scroll itself is handled by ScrollToTopAndSEO)
  useEffect(() => {
    const id = audienceFromHash(hash);
    if (id) setActiveId(id);
  }, [hash]);

  const selectAudience = useCallback((id, { scroll = false } = {}) => {
    setActiveId(id);
    // Keep the address shareable without triggering a router navigation (and its scroll jump)
    window.history.replaceState(window.history.state, '', `#${id}`);
    if (scroll) {
      document.getElementById('audience-guide')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="relative z-10 bg-white">
      {/* Hero + guide */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F1F4FA] via-[#F7F8FB] to-white pb-16 pt-28 sm:pb-24 sm:pt-36">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-12%] h-[640px] w-[640px] rounded-full bg-[#2F5BC7]/[0.07] blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute left-[-10%] top-[40%] h-[460px] w-[460px] rounded-full bg-[#C9A04F]/[0.14] blur-[110px]" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-8">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[#2F5BC7]">
                <Users className="h-4 w-4 text-[#C9A04F]" />
                Who we serve
              </p>
              <h1 className="mt-4 font-serif-luxury text-[38px] font-bold leading-[1.06] tracking-[-0.035em] text-[#0F1F45] [text-wrap:balance] sm:text-[52px] lg:text-[58px]">
                Which of these sounds like you today?
              </h1>
              <span aria-hidden="true" className="mt-5 block h-[4px] w-20 rounded-full" style={{ background: 'var(--grad-gold)' }} />
              <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-[#475569] sm:text-lg">
                Most people are several of them over a lifetime. Pick the one closest to where you are now, and see where we’d start.
              </p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
                {HERO_FACTS.map((f) => (
                  <li key={f} className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0F1F45]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A04F]/20 text-[#A67C2E]">
                      <Check className="h-3 w-3" strokeWidth={3.2} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Mascot on a gold-ringed disc */}
            <motion.div
              aria-hidden="true"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto hidden aspect-square w-full max-w-[330px] lg:block"
            >
              <span className="absolute inset-[6%] rounded-full border border-[#C9A04F]/45" />
              <span className="absolute inset-[16%] rounded-full bg-[radial-gradient(closest-side,rgba(230,194,122,0.55),rgba(230,194,122,0.08)_72%,transparent)]" />
              <span className="absolute inset-[16%] rounded-full border border-dashed border-[#C9A04F]/60" />
              <img src={mascot} alt="" draggable={false} className="absolute inset-x-[14%] bottom-[8%] top-[10%] h-[82%] w-[72%] object-contain drop-shadow-[0_18px_22px_rgba(15,31,69,0.22)]" />
            </motion.div>
          </div>

          <div className="mt-10 sm:mt-14">
            <AudienceGuide activeId={activeId} onSelect={selectAudience} />
          </div>
        </div>
      </section>

      <FocusMap activeId={activeId} onSelect={selectAudience} />
      <HowItWorks />
      <FitCheck />

      {/* Closing band, leads into the consultation form below */}
      <section className="bg-ink-band py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-serif-luxury text-[28px] font-bold leading-tight text-white [text-wrap:balance] sm:text-[38px]">
              Most people are a mix of two or three of these.
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed text-[#C7D2E6]">
              Tell us where you are today. We’ll shape the plan around your life, not a template.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#global-consultation-section"
              onClick={(e) => {
                e.preventDefault();
                openConsultation();
              }}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="tel:+917304442171"
              className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-[#E6C27A] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Phone className="h-4 w-4" />
              Or call +91 73044 42171
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
