import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarDays, ChevronDown, Compass, Heart, LogOut, Menu, Mountain, Search, Sparkles, UserRound, UsersRound, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';

const navLinks = [
  { name: 'Discover', href: '/destinations' },
  { name: 'Tours', href: '/tours' },
  { name: 'Departures', href: '/upcoming-departures' },
  { name: 'Custom Trips', href: '/custom-trip-planner' },
  { name: 'About', href: '/about' },
];

const dropdownItems = {
  Discover: [
    { title: 'Destinations', detail: 'Explore places worth remembering', href: '/destinations', icon: Compass },
    { title: 'Experiences', detail: 'Travel by mood and moment', href: '/tours', icon: Sparkles },
  ],
  Tours: [
    { title: 'Holiday Tours', detail: 'Ready-to-go itineraries', href: '/tours', icon: CalendarDays },
    { title: 'Adventure & Treks', detail: 'Trails, peaks and wild escapes', href: '/tours', icon: Mountain },
    { title: 'Family Getaways', detail: 'Easy journeys for everyone', href: '/tours', icon: UsersRound },
  ],
  Departures: [
    { title: 'Upcoming departures', detail: 'See what leaves next', href: '/upcoming-departures', icon: CalendarDays },
    { title: 'Limited offers', detail: 'Thoughtful trips, better value', href: '/offers', icon: Sparkles },
  ],
};

function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d97706] text-white shadow-[0_8px_18px_rgba(217,119,6,0.24)]">
        <Compass className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-[16px] font-extrabold tracking-[-0.075em] ${light ? 'text-white' : 'text-[#102039]'}`}>NAMMAYATHRA</span>
        <span className="mt-1.5 text-[8px] font-bold uppercase tracking-[0.24em] text-[#d97706]">Curated escapes</span>
      </span>
    </span>
  );
}

function isActive(location, href) {
  return location.pathname === href || (href !== '/' && location.pathname.startsWith(`${href}/`));
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { currency, setCurrency, currencies } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  const isOverlay = location.pathname === '/' && !isScrolled && !mobileOpen;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
        setCurrencyOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setCurrencyOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const closeMenus = () => {
    setOpenMenu(null);
    setCurrencyOpen(false);
    setProfileOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchValue.trim();
    setSearchOpen(false);
    if (query) navigate(`/tours?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
    navigate('/');
  };

  const toggleDropdown = (name) => {
    setCurrencyOpen(false);
    setProfileOpen(false);
    setOpenMenu((current) => (current === name ? null : name));
  };

  const shell = isOverlay
    ? 'border-transparent bg-white/[0.08] text-white shadow-none backdrop-blur-md'
    : 'border-[#e7ddd1] bg-[#fffdf9]/95 text-[#102039] shadow-[0_10px_28px_rgba(15,23,42,0.07)] backdrop-blur-xl';
  const muted = isOverlay ? 'text-white/80 hover:text-white' : 'text-[#34445a] hover:text-[#d97706]';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 lg:px-7">
        <div className={`mx-auto max-w-[1400px] rounded-[20px] border px-3 transition-all duration-300 sm:px-5 ${shell}`}>
          <div className="flex min-h-[68px] items-center justify-between gap-4 xl:grid xl:grid-cols-[1fr_auto_1fr]">
            <Link to="/" aria-label="NammaYathra home" onClick={closeMenus} className="shrink-0"><Logo light={isOverlay} /></Link>

            <nav aria-label="Primary navigation" className="hidden items-center gap-5 xl:flex">
              {navLinks.map((link) => {
                const active = isActive(location, link.href);
                const items = dropdownItems[link.name];
                return (
                  <div key={link.name} className="relative">
                    {items ? (
                      <button type="button" aria-expanded={openMenu === link.name} onClick={() => toggleDropdown(link.name)} className={`flex items-center gap-1.5 border-b-2 border-transparent py-5 text-[13px] font-medium transition-colors duration-200 focus:outline-none focus-visible:border-[#d97706] ${active ? 'border-[#d97706] text-[#d97706]' : muted}`}>
                        {link.name}<ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openMenu === link.name ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link to={link.href} className={`flex items-center border-b-2 border-transparent py-5 text-[13px] font-medium transition-colors duration-200 focus:outline-none focus-visible:border-[#d97706] ${active ? 'border-[#d97706] text-[#d97706]' : muted}`}>{link.name}</Link>
                    )}
                    {items && openMenu === link.name && (
                      <div className="absolute left-1/2 top-[calc(100%-3px)] w-72 -translate-x-1/2 rounded-2xl border border-[#e9dfd4] bg-[#fffdf9] p-2.5 text-[#102039] shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                        {items.map(({ title, detail, href, icon: Icon }) => (
                          <Link key={title} to={href} onClick={closeMenus} className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#fff3e5]">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff0df] text-[#d97706]"><Icon className="h-4 w-4" /></span>
                            <span><span className="block text-sm font-semibold">{title}</span><span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{detail}</span></span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center justify-end gap-1.5 sm:gap-2">
              <button type="button" aria-label="Search destinations and tours" onClick={() => { closeMenus(); setSearchOpen(true); }} className={`hidden h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706] sm:inline-flex ${isOverlay ? 'hover:bg-white/10' : 'hover:bg-[#f6eee6]'}`}><Search className="h-[17px] w-[17px]" /></button>

              <div className="relative hidden sm:block">
                <button type="button" aria-expanded={currencyOpen} onClick={() => { setCurrencyOpen((value) => !value); setOpenMenu(null); setProfileOpen(false); }} className={`flex items-center gap-1 rounded-full px-2.5 py-2 text-[11px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706] ${isOverlay ? 'hover:bg-white/10' : 'hover:bg-[#f6eee6]'}`}>{currency}<ChevronDown className="h-3.5 w-3.5" /></button>
                {currencyOpen && <div role="menu" className="absolute right-0 top-[calc(100%+10px)] w-48 rounded-2xl border border-[#e9dfd4] bg-[#fffdf9] p-2 text-[#102039] shadow-[0_18px_40px_rgba(15,23,42,0.12)]">{Object.values(currencies).map((item) => <button key={item.code} type="button" role="menuitem" onClick={() => { setCurrency(item.code); setCurrencyOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-colors hover:bg-[#fff3e5] ${currency === item.code ? 'text-[#d97706]' : 'text-slate-700'}`}><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f8eee4] font-semibold">{item.symbol}</span><span><strong>{item.code}</strong><span className="ml-1 text-slate-500">{item.code === 'INR' ? 'Indian Rupee' : item.code === 'USD' ? 'US Dollar' : item.code === 'EUR' ? 'Euro' : 'British Pound'}</span></span></button>)}</div>}
              </div>

              <Link to="/customer/favourites" aria-label="Wishlist" onClick={closeMenus} className={`relative hidden h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 sm:inline-flex ${isOverlay ? 'hover:bg-white/10' : 'hover:bg-[#f6eee6]'}`}><Heart className={`h-[17px] w-[17px] ${wishlistCount > 0 ? 'fill-[#d97706] text-[#d97706]' : ''}`} />{wishlistCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d97706] px-1 text-[9px] font-bold text-white">{wishlistCount}</span>}</Link>

              {isAuthenticated ? (
                <div className="relative hidden sm:block">
                  <button type="button" aria-expanded={profileOpen} onClick={() => { setProfileOpen((value) => !value); setCurrencyOpen(false); setOpenMenu(null); }} className={`flex items-center gap-2 rounded-full px-2 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706] ${isOverlay ? 'hover:bg-white/10' : 'hover:bg-[#f6eee6]'}`}><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d97706] text-[11px] font-bold text-white">{user?.name?.charAt(0) || 'U'}</span><span className="hidden max-w-20 truncate lg:block">{user?.name?.split(' ')[0] || 'Profile'}</span><ChevronDown className="h-3.5 w-3.5" /></button>
                  {profileOpen && <div role="menu" className="absolute right-0 top-[calc(100%+10px)] w-56 rounded-2xl border border-[#e9dfd4] bg-[#fffdf9] p-2 text-[#102039] shadow-[0_18px_40px_rgba(15,23,42,0.12)]"><div className="border-b border-[#eee5dc] px-3 py-2"><p className="text-xs font-semibold">{user?.name}</p><p className="mt-0.5 truncate text-[11px] text-slate-500">{user?.email}</p></div><Link to="/customer/bookings" onClick={closeMenus} className="mt-1 block rounded-lg px-3 py-2 text-xs hover:bg-[#fff3e5]">My Trips</Link><Link to="/customer/favourites" onClick={closeMenus} className="block rounded-lg px-3 py-2 text-xs hover:bg-[#fff3e5]">Wishlist</Link><Link to="/customer/profile" onClick={closeMenus} className="block rounded-lg px-3 py-2 text-xs hover:bg-[#fff3e5]">Profile</Link><button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 border-t border-[#eee5dc] px-3 py-2.5 text-left text-xs text-red-600 hover:bg-red-50"><LogOut className="h-3.5 w-3.5" /> Logout</button></div>}
                </div>
              ) : <Link to="/login" onClick={closeMenus} className={`hidden items-center gap-1.5 rounded-full px-2.5 py-2 text-[13px] font-medium transition-colors sm:inline-flex ${muted}`}><UserRound className="h-4 w-4" />Login</Link>}

              <Link to="/booking" onClick={closeMenus} className="group hidden items-center gap-2 rounded-xl bg-[#d97706] px-3.5 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(217,119,6,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#c86a00] sm:inline-flex">Book a Trip<ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" /></Link>
              <Link to="/customer/favourites" aria-label="Open wishlist" className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full sm:hidden ${isOverlay ? 'text-white' : 'text-[#102039]'}`}><Heart className={`h-[17px] w-[17px] ${wishlistCount > 0 ? 'fill-[#d97706] text-[#d97706]' : ''}`} /></Link>
              <Link to="/booking" className="inline-flex rounded-xl bg-[#d97706] px-3 py-2 text-xs font-semibold text-white sm:hidden">Book</Link>
              <button type="button" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen} onClick={() => { setMobileOpen((value) => !value); closeMenus(); }} className={`inline-flex h-9 w-9 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706] lg:hidden ${isOverlay ? 'text-white' : 'text-[#102039]'}`}>{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
            </div>
          </div>

          {mobileOpen && <div className="border-t border-[#e7ddd1] py-4 lg:hidden"><nav aria-label="Mobile navigation" className="space-y-1">{navLinks.map((link) => <Link key={link.name} to={link.href} onClick={() => setMobileOpen(false)} className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-medium ${isActive(location, link.href) ? 'bg-[#fff3e5] text-[#d97706]' : 'text-[#102039] hover:bg-[#faf3ec]'}`}><span>{link.name}</span><ArrowRight className="h-4 w-4 text-slate-400" /></Link>)}<Link to="/offers" onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-3.5 text-base font-medium text-[#102039] hover:bg-[#faf3ec]">Offers<ArrowRight className="h-4 w-4 text-slate-400" /></Link></nav><div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#e7ddd1] pt-4"><button type="button" onClick={() => { setMobileOpen(false); setSearchOpen(true); }} className="flex items-center justify-center gap-2 rounded-xl border border-[#e5d9cc] px-3 py-3 text-sm font-medium text-[#102039]"><Search className="h-4 w-4" />Search</button>{isAuthenticated ? <button type="button" onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-sm font-medium text-red-600"><LogOut className="h-4 w-4" />Logout</button> : <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-xl bg-[#102039] px-3 py-3 text-sm font-medium text-white"><UserRound className="h-4 w-4" />Login</Link>}</div></div>}
        </div>
      </header>

      {searchOpen && <div className="fixed inset-0 z-[60] flex items-start justify-center bg-[#102039]/45 px-4 pt-24 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Search travel experiences" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}><div className="w-full max-w-2xl rounded-[24px] border border-[#e9dfd4] bg-[#fffdf9] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:p-7"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d97706]">Find your next escape</p><h2 className="mt-1 text-2xl font-extrabold tracking-[-0.05em] text-[#102039]">Where will you go?</h2></div><button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-[#f6eee6] hover:text-[#102039]"><X className="h-5 w-5" /></button></div><form onSubmit={handleSearch} className="mt-6 flex items-center gap-3 rounded-2xl border border-[#e5d9cc] bg-white px-4 py-3 focus-within:border-[#d97706] focus-within:ring-2 focus-within:ring-[#d97706]/15"><Search className="h-5 w-5 shrink-0 text-[#d97706]" /><input ref={searchRef} value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search destinations, tours or departures" aria-label="Search destinations, tours or departures" className="min-w-0 flex-1 bg-transparent text-sm text-[#102039] outline-none placeholder:text-slate-400" /><button type="submit" className="rounded-xl bg-[#d97706] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c86a00]">Search</button></form><div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500"><span>Try:</span>{['Kashmir', 'Kerala', 'Weekend escapes'].map((term) => <button key={term} type="button" onClick={() => { setSearchValue(term); searchRef.current?.focus(); }} className="rounded-full border border-[#e5d9cc] px-3 py-1.5 hover:border-[#d97706] hover:text-[#d97706]">{term}</button>)}</div></div></div>}
    </>
  );
}
