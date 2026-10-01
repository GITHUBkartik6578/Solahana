import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Wallet, 
  ShieldCheck, 
  TrendingUp, 
  Home, 
  Crown, 
  Clock, 
  Compass, 
  Target, 
  CheckCircle2 
} from 'lucide-react';

const timelineStages = [
  {
    stageNumber: '01',
    stageName: 'Stage 1',
    title: 'Start Today',
    subtitle: 'Understand income, expenses and savings.',
    description: 'Gain full clarity over monthly cash flows, track savings rates, and structure baseline allocation before investing.',
    icon: Wallet,
    tag: 'Baseline Audit'
  },
  {
    stageNumber: '02',
    stageName: 'Stage 2',
    title: 'Build Your Foundation',
    subtitle: 'Emergency fund and insurance protection.',
    description: 'Establish a liquid 6-month safety net and comprehensive term & health shields to safeguard your family.',
    icon: ShieldCheck,
    tag: 'Risk Protection'
  },
  {
    stageNumber: '03',
    stageName: 'Stage 3',
    title: 'Grow Your Wealth',
    subtitle: 'SIPs, diversified investments and long-term compounding.',
    description: 'Deploy disciplined step-up SIPs across equity, debt, and global assets to harness continuous compound growth.',
    icon: TrendingUp,
    tag: 'Wealth Creation'
  },
  {
    stageNumber: '04',
    stageName: 'Stage 4',
    title: 'Achieve Major Milestones',
    subtitle: 'Home, education, business and lifestyle goals.',
    description: 'Targeted goal-based portfolios mature seamlessly for property down-payments, higher education, and expansion.',
    icon: Home,
    tag: 'Goal Realization'
  },
  {
    stageNumber: '05',
    stageName: 'Stage 5',
    title: 'Financial Freedom',
    subtitle: 'Retirement income and long-term wealth preservation.',
    description: 'Transition into inflation-adjusted Systematic Withdrawal Plans (SWP) for sustainable lifelong independence.',
    icon: Crown,
    tag: 'Legacy & FIRE'
  }
];

const horizonCards = [
  {
    id: 'short-term',
    title: 'Short-Term Goals',
    horizon: '0–3 Years',
    approach: 'Capital Preservation & Ultra-Liquid Allocation',
    description: 'Focused on safety of capital and high liquidity. Money is deployed into liquid mutual funds, high-grade debt, and fixed deposits.',
    risk: 'Low Risk',
    riskColor: 'text-[#5A7FD6]',
    progressWidth: '25%',
    icon: Clock
  },
  {
    id: 'medium-term',
    title: 'Medium-Term Goals',
    horizon: '3–7 Years',
    approach: 'Balanced Hybrid Growth Strategy',
    description: 'Combines conservative equity participation with stable debt instruments to beat inflation while protecting target timelines.',
    risk: 'Moderate Risk',
    riskColor: 'text-[#5A7FD6]',
    progressWidth: '50%',
    icon: Target
  },
  {
    id: 'long-term',
    title: 'Long-Term Goals',
    horizon: '7–15 Years',
    approach: 'Equity-Dominant Compounding Engine',
    description: 'Leverages market volatility to accumulate wealth via diversified flexi-cap equity funds, index strategies, and step-up SIPs.',
    risk: 'Growth Risk',
    riskColor: 'text-amber-400',
    progressWidth: '75%',
    icon: TrendingUp
  },
  {
    id: 'legacy-retirement',
    title: 'Legacy & Retirement Goals',
    horizon: '15+ Years',
    approach: 'Multi-Decadal Corpus & SWP Freedom',
    description: 'Engineered for true financial independence (FIRE), multi-generational wealth transfer, tax-efficient SWP streams, and estate protection.',
    risk: 'Aggressive Growth',
    riskColor: 'text-amber-300',
    progressWidth: '100%',
    icon: Compass
  }
];

export const PersonalizedGoalTimelineSection = () => {
  return (
    <section id="personalized-goal-timeline" className="py-24 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[#2F5BC7]/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F7F8FB]/60 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
              PERSONALIZED GOAL PLANNING
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-5xl font-bold text-[#0F1F45] mb-6 leading-tight"
          >
            Your Goals. Your Timeline.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
              Your Strategy.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#334155] text-base md:text-lg font-light leading-relaxed"
          >
            Every financial goal has a different timeline, investment approach and level of risk. SOLAHANA helps you choose the right strategy for each milestone instead of using one plan for everything.
          </motion.p>
        </div>

        {/* 5-STAGE HORIZONTAL LUXURY TIMELINE */}
        <div className="relative mb-28">
          {/* Glowing Gold Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[90px] left-8 right-8 h-[3px] bg-gradient-to-r from-[#2F5BC7]/20 via-[#1A3170] to-[#2F5BC7]/20 shadow-[0_0_15px_rgba(26,49,112,0.6)] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {timelineStages.map((stage, index) => {
              const Icon = stage.icon;
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={stage.stageNumber}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className={`group relative p-6 rounded-3xl bg-gradient-to-b from-[#F7F8FB]/90 via-[#F7F8FB]/95 to-[#F7F8FB] border border-[#2F5BC7]/30 hover:border-[#5A7FD6] shadow-2xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between ${
                    isEven ? 'lg:translate-y-0' : 'lg:translate-y-6'
                  }`}
                >
                  {/* Subtle top gold beam */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-[#1A3170] to-transparent rounded-full group-hover:w-36 transition-all duration-300" />

                  <div>
                    {/* Header: Stage Badge & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/15 border border-[#2F5BC7]/40 flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors duration-300 shadow-[0_0_15px_rgba(26,49,112,0.3)]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono text-xl font-bold text-[#5A7FD6]/50 group-hover:text-[#5A7FD6] transition-colors duration-300">
                        {stage.stageNumber}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-[#5A7FD6] uppercase tracking-wider block mb-1">
                      {stage.stageName} • {stage.tag}
                    </span>

                    <h3 className="font-playfair text-xl font-bold text-[#0F1F45] mb-2 group-hover:text-[#5A7FD6] transition-colors duration-300">
                      {stage.title}
                    </h3>

                    <p className="text-[#5A7FD6] text-xs font-semibold mb-3 leading-snug">
                      {stage.subtitle}
                    </p>

                    <p className="text-[#5B6B84] text-xs leading-relaxed font-light mb-6">
                      {stage.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E4E8F0] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#5B6B84] group-hover:text-[#2F5BC7] transition-colors">
                      Phase Complete
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#2F5BC7]" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>


        {/* BELOW THE TIMELINE: COMPARISON SECTION */}
        <div className="pt-12 border-t border-[#E4E8F0]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 mb-4"
            >
              <Clock className="w-3.5 h-3.5 text-[#5A7FD6]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
                HORIZON MATCHING
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-playfair text-3xl md:text-4xl font-bold text-[#0F1F45] mb-4 leading-tight"
            >
              Every Goal Has A Different{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
                Investment Horizon.
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#5B6B84] text-base font-light"
            >
              Matching your asset allocation with your exact time horizon protects near-term capital while optimizing long-term wealth growth.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {horizonCards.map((card, index) => {
              const HorizonIcon = card.icon;
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative p-7 rounded-3xl bg-gradient-to-b from-[#F7F8FB]/80 via-[#F7F8FB]/90 to-[#F7F8FB] border border-[#E4E8F0] hover:border-[#2F5BC7]/50 shadow-xl backdrop-blur-xl flex flex-col justify-between text-left"
                >
                  {/* Subtle card glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#2F5BC7]/0 via-[#2F5BC7]/0 to-[#2F5BC7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    {/* Top Row: Icon & Horizon Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors duration-300">
                        <HorizonIcon className="w-6 h-6" />
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#2F5BC7]/20 border border-[#2F5BC7]/40 text-[#5A7FD6]">
                        {card.horizon}
                      </span>
                    </div>

                    <h4 className="font-playfair text-xl font-bold text-[#0F1F45] mb-2 group-hover:text-[#5A7FD6] transition-colors duration-300">
                      {card.title}
                    </h4>

                    <span className="text-xs font-mono text-[#5A7FD6] font-medium block mb-3">
                      Approach: {card.approach}
                    </span>

                    <p className="text-[#5B6B84] text-xs leading-relaxed font-light mb-6">
                      {card.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#E4E8F0]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5B6B84] font-mono">Risk Profile</span>
                      <span className={`font-semibold ${card.riskColor}`}>{card.risk}</span>
                    </div>

                    {/* Progress Bar Line */}
                    <div className="w-full h-1.5 rounded-full bg-[#F7F8FB] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1A3170] to-[#5A7FD6] transition-all duration-500"
                        style={{ width: card.progressWidth }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PersonalizedGoalTimelineSection;
