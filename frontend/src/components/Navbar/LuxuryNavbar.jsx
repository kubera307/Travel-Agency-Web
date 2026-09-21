import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Heart, User, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';

export function TrekoraLogoIcon({ className = "w-8 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L1 26H7.5L14 11.5L18.5 21L21.5 14.5L27 26H33.5L21.5 2L17 11.5L12 2Z" fill="#B68D40" />
      <path d="M27 7L24 13.5L28 21.5L39 26H33.5L27 12L25.5 9L27 7Z" fill="#EAD8B1" opacity="0.9" />
    </svg>
  );
}

export default function LuxuryNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  }, [location.pathname]);

  const navLinks = [
    { name: 'Discover', href: '/' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'Experiences', href: '/tours?category=wellness' },
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
          
          {/* LEFT: Trekora Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group text-left">
            <TrekoraLogoIcon className="w-8 h-6 text-[#B68D40] group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl sm:text-[22px] tracking-tight font-semibold text-white group-hover:text-[#B68D40] transition-colors leading-none">
                Trekora
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

            {/* Golden "Book a Trip →" Button */}
            <Link
              to="/custom-trip-planner"
              className="inline-flex items-center gap-1.5 bg-[#B68D40] hover:bg-[#a77f34] text-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium rounded-md transition shadow-sm whitespace-nowrap"
            >
              <span>Book a Trip</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

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
                  <TrekoraLogoIcon className="w-7 h-5 text-[#B68D40]" />
                  <span className="font-semibold text-lg tracking-tight text-white">
                    Trekora
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
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                to="/custom-trip-planner"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#B68D40] hover:bg-[#a77f34] text-white py-2.5 text-xs font-semibold rounded-md transition"
              >
                <span>Book a Trip</span>
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
    </>
  );
}
