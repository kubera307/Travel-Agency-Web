import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

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
      const res = await login(email, password);
      if (res.success) {
        showToast('Welcome back! Login successful.', 'success');
        if (res.user?.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirect);
        }
      }
    } catch (err) {
      showToast(err.message || 'Invalid email or password', 'error');
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
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="space-y-6 rounded-[28px] border border-[#e8dfd5] bg-[#fffdf9] p-8 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d97706] text-2xl text-white shadow-md">
            ✦
          </div>
          <h1 className="font-serif pt-2 text-2xl font-normal text-[#1D1B18]">Sign in to NAMMAYATHRA</h1>
          <p className="text-xs text-slate-500">Manage your trips, download passes, and save favourites</p>
        </div>

        {/* Redirect Notice Banner */}
        {redirect && redirect !== '/customer/dashboard' && (
          <div className="p-3.5 bg-[#B68D40]/10 border border-[#B68D40]/30 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-[#B68D40] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Sign in to continue your booking</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Please sign in to proceed with your booking. You will be redirected right back after login!</p>
            </div>
          </div>
        )}

        {/* Demo Credentials Box */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-2">
          <p className="text-[11px] font-bold text-amber-900 uppercase">⚡ Quick Demo Login:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul@example.com', 'Customer@1234')}
              className="flex-1 bg-white hover:bg-amber-100/60 text-amber-950 font-bold text-[11px] py-1.5 px-2 rounded-xl border border-amber-300 transition-colors"
            >
              Customer (Rahul)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@travelindia.com', 'Admin@1234')}
              className="flex-1 bg-white hover:bg-amber-100/60 text-amber-950 font-bold text-[11px] py-1.5 px-2 rounded-xl border border-amber-300 transition-colors"
            >
              Admin Console
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-[#e1d8ce] bg-[#f7f1eb] py-2.5 pl-9 pr-3 text-xs font-medium text-slate-900 focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/15"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-orange-600 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#e1d8ce] bg-[#f7f1eb] py-2.5 pl-9 pr-3 text-xs font-medium text-slate-900 focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/15"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B68D40] hover:bg-[#a77f34] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In & Continue'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to={redirect && redirect !== '/customer/dashboard' ? `/register?redirect=${encodeURIComponent(redirect)}` : '/register'}
              className="font-bold text-orange-600 hover:underline"
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
        showToast('Account created successfully! Welcome to NAMMAYATHRA.', 'success');
        navigate(redirect);
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="space-y-6 rounded-[28px] border border-[#e8dfd5] bg-[#fffdf9] p-8 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d97706] text-2xl text-white shadow-md">
            ✦
          </div>
          <h1 className="font-display pt-2 text-2xl font-black tracking-[-0.055em] text-[#102039]">Create an Account</h1>
          <p className="text-xs text-slate-500">Join Bharat's 100% direct-to-driver travel community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password (min 6 characters) *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to={redirect && redirect !== '/customer/dashboard' ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
              className="font-bold text-orange-600 hover:underline"
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
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl space-y-6">
        <h1 className="font-display font-black text-2xl text-slate-900 text-center">Reset Password</h1>
        {submitted ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 text-center space-y-2">
            <p className="font-bold">Password Reset Email Dispatched</p>
            <p>If an account exists with {email}, you will receive a recovery link shortly.</p>
            <Link to="/login" className="inline-block mt-2 font-bold text-orange-600 underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Enter your registered email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

