import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Building2, ChartColumnIncreasing, ChevronRight, Copyright, FileText, Clock, Handshake, Info, Mail, Phone, Share2, User, ShieldCheck, Users } from 'lucide-react';
import { LEGAL_LINKS } from '../../data/legalPages';
import termsArt from '../../assets/terms-hero-art.webp';
import disclosuresArt from '../../assets/disclosures-hero-art.webp';

import disclosuresBanner from '../../assets/disclosures-hero-banner.webp';

import grievanceBanner from '../../assets/grievance-hero-banner.webp';
import privacyBanner from '../../assets/privacy-hero-banner.webp';
import termsBanner from '../../assets/terms-hero-banner.webp';

const BANNERS = { grievance: { src: grievanceBanner, w: 1600, h: 392 }, privacy: { src: privacyBanner, w: 1600, h: 534 }, disclosures: { src: disclosuresBanner, w: 1587, h: 582 }, terms: { src: termsBanner, w: 1600, h: 644 } }; // full-width hero pictures (desktop)
const ART = { terms: termsArt, disclosures: disclosuresArt };

const playfair = { fontFamily: "'Playfair Display', Georgia, serif" };

const ICONS = { file: FileText, building: Building2, users: Users, shield: ShieldCheck, copyright: Copyright, handshake: Handshake, chart: ChartColumnIncreasing, award: Award, mail: Mail, phone: Phone, clock: Clock, share: Share2, user: User };

/* a round gold badge: icon on gold, or (solid) navy icon / number on gold */
function Badge({ kind, number }) {
  if (kind === 'number') {
    return (
      <span style={playfair} className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0A1836] text-[20px] font-bold text-white shadow-[0_6px_16px_rgba(10,24,54,0.25)] sm:h-[64px] sm:w-[64px] sm:text-[26px]">
        {number}
      </span>
    );
  }
  const Icon = ICONS[kind] || FileText;
  return (
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#FBE2A0] to-[#EDB950] text-[#0A1836] shadow-[0_6px_16px_rgba(201,146,46,0.28)] sm:h-[64px] sm:w-[64px]">
      <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.9} />
    </span>
  );
}

/**
 * Terms of Use: artwork banner (scales of justice, "Trust / Compliance / Transparency"), the effective-date strip,
 * then numbered rows with two badges each. Everything is live text on the same 1320px container as the rest of the site.
 */
export default function TermsLayout({ page }) {
  return (
    <div className="relative z-10 bg-white">
      {/* banner */}
      {BANNERS[page.art] && (
        <section aria-label={page.title} className="hidden bg-[#0A1836] pt-[80px] lg:block">
          <h1 className="sr-only">{page.title}: {page.tagline}</h1>
          <img src={BANNERS[page.art].src} alt="" aria-hidden="true" width={BANNERS[page.art].w} height={BANNERS[page.art].h} fetchpriority="high" draggable="false" className="block h-auto w-full select-none" />
        </section>
      )}
      <section className={`relative isolate overflow-hidden bg-[#0A1836] pt-[80px] ${BANNERS[page.art] ? 'lg:hidden' : ''}`}>
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,#06122B_0%,#0A1B40_55%,#0E2350_100%)]" />
        {/* soft gold swoosh, top left */}
        <svg aria-hidden="true" viewBox="0 0 700 90" preserveAspectRatio="none" className="pointer-events-none absolute left-0 top-[80px] -z-10 hidden h-[60px] w-[52%] lg:block">
          <path d="M0 80 C 180 70, 420 40, 700 0" fill="none" stroke="#C9922E" strokeOpacity="0.55" strokeWidth="1.2" />
        </svg>
        {/* artwork on the right, bleeding off the screen edge and fading into the navy */}
        <div className="absolute bottom-0 right-0 top-[80px] -z-10 hidden lg:block" style={{ width: page.art === 'disclosures' ? '40%' : '58%' }}>
          <img
            src={ART[page.art] || termsArt}
            alt=""
            aria-hidden="true"
            draggable="false"
            className="h-full w-full object-cover object-[50%_42%]"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 34%)',
              maskImage: 'linear-gradient(to right, transparent, black 34%)',
            }}
          />
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-[40%] bg-gradient-to-t from-[#06122B]/70 to-transparent lg:hidden" />

        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10 flex flex-col justify-center py-9 lg:min-h-[300px] lg:max-w-[52%] lg:py-12">
            <nav aria-label="Breadcrumb" className="sr-only">
              <Link to="/">Home</Link>
              <ChevronRight />
              <span>{page.title}</span>
            </nav>
            <p className="inline-block text-[15px] font-semibold uppercase tracking-[0.24em] text-[#E8BC6B]">
              {page.eyebrow || 'Legal'}
              <span aria-hidden="true" className="mt-1.5 block h-[2px] w-full bg-[#E8BC6B]" />
            </p>
            <h1 style={playfair} className="mt-3 text-[44px] font-bold leading-[1.02] text-white sm:text-[60px] lg:text-[clamp(52px,5.2vw,80px)]">
              {page.titleAccent ? (
                <>
                  {page.title.replace(page.titleAccent, '').trim()}
                  <br />
                  <span className="bg-gradient-to-b from-[#F6D488] to-[#D9A441] bg-clip-text text-transparent">{page.titleAccent}</span>
                </>
              ) : page.title}
            </h1>
            <p className="mt-4 max-w-[34ch] text-[17px] leading-snug text-white/90 sm:text-[19px] lg:text-[clamp(18px,1.7vw,24px)] lg:max-w-none">{page.tagline}</p>
          </motion.div>
        </div>
      </section>

      {page.effective && (
      <section className={`relative overflow-hidden border-b border-[#EFE6D2] bg-gradient-to-r from-[#FBF6EA] via-[#FBF6EA] to-[#FBF6EA]/60 ${BANNERS[page.art] ? 'lg:hidden' : ''}`}>
        <div className="mx-auto max-w-[1320px] px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-[15.5px] text-[#0A1836]"><span className="font-bold">Effective Date:</span> {page.effective.date}</p>
          <p className="mt-0.5 text-[15.5px] text-[#0A1836]">{page.effective.entity}</p>
        </div>
      </section>
      )}

      {/* intro + contact cards */}
      {page.cards && (
        <section className="bg-white pb-6 pt-6 sm:pt-8">
          <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
            <p className="max-w-[88ch] text-[17px] leading-[1.65] text-[#0A1836] sm:text-[19px]">{page.intro}</p>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.95fr_1.35fr]">
              {page.cards.map((c) => {
                const Icon = ICONS[c.icon] || FileText;
                const Body = c.href ? 'a' : 'div';
                return (
                  <li key={c.title} className="flex">
                    <Body {...(c.href ? { href: c.href } : {})} className="flex w-full items-start gap-4 rounded-2xl bg-[#FBF1E3] px-5 py-5 transition-shadow hover:shadow-[0_10px_26px_rgba(15,31,69,0.1)]">
                      <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#FBE2A0] to-[#EDB950] text-[#0A1836] shadow-[0_6px_16px_rgba(201,146,46,0.28)]">
                        <Icon className="h-6 w-6" strokeWidth={2} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[17px] font-bold leading-snug text-[#0A1836]">{c.title}</span>
                        <span className={`mt-1 block break-words leading-snug text-[#334155] ${c.big ? 'text-[22px]' : 'text-[16.5px]'}`}>{c.text}</span>
                      </span>
                    </Body>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* numbered rows */}
      <section className={`pb-10 pt-4 sm:pb-14 ${page.cards ? 'bg-white' : 'bg-[#FDFCF9]'}`}>
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
          {page.sections.length > 0 && <ol className={page.card ? 'rounded-2xl border border-[#F0DDB5] bg-[#FEFBF4] px-2 sm:px-6' : ''}>
            {page.sections.map((s, i) => (
              <motion.li
                key={s.heading}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className={`grid grid-cols-1 items-start gap-4 py-7 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-10 lg:py-8 ${i > 0 ? 'border-t border-[#EDD9AE]' : ''}`}
              >
                <div className="flex items-center gap-4 lg:gap-8 lg:pl-12">
                  <Badge kind={s.icons[0]} />
                  <Badge kind={s.icons[1]} number={String(i + 1).padStart(2, '0')} />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h2 style={playfair} className="text-[24px] font-bold leading-tight text-[#0A1836] sm:text-[28px]">{s.heading}</h2>
                  <p className="mt-2 max-w-[80ch] text-[16px] leading-[1.65] text-[#475569] sm:text-[17.5px]">{s.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>}

          {page.notice && (
            <div className="mt-2 flex items-center gap-5 rounded-xl bg-[#FBF1DF] px-5 py-5 sm:px-7">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#A87420] text-white"><Info className="h-6 w-6" strokeWidth={2.2} /></span>
              <p className="border-l border-[#E6CFA0] pl-5 text-[15.5px] leading-[1.6] text-[#0A1836] sm:text-[17px]">{page.notice}</p>
            </div>
          )}

          {/* other pages */}
          <div className="mt-8 border-t border-[#E7E2D5] pt-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#9A7220]">More from Solahana</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {LEGAL_LINKS.filter((l) => l.slug !== page.slug).map((l) => (
                <li key={l.slug}>
                  <Link
                    to={l.path}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#E2B24E]/60 px-4 py-2 text-[14px] font-semibold text-[#0F1F45] transition-colors hover:bg-[#0F1F45] hover:text-white"
                  >
                    {l.title}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
