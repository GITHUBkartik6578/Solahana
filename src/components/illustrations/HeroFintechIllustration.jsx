import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  GraduationCap, 
  Coins, 
  Umbrella, 
  Heart, 
  FileText, 
  Building2, 
  HeartHandshake 
} from 'lucide-react';
import mascotImage from '../../assets/solahana-mascot.png';

export default function HeroFintechIllustration({ onOpenSearch }) {
  const shouldReduceMotion = useReducedMotion();

  // Constant Orbit Radius (235px) - Exact match for Retirement & all 7 orbital nodes
  const ORBIT_RADIUS = 235;

  // 7 Floating Goal Bubbles placed at exact radius 235px on the gold dashed orbit line
  const circularNodes = [
    { id: 'wealth', title: 'Wealth Creation', icon: Coins, angle: -90, labelPos: 'above' },
    { id: 'retirement', title: 'Retirement', icon: Umbrella, angle: -40, labelPos: 'above' },
    { id: 'insurance', title: 'Health Insurance', icon: Heart, angle: 15, labelPos: 'below' },
    { id: 'tax', title: 'Tax Planning', icon: FileText, angle: 65, labelPos: 'below' },
    { id: 'property', title: 'Property', icon: Building2, angle: 115, labelPos: 'below' },
    { id: 'marriage', title: 'Marriage', icon: HeartHandshake, angle: 165, labelPos: 'below' },
    { id: 'education', title: 'Education', icon: GraduationCap, angle: -140, labelPos: 'above' },
  ];

  return (
    <div className="relative w-full max-w-[580px] aspect-square flex items-center justify-center select-none">
      
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
          @media (prefers-reduced-motion: reduce) {
            .solahana-outer-orbit-spin {
              animation: none !important;
            }
          }
        `}</style>
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
      {/* 2. CENTRAL GOLDEN PORTAL RING & REALISTIC 3D GOLD ₹ COIN      */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute z-10 w-[300px] h-[300px] sm:w-[320px] sm:h-[320px] rounded-full p-[6px] bg-gradient-to-tr from-[#1A3170] via-[#1A3170] to-[#1A3170] shadow-[0_0_60px_rgba(26,49,112,0.4)] flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFFFF] via-[#F7F8FB] to-[#E8EDF8] border-4 border-white flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          
          {/* Light Rays & Golden Horizon Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#F4F6FB]/80 to-[#E8EDF8]/90" />


          {/* Centerpiece: SOLAHANA ₹ mascot (gently floating) */}
          <motion.button
            type="button"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={onOpenSearch}
            aria-label="Explore your financial goals"
            className="relative z-10 w-[70%] animate-float cursor-pointer focus:outline-none"
          >
            <img
              src={mascotImage}
              alt="SOLAHANA rupee mascot giving a thumbs up"
              width={640}
              height={614}
              draggable={false}
              className="w-full h-auto select-none drop-shadow-[0_18px_28px_rgba(26,49,112,0.35)]"
            />
          </motion.button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. 7 GOAL BUBBLES SCALED PROPORTIONALLY (PERCENTAGE POSITIONS) */}
      {/* ------------------------------------------------------------- */}
      {circularNodes.map((node, index) => {
        const Icon = node.icon;
        const rad = (node.angle * Math.PI) / 180;
        const x = Math.cos(rad) * ORBIT_RADIUS;
        const y = Math.sin(rad) * ORBIT_RADIUS;
        const percentX = (x / 580) * 100;
        const percentY = (y / 580) * 100;
        const isLabelAbove = node.labelPos === 'above';

        return (
          <div
            key={node.id}
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            style={{
              left: `calc(50% + ${percentX}%)`,
              top: `calc(50% + ${percentY}%)`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              whileHover={{ scale: 1.15 }}
              onClick={onOpenSearch}
              className="relative cursor-pointer group flex flex-col items-center justify-center"
            >
              {/* White & Gold Circular Goal Bubble */}
              <div className="w-11 h-11 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-full bg-white border-2 border-[#2F5BC7] shadow-[0_6px_18px_rgba(26,49,112,0.25)] group-hover:border-[#1A3170] group-hover:shadow-[0_12px_30px_rgba(26,49,112,0.45)] transition-all flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 lg:w-6 lg:h-6 text-[#1A3170] group-hover:text-[#2F5BC7] transition-colors" />
              </div>

              {/* Label Tooltip Pill */}
              <span 
                className={`absolute ${
                  isLabelAbove ? 'bottom-full mb-1 sm:mb-2' : 'top-full mt-1 sm:mt-2'
                } text-[10px] sm:text-[10.5px] lg:text-[11px] font-semibold text-[#0F1F45] bg-white/95 px-2.5 py-0.5 rounded-full border border-[#2F5BC7]/30 shadow-md opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap text-center pointer-events-none`}
              >
                {node.title}
              </span>
            </motion.div>
          </div>
        );
      })}

    </div>
  );
}
