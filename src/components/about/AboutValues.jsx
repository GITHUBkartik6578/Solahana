import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, Hourglass, Feather, UserCheck, RefreshCw, Star } from 'lucide-react';

export default function AboutValues() {
  const values = [
    {
      title: 'Transparency',
      description: 'You always know what you’re paying for, and why.',
      icon: ShieldCheck,
      badge: 'Your Interest First'
    },
    {
      title: 'Trust',
      description: 'We recommend what’s right for your family, even when it’s the simpler option.',
      icon: HeartHandshake,
      badge: 'Always'
    },
    {
      title: 'Long-Term Thinking',
      description: 'We plan for decades, not for this week’s market headlines.',
      icon: Hourglass,
      badge: 'Patience pays'
    },
    {
      title: 'Simplicity',
      description: 'We explain money in plain language, so you always understand your own plan.',
      icon: Feather,
      badge: 'Clear & Intuitive'
    },
    {
      title: 'Personal Guidance',
      description: 'A plan shaped around your family, your goals and your comfort with risk.',
      icon: UserCheck,
      badge: 'Real people'
    },
    {
      title: 'Continuous Review',
      description: 'We check in regularly and adjust when life or markets change.',
      icon: RefreshCw,
      badge: 'Always On Track'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-[#EEF2FB] border-t border-[#2F5BC7]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full gold-badge text-[#1A3170] text-xs font-semibold uppercase tracking-widest font-sora">
            <Star className="w-3.5 h-3.5 text-[#C9A04F]" />
            <span>WHAT WE STAND FOR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            Our Guiding Values
          </h2>

          <p className="text-base sm:text-lg text-[#475569] font-inter">
            Six simple promises that guide every plan we make.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-3xl bg-white border border-[#2F5BC7]/20 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] backdrop-blur-xl shadow-md transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-sora font-semibold text-[#1A3170] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/20">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-serif-luxury font-bold text-[#0F1F45]">
                  {item.title}
                </h3>

                <p className="text-sm text-[#475569] font-inter leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
