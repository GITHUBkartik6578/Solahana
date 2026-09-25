import { Link } from 'react-router-dom';
import React from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  TrendingUp, 
  Repeat, 
  Coins, 
  ShieldCheck, 
  Globe, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function InvestmentCategories({ onOpenSearch }) {
  const categories = [
    {
      title: 'Mutual Funds',
      description: 'Goal-based diversified mutual fund investments with automated tax-harvesting and zero commission direct plans.',
      icon: PieChart,
      perf: '+14.8% p.a.',
      perfColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-400/30',
      widgetType: 'chart',
    },
    {
      title: 'Stocks & Equity',
      description: 'Invest in high-conviction Indian equity portfolios powered by Solahana quantitative AI risk models.',
      icon: TrendingUp,
      perf: '+22.4% YoY',
      perfColor: 'text-[#5A7FD6] bg-[#2F5BC7]/20 border-[#2F5BC7]/40',
      widgetType: 'sparkline',
    },
    {
      title: 'SIP Investments',
      description: 'Automate monthly investments with intelligent step-up compounding tailored to your long-term FIRE target.',
      icon: Repeat,
      perf: '100% Active',
      perfColor: 'text-blue-400 bg-blue-500/20 border-blue-400/30',
      widgetType: 'sip',
    },
    {
      title: 'Gold Investments',
      description: 'Digital Gold and Sovereign Gold Bonds (SGB) for capital preservation, tax-free redemption, and inflation defense.',
      icon: Coins,
      perf: '+11.2% Yield',
      perfColor: 'text-[#5A7FD6] bg-[#2F5BC7]/20 border-[#2F5BC7]/40',
      widgetType: 'gold',
    },
    {
      title: 'Bonds & Fixed Income',
      description: 'Low-risk investments offering stable predictable returns through AAA corporate bonds and government securities.',
      icon: ShieldCheck,
      perf: '8.5% - 10.5% p.a.',
      perfColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-400/30',
      widgetType: 'bonds',
    },
    {
      title: 'International Wealth',
      description: 'Diversify globally into Apple, Microsoft, Nvidia & S&P 500 tech indexes with seamless USD remittance.',
      icon: Globe,
      perf: '+28.6% 3Y',
      perfColor: 'text-purple-400 bg-purple-500/20 border-purple-400/30',
      widgetType: 'global',
    },
  ];

  return (
    <section className="relative z-10 py-24 bg-[#FFFFFF] border-t border-[#2F5BC7]/15 overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#2F5BC7]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-blue-900/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full gold-badge text-xs font-semibold text-[#F7F8FB]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6]" />
            <span className="font-sora tracking-wide uppercase text-[10px]">Multi-Asset Portfolio</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#F7F8FB] tracking-tight leading-tight"
          >
            Everything You Can Invest In —{' '}
            <span className="gold-gradient-text italic font-serif-luxury">Powered by AI</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5B6B84] font-inter leading-relaxed"
          >
            Diversify your wealth across intelligent investment categories tailored to your risk tolerance and return objectives.
          </motion.p>
        </div>


        {/* 6 LARGE INTERACTIVE CARDS (Desktop: 3 cols, Tablet: 2 cols, Mobile: Swipeable snap-scroll) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {categories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-[28px] p-7 sm:p-8 bg-[#F7F8FB]/60 hover:bg-[#F7F8FB]/95 border border-[#2F5BC7]/20 hover:border-[#2F5BC7]/60 backdrop-blur-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(2,11,45,0.9),0_0_25px_rgba(26,49,112,0.2)]"
              >
                {/* Background Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5A7FD6]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Top Row: Circular Gold Icon + Green/Gold Perf Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5A7FD6]/20 via-[#2F5BC7]/15 to-[#F7F8FB] border border-[#2F5BC7]/35 flex items-center justify-center text-[#5A7FD6] shadow-[0_0_15px_rgba(26,49,112,0.2)] group-hover:rotate-6 transition-transform duration-300">
                      <IconComp className="w-7 h-7" />
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-num border ${cat.perfColor}`}>
                      {cat.perf}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-serif-luxury font-bold text-[#F7F8FB] group-hover:text-[#5A7FD6] transition-colors duration-300 mb-3">
                    {cat.title}
                  </h3>

                  <p className="text-sm text-[#5B6B84] font-inter leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  {/* Visual Mini Widget / Sparkline Graph */}
                  <div className="p-3.5 rounded-xl bg-[#FFFFFF]/70 border border-[#2F5BC7]/15 mb-6 flex items-center justify-between">
                    {cat.widgetType === 'chart' && (
                      <div className="w-full flex items-center justify-between text-xs font-num">
                        <span className="text-[#5B6B84]">Equity/Debt Split</span>
                        <div className="flex items-center space-x-1">
                          <span className="w-16 h-2 rounded-full bg-emerald-400 inline-block" />
                          <span className="text-emerald-400 font-bold">75:25</span>
                        </div>
                      </div>
                    )}
                    {cat.widgetType === 'sparkline' && (
                      <div className="w-full flex items-center justify-between text-xs font-num">
                        <span className="text-[#5B6B84]">Nifty 50 Alpha</span>
                        <svg className="w-24 h-6 stroke-[#5A7FD6] fill-none stroke-2" viewBox="0 0 100 30">
                          <path d="M0 25 Q 25 15, 50 18 T 100 5" />
                        </svg>
                      </div>
                    )}
                    {cat.widgetType === 'sip' && (
                      <div className="w-full flex items-center justify-between text-xs font-num">
                        <span className="text-[#5B6B84]">Auto SIP ₹50k/mo</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">Compounding</span>
                      </div>
                    )}
                    {cat.widgetType === 'gold' && (
                      <div className="w-full flex items-center justify-between text-xs font-num">
                        <span className="text-[#5B6B84]">SGB 2.5% Interest</span>
                        <span className="text-[#5A7FD6] font-bold">+ Capital Growth</span>
                      </div>
                    )}
                    {cat.widgetType === 'bonds' && (
                      <div className="w-full flex items-center justify-between text-xs font-num">
                        <span className="text-[#5B6B84]">AAA Rated Corporate</span>
                        <span className="text-emerald-400 font-bold">Quarterly Payout</span>
                      </div>
                    )}
                    {cat.widgetType === 'global' && (
                      <div className="w-full flex items-center justify-between text-xs font-num">
                        <span className="text-[#5B6B84]">Apple • Nvidia • MSFT</span>
                        <span className="text-purple-300 font-bold">USD Assets</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: Learn More Arrow */}
                <div className="pt-4 border-t border-[#2F5BC7]/15 flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-[#5A7FD6] group-hover:text-[#2F5BC7] transition-colors">
                    Explore Category
                  </span>

                  <div className="w-8 h-8 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 flex items-center justify-center text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] group-hover:translate-x-1.5 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>


        {/* ========================================== */}
        {/* MINI CTA BANNER                            */}
        {/* ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[32px] p-8 sm:p-12 bg-gradient-to-r from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/40 backdrop-blur-2xl text-center space-y-6 shadow-[0_25px_70px_rgba(2,11,45,0.9),0_0_35px_rgba(26,49,112,0.25)] overflow-hidden"
        >
          {/* Inner Light Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#2F5BC7]/15 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h3 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#F7F8FB] tracking-tight">
              Build a Portfolio Designed Around Your Goals.
            </h3>

            <p className="text-sm sm:text-base text-[#5B6B84] font-inter">
              Tell us your goals and comfort with risk, and an advisor builds a multi-asset portfolio around them.
            </p>

            <div className="pt-2 flex justify-center">
              <Link
                to="/investments"
                className="gold-glow-button px-9 py-4 rounded-full text-sm font-bold text-[#0F1F45] tracking-wide flex items-center space-x-3 shadow-[0_10px_35px_rgba(26,49,112,0.45)] group"
              >
                <span>Explore Investment Plans</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>

    </section>
  );
}
