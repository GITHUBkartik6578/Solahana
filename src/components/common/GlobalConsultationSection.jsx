import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  Clock,
  CalendarDays,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Lock,
  Users,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import consultationService from '../../services/consultationService';

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

  // Pages can pre-fill the goal and message before scrolling here (e.g. the Who We Serve guide).
  // A message the visitor typed themselves is never overwritten.
  const prefilledMessage = useRef('');
  useEffect(() => {
    const handlePrefill = (e) => {
      const { goal, message } = e.detail || {};
      setFormData((prev) => {
        const next = { ...prev };
        if (planningInterests.includes(goal)) next.goal = goal;
        const untouched = !prev.message.trim() || prev.message === prefilledMessage.current;
        if (message && untouched) {
          next.message = message;
          prefilledMessage.current = message;
        }
        return next;
      });
    };
    window.addEventListener('solahana:prefill-consultation', handlePrefill);
    return () => window.removeEventListener('solahana:prefill-consultation', handlePrefill);
  }, []);

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

  const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
  const fieldCls =
    'w-full rounded-lg border border-[#DCE1EA] bg-white px-3.5 py-2.5 text-[13.5px] text-[#0F1F45] outline-none transition-all placeholder:text-[#94A3B8] focus:border-[#C9922E] focus:ring-2 focus:ring-[#C9922E]/20';
  const labelCls = 'mb-1 block text-[12.5px] font-semibold text-[#0F1F45]';

  const FEATURES = [
    { title: 'Private & Confidential', desc: 'Your data and discussions are strictly protected under professional fiduciary standards. Used solely for your personalized session.', icon: Lock },
    { title: 'Tailored Strategic Blueprint', desc: 'Cash flows, tax efficiency, risk protection, and investment structuring, looked at comprehensively together.', icon: TrendingUp },
    { title: 'Zero Product Bias', desc: 'Objective, transparent guidance rooted in CWM® and CFP® principles. No sales pressure, no forced product pushing.', icon: Users },
  ];

  return (
    <section id="global-consultation-section" className="relative overflow-hidden bg-gradient-to-br from-white via-[#FBFAF7] to-[#F4F0E8] py-12 font-inter sm:py-14 lg:py-16">
      {/* soft gold swooshes, as in the design */}
      <svg aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-[420px] w-[520px] opacity-60" viewBox="0 0 520 420" fill="none">
        <path d="M-20 400 C 120 330, 160 180, 360 120" stroke="#E6C27A" strokeOpacity="0.55" strokeWidth="26" strokeLinecap="round" />
        <path d="M-60 430 C 100 380, 200 260, 420 210" stroke="#C9922E" strokeOpacity="0.25" strokeWidth="10" strokeLinecap="round" />
      </svg>
      <svg aria-hidden="true" className="pointer-events-none absolute -right-24 top-6 hidden h-[360px] w-[420px] opacity-50 lg:block" viewBox="0 0 420 360" fill="none">
        <path d="M440 20 C 330 70, 300 190, 160 260" stroke="#E6C27A" strokeOpacity="0.5" strokeWidth="22" strokeLinecap="round" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-14">
          {/* ================= LEFT: headline, copy, three promises ================= */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="text-left"
          >
            <p className="font-sora text-[11.5px] font-semibold uppercase tracking-[0.3em] text-[#0F1F45] sm:text-[12.5px]">
              Solahana Wealth Architecture &amp; Family Office
            </p>
            <span aria-hidden="true" className="mt-4 block h-[2px] w-40 rounded-full bg-gradient-to-r from-[#C9922E] to-transparent sm:w-56" />

            <h2 style={serif} className="mt-5 text-[40px] font-bold leading-[1.02] tracking-[-0.01em] text-[#0F1F45] sm:text-[52px] lg:text-[clamp(44px,4.2vw,60px)]">
              Schedule Your
              <span className="block bg-gradient-to-r from-[#B8862B] via-[#D9A441] to-[#B8862B] bg-clip-text text-transparent">Private Wealth</span>
              Consultation
            </h2>

            <p className="[text-wrap:pretty] mt-5 max-w-[56ch] text-[15.5px] leading-relaxed text-[#334155] sm:text-[17px]">
              Connect directly with certified wealth architects. We listen to your goals, evaluate your financial health, and outline strategic next steps—completely confidential and zero obligation.
            </p>

            <ul className="mt-7 space-y-3">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <li key={f.title} className="flex items-start gap-4 rounded-xl border border-[#EDE6D8] bg-white/90 p-4 shadow-[0_6px_18px_rgba(15,31,69,0.05)]">
                    <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full bg-[#FBF0DC] text-[#B8862B]">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <h3 style={serif} className="text-[18px] font-bold leading-tight text-[#0F1F45]">{f.title}</h3>
                      <p className="[text-wrap:pretty] mt-1 text-[13.5px] leading-snug text-[#475569]">{f.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* ================= RIGHT: booking form card ================= */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="min-w-0"
          >
            <div className="relative mx-auto w-full max-w-[600px] overflow-hidden rounded-3xl border border-[#E7E2D6] bg-white p-5 shadow-[0_24px_60px_rgba(15,31,69,0.12)] sm:p-6 lg:ml-auto lg:mr-0">
              <div className="mb-4 flex items-center gap-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EEF2FB] text-[#1A3170]">
                  <CalendarDays className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 style={serif} className="text-[24px] font-bold leading-tight text-[#0F1F45] sm:text-[27px]">Book Your Consultation</h3>
                  <p className="text-[12.5px] text-[#64748B] sm:text-[13px]">Take the first step towards a more secure financial future.</p>
                </div>
              </div>

              {submitted ? (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4 py-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C9922E] bg-[#FBF0DC] text-[#B8862B]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 style={serif} className="text-2xl font-bold text-[#0F1F45]">Consultation Request Received!</h4>
                  <p className="mx-auto max-w-sm text-xs leading-relaxed text-[#475569] sm:text-sm">
                    Thank you, <strong>{formData.fullName}</strong>. A dedicated SOLAHANA financial planner will contact you at <strong>+91 {formData.phone}</strong> during your selected slot (<strong>{formData.preferredTime}</strong>).
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 cursor-pointer rounded-full border border-[#0F1F45] px-6 py-2.5 text-xs font-bold text-[#0F1F45] transition-all hover:bg-[#0F1F45] hover:text-white"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-left">
                  {errorMsg && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Full name */}
                  <div>
                    <label htmlFor="gc-fullName" className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                      <input id="gc-fullName" type="text" name="fullName" required placeholder="Ananya Sharma" value={formData.fullName} onChange={handleChange} className={`${fieldCls} pl-10`} />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor="gc-phone" className="text-[12.5px] font-semibold text-[#0F1F45]">Mobile Number <span className="text-red-500">*</span></label>
                      {phoneTouched && (
                        <span className={`font-mono text-[10px] ${isPhoneValid ? 'font-bold text-emerald-600' : 'text-red-500'}`}>{formData.phone.length}/10 digits</span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <div className="pointer-events-none absolute left-3.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#0F1F45]">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                        <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" />
                      </div>
                      <input
                        id="gc-phone"
                        type="tel"
                        name="phone"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onBlur={() => setPhoneTouched(true)}
                        className={`${fieldCls} pl-[88px] ${
                          phoneTouched ? (isPhoneValid ? '!border-emerald-500 focus:!ring-emerald-500/20' : '!border-red-500 focus:!ring-red-500/20') : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="gc-email" className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                      <input id="gc-email" type="email" name="email" required placeholder="ananya@example.com" value={formData.email} onChange={handleChange} className={`${fieldCls} pl-10`} />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="gc-city" className={labelCls}>City <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                      <input id="gc-city" type="text" name="city" required placeholder="Mumbai" value={formData.city} onChange={handleChange} className={`${fieldCls} pl-10`} />
                    </div>
                  </div>

                  {/* Planning interest */}
                  <div>
                    <label htmlFor="gc-goal" className={labelCls}>Planning Interest <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select id="gc-goal" name="goal" value={formData.goal} onChange={handleChange} className={`${fieldCls} cursor-pointer appearance-none pr-10`}>
                        {planningInterests.map((interest) => (
                          <option key={interest} value={interest}>{interest}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                    </div>
                  </div>

                  {/* Preferred callback time */}
                  <fieldset>
                    <legend className={labelCls}>Preferred Callback Time</legend>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => {
                        const [name, range] = slot.split(' (');
                        const on = formData.preferredTime === slot;
                        return (
                          <label
                            key={slot}
                            className={`relative flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 py-2 text-center text-[12px] leading-tight transition-all focus-within:ring-2 focus-within:ring-[#C9922E]/40 ${
                              on ? 'border-[#0F1F45] bg-[#0F1F45] text-white shadow-[0_6px_14px_rgba(15,31,69,0.25)]' : 'border-[#DCE1EA] bg-white text-[#0F1F45] hover:border-[#C9922E]'
                            }`}
                          >
                            <input type="radio" name="preferredTime" value={slot} checked={on} onChange={handleChange} className="sr-only" />
                            {on && <Clock className="h-4 w-4 shrink-0" />}
                            <span>
                              {name}
                              <span className="block">({range}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* Message */}
                  <div>
                    <label htmlFor="gc-message" className={labelCls}>Message (Optional)</label>
                    <input id="gc-message" type="text" name="message" placeholder="Briefly share any specific financial goals or questions." value={formData.message} onChange={handleChange} className={fieldCls} />
                  </div>

                  {/* Consent */}
                  <div className="space-y-1.5 text-[12.5px] text-[#334155]">
                    <label className="flex cursor-pointer items-center gap-2.5">
                      <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 rounded border-[#1A3170] text-[#0F1F45] focus:ring-[#C9922E]" />
                      <span>I agree to the <a href="/terms-of-use" className="font-medium text-[#1A56DB] underline">Terms &amp; Conditions</a> and <a href="/privacy-policy" className="font-medium text-[#1A56DB] underline">Privacy Policy</a>.</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2.5">
                      <input type="checkbox" name="subscribeWhatsapp" checked={formData.subscribeWhatsapp} onChange={handleChange} className="h-4 w-4 rounded border-[#1A3170] text-[#0F1F45] focus:ring-[#C9922E]" />
                      <span>Subscribe me for confidential updates &amp; insights.</span>
                    </label>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg bg-gradient-to-r from-[#0A1836] to-[#15296A] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(15,31,69,0.3)] transition-all hover:shadow-[0_14px_30px_rgba(15,31,69,0.4)] disabled:opacity-60"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CalendarDays className="h-5 w-5 text-[#E6C27A]" />}
                    <span style={serif}>{loading ? 'Submitting Details...' : 'Request Private Consultation'}</span>
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>

                  <div className="flex items-start gap-3 rounded-lg bg-[#EAF1FC] p-3 text-[12.5px] leading-snug text-[#1E293B]">
                    <Info className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#1A3170]" />
                    <p>
                      <strong>Note:</strong> Solahana operates strictly as a consultative Family Office platform. All initial strategy sessions are complimentary diagnostics structured under professional CWM® standards.
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
