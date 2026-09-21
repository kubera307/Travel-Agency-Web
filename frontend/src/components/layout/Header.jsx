import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency, CURRENCIES } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';
import {
  PhoneCall,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Luggage,
  Heart,
  ChevronDown,
  Sparkles,
  Compass,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { lang, setLang } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/70 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] transition-all">
      {/* 1. Sleek Top Announcement & Support Bar */}
      <div className="bg-[#0B192C] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-white/5">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="bg-orange-500/20 text-orange-400 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
              🇮🇳 Authentic Bharat
            </span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              Curated Group Tours &amp; Private Roadtrips across 28 States • 100% Direct Driver Pricing
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <a
              href="tel:1800-BHARAT"
              className="hover:text-amber-400 transition-colors hidden md:flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Helpline: 1800-BHARAT</span>
            </a>
            <span className="text-slate-600 hidden md:inline">•</span>
            <a
              href="https://wa.me/919876543210?text=Hi%20Travel%20India!%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge: +91 98765 43210</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 shadow-md group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#0B192C] rounded-[14px] flex items-center justify-center text-xl">
                🧭
              </div>
            </div>
            <div>
              <div className="font-display font-black text-2xl tracking-tight text-slate-900 leading-none flex items-center gap-1">
                <span>TRAVEL</span>
                <span className="text-orange-600">INDIA</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                Curated Journeys • Direct Prices
              </p>
            </div>
          </Link>

          {/* Navigation Links (Evenly Spaced & Clean) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <Link
              to="/tours"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                location.pathname === '/tours'
                  ? 'text-orange-600 bg-orange-50 font-black'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              All Tours
            </Link>

            <Link
              to="/destinations"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                location.pathname.startsWith('/destinations')
                  ? 'text-orange-600 bg-orange-50 font-black'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Destinations
            </Link>

            <Link
              to="/upcoming-departures"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                location.pathname === '/upcoming-departures'
                  ? 'text-orange-600 bg-orange-50 font-black'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Live Departures
            </Link>

            <Link
              to="/custom-trip-planner"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                location.pathname === '/custom-trip-planner'
                  ? 'text-orange-600 bg-orange-50 font-black'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Custom Itinerary</span>
            </Link>

            <Link
              to="/offers"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                location.pathname === '/offers'
                  ? 'text-orange-600 bg-orange-50 font-black'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Offers
            </Link>

            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                location.pathname === '/about'
                  ? 'text-orange-600 bg-orange-50 font-black'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              About Us
            </Link>
          </nav>

          {/* Right Action Cluster (Organized & Harmonious) */}
          <div className="flex items-center gap-3">
            {/* Currency Dropdown */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 rounded-xl px-2.5 py-2 focus:outline-none cursor-pointer transition-colors"
                title="Select Currency"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Wishlist Heart */}
            <Link
              to={isAuthenticated ? '/customer/favourites' : '/login'}
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200/60"
              title="Saved Tours"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* WhatsApp Soft Button */}
            <a
              href="https://wa.me/919876543210?text=Hi%20Travel%20India!%20I%20am%20interested%20in%20planning%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
              <span>WhatsApp</span>
            </a>

            {/* Account & Auth Segment */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[90px]">
                      {user?.name?.split(' ')[0]}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-700 hover:bg-amber-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <Link
                      to="/customer/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Customer Dashboard</span>
                    </Link>

                    <Link
                      to="/customer/bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Luggage className="w-4 h-4 text-slate-400" />
                      <span>My Bookings</span>
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-extrabold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/tours"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl font-bold text-sm text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              All Tours Catalog
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl font-bold text-sm text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              Destinations
            </Link>
            <Link
              to="/upcoming-departures"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl font-bold text-sm text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              Live Guaranteed Departures
            </Link>
            <Link
              to="/custom-trip-planner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl font-bold text-sm text-orange-600 bg-orange-50"
            >
              Plan Custom Itinerary
            </Link>
            <Link
              to="/offers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl font-bold text-sm text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              Special Offers
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl font-bold text-sm text-slate-800 hover:bg-orange-50 hover:text-orange-600"
            >
              About Us
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-emerald-600 rounded-xl flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>WhatsApp Us</span>
            </a>
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
