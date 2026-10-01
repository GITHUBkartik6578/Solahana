import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Globe, Rocket, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WhoWeServe() {
  const audienceCards = [
    {
      title: 'Salaried Professionals',
      subtitle: 'Corporate Executives, IT Leaders & Doctors',
      description: 'Optimize take-home salary with smart Section 80C/80D tax planning, monthly SIP compounding, emergency fund creation, and early retirement planning.',
      icon: Briefcase,
      highlights: ['Salary & Tax Optimization', 'Automated Monthly SIPs', 'Emergency Reserve Planning'],
      tag: 'Most Popular',
    },
    {
      title: 'Business Owners',
      subtitle: 'Founders, Entrepreneurs & Family Businesses',
      description: 'Turn business profits into liquid personal wealth. Structure treasury yields, tax-efficient capital extraction, and multi-generational family wealth transfer.',
      icon: Building2,
      highlights: ['Treasury Liquidity Management', 'Tax-Efficient Capital Extraction', 'Succession & Estate Planning'],
      tag: 'High Yield',
    },
    {
      title: 'NRI Families',
      subtitle: 'Global Indians in USA, Gulf, UK & Singapore',
      description: 'Cross-border wealth management with FEMA compliance, NRE/NRO account rules, DTAA tax relief, and high-quality Indian growth opportunities.',
      icon: Globe,
      highlights: ['FEMA & NRE/NRO Compliance', 'DTAA Double Tax Relief Desk', 'Seamless Repatriation Access'],
      tag: 'Global Wealth',
    },
    {
      title: 'Young Professionals',
      subtitle: 'Early Career Engineers & Tech Creators',
      description: 'Start early and harness the power of compounding. Build goal-based portfolios for higher education, travel, home purchase, and long-term financial independence.',
      icon: Rocket,
      highlights: ['Goal-Based Wealth Roadmap', 'Disciplined Monthly Compounding', 'Low-Cost Index Portfolios'],
      tag: 'Early Career',
    },
  ];

  return (
    <section className="relative z-10 py-24 bg-[#FAF8F5] border-t border-[#C89A4B]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#9A7326] border border-[#C89A4B]/35 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C89A4B]" />
            <span className="font-sora tracking-wide uppercase text-[11px]">TAILORED PLANNING DESK</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F172A] tracking-tight leading-tight"
          >
            Who We{' '}
            <span className="gold-gradient-text italic font-serif-luxury">Serve</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed"
          >
            Custom financial planning frameworks tailored to your career stage and financial goals.
          </motion.p>
        </div>

        {/* 4 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {audienceCards.map((card, idx) => {
            const IconComp = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group p-8 rounded-3xl bg-white border border-[#C89A4B]/20 hover:border-[#C89A4B] backdrop-blur-xl transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#C89A4B]/10 border border-[#C89A4B]/30 text-[#C89A4B] group-hover:bg-[#C89A4B] group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#FAF8F5] text-[#9A7326] font-sora font-semibold text-[10px] uppercase tracking-wider border border-[#C89A4B]/20">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif-luxury font-bold text-[#0F172A] group-hover:text-[#C89A4B] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#9A7326] font-sora font-medium mt-1">
                      {card.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-[#475569] font-inter leading-relaxed">
                    {card.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {card.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2 text-xs text-[#0F172A] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C89A4B]" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#C89A4B]/15 flex items-center justify-between">
                  <Link
                    to="/contact"
                    className="text-xs font-semibold text-[#0F172A] group-hover:text-[#C89A4B] transition-colors flex items-center space-x-2"
                  >
                    <span>Start Your Comprehensive Plan</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
