import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { openConsultation } from '../../data/whoWeServe';
import aboutPhoto from '../../assets/about-photo.webp';
import { serif, GOLD_TEXT } from './aboutStyles';

const COMMITMENTS = ['Plan', 'Invest', 'Protect', 'Grow', 'Preserve', 'Transition'];

export default function AboutHeroBanner() {
  return (
    <section
      aria-label="About SOLAHANA"
      className="relative isolate overflow-hidden bg-[#0A1836] pt-[80px] text-white lg:hidden"
    >
      {/* warm glow + deep navy base */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(900px_500px_at_85%_40%,rgba(201,146,46,0.28),transparent_60%),linear-gradient(100deg,#07122B_0%,#0B1A3C_45%,#101F44_100%)]"
      />

      {/* portrait: right half on desktop, full-width band on mobile */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[62%] lg:block">
        <img
          src={aboutPhoto}
          alt="Amit R. Pandey, Chartered Wealth Manager (CWM), at his desk"
          width="1500"
          height="1459"
          draggable="false"
          className="h-full w-full object-cover object-[62%_34%]"
        />
        {/* navy grade over the portrait so the bright desk scene reads as a dark library */}
        <div className="absolute inset-0 bg-[#0A1836]/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1836] via-[#0A1836]/55 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-[26%] bg-gradient-to-l from-[#0A1836]/90 via-[#0A1836]/55 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A1836]/70 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 px-5 sm:px-8 lg:min-h-[560px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex flex-col justify-center py-10 lg:py-12"
        >
          <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-[#E2B24E] sm:text-[13px]">About Solahana</p>

          <h1
            style={{ ...serif, ...GOLD_TEXT }}
            className="mt-3 text-[48px] font-semibold leading-[1.02] sm:text-[64px] lg:text-[clamp(60px,5.6vw,84px)]"
          >
            Amit R. Pandey
          </h1>
          <p style={serif} className="mt-2 text-[26px] font-medium leading-tight text-white sm:text-[34px] lg:text-[clamp(32px,3vw,44px)]">
            Chartered Wealth Manager (CWM<sup className="align-super text-[0.5em] leading-none">®</sup>)
          </p>
          <p className="mt-4 max-w-[34rem] text-[16px] leading-snug text-white/95 sm:text-[19px] lg:text-[clamp(18px,1.55vw,22px)]">
            <span className="whitespace-nowrap">MBA <span className="mx-1.5 text-white/70">|</span> Ex-Banker <span className="mx-1.5 text-white/70">|</span> 25+ Years of Experience</span>{' '}
            in Financial Services
          </p>

          <span className="mt-5 block h-[3px] w-14 bg-[#E2B24E]" />

          <p style={serif} className="mt-5 max-w-[30rem] text-[24px] font-medium leading-[1.2] text-[#F3D9A4] sm:text-[30px] lg:text-[clamp(26px,2.3vw,34px)]">
            Comprehensive Wealth Architecture for a Secure and Prosperous Future.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => openConsultation()}
              className="inline-flex items-center justify-center gap-3 rounded-md bg-gradient-to-b from-[#F6D488] to-[#E8B95F] px-6 py-3.5 text-[15px] font-semibold text-[#0F1F45] shadow-[0_10px_26px_rgba(226,178,78,0.28)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B24E]"
            >
              Connect for a Private Consultation
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/our-process"
              className="inline-flex items-center justify-center rounded-md border border-white/60 bg-[#0A1836]/40 px-6 py-3.5 text-[15px] font-medium text-white transition-colors duration-200 hover:border-[#E2B24E] hover:text-[#F3D9A4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B24E]"
            >
              Know Our Approach
            </Link>
          </div>
        </motion.div>

        {/* mobile / tablet portrait */}
        <div className="relative -mx-5 h-[300px] overflow-hidden sm:-mx-8 sm:h-[380px] lg:hidden">
          <img
            src={aboutPhoto}
            alt=""
            aria-hidden="true"
            width="1500"
            height="1459"
            draggable="false"
            className="h-full w-full object-cover object-[62%_22%]"
          />
          <div className="absolute inset-0 bg-[#0A1836]/35 mix-blend-multiply" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0A1836] to-transparent" />
        </div>

        {/* PLAN / INVEST / ... column, far right on desktop */}
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          aria-label="Our commitment"
          className="absolute right-10 top-12 hidden text-[#F3D9A4] xl:block"
        >
          <ul style={serif} className="space-y-1.5 text-[22px] font-semibold uppercase leading-none tracking-[0.12em]">
            {COMMITMENTS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <span className="my-4 block h-px w-14 bg-[#E2B24E]/80" />
          <p style={serif} className="text-[15px] font-semibold uppercase leading-snug tracking-[0.1em] text-[#F3D9A4]">
            Your Wealth
            <br />
            Our Commitment
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
