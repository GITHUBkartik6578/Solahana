import React from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  PersonStanding,
  HeartPulse,
  FileCheck2,
  Building2,
  Home,
  HeartHandshake,
  GraduationCap,
} from 'lucide-react';
import Logo from './Logo';

// Eight life goals arranged clockwise from the top of the circle
const goals = [
  { label: 'Wealth Creation', icon: Coins, x: 50, y: 6 },
  { label: 'Retirement', icon: PersonStanding, x: 80, y: 18 },
  { label: 'Health Insurance', icon: HeartPulse, x: 93, y: 50 },
  { label: 'Tax Planning', icon: FileCheck2, x: 80, y: 82 },
  { label: 'Estate Planning', icon: Building2, x: 50, y: 94 },
  { label: 'Property', icon: Home, x: 20, y: 82 },
  { label: 'Marriage', icon: HeartHandshake, x: 7, y: 50 },
  { label: 'Education', icon: GraduationCap, x: 20, y: 18 },
];

export default function GoalOrbit() {
  return (
    <div className="relative w-full max-w-[560px] aspect-square mx-auto select-none">
      {/* Soft ambient glow */}
      <div className="absolute inset-8 bg-gradient-to-tr from-[#C8A24A]/20 via-[#E8C878]/10 to-transparent rounded-full blur-[90px] pointer-events-none" />

      {/* Orbit guide ring */}
      <div className="absolute inset-[14%] rounded-full border border-[#C8A24A]/20" />
      <div className="absolute inset-[9%] rounded-full border border-dashed border-[#C8A24A]/15" />

      {/* Central gold portal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-[22%] rounded-full flex items-center justify-center"
      >
        {/* Arch glow rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#071C48] via-[#041344] to-[#020B2D] border-2 border-[#C8A24A]/40 shadow-[0_0_60px_rgba(200,162,74,0.25),inset_0_0_40px_rgba(200,162,74,0.08)]" />
        <div className="absolute inset-[10%] rounded-full border border-[#E8C878]/25" />

        <div className="relative flex flex-col items-center text-center px-6">
          <Logo variant="dark" size="lg" />
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#BAC6DA] font-sora mt-2">
            Your Complete Financial Partner
          </span>
        </div>
      </motion.div>

      {/* Orbiting goal bubbles */}
      {goals.map((goal, idx) => {
        const Icon = goal.icon;
        return (
          <motion.div
            key={goal.label}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 + idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20"
            style={{ left: `${goal.x}%`, top: `${goal.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <motion.div
              animate={{ y: [0, idx % 2 === 0 ? -6 : 6, 0] }}
              transition={{ repeat: Infinity, duration: 4 + (idx % 3), ease: 'easeInOut', delay: idx * 0.3 }}
              className="glass-card w-[76px] h-[76px] sm:w-[92px] sm:h-[92px] rounded-full flex flex-col items-center justify-center gap-1 shadow-2xl group hover:border-[#C8A24A]/60 transition-colors"
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E8C878]" />
              <span className="text-[8px] sm:text-[9.5px] leading-tight text-center font-sora font-semibold text-[#F8F7F3] px-1">
                {goal.label}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
