import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, FileText, CheckCircle2 } from 'lucide-react';

export default function ConsultationProcess() {
  const steps = [
    {
      number: '01',
      title: 'Book Confidential Slot',
      desc: 'Select your preferred date & time for a 1-on-1 discovery call with a SEBI Registered Advisor.',
      icon: Calendar,
    },
    {
      number: '02',
      title: 'Interactive Video Session',
      desc: 'Discuss your salary, liabilities, life goals, and tax concerns in a private, 45-minute consultation.',
      icon: Video,
    },
    {
      number: '03',
      title: 'Receive Custom Blueprint',
      desc: 'Get your comprehensive, 30+ page written Financial Strategy with step-by-step execution items.',
      icon: FileText,
    },
    {
      number: '04',
      title: 'Direct Implementation & Review',
      desc: 'Execute zero-commission direct investments with annual portfolio rebalancing reviews.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF] border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <Calendar className="w-3.5 h-3.5" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Planning Consultation Process
          </h2>
          <p className="text-base text-[#475569] font-inter">
            Simple, transparent onboarding to launch your fiduciary wealth relationship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => {
            const IconComp = st.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-sm transition-all duration-300 text-left flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors flex items-center justify-center">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-sora font-bold text-[#2F5BC7]">
                      {st.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#475569] font-inter leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
