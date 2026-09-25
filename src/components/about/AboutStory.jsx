import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Milestone, RefreshCw, Layers } from 'lucide-react';

export default function AboutStory() {
  const storySteps = [
    {
      step: '01',
      title: 'Understanding Finances',
      subtitle: 'Seeing everything you have, in one place',
      description: 'Your FDs, mutual funds, insurance and loans, pulled together into one simple picture.',
      icon: Layers,
      highlight: 'From scattered to sorted'
    },
    {
      step: '02',
      title: 'Building a Roadmap',
      subtitle: 'Turning dreams into goals with real numbers',
      description: 'Every rupee gets a purpose: retirement, education, a home, or simply peace of mind.',
      icon: Milestone,
      highlight: 'Goals First, Products Second'
    },
    {
      step: '03',
      title: 'Planning Consistently',
      subtitle: 'Investing steadily, month after month',
      description: 'Regular SIPs that grow with your income, with risk kept in check.',
      icon: CheckCircle2,
      highlight: 'Consistency over timing the market'
    },
    {
      step: '04',
      title: 'Reviewing Regularly',
      subtitle: 'Updating your plan as life changes',
      description: 'Yearly reviews so your plan keeps up with your salary, career and family.',
      icon: RefreshCw,
      highlight: 'We stay with you'
    }
  ];

  return (
    <section id="our-story" className="py-12 sm:py-16 lg:py-20 relative overflow-hidden bg-[#EEF2FB] border-y border-[#2F5BC7]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full gold-badge text-[#1A3170] text-xs font-semibold uppercase tracking-widest font-sora">
            <BookOpen className="w-3.5 h-3.5 text-[#2F5BC7]" />
            <span>OUR STORY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight">
            Why SOLAHANA Was Created
          </h2>

          <p className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed line-clamp-2">
            SOLAHANA was created on a simple principle: <span className="text-[#1A3170] font-semibold">Money should be organized around your life goals, not financial products.</span>
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {storySteps.map((step, index) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-3xl bg-white border border-[#2F5BC7]/20 hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] backdrop-blur-xl shadow-md transition-all space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] flex items-center justify-center font-bold">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-sora font-bold text-[#2F5BC7]">
                    STAGE {step.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#1A3170] font-sora mt-1 font-medium">
                    {step.subtitle}
                  </p>
                </div>

                <p className="text-sm text-[#475569] font-inter leading-relaxed">
                  {step.description}
                </p>

                <div className="pt-4 border-t border-[#2F5BC7]/15 text-xs text-[#0F1F45] font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1A3170]" />
                  <span>{step.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
