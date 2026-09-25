import React from 'react';

export default function RetirementHeroIllustration() {
  return (
    <div className="relative w-full max-w-[540px] aspect-[4/3] flex items-center justify-center select-none mx-auto">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-tr from-[#C89B3C]/15 via-[#F3E8C9]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Illustration Glass Board */}
      <div className="w-full h-full rounded-3xl bg-white/90 border border-[#E4E8F0] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col justify-between text-left border-t-2 border-t-[#C89B3C]/40">
        
        {/* Top Header Badge Strip */}
        <div className="flex items-center justify-between border-b border-[#E4E8F0]/60 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7F8FB] border border-[#C89B3C]/40 text-[#C89B3C] flex items-center justify-center font-bold shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-serif-luxury font-bold text-[#0F1F45]">Retirement Planning Portfolio</div>
              <div className="text-[11px] text-[#64748B]">Inflation-Adjusted FIRE & SWP Portfolio</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#C89B3C]/40 text-[#B8860B] font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            FIRE Active
          </span>
        </div>

        {/* Central Vector SVG Graphic — Retirees & Fiduciary Advisor */}
        <div className="my-2 w-full flex items-center justify-center">
          <svg className="w-full h-44 drop-shadow-lg overflow-visible" viewBox="0 0 360 160" fill="none">
            {/* Sun Horizon Circle in Background */}
            <circle cx="180" cy="80" r="55" fill="#F7F8FB" stroke="#E4E8F0" strokeWidth="1.5" />
            <circle cx="180" cy="80" r="42" fill="#FFFFFF" stroke="#C89B3C" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Central Golden Shield */}
            <path d="M 180 65 L 190 72 V 84 C 190 92 180 98 180 98 C 180 98 170 92 170 84 V 72 Z" fill="url(#goldGradient)" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Indian Senior Retiree Husband (Left) */}
            <circle cx="75" cy="48" r="14" fill="#FDBA74" />
            {/* Silver Hair */}
            <path d="M 62 46 C 62 30, 88 30, 88 46 Z" fill="#94A3B8" />
            <path d="M 60 64 L 90 64 L 86 120 L 64 120 Z" fill="#0F1F45" />

            {/* Indian Senior Retiree Wife (Middle-Left) */}
            <circle cx="120" cy="52" r="13" fill="#FDBA74" />
            {/* Silver Hair Braid */}
            <path d="M 108 50 C 108 36, 132 36, 132 50 Z" fill="#CBD5E1" />
            <path d="M 108 66 L 132 66 L 128 120 L 112 120 Z" fill="#B8860B" />

            {/* Financial Planner (Right) */}
            <circle cx="285" cy="48" r="14" fill="#FDBA74" />
            <path d="M 272 48 C 272 32, 298 32, 298 48 Z" fill="#0F1F45" />
            <path d="M 270 64 L 300 64 L 296 120 L 274 120 Z" fill="#0F1F45" />
            {/* Arm presenting target corpus */}
            <path d="M 278 74 Q 240 68 215 65" stroke="#0F1F45" strokeWidth="4" strokeLinecap="round" fill="none" />

            {/* Floating Target FIRE Corpus Card */}
            <rect x="225" y="102" width="115" height="46" rx="10" fill="#FFFFFF" stroke="#C89B3C" strokeWidth="1.5" className="shadow-md" />
            <text x="237" y="118" fill="#64748B" fontSize="9" fontFamily="sans-serif" fontWeight="500">Target Corpus @60</text>
            <text x="237" y="137" fill="#0F1F45" fontSize="13" fontFamily="sans-serif" fontWeight="bold">₹5.20 Crore</text>

            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="goldGradient" x1="170" y1="65" x2="190" y2="98" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C89B3C" />
                <stop offset="1" stopColor="#B8860B" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Footer Metrics */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0]/80 text-center">
            <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Current Age</div>
            <div className="text-xs sm:text-sm font-bold text-[#0F1F45] font-sora">32 Years</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0]/80 text-center">
            <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Retirement Age</div>
            <div className="text-xs sm:text-sm font-bold text-[#B8860B] font-sora">60 Years</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0]/80 text-center">
            <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">Inflation Shield</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-700 font-sora">6.0% Hedged</div>
          </div>
        </div>

      </div>
    </div>
  );
}
