import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Mail, Phone, Clock, Calendar, Navigation, Globe } from 'lucide-react';

export const OfficeWorkingHours = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#F7F8FB]/60 via-[#F7F8FB] to-[#F7F8FB]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 mb-4"
          >
            <Building2 className="w-3.5 h-3.5 text-[#5A7FD6]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
              LOCATION & HOURS
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-playfair text-3xl md:text-5xl font-bold text-[#0F1F45] mb-6 leading-tight"
          >
            We're Here When You{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
              Need Us.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#5B6B84] text-base md:text-lg font-light leading-relaxed"
          >
            Visit our corporate headquarters in Mumbai or schedule a digital planning session from anywhere in the world.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Luxury Office Info Cards */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-[#F7F8FB]/90 via-[#F7F8FB]/95 to-[#F7F8FB] border border-[#E4E8F0] shadow-2xl backdrop-blur-2xl text-left space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2F5BC7]/15 border border-[#2F5BC7]/30 flex items-center justify-center text-[#5A7FD6]">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#5A7FD6] uppercase tracking-wider">Corporate Headquarters</span>
                  <h3 className="font-playfair text-2xl font-bold text-[#0F1F45]">Mumbai, India</h3>
                </div>
              </div>

              <div className="space-y-4 pt-2 border-t border-[#E4E8F0] text-sm text-[#334155]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#0F1F45] block">SOLAHANA Financial Planning</span>
                    <span className="text-[#5B6B84] font-light">Off Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2F5BC7] shrink-0" />
                  <div>
                    <span className="text-[#5B6B84] font-light">Email: </span>
                    <a href="mailto:info@solahana.com" className="text-[#0F1F45] hover:text-[#5A7FD6] transition-colors font-medium">info@solahana.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-[#5B6B84] font-light">Phone / WhatsApp: </span>
                    <a href="tel:+917304442171" className="text-[#0F1F45] hover:text-[#5A7FD6] transition-colors font-medium">+91 73044 42171</a>
                    <a href="tel:+917021295187" className="text-[#334155] hover:text-[#5A7FD6] transition-colors font-medium text-xs">+91 70212 95187</a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Working Hours Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-[#F7F8FB]/90 via-[#F7F8FB]/95 to-[#F7F8FB] border border-[#E4E8F0] shadow-2xl backdrop-blur-2xl text-left"
            >
              <h4 className="font-playfair text-xl font-bold text-[#0F1F45] mb-6 flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#5A7FD6]" />
                <span>Working Hours & Support</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-[#F7F8FB] border border-[#E4E8F0] space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#5A7FD6] font-mono uppercase">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Working Days</span>
                  </div>
                  <div className="text-base font-semibold text-[#0F1F45]">Monday – Saturday</div>
                  <div className="text-xs text-[#5B6B84] font-light">9:30 AM – 6:30 PM IST</div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FB] border border-[#E4E8F0] space-y-1">
                  <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono uppercase">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Client Support Desk</span>
                  </div>
                  <div className="text-base font-semibold text-[#0F1F45]">24/7 Digital Portal</div>
                  <div className="text-xs text-[#5B6B84] font-light">Always Accessible</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Premium Dark Map Placeholder Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-[#2F5BC7]/30 shadow-2xl bg-[#F7F8FB] flex flex-col min-h-[420px]"
          >
            {/* Map visual background graphics */}
            <div className="absolute inset-0 bg-[#FFFFFF] opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(#2F5BC7_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            
            {/* Map grid lines overlay */}
            <svg className="absolute inset-0 w-full h-full stroke-white/5" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Glowing Map Pin Centerpiece */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
              {/* Pin pulse ring */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-[#2F5BC7]/30 animate-ping" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5A7FD6] via-[#1A3170] to-[#1A3170] p-[2px] shadow-[0_0_30px_rgba(26,49,112,0.6)] relative z-10 flex items-center justify-center">
                  <div className="w-full h-full bg-[#FFFFFF] rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-[#5A7FD6]" />
                  </div>
                </div>
              </div>

              <h4 className="font-playfair text-2xl font-bold text-[#0F1F45] mb-2">
                Andheri West Office, Mumbai
              </h4>
              <p className="text-[#5B6B84] text-sm font-light max-w-sm mb-6">
                Off Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053
              </p>

              <button
                type="button"
                onClick={() => window.open('https://maps.google.com/?q=Off+Veera+Desai+Road+Andheri+West+Mumbai+Maharashtra+400053', '_blank')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1A3170] via-[#1A3170] to-[#1A3170] text-white font-bold text-sm shadow-lg shadow-[#2F5BC7]/25 hover:shadow-xl hover:shadow-[#2F5BC7]/40 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-[#0F1F45] group-hover:rotate-45 transition-transform" />
                <span>Get Directions</span>
              </button>
            </div>

            <div className="relative z-10 p-4 bg-[#FFFFFF]/90 border-t border-[#E4E8F0] text-xs text-[#5B6B84] text-center font-mono">
              Off Veera Desai Road, Andheri West, Mumbai 400053 • SOLAHANA
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
