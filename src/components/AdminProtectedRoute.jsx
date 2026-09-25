import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center text-[#0F1F45]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#2F5BC7]/20 border-t-[#2F5BC7] animate-spin" />
          <span className="text-xs font-mono text-[#5A7FD6] uppercase tracking-wider">
            Verifying Admin Authority...
          </span>
        </div>
      </div>
    );
  }

  // Not logged in -> Redirect to /admin/login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but not admin -> 403 Unauthorized
  if (user?.role !== 'admin' && user?.role !== 'advisor') {
    return (
      <div className="min-h-[75vh] bg-[#FFFFFF] flex items-center justify-center px-6 py-24 text-[#0F1F45] text-center">
        <div className="max-w-md p-8 rounded-3xl bg-[#F7F8FB]/80 border border-red-500/40 shadow-2xl space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-red-400 uppercase px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
              HTTP 403 UNAUTHORIZED
            </span>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#0F1F45]">
              Access Restricted
            </h2>
            <p className="text-[#5B6B84] text-xs font-light leading-relaxed">
              Your account <strong>({user?.email})</strong> is registered as a standard user and does not possess administrator privileges.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => navigate('/admin/login')}
              className="w-full py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 font-bold text-xs cursor-pointer transition-colors"
            >
              Sign In with Admin Account
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-xl bg-[#F7F8FB] hover:bg-[#EEF2FB] text-[#5B6B84] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Client Homepage</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
