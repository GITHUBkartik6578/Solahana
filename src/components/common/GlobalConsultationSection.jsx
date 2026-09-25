import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Send, 
  Loader2,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import consultationService from '../../services/consultationService';
import solahanaLogo from '../../assets/solahana-logo.png';

const planningInterests = [
  'Financial Planning',
  'Retirement Planning',
  'Investment Planning',
  'Tax Planning',
  'Risk Management',
  'Estate Planning',
  'Custom Wealth Planning',
];

const timeSlots = [
  'Morning (9 AM - 12 PM)',
  'Afternoon (12 PM - 4 PM)',
  'Evening (4 PM - 8 PM)',
];

export default function GlobalConsultationSection() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: user ? user.phone : '',
    email: user ? user.email : '',
    city: user ? user.city : '',
    goal: 'Financial Planning',
    preferredTime: 'Morning (9 AM - 12 PM)',
    message: '',
    agreeTerms: true,
    subscribeWhatsapp: true,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  const isPhoneValid = /^[6-9][0-9]{9}$/.test(formData.phone.replace(/\D/g, ''));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: digitsOnly }));
    setPhoneTouched(true);
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPhoneTouched(true);
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!isPhoneValid) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMsg('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      await consultationService.bookConsultation({
        fullName: formData.fullName.trim(),
        phone: formData.phone,
        email: formData.email.trim(),
        city: formData.city.trim(),
        goal: formData.goal,
        preferredTime: formData.preferredTime,
        consultationMode: 'Phone Call',
        message: formData.message.trim(),
      });

      setSubmitted(true);
    } catch (err) {
      console.error('[Consultation Error]:', err);
      // A failed booking must never look like a success — the lead would silently vanish.
      setErrorMsg(
        "We couldn't send that just now. Please call or WhatsApp us on +91 73044 42171 and we'll book you in directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="global-consultation-section" className="relative py-10 sm:py-14 lg:py-16 bg-ink-band overflow-x-hidden font-inter">
      {/* Background Subtle Luxury Accents */}
      {/* faint grid texture for depth */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Golden-ratio split: 0.382fr (≈38.2%) : 0.618fr (≈61.8%) so the
            copy column and the form card sit in a true φ (1.618) proportion
            instead of the old 5/7 (12-col) approximation. items-start keeps
            both columns anchored to the same top line so the shorter copy
            column never gets vertically centered against the much taller
            form and "cut" the visual rhythm. */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.382fr_0.618fr] gap-8 lg:gap-12 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: HEADLINE, CONCISE COPY & FIDUCIARY HIGHLIGHTS */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-left lg:sticky lg:top-24 lg:self-start"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold uppercase tracking-widest text-[#E6C27A]">
              <Sparkles className="w-3.5 h-3.5 text-[#E6C27A]" />
              <span>SOLAHANA PLANNING</span>
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight">
              Schedule Your Free{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#EAD08F] via-[#D9B66A] to-[#C9A04F] font-serif-luxury">
                Wealth Consultation
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#AEBBD3] leading-relaxed font-normal">
              Tell us a little about yourself. An advisor will call, understand your situation and suggest clear next steps. No obligation.
            </p>

            {/* Key Fiduciary Features */}
            <div className="pt-2 space-y-3.5">
              {[
                { title: 'Private & Confidential', desc: 'Your details are used only to plan your call.', icon: ShieldCheck },
                { title: 'A Plan Made for You', desc: 'Goals, tax, insurance and investments, looked at together.', icon: TrendingUp },
                { title: 'Clear, Honest Advice', desc: 'Simple explanations, no pressure to buy anything.', icon: Award },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.05] border border-white/10">
                    <div className="p-2 rounded-xl bg-[#C9A04F]/15 text-[#E6C27A] ring-1 ring-[#C9A04F]/30 shrink-0 mt-0.5">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-[11px] sm:text-xs text-[#AEBBD3] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: LIGHT & SPACIOUS CONSULTATION FORM CARD     */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="min-w-0"
          >
            <div className="bg-white rounded-3xl p-5 sm:p-6 lg:p-7 border border-white/60 shadow-[0_30px_80px_rgba(3,10,30,0.45)] relative overflow-hidden max-w-[440px] w-full mx-auto lg:mx-0 lg:ml-auto">

              {/* Subtle Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E6C27A] via-[#C9A04F] to-[#A67C2E]" />

              {/* Prominent SOLAHANA Logo Header */}
              <div className="text-center mb-4">
                <img
                  src={solahanaLogo}
                  alt="SOLAHANA"
                  className="h-10 sm:h-11 w-auto mx-auto object-contain mb-2.5"
                />
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#0F1F45]">
                  Book Free Consultation
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  Takes less than a minute. We'll call you at the time you choose.
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#2F5BC7]/15 border-2 border-[#2F5BC7] flex items-center justify-center text-[#1A3170]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif-luxury text-2xl font-bold text-[#0F1F45]">
                    Consultation Request Received!
                  </h4>
                  <p className="text-xs sm:text-sm text-[#475569] max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong>{formData.fullName}</strong>. A dedicated SOLAHANA financial advisor will contact you at <strong>+91 {formData.phone}</strong> during your selected slot (<strong>{formData.preferredTime}</strong>).
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full border border-[#2F5BC7] text-xs font-bold text-[#1A3170] hover:bg-[#1A3170] hover:text-white transition-all cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5 text-left">
                  
                  {errorMsg && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* 1. Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1F45] mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#2F5BC7] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder="e.g. Ananya Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-slate-200 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/15 text-xs sm:text-sm outline-none bg-[#FFFFFF]/40 focus:bg-white text-[#0F1F45] transition-all"
                      />
                    </div>
                  </div>

                  {/* 2. Mobile Number (+91) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[#0F1F45]">
                        Mobile Number *
                      </label>
                      {phoneTouched && (
                        <span className={`text-[10px] font-mono ${isPhoneValid ? 'text-emerald-600 font-bold' : 'text-red-500'}`}>
                          {formData.phone.length}/10 digits
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-xs font-semibold text-[#0F1F45]">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onBlur={() => setPhoneTouched(true)}
                        className={`w-full px-3.5 py-2.5 pl-16 rounded-xl text-xs sm:text-sm outline-none bg-[#FFFFFF]/40 focus:bg-white text-[#0F1F45] transition-all border ${
                          phoneTouched
                            ? isPhoneValid
                              ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                              : 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-slate-200 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/15'
                        }`}
                      />
                    </div>
                  </div>

                  {/* 3. Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1F45] mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#2F5BC7] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="ananya@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-slate-200 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/15 text-xs sm:text-sm outline-none bg-[#FFFFFF]/40 focus:bg-white text-[#0F1F45] transition-all"
                      />
                    </div>
                  </div>

                  {/* 4. City & Planning Interest */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F1F45] mb-1.5">
                        City *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#2F5BC7] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          name="city"
                          required
                          placeholder="e.g. Mumbai"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-slate-200 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/15 text-xs sm:text-sm outline-none bg-[#FFFFFF]/40 focus:bg-white text-[#0F1F45] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#0F1F45] mb-1.5">
                        Planning Interest *
                      </label>
                      <select
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/15 text-xs sm:text-sm outline-none bg-[#FFFFFF]/40 focus:bg-white text-[#0F1F45] cursor-pointer transition-all"
                      >
                        {planningInterests.map(interest => (
                          <option key={interest} value={interest}>
                            {interest}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 5. Preferred Callback Time */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1F45] mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2F5BC7]" />
                      <span>Preferred Callback Time</span>
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/15 text-xs sm:text-sm outline-none bg-[#FFFFFF]/40 focus:bg-white text-[#0F1F45] cursor-pointer transition-all"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 6. Message (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-[#0F1F45] mb-1.5">
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      placeholder="Specify any questions regarding retirement, SIP, tax or investments..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/15 text-xs outline-none bg-[#FFFFFF]/40 focus:bg-white text-[#0F1F45] resize-none transition-all"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-1 text-[11px] text-[#475569]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="rounded border-[#2F5BC7] text-[#2F5BC7] focus:ring-[#2F5BC7]"
                      />
                      <span>I agree to the <a href="/contact" className="text-[#1A3170] underline font-medium">Terms & Conditions</a> and <a href="/contact" className="text-[#1A3170] underline font-medium">Privacy Policy</a></span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="subscribeWhatsapp"
                        checked={formData.subscribeWhatsapp}
                        onChange={handleChange}
                        className="rounded border-[#2F5BC7] text-[#2F5BC7] focus:ring-[#2F5BC7]"
                      />
                      <span className="flex items-center gap-1">
                        Subscribe me for <span className="text-emerald-600 font-semibold flex items-center gap-0.5">💬 WhatsApp</span> notifications
                      </span>
                    </label>
                  </div>

                  {/* Single Strong CTA Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="gold-glow-button w-full py-3.5 rounded-full text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center space-x-2 cursor-pointer shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                      ) : (
                        <Send className="w-4.5 h-4.5" />
                      )}
                      <span>{loading ? 'Submitting Details...' : 'Book Free Consultation'}</span>
                    </button>
                    <p className="text-[11px] text-center text-[#64748B] mt-2.5 flex items-center justify-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#2F5BC7]" />
                      <span>Your details stay private. No spam.</span>
                    </p>
                  </div>

                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
