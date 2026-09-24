import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Luggage,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  Tag,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Radio,
  Sparkles,
  PhoneCall,
  MessageCircle,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      title: 'Operations',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Tour Packages', path: '/admin/tours', icon: Compass, badge: '33' },
        { name: 'Customer Bookings', path: '/admin/bookings', icon: Luggage, badge: '1' },
        { name: 'Customer Accounts', path: '/admin/customers', icon: Users },
        { name: 'Payment Ledger', path: '/admin/payments', icon: CreditCard }
      ]
    },
    {
      title: 'Customer Relations',
      items: [
        {
          name: 'Custom Trip Leads',
          path: '/admin/enquiries',
          icon: MessageSquare,
          badge: '7',
          badgeColor: 'bg-[#B99762]/20 text-[#B99762] border border-[#B99762]/30'
        },
        { name: 'Review Moderation', path: '/admin/reviews', icon: Star },
        { name: 'Promo Coupons', path: '/admin/coupons', icon: Tag }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-slate-800 flex font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar - Deep Executive Obsidian with Warm Gold Branding */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#0E131F] border-r border-[#1D2436] flex flex-col shrink-0 z-50 transition-transform duration-300 shadow-xl lg:shadow-none ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Admin Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[#1D2436] bg-[#0A0E17]">
          <Link to="/admin/dashboard" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9A74A] to-[#A37B31] p-0.5 shadow-md shadow-[#D9A74A]/10 group-hover:scale-105 transition-all shrink-0">
              <div className="w-full h-full bg-[#0E131F] rounded-[10px] flex items-center justify-center text-lg">
                🧭
              </div>
            </div>
            <div>
              <div className="font-serif tracking-tight leading-none flex items-center gap-1.5 text-base">
                <span className="font-bold text-white tracking-wide">TRAVEL</span>
                <span className="font-bold text-[#D9A74A] tracking-wide">INDIA</span>
              </div>
              <span className="text-[10px] font-semibold text-[#B99762] tracking-[0.2em] uppercase mt-1 block">
                Executive Console
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-4 space-y-7 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[10px] font-semibold tracking-[0.22em] text-[#8E97A8] uppercase mb-2.5">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/admin/dashboard'}
                      onClick={() => setMobileNavOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#B99762] to-[#9E7B3B] text-white font-bold shadow-md shadow-[#B99762]/20'
                            : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0 opacity-80" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.badgeColor || 'bg-white/10 text-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Platform Health Telemetry Widget */}
          <div className="p-4 rounded-2xl bg-[#141A28] border border-[#212A3E] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Bharat Operations Node</span>
              </span>
              <span className="text-emerald-400 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                LIVE
              </span>
            </div>
            <div className="space-y-1.5 text-[10px] text-slate-400 border-t border-[#1E2638] pt-2.5">
              <div className="flex justify-between">
                <span>Direct Driver Model:</span>
                <span className="text-[#D9A74A] font-semibold">100% UPI (0% Cut)</span>
              </div>
              <div className="flex justify-between">
                <span>Verified Fleets:</span>
                <span className="text-slate-300 font-semibold">28 States Active</span>
              </div>
              <div className="flex justify-between">
                <span>System Health:</span>
                <span className="text-emerald-400 font-semibold">Optimal (99.98%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Profile / Footer */}
        <div className="p-4 border-t border-[#1D2436] bg-[#0A0E17]">
          <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-[#141A28] border border-[#212A3E]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D9A74A] to-[#A37B31] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  Admin Active
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/40 transition-colors border border-rose-800/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2] overflow-y-auto">
        {/* Top Header - Crisp Luxury Alabaster Bar */}
        <header className="h-18 px-6 sm:px-8 bg-white/90 backdrop-blur-md border-b border-[#EAE3D9] flex items-center justify-between sticky top-0 z-30 shadow-[0_2px_12px_-4px_rgba(29,27,24,0.03)]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#B99762]" />
              <span className="text-slate-800 font-semibold">Travel India Executive Suite</span>
              <span className="hidden md:inline text-slate-300">•</span>
              <span className="hidden md:inline text-slate-500">Authentic Journeys Operations</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct WhatsApp Concierge Shortcut */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Leads Concierge</span>
            </a>

            {/* Live Website Link */}
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-[#FAF7F2] hover:bg-[#F3EDE2] px-3.5 py-2 rounded-xl border border-[#EAE3D9] transition-all shadow-xs"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#B99762]" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
