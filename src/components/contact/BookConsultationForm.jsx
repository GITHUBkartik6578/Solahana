import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar as CalendarIcon, 
  Video, 
  PhoneCall, 
  Building, 
  CheckCircle2, 
  Sparkles,
  Send,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import consultationService from '../../services/consultationService';

const goals = [
  'Retirement Planning',
  'Dream Home',
  'Tax Planning',
  'Investment Planning',
  'Emergency Fund',
  'Wealth Creation',
  'Child Education',
  'General Financial Planning',
];

const modes = [
  { id: 'Video Call', label: 'Video Call', icon: Video },
  { id: 'Phone Call', label: 'Phone Call', icon: PhoneCall },
  { id: 'Office Visit', label: 'In Person (Andheri West Office)', icon: Building },
];

const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'];

export const BookConsultationForm = () => {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    city: user ? user.city : '',
    goal: 'Retirement Planning',
    consultationMode: 'Video Call',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTime: '11:30 AM',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);

  const isPhoneValid = /^[6-9][0-9]{9}$/.test(formData.phone);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    if (!isPhoneValid) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!user) {
      openAuthModal('login');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await consultationService.bookConsultation({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        goal: formData.goal,
        consultationMode: formData.consultationMode,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message,
      });

      setSubmitted(true);

      // Redirect to dashboard after successful booking
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit consultation booking';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    localStorage.setItem('solahana_consultation_draft', JSON.stringify(formData));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section id="book-form-section" className="py-24 relative overflow-hidden bg-gradient-to-b from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB]">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#2F5BC7]/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/25 mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6]" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#5A7FD6]">
              1-ON-1 PLANNING CRM
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif-luxury text-3xl md:text-5xl font-bold text-[#0F1F45] mb-6 leading-tight"
          >
            Tell Us About Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3170] via-[#E3EAF8] to-[#1A3170]">
              Financial Goals.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#5B6B84] text-base md:text-lg font-light leading-relaxed"
          >
            Provide a few key details so our fiduciary wealth team can tailor your private 45-minute consultation.
          </motion.p>
        </div>

        {/* Main Glass Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl bg-gradient-to-b from-[#F7F8FB]/90 via-[#F7F8FB]/95 to-[#F7F8FB] border border-[#2F5BC7]/30 p-8 md:p-12 shadow-2xl backdrop-blur-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[3px] bg-gradient-to-r from-transparent via-[#1A3170] to-transparent rounded-full" />

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-[#2F5BC7]/20 border-2 border-[#2F5BC7] flex items-center justify-center text-[#5A7FD6]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="font-serif-luxury text-3xl font-bold text-[#0F1F45]">
                Consultation Request Received
              </h3>

              <p className="text-[#334155] text-base max-w-lg mx-auto font-light leading-relaxed">
                Thank you, <span className="text-[#5A7FD6] font-semibold">{formData.fullName || 'Valued Client'}</span>. Your consultation request for <span className="text-[#0F1F45] font-medium">{formData.goal}</span> has been confirmed for <span className="text-[#5A7FD6] font-medium">{formData.preferredDate}</span> at <span className="text-[#5A7FD6] font-medium">{formData.preferredTime}</span> via {formData.consultationMode}.
              </p>

              <div className="pt-6 flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1A3170] to-[#5A7FD6] text-white font-bold text-sm transition-all shadow-lg cursor-pointer"
                >
                  View My Consultations
                </button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3.5 rounded-xl bg-[#F7F8FB] hover:bg-[#EEF2FB] text-[#0F1F45] font-medium text-sm transition-all"
                >
                  Book Another Session
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 text-left">
              
              {!user && (
                <div className="p-4 rounded-xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-xs text-[#5A7FD6] flex items-center justify-between">
                  <span>Please login or sign up to schedule your consultation booking.</span>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="px-3 py-1.5 rounded-lg bg-[#1A3170] text-white font-bold text-xs"
                  >
                    Login Now
                  </button>
                </div>
              )}

              {/* Row 1: Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#5B6B84] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Sharma"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      className="w-full bg-[#FFFFFF]/80 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-3.5 pl-11 pr-4 text-[#0F1F45] text-sm placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#5B6B84] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="vikram@domain.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full bg-[#FFFFFF]/80 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-3.5 pl-11 pr-4 text-[#0F1F45] text-sm placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Contact & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-2 flex items-center justify-between">
                    <span>Phone Number *</span>
                    {phoneTouched && (
                      <span className={`text-[10px] font-mono font-normal ${isPhoneValid ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formData.phone.length}/10 digits
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Phone className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                      phoneTouched
                        ? isPhoneValid
                          ? 'text-emerald-400'
                          : 'text-red-400'
                        : 'text-[#5B6B84]'
                    }`} />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="7304442171"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onBlur={() => setPhoneTouched(true)}
                      className={`w-full bg-[#FFFFFF]/80 rounded-xl py-3.5 pl-11 pr-4 text-[#0F1F45] text-sm placeholder-[#94A3B8] focus:outline-none transition-all border ${
                        phoneTouched
                          ? isPhoneValid
                            ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                            : 'border-red-500/80 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25'
                      }`}
                    />
                  </div>
                  {phoneTouched && !isPhoneValid && (
                    <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                      <span>Please enter a valid 10-digit Indian mobile number.</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-2">
                    City / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#5B6B84] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / Bengaluru / Delhi"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full bg-[#FFFFFF]/80 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-3.5 pl-11 pr-4 text-[#0F1F45] text-sm placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Dropdowns */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-2">
                  Primary Financial Goal *
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => handleChange('goal', e.target.value)}
                  className="w-full bg-[#FFFFFF]/80 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-3.5 px-4 text-[#0F1F45] text-sm focus:outline-none transition-all cursor-pointer"
                >
                  {goals.map(g => (
                    <option key={g} value={g} className="bg-[#FFFFFF] text-[#0F1F45]">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Preferred Mode */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-3">
                  Preferred Consultation Mode *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {modes.map(m => {
                    const ModeIcon = m.icon;
                    const isSelected = formData.consultationMode === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => handleChange('consultationMode', m.id)}
                        className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2F5BC7]/20 border-[#2F5BC7] text-[#0F1F45] shadow-lg'
                            : 'bg-[#F7F8FB] border-[#E4E8F0] text-[#5B6B84] hover:border-[#E4E8F0]'
                        }`}
                      >
                        <ModeIcon className={`w-5 h-5 ${isSelected ? 'text-[#5A7FD6]' : 'text-[#5B6B84]'}`} />
                        <span className="text-sm font-medium">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 5: Date & Time Picker */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <CalendarIcon className="w-4 h-4 text-[#5B6B84] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferredDate}
                      onChange={(e) => handleChange('preferredDate', e.target.value)}
                      className="w-full bg-[#FFFFFF]/80 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-3.5 pl-11 pr-4 text-[#0F1F45] text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-2">
                    Preferred Time Slot *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map(ts => {
                      const isSelected = formData.preferredTime === ts;
                      return (
                        <button
                          type="button"
                          key={ts}
                          onClick={() => handleChange('preferredTime', ts)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1A3170] text-white font-bold shadow'
                              : 'bg-[#F7F8FB] border border-[#E4E8F0] text-white/70 hover:bg-[#EEF2FB]'
                          }`}
                        >
                          {ts}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Message Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#5A7FD6] mb-2">
                  Additional Notes / Specific Questions (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about any specific investments, retirement timelines or tax questions you'd like to cover..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full bg-[#FFFFFF]/80 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl p-4 text-[#0F1F45] text-sm placeholder-[#94A3B8] focus:outline-none transition-all"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E4E8F0]">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] hover:border-[#E4E8F0] text-[#0F1F45] text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-[#EEF2FB]"
                >
                  <Save className="w-4 h-4 text-[#5A7FD6]" />
                  <span>{saved ? 'Draft Saved ✓' : 'Save For Later'}</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-9 py-4 rounded-xl gold-glow-button text-[#0F1F45] font-bold text-base shadow-lg shadow-[#2F5BC7]/25 hover:shadow-xl hover:shadow-[#2F5BC7]/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#0F1F45]" />
                  ) : (
                    <Send className="w-5 h-5 text-[#0F1F45]" />
                  )}
                  <span>{loading ? 'Submitting...' : 'Schedule Consultation'}</span>
                </button>
              </div>

            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
