import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import {
  Luggage,
  Users,
  CreditCard,
  MessageSquare,
  Star,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Phone,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Percent,
  IndianRupee,
  Check,
  Copy,
  QrCode,
  Lock,
  Edit2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------
// 1. MANAGE BOOKINGS PAGE - QUIET LUXURY THEME
// ----------------------------------------------------------------------
export function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/bookings${statusFilter ? `?status=${statusFilter}` : ''}`);
      if (res.success) setBookings(res.data || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/admin/bookings/${id}/status`, { bookingStatus: newStatus });
      if (res.success) {
        showToast(`Booking marked as ${newStatus}`, 'success');
        loadBookings();
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.booking_number?.toLowerCase().includes(q) ||
      b.customer_name?.toLowerCase().includes(q) ||
      b.tour_title?.toLowerCase().includes(q) ||
      b.customer_phone?.toLowerCase().includes(q) ||
      b.customer_email?.toLowerCase().includes(q)
    );
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.grand_total || 0), 0);
  const confirmedCount = bookings.filter((b) => b.booking_status === 'CONFIRMED').length;
  const pendingCount = bookings.filter((b) => b.booking_status === 'PENDING').length;

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header Banner - Executive Luxury */}
      <div className="bg-gradient-to-r from-[#141A26] via-[#1B2332] to-[#121620] text-white rounded-3xl p-6 sm:p-8 border border-[#232B3E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A74A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold text-[#D9A74A] uppercase tracking-widest bg-[#D9A74A]/15 px-3 py-1 rounded-full border border-[#D9A74A]/30">
            Operations &amp; Dispatch
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal mt-2">
            Customer Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            Real-time reservations, passenger manifests, and 1-click driver dispatch tools
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3 flex-wrap relative z-10">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px] font-semibold uppercase tracking-wider">Total Bookings</span>
            <span className="text-white font-serif font-bold text-base">{bookings.length}</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px] font-semibold uppercase tracking-wider">Gross Value</span>
            <span className="text-[#D9A74A] font-serif font-bold text-base">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row - Crisp White Luxury Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total Bookings</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">{bookings.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">All time reservations</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Confirmed</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700">{confirmedCount}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">100% Driver Assigned</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Pending</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-amber-700">{pendingCount}</p>
          <span className="text-[11px] text-amber-700 font-semibold">Awaiting Verification</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Driver Settlement</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700">100%</p>
          <span className="text-[11px] text-emerald-700 font-semibold">0% Brokerage Cut</span>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking ref, customer, tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B99762]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: '', label: 'All' },
            { id: 'CONFIRMED', label: 'Confirmed' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-gradient-to-r from-[#B99762] to-[#9E7B3B] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-slate-600 hover:text-slate-900 border border-[#EAE3D9]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table - Crisp Luxury Style */}
      <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D9] text-slate-500 font-semibold uppercase text-[10px] tracking-wider bg-[#FAF7F2]">
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Tour Package</th>
                <th className="py-3.5 px-4">Departure Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]/60 text-slate-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No bookings found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#EAE3D9]">
                        {b.booking_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D9A74A] to-[#A37B31] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {b.customer_name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{b.customer_name}</div>
                          <div className="text-[11px] text-slate-500">
                            {b.customer_phone || b.customer_email || 'No phone'}
                          </div>
                          {b.customer_phone && (
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`tel:${b.customer_phone.replace(/[^0-9+]/g, '')}`}
                                className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-700 hover:text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-xs"
                              >
                                <Phone className="w-2.5 h-2.5 text-[#B99762]" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/${b.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Namaste ${b.customer_name}, regarding your Travel India reservation (${b.booking_number}): ${b.tour_title}...`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 shadow-xs"
                              >
                                <MessageCircle className="w-2.5 h-2.5 text-emerald-600" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 truncate max-w-xs">{b.tour_title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Private AC Chauffeur • Heritage Stay</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {b.departure_date || 'Flexible'}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-slate-900 text-sm">
                      ₹{Number(b.grand_total).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-semibold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                          b.booking_status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : b.booking_status === 'COMPLETED'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : b.booking_status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{b.booking_status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={b.booking_status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="bg-[#FAF7F2] text-slate-800 border border-[#EAE3D9] rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. MANAGE CUSTOMERS PAGE - QUIET LUXURY THEME
// ----------------------------------------------------------------------
export function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/admin/customers');
        if (res.success) setCustomers(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q)
    );
  });

  const totalSpentAll = customers.reduce((sum, c) => sum + Number(c.total_spent || 0), 0);
  const totalBookingsAll = customers.reduce((sum, c) => sum + Number(c.total_bookings || 0), 0);

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141A26] via-[#1B2332] to-[#121620] text-white rounded-3xl p-6 sm:p-8 border border-[#232B3E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A74A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold text-[#D9A74A] uppercase tracking-widest bg-[#D9A74A]/15 px-3 py-1 rounded-full border border-[#D9A74A]/30">
            User Directory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal mt-2">
            Customer Profiles &amp; Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            Registered travelers, booking history, lifetime spend, and direct WhatsApp concierge contacts
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px] font-semibold uppercase tracking-wider">Total Accounts</span>
            <span className="text-white font-serif font-bold text-base">{customers.length}</span>
          </div>
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px] font-semibold uppercase tracking-wider">Total Spent</span>
            <span className="text-[#D9A74A] font-serif font-bold text-base">
              ₹{totalSpentAll.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total Users</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">{customers.length}</p>
          <span className="text-[11px] text-blue-700 font-semibold">Active Profiles</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total Trips Booked</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-[#B99762]">{totalBookingsAll}</p>
          <span className="text-[11px] text-slate-500 font-medium">Across all packages</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Avg Spend / User</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700">
            ₹{customers.length ? Math.round(totalSpentAll / customers.length).toLocaleString('en-IN') : 0}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">Direct Driver Fare</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Verification</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">100%</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Phone &amp; Email Verified</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B99762]"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Showing {filteredCustomers.length} of {customers.length} accounts
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D9] text-slate-500 font-semibold uppercase text-[10px] tracking-wider bg-[#FAF7F2]">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Total Bookings</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]/60 text-slate-700">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D9A74A] to-[#A37B31] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {c.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-semibold text-slate-900">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{c.email}</td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 font-medium">{c.phone || 'N/A'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#B99762] bg-[#B99762]/10 px-2.5 py-1 rounded-md border border-[#B99762]/20">
                      {c.total_bookings || 0} Trips
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-slate-900 text-sm">
                    ₹{Number(c.total_spent || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{c.status || 'ACTIVE'}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {c.phone ? (
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <a
                          href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 shadow-xs transition-colors"
                        >
                          <Phone className="w-3 h-3 text-[#B99762]" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Namaste ${c.name}, greetings from Travel India! Hope you are having a wonderful day.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-xs transition-colors"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No phone on file</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. MANAGE PAYMENTS PAGE - QUIET LUXURY THEME
// ----------------------------------------------------------------------
export function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gatewaySettings, setGatewaySettings] = useState(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [formData, setFormData] = useState({
    razorpayKeyId: '',
    razorpayKeySecret: '',
    merchantVpa: '',
    merchantName: ''
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const { showToast } = useToast();

  const loadData = async () => {
    try {
      const [resPay, resGw] = await Promise.all([
        api.get('/admin/payments'),
        api.get('/razorpay/admin/gateway-settings').catch(() => null)
      ]);
      if (resPay?.success) setPayments(resPay.data || []);
      if (resGw?.success && resGw.data) {
        setGatewaySettings(resGw.data);
        setFormData({
          razorpayKeyId: resGw.data.razorpayKeyId || '',
          razorpayKeySecret: resGw.data.razorpayKeySecretMasked || '',
          merchantVpa: resGw.data.merchantVpa || '',
          merchantName: resGw.data.merchantName || ''
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGatewaySettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await api.put('/razorpay/admin/gateway-settings', formData);
      if (res.success) {
        showToast('Razorpay credentials & UPI QR updated successfully!', 'success');
        setShowConfigModal(false);
        loadData();
      } else {
        showToast(res.message || 'Failed to update gateway settings', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error saving settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.transaction_id?.toLowerCase().includes(q) ||
      p.booking_number?.toLowerCase().includes(q) ||
      p.customer_name?.toLowerCase().includes(q) ||
      p.payment_method?.toLowerCase().includes(q)
    );
  });

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141A26] via-[#1B2332] to-[#121620] text-white rounded-3xl p-6 sm:p-8 border border-[#232B3E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A74A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold text-[#D9A74A] uppercase tracking-widest bg-[#D9A74A]/15 px-3 py-1 rounded-full border border-[#D9A74A]/30">
            Accounting &amp; Settlement
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal mt-2">
            Payment Transactions &amp; Gateway
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            Razorpay gateway controls, audited customer transaction ledger, and 100% direct driver UPI settlements
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs backdrop-blur-xs">
            <span className="text-slate-300 block text-[10px] font-semibold uppercase tracking-wider">Total Settled</span>
            <span className="text-[#D9A74A] font-serif font-bold text-base">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Razorpay Gateway & Master Bharat UPI QR Card */}
      <div className="bg-white rounded-3xl border border-[#EAE3D9] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="shrink-0 bg-white p-3 rounded-2xl border-2 border-slate-900 shadow-md">
            <QRCodeSVG
              value={gatewaySettings?.masterQrPayload || 'upi://pay?pa=nammayatra.sarathi@icici&pn=Travel+India+Expeditions&cu=INR'}
              size={110}
              level="M"
            />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE ADMIN BHARAT QR CODE</span>
            </div>
            <h3 className="font-serif text-lg font-medium text-slate-900">
              Master Receiving UPI QR &amp; Razorpay Gateway
            </h3>
            <p className="text-xs text-slate-500 font-light max-w-lg">
              Receives payments from any mobile UPI application (GPay, PhonePe, Paytm, BHIM, Cred) directly linked to your business account.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-mono text-slate-700 font-semibold bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#EAE3D9]">
                UPI VPA: {gatewaySettings?.merchantVpa || 'nammayatra.sarathi@icici'}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                Key ID: {gatewaySettings?.razorpayKeyId || 'rzp_test_...'}
              </span>
            </div>
          </div>
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0E131F] hover:bg-black text-white text-xs font-semibold shadow-xs transition"
          >
            <Edit2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Configure Razorpay &amp; QR</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Gross Payment Volume</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700">
            ₹{totalAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">100% Direct Driver Settlement</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Aggregator Margin</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">₹0.00 (0%)</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Zero Commission Model</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Gateway Success Rate</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">100%</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Zero Settlement Failures</span>
        </div>
      </div>

      {/* Gateway Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 text-left animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-[#B68D40] flex items-center justify-center font-bold">
                  ⚡
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Razorpay &amp; QR Configuration</h4>
                  <p className="text-[10px] text-slate-500">Live &amp; Sandbox API Credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGatewaySettings} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Razorpay Key ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.razorpayKeyId}
                  onChange={(e) => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                  placeholder="rzp_test_... or rzp_live_..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Razorpay Key Secret *
                </label>
                <input
                  type="password"
                  required
                  value={formData.razorpayKeySecret}
                  onChange={(e) => setFormData({ ...formData, razorpayKeySecret: e.target.value })}
                  placeholder="Enter Key Secret"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Stored securely with server-side HMAC validation.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Merchant UPI ID / VPA *
                </label>
                <input
                  type="text"
                  required
                  value={formData.merchantVpa}
                  onChange={(e) => setFormData({ ...formData, merchantVpa: e.target.value })}
                  placeholder="e.g. nammayatra@okhdfcbank or travelindia@icici"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Merchant Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.merchantName}
                  onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                  placeholder="e.g. Travel India Expeditions"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-5 py-2 bg-[#0E131F] hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {savingSettings ? 'Saving...' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search txn ID, booking ref, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B99762]"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D9] text-slate-500 font-semibold uppercase text-[10px] tracking-wider bg-[#FAF7F2]">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]/60 text-slate-700">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#EAE3D9]">
                      {p.transaction_id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{p.booking_number}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{p.customer_name}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#EAE3D9] font-mono text-[10px] font-semibold text-slate-700 uppercase">
                      {p.payment_method || 'UPI DIRECT'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-slate-900 text-sm">
                    ₹{Number(p.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{p.status || 'SUCCESS'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. MANAGE ENQUIRIES PAGE (CRM LEADS PIPELINE) - QUIET LUXURY THEME
// ----------------------------------------------------------------------
export function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const { showToast } = useToast();

  const loadEnquiries = async () => {
    try {
      const res = await api.get('/admin/enquiries');
      if (res.success) setEnquiries(res.data || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/admin/enquiries/${id}`, { status });
      if (res.success) {
        showToast(`Enquiry status updated to ${status}`, 'success');
        loadEnquiries();
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const filteredEnquiries = filterStatus === 'ALL'
    ? enquiries
    : enquiries.filter((e) => e.status === filterStatus);

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141A26] via-[#1B2332] to-[#121620] text-white rounded-3xl p-6 sm:p-8 border border-[#232B3E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A74A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold text-[#D9A74A] uppercase tracking-widest bg-[#D9A74A]/15 px-3 py-1 rounded-full border border-[#D9A74A]/30">
            Leads Pipeline
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal mt-2">
            Custom Trip Enquiries &amp; Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            Prospective travellers requesting custom itineraries, hotel upgrades, and tailored quotes
          </p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap relative z-10">
          {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === tab
                  ? 'bg-[#B99762] text-white shadow-xs font-bold'
                  : 'bg-white/10 text-slate-300 hover:text-white border border-white/15'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Grid - Crisp Luxury Cards */}
      <div className="space-y-4">
        {filteredEnquiries.map((e) => (
          <div
            key={e.id}
            className="bg-white p-6 rounded-2xl border border-[#EAE3D9] space-y-4 shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] hover:border-[#B99762]/50 transition-colors"
          >
            {/* Top Row: Lead Info & Status Picker */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3D9]/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D9A74A] to-[#A37B31] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {e.name?.[0]?.toUpperCase() || 'L'}
                </div>
                <div>
                  <h3 className="font-serif text-lg text-slate-900 font-semibold">{e.name}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {e.email} • <span className="text-slate-800 font-medium">{e.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {e.phone && (
                  <div className="flex items-center gap-1.5 mr-2">
                    <a
                      href={`tel:${e.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 shadow-xs transition-colors"
                    >
                      <Phone className="w-3 h-3 text-[#B99762]" />
                      <span>Call Lead</span>
                    </a>
                    <a
                      href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Namaste ${e.name}, thank you for your custom trip enquiry to ${e.destination} with Travel India! I am your dedicated travel coordinator. Let's customize your itinerary!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp Quote</span>
                    </a>
                  </div>
                )}

                <select
                  value={e.status}
                  onChange={(evt) => updateStatus(e.id, evt.target.value)}
                  className="bg-[#FAF7F2] text-xs font-semibold text-slate-800 border border-[#EAE3D9] rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            {/* Middle Grid: Trip Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EAE3D9]">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Destination</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{e.destination}</span>
              </div>
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EAE3D9]">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Approx Budget</span>
                <span className="font-serif font-bold text-emerald-700 mt-0.5 block">{e.budget}</span>
              </div>
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EAE3D9]">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Party Size</span>
                <span className="font-semibold text-slate-900 mt-0.5 block">{e.travellers_count} Persons</span>
              </div>
              <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EAE3D9]">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block tracking-wider">Hotel Preference</span>
                <span className="font-semibold text-[#B99762] mt-0.5 block">{e.hotel_category || 'Heritage / 4★'}</span>
              </div>
            </div>

            {/* Custom Notes */}
            {e.message && (
              <div className="p-3.5 bg-[#FAF7F2]/60 rounded-xl border border-[#EAE3D9] text-xs text-slate-600 leading-relaxed italic">
                "{e.message}"
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. REVIEW MODERATION PAGE - QUIET LUXURY THEME
// ----------------------------------------------------------------------
export function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/reviews');
      if (res.success) setReviews(res.data || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const moderate = async (id, status) => {
    try {
      const res = await api.put(`/admin/reviews/${id}/moderate`, { status });
      if (res.success) {
        showToast(res.message, 'success');
        loadReviews();
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141A26] via-[#1B2332] to-[#121620] text-white rounded-3xl p-6 sm:p-8 border border-[#232B3E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A74A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold text-[#D9A74A] uppercase tracking-widest bg-[#D9A74A]/15 px-3 py-1 rounded-full border border-[#D9A74A]/30">
            Trust &amp; Verification
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal mt-2">
            Review Moderation Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            Review and publish customer testimonials and verified star ratings for tour packages
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs backdrop-blur-xs relative z-10">
          <span className="text-slate-300 block text-[10px] font-semibold uppercase tracking-wider">Total Reviews</span>
          <span className="text-[#D9A74A] font-serif font-bold text-base">{reviews.length}</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-2xl border border-[#EAE3D9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] hover:border-[#B99762]/50 transition-colors"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900 text-sm">{r.customer_name}</span>
                <span className="text-amber-500 text-xs font-bold tracking-widest">
                  {'★'.repeat(r.rating || 5)}
                </span>
                <span className="text-xs text-slate-400 font-medium">for {r.tour_title}</span>
              </div>
              <p className="font-semibold text-xs text-slate-800">{r.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed italic">"{r.review}"</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => moderate(r.id, 'APPROVED')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95"
              >
                Approve
              </button>
              <button
                onClick={() => moderate(r.id, 'REJECTED')}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs px-3.5 py-2 rounded-xl border border-rose-200 transition-all active:scale-95"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 6. MANAGE COUPONS PAGE - QUIET LUXURY THEME
// ----------------------------------------------------------------------
export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState('');
  const [type, setType] = useState('PERCENT');
  const [value, setValue] = useState('');
  const [minAmount, setMinAmount] = useState('500');
  const { showToast } = useToast();

  const loadCoupons = async () => {
    try {
      const res = await api.get('/admin/coupons');
      if (res.success) setCoupons(res.data || []);
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/coupons', {
        code,
        discountType: type,
        discountValue: value,
        minimumAmount: minAmount
      });
      if (res.success) {
        showToast('Coupon created successfully.', 'success');
        setCode('');
        setValue('');
        loadCoupons();
      }
    } catch (err) {
      showToast(err.message || 'error');
    }
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141A26] via-[#1B2332] to-[#121620] text-white rounded-3xl p-6 sm:p-8 border border-[#232B3E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A74A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold text-[#D9A74A] uppercase tracking-widest bg-[#D9A74A]/15 px-3 py-1 rounded-full border border-[#D9A74A]/30">
            Marketing &amp; Promotions
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal mt-2">
            Discount Coupons &amp; Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            Create promotional codes, seasonal discounts, and customer incentives
          </p>
        </div>

        <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-xs backdrop-blur-xs relative z-10">
          <span className="text-slate-300 block text-[10px] font-semibold uppercase tracking-wider">Active Coupons</span>
          <span className="text-[#D9A74A] font-serif font-bold text-base">{coupons.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <form
          onSubmit={handleCreateCoupon}
          className="bg-white p-6 rounded-2xl border border-[#EAE3D9] space-y-4 text-xs shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)]"
        >
          <h3 className="font-serif text-xl text-slate-900 font-normal">Generate New Coupon</h3>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. BHARAT15"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2 text-slate-800 font-mono uppercase focus:outline-none focus:border-[#B99762]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2 text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="PERCENT">Percentage (%)</option>
                <option value="FLAT">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Discount Value</label>
              <input
                type="number"
                required
                placeholder="15"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Min Order Amount (₹)</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2 text-slate-800 focus:outline-none font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#B99762] to-[#9E7B3B] hover:from-[#C5A36E] hover:to-[#AC8846] text-white font-bold py-3 rounded-xl shadow-md shadow-[#B99762]/20 transition-all"
          >
            Create Coupon
          </button>
        </form>

        {/* Coupons List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EAE3D9] p-6 space-y-4 shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)]">
          <h3 className="font-serif text-xl text-slate-900 font-normal">Active Promotional Vouchers</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-[#FAF7F2] rounded-xl border border-dashed border-[#EAE3D9] flex items-center justify-between text-xs space-y-1 hover:border-[#B99762]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#B99762] bg-[#B99762]/10 px-2.5 py-1 rounded-md border border-[#B99762]/20 text-sm">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-slate-800 font-semibold mt-1.5 text-xs">
                    {c.discount_type === 'PERCENT' ? `${c.discount_value}% Off Order` : `₹${c.discount_value} Flat Off`}
                  </p>
                  <p className="text-[10px] text-slate-500">Min spend: ₹{c.minimum_order_amount || 500}</p>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-medium">Redemptions</span>
                  <span className="font-serif font-bold text-slate-900 text-base">{c.times_used || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
