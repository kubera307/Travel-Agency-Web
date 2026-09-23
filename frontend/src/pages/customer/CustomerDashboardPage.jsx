import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../utils/api';
import {
  Luggage,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Heart,
  MessageSquare,
  Printer,
  CheckCircle,
  Phone,
  Car,
  UserCheck
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/bookings');
        if (res.success) {
          setBookings(res.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const upcomingBooking = bookings.find(
    (b) => b.booking_status === 'CONFIRMED' && new Date(b.departure_date) >= new Date()
  ) || bookings[0];

  let assignedDriver = null;
  if (upcomingBooking?.assigned_driver) {
    try {
      assignedDriver = typeof upcomingBooking.assigned_driver === 'string'
        ? JSON.parse(upcomingBooking.assigned_driver)
        : upcomingBooking.assigned_driver;
    } catch {
      assignedDriver = null;
    }
  }

  // Trip Status Timeline Steps
  const timelineSteps = [
    { key: 'booked', label: 'Trip Booked', done: true, desc: 'Reservation confirmed' },
    { key: 'paid', label: 'Payment Settled', done: upcomingBooking?.payment_status === 'PAID', desc: '100% direct to driver' },
    { key: 'driver', label: 'Sarathi Assigned', done: !!assignedDriver || upcomingBooking?.booking_status === 'CONFIRMED', desc: assignedDriver?.name || 'Verified driver' },
    { key: 'departure', label: 'Ready for Travel', done: false, desc: upcomingBooking?.departure_date || 'Upcoming' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            Namaste, {user?.name?.split(' ')[0]}! 🙏
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome to your travel command center. View upcoming departures and travel passes.
          </p>
        </div>

        <Link
          to="/tours"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <span>Explore New Tours</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xl">
            🧳
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Bookings</p>
            <p className="font-display font-black text-2xl text-slate-900 mt-0.5">
              {bookings.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Confirmed Trips</p>
            <p className="font-display font-black text-2xl text-slate-900 mt-0.5">
              {bookings.filter((b) => b.booking_status === 'CONFIRMED').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            ★
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Sarathi Status</p>
            <p className="font-display font-bold text-sm text-slate-900 mt-0.5">
              Direct Fare Member
            </p>
          </div>
        </div>
      </div>

      {/* 1. Highlight: Upcoming Trip Banner with Timeline */}
      {upcomingBooking && (
        <div className="bg-gradient-to-r from-[#0B192C] to-[#1E3E62] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                ● Next Confirmed Trip
              </span>
              <span className="text-xs text-slate-300 font-mono">
                #{upcomingBooking.booking_number}
              </span>
            </div>
            <span className="text-xs font-bold text-amber-400">
              {upcomingBooking.payment_status === 'PAID' ? '✓ 100% Direct Driver Payment Settled' : 'Payment Pending'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 space-y-1">
              <h3 className="font-display font-black text-xl text-white">
                {upcomingBooking.tour_title}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Pickup: {upcomingBooking.pickup_point || 'City Center'}</span>
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Departure Date</p>
              <p className="font-display font-bold text-base text-white mt-0.5">
                {upcomingBooking.departure_date}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">{upcomingBooking.traveller_count} Guests</p>
            </div>

            <div className="flex flex-col justify-between items-start md:items-end">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Amount Paid</p>
                <p className="font-display font-black text-xl text-amber-400">
                  {formatPrice(upcomingBooking.grand_total)}
                </p>
              </div>

              <Link
                to={`/customer/bookings/${upcomingBooking.id}`}
                className="mt-3 inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View &amp; Print Ticket Pass</span>
              </Link>
            </div>
          </div>

          {/* Trip Status Visual Timeline */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
              Trip Journey Timeline
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {timelineSteps.map((step, idx) => (
                <div
                  key={step.key}
                  className={`p-3 rounded-xl border flex flex-col justify-between ${
                    step.done
                      ? 'bg-white/10 border-emerald-500/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Step {idx + 1}
                    </span>
                    {step.done ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-500"></div>
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${step.done ? 'text-white' : 'text-slate-300'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Sarathi Card */}
          {assignedDriver && (
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl border border-orange-500/30">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{assignedDriver.name}</h4>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                      {assignedDriver.badge || 'Verified Sarathi'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                    <Car className="w-3.5 h-3.5 text-orange-400" />
                    <span>{assignedDriver.vehicle || 'Commercial AC Vehicle'}</span>
                    <span>•</span>
                    <span className="text-amber-400">★ {assignedDriver.rating || '4.97'}</span>
                  </p>
                </div>
              </div>

              {assignedDriver.phone && (
                <a
                  href={`tel:${assignedDriver.phone}`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all self-stretch sm:self-auto justify-center"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Sarathi</span>
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Recent Bookings Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-sm text-slate-900">Recent Tour Bookings</h3>
          <Link to="/customer/bookings" className="text-xs font-bold text-orange-600 hover:underline">
            View All ({bookings.length})
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No bookings found yet. Explore our curated tours and book your first journey!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">Booking ID</th>
                  <th className="py-2.5">Tour Package</th>
                  <th className="py-2.5">Departure Date</th>
                  <th className="py-2.5">Guests</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="py-3 font-mono font-bold text-slate-900">{b.booking_number}</td>
                    <td className="py-3 font-semibold text-slate-800 max-w-xs truncate">{b.tour_title}</td>
                    <td className="py-3 text-slate-600">{b.departure_date}</td>
                    <td className="py-3 text-slate-600">{b.traveller_count}</td>
                    <td className="py-3 font-bold text-slate-900">{formatPrice(b.grand_total)}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.booking_status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : b.booking_status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {b.booking_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/customer/bookings/${b.id}`}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700"
                      >
                        Pass →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
