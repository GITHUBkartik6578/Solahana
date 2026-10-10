import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Mail, Phone } from 'lucide-react';
import { openConsultation } from '../../data/whoWeServe';
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF, LEGAL_LINKS } from '../../data/legalPages';

import photoMf from '../../assets/planning/mf-hero.webp';
import photoPms from '../../assets/planning/pms-hero.webp';
import photoRe from '../../assets/planning/re-hero.webp';
import photoBonds from '../../assets/planning/bonds-hero.webp';
import photoEstate from '../../assets/planning/estate-hero.webp';

// object-position keeps the person's face in the middle of the banner; no product-book labels end up in view
const PHOTOS = {
  mf: { src: photoMf, pos: 'object-[35%_26%]' },
  pms: { src: photoPms, pos: 'object-[35%_5%]' },
  re: { src: photoRe, pos: 'object-[35%_17%]' },
  bonds: { src: photoBonds, pos: 'object-[35%_26%]' },
  estate: { src: photoEstate, pos: 'object-[35%_40%]' },
};

const serif = { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" };

/**
 * Shared layout for the footer pages: a photo banner with the page name in bold, then the content
 * (bold section headings), then links to the other pages.
 */
export default function LegalPage({ page }) {
  const photo = PHOTOS[page.photo] || PHOTOS.mf;
  return (
    <div className="relative z-10 bg-white">
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1836] via-[#0F1F45] to-[#142A5C] pt-[80px]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 h-[360px] w-[360px] rounded-full bg-[#C9922E]/10 blur-[110px]" />
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-4 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative z-10 py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] font-medium text-slate-300">
              <Link to="/" className="transition-colors hover:text-[#E2B24E]">Home</Link>
              <ChevronRight className="h-3.5 w-3.5 text-[#E2B24E]/70" />
              <span className="text-[#E2B24E]">{page.title}</span>
            </nav>
            <h1 style={serif} className="mt-5 text-[40px] font-bold leading-[1.05] tracking-[-0.005em] text-white sm:text-[54px] lg:text-[clamp(44px,4.4vw,62px)]">
              {page.title}
            </h1>
            <span aria-hidden="true" className="mt-5 block h-[3px] w-14 rounded-full bg-[#C9922E]" />
            <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-slate-200">{page.tagline}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mx-auto hidden h-[300px] w-full max-w-[560px] overflow-hidden lg:mx-0 lg:block lg:h-[330px] lg:w-[calc(100%+max(0px,(100vw-1320px)/2)+2rem)] lg:max-w-none [mask-image:linear-gradient(to_right,transparent,black_22%)]"
          >
            <img src={photo.src} alt="" aria-hidden="true" draggable="false" className={`absolute inset-0 h-full w-full object-cover ${photo.pos}`} />
          </motion.div>
          {/* phone: photo as a slim strip under the title */}
          <div className="relative -mx-4 h-[170px] overflow-hidden sm:-mx-6 sm:h-[220px] lg:hidden [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
            <img src={photo.src} alt="" aria-hidden="true" draggable="false" className={`absolute inset-0 h-full w-full object-cover ${photo.pos}`} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
          <div className="space-y-10">
            {page.sections.map((s, i) => (
              <motion.article
                key={s.heading}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
              >
                <h2 style={serif} className="text-[28px] font-bold leading-tight text-[#0F1F45] sm:text-[32px]">{s.heading}</h2>
                <span aria-hidden="true" className="mt-3 block h-[3px] w-10 rounded-full bg-[#C9922E]" />
                <p className="mt-4 text-[16.5px] leading-[1.8] text-[#334155]">{s.text}</p>
              </motion.article>
            ))}
          </div>

          {page.contactCards && (
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="group flex items-center gap-4 rounded-2xl border border-[#EFE9D8] bg-[#FEFDF9] p-5 shadow-[0_8px_24px_rgba(15,31,69,0.06)] transition-shadow hover:shadow-[0_14px_34px_rgba(15,31,69,0.12)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F6D894] to-[#E2A93E] text-[#0F1F45]">
                  <Mail className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block text-[12px] font-bold uppercase tracking-[0.18em] text-[#9A7220]">Email</span>
                  <span className="mt-0.5 block break-all text-[17px] font-semibold text-[#0F1F45] group-hover:underline">{CONTACT_EMAIL}</span>
                </span>
              </a>
              <a
                href={CONTACT_PHONE_HREF}
                className="group flex items-center gap-4 rounded-2xl border border-[#EFE9D8] bg-[#FEFDF9] p-5 shadow-[0_8px_24px_rgba(15,31,69,0.06)] transition-shadow hover:shadow-[0_14px_34px_rgba(15,31,69,0.12)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F6D894] to-[#E2A93E] text-[#0F1F45]">
                  <Phone className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block text-[12px] font-bold uppercase tracking-[0.18em] text-[#9A7220]">Phone</span>
                  <span className="mt-0.5 block text-[17px] font-semibold text-[#0F1F45] group-hover:underline">{CONTACT_PHONE}</span>
                </span>
              </a>
            </div>
          )}

          {page.bookCta && (
            <button
              type="button"
              onClick={() => openConsultation()}
              className="group mt-8 inline-flex cursor-pointer items-center gap-2 rounded-md bg-gradient-to-r from-[#E6C27A] to-[#C9922E] px-7 py-3.5 text-sm font-bold text-[#0F1F45] shadow-[0_12px_30px_rgba(201,146,46,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Book a Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}

          {/* Other pages */}
          <div className="mt-14 border-t border-[#E7E2D5] pt-8">
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
