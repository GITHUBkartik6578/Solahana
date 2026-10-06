import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Shield, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import heroOrbit from '../assets/hero-orbit.webp';
import heroMascot from '../assets/hero-mascot.webp';
import { PlanningSlide, slides as planningSlides } from './PlanningSlides';

const AUTOPLAY_MS = 4500;

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const trustPoints = [
  { icon: Shield, lines: ['Trusted', 'Process'] },
  { icon: Users, lines: ['Personalised', 'for You'] },
  { icon: BarChart3, lines: ['Long-Term', 'Focus'] },
];

// The orbit artwork is cropped to the wheel itself, so it can sit in its own grid column.
// Click targets over the six planning circles baked into the artwork (centres in the image's own px)
const IMG_W = 710;
const IMG_H = 782;
const hotspots = [
  { label: 'Financial Planning', to: '/financial-planning', x: 352, y: 110 },
  { label: 'Wealth Planning', to: '/goals', x: 109, y: 235 },
  { label: 'Investment Planning', to: '/investments', x: 100, y: 478 },
  { label: 'Tax Planning', to: '/tax-planning', x: 350, y: 612 },
  { label: 'Risk Planning', to: '/risk-management', x: 606, y: 478 },
  { label: 'Estate Planning', to: '/estate-planning', x: 600, y: 235 },
];

// The dashed connector from the artwork, redrawn as SVG in the image's pixel space so it can turn.
// Same ellipse, stroke, dash rhythm and six gold dots as the original; it slides along its own path
// (pathLength = one full lap) and is masked out under the six planning circles.
const ORBIT = { cx: 354.3, cy: 351.3, rx: 290.7, ry: 270.5 };
const LAP = 1764; // dash 10 + gap 8 repeats exactly 98 times; dots every 294

function OrbitLine() {
  return (
    <svg
      viewBox={`0 0 ${IMG_W} ${IMG_H}`}
      className="absolute inset-0 h-full w-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <mask id="orbit-cutouts">
          <rect width={IMG_W} height={IMG_H} fill="white" />
          {hotspots.map((h) => (
            <circle key={h.label} cx={h.x} cy={h.y} r="86" fill="black" />
          ))}
        </mask>
        <filter id="orbit-dot-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g mask="url(#orbit-cutouts)" fill="none">
        <ellipse
          {...ORBIT}
          pathLength={LAP}
          stroke="#3E3443"
          strokeOpacity="0.9"
          strokeWidth="2.6"
          strokeDasharray="10 8"
          className="orbit-flow"
        />
        <ellipse
          {...ORBIT}
          pathLength={LAP}
          stroke="#F1C877"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`0 ${LAP / 6}`}
          filter="url(#orbit-dot-glow)"
          className="orbit-flow"
        />
      </g>
    </svg>
  );
}

function MainSlide() {
  return (
    <div className="bg-[#FEFDF9] overflow-hidden">
      {/* ONE container, ONE grid: left copy and right artwork are siblings, both centred on the same axis */}
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-6 py-8 xl:grid-cols-2 xl:items-center xl:gap-10 xl:py-0 xl:h-[clamp(460px,calc(100svh-124px),620px)]">
      <div className="@container w-full text-center xl:text-left">
                  <h1
          style={serif}
          className="text-[length:clamp(20px,6.6cqw,64px)] font-bold leading-[1.12] tracking-[-0.01em] text-[#0F1F45]"
        >
          <span className="block whitespace-nowrap">Your Money Deserves a Plan.</span>
          <span className="block whitespace-nowrap text-[#C9922E]">Not Just an Investment.</span>
        </h1>
        <div className="mt-7 flex flex-wrap items-center justify-center xl:justify-start gap-3">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#0F1F45] px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-white shadow-[0_10px_30px_rgba(15,31,69,0.3)] transition-all hover:shadow-[0_15px_40px_rgba(15,31,69,0.45)]"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('health-check');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="group inline-flex items-center gap-2 rounded-full border border-[#C9922E]/50 bg-white/80 px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-[13px] font-semibold text-[#0F1F45] shadow-[0_6px_18px_rgba(201,146,46,0.18)] transition-all hover:border-[#C9922E] hover:bg-white cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9922E] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9922E]" />
            </span>
            <span>Check your financial health now</span>
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center xl:justify-start gap-x-5 gap-y-3">
          {trustPoints.map(({ icon: Icon, lines }, i) => (
            <React.Fragment key={lines[0]}>
              {i > 0 && <span className="hidden sm:block h-8 w-px bg-[#C58A1B]/35" />}
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#F3D58E] to-[#C08A2E] ring-2 ring-[#F6E3B4] shadow-[0_4px_12px_rgba(192,138,46,0.35)]">
                  <Icon className="h-4 w-4 text-white" strokeWidth={2} fill="rgba(255,255,255,0.25)" />
                </span>
                <span className="text-[13px] sm:text-sm font-medium leading-tight text-[#0F1F45] font-inter text-left">
                  {lines[0]}
                  <br />
                  {lines[1]}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Right column: the artwork keeps its own aspect ratio inside its column */}
      <div className="flex justify-center xl:h-full xl:items-center">
        <div className="relative aspect-[710/782] w-full max-w-[460px] xl:h-full xl:w-auto xl:max-w-none">
          <img
            src={heroOrbit}
            alt="Six planning areas around the Solahana mascot: financial, wealth, investment, tax, risk and estate planning"
            className="absolute inset-0 h-full w-full select-none pointer-events-none"
            draggable="false"
          />
          <OrbitLine />
          {/* Mascot is its own cut-out layer (lifted from the artwork) so it can wobble gently */}
          <img
            src={heroMascot}
            alt=""
            aria-hidden="true"
            style={{ left: `${(232.6 / IMG_W) * 100}%`, top: `${(247.3 / IMG_H) * 100}%`, width: `${(258.6 / IMG_W) * 100}%` }}
            className="mascot-shake absolute select-none pointer-events-none"
            draggable="false"
          />
          {/* Click targets share the artwork's box, so they line up at every size */}
          {hotspots.map((h) => (
            <Link
              key={h.label}
              to={h.to}
              aria-label={h.label}
              title={h.label}
              style={{ left: `${(h.x / IMG_W) * 100}%`, top: `${(h.y / IMG_H) * 100}%` }}
              className="absolute z-20 h-[21%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-shadow hover:shadow-[0_0_0_4px_rgba(232,199,119,0.55)]"
            />
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

const labels = ['Home', ...planningSlides.map((s) => s.label)];

export default function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % labels.length), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <section
      className="relative bg-white pt-20 pb-11"
      onPointerEnter={(e) => e.pointerType !== 'touch' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType !== 'touch' && setPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {active === 0 ? <MainSlide /> : <PlanningSlide slide={planningSlides[active - 1]} />}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-2">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${label}`}
            aria-current={i === active}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              i === active ? 'w-6 bg-[#1A3170]' : 'w-2 bg-[#2F5BC7]/30 hover:bg-[#2F5BC7]/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
