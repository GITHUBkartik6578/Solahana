import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, FileSpreadsheet, PiggyBank, TrendingUp, Trophy } from 'lucide-react';

export default function GoalJourneyTimeline() {
  const stages = [
    {
      num: '01',
      title: 'Dream',
      subtitle: 'Identify & define your ambition',
      description: 'Articulate your milestone goals — home purchase, overseas tuition, early retirement, or sabbatical travel.',
      icon: Sparkles
    },
    {
      num: '02',
      title: 'Plan',
      subtitle: 'Quantify required target corpus',
      description: 'Calculate inflation-adjusted future target amounts and establish your realistic deadline date.',
      icon: FileSpreadsheet
    },
    {
      num: '03',
      title: 'Save',
      subtitle: 'Automate step-up SIP surplus',
      description: 'Allocate monthly cash flows into dedicated goal-linked buckets with zero-commission direct instruments.',
      icon: PiggyBank
    },
    {
      num: '04',
      title: 'Invest',
      subtitle: 'Tax-efficient asset allocation',
      description: 'Deploy capital across equity, debt, gold, and NPS with annual rebalancing and tax-loss harvesting.',
      icon: TrendingUp
    },
    {
      num: '05',
      title: 'Achieve',
      subtitle: 'Milestone success & peace of mind',
      description: 'Reach your target corpus on schedule with total financial security and no market-panic stress.',
      icon: Trophy
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#F7F8FB]/30 border-y border-[#2F5BC7]/15">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2F5BC7]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <Compass className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>PROGRESSION ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            From Dream To Achievement.
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B84] font-inter">
            A 5-phase journey designed to turn personal ambitions into predictable financial milestones.
          </p>
        </div>

        {/* 5 Stage Horizontal Timeline */}
        <div className="relative">
          
          {/* Horizontal Golden Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute left-12 right-12 top-12 h-[2px] bg-gradient-to-r from-[#5A7FD6]/30 via-[#1A3170] to-[#2F5BC7]/30 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {stages.map((item, idx) => {
              const IconComp = item.icon;

              return (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-3xl bg-[#FFFFFF]/95 border border-[#2F5BC7]/30 hover:border-[#5A7FD6]/70 transition-all duration-300 shadow-[0_15px_40px_rgba(2,11,45,0.8)] backdrop-blur-xl text-left flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Circle Node Icon */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5A7FD6] to-[#1A3170] p-[1px] shadow-[0_0_20px_rgba(26,49,112,0.4)] mx-auto lg:mx-0">
                      <div className="w-full h-full bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#5A7FD6] font-sora font-bold text-sm group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="text-center lg:text-left space-y-1">
                      <span className="text-[10px] font-sora font-bold text-[#5A7FD6] uppercase">
                        STAGE {item.num}
                      </span>
                      <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-[#5A7FD6]">
                        {item.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-[#5B6B84] leading-relaxed font-inter text-center lg:text-left">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#2F5BC7]/15 text-center lg:text-left text-[11px] text-[#5B6B84] font-sora">
                    Phase {item.num} Complete
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
