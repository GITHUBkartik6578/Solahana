import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Mail, Calendar, ArrowRight } from 'lucide-react';

export default function AboutConnectOptions() {
  const scrollToConsultation = () => {
    const el = document.getElementById('global-consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const connectOptions = [
    {
      id: 'phone',
      icon: Phone,
      title: 'Call Us',
      description: 'Talk to our team directly: +91 73044 42171 / +91 70212 95187.',
      actionText: 'Call Now',
      href: 'tel:+917304442171',
    },
    {
      id: 'whatsapp',
      icon: MessageSquare,
      title: 'WhatsApp',
      description: 'Message us on +91 73044 42171 to book a call or ask a quick question.',
      actionText: 'Chat on WhatsApp',
      href: 'https://wa.me/917304442171',
      target: '_blank',
    },
    {
      id: 'email',
      icon: Mail,
      title: 'Email Us',
      description: 'Write to info@solahana.com and we’ll reply within 24 hours.',
      actionText: 'Send Email',
      href: 'mailto:info@solahana.com',
    },
    {
      id: 'consultation',
      icon: Calendar,
      title: 'Book a Consultation',
      description: 'Book a free 1-on-1 session with one of our financial planners.',
      actionText: 'Book Appointment',
      onClick: scrollToConsultation,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            CHOOSE HOW TO CONNECT
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Connect With SOLAHANA
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Pick whatever’s easiest for you. We’re happy to talk.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {connectOptions.map((opt, idx) => {
            const Icon = opt.icon;
            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E4E8F0] shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F8FB] border border-[#2F5BC7]/40 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white flex items-center justify-center mb-5 transition-colors shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-serif-luxury font-bold text-[#0F1F45] mb-2 group-hover:text-[#2F5BC7] transition-colors">
                    {opt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2 mb-6">
                    {opt.description}
                  </p>
                </div>

                {opt.onClick ? (
                  <button
                    onClick={opt.onClick}
                    className="w-full py-3 px-4 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] group-hover:bg-[#1A3170] group-hover:border-[#2F5BC7] text-[#0F1F45] group-hover:text-white font-semibold text-xs transition-all duration-300 flex items-center justify-between cursor-pointer"
                  >
                    <span>{opt.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <a
                    href={opt.href}
                    target={opt.target}
                    rel={opt.target ? 'noopener noreferrer' : undefined}
                    className="w-full py-3 px-4 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] group-hover:bg-[#1A3170] group-hover:border-[#2F5BC7] text-[#0F1F45] group-hover:text-white font-semibold text-xs transition-all duration-300 flex items-center justify-between"
                  >
                    <span>{opt.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
