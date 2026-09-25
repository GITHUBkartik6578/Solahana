import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ShieldAlert, 
  GraduationCap, 
  Home, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  Target, 
  Scroll,
  Compass
} from 'lucide-react';

// Vertical centre (%) of each milestone row inside the map body
const ROW_Y = [7, 19, 31, 43, 55, 67, 79, 91];

// Smooth zig-zag S-curve that runs from each card's inner edge to the next card's inner edge
function buildPath(leftEdge, rightEdge) {
  const mid = (leftEdge + rightEdge) / 2;
  let d = `M ${leftEdge} ${ROW_Y[0]}`;
  for (let i = 1; i < ROW_Y.length; i++) {
    const toX = i % 2 === 1 ? rightEdge : leftEdge;
    d += ` C ${mid} ${ROW_Y[i - 1]}, ${mid} ${ROW_Y[i]}, ${toX} ${ROW_Y[i]}`;
  }
  return d;
}

export default function PlanningJourney() {
  const journeyMilestones = [
    { name: 'Emergency Fund', desc: '6 Months Shield', icon: ShieldAlert },
    { name: 'Child Education', desc: 'Higher Studies Fund', icon: GraduationCap },
    { name: 'Dream Home', desc: 'Down Payment Fund', icon: Home },
    { name: 'Family Protection', desc: 'Term & Health Cover', icon: ShieldCheck },
    { name: 'Wealth Creation', desc: 'Disciplined SIPs', icon: TrendingUp },
    { name: 'Tax Planning', desc: '80C, 80D & NPS', icon: Calculator },
    { name: 'Retirement Planning', desc: 'Income for Later', icon: Target },
    { name: 'Estate Planning', desc: 'Will & Nominees', icon: Scroll },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#F7F8FB] border-y border-[#E4E8F0]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#2F5BC7]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Compass className="w-3.5 h-3.5" />
            <span>PLANNING ROADMAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
            Your Financial Planning Journey
          </h2>
          <p className="text-base text-[#475569] font-inter max-w-2xl mx-auto">
            Every life goal, connected in one plan that moves with you.
          </p>
        </div>

        {/* SINGLE CONNECTED ROADMAP CONTAINER — gold used as accent (ribbon + border + glow), not a full fill */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[700px] sm:h-[780px] max-w-4xl mx-auto rounded-3xl border-2 border-[#2F5BC7]/45 shadow-[0_25px_60px_rgba(26,49,112,0.18)] flex flex-col overflow-hidden bg-[#FFFFFF]"
        >
          {/* Ambient gold corner glows (depth, not a flat fill) */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#2F5BC7]/20 rounded-full blur-[100px] pointer-events-none z-0" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#2F5BC7]/14 rounded-full blur-[100px] pointer-events-none z-0" />

          {/* Gold Ribbon Header */}
          <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 bg-gradient-to-r from-[#1A3170] via-[#1A3170] to-[#1A3170] shrink-0">
            <div className="text-xs font-serif-luxury font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-white" />
              SOLAHANA Life Milestone Map
            </div>
            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-black/15 text-white font-sora font-semibold text-[10px] border border-white/30 uppercase tracking-wider">
              One Connected Plan
            </span>
          </div>

          {/* Cards + connector area (cream body) */}
          <div className="relative z-10 flex-1 mx-4 sm:mx-8 my-4">
            {/* Connector path — drawn in % space so it always meets the card edges exactly */}
            {[
              { cls: 'sm:hidden', l: 48, r: 52 },
              { cls: 'hidden sm:block', l: 34, r: 66 },
            ].map((bp) => (
              <svg
                key={bp.cls}
                className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible ${bp.cls}`}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d={buildPath(bp.l, bp.r)}
                  stroke="#2F5BC7"
                  strokeOpacity="0.18"
                  strokeWidth="8"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
                <path
                  d={buildPath(bp.l, bp.r)}
                  stroke="#2F5BC7"
                  strokeWidth="2"
                  strokeDasharray="7 7"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  className="animate-dash-flow"
                />
              </svg>
            ))}

            {/* Interactive Milestone Cards (vertically centred on their row) */}
            {journeyMilestones.map((m, idx) => {
              const IconComponent = m.icon;
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`absolute -translate-y-1/2 w-[46%] sm:w-[30%] ${isLeft ? 'left-[2%] sm:left-[4%]' : 'right-[2%] sm:right-[4%]'}`}
                  style={{ top: `${ROW_Y[idx]}%` }}
                >
                  {/* Gold joint dot where the path meets the card */}
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1A3170] ring-4 ring-[#2F5BC7]/20 border-2 border-white z-20 ${
                      isLeft ? '-right-1.5' : '-left-1.5'
                    }`}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.08 }}
                    whileHover={{ scale: 1.04 }}
                    className="relative p-2.5 sm:p-3 rounded-2xl bg-white border border-[#E4E8F0] shadow-[0_6px_18px_rgba(26,49,112,0.10)] hover:shadow-[0_14px_32px_rgba(15,23,42,0.22)] hover:border-[#0F1F45] hover:bg-[#0F1F45] flex items-center gap-2.5 sm:gap-3 cursor-pointer group transition-colors duration-300"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1A3170] via-[#1A3170] to-[#1A3170] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-6 transition-transform duration-300">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="text-[11px] sm:text-[13px] font-semibold text-[#0F1F45] group-hover:text-white transition-colors leading-tight">
                        {m.name}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-[#64748B] group-hover:text-[#2F5BC7] transition-colors leading-tight mt-0.5">
                        {m.desc}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="relative z-10 px-5 sm:px-8 py-3 border-t border-[#E4E8F0] text-center text-xs text-[#64748B] font-sora shrink-0 bg-[#FFFFFF]">
            One plan that grows with you, stage by stage.
          </div>
        </motion.div>

      </div>
    </section>
  );
}
