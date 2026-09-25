import React from 'react';
import { motion } from 'framer-motion';
import { Compass, CheckCircle2, ShieldAlert, Sparkles, TrendingUp, Target } from 'lucide-react';

export default function WhySolahanaExists() {
  const pillars = [
    {
      title: 'Planning Before Investing',
      subtitle: 'Know where you’re going before you pick how to get there.',
      description: 'We build your plan first, then choose investments that fit it.',
      icon: Target
    },
    {
      title: 'Goals Before Products',
      subtitle: 'Every investment is chosen for a goal and a timeline.',
      description: 'Short-term goals get safer options; long-term goals get room to grow.',
      icon: Compass
    },
    {
      title: 'Strategy Before Decisions',
      subtitle: 'Stick to the plan when markets get noisy.',
      description: 'Calm, steady decisions instead of panic selling or chasing tips.',
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-[#F7F8FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column — Visual Transformation Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="p-7 sm:p-8 rounded-3xl bg-white border border-[#2F5BC7]/30 shadow-xl text-left space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#2F5BC7]/20">
                <span className="text-xs font-sora font-bold text-[#1A3170] uppercase tracking-wider">
                  BEFORE & AFTER
                </span>
                <span className="text-[10px] text-[#64748B] px-2.5 py-1 rounded bg-[#F7F8FB] border border-[#2F5BC7]/20">
                  SOUND FAMILIAR?
                </span>
              </div>

              {/* Before: Financial Chaos Block */}
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700 flex items-center gap-1.5 font-sora">
                    <ShieldAlert className="w-4 h-4" />
                    Without a plan
                  </span>
                </div>
                <p className="text-xs text-red-800 leading-relaxed font-inter">
                  A few FDs here, a random SIP there, tax-saving done in a March rush, insurance nobody remembers, and worry every time the market falls.
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#2F5BC7]/15 text-[#2F5BC7] flex items-center justify-center font-bold">
                  ↓
                </div>
              </div>

              {/* After: Structured Clarity Block */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 font-sora">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    With SOLAHANA
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed font-inter">
                  One clear plan. Every rupee linked to a goal, taxes planned early, insurance sorted, and someone to call when you have questions.
                </p>
              </div>

            </div>
          </motion.div>

          {/* Right Column — Three Pillars */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full gold-badge text-[#1A3170] text-xs font-semibold uppercase tracking-widest font-sora">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
              <span>HOW WE THINK</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
              Why SOLAHANA Exists
            </h2>

            <p className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed">
              We replace confusion with a clear plan. Three simple rules guide everything we do.
            </p>

            <div className="space-y-4 pt-2">
              {pillars.map((pillar, idx) => {
                const IconComp = pillar.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-5 rounded-2xl bg-white border border-[#2F5BC7]/20 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm hover:shadow-md transition-all flex items-start space-x-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif-luxury font-bold text-[#0F1F45]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-[#1A3170] font-sora font-medium mt-0.5">
                        {pillar.subtitle}
                      </p>
                      <p className="text-xs text-[#475569] font-inter leading-relaxed mt-1">
                        {pillar.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
