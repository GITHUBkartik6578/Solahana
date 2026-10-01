import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Home, Key } from 'lucide-react';

export default function HomePurchasePlanningIllustration() {
  return (
    <div className="relative w-full max-w-[480px] aspect-4/3 flex items-center justify-center select-none">
      <div className="w-full h-full rounded-[24px] bg-white border border-[#E4E8F0] p-6 shadow-[0_10px_30px_rgba(200,155,60,0.08)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between text-left">
        <div className="flex items-center justify-between border-b border-[#E4E8F0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-[#C89B3C] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-serif-luxury font-bold text-[#0F1F45]">Dream Home Down Payment</div>
              <div className="text-[11px] text-[#5B6B84]">Real Estate & Debt Optimization Buffer</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#E4E8F0] text-[#B8860B] font-mono text-[10px] font-semibold">
            Target Year 2028
          </span>
        </div>

        {/* Vector SVG House & Homeowner Illustration */}
        <div className="my-2 w-full flex items-center justify-center">
          <svg className="w-full h-36" viewBox="0 0 320 140" fill="none">
            {/* House Outline */}
            <path d="M 120 70 L 160 35 L 200 70 V 115 H 120 Z" fill="#F7F8FB" stroke="#E4E8F0" strokeWidth="2" />
            <path d="M 110 70 L 160 25 L 210 70" stroke="#C89B3C" strokeWidth="3" strokeLinecap="round" />
            {/* Door */}
            <rect x="150" y="85" width="20" height="30" fill="#B8860B" rx="2" />
            <circle cx="166" cy="100" r="1.5" fill="#FFFFFF" />

            {/* Human Homeowner with Key */}
            <circle cx="85" cy="55" r="9" fill="#FDBA74" />
            <path d="M 77 67 L 93 67 L 90 105 L 80 105 Z" fill="#0F1F45" />
            <path d="M 88 70 L 115 80" stroke="#C89B3C" strokeWidth="2" />
            <circle cx="115" cy="80" r="3" fill="#D4AF37" />

            {/* Down Payment Stat Box */}
            <g transform="translate(210, 45)">
              <rect width="90" height="50" rx="8" fill="#FFFFFF" stroke="#E4E8F0" strokeWidth="1.5" />
              <text x="45" y="18" fill="#5B6B84" fontSize="8" textAnchor="middle">Down Payment</text>
              <text x="45" y="34" fill="#0F1F45" fontSize="13" fontWeight="bold" textAnchor="middle">₹35.0 Lakhs</text>
            </g>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">Down Payment</div>
            <div className="text-xs font-bold text-[#0F1F45] font-sora">₹35.0 Lakhs</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">EMI Safety Guard</div>
            <div className="text-xs font-bold text-[#B8860B] font-sora">&lt; 35% Income</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">Loan Principal</div>
            <div className="text-xs font-bold text-emerald-700 font-sora">Pre-pay Strategy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
