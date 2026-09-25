import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Lock, Mail, User, Phone, ArrowRight, Sparkles } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/customer/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email.trim(), password.trim());
      if (res.success) {
        showToast('Welcome back! Login successful.', 'success');
        if (res.user?.role === 'ADMIN' || res.user?.role === 'STAFF') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirect);
        }
      }
    } catch (err) {
      showToast(err.message || 'Invalid email/ID or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Logins
  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-left">
      <div className="space-y-6 rounded-[28px] border border-[#1D1B18]/10 bg-white p-8 sm:p-9 shadow-xl">
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1D1B18] text-xl text-[#B99762] border border-[#B99762]/30 shadow-xs">
            ✦
          </div>
          <span className="text-[10px] font-bold text-[#B99762] uppercase tracking-[0.2em] block pt-2">
            Member Authentication
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1D1B18]">
            Sign in to NammaYatra
          </h1>
          <p className="text-xs text-[#1D1B18]/60 font-light">
            Manage your trips, download driver passes, and access curated itineraries.
          </p>
        </div>

        {/* Redirect Notice Banner */}
        {redirect && redirect !== '/customer/dashboard' && (
          <div className="p-3.5 bg-[#FAF8F5] border border-[#B99762]/30 rounded-2xl flex items-start gap-2.5 text-xs text-[#1D1B18]/80">
            <Lock className="w-4 h-4 text-[#B99762] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[#1D1B18]">Sign in to continue your booking</p>
              <p className="text-[11px] text-[#1D1B18]/60 mt-0.5 font-light">
                Please authenticate to finalize your reservation. You will be redirected right back after login!
              </p>
            </div>
          </div>
        )}

        {/* Demo Credentials Box */}
        <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#1D1B18]/10 space-y-2">
          <p className="text-[10px] font-bold text-[#B99762] uppercase tracking-wider">⚡ Quick Demo One-Click Fill:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul@example.com', 'Customer@1234')}
              className="flex-1 bg-white hover:bg-[#FAF8F5] text-[#1D1B18] font-medium text-[11px] py-1.5 px-2 rounded-xl border border-[#1D1B18]/15 hover:border-[#B99762] transition-colors"
            >
              Customer (Rahul)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@travelindia.com', 'Admin@1234')}
              className="flex-1 bg-white hover:bg-[#FAF8F5] text-[#1D1B18] font-medium text-[11px] py-1.5 px-2 rounded-xl border border-[#1D1B18]/15 hover:border-[#B99762] transition-colors"
            >
              Admin Console
            </button>
          </div>
          <div className="text-[10px] text-slate-500 pt-1.5 border-t border-[#1D1B18]/5 flex flex-wrap justify-between gap-1 font-mono">
            <span>Admin ID: <strong className="text-slate-800">admin</strong> or <strong className="text-slate-800">admin@travelindia.com</strong></span>
            <span>Pass: <strong className="text-slate-800">Admin@1234</strong></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Email Address or Admin ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1D1B18]/40" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com or admin"
                className="w-full rounded-xl border border-[#1D1B18]/15 bg-[#FAF8F5] py-2.5 pl-10 pr-3 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#1D1B18]/80">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-[#B99762] hover:text-[#1D1B18] font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1D1B18]/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#1D1B18]/15 bg-[#FAF8F5] py-2.5 pl-10 pr-3 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D1B18] hover:bg-[#B99762] text-white font-medium text-xs py-3 rounded-full transition-all duration-300 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In & Continue'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#1D1B18]/10">
          <p className="text-xs text-[#1D1B18]/60 font-light">
            Don't have an account?{' '}
            <Link
              to={redirect && redirect !== '/customer/dashboard' ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
              className="font-medium text-[#B99762] hover:text-[#1D1B18] transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/customer/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, phone, password);
      if (res.success) {
        showToast('Account created successfully! Welcome to NammaYatra.', 'success');
        navigate(redirect);
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-left">
      <div className="space-y-6 rounded-[28px] border border-[#1D1B18]/10 bg-white p-8 sm:p-9 shadow-xl">
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1D1B18] text-xl text-[#B99762] border border-[#B99762]/30 shadow-xs">
            ✦
          </div>
          <span className="text-[10px] font-bold text-[#B99762] uppercase tracking-[0.2em] block pt-2">
            VIP Membership Registration
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1D1B18]">
            Create an Account
          </h1>
          <p className="text-xs text-[#1D1B18]/60 font-light">
            Join Bharat's premier direct-to-driver luxury travel community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1D1B18]/40" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1D1B18]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Mobile Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1D1B18]/40" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Password (min 6 characters) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#1D1B18]/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1D1B18] hover:bg-[#B99762] text-white font-medium text-xs py-3 rounded-full transition-all duration-300 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#1D1B18]/10">
          <p className="text-xs text-[#1D1B18]/60 font-light">
            Already have an account?{' '}
            <Link
              to={redirect && redirect !== '/customer/dashboard' ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
              className="font-medium text-[#B99762] hover:text-[#1D1B18] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Password reset link has been dispatched to your email.', 'info');
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-left">
      <div className="bg-white rounded-3xl p-8 border border-[#1D1B18]/10 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold text-[#B99762] uppercase tracking-[0.2em] block">
            Account Recovery
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#1D1B18]">
            Reset Password
          </h1>
          <p className="text-xs text-[#1D1B18]/60 font-light">
            Enter your registered email to receive an authentication reset link.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 text-center space-y-2">
            <p className="font-semibold">Password Reset Email Dispatched</p>
            <p className="font-light">If an account exists with {email}, you will receive a recovery link shortly.</p>
            <Link to="/login" className="inline-block mt-2 font-medium text-[#B99762] hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Registered Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1D1B18] hover:bg-[#B99762] text-white font-medium text-xs py-3 rounded-full transition-all duration-300 shadow-sm"
            >
              Send Recovery Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
