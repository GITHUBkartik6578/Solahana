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

// Click targets over the six planning circles baked into the artwork (centres in % of the image)
const IMG_W = 1599;
const IMG_H = 782;
const hotspots = [
  { label: 'Financial Planning', to: '/financial-planning', x: 1012, y: 110 },
  { label: 'Wealth Planning', to: '/goals', x: 769, y: 235 },
  { label: 'Investment Planning', to: '/investments', x: 760, y: 478 },
  { label: 'Tax Planning', to: '/tax-planning', x: 1010, y: 612 },
  { label: 'Risk Planning', to: '/risk-management', x: 1266, y: 478 },
  { label: 'Estate Planning', to: '/estate-planning', x: 1260, y: 235 },
];

// The dashed connector from the artwork, redrawn as SVG in the image's pixel space so it can turn.
// Same ellipse, stroke, dash rhythm and six gold dots as the original; it slides along its own path
// (pathLength = one full lap) and is masked out under the six planning circles.
const ORBIT = { cx: 1014.3, cy: 351.3, rx: 290.7, ry: 270.5 };
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
    <div className="relative flex flex-col xl:block xl:h-[clamp(460px,calc(100svh-124px),620px)] bg-[#FEFCF8] overflow-hidden">
      {/* Artwork: anchored right at the image's own aspect so the hotspots stay on the circles */}
      <div className="order-2 relative w-full overflow-hidden aspect-square sm:aspect-[16/10] xl:aspect-[1599/782] xl:absolute xl:right-0 xl:top-0 xl:h-full xl:w-auto">
        {/* Box at the artwork's own aspect, cropped like object-position 76% on small screens,
            so the image and the orbit line overlay always share one coordinate system */}
        <div className="absolute top-0 h-full aspect-[1599/782] left-[76%] -translate-x-[76%] xl:left-0 xl:translate-x-0">
          <img
            src={heroOrbit}
            alt="Six planning areas around the Solahana mascot: financial, wealth, investment, tax, risk and estate planning"
            className="absolute inset-0 h-full w-full select-none pointer-events-none [mask-image:linear-gradient(to_right,transparent_0%,black_8%)]"
            draggable="false"
          />
          <OrbitLine />
          {/* Mascot is its own cut-out layer (lifted from the artwork) so it can wobble gently */}
          <img
            src={heroMascot}
            alt=""
            aria-hidden="true"
            style={{ left: `${(892.6 / IMG_W) * 100}%`, top: `${(247.3 / IMG_H) * 100}%`, width: `${(258.6 / IMG_W) * 100}%` }}
            className="mascot-shake absolute select-none pointer-events-none"
            draggable="false"
          />
          {/* Click targets sit in the same box as the artwork so they line up on every screen size */}
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

      <div className="order-1 relative z-10 pointer-events-none max-w-[1320px] mx-auto w-full h-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 xl:pt-24 xl:pb-0 xl:flex xl:items-center">
        <div className="@container pointer-events-auto w-full xl:w-[42%] text-center xl:text-left">
                    <h1
            style={serif}
            className="text-[length:clamp(22px,6cqw,50px)] font-bold leading-[1.1] tracking-[-0.01em] text-[#0F1F45]"
          >
            <span className="block whitespace-nowrap">Your Money Deserves a Plan.</span>
            <span className="block whitespace-nowrap text-[#C9922E]">Not Just an Investment.</span>
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-center xl:justify-start gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-[#0F1F45] px-8 py-3.5 text-sm sm:text-base font-medium text-white shadow-[0_10px_30px_rgba(15,31,69,0.3)] transition-all hover:shadow-[0_15px_40px_rgba(15,31,69,0.45)]"
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
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#C9922E]/50 bg-white/80 px-5 py-3 text-sm font-semibold text-[#0F1F45] shadow-[0_6px_18px_rgba(201,146,46,0.18)] transition-all hover:border-[#C9922E] hover:bg-white cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9922E] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#C9922E]" />
              </span>
              <span>Check your financial health now</span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center xl:justify-start gap-x-4 gap-y-3">
            {trustPoints.map(({ icon: Icon, lines }, i) => (
              <React.Fragment key={lines[0]}>
                {i > 0 && <span className="hidden sm:block h-7 w-px bg-[#C58A1B]/35" />}
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-[#F3D58E] to-[#C08A2E] ring-2 ring-[#F6E3B4] shadow-[0_4px_12px_rgba(192,138,46,0.35)]">
                    <Icon className="h-4 w-4 text-white" strokeWidth={2} fill="rgba(255,255,255,0.25)" />
                  </span>
                  <span className="text-[11px] sm:text-xs font-medium leading-tight text-[#0F1F45] font-inter text-left">
                    {lines[0]}
                    <br />
                    {lines[1]}
                  </span>
                </div>
              </React.Fragment>
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
