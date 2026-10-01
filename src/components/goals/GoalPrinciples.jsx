import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

export default function GoalPrinciples() {
  const principles = [
    {
      title: 'Save With Purpose',
      subtitle: 'Every rupee linked to a specific deadline',
      description: 'We don’t save aimlessly. Money is partitioned into dedicated goal buckets — home down-payment, tuition, or FIRE retirement.',
      icon: Target,
      tag: 'Principle 01'
    },
    {
      title: 'Invest With Discipline',
      subtitle: 'Automated step-up SIP discipline',
      description: 'Consistent monthly execution beats attempting to time market highs and lows. Step-up SIPs accelerate compounding.',
      icon: TrendingUp,
      tag: 'Principle 02'
    },
    {
      title: 'Review Regularly',
      subtitle: 'Structured annual rebalancing & tax checks',
      description: 'Life transitions and market movements require periodic recalibration. We audit your plan every 12 months to maintain target allocations.',
      icon: RefreshCw,
      tag: 'Principle 03'
    },
    {
      title: 'Stay Consistent',
      subtitle: 'Shielding capital from panic and hype',
      description: 'Financial independence is achieved by staying committed to your master roadmap through full market cycles.',
      icon: ShieldCheck,
      tag: 'Principle 04'
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#F7F8FB]/40 border-t border-[#2F5BC7]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>SOLAHANA CORE CREED</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            The SOLAHANA Planning Philosophy.
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B84] font-inter">
            Four foundational pillars that govern our goal planning framework.
          </p>
        </div>

        {/* 4 Editorial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item, idx) => {
            const IconComp = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-7 rounded-3xl bg-[#FFFFFF]/95 border border-[#2F5BC7]/25 hover:border-[#5A7FD6]/70 transition-all duration-300 shadow-[0_10px_30px_rgba(2,11,45,0.7)] backdrop-blur-xl text-left flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5A7FD6]/20 to-[#2F5BC7]/10 border border-[#5A7FD6]/40 flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-all duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-sora font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-[#F7F8FB] text-[#5A7FD6] border border-[#2F5BC7]/20">
                      {item.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#5A7FD6]">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#5B6B84] leading-relaxed font-inter">
                    {item.description}
                  </p>
                </div>

                {/* Gold Accent Line */}
                <div className="mt-6 pt-3 border-t border-[#2F5BC7]/15 flex items-center justify-between text-[11px] text-[#5B6B84]">
                  <span>Fiduciary Rule</span>
                  <span className="text-[#5A7FD6] font-sora font-semibold">Locked</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
