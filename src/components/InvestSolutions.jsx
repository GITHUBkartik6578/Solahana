import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import art1 from '../assets/invest/01.webp';
import art2 from '../assets/invest/02.webp';
import art3 from '../assets/invest/03.webp';
import art4 from '../assets/invest/04.webp';
import art5 from '../assets/invest/05.webp';
import art6 from '../assets/invest/06.webp';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const AUTOPLAY_MS = 4500;

const SOLUTIONS = [
  {
    title: ['Mutual Funds', '& SIPs'],
    sub: null,
    desc: 'Goal-based wealth creation, liquid funds, and core equity/debt allocations.',
    art: art1,
    to: '/invest/mutual-funds',
  },
  {
    title: ['PMS, AIF & SIF'],
    sub: '(Alternative & Strategic Funds)',
    desc: 'High-alpha portfolio management services and institutional alternative funds.',
    art: art2,
    to: '/investments',
  },
  {
    title: ['Real Estate, REITs', '& Fractional Ownership'],
    sub: null,
    desc: 'Commercial real estate investments, REITs (Real Estate Investment Trusts), and high-yield fractional ownership opportunities.',
    art: art3,
    to: '/investments',
  },
  {
    title: ['Bonds, NCDs &', 'Fixed Income'],
    sub: null,
    desc: 'Tax-free bonds, high-yield corporate bonds, and fixed deposits for secure cash flows.',
    art: art4,
    to: '/invest/bonds',
  },
  {
    title: ['Equities, International', 'Investing & IPOs'],
    sub: '(Via Authorized Partners)',
    desc: 'Direct domestic equity mandates, global markets exposure, and primary market issuances.',
    art: art5,
    to: '/invest/domestic-equity',
  },
  {
    title: ['Insurance &', 'Risk Solutions'],
    sub: '(Life, Health, General & Keyman Insurance)',
    desc: 'Comprehensive family risk management and liability protection.',
    art: art6,
    to: '/risk-management',
  },
];

// how many cards fit per slide at the current width
function usePerView() {
  const get = () => (typeof window === 'undefined' ? 3 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
  const [n, setN] = useState(get);
  useEffect(() => {
    const onResize = () => setN(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return n;
}

function SolutionCard({ item, index }) {
  return (
    <Link
      to={item.to}
      className="group relative flex h-full min-h-[210px] overflow-hidden rounded-2xl border border-[#D9B56A]/70 bg-gradient-to-br from-white via-[#FEFDF9] to-[#FBF3E1] p-5 shadow-[0_10px_28px_rgba(15,31,69,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,31,69,0.16)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2F5BC7]/25"
    >
      <span
        style={serif}
        className="absolute left-4 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#0F1F45] text-[15px] font-bold text-[#F1D9A3] ring-2 ring-[#C9922E] shadow-[0_4px_10px_rgba(15,31,69,0.3)]"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative z-10 flex w-[62%] flex-col pl-[52px]">
        <h3 style={serif} className="text-[17.5px] font-bold leading-[1.15] text-[#0F1F45]">
          {item.title[0]}
          {item.title[1] && <span className="block text-[#B8862B]">{item.title[1]}</span>}
        </h3>
        {item.sub && <p style={serif} className="mt-1 text-[11px] font-semibold leading-snug text-[#B8862B]">{item.sub}</p>}
        <span className="mt-3 block h-[2px] w-9 rounded-full bg-[#C9922E]" />
        <p className="mt-3 text-[13px] leading-relaxed text-[#334155]">{item.desc}</p>
      </div>

      <img
        src={item.art}
        alt=""
        loading="lazy"
        draggable="false"
        className="pointer-events-none absolute bottom-0 right-0 h-[78%] w-auto max-w-[46%] object-contain object-bottom mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
      />

      <span className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#0F1F45] text-white ring-2 ring-[#C9922E] shadow-[0_6px_14px_rgba(15,31,69,0.3)] transition-transform duration-300 group-hover:translate-x-0.5">
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

export default function InvestSolutions() {
  const perView = usePerView();
  const pages = Math.ceil(SOLUTIONS.length / perView);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = Math.min(page, pages - 1);

  useEffect(() => {
    if (paused || pages < 2) return undefined;
    const t = setTimeout(() => setPage((p) => (Math.min(p, pages - 1) + 1) % pages), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [page, paused, pages]);

  const go = (i) => setPage((i + pages) % pages);

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#FBF8F3] to-white py-14 sm:py-16 lg:py-20"
      aria-label="Investment solutions"
      onPointerEnter={(e) => e.pointerType !== 'touch' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType !== 'touch' && setPaused(false)}
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex items-center gap-3 font-sora text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.3em] text-[#9A7220]">
            <span className="h-px w-8 bg-[#C9922E]/60" />
            Invest
            <span className="h-px w-8 bg-[#C9922E]/60" />
          </span>
          <h2 style={serif} className="mt-4 text-[30px] sm:text-[40px] lg:text-[44px] font-bold leading-[1.12] tracking-tight text-[#0F1F45]">
            Investment <span className="text-[#B8862B]">Solutions</span>
          </h2>
        </div>

        <div className="relative">
          {/* slides */}
          <div className="overflow-hidden px-1 py-4">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
              {Array.from({ length: pages }, (_, p) => (
                <div
                  key={p}
                  className="grid w-full shrink-0 gap-5"
                  style={{ gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))` }}
                  aria-hidden={p !== current}
                >
                  {SOLUTIONS.slice(p * perView, p * perView + perView).map((item, k) => (
                    <SolutionCard key={item.title.join(' ')} item={item} index={p * perView + k} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {pages > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(current - 1)}
                aria-label="Previous"
                className="absolute -left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9922E]/50 bg-white text-[#0F1F45] shadow-md hover:bg-[#FBF3E1] sm:flex xl:-left-5 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(current + 1)}
                aria-label="Next"
                className="absolute -right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9922E]/50 bg-white text-[#0F1F45] shadow-md hover:bg-[#FBF3E1] sm:flex xl:-right-5 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === current}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${i === current ? 'w-7 bg-[#1A3170]' : 'w-2 bg-[#2F5BC7]/30 hover:bg-[#2F5BC7]/60'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
