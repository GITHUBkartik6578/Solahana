import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Mail, Phone, Clock, Calendar, Navigation, Globe } from 'lucide-react';

export default function AboutOfficeLocation() {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden border-t border-[#E4E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-semibold">
            LOCATION &amp; HOURS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Office Location &amp; Working Hours
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Drop by our Mumbai office, or talk to us online from anywhere in the world.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Headquarters Details & Working Hours */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between text-left">
            
            {/* Headquarters Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-7 sm:p-8 rounded-3xl bg-[#F7F8FB] border border-[#E4E8F0] shadow-lg space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#2F5BC7]/40 text-[#2F5BC7] flex items-center justify-center shadow-xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono text-[#2F5BC7] uppercase tracking-wider font-semibold">Our Office</span>
                  <h3 className="font-serif-luxury text-2xl font-bold text-[#0F1F45]">Mumbai, India</h3>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#E4E8F0]/60 text-sm text-[#475569]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#0F1F45] block">SOLAHANA Financial Planning</span>
                    <span className="text-xs sm:text-sm">Off Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2F5BC7] shrink-0" />
                  <div>
                    <span className="font-medium text-[#64748B]">Email: </span>
                    <a href="mailto:info@solahana.com" className="text-[#0F1F45] hover:text-[#2F5BC7] transition-colors font-bold">info@solahana.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#2F5BC7] shrink-0 mt-0.5" />
                  <div className="flex flex-col space-y-0.5">
                    <span className="font-medium text-[#64748B]">Phone / WhatsApp: </span>
                    <a href="tel:+917304442171" className="text-[#0F1F45] hover:text-[#2F5BC7] transition-colors font-bold">+91 73044 42171</a>
                    <a href="tel:+917021295187" className="text-[#0F1F45]/80 hover:text-[#2F5BC7] transition-colors font-semibold text-xs">+91 70212 95187</a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Working Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-7 sm:p-8 rounded-3xl bg-[#F7F8FB] border border-[#E4E8F0] shadow-lg text-left"
            >
              <h4 className="font-serif-luxury text-xl font-bold text-[#0F1F45] mb-5 flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#2F5BC7]" />
                <span>Working Hours &amp; Support</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-[#E4E8F0] space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#2F5BC7] font-mono uppercase font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Working Days</span>
                  </div>
                  <div className="text-sm font-bold text-[#0F1F45]">Monday – Saturday</div>
                  <div className="text-xs text-[#64748B]">9:30 AM – 6:30 PM IST</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-500/30 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-mono uppercase font-semibold">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Client Portal</span>
                  </div>
                  <div className="text-sm font-bold text-[#0F1F45]">24/7 Digital Desk</div>
                  <div className="text-xs text-emerald-700 font-medium">Always Accessible</div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Google Maps Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative rounded-3xl overflow-hidden border border-[#E4E8F0] shadow-xl bg-[#F7F8FB] flex flex-col justify-between min-h-[420px]"
          >
            {/* Map Ambient Graphics */}
            <div className="absolute inset-0 bg-white opacity-80" />
            <div className="absolute inset-0 bg-[radial-gradient(#2F5BC7_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#F7F8FB] border-2 border-[#2F5BC7] shadow-lg flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#2F5BC7]" />
                </div>
              </div>

              <h4 className="font-serif-luxury text-2xl font-bold text-[#0F1F45] mb-2">
                Andheri West Office, Mumbai
              </h4>
              <p className="text-[#64748B] text-xs sm:text-sm max-w-sm mb-6 font-sans">
                Off Veera Desai Road, Andheri West, Mumbai, Maharashtra 400053, India
              </p>

              <button
                type="button"
                onClick={() => window.open('https://maps.google.com/?q=Off+Veera+Desai+Road+Andheri+West+Mumbai+Maharashtra+400053', '_blank')}
                className="btn-gold px-6 py-3.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-white" />
                <span>Get Directions on Google Maps</span>
              </button>
            </div>

            <div className="relative z-10 p-4 bg-white border-t border-[#E4E8F0] text-xs text-[#64748B] text-center font-mono">
              Andheri West, Mumbai 400053
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
