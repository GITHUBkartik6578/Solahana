import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, Phone, MapPin, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AuthModal() {
  const { authModalOpen, authModalTab, closeAuthModal, openAuthModal, login, signup, loading } = useAuth();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', phone: '', city: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [alert, setAlert] = useState({ type: null, message: '' });

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: null, message: '' });
    const result = await login({ email: loginData.email, password: loginData.password, isAdminLogin: false });
    if (!result.success) {
      setAlert({ type: 'error', message: result.message });
    } else {
      setAlert({ type: 'success', message: result.message || 'Logged in successfully' });
      setTimeout(() => closeAuthModal(), 600);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: null, message: '' });
    if (signupData.password.length < 8) {
      setAlert({ type: 'error', message: 'Password must be at least 8 characters long' });
      return;
    }

    const result = await signup(signupData);
    if (!result.success) {
      setAlert({ type: 'error', message: result.message });
    } else {
      setAlert({ type: 'success', message: result.message });
      setTimeout(() => closeAuthModal(), 600);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="absolute inset-0 bg-[#FFFFFF]/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-gradient-to-b from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl z-10 text-left"
        >
          {/* Top Gold Border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-[2.5px] bg-gradient-to-r from-transparent via-[#1A3170] to-transparent rounded-full" />

          {/* Close Button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-[#F7F8FB] hover:bg-[#EEF2FB] text-[#5B6B84] hover:text-[#2F5BC7] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Tabs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-[#5A7FD6]" />
              <span className="text-xs font-mono text-[#5A7FD6] uppercase tracking-wider">
                SOLAHANA SECURE AUTH
              </span>
            </div>

            <h2 className="font-serif-luxury text-2xl font-bold text-[#0F1F45]">
              {authModalTab === 'login' ? 'Welcome Back to Solahana' : 'Create Your Solahana Account'}
            </h2>

            {/* Tab Switchers */}
            <div className="flex items-center gap-2 mt-4 p-1 rounded-xl bg-[#FFFFFF]/80 border border-[#E4E8F0]">
              <button
                onClick={() => { setAlert({ type: null, message: '' }); openAuthModal('login'); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authModalTab === 'login'
                    ? 'bg-[#1A3170] text-white shadow font-bold'
                    : 'text-[#5B6B84] hover:text-[#1A3170]'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => { setAlert({ type: null, message: '' }); openAuthModal('signup'); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  authModalTab === 'signup'
                    ? 'bg-[#1A3170] text-white shadow font-bold'
                    : 'text-[#5B6B84] hover:text-[#1A3170]'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Alert Notification Banner */}
          {alert.message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3.5 rounded-xl mb-5 text-xs flex items-center gap-2 border ${
                alert.type === 'error'
                  ? 'bg-red-950/40 border-red-500/40 text-red-300'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              }`}
            >
              {alert.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0 text-red-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
              <span>{alert.message}</span>
            </motion.div>
          )}

          {/* Form Content */}
          {authModalTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5A7FD6] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5B6B84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-3 pl-10 pr-4 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5A7FD6] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5B6B84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-3 pl-10 pr-10 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B6B84] hover:text-[#2F5BC7] transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-glow-button py-3.5 rounded-xl text-xs font-bold text-[#0F1F45] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5A7FD6] mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#5B6B84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Sharma"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-2.5 pl-10 pr-4 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5A7FD6] mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5B6B84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="vikram@domain.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-2.5 pl-10 pr-4 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5A7FD6] mb-1.5">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#5B6B84] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="+91 98765..."
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-2.5 pl-9 pr-3 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5A7FD6] mb-1.5">
                    City (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#5B6B84] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={signupData.city}
                      onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                      className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-2.5 pl-9 pr-3 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#5A7FD6] mb-1.5">
                  Password (Min 8 Chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#5B6B84] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="w-full bg-[#FFFFFF]/90 border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25 rounded-xl py-2.5 pl-10 pr-10 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B6B84] hover:text-[#2F5BC7] transition-colors"
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-glow-button py-3.5 rounded-xl text-xs font-bold text-[#0F1F45] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Register & Start Planning</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-5 text-center text-[11px] text-[#5B6B84] border-t border-[#E4E8F0] pt-4">
            Protected by 256-bit SSL encryption & SEBI Registered Standards.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
