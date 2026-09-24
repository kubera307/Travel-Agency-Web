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
      <div className="py-24 text-center text-xs text-slate-500 space-y-3">
        <div className="w-10 h-10 border-2 border-[#B99762] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-semibold text-slate-700">Loading operations console...</p>
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
      {/* 1. Executive Operations Header Banner - Quiet Luxury Theme */}
      <div className="bg-gradient-to-r from-[#141A26] via-[#1B2332] to-[#121620] text-white rounded-3xl p-6 sm:p-8 border border-[#232B3E] shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle radial luxury glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A74A]/10 rounded-full blur-3xl pointer-events-none -z-0" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#B99762]/10 rounded-full blur-2xl pointer-events-none -z-0" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9A74A] uppercase tracking-widest bg-[#D9A74A]/15 px-3 py-1 rounded-full border border-[#D9A74A]/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE OPERATIONS CENTER</span>
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              • {currentDateStr}
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal tracking-tight">
            Executive Command Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-light leading-relaxed">
            Real-time telemetry on customer reservations, 100% direct driver UPI settlements, and custom trip leads across Bharat.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 flex-wrap">
          {/* Time Filter Pills */}
          <div className="bg-black/35 p-1 rounded-xl border border-white/10 flex items-center gap-1 text-xs shadow-inner">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '3m', label: '3M' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                  timeRange === tab.id
                    ? 'bg-[#B99762] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={exportBookingsCsv}
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all border border-white/15 shadow-xs active:scale-95"
            title="Export CSV Manifest"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <Link
            to="/admin/tours"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#B99762] to-[#9E7B3B] hover:from-[#C5A36E] hover:to-[#AC8846] text-white font-bold text-xs px-4.5 py-2.5 rounded-xl shadow-md shadow-[#B99762]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Tour</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics KPI Cards Grid - Crisp Luxury Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-3.5 relative overflow-hidden group hover:border-[#B99762] hover:shadow-[0_8px_30px_rgba(29,27,24,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total Gross Revenue
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-base shadow-xs">
              ₹
            </div>
          </div>

          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </p>
            <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-500">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span>100% Direct</span>
                <span className="text-slate-400">• Driver UPI</span>
              </span>
              <span className="font-semibold text-emerald-700">0% Cut</span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden border border-[#EAE3D9]/60">
            <div className="bg-emerald-600 h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Metric 2: Bookings */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-3.5 relative overflow-hidden group hover:border-[#B99762] hover:shadow-[0_8px_30px_rgba(29,27,24,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Total Reservations
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shadow-xs">
              <Luggage className="w-5 h-5 text-[#B99762]" />
            </div>
          </div>

          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {stats?.totalBookings || 0}
            </p>
            <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-500">
              <span className="text-[#B99762] font-semibold">
                {stats?.confirmedBookings || 0} Confirmed
              </span>
              <span className="font-medium text-slate-400">100% Scheduled</span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden border border-[#EAE3D9]/60">
            <div className="bg-[#B99762] h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Metric 3: Customers */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-3.5 relative overflow-hidden group hover:border-[#B99762] hover:shadow-[0_8px_30px_rgba(29,27,24,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Customer Accounts
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5 text-blue-700" />
            </div>
          </div>

          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {stats?.totalCustomers || 0}
            </p>
            <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-500">
              <span className="text-blue-700 font-semibold">Active Profiles</span>
              <span className="font-medium text-slate-400">Verified</span>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden border border-[#EAE3D9]/60">
            <div className="bg-blue-600 h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Metric 4: Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-3.5 relative overflow-hidden group hover:border-[#B99762] hover:shadow-[0_8px_30px_rgba(29,27,24,0.08)] transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Active Trip Leads
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#B99762] border border-[#EAE3D9] flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {stats?.activeEnquiries || 0}
            </p>
            <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-500">
              <span className="text-amber-700 font-semibold">Trip Inquiries</span>
              <Link to="/admin/enquiries" className="text-[#B99762] hover:text-[#9E7B3B] font-semibold flex items-center gap-0.5">
                <span>Follow Up</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Mini progress bar */}
          <div className="w-full bg-[#FAF7F2] h-1.5 rounded-full overflow-hidden border border-[#EAE3D9]/60">
            <div className="bg-[#D9A74A] h-full rounded-full w-full"></div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Operations Bar - Quiet Luxury Style */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 px-3 uppercase tracking-wider">
          Quick Operations Shortcuts:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/tours"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F3EDE2] text-slate-700 border border-[#EAE3D9] transition-all"
          >
            <Compass className="w-3.5 h-3.5 text-[#B99762]" />
            <span>Manage 33 Tours</span>
          </Link>
          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F3EDE2] text-slate-700 border border-[#EAE3D9] transition-all"
          >
            <Luggage className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manage Bookings</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Custom Leads ({stats?.activeEnquiries || 7})</span>
          </Link>
          <Link
            to="/admin/coupons"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] hover:bg-[#F3EDE2] text-slate-700 border border-[#EAE3D9] transition-all"
          >
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span>Promo Coupons</span>
          </Link>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Lead Chat</span>
          </a>
        </div>
      </div>

      {/* 4. Analytics: Top Tours & Destinations with Progress Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tours */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D9]/60 pb-3.5">
            <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-normal flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#B99762]" />
              <span>Top Performing Tours</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">By Bookings</span>
          </div>

          <div className="space-y-3">
            {reports?.popularTours?.map((t, idx) => {
              const pct = Math.round((t.bookings_count / maxTourBookings) * 100);
              return (
                <div
                  key={t.id}
                  className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EAE3D9]/70 text-xs hover:border-[#B99762]/50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 truncate max-w-sm">
                      <span className="w-6 h-6 rounded-lg bg-[#B99762]/15 text-[#B99762] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                        {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{t.title}</span>
                    </div>
                    <span className="font-mono font-bold text-[#B99762] bg-[#B99762]/10 px-2.5 py-1 rounded-md shrink-0 border border-[#B99762]/20">
                      {t.bookings_count} Bookings
                    </span>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#B99762] to-[#9E7B3B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D9]/60 pb-3.5">
            <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-normal flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Top Destination Revenue</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">By Gross Value</span>
          </div>

          <div className="space-y-3">
            {reports?.popularDestinations?.map((d, idx) => {
              const pct = Math.round((d.total_revenue / maxDestRevenue) * 100);
              return (
                <div
                  key={idx}
                  className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EAE3D9]/70 text-xs hover:border-emerald-300 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-serif font-bold text-xs flex items-center justify-center shrink-0">
                        {idx === 0 ? '1' : idx === 1 ? '2' : idx === 2 ? '3' : idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800">{d.name}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      ₹{Number(d.total_revenue).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
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
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE3D9]/60 pb-3.5">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-normal">Recent Customer Bookings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest trip reservations with instant 1-click driver dispatch and customer contact</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-semibold text-[#B99762] hover:text-[#9E7B3B] flex items-center gap-1 transition-colors"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D9] text-slate-500 font-semibold uppercase text-[10px] tracking-wider bg-[#FAF7F2]">
                <th className="py-3 px-4 rounded-l-xl">Ref Number</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Tour Package</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Direct Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]/60 text-slate-700">
              {stats?.recentBookings?.map((b) => (
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
                        <div className="text-[11px] text-slate-500">{b.customer_phone || b.customer_email || 'No phone provided'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 truncate max-w-xs font-medium text-slate-700">
                    {b.tour_title}
                  </td>
                  <td className="py-3.5 px-4 font-serif font-bold text-slate-900 text-sm">
                    ₹{Number(b.grand_total).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{b.booking_status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {b.customer_phone ? (
                      <div className="inline-flex items-center gap-2 justify-end">
                        <a
                          href={`tel:${b.customer_phone.replace(/[^0-9+]/g, '')}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-all border border-slate-200 shadow-xs"
                          title="Call customer"
                        >
                          <Phone className="w-3 h-3 text-[#B99762]" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${b.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${b.customer_name}, regarding your Travel India reservation (${b.booking_number}): ${b.tour_title}...`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-all shadow-xs"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 justify-end">
                        <a
                          href={`https://wa.me/919876543210?text=${encodeURIComponent(`Namaste ${b.customer_name}, regarding your reservation ${b.booking_number}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold"
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
