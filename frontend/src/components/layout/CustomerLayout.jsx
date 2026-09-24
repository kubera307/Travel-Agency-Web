import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LuxuryNavbar from '../Navbar/LuxuryNavbar';
import LuxuryFooter from '../Footer/LuxuryFooter';
import {
  LayoutDashboard,
  Luggage,
  Heart,
  MessageSquare,
  MessageSquareHeart,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { name: 'My Trips & Bookings', path: '/customer/bookings', icon: Luggage },
    { name: 'Saved / Favourite Tours', path: '/customer/favourites', icon: Heart },
    { name: 'Custom Trip Enquiries', path: '/customer/enquiries', icon: MessageSquare },
    { name: 'Traveler Feedback', path: '/customer/feedback', icon: MessageSquareHeart },
    { name: 'Profile & Settings', path: '/customer/profile', icon: User }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#1D1B18] selection:bg-[#B99762] selection:text-white font-sans">
      <LuxuryNavbar />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 pt-28 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Quiet Luxury Customer Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl border border-[#1D1B18]/10 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-6">
              {/* User Profile Summary */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-[#1D1B18]/10">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#B99762] text-lg font-serif font-bold text-white shadow-sm border border-[#B99762]/30">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#B99762] bg-[#B99762]/10 px-2 py-0.5 rounded-md">
                      Verified Member
                    </span>
                  </div>
                  <h3 className="font-serif font-medium text-[#1D1B18] text-base truncate mt-1 leading-snug">
                    {user?.name}
                  </h3>
                  <p className="text-xs text-[#6D6A61] truncate font-light">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/customer/dashboard'}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-[#1D1B18] text-[#F7F1E7] shadow-sm'
                            : 'text-[#6D6A61] hover:bg-black/5 hover:text-[#1D1B18]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#B99762]' : 'text-[#6D6A61]'}`} />
                            <span>{item.name}</span>
                          </div>
                          <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#B99762]' : 'text-slate-300'}`} />
                        </>
                      )}
                    </NavLink>
                  );
                })}

                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>

                {/* Security Reassurance Widget */}
                <div className="mt-6 pt-5 border-t border-[#1D1B18]/10 space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5 font-bold text-[#1D1B18] text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                  <p className="text-[#6D6A61] text-[11px] font-normal leading-relaxed">
                    Account protected with JWT security &amp; direct Sarathi driver settlement telemetry.
                  </p>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Customer View Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>

      <LuxuryFooter />
    </div>
  );
}

