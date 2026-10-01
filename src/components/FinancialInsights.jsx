import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Target 
} from 'lucide-react';

export default function FinancialInsights() {
  const articles = [
    {
      title: 'How to Build a 6-Month Emergency Shield Fund',
      desc: 'Learn how to calculate your liquid reserve target, select high-yield overnight instruments, and protect your family from unexpected lifestyle disruptions.',
      category: 'Financial Basics',
      readTime: '5 min read',
      icon: ShieldCheck,
      color: 'from-blue-500/20 to-transparent',
    },
    {
      title: '5 Financial Mistakes Young Professionals Should Avoid',
      desc: 'Discover how to balance lifestyle upgrades with disciplined step-up SIPs, tax-saver investments under Sec 80C, and early compounding benefits.',
      category: 'Wealth Strategy',
      readTime: '7 min read',
      icon: TrendingUp,
      color: 'from-[#2F5BC7]/25 to-transparent',
    },
    {
      title: 'Retirement Planning Starts Earlier Than You Think',
      desc: 'Explore the FIRE framework (Financial Independence, Retire Early) and learn how to model an inflation-protected passive income stream for age 48.',
      category: 'FIRE Roadmap',
      readTime: '6 min read',
      icon: Target,
      color: 'from-emerald-500/20 to-transparent',
    },
  ];

  return (
    <section className="relative z-10 py-24 bg-[#FFFFFF] border-t border-[#2F5BC7]/15 overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#2F5BC7]/8 rounded-full blur-[140px] pointer-events-none" />

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
            <span className="font-sora tracking-wide uppercase text-[11px]">KNOWLEDGE CENTER</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-tight"
          >
            Learn Before You{' '}
            <span className="gold-gradient-text italic font-serif-luxury">Invest</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5B6B84] font-inter leading-relaxed"
          >
            Simple financial knowledge designed for smarter, long-term wealth decisions.
          </motion.p>
        </div>

        {/* 3 Premium Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => {
            const IconComp = art.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-[28px] p-7 bg-[#F7F8FB]/60 hover:bg-[#F7F8FB]/95 border border-[#2F5BC7]/25 hover:border-[#2F5BC7]/60 backdrop-blur-2xl transition-all duration-500 shadow-[0_15px_40px_rgba(2,11,45,0.8)] hover:shadow-[0_20px_50px_rgba(26,49,112,0.22)] overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Cover Header Graphic */}
                <div className="relative h-44 rounded-2xl bg-[#FFFFFF]/80 border border-[#2F5BC7]/20 mb-6 p-5 flex flex-col justify-between overflow-hidden group-hover:border-[#2F5BC7]/50 transition-colors">
                  <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${art.color} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold font-sora bg-[#2F5BC7]/15 text-[#5A7FD6] border border-[#2F5BC7]/30">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-[#5B6B84] flex items-center gap-1 font-num">
                      <Clock className="w-3 h-3 text-[#5A7FD6]" /> {art.readTime}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-[#2F5BC7]/15 border border-[#2F5BC7]/30 text-[#5A7FD6] flex items-center justify-center relative z-10 shadow-[0_0_12px_rgba(26,49,112,0.25)] group-hover:rotate-6 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                </div>

                {/* Article Content */}
                <div>
                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors duration-300 mb-3">
                    {art.title}
                  </h3>

                  <p className="text-sm text-[#5B6B84] font-inter leading-relaxed mb-6">
                    {art.desc}
                  </p>
                </div>

                {/* Card Footer Link */}
                <div className="pt-4 border-t border-[#2F5BC7]/15 flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-[#5A7FD6] group-hover:text-[#2F5BC7] transition-colors">
                    Read Article
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
