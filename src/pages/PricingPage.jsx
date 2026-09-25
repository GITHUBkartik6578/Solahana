import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  PieChart, 
  FileText, 
  PhoneCall, 
  Sparkles, 
  Clock, 
  User, 
  Mail, 
  MapPin, 
  Send, 
  Award,
  Lock
} from 'lucide-react';
import consultationService from '../services/consultationService';

export default function PricingPage({ onOpenSearch }) {
  const callbackFormRef = useRef(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    preferredTime: 'Morning (9 AM - 12 PM)',
    serviceSelected: 'Custom Financial Planning',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const scrollToCallbackForm = (serviceName) => {
    if (serviceName) {
      setFormData(prev => ({ ...prev, serviceSelected: serviceName }));
    }
    if (callbackFormRef.current) {
      callbackFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitCallback = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.fullName || !formData.mobileNumber || !formData.email || !formData.city) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    // The placeholder invites "+91 98765 43210"; the API wants the bare 10-digit Indian mobile number.
    let phone = formData.mobileNumber.replace(/\D/g, '');
    if (phone.length === 12 && phone.startsWith('91')) phone = phone.slice(2);
    else if (phone.length === 11 && phone.startsWith('0')) phone = phone.slice(1);
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      // Field names must match the API (goal / message). "topic" and "notes" are silently dropped by the
      // server, which used to lose the service the visitor picked and their message.
      await consultationService.bookConsultation({
        fullName: formData.fullName.trim(),
        phone,
        email: formData.email.trim(),
        city: formData.city.trim(),
        preferredTime: formData.preferredTime,
        goal: formData.serviceSelected,
        consultationMode: 'Phone Call',
        message: formData.message.trim(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('[Consultation Request Error]:', err);
      // A failed booking must never look like a success — the lead would silently vanish.
      setErrorMsg(
        "We couldn't send that just now. Please call or WhatsApp us on +91 73044 42171 and we'll book you in directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-28 pb-20 text-[#0F1F45] font-inter">
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO HEADER                                                */}
      {/* ------------------------------------------------------------- */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4 mb-16">
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#2F5BC7]/10 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF2FB] text-xs font-semibold uppercase tracking-widest text-[#1A3170]"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
          <span>SOLAHANA PLANNING SOLUTIONS</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F45] tracking-tight leading-tight"
        >
          Tailored Financial Solutions for{' '}
          <span className="text-[#2F5BC7] font-serif-luxury">
            Every Milestone.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-[#475569] font-normal leading-relaxed"
        >
          Explore our specialized financial solutions designed for complete peace of mind. Transparent, zero-commission fiduciary advice customized around your unique life goals.
        </motion.p>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. TWO SOLUTION PRICING CARDS (CUSTOM FINANCIAL & TAX PLANNING) */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 lg:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* CARD 1: CUSTOM FINANCIAL PLANNING */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-white border-2 border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative group h-full"
          >
            <div>
              {/* Top Accent Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2F5BC7]/20 via-[#2F5BC7]/15 to-[#1A3170]/10 border border-[#2F5BC7]/30 flex items-center justify-center text-[#1A3170]">
                  <PieChart className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[#1A3170] uppercase tracking-wider">
                  Comprehensive 360°
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0F1F45] group-hover:text-[#1A3170] transition-colors">
                  Custom Financial Planning
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2">
                  A 360-degree holistic financial blueprint crafted around your career, family, property, retirement, and multi-generational goals.
                </p>
              </div>

              {/* Concise Checklist */}
              <div className="space-y-3 mb-8 pt-4 border-t border-[#E4E8F0]/60">
                <h3 className="text-xs font-mono font-semibold text-[#1A3170] uppercase tracking-wider mb-3">
                  What's Included:
                </h3>
                {[
                  '360° Fiduciary Wealth Architecture',
                  'Goal-Based Multi-Asset SIP Portfolios',
                  'FIRE Retirement & Pension Planning',
                  'Estate & Legacy Wealth Protection',
                  'Dedicated Personal Financial Advisor'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-[#2F5BC7] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#0F1F45] font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* One "Get Started" CTA Button */}
            <button
              onClick={() => scrollToCallbackForm('Custom Financial Planning')}
              className="w-full gold-glow-button py-4 rounded-2xl text-xs sm:text-sm font-bold text-white tracking-wide flex items-center justify-center space-x-2 cursor-pointer shadow-md group-hover:shadow-xl transition-all mt-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* CARD 2: TAX PLANNING */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-white border-2 border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-xl hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative group h-full"
          >
            <div>
              {/* Top Accent Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2F5BC7]/20 via-[#2F5BC7]/15 to-[#1A3170]/10 border border-[#2F5BC7]/30 flex items-center justify-center text-[#1A3170]">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[#1A3170] uppercase tracking-wider">
                  Tax Optimization
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0F1F45] group-hover:text-[#1A3170] transition-colors">
                  Tax Planning
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-2">
                  Strategic tax-saving solutions to optimize your annual savings under Section 80C, 80D, NPS, capital gains, and salary structuring.
                </p>
              </div>

              {/* Concise Checklist */}
              <div className="space-y-3 mb-8 pt-4 border-t border-[#E4E8F0]/60">
                <h3 className="text-xs font-mono font-semibold text-[#1A3170] uppercase tracking-wider mb-3">
                  What's Included:
                </h3>
                {[
                  'Section 80C, 80D & 80CCD(1B) Optimization',
                  'Automated Capital Gains Tax-Loss Harvesting',
                  'Salary Structuring & Take-Home Maximization',
                  'Proactive Year-Round Tax Strategy',
                  'Expert Fiduciary Tax Planning'
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-[#2F5BC7] shrink-0" />
                    <span className="text-xs sm:text-sm text-[#0F1F45] font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* One "Get Started" CTA Button */}
            <button
              onClick={() => scrollToCallbackForm('Tax Planning')}
              className="w-full gold-glow-button py-4 rounded-2xl text-xs sm:text-sm font-bold text-white tracking-wide flex items-center justify-center space-x-2 cursor-pointer shadow-md group-hover:shadow-xl transition-all mt-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. REQUEST A CALLBACK SECTION                                 */}
      {/* ------------------------------------------------------------- */}
      <section ref={callbackFormRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-b from-white via-[#F7F8FB] to-white border-2 border-[#2F5BC7]/40 p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Top Gold Horizon Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#1A3170] to-transparent rounded-full" />

          {/* Section Heading */}
          <div className="text-center space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-xs font-mono font-bold text-[#1A3170]">
              <PhoneCall className="w-3.5 h-3.5 text-[#2F5BC7]" />
              <span>DIRECT FIDUCIARY ACCESS</span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#0F1F45]">
              Request a Callback
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] max-w-lg mx-auto">
              Fill out your details below and a senior SOLAHANA SEBI-registered fiduciary advisor will get in touch with you at your preferred time.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 rounded-2xl bg-[#FFFFFF] border border-[#2F5BC7] text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1A3170] to-[#1A3170] text-white flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#0F1F45]">
                Callback Request Received!
              </h3>
              <p className="text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. One of our dedicated financial advisors will contact you at <strong>{formData.mobileNumber}</strong> during your preferred slot (<strong>{formData.preferredTime}</strong>).
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full border border-[#2F5BC7] text-xs font-bold text-[#1A3170] hover:bg-[#1A3170] hover:text-white transition-all"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmitCallback} className="space-y-6">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#0F1F45] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#2F5BC7]" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 text-xs sm:text-sm outline-none bg-white transition-all"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#0F1F45] flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-[#2F5BC7]" />
                    <span>Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 text-xs sm:text-sm outline-none bg-white transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#0F1F45] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#2F5BC7]" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="rajesh@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 text-xs sm:text-sm outline-none bg-white transition-all"
                  />
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#0F1F45] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#2F5BC7]" />
                    <span>City *</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 text-xs sm:text-sm outline-none bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Preferred Callback Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#0F1F45] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2F5BC7]" />
                    <span>Preferred Callback Time</span>
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 text-xs sm:text-sm outline-none bg-white transition-all"
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                  </select>
                </div>

                {/* Service Requirement Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#0F1F45] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#C9A04F]" />
                    <span>Service Requirement</span>
                  </label>
                  <select
                    name="serviceSelected"
                    value={formData.serviceSelected}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 text-xs sm:text-sm outline-none bg-white transition-all"
                  >
                    <option value="Custom Financial Planning">Custom Financial Planning</option>
                    <option value="Tax Planning">Tax Planning</option>
                    <option value="Both Solutions">Both Solutions</option>
                  </select>
                </div>
              </div>

              {/* Message / Requirement */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0F1F45]">
                  Message / Special Notes (Optional)
                </label>
                <textarea
                  name="message"
                  rows="3"
                  placeholder="Tell us a little about your primary goals or financial requirements..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 text-xs sm:text-sm outline-none bg-white transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-glow-button w-full sm:w-auto px-10 py-4 rounded-2xl text-xs sm:text-sm font-bold text-white tracking-wide flex items-center justify-center space-x-2 cursor-pointer shadow-lg mx-auto"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Request...' : 'Request a Callback'}</span>
                </button>

                <p className="text-[11px] text-[#64748B] mt-3 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-[#2F5BC7]" />
                  <span>Your privacy is 100% protected. Zero spam, guaranteed.</span>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </section>

    </div>
  );
}
