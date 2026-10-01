import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calculator, 
  ShieldCheck, 
  HeartHandshake, 
  RefreshCcw, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SolahanaServices() {
  const services = [
    {
      title: 'Financial Planning',
      desc: 'One clear plan for your salary, savings, insurance and goals, so every rupee has a job.',
      icon: Target,
      highlight: '360° Life Roadmap',
    },
    {
      title: 'Investment Planning',
      desc: 'Mutual funds and other investments picked for your goals and risk comfort, not for what’s trending.',
      icon: TrendingUp,
      highlight: 'Goal-based investing',
    },
    {
      title: 'Tax Planning',
      desc: 'Plan your taxes early under 80C, 80D and NPS, and keep more of what you earn.',
      icon: Calculator,
      highlight: 'Old vs new regime',
    },
    {
      title: 'Retirement Planning',
      desc: 'Know your retirement number and build a steady monthly income for life after work.',
      icon: ShieldCheck,
      highlight: 'Income after 60',
    },
    {
      title: 'Insurance Planning',
      desc: 'Health and term cover that actually fits your family, without overpaying for policies you don’t need.',
      icon: HeartHandshake,
      highlight: 'Right-sized cover',
    },
    {
      title: 'Wealth Review',
      desc: 'A yearly check-up of your plan, so it keeps pace with your salary, your family and your goals.',
      icon: RefreshCcw,
      highlight: 'Every year',
    },
  ];

  return (
    <section className="relative z-10 py-8 sm:py-10 lg:py-12 bg-[#F7F8FB] border-t border-[#2F5BC7]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto mb-5 sm:mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#1A3170] border border-[#2F5BC7]/35 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A04F] animate-pulse" />
            <span className="font-sora tracking-wide uppercase text-[11px]">WHAT WE DO</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight leading-[1.2]"
          >
            Everything Your Money Needs,{' '}
            <span className="gold-gradient-text italic font-serif-luxury">
              In One
            </span>{' '}
            Place.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed line-clamp-2"
          >
            Six services, one team that sees your whole financial picture, so nothing falls through the cracks.
          </motion.p>
        </div>

        {/* Grid of 6 Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group p-8 rounded-3xl bg-white border border-[#2F5BC7]/20 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] backdrop-blur-xl transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-sm">
                      <IconComp className="w-7 h-7" />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#F7F8FB] text-[#1A3170] font-sora font-semibold text-[10px] uppercase tracking-wider border border-[#2F5BC7]/20">
                      {service.highlight}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-sm text-[#475569] font-inter leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#2F5BC7]/15 flex items-center justify-between">
                  <Link
                    to="/contact"
                    className="text-xs font-semibold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors flex items-center space-x-2"
                  >
                    <span>Book a Free Call</span>
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
