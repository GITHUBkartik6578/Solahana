import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react';

const contactOptions = [
  {
    id: 'schedule',
    icon: Calendar,
    title: 'Schedule a Consultation',
    description: 'Book a 1-on-1 private video or in-person session with a certified Solahana wealth advisor.',
    actionText: 'Book Appointment',
    href: '#book-form-section',
    badge: 'Recommended'
  },
  {
    id: 'phone',
    icon: Phone,
    title: 'Call Our Planning Team',
    description: 'Speak directly with our senior financial planners: +91 73044 42171 or +91 70212 95187.',
    actionText: 'Call Now',
    href: 'tel:+917304442171',
    badge: 'Direct Line'
  },
  {
    id: 'email',
    icon: Mail,
    title: 'Email Us',
    description: 'Send us detailed questions or documents to info@solahana.com. We respond within 24 hours.',
    actionText: 'Send Email',
    href: 'mailto:info@solahana.com',
    badge: '24h Response'
  },
  {
    id: 'whatsapp',
    icon: MessageSquare,
    title: 'WhatsApp Support',
    description: 'Quick chat assistance at +91 73044 42171 for instant appointment and planning support.',
    actionText: 'Chat on WhatsApp',
    href: 'https://wa.me/917304442171',
    badge: 'Instant Chat'
  }
];

export const ContactOptionsGrid = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-[#FFFFFF]">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#2F5BC7]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A3170]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
              CHOOSE HOW TO CONNECT
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-5xl font-bold text-[#0F1F45] mb-6 leading-tight"
          >
            Connect With SOLAHANA{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
              Your Way.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#5B6B84] text-base md:text-lg font-light leading-relaxed"
          >
            Select your preferred communication channel to initiate your personalized wealth planning conversation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactOptions.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative p-8 rounded-3xl bg-gradient-to-b from-[#F7F8FB]/80 via-[#F7F8FB]/90 to-[#F7F8FB] border border-[#E4E8F0] hover:border-[#2F5BC7]/40 shadow-2xl backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Gold glow overlay on hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#2F5BC7]/0 via-[#2F5BC7]/0 to-[#2F5BC7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 flex items-center justify-center group-hover:bg-[#1A3170] transition-colors duration-300">
                      <Icon className="w-7 h-7 text-[#5A7FD6] group-hover:text-[#0F1F45] transition-colors duration-300" />
                    </div>

                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#F7F8FB] border border-[#E4E8F0] text-[#5A7FD6]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-playfair text-xl font-bold text-[#0F1F45] mb-3 group-hover:text-[#5A7FD6] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-[#5B6B84] text-sm leading-relaxed font-light mb-8">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.href}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] group-hover:bg-[#1A3170] group-hover:border-[#2F5BC7] text-[#0F1F45] group-hover:text-[#0F1F45] font-medium text-sm transition-all duration-300 flex items-center justify-between"
                >
                  <span>{item.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
