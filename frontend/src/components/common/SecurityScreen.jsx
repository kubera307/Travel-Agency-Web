import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Lock, ShieldCheck, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * 403 Forbidden Screen shown when a non-admin attempts to access /admin
 */
export function AdminAccessDenied({ user }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitchAccount = () => {
    logout();
    navigate('/login?redirect=%2Fadmin%2Fdashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-[#EAE3D9] p-8 sm:p-10 shadow-[0_12px_40px_-4px_rgba(29,27,24,0.08)] text-center space-y-6 relative overflow-hidden">
        {/* Subtle Luxury Pattern / Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#B99762]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#B99762] border border-amber-200/80 flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#B99762] uppercase tracking-[0.22em] bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 inline-block">
            Security Notice • 403 Forbidden
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight">
            Administrator Access Restricted
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed max-w-md mx-auto">
            You are currently signed in as <strong className="text-slate-800 font-semibold">{user?.name || user?.email}</strong> with a <span className="font-semibold text-[#B99762]">Customer account</span>. Executive Console operations, catalog controls, and booking telemetry are restricted to authorized administrators.
          </p>
        </div>

        {/* Security Info Box */}
        <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#EAE3D9] text-left text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <span>Current Role:</span>
            <span className="font-mono bg-slate-200/80 px-2 py-0.5 rounded text-slate-800 text-[10px] font-bold">
              {user?.role || 'CUSTOMER'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <span>Required Role:</span>
            <span className="font-mono bg-[#B99762]/20 text-[#B99762] px-2 py-0.5 rounded text-[10px] font-bold border border-[#B99762]/30">
              ADMIN or STAFF
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/customer/dashboard"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-[#FAF7F2] hover:bg-[#F3EDE2] text-slate-700 px-4 py-3 rounded-xl text-xs font-semibold border border-[#EAE3D9] transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Portal</span>
          </Link>

          <button
            onClick={handleSwitchAccount}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#B99762] to-[#9E7B3B] hover:from-[#C5A36E] hover:to-[#AC8846] text-white px-4 py-3 rounded-xl text-xs font-bold shadow-md shadow-[#B99762]/20 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Switch to Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Security Loading Screen shown while authenticating session tokens
 */
export function SecurityLoadingScreen({ message = 'Verifying security credentials...' }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-12 h-12">
          <div className="w-12 h-12 border-2 border-[#B99762]/20 border-t-[#B99762] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#B99762]" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-700">{message}</p>
          <p className="text-[11px] text-slate-400 font-light">Checking 256-bit encrypted session authorization</p>
        </div>
      </div>
    </div>
  );
}

