import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, ClipboardList, Search, FileText } from 'lucide-react';

const DAYS = [
  {
    when: 'Day 0',
    icon: PhoneCall,
    title: 'A 20-minute call',
    desc: 'You tell us what’s bothering you. We tell you honestly whether we can help. Nothing is sold on this call.',
  },
  {
    when: 'Day 2–3',
    icon: ClipboardList,
    title: 'You share the picture',
    desc: 'Income, spends, loans, policies and investments. A simple checklist, and we help you fill it, not a 40-page form.',
  },
  {
    when: 'Week 1',
    icon: Search,
    title: 'We find the gaps',
    desc: 'We go through everything and list what’s working, what’s missing and what’s costing you money quietly.',
  },
  {
    when: 'Week 2',
    icon: FileText,
    title: 'Your plan, in writing',
    desc: 'We walk you through it line by line, answer everything, and agree the first three actions to start with.',
  },
];

export default function FirstThirtyDays() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
            What happens next
          </span>
          <h2 className="mt-5 text-[30px] sm:text-[40px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
            Your first two weeks with us, <span className="gold-gradient-text" style={{ display: 'inline' }}>step by step.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">
            No mystery, no chasing. You always know what’s happening and what we need from you.
          </p>
        </div>

        <div className="relative">
          {/* connecting line on desktop */}
          <div className="hidden lg:block absolute top-[38px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#E4E8F0] via-[#CBD6EE] to-[#E4E8F0]" />

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {DAYS.map(({ when, icon: Icon, title, desc }, i) => (
              <motion.li
                key={when}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative text-center lg:px-2"
              >
                <span className="relative z-10 mx-auto w-[76px] h-[76px] rounded-full bg-white border-2 border-[#E4E8F0] shadow-[0_8px_20px_rgba(15,31,69,0.08)] flex items-center justify-center text-[#1A3170]">
                  <Icon className="w-7 h-7" strokeWidth={1.75} />
                  <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1A3170] text-white text-[11px] font-bold flex items-center justify-center ring-4 ring-white">
                    {i + 1}
                  </span>
                </span>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A04F]">{when}</p>
                <h3 className="mt-2 text-lg font-bold text-[#0F1F45]">{title}</h3>
                <p className="mt-2 text-sm text-[#475569] leading-relaxed">{desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
