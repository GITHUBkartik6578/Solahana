import React from 'react';
import { motion } from 'framer-motion';
import { Heart, GraduationCap, Home, PiggyBank, CalendarCheck } from 'lucide-react';
import MascotScene from './MascotScene';

const CHIPS = [
  { label: 'Own Fund Per Goal', sub: 'No dipping into savings', icon: PiggyBank, pos: 'top-[10%] left-[2%] sm:top-[13%] sm:left-[8%]', delay: 1.8, drift: -6 },
  { label: 'Every Goal, a Timeline', sub: "Know when you're ready", icon: CalendarCheck, pos: 'bottom-[1%] right-[6%]', delay: 2, drift: -5 },
];

// Road from the mascot's feet winding up to the top-right (square container → uniform 0–100 space)
const ROAD = 'M 55 86 C 63 85, 60 77, 66 73 C 72 69, 83 64, 80 55 C 77 46, 88 41, 90 33';

// Milestones sit ON the road; label side chosen so nothing collides with the mascot or chips
const PINS = [
  { label: 'Wedding', icon: Heart, x: 66, y: 73, side: 'right', delay: 0.9 },
  { label: 'College', icon: GraduationCap, x: 80, y: 55, side: 'right', delay: 1.2 },
  { label: 'Dream Home', icon: Home, x: 90, y: 33, side: 'left', delay: 1.5 },
];

export default function GoalsMascotIllustration() {
  return (
    <MascotScene alt="SOLAHANA rupee mascot presenting a road with wedding, college and dream home milestones" chips={CHIPS}>
      {(reduce) => (
        <>
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 100 100" aria-hidden="true">
            {/* road edge + surface + centre line */}
            <motion.path
              d={ROAD}
              stroke="#C89B3C"
              strokeWidth="5.4"
              strokeLinecap="round"
              fill="none"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: 'easeInOut' }}
            />
            <motion.path
              d={ROAD}
              stroke="#F6E6BC"
              strokeWidth="4.2"
              strokeLinecap="round"
              fill="none"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: 'easeInOut' }}
            />
            <motion.path
              d={ROAD}
              stroke="#14224F"
              strokeWidth="0.45"
              strokeDasharray="1.6 1.6"
              fill="none"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.3, duration: 0.4 }}
            />
            <ellipse cx="55" cy="86.4" rx="4" ry="0.9" fill="#14224F" opacity="0.12" />
          </svg>

          {PINS.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.label}
                className="absolute z-10"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                initial={reduce ? false : { opacity: 0, y: -18, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: p.delay, ease: 'backOut' }}
              >
                {/* map pin: tip sits exactly on the road */}
                <div className="absolute left-0 bottom-0 -translate-x-1/2 flex flex-col items-center">
                  <span className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#1A3170] border-[3px] border-white shadow-[0_10px_22px_rgba(26,49,112,0.35)] flex items-center justify-center">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.4} />
                  </span>
                  <span className="w-0 h-0 -mt-[2px] border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[10px] border-t-white drop-shadow-[0_3px_2px_rgba(154,115,38,0.25)]" />
                </div>
                {/* label */}
                <span
                  className={`absolute bottom-[14px] sm:bottom-[20px] whitespace-nowrap px-2 sm:px-2.5 py-0.5 rounded-full bg-white text-[#0F1F45] border border-[#E4E8F0] text-[10px] sm:text-xs font-bold font-sora shadow-md ${
                    p.side === 'right' ? 'left-[22px] sm:left-[30px]' : 'right-[22px] sm:right-[30px]'
                  }`}
                >
                  {p.label}
                </span>
              </motion.div>
            );
          })}
        </>
      )}
    </MascotScene>
  );
}
