import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Calculator, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Wallet, 
  Scroll,
  Compass
} from 'lucide-react';

export default function RetirementJourney() {
  const milestones = [
    { name: 'Define Retirement Goal', desc: 'Set target age & monthly expense lifestyle', icon: Target, pos: 'top-[3%] left-[4%]' },
    { name: 'Estimate Retirement Corpus', desc: 'Compute inflation-adjusted future target', icon: Calculator, pos: 'top-[16%] right-[4%]' },
    { name: 'Build SIP Strategy', desc: 'Disciplined multi-asset goal compounding', icon: TrendingUp, pos: 'top-[29%] left-[4%]' },
    { name: 'Protect Family', desc: 'Senior healthcare shield & top-up cover', icon: ShieldCheck, pos: 'top-[42%] right-[4%]' },
    { name: 'Tax Optimization', desc: 'NPS Tier-1 & tax-free drawdown rules', icon: FileText, pos: 'top-[55%] left-[4%]' },
    { name: 'Retirement Income', desc: 'Predictable monthly cashflow via SWP', icon: Wallet, pos: 'top-[68%] right-[4%]' },
    { name: 'Legacy & Estate Planning', desc: 'Wills, trusts & smooth wealth transfer', icon: Scroll, pos: 'top-[82%] left-[4%]' },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#F7F8FB] border-y border-[#E4E8F0]">
      {/* Soft Ambient Gold Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F7F8FB] border border-[#E4E8F0] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>RETIREMENT ROADMAP</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] leading-tight">
            Your Retirement Planning Journey
          </h2>
          <p className="text-base text-[#475569] font-sans max-w-2xl mx-auto">
            A step-by-step fiduciary roadmap designed to guide you from wealth accumulation to lifelong financial freedom.
          </p>
        </div>

        {/* SINGLE CONNECTED GOLD ROADMAP CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[620px] sm:h-[680px] max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 bg-white border border-[#E4E8F0] shadow-xl flex flex-col justify-between overflow-hidden"
        >
          {/* Smooth Continuous S-Curve Connector Line */}
          <svg className="absolute inset-0 w-full h-full fill-none pointer-events-none" viewBox="0 0 500 620">
            <defs>
              <linearGradient id="retirementPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2F5BC7" />
                <stop offset="50%" stopColor="#2F5BC7" />
                <stop offset="100%" stopColor="#2F5BC7" />
              </linearGradient>
            </defs>

            {/* Soft Ambient Glow Line */}
            <path
              d="M 115,45 C 280,45 220,125 385,125 C 550,125 -50,205 115,205 C 280,205 220,285 385,285 C 550,285 -50,365 115,365 C 280,365 220,445 385,445 C 550,445 -50,525 115,525"
              stroke="#2F5BC7"
              strokeWidth="7"
              opacity="0.15"
              strokeLinecap="round"
            />

            {/* Main Metallic Gold Dashed Track Line */}
            <path
              d="M 115,45 C 280,45 220,125 385,125 C 550,125 -50,205 115,205 C 280,205 220,285 385,285 C 550,285 -50,365 115,365 C 280,365 220,445 385,445 C 550,445 -50,525 115,525"
              stroke="url(#retirementPathGrad)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />

            {/* Gold Milestone Center Nodes */}
            {[
              { x: 115, y: 45 },
              { x: 385, y: 125 },
              { x: 115, y: 205 },
              { x: 385, y: 285 },
              { x: 115, y: 365 },
              { x: 385, y: 445 },
              { x: 115, y: 525 },
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="8" fill="#2F5BC7" opacity="0.25" />
                <circle cx={pt.x} cy={pt.y} r="4.5" fill="#2F5BC7" stroke="#FFFFFF" strokeWidth="2" />
              </g>
            ))}
          </svg>

          {/* Render Milestone Cards */}
          {milestones.map((ms, index) => {
            const Icon = ms.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`absolute ${ms.pos} w-[42%] sm:w-[45%] group`}
              >
                <div className="p-3 sm:p-4 rounded-2xl bg-[#F7F8FB] border border-[#E4E8F0] shadow-sm hover:shadow-md hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] transition-all duration-300 flex items-center space-x-3 text-left">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#2F5BC7]/40 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors leading-tight">
                      {ms.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-[#64748B] font-sans line-clamp-1 mt-0.5">
                      {ms.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}

        </motion.div>

      </div>
    </section>
  );
}
