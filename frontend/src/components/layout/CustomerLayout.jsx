import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import {
  LayoutDashboard,
  Luggage,
  Heart,
  MessageSquare,
  Bell,
  User,
  LogOut,
  ChevronRight
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
    { name: 'Profile & Settings', path: '/customer/profile', icon: User }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f0ea]">
      <Header />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Customer Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-[24px] border border-[#e8dfd5] bg-[#fffdf9] p-6 shadow-[0_16px_32px_rgba(15,23,42,0.05)]">
              {/* User Profile Summary */}
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d97706] text-lg font-bold text-white shadow-sm">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{user?.name}</h3>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/customer/dashboard'}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-[#fff0df] font-bold text-[#d97706]'
                            : 'text-slate-600 hover:bg-[#f8f1ea] hover:text-slate-900'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-500" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </NavLink>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors mt-4 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Customer View Content */}
          <main className="lg:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

