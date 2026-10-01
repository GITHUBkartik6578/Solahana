import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Home,
  TrendingUp,
  Armchair,
  ShieldCheck,
  FileText,
  Users
} from 'lucide-react';
import coinImage from '../../assets/solahana-16-ana-coin.webp';

// Orbit radius in the 580px design stage: the dashed ring and every planning bubble share this line
const ORBIT_RADIUS = 235;
const STAGE_SIZE = 580;
// One full turn of the bubbles (same 30s as the dashed ring)
const TURN_MS = 30000;

// 7 planning bubbles, evenly spaced on the orbit (Wealth Creation starts at the top)
const PLANNING_NODES = [
  { id: 'education', title: 'Education Planning', icon: GraduationCap },
  { id: 'home', title: 'Home Planning', icon: Home },
  { id: 'wealth', title: 'Wealth Creation', icon: TrendingUp },
  { id: 'retirement', title: 'Retirement Planning', icon: Armchair },
  { id: 'risk', title: 'Risk Planning', icon: ShieldCheck },
  { id: 'tax', title: 'Tax Planning', icon: FileText },
  { id: 'estate', title: 'Estate Planning', icon: Users },
].map((node, i, all) => ({ ...node, angle: -90 + (i - 2) * (360 / all.length) }));

export default function HeroFintechIllustration({ onOpenSearch }) {
  const stageRef = useRef(null);
  const nodeRefs = useRef([]);
  const pausedRef = useRef(false);

  // The bubbles travel round the orbit with plain 2D translates snapped to whole pixels.
  // Nothing that holds text is ever rotated, so the labels stay sharp while they move.
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let turnDeg = 0;
    let last = performance.now();
    let frame = 0;

    const place = () => {
      const size = stage.clientWidth;
      const radius = (size * ORBIT_RADIUS) / STAGE_SIZE;
      const centre = size / 2;

      PLANNING_NODES.forEach((node, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        const rad = ((node.angle + turnDeg) * Math.PI) / 180;
        const x = Math.round(centre + Math.cos(rad) * radius - el.offsetWidth / 2);
        const y = Math.round(centre + Math.sin(rad) * radius - el.offsetHeight / 2);
        el.style.transform = `translate(${x}px, ${y}px)`;

        // Keep the label outside the centre ring: above the bubble on the top half of the orbit,
        // below it on the bottom half
        const side = Math.sin(rad) < 0 ? 'above' : 'below';
        if (el.dataset.side !== side) {
          el.dataset.side = side;
          el.querySelectorAll('[data-label]').forEach((label) => {
            label.style.opacity = label.dataset.label === side ? '1' : '0';
          });
        }
      });
    };

    const tick = (now) => {
      const dt = Math.min(now - last, 100);
      last = now;
      if (!pausedRef.current) turnDeg = (turnDeg + (dt * 360) / TURN_MS) % 360;
      place();
      frame = requestAnimationFrame(tick);
    };

    place();
    if (!reduceMotion) frame = requestAnimationFrame(tick);
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(place) : null;
    resizeObserver?.observe(stage);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div ref={stageRef} className="solahana-hero-stage relative w-full max-w-[580px] aspect-square flex items-center justify-center select-none">
      <style>{`
        @keyframes solahanaHeroOrbitSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        .solahana-outer-orbit-spin {
          transform-origin: 290px 290px;
          transform-box: view-box;
          animation: solahanaHeroOrbitSpin 30s linear infinite;
        }
        /* hovering a bubble pauses the ring too, so it is easy to click */
        .solahana-hero-stage:has(.solahana-orbit-node:hover) .solahana-outer-orbit-spin {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .solahana-outer-orbit-spin {
            animation: none !important;
          }
        }
      `}</style>

      {/* ------------------------------------------------------------- */}
      {/* 1. AMBIENT GLOW & GOLD DASHED ORBIT PATH                      */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {/* Soft Radial Gold Backlight Glow */}
        <div className="w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-[#2F5BC7]/20 via-[#2F5BC7]/25 to-transparent blur-[100px] animate-pulse-glow" />
      </div>

      {/* SVG Orbit Line passing through exact center of every badge (r = 235px) */}
      {/* Smooth linear 30s rotation of outer gold dashed orbit line & satellite accents only */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible drop-shadow-[0_0_14px_rgba(26,49,112,0.5)]"
        viewBox="0 0 580 580"
      >
        <g className="solahana-outer-orbit-spin" style={{ transformOrigin: '290px 290px', transformBox: 'view-box' }}>
          {/* Outer Glow Halo Ring */}
          <circle
            cx="290"
            cy="290"
            r={ORBIT_RADIUS}
            stroke="#2F5BC7"
            strokeWidth="6"
            strokeOpacity="0.25"
            fill="none"
          />

          {/* Primary Gold Dashed Orbit Line */}
          <circle
            cx="290"
            cy="290"
            r={ORBIT_RADIUS}
            stroke="#2F5BC7"
            strokeWidth="2.5"
            strokeDasharray="16 12"
            strokeOpacity="0.85"
            fill="none"
          />

          {/* 4 Golden Satellite Dots rotating on the orbit line */}
          <circle cx="290" cy="55" r="5" fill="#2F5BC7" className="drop-shadow-[0_0_8px_#2F5BC7]" />
          <circle cx="525" cy="290" r="5" fill="#2F5BC7" className="drop-shadow-[0_0_8px_#2F5BC7]" />
          <circle cx="290" cy="525" r="5" fill="#2F5BC7" className="drop-shadow-[0_0_8px_#2F5BC7]" />
          <circle cx="55" cy="290" r="5" fill="#2F5BC7" className="drop-shadow-[0_0_8px_#2F5BC7]" />
        </g>
      </svg>

      {/* ------------------------------------------------------------- */}
      {/* 2. CENTRAL PORTAL RING WITH THE 16 ANA COIN                    */}
      {/* 55% of the stage = the original 320px on desktop (60% on phones); it scales with the stage
          so the travelling bubbles never run into the ring on smaller screens */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute z-10 w-[60%] h-[60%] sm:w-[55%] sm:h-[55%] rounded-full p-[6px] bg-gradient-to-tr from-[#1A3170] via-[#1A3170] to-[#1A3170] shadow-[0_0_60px_rgba(26,49,112,0.4)] flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#F7F8FB] to-[#E8EDF8] border-4 border-white flex flex-col items-center justify-center relative overflow-hidden shadow-inner">

          {/* Light Rays & Golden Horizon Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#F4F6FB]/80 to-[#E8EDF8]/90" />
          {/* Soft golden glow behind the coin */}
          <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(234,208,143,0.55)_0%,rgba(234,208,143,0.18)_45%,rgba(234,208,143,0)_70%)]" />

          {/* Centerpiece: SOLAHANA 16 ANA coin (gently floating) */}
          <motion.button
            type="button"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={onOpenSearch}
            aria-label="Explore your financial goals"
            className="relative z-10 w-[80%] animate-float cursor-pointer focus:outline-none"
          >
            <img
              src={coinImage}
              alt="SOLAHANA 16 ANA gold coin"
              width={528}
              height={528}
              draggable={false}
              className="w-full h-auto select-none drop-shadow-[0_14px_22px_rgba(26,49,112,0.30)]"
            />
          </motion.button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. 7 PLANNING BUBBLES TRAVELLING ROUND THE ORBIT               */}
      {/* positioned by the effect above; labels flip above/below so they always sit outside the ring */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {PLANNING_NODES.map((node, index) => {
          const Icon = node.icon;
          const [firstWord, ...restWords] = node.title.split(' ');

          return (
            <div
              key={node.id}
              ref={(el) => {
                nodeRefs.current[index] = el;
              }}
              className="absolute left-0 top-0 pointer-events-auto"
              onMouseEnter={() => {
                pausedRef.current = true;
              }}
              onMouseLeave={() => {
                pausedRef.current = false;
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                whileHover={{ scale: 1.1 }}
                onClick={onOpenSearch}
                className="solahana-orbit-node relative cursor-pointer group flex flex-col items-center justify-center"
              >
                {/* White & Gold Circular Planning Bubble */}
                <div className="w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-[#2F5BC7] shadow-[0_6px_18px_rgba(26,49,112,0.25)] group-hover:border-[#1A3170] group-hover:shadow-[0_12px_30px_rgba(26,49,112,0.45)] transition-all flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-[#1A3170] group-hover:text-[#2F5BC7] transition-colors" />
                </div>

                {/* Label pill: bold, solid white, sharp. Two lines below 1280px, one line above */}
                {['above', 'below'].map((side) => (
                  <span
                    key={side}
                    data-label={side}
                    aria-hidden={side === 'below' ? true : undefined}
                    className={`absolute ${
                      side === 'above' ? 'bottom-full mb-0.5 sm:mb-2' : 'top-full mt-0.5 sm:mt-2'
                    } opacity-0 transition-opacity duration-300 pointer-events-none`}
                  >
                    <span className="block text-[10px] sm:text-[11px] lg:text-xs leading-[1.15] xl:leading-normal font-bold text-[#0F1F45] bg-white px-2.5 py-px sm:py-0.5 rounded-xl xl:rounded-full border border-[#2F5BC7]/30 shadow-[0_4px_12px_rgba(15,31,69,0.12)] whitespace-nowrap text-center">
                      {firstWord}{' '}<br className="xl:hidden" />{restWords.join(' ')}
                    </span>
                  </span>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
