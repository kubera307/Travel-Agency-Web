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
  MessageCircle
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
        { name: 'Payment Transactions', path: '/admin/payments', icon: CreditCard }
      ]
    },
    {
      title: 'Customer Relations',
      items: [
        { name: 'Custom Enquiries', path: '/admin/enquiries', icon: MessageSquare, badge: '7', badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' },
        { name: 'Review Moderation', path: '/admin/reviews', icon: Star },
        { name: 'Promo Coupons', path: '/admin/coupons', icon: Tag }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#070E1B] text-slate-100 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-68 bg-[#0B1528] border-r border-slate-800/80 flex flex-col shrink-0 z-50 transition-transform duration-300 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Admin Brand */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80 bg-[#081120]">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-all shrink-0">
              <div className="w-full h-full bg-[#0B1528] rounded-[14px] flex items-center justify-center text-lg">
                🛺
              </div>
            </div>
            <div>
              <div className="font-display font-black text-white text-base tracking-tight leading-none flex items-center gap-1.5">
                <span>TRAVEL</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">INDIA</span>
              </div>
              <span className="text-[10px] font-extrabold text-orange-400/90 tracking-widest uppercase mt-1 block">
                Executive Console
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-5 px-3.5 space-y-6 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[10px] font-extrabold tracking-widest text-slate-500 uppercase mb-2">
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
                        `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/25'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            item.badgeColor || 'bg-slate-800 text-slate-300'
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
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Open Mobility Node</span>
              </span>
              <span className="text-emerald-400 font-mono text-[10px] font-bold">100% LIVE</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-400">
              <div className="flex justify-between">
                <span>Backend Engine:</span>
                <span className="text-slate-200 font-semibold">Python Flask 3.12</span>
              </div>
              <div className="flex justify-between">
                <span>Driver Settlement:</span>
                <span className="text-emerald-400 font-semibold">UPI Direct (0%)</span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span className="text-slate-200 font-semibold">SQLite Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Profile / Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#081120]">
          <div className="flex items-center gap-3 mb-3 p-2 rounded-2xl bg-slate-900/70 border border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center font-black text-xs shadow-md">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  Admin Active
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Container (Fluid full-width layout) */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#070E1B] overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 px-6 sm:px-8 bg-[#0B1528]/80 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-bold">Protected Admin Console</span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline text-slate-400">Direct Driver UPI Telemetry</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct WhatsApp Concierge Shortcut */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 px-3 py-2 rounded-xl border border-emerald-800/60 transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Leads</span>
            </a>

            {/* Live Website Link */}
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700/80 transition-all shadow-xs"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
