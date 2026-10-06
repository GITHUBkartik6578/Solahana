import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, CalendarCheck, Clock, GraduationCap, ShieldCheck, BarChart3, Users, ArrowRight } from 'lucide-react';

import { EXPERTS } from '../data/experts';
import { scrollToConsultation } from '../utils/consultation';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const APPROACH_ICONS = [GraduationCap, BarChart3, ShieldCheck, Users];

function ExpertCard({ expert, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="overflow-hidden rounded-3xl border border-[#E7DFCF] bg-white shadow-[0_24px_60px_rgba(15,31,69,0.12)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)]">
        {/* photo */}
        <div className="relative h-[360px] bg-[#0F1F45] sm:h-[440px] lg:h-auto lg:min-h-[560px]">
          <img
            src={expert.photo}
            alt={expert.photoAlt}
            loading="lazy"
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0F1F45]/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              {expert.qualifications.map((q) => (
                <span key={q} className="rounded-full border border-[#E2B24E]/70 bg-[#0F1F45]/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-[#F1D9A3] backdrop-blur-sm">
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* details */}
        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <p className="font-sora text-[12px] font-bold uppercase tracking-[0.28em] text-[#9A7220]">{expert.credential}</p>
          <h2 style={serif} className="mt-2 text-[34px] font-bold leading-tight text-[#0F1F45] sm:text-[42px]">
            {expert.name}
          </h2>
          <p className="mt-1.5 text-[14px] font-semibold text-[#475569] sm:text-[15px]">{expert.headline}</p>
          <span className="mt-4 block h-[3px] w-14 rounded-full bg-[#C9922E]" />
          <p className="mt-4 text-[15px] leading-relaxed text-[#475569]">{expert.summary}</p>

          {/* experience at a glance */}
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {expert.stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-[#E7DFCF] bg-gradient-to-br from-white to-[#FBF3E1] px-3 py-3 text-center">
                <dt style={serif} className="text-[24px] font-bold leading-none text-[#0F1F45]">{s.value}</dt>
                <dd className="mt-1.5 text-[11px] font-medium leading-snug text-[#64748B]">{s.label}</dd>
              </div>
            ))}
          </dl>

          {/* areas of expertise */}
          <h3 className="mt-7 text-[13px] font-bold uppercase tracking-[0.18em] text-[#0F1F45]">Areas of expertise</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {expert.expertise.map((a) => (
              <li key={a.label}>
                <Link
                  to={a.to}
                  className="inline-flex items-center rounded-full border border-[#C9922E]/50 bg-[#FEFDF9] px-3.5 py-1.5 text-[12.5px] font-semibold text-[#0F1F45] transition-colors hover:bg-[#0F1F45] hover:text-white"
                >
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* how he works */}
          <h3 className="mt-7 text-[13px] font-bold uppercase tracking-[0.18em] text-[#0F1F45]">How he works</h3>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {expert.approach.map((a, i) => {
              const Icon = APPROACH_ICONS[i % APPROACH_ICONS.length];
              return (
                <li key={a.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C9922E]/60 bg-[#FBF3E1] text-[#B8862B]">
                    <Icon className="h-4 w-4" strokeWidth={1.7} />
                  </span>
                  <div>
                    <p style={serif} className="text-[14px] font-bold leading-tight text-[#0F1F45]">{a.title}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-[#475569]">{a.text}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* contact */}
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#0F1F45] to-[#1A3170] p-5 text-white sm:p-6">
            <p className="flex items-center gap-2 text-[12.5px] text-slate-300">
              <Clock className="h-4 w-4 text-[#E2B24E]" />
              Available {expert.hours}
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={expert.phoneTel}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E2B24E] to-[#C9922E] px-6 py-3 text-sm font-bold text-[#0F1F45] shadow-md transition-transform hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" />
                Call {expert.phoneDisplay}
              </a>
              <a
                href={expert.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <button
                type="button"
                onClick={() => scrollToConsultation()}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E2B24E]/70 px-6 py-3 text-sm font-semibold text-[#F1D9A3] transition-colors hover:bg-[#E2B24E]/15"
              >
                <CalendarCheck className="h-4 w-4" />
                Book Free Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function OurExpertsPage() {
  return (
    <div className="relative z-10 bg-white">
      {/* intro */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F3F6FC] via-white to-white pt-[104px] pb-10 sm:pt-[116px] sm:pb-12">
        <div className="mx-auto max-w-[1320px] px-4 text-center sm:px-6 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 font-sora text-[12px] font-bold uppercase tracking-[0.3em] text-[#9A7220] sm:text-[13px]"
          >
            <span className="h-px w-8 bg-[#C9922E]/60" />
            Our Experts
            <span className="h-px w-8 bg-[#C9922E]/60" />
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={serif}
            className="mx-auto mt-4 max-w-3xl text-[34px] font-bold leading-[1.1] tracking-tight text-[#0F1F45] sm:text-[46px] lg:text-[52px]"
          >
            Talk to the people <span className="text-[#B8862B]">behind your plan.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#475569] sm:text-lg"
          >
            Qualified advisors who explain things in plain language. Call, message on WhatsApp or book a free consultation.
          </motion.p>
        </div>
      </section>

      {/* experts */}
      <section className="pb-16 sm:pb-20" aria-label="Our experts">
        <div className="mx-auto max-w-[1320px] space-y-10 px-4 sm:px-6 lg:px-8">
          {EXPERTS.map((e, i) => (
            <ExpertCard key={e.id} expert={e} index={i} />
          ))}

          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#E7DFCF] bg-[#FEFDF9] px-6 py-5 text-center sm:flex-row sm:text-left">
            <p style={serif} className="text-[18px] font-bold text-[#0F1F45] sm:text-[20px]">
              Not sure where to start? <span className="text-[#B8862B]">See how our planning works.</span>
            </p>
            <Link
              to="/our-process"
              className="group inline-flex items-center gap-2 rounded-full bg-[#0F1F45] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(15,31,69,0.3)]"
            >
              Our Process
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
