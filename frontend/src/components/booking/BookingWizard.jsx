import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import BookingTicketPass from './BookingTicketPass';
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function BookingWizard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const queryParams = new URLSearchParams(location.search);
  const tourSlug = queryParams.get('tour');
  const departureParam = queryParams.get('departure');

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Simplified Form State (Everything on 1 Simple Screen)
  const [departureDate, setDepartureDate] = useState('');
  const [travellerCount, setTravellerCount] = useState(2);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [pickupPoint, setPickupPoint] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  useEffect(() => {
    async function loadTour() {
      if (!tourSlug) {
        addToast('Please select a tour package first', 'info');
        navigate('/tours');
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/tours/${tourSlug}`);
        if (res.success && res.data) {
          const t = res.data;
          setTour(t);

          // Pre-select departure date
          if (t.departures && t.departures.length > 0) {
            const matched = departureParam
              ? t.departures.find((d) => d.id === departureParam)
              : t.departures[0];
            setDepartureDate(matched ? matched.departure_date : t.departures[0].departure_date);
          } else {
            // Default to 3 days from now
            const d = new Date();
            d.setDate(d.getDate() + 3);
            setDepartureDate(d.toISOString().split('T')[0]);
          }

          if (t.popular_pickups && t.popular_pickups.length > 0) {
            setPickupPoint(t.popular_pickups[0]);
          }
        } else {
          addToast('Tour package not found', 'error');
          navigate('/tours');
        }
      } catch (err) {
        addToast(err.message || 'Failed to load tour details', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadTour();
  }, [tourSlug, departureParam]);

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || '');
      if (!phone) setPhone(user.phone || '');
      if (!email) setEmail(user.email || '');
    }
  }, [user]);

  // Price calculations
  const pricePerGuest = tour ? Number(tour.sale_price || 0) : 0;
  const subtotal = pricePerGuest * travellerCount;
  const grandTotal = subtotal; // Zero extra fees, 100% direct

  // 1-Click WhatsApp Booking
  const handleWhatsAppBooking = () => {
    if (!tour) return;
    const agencyNumber = '919876543210';
    const message = `*Hi NammaYathra!* I would like to book a tour:
- *Tour:* ${tour.title}
- *Date:* ${departureDate || 'Flexible'}
- *Guests:* ${travellerCount}
- *Name:* ${fullName || 'Guest'}
- *Phone:* ${phone || 'Not provided'}
- *Total Fare:* ${formatPrice(grandTotal)}

Please confirm seat availability. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${agencyNumber}?text=${encoded}`, '_blank');
  };

  // Direct 1-Step Booking Submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim()) {
      addToast('Please enter your name and phone number', 'warning');
      return;
    }

    if (!departureDate) {
      addToast('Please select a travel date', 'warning');
      return;
    }

    try {
      setSubmitting(true);

      const bookingPayload = {
        tourId: tour.id,
        departureDate,
        travellerCount,
        pickupPoint: pickupPoint || 'Hotel / City Center',
        specialNotes,
        travellers: [
          {
            fullName,
            phone,
            email: email || `${phone}@travelindia.guest`
          }
        ]
      };

      // If user is not logged in, we can either use token if present or create an auto guest account
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingPayload)
      });

      const data = await res.json();

      if (data.success) {
        addToast('🎉 Booking confirmed! Your boarding pass is ready.', 'success');
        setConfirmedBooking(data.booking);
        setTicketData(data.ticket);
      } else {
        // If auth required, prompt or auto login
        if (res.status === 401) {
          addToast('Please login or register to finalize your booking pass', 'info');
          navigate(`/login?redirect=/booking?tour=${tour.slug}`);
        } else {
          addToast(data.message || 'Failed to confirm booking', 'error');
        }
      }
    } catch (err) {
      addToast(err.message || 'Error processing booking', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold text-sm">Preparing booking form...</p>
      </div>
    );
  }

  // If booking is confirmed, show boarding pass
  if (confirmedBooking && ticketData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Booking Confirmed!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your journey with verified Sarathis is locked in. Here is your printable boarding pass.
          </p>
        </div>

        <BookingTicketPass ticket={ticketData} />

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/customer/bookings"
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Go to My Bookings
          </Link>
          <Link
            to="/tours"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            Explore More Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="eyebrow">
          Quick &amp; Simple Booking
        </span>
        <h1 className="font-display mt-2 text-3xl font-black tracking-[-0.06em] text-[#102039] sm:text-4xl">
          Reserve Your Tour in 1 Easy Step
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          No complex multi-step forms. Fill in your details or book instantly via WhatsApp!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="space-y-6 rounded-[26px] border border-[#e8dfd5] bg-[#fffdf9] p-6 shadow-[0_16px_34px_rgba(15,23,42,0.05)] sm:p-8 lg:col-span-2">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            {/* 1. Date & Guests */}
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>1. Select Travel Date &amp; Number of Guests</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Travel Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Number of Guests</label>
                  <select
                    value={travellerCount}
                    onChange={(e) => setTravellerCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Contact Details */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                <span>2. Your Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Pickup Point / Hotel</label>
                  <input
                    type="text"
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    placeholder="e.g. Airport / Hotel Lobby"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-medium"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold text-slate-700 block mb-1">Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Need baby seat, vegetarian food preference, or early morning start..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none font-medium"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons: Instant WhatsApp + Confirm */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Confirming...</span>
                ) : (
                  <>
                    <span>Confirm Booking &amp; Get Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book via WhatsApp</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Tour Summary & Trust Strip */}
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={tour?.primary_image || tour?.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                {tour?.destination_name || tour?.departure_city}
              </span>
              <h3 className="font-display font-bold text-base text-slate-900 mt-0.5">
                {tour?.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{tour?.duration_days} Days / {tour?.duration_nights} Nights</span>
              </p>
            </div>

            {/* Price breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Fare per Guest</span>
                <span className="font-semibold">{formatPrice(pricePerGuest)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Number of Guests</span>
                <span className="font-semibold">× {travellerCount}</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-orange-600 font-display font-black text-lg">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Direct to Sarathi Driver (0% Commission)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-500" />
                <span>Free Cancellation up to 24h before departure</span>
              </div>
            </div>
          </div>

          {/* Direct Support Card */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/80 text-amber-950 space-y-2 text-xs">
            <p className="font-bold flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Have Questions Before Booking?</span>
            </p>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Our travel coordinator is directly available on WhatsApp and Phone:
            </p>
            <div className="pt-1 flex flex-col gap-1 font-bold text-slate-800">
              <a href="tel:1800-BHARAT" className="hover:text-orange-600 flex items-center gap-1">
                📞 Toll-Free: 1800-BHARAT
              </a>
              <a
                href="https://wa.me/919876543210?text=Hi%20Travel%20India,%20I%20have%20a%20question"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                💬 WhatsApp: +91 98765 43210
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
