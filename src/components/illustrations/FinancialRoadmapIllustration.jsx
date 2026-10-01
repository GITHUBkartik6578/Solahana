import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PiggyBank, 
  ShieldAlert, 
  ShieldCheck, 
  TrendingUp, 
  Receipt, 
  Target, 
  Umbrella,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function FinancialRoadmapIllustration() {
  const [activeStep, setActiveStep] = useState(3);

  const roadmapSteps = [
    {
      id: 1,
      title: 'Start Saving',
      desc: 'Build disciplined monthly cash flow & 20%+ savings habit',
      icon: PiggyBank,
      color: '#38BDF8',
      badge: 'Step 1'
    },
    {
      id: 2,
      title: 'Emergency Fund',
      desc: '6-12 months expenses buffered in liquid fixed deposits',
      icon: ShieldAlert,
      color: '#E8C878',
      badge: 'Step 2'
    },
    {
      id: 3,
      title: 'Insurance Protection',
      desc: 'Term life cover & super top-up health insurance buffer',
      icon: ShieldCheck,
      color: '#34D399',
      badge: 'Step 3'
    },
    {
      id: 4,
      title: 'Investment Planning',
      desc: 'Goal-aligned equity SIPs, direct mutual funds & asset allocation',
      icon: TrendingUp,
      color: '#C8A24A',
      badge: 'Step 4'
    },
    {
      id: 5,
      title: 'Tax Saving',
      desc: 'Optimal 80C, 80D, NPS & LTCG tax harvesting architecture',
      icon: Receipt,
      color: '#F472B6',
      badge: 'Step 5'
    },
    {
      id: 6,
      title: 'Goal Planning',
      desc: 'Children education, dream home & major life milestones mapped',
      icon: Target,
      color: '#818CF8',
      badge: 'Step 6'
    },
    {
      id: 7,
      title: 'Retirement Wealth',
      desc: 'Inflation-adjusted FIRE target corpus producing passive income',
      icon: Umbrella,
      color: '#E5C158',
      badge: 'Step 7'
    }
  ];

  return (
    <div className="w-full bg-[#0F1F45]/90 border border-[#C8A24A]/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden text-left">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A24A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8C878] px-3 py-1 rounded-full bg-[#C8A24A]/15 border border-[#C8A24A]/30">
            FINANCIAL PLANNING ROADMAP
          </span>
          <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-2">
            Your 7-Stage Financial Journey
          </h3>
        </div>
        <p className="text-xs text-white/60 max-w-xs font-light leading-relaxed">
          Click any stage milestone to explore the underlying wealth construction principles.
        </p>
      </div>

      {/* Milestone Path Track (Desktop Curved Path / Mobile Stack) */}
      <div className="relative py-4">
        {/* Connecting Background Line */}
        <div className="hidden lg:block absolute top-1/2 left-6 right-6 h-1 bg-gradient-to-r from-[#38BDF8] via-[#C8A24A] to-[#E5C158] rounded-full -translate-y-1/2 opacity-40 z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 relative z-10">
          {roadmapSteps.map((step) => {
            const IconComp = step.icon;
            const isSelected = activeStep === step.id;

            return (
              <motion.button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                whileHover={{ y: -6 }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#1E293B] to-[#0F1F45] border-[#C8A24A] shadow-[0_10px_30px_rgba(200,154,75,0.3)] ring-2 ring-[#C8A24A]/40'
                    : 'bg-white/5 border-white/10 hover:border-[#C8A24A]/40 hover:bg-white/10'
                }`}
              >
                {/* Step Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                    {step.badge}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#E8C878]" />
                  )}
                </div>

                {/* Node Icon */}
                <div 
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                    isSelected ? 'bg-[#C8A24A] text-[#0F1F45] shadow-lg' : 'bg-white/10 text-white'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>

                {/* Step Title */}
                <div>
                  <h4 className={`text-xs font-bold leading-snug transition-colors ${
                    isSelected ? 'text-[#E8C878]' : 'text-white group-hover:text-[#E8C878]'
                  }`}>
                    {step.title}
                  </h4>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Drawer Card */}
      {activeStep && (
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-5 rounded-2xl bg-[#020B2D]/90 border border-[#C8A24A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C8A24A]/20 border border-[#C8A24A]/50 flex items-center justify-center text-[#E8C878] shrink-0">
              {React.createElement(roadmapSteps[activeStep - 1].icon, { className: 'w-6 h-6' })}
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#E8C878] uppercase tracking-wider">
                Stage {activeStep} Architecture
              </span>
              <h4 className="text-base font-bold text-white">
                {roadmapSteps[activeStep - 1].title}
              </h4>
              <p className="text-xs text-white/70 font-light mt-0.5">
                {roadmapSteps[activeStep - 1].desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#E8C878]">
              Milestone {activeStep} of 7
            </span>
          </div>
        </motion.div>
      )}

    </div>
  );
}
