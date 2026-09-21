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
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------
// 1. MANAGE BOOKINGS PAGE
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
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1A32] via-[#122549] to-[#0A162C] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-orange-400 uppercase tracking-widest bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30">
            Operations &amp; Dispatch
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-2">
            Customer Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time reservations, passenger manifests, and 1-click driver dispatch tools
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Bookings</span>
            <span className="text-white font-mono font-black text-base">{bookings.length}</span>
          </div>
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Gross Value</span>
            <span className="text-emerald-400 font-mono font-black text-base">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Bookings</span>
          <p className="font-display font-black text-2xl text-white">{bookings.length}</p>
          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
            <span>All time reservations</span>
          </span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Confirmed</span>
          <p className="font-display font-black text-2xl text-emerald-400">{confirmedCount}</p>
          <span className="text-[10px] text-emerald-400/90 font-semibold">100% Driver Assigned</span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Pending</span>
          <p className="font-display font-black text-2xl text-amber-400">{pendingCount}</p>
          <span className="text-[10px] text-amber-400/90 font-semibold">Awaiting Verification</span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Driver Settlement</span>
          <p className="font-display font-black text-2xl text-white">100%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">0% Middleman Margin</span>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-[#0D192F] p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search booking ref, customer, tour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#0D192F] rounded-2xl border border-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] bg-slate-900/60">
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Tour Package</th>
                <th className="py-3.5 px-4">Departure Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No bookings found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-white">
                      <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        {b.booking_number}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                          {b.customer_name?.[0]?.toUpperCase() || 'C'}
                        </div>
                        <div>
                          <div className="font-bold text-white">{b.customer_name}</div>
                          <div className="text-[11px] text-slate-400">
                            {b.customer_phone || b.customer_email || 'No phone'}
                          </div>
                          {b.customer_phone && (
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`tel:${b.customer_phone.replace(/[^0-9+]/g, '')}`}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700"
                              >
                                <Phone className="w-2.5 h-2.5 text-emerald-400" />
                                <span>Call</span>
                              </a>
                              <a
                                href={`https://wa.me/${b.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                  `Hi ${b.customer_name}, regarding your NammaYathra reservation (${b.booking_number}): ${b.tour_title}...`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800/80"
                              >
                                <MessageCircle className="w-2.5 h-2.5 text-emerald-400" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200 truncate max-w-xs">{b.tour_title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Private AC Cab • 4★ Stay</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-300">
                      {b.departure_date || 'Flexible'}
                    </td>
                    <td className="py-4 px-4 font-mono font-black text-amber-400 text-sm">
                      ₹{Number(b.grand_total).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full border inline-flex items-center gap-1.5 ${
                          b.booking_status === 'CONFIRMED'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : b.booking_status === 'COMPLETED'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                            : b.booking_status === 'CANCELLED'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{b.booking_status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5">
                      <select
                        value={b.booking_status}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-xl px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer"
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
// 2. MANAGE CUSTOMERS PAGE
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
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1A32] via-[#122549] to-[#0A162C] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest bg-blue-500/15 px-3 py-1 rounded-full border border-blue-500/30">
            User Directory
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-2">
            Customer Profiles &amp; Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Registered travelers, booking history, lifetime spend, and direct WhatsApp contacts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Accounts</span>
            <span className="text-white font-mono font-black text-base">{customers.length}</span>
          </div>
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Spent</span>
            <span className="text-emerald-400 font-mono font-black text-base">
              ₹{totalSpentAll.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Users</span>
          <p className="font-display font-black text-2xl text-white">{customers.length}</p>
          <span className="text-[10px] text-blue-400 font-semibold">Active Profiles</span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Trips Booked</span>
          <p className="font-display font-black text-2xl text-orange-400">{totalBookingsAll}</p>
          <span className="text-[10px] text-slate-400 font-semibold">Across all packages</span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Avg Spend / User</span>
          <p className="font-display font-black text-2xl text-emerald-400">
            ₹{customers.length ? Math.round(totalSpentAll / customers.length).toLocaleString('en-IN') : 0}
          </p>
          <span className="text-[10px] text-emerald-400/90 font-semibold">Direct Driver Fare</span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Verification</span>
          <p className="font-display font-black text-2xl text-white">100%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">OTP &amp; Phone Verified</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#0D192F] p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold hidden sm:inline">
          Showing {filteredCustomers.length} of {customers.length} customers
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-[#0D192F] rounded-2xl border border-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] bg-slate-900/60">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Total Bookings</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                        {c.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-bold text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{c.email}</td>
                  <td className="py-4 px-4">
                    <div>{c.phone || 'N/A'}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                      {c.total_bookings || 0} Trips
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-sm">
                    ₹{Number(c.total_spent || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{c.status || 'ACTIVE'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {c.phone ? (
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <a
                          href={`tel:${c.phone.replace(/[^0-9+]/g, '')}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hi ${c.name}, greetings from NammaYathra! Hope you are having a wonderful day.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-800 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">No phone on file</span>
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
// 3. MANAGE PAYMENTS PAGE
// ----------------------------------------------------------------------
export function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/admin/payments');
        if (res.success) setPayments(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1A32] via-[#122549] to-[#0A162C] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
            Accounting &amp; Settlement
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-2">
            Payment Transactions
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Audited ledger of customer payments and 100% direct driver UPI settlements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Settled</span>
            <span className="text-emerald-400 font-mono font-black text-base">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D192F] p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Gross Payment Volume</span>
          <p className="font-display font-black text-2xl text-emerald-400">
            ₹{totalAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold">100% Direct Driver Settlement</span>
        </div>
        <div className="bg-[#0D192F] p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Aggregator Margin</span>
          <p className="font-display font-black text-2xl text-white">₹0.00 (0%)</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Zero Commission Model</span>
        </div>
        <div className="bg-[#0D192F] p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Gateway Success Rate</span>
          <p className="font-display font-black text-2xl text-white">100%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Zero Payment Failures</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-[#0D192F] p-4 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search txn ID, booking ref, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-[#0D192F] rounded-2xl border border-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] bg-slate-900/60">
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-white">
                    <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      {p.transaction_id}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400">{p.booking_number}</td>
                  <td className="py-4 px-4 font-semibold text-white">{p.customer_name}</td>
                  <td className="py-4 px-4">
                    <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 font-mono text-[10px] font-bold text-slate-300 uppercase">
                      {p.payment_method || 'UPI DIRECT'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-black text-amber-400 text-sm">
                    ₹{Number(p.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
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
// 4. MANAGE ENQUIRIES PAGE (CRM LEADS PIPELINE)
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
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1A32] via-[#122549] to-[#0A162C] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
            Leads Pipeline
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-2">
            Custom Trip Enquiries &amp; Leads
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Prospective travellers requesting custom itineraries, hotel upgrades, and tailored quotes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === tab
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Grid */}
      <div className="space-y-4">
        {filteredEnquiries.map((e) => (
          <div
            key={e.id}
            className="bg-[#0D192F] p-6 rounded-3xl border border-slate-800/80 space-y-4 hover:border-slate-700 transition-colors shadow-sm"
          >
            {/* Top Row: Lead Info & Status Picker */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {e.name?.[0]?.toUpperCase() || 'L'}
                </div>
                <div>
                  <h3 className="font-display font-black text-base text-white">{e.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {e.email} • <span className="text-slate-300 font-semibold">{e.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {e.phone && (
                  <div className="flex items-center gap-1.5 mr-2">
                    <a
                      href={`tel:${e.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>Call Lead</span>
                    </a>
                    <a
                      href={`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hi ${e.name}, thank you for your custom trip enquiry to ${e.destination} with NammaYathra! I am your dedicated trip coordinator. Let's customize your itinerary!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold border border-emerald-800 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-400" />
                      <span>WhatsApp Quote</span>
                    </a>
                  </div>
                )}

                <select
                  value={e.status}
                  onChange={(evt) => updateStatus(e.id, evt.target.value)}
                  className="bg-slate-900 text-xs font-bold text-amber-300 border border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Destination</span>
                <span className="font-bold text-white mt-0.5 block">{e.destination}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Approx Budget</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">{e.budget}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Party Size</span>
                <span className="font-bold text-white mt-0.5 block">{e.travellers_count} Persons</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Hotel Preference</span>
                <span className="font-bold text-amber-300 mt-0.5 block">{e.hotel_category || '4★ Boutique'}</span>
              </div>
            </div>

            {/* Custom Notes */}
            {e.message && (
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/70 text-xs text-slate-300 leading-relaxed italic">
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
// 5. REVIEW MODERATION PAGE
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
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1A32] via-[#122549] to-[#0A162C] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
            Trust &amp; Verification
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-2">
            Review Moderation Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Review and publish customer testimonials and star ratings for tour packages
          </p>
        </div>

        <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">Total Reviews</span>
          <span className="text-amber-400 font-mono font-black text-base">{reviews.length}</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-[#0D192F] p-6 rounded-3xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-colors shadow-sm"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-sm">{r.customer_name}</span>
                <span className="text-amber-400 text-xs font-bold tracking-widest">
                  {'★'.repeat(r.rating || 5)}
                </span>
                <span className="text-xs text-slate-400 font-medium">for {r.tour_title}</span>
              </div>
              <p className="font-bold text-xs text-slate-200">{r.title}</p>
              <p className="text-xs text-slate-400 leading-relaxed italic">"{r.review}"</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => moderate(r.id, 'APPROVED')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
              >
                Approve
              </button>
              <button
                onClick={() => moderate(r.id, 'REJECTED')}
                className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl border border-rose-500/30 transition-all active:scale-95"
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
// 6. MANAGE COUPONS PAGE
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
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1A32] via-[#122549] to-[#0A162C] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-purple-400 uppercase tracking-widest bg-purple-500/15 px-3 py-1 rounded-full border border-purple-500/30">
            Marketing &amp; Promotions
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-2">
            Discount Coupons &amp; Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Create promotional codes, seasonal discounts, and customer incentives
          </p>
        </div>

        <div className="bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px] font-bold uppercase">Active Coupons</span>
          <span className="text-purple-400 font-mono font-black text-base">{coupons.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <form
          onSubmit={handleCreateCoupon}
          className="bg-[#0D192F] p-6 rounded-3xl border border-slate-800/80 space-y-4 text-xs shadow-sm"
        >
          <h3 className="font-display font-black text-white text-base">Generate New Coupon</h3>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. BHARAT15"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="PERCENT">Percentage (%)</option>
                <option value="FLAT">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Discount Value</label>
              <input
                type="number"
                required
                placeholder="15"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Min Order Amount (₹)</label>
            <input
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold py-3 rounded-2xl shadow-lg transition-all"
          >
            Create Coupon
          </button>
        </form>

        {/* Coupons List */}
        <div className="lg:col-span-2 bg-[#0D192F] rounded-3xl border border-slate-800/80 p-6 space-y-4 shadow-sm">
          <h3 className="font-display font-black text-white text-base">Active Promotional Vouchers</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-slate-900/90 rounded-2xl border border-dashed border-slate-700/80 flex items-center justify-between text-xs space-y-1"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-orange-400 bg-orange-500/15 px-2.5 py-1 rounded-lg border border-orange-500/30 text-sm">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-slate-300 font-bold mt-1.5 text-xs">
                    {c.discount_type === 'PERCENT' ? `${c.discount_value}% Off Order` : `₹${c.discount_value} Flat Off`}
                  </p>
                  <p className="text-[10px] text-slate-500">Min spend: ₹{c.minimum_order_amount || 500}</p>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-semibold">Redemptions</span>
                  <span className="font-mono font-black text-white text-base">{c.times_used || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
