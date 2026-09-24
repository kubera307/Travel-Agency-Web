import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, Menu, X, ChevronDown, ArrowRight, FileText, RotateCcw, ShieldCheck, PhoneCall, Info, HelpCircle, ExternalLink, MessageSquareHeart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import InfoPolicyModal from '../common/InfoPolicyModal';

export function NammayatraLogoIcon({ className = "w-8 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L1 26H7.5L14 11.5L18.5 21L21.5 14.5L27 26H33.5L21.5 2L17 11.5L12 2Z" fill="#B68D40" />
      <path d="M27 7L24 13.5L28 21.5L39 26H33.5L27 12L25.5 9L27 7Z" fill="#EAD8B1" opacity="0.9" />
    </svg>
  );
}

export const TRAVELER_INFO_ITEMS = [
  {
    id: 'terms',
    label: 'Terms & Conditions',
    desc: 'Sarathi driver code & booking rules',
    path: '/terms',
    icon: FileText,
    accent: 'text-[#B68D40] bg-[#B68D40]/20 border-[#B68D40]/40'
  },
  {
    id: 'cancellation',
    label: 'Cancellation Policy',
    desc: '100% free cancellation within 24h',
    path: '/cancellation-policy',
    icon: RotateCcw,
    accent: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40'
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    desc: '256-bit SSL & zero data-sale pledge',
    path: '/privacy-policy',
    icon: ShieldCheck,
    accent: 'text-sky-400 bg-sky-500/20 border-sky-500/40'
  },
  {
    id: 'guide',
    label: 'Booking & Luggage Guide',
    desc: 'Vehicle capacities & luggage limits',
    path: '/booking-guide',
    icon: HelpCircle,
    accent: 'text-amber-300 bg-amber-400/20 border-amber-400/40'
  },
  {
    id: 'feedback',
    label: 'Traveler Feedback',
    desc: 'Rate your tour & share suggestions',
    path: '/feedback',
    icon: MessageSquareHeart,
    accent: 'text-rose-400 bg-rose-500/20 border-rose-500/40'
  },
  {
    id: 'contact',
    label: 'Contact Info',
    desc: '24x7 SOS helpline & WhatsApp concierge',
    path: '/contact',
    icon: PhoneCall,
    accent: 'text-[#EAD8B1] bg-[#EAD8B1]/20 border-[#EAD8B1]/40'
  },
  {
    id: 'about',
    label: 'About Us',
    desc: 'Our ethos & 0% middleman movement',
    path: '/about',
    icon: Info,
    accent: 'text-[#B68D40] bg-[#B68D40]/20 border-[#B68D40]/40'
  }
];

export default function LuxuryNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [selectedPolicyTab, setSelectedPolicyTab] = useState('terms');
  const infoMenuRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { currency, setCurrency, currencies } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setCurrencyOpen(false);
    setInfoDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (infoMenuRef.current && !infoMenuRef.current.contains(e.target)) {
        setInfoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Discover', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Tours', href: '/tours' },
    { name: 'Plan Trip', href: '/custom-trip-planner' },
    { name: 'About', href: '/about' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchModalOpen(false);
      navigate(`/tours?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isDarkHero = isHome && !isScrolled;

  const headerBg = isDarkHero
    ? 'bg-gradient-to-b from-black/80 via-black/45 to-transparent text-white'
    : 'bg-[#131417]/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 h-[72px] transition-all duration-300 ${headerBg}`}>
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* LEFT: NammaYatra Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group text-left">
            <NammayatraLogoIcon className="w-8 h-6 text-[#B68D40] group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-[22px] tracking-tight font-semibold text-white group-hover:text-[#B68D40] transition-colors leading-none font-serif">
                NammaYatra
              </span>
              <span className="text-[7.5px] tracking-[0.26em] font-sans uppercase text-[#B68D40] font-medium mt-1">
                Explore India Differently
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[13px] font-medium tracking-wide transition-all py-1 relative ${
                    isActive ? 'text-white font-semibold' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#B68D40] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Utility bar (Search, INR ▾, Wishlist ♡, User Login, "Book a Trip →") */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="text-white/80 hover:text-white p-1 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Currency Selector (INR ▾) */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="text-xs font-medium text-white/85 hover:text-white flex items-center gap-1 transition-colors py-1"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-[#131417] border border-white/15 py-1.5 shadow-2xl z-50 rounded-md">
                  {Object.values(currencies).map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs transition ${
                        currency === curr.code
                          ? 'text-[#B68D40] font-semibold bg-white/5'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {curr.code} ({curr.symbol})
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Heart Icon */}
            <Link
              to="/customer/favourites"
              className="relative text-white/85 hover:text-white p-1 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-[#B68D40] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Login */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white py-1 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#B68D40]/20 border border-[#B68D40]/50 flex items-center justify-center text-[#B68D40] font-semibold text-xs">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="hidden md:inline max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#131417] border border-white/15 py-2 shadow-2xl z-50 rounded-md text-left">
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-white/60 truncate">{user?.email}</p>
                      </div>
                      {user?.role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-xs text-[#B68D40] hover:bg-white/5"
                        >
                          Admin Console
                        </Link>
                      )}
                      <Link
                        to="/customer/dashboard"
                        className="block px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5"
                      >
                        My Bookings
                      </Link>
                      <button
                        type="button"
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 border-t border-white/10 mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white transition py-1"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Golden "Book My Trip →" Button */}
            <Link
              to={isAuthenticated ? "/custom-trip-planner" : "/login?redirect=/custom-trip-planner"}
              className="inline-flex items-center gap-1.5 bg-[#B68D40] hover:bg-[#a77f34] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium rounded-md transition shadow-sm whitespace-nowrap"
            >
              <span>Book My Trip</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            {/* 3-Line Drop Box (Policies & Info Menu) */}
            <div className="relative" ref={infoMenuRef}>
              <button
                type="button"
                onClick={() => setInfoDropdownOpen(!infoDropdownOpen)}
                className={`w-8 h-8 sm:w-8.5 sm:h-8.5 flex flex-col justify-center items-center gap-[3.5px] rounded-md transition-all border ${
                  infoDropdownOpen
                    ? 'bg-[#B68D40] border-[#B68D40] text-white shadow-md'
                    : 'bg-white/10 hover:bg-[#B68D40]/30 border-white/20 text-white'
                }`}
                title="Terms, Policies &amp; Company Info"
                aria-label="3-line drop box for policies and info"
              >
                <span className="w-4 h-[2px] bg-white rounded-full"></span>
                <span className="w-4 h-[2px] bg-white rounded-full"></span>
                <span className="w-4 h-[2px] bg-white rounded-full"></span>
              </button>

              {/* Dropdown Box */}
              {infoDropdownOpen && (
                <div
                  style={{ backgroundColor: '#12141A' }}
                  className="absolute right-0 mt-2.5 w-[330px] sm:w-[350px] bg-[#12141A] border border-[#B68D40]/45 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] py-2 z-50 text-left animate-in fade-in duration-150 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#B68D40] animate-pulse"></span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B68D40]">
                        Traveler Information
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#FAF8F5]/60 tracking-wider uppercase">Travel India Desk</span>
                  </div>

                  <div className="p-2 space-y-1">
                    {TRAVELER_INFO_ITEMS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => setInfoDropdownOpen(false)}
                          className="group/item flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs border border-transparent hover:border-[#B68D40]/30 hover:bg-[#B68D40]/15 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover/item:scale-105 group-hover/item:shadow-sm ${item.accent}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="font-serif text-[15px] font-medium text-[#FAF8F5] tracking-wide group-hover/item:text-[#B68D40] transition-colors leading-snug">
                                {item.label}
                              </p>
                              <p className="text-[11px] text-[#FAF8F5]/75 font-sans font-light tracking-normal truncate leading-normal mt-0.5 group-hover/item:text-[#FAF8F5]/95">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#B68D40]/60 group-hover/item:text-[#B68D40] group-hover/item:translate-x-1 transition-all shrink-0" />
                        </Link>
                      );
                    })}
                  </div>

                  <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.03] flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Direct Driver Pricing
                    </span>
                    <Link
                      to="/contact"
                      onClick={() => setInfoDropdownOpen(false)}
                      className="text-[#B68D40] hover:text-[#EAD8B1] font-serif font-semibold text-xs tracking-wide hover:underline transition-colors"
                    >
                      Helpline: 1800-BHARAT
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-white/90 hover:text-white p-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="w-[80%] max-w-sm h-full bg-[#131417] text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <NammayatraLogoIcon className="w-7 h-5 text-[#B68D40]" />
                  <span className="font-semibold text-lg tracking-tight text-white font-serif">
                    NammaYatra
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-3 text-left">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="block py-2 text-sm text-white/80 hover:text-white transition font-medium"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="pt-4 border-t border-white/10 space-y-3 text-left">
                <Link
                  to="/customer/favourites"
                  className="flex items-center justify-between py-2 text-sm text-white/80 hover:text-white"
                >
                  <span>Wishlist</span>
                  <span className="px-2 py-0.5 text-xs bg-[#B68D40] text-white rounded-full font-bold">
                    {wishlistCount}
                  </span>
                </Link>

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="block py-2 text-sm text-[#B68D40] font-semibold"
                  >
                    Login / Register →
                  </Link>
                ) : (
                  <Link
                    to="/customer/dashboard"
                    className="block py-2 text-sm text-white/80 hover:text-white"
                  >
                    Customer Dashboard
                  </Link>
                )}
              </div>
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-left">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B68D40]">
                    Traveler Information &amp; Policies
                  </p>
                  <span className="text-[10px] font-mono text-[#FAF8F5]/60 uppercase">Travel India Desk</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs text-white/90">
                  {TRAVELER_INFO_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#B68D40]/15 border border-transparent hover:border-[#B68D40]/30 transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-2">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${item.accent}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <div className="min-w-0">
                            <span className="font-serif text-[15px] font-normal text-[#FAF8F5] group-hover:text-[#B68D40] block leading-snug">
                              {item.label}
                            </span>
                            <span className="text-[11px] text-[#FAF8F5]/65 font-light block truncate mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#B68D40]/60 group-hover:text-[#B68D40] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                to={isAuthenticated ? "/custom-trip-planner" : "/login?redirect=/custom-trip-planner"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#B68D40] hover:bg-[#a77f34] text-white py-2.5 text-xs font-semibold rounded-md transition"
              >
                <span>Book My Trip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#131417] border border-white/20 p-6 sm:p-8 shadow-2xl rounded-xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <span className="text-xs uppercase tracking-widest text-[#B68D40] font-semibold">
                Search Journeys Across India
              </span>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destination, tour or experience (e.g. Mangalore, Kashmir, Coorg)..."
                autoFocus
                className="w-full bg-white/5 border border-white/20 text-white placeholder-white/40 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-[#B68D40] transition"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 bg-[#B68D40] text-white text-xs font-semibold rounded-md hover:bg-[#a77f34] transition flex items-center gap-1.5"
              >
                <span>Search</span>
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-6 flex flex-wrap items-center gap-2 text-xs text-white/60">
              <span className="font-semibold text-white/80">Trending:</span>
              {['Mangalore', 'Kashmir', 'Coorg', 'Kerala', 'Rajasthan', 'Udupi'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchModalOpen(false);
                    navigate(`/tours?search=${encodeURIComponent(term)}`);
                  }}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 hover:text-white text-white/80 rounded transition"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Information & Policy Display Modal */}
      <InfoPolicyModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        initialTab={selectedPolicyTab}
      />
    </>
  );
}
