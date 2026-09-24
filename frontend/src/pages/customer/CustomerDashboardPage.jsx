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
  CheckCircle2,
  Phone,
  Car,
  UserCheck,
  Award,
  Sparkles,
  MessageCircle,
  ExternalLink
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
    <div className="space-y-8 text-left">
      {/* 1. Welcome & Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1D1B18]/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B99762]/10 border border-[#B99762]/30 text-[#8C6D38] text-[10px] uppercase font-semibold tracking-[0.2em] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B99762] animate-pulse"></span>
            <span>VIP Traveler Command Center</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] font-normal tracking-tight">
            Namaste, {user?.name?.split(' ')[0]}! 🙏
          </h1>
          <p className="text-xs sm:text-sm text-[#6D6A61] mt-1 font-light">
            Welcome to your personal expedition portal. Access upcoming travel passes, Sarathi coordination, and bookings.
          </p>
        </div>

        <Link
          to="/tours"
          className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-2xl shadow-sm transition-all duration-300 self-start sm:self-auto shrink-0"
        >
          <span>Explore New Tours</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:border-[#B99762]/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#B99762]/15 text-[#8C6D38] border border-[#B99762]/30 flex items-center justify-center shrink-0">
            <Luggage className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D6A61]">Total Bookings</p>
            <p className="font-serif text-3xl font-light text-[#1D1B18] mt-0.5">
              {bookings.length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:border-[#B99762]/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D6A61]">Confirmed Trips</p>
            <p className="font-serif text-3xl font-light text-[#1D1B18] mt-0.5">
              {bookings.filter((b) => b.booking_status === 'CONFIRMED').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:border-[#B99762]/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D6A61]">Sarathi Status</p>
            <p className="font-serif text-base font-medium text-[#1D1B18] mt-0.5">
              Direct Fare Patron
            </p>
          </div>
        </div>
      </div>

      {/* 3. Next Confirmed Trip Hero Card */}
      {upcomingBooking && (
        <div className="bg-[#12141A] text-white rounded-3xl p-6 sm:p-8 border border-[#B68D40]/35 shadow-[0_20px_60px_rgba(0,0,0,0.4)] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="bg-[#B68D40]/20 text-[#B68D40] border border-[#B68D40]/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                ● Next Confirmed Expedition
              </span>
              <span className="text-xs text-white/50 font-mono">
                #{upcomingBooking.booking_number}
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {upcomingBooking.payment_status === 'PAID' ? '100% Direct Driver Payment Settled' : 'Payment Awaiting Confirmation'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            <div className="md:col-span-2 space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
                {upcomingBooking.tour_title}
              </h3>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#B68D40]" />
                <span>Pickup Location: {upcomingBooking.pickup_point || 'Hotel / City Center'}</span>
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Departure Date</p>
              <p className="font-serif text-xl font-normal text-white">
                {upcomingBooking.departure_date}
              </p>
              <p className="text-xs text-slate-300 font-light">{upcomingBooking.traveller_count} Guests Reserved</p>
            </div>

            <div className="flex flex-col justify-between items-start md:items-end space-y-3">
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Total Fare</p>
                <p className="font-serif text-2xl font-light text-[#EAD8B1]">
                  {formatPrice(upcomingBooking.grand_total)}
                </p>
              </div>

              <Link
                to={`/customer/bookings/${upcomingBooking.id}`}
                className="inline-flex items-center gap-2 bg-[#B68D40] hover:bg-[#a3824e] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all duration-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>View &amp; Print Pass</span>
              </Link>
            </div>
          </div>

          {/* Trip Status Visual Timeline */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-xs font-bold uppercase tracking-widest text-[#B68D40] mb-4">
              Journey Execution Timeline
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {timelineSteps.map((step, idx) => (
                <div
                  key={step.key}
                  className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                    step.done
                      ? 'bg-white/10 border-[#B68D40]/40 text-white shadow-xs'
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B68D40]">
                      Step 0{idx + 1}
                    </span>
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-white/30"></div>
                    )}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${step.done ? 'text-white' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Sarathi Chauffeur Card */}
          {assignedDriver && (
            <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#B68D40]/20 text-[#B68D40] flex items-center justify-center font-bold text-xl border border-[#B68D40]/30 shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-lg font-medium text-white">{assignedDriver.name}</h4>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                      {assignedDriver.badge || 'Verified Sarathi'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2 font-light">
                    <Car className="w-3.5 h-3.5 text-[#B68D40]" />
                    <span>{assignedDriver.vehicle || 'Commercial AC Vehicle'}</span>
                    <span>•</span>
                    <span className="text-[#B68D40] font-medium">★ {assignedDriver.rating || '4.97'} Rating</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
                {assignedDriver.phone && (
                  <>
                    <a
                      href={`tel:${assignedDriver.phone}`}
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#B68D40]" />
                      <span>Call Driver</span>
                    </a>
                    <a
                      href={`https://wa.me/${assignedDriver.phone?.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(assignedDriver.name)},%20I%20am%20your%20traveler%20for%20trip%20${upcomingBooking.booking_number}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Recent Bookings Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1D1B18]/10">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1D1B18]">Recent Tour Bookings</h3>
            <p className="text-xs text-[#6D6A61] mt-0.5">Overview of your most recent confirmations and active passes.</p>
          </div>
          <Link
            to="/customer/bookings"
            className="text-xs font-bold text-[#8C6D38] hover:text-[#1D1B18] inline-flex items-center gap-1 transition"
          >
            <span>View All ({bookings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#6D6A61] font-light">
            No bookings found yet. Explore our curated tours and book your first journey!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1D1B18]/10 text-[10px] uppercase tracking-wider text-[#6D6A61] font-semibold">
                  <th className="pb-3">Booking ID</th>
                  <th className="pb-3">Tour Package</th>
                  <th className="pb-3">Departure Date</th>
                  <th className="pb-3">Guests</th>
                  <th className="pb-3">Total Fare</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Pass</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1B18]/5 text-[#1D1B18]">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-xs text-[#1D1B18]">{b.booking_number}</td>
                    <td className="py-3.5 font-serif font-medium text-sm text-[#1D1B18] max-w-xs truncate">{b.tour_title}</td>
                    <td className="py-3.5 text-[#6D6A61]">{b.departure_date}</td>
                    <td className="py-3.5 text-[#6D6A61]">{b.traveller_count} Guests</td>
                    <td className="py-3.5 font-serif font-medium text-sm text-[#1D1B18]">{formatPrice(b.grand_total)}</td>
                    <td className="py-3.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          b.booking_status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : b.booking_status === 'CANCELLED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {b.booking_status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/customer/bookings/${b.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#8C6D38] hover:text-[#1D1B18] transition"
                      >
                        <span>Pass</span>
                        <ArrowRight className="w-3 h-3" />
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
