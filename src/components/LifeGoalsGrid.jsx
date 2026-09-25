import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Target, 
  GraduationCap, 
  ShieldAlert, 
  Sprout, 
  Calculator, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LifeGoalsGrid() {
  const goalCards = [
    {
      title: 'Dream Home',
      description: 'Plan savings and investments for your future home down payment, registration costs, and mortgage payoff.',
      icon: Home,
      visualBadge: 'Real Estate Fund',
      accentColor: 'from-[#5A7FD6]/20 to-transparent',
    },
    {
      title: 'Retirement Planning',
      description: 'Build long-term financial independence through structured early retirement FIRE modeling and passive income.',
      icon: Target,
      visualBadge: 'FIRE 2045 Target',
      accentColor: 'from-[#2F5BC7]/25 to-transparent',
    },
    {
      title: 'Child Education',
      description: 'Prepare for higher education expenses, college tuition, and international studies with goal-based investing.',
      icon: GraduationCap,
      visualBadge: 'University Fund',
      accentColor: 'from-emerald-500/20 to-transparent',
    },
    {
      title: 'Emergency Fund',
      description: 'Create a liquid safety cushion for unexpected life situations with 6 to 12 months of shielded reserves.',
      icon: ShieldAlert,
      visualBadge: '6-12 Months Shield',
      accentColor: 'from-blue-500/20 to-transparent',
    },
    {
      title: 'Wealth Creation',
      description: 'Grow wealth gradually through disciplined step-up SIP compounding and multi-asset portfolio allocation.',
      icon: Sprout,
      visualBadge: 'Multi-Asset SIP',
      accentColor: 'from-purple-500/20 to-transparent',
    },
    {
      title: 'Tax Planning',
      description: 'Organize investments while keeping tax efficiency in mind under Section 80C, 80D, and capital gains harvesting.',
      icon: Calculator,
      visualBadge: 'Section 80C & 80D',
      accentColor: 'from-amber-500/20 to-transparent',
    },
  ];

  return (
    <section className="relative z-10 py-24 bg-[#FFFFFF] border-t border-[#2F5BC7]/15 overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 right-10 w-[550px] h-[550px] bg-[#2F5BC7]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-blue-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#5A7FD6] border border-[#2F5BC7]/35 shadow-[0_0_15px_rgba(26,49,112,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6]" />
            <span className="font-sora tracking-wide uppercase text-[11px]">LIFE GOALS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight"
          >
            Every Goal Deserves Its Own{' '}
            <span className="gold-gradient-text italic font-serif-luxury">Financial Plan</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5B6B84] font-inter leading-relaxed"
          >
            SOLAHANA helps you plan every important milestone — from buying your first home to building retirement wealth.
          </motion.p>
        </div>

        {/* 3x2 Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goalCards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-[28px] p-7 sm:p-8 bg-[#F7F8FB]/65 hover:bg-[#F7F8FB]/95 border border-[#2F5BC7]/25 hover:border-[#2F5BC7]/60 backdrop-blur-2xl transition-all duration-500 shadow-[0_15px_40px_rgba(2,11,45,0.8)] hover:shadow-[0_20px_50px_rgba(26,49,112,0.22)] overflow-hidden flex flex-col justify-between"
              >
                {/* Background Shimmer & Soft Inner Glow Accent */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${card.accentColor} rounded-full blur-3xl pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />

                <div>
                  {/* Top Badge & Gold Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5A7FD6]/25 via-[#2F5BC7]/15 to-[#F7F8FB] border border-[#2F5BC7]/40 flex items-center justify-center text-[#5A7FD6] shadow-[0_0_15px_rgba(26,49,112,0.3)] group-hover:rotate-6 transition-all duration-300">
                      <IconComp className="w-7 h-7" />
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-bold font-sora tracking-wide bg-[#FFFFFF]/80 text-[#5A7FD6] border border-[#2F5BC7]/30">
                      {card.visualBadge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors duration-300 mb-3">
                    {card.title}
                  </h3>

                  <p className="text-sm text-[#5B6B84] font-inter leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Card Footer Link */}
                <div className="pt-4 border-t border-[#2F5BC7]/15 flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-[#5A7FD6] group-hover:text-[#2F5BC7] transition-colors">
                    Plan This Goal
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#2F5BC7]/15 border border-[#2F5BC7]/30 flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] group-hover:translate-x-1.5 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
