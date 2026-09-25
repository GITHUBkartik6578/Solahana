import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, Building } from 'lucide-react';

export default function BusinessFinancialPlanningIllustration() {
  return (
    <div className="relative w-full max-w-[480px] aspect-4/3 flex items-center justify-center select-none">
      <div className="w-full h-full rounded-[24px] bg-white border border-[#E4E8F0] p-6 shadow-[0_10px_30px_rgba(200,155,60,0.08)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between text-left">
        <div className="flex items-center justify-between border-b border-[#E4E8F0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-[#C89B3C] flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-serif-luxury font-bold text-[#0F1F45]">Business & Co-Founder Planning</div>
              <div className="text-[11px] text-[#5B6B84]">Corporate Treasury & Succession Structuring</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#E4E8F0] text-[#B8860B] font-mono text-[10px] font-semibold">
            Corporate Fiduciary
          </span>
        </div>

        {/* Vector SVG Business Executive Illustration */}
        <div className="my-2 w-full flex items-center justify-center">
          <svg className="w-full h-36" viewBox="0 0 320 140" fill="none">
            <rect x="20" y="20" width="280" height="100" rx="12" fill="#F7F8FB" stroke="#E4E8F0" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Corporate Executive (Human Figure) */}
            <circle cx="160" cy="45" r="10" fill="#FDBA74" />
            <path d="M 148 58 L 172 58 L 168 105 L 152 105 Z" fill="#0F1F45" />
            <path d="M 158 58 L 162 58 L 160 85 Z" fill="#C89B3C" />

            {/* Growth Curve */}
            <path d="M 40 100 C 90 85, 140 60, 280 30" stroke="#C89B3C" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="280" cy="30" r="4" fill="#B8860B" />

            {/* Stat Cards */}
            <g transform="translate(30, 40)">
              <rect width="80" height="45" rx="6" fill="#FFFFFF" stroke="#E4E8F0" strokeWidth="1.5" />
              <text x="40" y="16" fill="#5B6B84" fontSize="8" textAnchor="middle">Treasury Yield</text>
              <text x="40" y="31" fill="#0F1F45" fontSize="12" fontWeight="bold" textAnchor="middle">9.2% p.a.</text>
            </g>

            <g transform="translate(210, 45)">
              <rect width="80" height="45" rx="6" fill="#FFFFFF" stroke="#E4E8F0" strokeWidth="1.5" />
              <text x="40" y="16" fill="#5B6B84" fontSize="8" textAnchor="middle">Keyman Cover</text>
              <text x="40" y="31" fill="#B8860B" fontSize="12" fontWeight="bold" textAnchor="middle">₹10.0 Cr</text>
            </g>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">Keyman Insurance</div>
            <div className="text-xs font-bold text-[#0F1F45] font-sora">₹10.0 Cr Shield</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">Corporate Tax</div>
            <div className="text-xs font-bold text-[#B8860B] font-sora">Optimized</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">Succession Trust</div>
            <div className="text-xs font-bold text-emerald-700 font-sora">Binding Will</div>
          </div>
        </div>
      </div>
    </div>
  );
}
