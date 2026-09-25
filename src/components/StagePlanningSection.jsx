import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PersonAvatar, { PEOPLE } from './illustrations/People';
import { 
  GraduationCap, 
  Briefcase, 
  HeartHandshake, 
  Building2, 
  TrendingUp, 
  Umbrella,
  ShieldCheck,
  Scroll,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const lifeStages = [
  {
    id: 'education',
    title: 'Education',
    fullTitle: 'Education & Early Foundation',
    subtitle: 'Money Basics',
    ageRange: 'Age 18 - 23',
    icon: GraduationCap,
    summary: 'Learn to budget, save a little from every rupee you get, and start a small emergency fund.',
    keyActions: [
      'Learn how compounding works',
      'Track where your pocket money goes',
      'Keep a small emergency cushion',
      'Start a small SIP, even ₹500'
    ],
    targetFocus: 'Financial Literacy & Discipline'
  },
  {
    id: 'career',
    title: 'Career',
    fullTitle: 'First Salary & Career Start',
    subtitle: 'First Salary',
    ageRange: 'Age 24 - 28',
    icon: Briefcase,
    summary: 'Before lifestyle upgrades kick in, set up SIPs that go out the day your salary comes in.',
    keyActions: [
      'Set up SIPs on salary day',
      'Build a 6-month emergency fund',
      'Buy term cover while it’s cheap',
      'Pick the right tax regime early'
    ],
    targetFocus: 'Savings Rate & Risk Protection'
  },
  {
    id: 'marriage',
    title: 'Marriage',
    fullTitle: 'Marriage & Partnership',
    subtitle: 'Planning Together',
    ageRange: 'Age 28 - 32',
    icon: HeartHandshake,
    summary: 'Plan money together: shared goals, the right cover for both of you, and a budget you agree on.',
    keyActions: [
      'Talk openly about money goals',
      'Split and merge budgets clearly',
      'Update nominees on every account',
      'Get a family health cover'
    ],
    targetFocus: 'Joint Security & Protection'
  },
  {
    id: 'property',
    title: 'Property',
    fullTitle: 'Home Purchase & Assets',
    subtitle: 'Your Own Home',
    ageRange: 'Age 32 - 40',
    icon: Building2,
    summary: 'Save for the down payment separately, so buying a home doesn’t mean breaking your investments.',
    keyActions: [
      'Save a solid down payment first',
      'Keep the EMI within a safe limit',
      'Cover the loan with term insurance',
      'Don’t pause your SIPs for the EMI'
    ],
    targetFocus: 'Asset Creation & Debt Control'
  },
  {
    id: 'wealth',
    title: 'Wealth Creation',
    fullTitle: 'Peak Wealth Accumulation',
    subtitle: 'Growing Wealth',
    ageRange: 'Age 40 - 50',
    icon: TrendingUp,
    summary: 'Your peak earning years. Use tax benefits well, keep the right equity-debt mix and let compounding work.',
    keyActions: [
      'Step up SIPs with every raise',
      'Balance equity, debt and gold',
      'Use 80C, 80D and NPS well',
      'Review your portfolio once a year'
    ],
    targetFocus: 'Tax Savings & Growth'
  },
  {
    id: 'retirement',
    title: 'Retirement',
    fullTitle: 'Retirement Income',
    subtitle: 'Retirement Income',
    ageRange: 'Age 50 - 58',
    icon: Umbrella,
    summary: 'Turn your savings into a steady monthly income with a withdrawal plan built to last.',
    keyActions: [
      'Know your retirement number',
      'Plan a monthly income after 60',
      'Move slowly to safer investments',
      'Keep health cover for parents too'
    ],
    targetFocus: 'Monthly Income'
  },
  {
    id: 'health',
    title: 'Health Protection',
    fullTitle: 'Health & Medical Cover',
    subtitle: 'Health Cover',
    ageRange: 'Age 55 - 65',
    icon: ShieldCheck,
    summary: 'Medical costs rise fast. Add a top-up health plan and keep a separate fund for health expenses.',
    keyActions: [
      'Get cover that fits city costs',
      'Add a super top-up for big bills',
      'Check what your policy excludes',
      'Keep medical records organised'
    ],
    targetFocus: 'Health Cover'
  },
  {
    id: 'estate',
    title: 'Estate Planning',
    fullTitle: 'Estate & Legacy Transfer',
    subtitle: 'Will & Nominees',
    ageRange: 'Age 60+',
    icon: Scroll,
    summary: 'Write a will, update nominees and keep papers in one place, so your family isn’t left guessing.',
    keyActions: [
      'Write a simple, clear will',
      'Update nominees everywhere',
      'List all accounts in one place',
      'Tell family where documents are'
    ],
    targetFocus: 'Will & Nominees'
  }
];


// A face for every stage, so people of any age can see themselves here
const PERSON_BY_STAGE = {
  education: 'first-job',
  career: 'first-job',
  marriage: 'newly-married',
  property: 'parents',
  wealth: 'peak',
  retirement: 'pre-retirement',
  health: 'pre-retirement',
  estate: 'retired',
};
const personFor = (id) => PEOPLE.find((p) => p.key === PERSON_BY_STAGE[id])?.props || PEOPLE[0].props;

export default function StagePlanningSection({ onOpenSearch }) {
  const [selectedStage, setSelectedStage] = useState(lifeStages[1]); // Default to Career

  const selectedIndex = lifeStages.findIndex(s => s.id === selectedStage.id);

  return (
    <section className="py-8 sm:py-10 lg:py-12 relative overflow-hidden bg-[#FFFFFF] border-y border-[#E4E8F0] text-left">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#2F5BC7]/8 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF2FB] text-xs font-semibold uppercase tracking-widest text-[#2F5BC7]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span className="font-bold">LIFE STAGES</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#0F1F45] tracking-tight leading-tight"
          >
            The Right Money Moves
            <span className="block text-[#2F5BC7] font-serif-luxury">
              at Every Age.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] font-normal leading-relaxed"
          >
            What matters at 23 is very different from what matters at 45. Pick your stage and see what to focus on right now.
          </motion.p>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* HORIZONTAL CONNECTED TIMELINE TRACK (ALL 8 STAGES CONTINUOUSLY CONNECTED) */}
        {/* ------------------------------------------------------------- */}
        <div className="relative pt-4 pb-2">
          {/* Desktop 8-Column Continuous Trace Line */}
          <div className="hidden lg:block absolute top-[36px] left-[6.25%] right-[6.25%] h-[3px] pointer-events-none z-0">
            {/* Base Metallic Gold Track */}
            <div className="w-full h-full bg-gradient-to-r from-[#E4E8F0] via-[#2F5BC7]/40 to-[#E4E8F0] rounded-full shadow-sm" />
            
            {/* Active Illuminated Gold Progress Path */}
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1A3170] via-[#1A3170] to-[#1A3170] rounded-full shadow-[0_0_12px_rgba(26,49,112,0.6)]"
              initial={false}
              animate={{
                width: `${(selectedIndex / (lifeStages.length - 1)) * 100}%`
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>

          {/* 8 Milestone Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3 lg:gap-3.5 relative z-10">
            {lifeStages.map((stage, idx) => {
              const IconComp = stage.icon;
              const isSelected = selectedStage.id === stage.id;
              const isPassed = idx <= selectedIndex;

              return (
                <motion.button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStage(stage)}
                  whileHover={{ y: -5 }}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between relative group ${
                    isSelected
                      ? 'bg-white border-[#2F5BC7] shadow-lg ring-2 ring-[#2F5BC7]/40'
                      : 'bg-white/95 border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm'
                  }`}
                >
                  {/* Top Icon Badge Header */}
                  <div className="relative mb-2 flex flex-col items-center">
                    <div className={`relative transition-all ${isSelected ? 'scale-110' : 'opacity-90 group-hover:opacity-100'}`}>
                      <PersonAvatar size={48} ring={isSelected} {...personFor(stage.id)} />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${
                          isSelected ? 'bg-[#1A3170] text-white' : 'bg-[#EEF2FB] text-[#1A3170]'
                        }`}
                      >
                        <IconComp className="w-2.5 h-2.5" />
                      </span>
                    </div>

                    {/* Age Range Badge Pill */}
                    <span className={`text-[9px] font-mono font-bold mt-2 px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-[#1A3170] text-white border-[#1A3170]'
                        : 'bg-[#FFFFFF] text-[#2F5BC7] border-[#E4E8F0]'
                    }`}>
                      {stage.ageRange}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="w-full text-center">
                    <h3 className={`text-xs font-bold font-serif-luxury leading-tight transition-colors ${
                      isSelected ? 'text-[#2F5BC7]' : 'text-[#0F1F45] group-hover:text-[#2F5BC7]'
                    }`}>
                      {stage.title}
                    </h3>
                    <p className="text-[10px] text-[#64748B] font-light mt-0.5 truncate">
                      {stage.subtitle}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* SELECTED STAGE DETAILED DISPLAY CARD                          */}
        {/* ------------------------------------------------------------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-white/95 border border-[#2F5BC7]/35 p-6 sm:p-10 shadow-xl backdrop-blur-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Top Gold Arc Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2.5px] bg-gradient-to-r from-transparent via-[#1A3170] to-transparent rounded-full" />

            {/* Left Column — Detailed Text & Action Plan */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A3170] px-3 py-1 rounded-full bg-[#EEF2FB]">
                  {selectedStage.ageRange}
                </span>
                <span className="text-xs text-[#64748B] font-medium">
                  Core Focus: <strong className="text-[#0F1F45] font-semibold">{selectedStage.targetFocus}</strong>
                </span>
              </div>

              <div>
                <h3 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#0F1F45] tracking-tight">
                  {selectedStage.fullTitle}
                </h3>
                <p className="text-sm sm:text-base text-[#475569] font-normal leading-relaxed mt-3">
                  {selectedStage.summary}
                </p>
              </div>

              {/* Action Bullet Points */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono font-semibold text-[#1A3170] uppercase tracking-wider">
                  What to do now:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedStage.keyActions.map((action, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#F7F8FB] border border-[#2F5BC7]/20">
                      <CheckCircle2 className="w-4 h-4 text-[#2F5BC7] shrink-0 mt-0.5" />
                      <span className="text-xs text-[#0F1F45] font-medium leading-normal">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenSearch}
                  className="gold-glow-button px-7 py-3.5 rounded-full text-xs font-bold tracking-wide flex items-center space-x-2 cursor-pointer shadow-lg"
                >
                  <span>Build {selectedStage.title} Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column — stage checklist, shown as a clean product card */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm rounded-2xl bg-white border border-[#E4E8F0] shadow-[0_1px_2px_rgba(11,27,63,0.04),0_16px_40px_rgba(11,27,63,0.08)] p-5 sm:p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E4E8F0]">
                  <span className="w-10 h-10 rounded-xl bg-[#EEF2FB] text-[#2F5BC7] flex items-center justify-center shrink-0">
                    {React.createElement(selectedStage.icon, { className: 'w-5 h-5' })}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#0F1F45] leading-tight">Your {selectedStage.subtitle} checklist</p>
                    <p className="text-xs text-[#5B6B84] mt-0.5">{selectedStage.ageRange}</p>
                  </div>
                </div>

                <ul className="py-4 space-y-3">
                  {selectedStage.keyActions.map((action, i) => (
                    <li key={action} className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          i < 2 ? 'bg-[#1A3170] text-white' : 'border-2 border-[#CBD6EE] bg-white'
                        }`}
                        aria-hidden="true"
                      >
                        {i < 2 && (
                          <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.2l2.3 2.3 4.7-4.9" /></svg>
                        )}
                      </span>
                      <span className={`text-sm ${i < 2 ? 'text-[#0F1F45] font-medium' : 'text-[#5B6B84]'}`}>{action}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[#E4E8F0]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-[#0F1F45]">Your progress</span>
                    <span className="text-[#5B6B84]">2 of {selectedStage.keyActions.length} done</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#EEF2FB] overflow-hidden">
                    <div className="h-full w-1/2 rounded-full bg-[#1A3170]" />
                  </div>
                  <p className="text-[11px] text-[#8A96AB] mt-3">Example view — your advisor builds the real one with you.</p>
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
