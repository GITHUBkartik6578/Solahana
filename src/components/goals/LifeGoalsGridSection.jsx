import React from 'react';
import { motion } from 'framer-motion';
import { Home, GraduationCap, ShieldCheck, ShieldAlert, TrendingUp, Plane, ArrowRight, Sparkles } from 'lucide-react';

export default function LifeGoalsGridSection({ onSelectGoal }) {
  const cards = [
    {
      id: 'home',
      title: 'Dream Home',
      description: 'Build a structured roadmap towards buying your future home with down-payment saving & mortgage planning.',
      icon: Home,
      target: '₹1.20 Cr Target',
      timeline: '4–6 Years',
      tag: 'Property Fund'
    },
    {
      id: 'education',
      title: 'Child Education',
      description: 'Prepare for higher education and global university tuition fees through inflation-adjusted disciplined SIPs.',
      icon: GraduationCap,
      target: '₹45.00 Lakhs Target',
      timeline: '8–12 Years',
      tag: 'Future Scholar'
    },
    {
      id: 'retirement',
      title: 'Retirement Planning (FIRE)',
      description: 'Create long-term financial independence and inflation-protected passive income to retire on your own terms.',
      icon: ShieldCheck,
      target: '₹4.50 Cr Target',
      timeline: '12–15 Years',
      tag: 'Financial Freedom'
    },
    {
      id: 'emergency',
      title: 'Emergency Safety Shield',
      description: 'Build financial confidence and peace of mind for unexpected medical or career interruptions.',
      icon: ShieldAlert,
      target: '12 Months Liquid Cover',
      timeline: 'Immediate',
      tag: 'Liquid Reserve'
    },
    {
      id: 'wealth',
      title: 'Wealth Creation',
      description: 'Accelerate multi-decadal wealth growth through compounding equity, debt shields, and tax harvesting.',
      icon: TrendingUp,
      target: '₹2.50 Cr Target',
      timeline: '10+ Years',
      tag: 'Asset Growth'
    },
    {
      id: 'lifestyle',
      title: 'Dream Lifestyle & Travel',
      description: 'Plan luxury travel, sabbatical breaks, and personal passion projects without compromising your family stability.',
      icon: Plane,
      target: '₹15.00 Lakhs Target',
      timeline: 'Annual / Sabbatical',
      tag: 'Lifestyle Fund'
    }
  ];

  return (
    <section id="life-goals-grid" className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[400px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>MILESTONE CATALOG</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            Plan Every Important Milestone.
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B84] font-inter">
            Select a life milestone below to construct your personalized financial strategy.
          </p>
        </div>

        {/* 6 Large Luxury Goal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((item, index) => {
            const IconComp = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl bg-gradient-to-b from-[#F7F8FB]/95 to-[#F7F8FB]/95 border border-[#2F5BC7]/30 hover:border-[#5A7FD6]/70 transition-all duration-300 shadow-[0_15px_40px_rgba(2,11,45,0.8)] backdrop-blur-2xl text-left flex flex-col justify-between group cursor-pointer"
                onClick={() => onSelectGoal && onSelectGoal(item.id)}
              >
                <div className="space-y-5">
                  
                  {/* Top Bar with Illustration Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5A7FD6] to-[#1A3170] p-[1px] shadow-[0_0_20px_rgba(26,49,112,0.3)]">
                      <div className="w-full h-full bg-[#FFFFFF] rounded-[15px] flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors">
                        <IconComp className="w-7 h-7" />
                      </div>
                    </div>

                    <span className="text-[10px] font-sora font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFFFFF] text-[#5A7FD6] border border-[#2F5BC7]/30">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5B6B84] leading-relaxed font-inter">
                      {item.description}
                    </p>
                  </div>

                  {/* Target & Horizon Pill */}
                  <div className="p-3.5 rounded-2xl bg-[#FFFFFF]/80 border border-[#2F5BC7]/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#5B6B84] uppercase tracking-wider">Target Corpus</span>
                      <p className="text-sm font-bold font-sora text-[#5A7FD6]">{item.target}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#5B6B84] uppercase">Horizon</span>
                      <p className="text-xs font-semibold text-[#0F1F45] font-sora">{item.timeline}</p>
                    </div>
                  </div>

                </div>

                {/* Bottom Action Line */}
                <div className="mt-6 pt-4 border-t border-[#2F5BC7]/15 flex items-center justify-between text-xs font-semibold text-[#5A7FD6] group-hover:text-[#0F1F45] transition-colors">
                  <span>Start Goal Strategy</span>
                  <ArrowRight className="w-4 h-4 text-[#2F5BC7] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
