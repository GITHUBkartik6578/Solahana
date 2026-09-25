import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Target, TrendingUp, ShieldCheck, ArrowRight, Sparkles, Smile } from 'lucide-react';

export default function WhyGoalPlanning() {
  const blocks = [
    {
      title: 'Clear Priorities',
      subtitle: 'Know exactly why you are saving and where every rupee goes.',
      description: 'Goal-based planning eliminates confusion. Every asset allocation is linked directly to a specific milestone horizon, giving your money purpose and structure.',
      icon: Target,
      tag: 'Purpose'
    },
    {
      title: 'Better Savings Habits',
      subtitle: 'Automated step-up SIPs tailored to target corpus deadlines.',
      description: 'When savings are anchored to real life ambitions (like buying a home or child education), staying disciplined month after month becomes effortless.',
      icon: TrendingUp,
      tag: 'Discipline'
    },
    {
      title: 'Reduced Financial Stress',
      subtitle: 'Freedom from market panic and short-term volatility anxiety.',
      description: 'Because your short-term needs are protected by liquid emergency shields, you can comfortably ignore market noise and let long-term assets compound.',
      icon: Smile,
      tag: 'Peace of Mind'
    },
    {
      title: 'Long-Term Wealth Creation',
      subtitle: 'Multi-decadal compounding engineered for true financial independence.',
      description: 'Goal-aligned portfolios optimize tax harvesting and risk reduction, ensuring maximum net worth accumulation over your lifetime.',
      icon: ShieldCheck,
      tag: 'Compounding'
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#F7F8FB]/30 border-y border-[#2F5BC7]/15">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <Compass className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>THE PURPOSE PARADIGM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            Planning Works Better When Every Rupee Has A Purpose.
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B84] font-inter">
            Instead of investing randomly, organize money around meaningful life goals.
          </p>
        </div>

        {/* Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column — Editorial Illustration Graphic */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-b from-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/30 shadow-[0_20px_50px_rgba(2,11,45,0.9)] backdrop-blur-2xl text-left space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#2F5BC7]/15">
                <span className="text-xs font-sora font-bold text-[#5A7FD6] uppercase tracking-wider">
                  INVESTING COMPARISON
                </span>
                <span className="text-[10px] text-[#5B6B84] px-2.5 py-1 rounded bg-[#FFFFFF] border border-[#2F5BC7]/20">
                  SOLAHANA METHOD
                </span>
              </div>

              {/* Random Investing Block */}
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-red-400 font-sora">
                  <span>Random Investing (No Goals)</span>
                  <span className="text-[10px] text-red-300 font-mono">HIGH RISK</span>
                </div>
                <p className="text-xs text-[#5B6B84] leading-relaxed">
                  Chasing trending stocks, random SIPs with no target timeline, panic selling during market dips, unknown retirement corpus.
                </p>
              </div>

              {/* Arrow */}
              <div className="flex justify-center my-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#5A7FD6] to-[#1A3170] text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(26,49,112,0.4)]">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>
              </div>

              {/* Goal-Based Investing Block */}
              <div className="p-4 rounded-2xl bg-[#F7F8FB] border border-[#5A7FD6]/50 space-y-2 shadow-[0_0_20px_rgba(26,49,112,0.2)]">
                <div className="flex items-center justify-between text-xs font-bold text-[#5A7FD6] font-sora">
                  <span>Goal-Based Strategy (SOLAHANA)</span>
                  <span className="text-[10px] text-[#5A7FD6] font-mono font-bold">100% PURPOSE</span>
                </div>
                <p className="text-xs text-[#0F1F45] leading-relaxed font-medium">
                  Every rupee tied to a specific milestone deadline (Home 2028, Education 2032, FIRE 2038) with disciplined step-up SIPs.
                </p>
              </div>

              <div className="pt-3 border-t border-[#2F5BC7]/15 text-center text-xs text-[#5B6B84]">
                Result: <span className="text-[#5A7FD6] font-semibold font-sora">94.8% Higher Goal Success Rate</span>
              </div>

            </div>
          </motion.div>

          {/* Right Column — 4 Information Blocks */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-4 text-left"
          >
            {blocks.map((item, index) => {
              const IconComp = item.icon;

              return (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 6 }}
                  className="p-5 rounded-2xl bg-[#FFFFFF]/90 border border-[#2F5BC7]/25 hover:border-[#2F5BC7]/60 transition-all duration-300 backdrop-blur-xl flex items-start space-x-4 group"
                >
                  <div className="p-3 rounded-xl bg-[#2F5BC7]/10 text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors shrink-0 mt-0.5">
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-sora font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F7F8FB] text-[#5A7FD6] border border-[#2F5BC7]/20">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-[#5A7FD6]">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-[#5B6B84] leading-relaxed font-inter pt-0.5">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
