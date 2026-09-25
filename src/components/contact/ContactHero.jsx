import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, PhoneCall, CheckCircle2, ShieldCheck, MapPin, Clock, Mail } from 'lucide-react';

export const ContactHero = () => {
  const scrollToForm = (e) => {
    e.preventDefault();
    const elem = document.getElementById('book-form-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-[#F7F8FB] overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5BC7]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-badge text-[#1A3170] border border-[#2F5BC7]/30"
            >
              <Calendar className="w-3.5 h-3.5 text-[#2F5BC7]" />
              <span className="text-xs font-semibold uppercase tracking-widest">
                BOOK A CONSULTATION
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F45] leading-[1.15]"
            >
              Let's Start Planning Your{' '}
              <span className="gold-gradient-text italic font-serif-luxury">
                Financial Future.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#475569] text-lg sm:text-xl font-normal leading-relaxed max-w-2xl"
            >
              Whether you're planning your first investment, buying a home or preparing for retirement, we're here to help you build a thoughtful financial roadmap.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <button
                onClick={scrollToForm}
                className="gold-glow-button px-8 py-4 rounded-full text-sm font-bold text-white tracking-wide flex items-center justify-center space-x-2.5 shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule 1-on-1 Session</span>
              </button>

              <a
                href="https://wa.me/917304442171"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-4 rounded-full text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </motion.div>

            {/* Quick Location & Details Strip */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#2F5BC7]/20 max-w-xl text-xs text-[#0F1F45]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2F5BC7]" />
                <span>Off Veera Desai Road, Andheri West, Mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2F5BC7]" />
                <span>Mon - Sat: 10:00am - 7:00pm</span>
              </div>
            </div>
          </div>

          {/* Right Column — Office Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="rounded-3xl p-8 bg-white border border-[#2F5BC7]/30 shadow-xl space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-[#2F5BC7] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif-luxury font-bold text-[#0F1F45]">
                SOLAHANA Planning Office
              </h3>
              <p className="text-sm text-[#475569] font-inter leading-relaxed">
                Visit our office or schedule a private virtual video consultation with a certified SEBI Registered RIA advisor.
              </p>
              <div className="space-y-2 text-xs text-[#0F1F45]">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#2F5BC7]" />
                  <span>+91 73044 42171 / +91 70212 95187</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#2F5BC7]" />
                  <span>info@solahana.com</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
