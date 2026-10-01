import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calculator, 
  ShieldCheck, 
  Coins, 
  Landmark, 
  ArrowDownRight, 
  Target, 
  Receipt, 
  Flame, 
  GraduationCap, 
  Home, 
  ShieldAlert, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function CalculatorCategoriesGrid({ onOpenCalculator }) {
  const calculators = [
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate monthly systematic investment growth with step-up compounding options.',
      icon: TrendingUp,
      badge: 'Investments'
    },
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Estimate principal, interest, and monthly EMI repayments for home or personal loans.',
      icon: Calculator,
      badge: 'Loans'
    },
    {
      id: 'retirement',
      title: 'Retirement Calculator',
      description: 'Estimate your target FIRE retirement corpus and inflation-indexed passive income streams.',
      icon: ShieldCheck,
      badge: 'Retirement'
    },
    {
      id: 'lumpsum',
      title: 'Lumpsum Calculator',
      description: 'Project future capital growth for one-time investments across various rate of return horizons.',
      icon: Coins,
      badge: 'Investments'
    },
    {
      id: 'fd',
      title: 'FD Calculator',
      description: 'Calculate fixed deposit interest payout returns, maturity values, and compounding schedules.',
      icon: Landmark,
      badge: 'Fixed Income'
    },
    {
      id: 'swp',
      title: 'SWP Calculator',
      description: 'Plan systematic monthly withdrawal streams for post-retirement passive income.',
      icon: ArrowDownRight,
      badge: 'Passive Income'
    },
    {
      id: 'goal',
      title: 'Goal Calculator',
      description: 'Estimate exact monthly savings required to hit a specific financial target deadline.',
      icon: Target,
      badge: 'Goal Planning'
    },
    {
      id: 'tax',
      title: 'Tax Calculator',
      description: 'Estimate annual Section 80C/80D savings and compare Old vs New Tax Regime options.',
      icon: Receipt,
      badge: 'Tax Efficiency'
    },
    {
      id: 'inflation',
      title: 'Inflation Calculator',
      description: 'Visualize how 6% inflation affects future purchasing power and living costs over time.',
      icon: Flame,
      badge: 'Purchasing Power'
    },
    {
      id: 'education',
      title: 'Education Calculator',
      description: 'Project future inflation-adjusted global university tuition and education expenses.',
      icon: GraduationCap,
      badge: 'Education'
    },
    {
      id: 'home',
      title: 'Home Affordability Calculator',
      description: 'Determine comfortable property down payment targets and sustainable mortgage limits.',
      icon: Home,
      badge: 'Real Estate'
    },
    {
      id: 'emergency',
      title: 'Emergency Fund Calculator',
      description: 'Calculate 6 to 12 months liquid safety reserve targets for career or health emergencies.',
      icon: ShieldAlert,
      badge: 'Safety Reserve'
    }
  ];

  return (
    <section id="calculator-grid" className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF]">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[400px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] text-xs font-semibold uppercase tracking-widest font-sora">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>12 PLANNING ENGINES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            Find The Right Calculator For Every Financial Decision.
          </h2>

          <p className="text-base sm:text-lg text-[#5B6B84] font-inter">
            Select an interactive planning engine below to model your financial milestones.
          </p>
        </div>

        {/* 12 Premium 28px Rounded Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((item, index) => {
            const IconComp = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
                whileHover={{ y: -8 }}
                className="p-7 rounded-[28px] bg-gradient-to-b from-[#F7F8FB]/95 to-[#F7F8FB]/95 border border-[#2F5BC7]/30 hover:border-[#5A7FD6]/70 transition-all duration-300 shadow-[0_15px_40px_rgba(2,11,45,0.8)] backdrop-blur-2xl text-left flex flex-col justify-between group cursor-pointer"
                onClick={() => onOpenCalculator && onOpenCalculator(item.id)}
              >
                <div className="space-y-4">
                  
                  {/* Top Bar with Gold Calculator Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5A7FD6] to-[#1A3170] p-[1px] shadow-[0_0_15px_rgba(26,49,112,0.3)]">
                      <div className="w-full h-full bg-[#FFFFFF] rounded-[15px] flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                    </div>

                    <span className="text-[10px] font-sora font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFFFFF] text-[#5A7FD6] border border-[#2F5BC7]/30">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#5A7FD6] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5B6B84] leading-relaxed font-inter">
                    {item.description}
                  </p>

                </div>

                {/* Bottom Action CTA */}
                <div className="mt-6 pt-4 border-t border-[#2F5BC7]/15 flex items-center justify-between text-xs font-semibold text-[#5A7FD6] group-hover:text-[#0F1F45] transition-colors">
                  <span>Open Calculator</span>
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
