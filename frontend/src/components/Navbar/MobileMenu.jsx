import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Compass, LogOut, SlidersHorizontal, Calendar, Heart, ArrowRight } from 'lucide-react';

export default function MobileMenu({
  isOpen,
  onClose,
  navLinks = [],
  isAuthenticated,
  user,
  onLogout
}) {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-tight font-display text-slate-900">
                NammaYatra
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info if Logged In */}
          {isAuthenticated && user && (
            <div className="py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <div className="py-6 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-40" />
                </Link>
              );
            })}
          </div>

          {/* Customer Links */}
          {isAuthenticated ? (
            <div className="py-4 border-t border-slate-100 space-y-1">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                My Account
              </p>
              <Link
                to="/customer/dashboard"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/customer/bookings"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>My Bookings</span>
              </Link>
              <Link
                to="/customer/favourites"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Heart className="w-4 h-4 text-slate-400" />
                <span>Saved Wishlist</span>
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <Link
                to="/login"
                onClick={onClose}
                className="w-full block text-center py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Sign In
              </Link>
              <Link
                to="/custom-trip-planner"
                onClick={onClose}
                className="w-full block text-center py-2.5 px-4 rounded-xl bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700 shadow-sm transition"
              >
                Plan My Trip
              </Link>
            </div>
          )}
        </div>

        {/* Footer info / Logout */}
        <div className="pt-6 border-t border-slate-100">
          {isAuthenticated ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <p className="text-center text-xs text-slate-400">
              India's Most Trusted Experiential Travel Network
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

