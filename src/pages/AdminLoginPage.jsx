import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // login() reports failure via { success: false, message } instead of throwing.
      const result = await login(email, password, { isAdminLogin: true });
      if (!result?.success) {
        setError(result?.message || 'Admin authentication failed. Please verify credentials.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Admin authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#FFFFFF] text-[#0F1F45] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/95 border border-[#2F5BC7]/35 rounded-3xl p-8 shadow-[0_20px_50px_rgba(26,49,112,0.15)] text-left relative overflow-hidden backdrop-blur-xl"
      >
        {/* Decorative Top Ambient Light */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#2F5BC7]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2.5px] bg-gradient-to-r from-transparent via-[#1A3170] to-transparent" />

        {/* Emblem */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 flex items-center justify-center text-[#1A3170] shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>

        {/* Title */}
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#1A3170] px-3.5 py-1 rounded-full bg-[#EEF2FB]">
            SOLAHANA GOVERNANCE
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#0F1F45] tracking-tight">
            Admin Control Center
          </h1>
          <p className="text-xs text-[#64748B] font-light leading-relaxed">
            Sign in with authorized administrator credentials to manage consultations, users, and platform analytics.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-3"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F1F45] mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="admin@solahana.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F8FB] border border-[#2F5BC7]/30 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 rounded-xl py-3 pl-11 pr-4 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F1F45] mb-2">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F8FB] border border-[#2F5BC7]/30 focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/20 rounded-xl py-3 pl-11 pr-11 text-[#0F1F45] text-xs placeholder-[#94A3B8] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F1F45] transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl gold-glow-button font-bold text-xs text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Administrator...</span>
              </>
            ) : (
              <>
                <span>Access Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#2F5BC7]/15 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs text-[#64748B] hover:text-[#1A3170] transition-colors cursor-pointer"
          >
            ← Return to SOLAHANA Client Portal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
