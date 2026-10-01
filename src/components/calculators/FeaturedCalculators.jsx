import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calculator, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedCalculators({ onTryCalculator }) {
  const featured = [
    {
      id: 'sip',
      title: 'SIP Compounding Calculator',
      subtitle: 'Monthly Step-Up Wealth Engine',
      description: 'Model how monthly step-up contributions compound over 5 to 25 years into a multi-crore goal corpus.',
      icon: TrendingUp,
      preview: {
        label: 'Projected 15-Yr Corpus',
        value: '₹2.53 Cr',
        detail: '₹50,000/mo @ 12% + 10% Step-up'
      }
    },
    {
      id: 'emi',
      title: 'Home Loan EMI Calculator',
      subtitle: 'Mortgage Repayment Analyzer',
      description: 'Calculate principal, interest, and monthly EMI burdens to determine a comfortable home loan budget.',
      icon: Calculator,
      preview: {
        label: 'Monthly EMI Output',
        value: '₹68,450 / mo',
        detail: '₹75 Lakh Loan @ 8.5% 20 Yrs'
      }
    },
    {
      id: 'retirement',
      title: 'FIRE Retirement Calculator',
      subtitle: 'Inflation-Indexed Freedom Engine',
      description: 'Find your exact net worth retirement target and calculate passive income streams to retire early.',
      icon: ShieldCheck,
      preview: {
        label: 'FIRE Corpus Target',
        value: '₹4.50 Cr',
        detail: 'Retirement Age 48 • Inflation 6%'
      }
    }
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#F7F8FB]/30 border-y border-[#2F5BC7]/15">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2F5BC7]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>FEATURED TOOLS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            Most Used Financial Planning Calculators
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B84] font-inter">
            The three core calculation engines relied on by thousands of families to structure their wealth.
          </p>
        </div>

        {/* 3 Large Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((item, idx) => {
            const IconComp = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl bg-gradient-to-b from-[#F7F8FB]/95 to-[#F7F8FB]/95 border border-[#2F5BC7]/35 hover:border-[#5A7FD6]/70 transition-all duration-300 shadow-[0_15px_40px_rgba(2,11,45,0.8)] backdrop-blur-2xl text-left flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  
                  {/* Top Bar Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5A7FD6] to-[#1A3170] p-[1px] shadow-[0_0_20px_rgba(26,49,112,0.3)]">
                      <div className="w-full h-full bg-[#FFFFFF] rounded-[15px] flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors">
                        <IconComp className="w-7 h-7" />
                      </div>
                    </div>

                    <span className="text-[10px] font-sora font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFFFFF] text-[#5A7FD6] border border-[#2F5BC7]/30">
                      FEATURED
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#5A7FD6]">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5B6B84] leading-relaxed font-inter">
                    {item.description}
                  </p>

                  {/* Mini Preview UI Box */}
                  <div className="p-4 rounded-2xl bg-[#FFFFFF]/90 border border-[#2F5BC7]/25 space-y-1.5">
                    <span className="text-[10px] text-[#5B6B84] uppercase tracking-wider font-sora">{item.preview.label}</span>
                    <p className="text-xl font-bold font-sora text-[#5A7FD6]">{item.preview.value}</p>
                    <p className="text-[10px] text-[#5B6B84] pt-0.5">{item.preview.detail}</p>
                  </div>

                </div>

                {/* Try Calculator Button */}
                <div className="mt-8">
                  <button
                    onClick={() => onTryCalculator && onTryCalculator(item.id)}
                    className="w-full gold-glow-button py-3.5 rounded-2xl text-xs font-bold tracking-wide flex items-center justify-center space-x-2 group/btn"
                  >
                    <span>Try Calculator</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
