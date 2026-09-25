import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, TrendingUp } from 'lucide-react';

export default function ChildEducationPlanningIllustration() {
  return (
    <div className="relative w-full max-w-[480px] aspect-4/3 flex items-center justify-center select-none">
      <div className="w-full h-full rounded-[24px] bg-white border border-[#E4E8F0] p-6 shadow-[0_10px_30px_rgba(200,155,60,0.08)] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between text-left">
        <div className="flex items-center justify-between border-b border-[#E4E8F0] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-[#C89B3C] flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-serif-luxury font-bold text-[#0F1F45]">Child Higher Studies Fund</div>
              <div className="text-[11px] text-[#5B6B84]">Step-up SIP Education Corpus Architecture</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#E4E8F0] text-[#B8860B] font-mono text-[10px] font-semibold">
            Target Year 2035
          </span>
        </div>

        {/* Vector SVG Student / Education Illustration */}
        <div className="my-2 w-full flex items-center justify-center">
          <svg className="w-full h-36" viewBox="0 0 320 140" fill="none">
            {/* Graduation Scroll & Cap Graphic */}
            <rect x="20" y="20" width="280" height="100" rx="12" fill="#F7F8FB" stroke="#E4E8F0" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Human Student in Graduation Gown */}
            <circle cx="160" cy="45" r="10" fill="#FDBA74" />
            {/* Graduation Cap */}
            <path d="M 140 38 L 160 30 L 180 38 L 160 44 Z" fill="#0F1F45" />
            <path d="M 160 44 V 50" stroke="#C89B3C" strokeWidth="2" />
            {/* Gown */}
            <path d="M 145 58 L 175 58 L 172 105 L 148 105 Z" fill="#0F1F45" />
            <path d="M 152 58 L 168 58 L 160 85 Z" fill="#C89B3C" />

            {/* Left & Right Education Corpus Indicators */}
            <g transform="translate(35, 45)">
              <rect width="85" height="45" rx="6" fill="#FFFFFF" stroke="#E4E8F0" strokeWidth="1.5" />
              <text x="42.5" y="16" fill="#5B6B84" fontSize="8" textAnchor="middle">Target Fund</text>
              <text x="42.5" y="31" fill="#0F1F45" fontSize="12" fontWeight="bold" textAnchor="middle">₹50.0 Lakhs</text>
            </g>

            <g transform="translate(200, 45)">
              <rect width="85" height="45" rx="6" fill="#FFFFFF" stroke="#E4E8F0" strokeWidth="1.5" />
              <text x="42.5" y="16" fill="#5B6B84" fontSize="8" textAnchor="middle">Monthly SIP</text>
              <text x="42.5" y="31" fill="#B8860B" fontSize="12" fontWeight="bold" textAnchor="middle">₹15,000/mo</text>
            </g>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">Education Target</div>
            <div className="text-xs font-bold text-[#0F1F45] font-sora">₹50.0 Lakhs</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">Inflation Adjustment</div>
            <div className="text-xs font-bold text-[#B8860B] font-sora">8.0% p.a.</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-center">
            <div className="text-[10px] text-[#5B6B84]">Step-up Rate</div>
            <div className="text-xs font-bold text-emerald-700 font-sora">+10% Annual</div>
          </div>
        </div>
      </div>
    </div>
  );
}
