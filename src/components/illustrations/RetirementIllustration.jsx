import React from 'react';
import { motion } from 'framer-motion';
import { Umbrella, Flame, ShieldCheck } from 'lucide-react';

export default function RetirementIllustration() {
  return (
    <div className="relative w-full max-w-[480px] aspect-4/3 flex items-center justify-center select-none">
      <div className="w-full h-full rounded-3xl bg-white/95 border border-[#C89A4B]/30 p-6 shadow-xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between text-left">
        {/* Soft Background Gold Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C89A4B]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#C89A4B]/15 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#C89A4B]/10 border border-[#C89A4B]/30 text-[#9A7326] flex items-center justify-center font-bold">
              <Umbrella className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-serif-luxury font-bold text-[#0F1F45]">FIRE Retirement Roadmap</div>
              <div className="text-[11px] text-[#64748B]">Inflation-Adjusted Target Corpus & Passive Income</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#C89A4B]/10 border border-[#C89A4B]/30 text-[#9A7326] font-mono text-[10px] font-semibold flex items-center gap-1">
            <Flame className="w-3 h-3 text-[#C89A4B]" />
            FIRE Ready
          </span>
        </div>

        {/* Central Vector SVG Graphic — Retired Senior Couple & Financial Advisor */}
        <div className="my-3 w-full flex items-center justify-center">
          <svg className="w-full h-36 drop-shadow-md overflow-visible" viewBox="0 0 340 140" fill="none">
            {/* Center Target Nest Egg Circle */}
            <circle cx="170" cy="70" r="50" fill="#F7F8FB" stroke="#C89A4B" strokeWidth="1.5" />
            <circle cx="170" cy="70" r="38" fill="#FFFFFF" stroke="#9A7326" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Shield Icon in Center */}
            <path d="M 170 58 L 178 64 V 74 C 178 80 170 85 170 85 C 170 85 162 80 162 74 V 64 Z" fill="#C89A4B" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Senior Man Figure (Left) */}
            <circle cx="60" cy="40" r="10" fill="#FDBA74" />
            {/* Grey Hair */}
            <path d="M 50 38 C 50 26, 70 26, 70 38 Z" fill="#94A3B8" />
            <path d="M 48 52 L 72 52 L 70 95 L 50 95 Z" fill="#0F1F45" />

            {/* Senior Woman Figure (Middle Left) */}
            <circle cx="95" cy="45" r="9" fill="#FDBA74" />
            {/* Silver Hair */}
            <path d="M 86 43 C 86 32, 104 32, 104 43 Z" fill="#CBD5E1" />
            <path d="M 86 56 L 104 56 L 102 95 L 88 95 Z" fill="#9A7326" />

            {/* Financial Advisor Figure (Right) */}
            <circle cx="275" cy="40" r="11" fill="#FDBA74" />
            <path d="M 265 40 C 265 28, 285 28, 285 40 Z" fill="#0F1F45" />
            <path d="M 262 55 L 288 55 L 285 95 L 265 95 Z" fill="#0F1F45" />
            <path d="M 270 62 Q 240 55 215 52" stroke="#0F1F45" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Target Corpus Card */}
            <rect x="220" y="85" width="105" height="42" rx="8" fill="#FFFFFF" stroke="#C89A4B" strokeWidth="1.5" />
            <text x="230" y="100" fill="#64748B" fontSize="9" fontFamily="sans-serif">Target FIRE Corpus</text>
            <text x="230" y="118" fill="#0F1F45" fontSize="13" fontFamily="sans-serif" fontWeight="bold">₹4.50 Crore</text>
          </svg>
        </div>

        {/* Footer Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#C89A4B]/20 text-center">
            <div className="text-[10px] text-[#64748B]">Current Age</div>
            <div className="text-xs font-bold text-[#0F1F45] font-sora">32 Years</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#C89A4B]/20 text-center">
            <div className="text-[10px] text-[#64748B]">Target FIRE Age</div>
            <div className="text-xs font-bold text-[#9A7326] font-sora">55 Years</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#C89A4B]/20 text-center">
            <div className="text-[10px] text-[#64748B]">Inflation Guard</div>
            <div className="text-xs font-bold text-emerald-700 font-sora">6.0% Adjusted</div>
          </div>
        </div>
      </div>
    </div>
  );
}
