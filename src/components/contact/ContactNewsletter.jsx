import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const ContactNewsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#FFFFFF]">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden p-8 md:p-16 bg-gradient-to-b from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/30 shadow-2xl text-center"
        >
          {/* Soft golden glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/15 border border-[#2F5BC7]/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
                WEEKLY INSIGHTS
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-playfair text-3xl md:text-5xl font-bold text-[#0F1F45] leading-tight"
            >
              Stay Updated With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
                Financial Insights.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#334155] text-base md:text-lg font-light leading-relaxed"
            >
              Receive simple financial planning tips, goal planning guides and educational articles delivered straight to your inbox every Sunday morning.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="pt-4 flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
            >
              <div className="relative flex-1 w-full">
                <Mail className="w-5 h-5 text-[#5B6B84] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-4 pl-12 pr-4 text-[#0F1F45] text-sm placeholder-[#94A3B8] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1A3170] via-[#1A3170] to-[#1A3170] text-white font-bold text-sm shadow-lg shadow-[#2F5BC7]/25 hover:shadow-xl hover:shadow-[#2F5BC7]/40 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span>{subscribed ? 'Subscribed ✓' : 'Subscribe'}</span>
                {!subscribed && <ArrowRight className="w-4 h-4 text-[#0F1F45]" />}
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-xs text-[#5B6B84] pt-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F5BC7]" />
              <span>We respect your privacy. Zero spam. Unsubscribe anytime with 1 click.</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
