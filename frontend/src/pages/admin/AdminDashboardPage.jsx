import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import {
  Users,
  Luggage,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Calendar,
  Download,
  Filter,
  Plus,
  Phone,
  MessageCircle,
  Sparkles,
  MapPin,
  ShieldCheck,
  Wallet,
  Compass,
  Tag,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashRes, repRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/reports')
        ]);
        if (dashRes.success) setStats(dashRes.data);
        if (repRes.success) setReports(repRes.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeRange]);

  const exportBookingsCsv = () => {
    if (!stats?.recentBookings || stats.recentBookings.length === 0) return;
    const headers = ['Booking ID', 'Customer', 'Tour', 'Grand Total', 'Status'];
    const rows = stats.recentBookings.map((b) => [
      b.booking_number,
      `"${b.customer_name}"`,
      `"${b.tour_title}"`,
      b.grand_total,
      b.booking_status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travel_india_bookings_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !stats) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 space-y-3">
        <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-semibold text-slate-300">Loading operations console...</p>
      </div>
    );
  }

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Calculate max bookings and revenue for percentage bars
  const maxTourBookings = Math.max(
    1,
    ...(reports?.popularTours?.map((t) => t.bookings_count) || [1])
  );
  const maxDestRevenue = Math.max(
    1,
    ...(reports?.popularDestinations?.map((d) => d.total_revenue) || [1])
  );

  return (
    <div className="space-y-8 w-full">
      {/* 1. Executive Operations Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1A32] via-[#122549] to-[#0A162C] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-orange-400 uppercase tracking-widest bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE OPERATIONS CENTER</span>
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              • {currentDateStr}
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            Executive Command Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time telemetry on customer reservations, 100% direct driver UPI settlements, and custom trip leads.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          {/* Time Filter Pills */}
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 text-xs shadow-inner">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '3m', label: '3M' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  timeRange === tab.id
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={exportBookingsCsv}
            className="inline-flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-2xl transition-all border border-slate-700/80 shadow-xs active:scale-95"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <Link
            to="/admin/tours"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-2xl shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tour</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Revenue */}
        <div className="bg-[#0D192F] p-6 rounded-3xl border border-slate-800/80 shadow-sm space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Total Gross Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-base shadow-sm">
              ₹
            </div>
          </div>

          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-white">
              ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </p>
            <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-400">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>100% Direct</span>
                <span className="text-slate-500">• Driver UPI</span>
              </span>
              <span className="font-semibold text-emerald-400">0% Commission</span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Metric 2: Bookings */}
        <div className="bg-[#0D192F] p-6 rounded-3xl border border-slate-800/80 shadow-sm space-y-3 relative overflow-hidden group hover:border-orange-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Total Reservations
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center justify-center shadow-sm">
              <Luggage className="w-5 h-5" />
            </div>
          </div>

          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-white">
              {stats?.totalBookings || 0}
            </p>
            <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-400">
              <span className="text-orange-400 font-bold">
                {stats?.confirmedBookings || 0} Confirmed
              </span>
              <span className="font-semibold text-slate-400">100% Ready</span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Metric 3: Customers */}
        <div className="bg-[#0D192F] p-6 rounded-3xl border border-slate-800/80 shadow-sm space-y-3 relative overflow-hidden group hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Customer Accounts
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-white">
              {stats?.totalCustomers || 0}
            </p>
            <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-400">
              <span className="text-blue-400 font-bold">Active Profiles</span>
              <span className="font-semibold text-slate-400">Verified</span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Metric 4: Enquiries */}
        <div className="bg-[#0D192F] p-6 rounded-3xl border border-slate-800/80 shadow-sm space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Active Enquiries
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div>
            <p className="font-display font-black text-2xl sm:text-3xl text-white">
              {stats?.activeEnquiries || 0}
            </p>
            <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-400">
              <span className="text-amber-400 font-bold">Trip Leads</span>
              <Link to="/admin/enquiries" className="text-orange-400 hover:underline font-bold">
                Follow Up →
              </Link>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full w-full"></div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Operations Bar */}
      <div className="bg-[#0D192F] p-4 rounded-3xl border border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider">
          Quick Shortcuts:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/tours"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-orange-400" />
            <span>Manage 33 Tours</span>
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all"
          >
            <Luggage className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manage Bookings</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Custom Leads ({stats?.activeEnquiries || 7})</span>
          </Link>
          <Link
            to="/admin/coupons"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all"
          >
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <span>Promo Coupons</span>
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/80 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp Lead Chat</span>
          </a>
        </div>
      </div>

      {/* 4. Analytics: Top Tours & Destinations with Progress Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tours */}
        <div className="bg-[#0D192F] p-6 sm:p-7 rounded-3xl border border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-base text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span>Top Performing Tours</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">By Bookings</span>
          </div>

          <div className="space-y-3">
            {reports?.popularTours?.map((t, idx) => {
              const pct = Math.round((t.bookings_count / maxTourBookings) * 100);
              return (
                <div
                  key={t.id}
                  className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800/70 text-xs hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 truncate max-w-sm">
                      <span className="w-6 h-6 rounded-lg bg-orange-500/15 text-orange-400 font-black text-[11px] flex items-center justify-center shrink-0">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </span>
                      <span className="font-bold text-slate-200 truncate">{t.title}</span>
                    </div>
                    <span className="font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg shrink-0">
                      {t.bookings_count} Bookings
                    </span>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-[#0D192F] p-6 sm:p-7 rounded-3xl border border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-base text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Top Destination Revenue</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">By Gross Value</span>
          </div>

          <div className="space-y-3">
            {reports?.popularDestinations?.map((d, idx) => {
              const pct = Math.round((d.total_revenue / maxDestRevenue) * 100);
              return (
                <div
                  key={idx}
                  className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800/70 text-xs hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 font-black text-[11px] flex items-center justify-center shrink-0">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                      </span>
                      <span className="font-bold text-slate-200">{d.name}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      ₹{Number(d.total_revenue).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Recent Bookings Table with Quick-Contact Actions */}
      <div className="bg-[#0D192F] p-6 sm:p-7 rounded-3xl border border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-base text-white">Recent Customer Bookings</h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest trip reservations with instant 1-click contact tools</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] bg-slate-900/60">
                <th className="py-3 px-4 rounded-l-xl">Ref Number</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Tour Package</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stats?.recentBookings?.map((b) => (
                <tr key={b.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-white">
                    <span className="bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                      {b.booking_number}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {b.customer_name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <div className="font-bold text-white">{b.customer_name}</div>
                        <div className="text-[11px] text-slate-400">{b.customer_phone || b.customer_email || 'No phone provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 truncate max-w-xs font-medium text-slate-200">
                    {b.tour_title}
                  </td>
                  <td className="py-4 px-4 font-mono font-black text-amber-400 text-sm">
                    ₹{Number(b.grand_total).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{b.booking_status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {b.customer_phone ? (
                      <div className="inline-flex items-center gap-2 justify-end">
                        <a
                          href={`tel:${b.customer_phone.replace(/[^0-9+]/g, '')}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
                          title="Call customer"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${b.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${b.customer_name}, regarding your NammaYathra booking (${b.booking_number}): ${b.tour_title}...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-xs font-bold transition-all"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 justify-end">
                        <a
                          href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi ${b.customer_name}, regarding your booking ${b.booking_number}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 text-emerald-400 text-[10px] font-bold"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
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
