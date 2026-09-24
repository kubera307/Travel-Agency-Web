import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import BookingTicketPass from './BookingTicketPass';
import SecurePaymentCheckout from './SecurePaymentCheckout';
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
  Sparkles,
  Lock,
  CreditCard
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

  // 3-Step Wizard Navigation
  // 1 = Traveller Details, 2 = Secure Online Payment, 3 = Confirmed Boarding Pass
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [departureDate, setDepartureDate] = useState('');
  const [travellerCount, setTravellerCount] = useState(2);
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [pickupPoint, setPickupPoint] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Payment & Confirmation State
  const [pendingBooking, setPendingBooking] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);
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
  const grandTotal = subtotal; // Zero platform commission

  // 1-Click WhatsApp Booking
  const handleWhatsAppBooking = () => {
    if (!tour) return;
    const agencyNumber = '919876543210';
    const message = `*Hi NammaYatra!* I would like to book a tour:
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

  // Step 1: Submit Booking Reservation -> Proceeds to Online Payment
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

      const res = await api.post('/bookings', bookingPayload);

      if (res.success) {
        addToast('Seats locked for 15 minutes! Please select your payment method.', 'success');
        setPendingBooking(res.booking);
        setPaymentOrder(res.paymentOrder);
        setCurrentStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        addToast(res.message || 'Failed to initiate booking reservation', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Error processing reservation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 2: Payment Verified Callback -> Proceeds to Boarding Pass
  const handlePaymentSuccess = (paymentResult) => {
    setConfirmedBooking(paymentResult.booking);
    setTicketData(paymentResult.ticket);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step Indicator
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-xl mx-auto relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#EAE3D9] -translate-y-1/2 z-0" />
        
        {/* Step 1 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            currentStep >= 1 ? 'bg-[#0E131F] text-amber-400 ring-4 ring-amber-100' : 'bg-slate-200 text-slate-500'
          }`}>
            {currentStep > 1 ? '✓' : '1'}
          </div>
          <span className="text-[11px] font-semibold text-slate-700 mt-1.5">
            Trip Details
          </span>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            currentStep === 2
              ? 'bg-[#B68D40] text-white ring-4 ring-amber-200'
              : currentStep > 2
              ? 'bg-[#0E131F] text-amber-400 ring-4 ring-amber-100'
              : 'bg-slate-200 text-slate-500'
          }`}>
            {currentStep > 2 ? '✓' : '2'}
          </div>
          <span className={`text-[11px] font-semibold mt-1.5 ${currentStep === 2 ? 'text-[#B68D40] font-bold' : 'text-slate-500'}`}>
            Secure Payment
          </span>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
            currentStep === 3 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-slate-200 text-slate-500'
          }`}>
            3
          </div>
          <span className={`text-[11px] font-semibold mt-1.5 ${currentStep === 3 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
            Boarding Pass
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-10 h-10 border-3 border-[#B68D40] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium text-xs">Preparing verified booking experience...</p>
      </div>
    );
  }

  // STEP 3: Confirmed Boarding Pass
  if (currentStep === 3 && confirmedBooking && ticketData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {renderStepIndicator()}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-serif font-normal text-3xl sm:text-4xl text-slate-900">
            Payment Verified &amp; Booking Confirmed!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto font-light">
            Your expedition with verified Sarathis is locked in. Below is your official boarding pass and tax receipt.
          </p>
        </div>

        <BookingTicketPass ticket={ticketData} />

        <div className="flex justify-center gap-4 pt-4">
          <Link
            to="/customer/bookings"
            className="px-6 py-2.5 bg-[#0E131F] hover:bg-black text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <span>Go to My Bookings</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </Link>
          <Link
            to="/tours"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all"
          >
            Explore More Expeditions
          </Link>
        </div>
      </div>
    );
  }

  // STEP 2: Secure Online Payment Checkout
  if (currentStep === 2 && pendingBooking && paymentOrder) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {renderStepIndicator()}
        <SecurePaymentCheckout
          booking={pendingBooking}
          paymentOrder={paymentOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={() => setCurrentStep(1)}
        />
      </div>
    );
  }

  // STEP 1: Details & Reservation Form
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {renderStepIndicator()}

      {/* Header */}
      <div className="mb-7 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#B68D40] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B68D40]"></span>
          <span>DIRECT SARATHI RESERVATION</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 font-medium">STEP 1 OF 2</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal">
          Reserve Your Tour Itinerary
        </h1>
        <p className="text-xs text-slate-500 font-light mt-0.5">
          Lock in your seats with real-time driver telemetry. Zero platform commission guarantee.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
        {/* Left Column: Form */}
        <div className="space-y-6 rounded-3xl border border-[#EAE3D9] bg-white p-6 sm:p-8 shadow-xs lg:col-span-2">
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            {/* 1. Date & Guests */}
            <div>
              <h3 className="font-serif text-base font-normal text-slate-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#B68D40]" />
                <span>1. Select Travel Date &amp; Number of Guests</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Travel Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Number of Guests *</label>
                  <select
                    value={travellerCount}
                    onChange={(e) => setTravellerCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-medium"
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
            <div className="pt-5 border-t border-slate-100">
              <h3 className="font-serif text-base font-normal text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#B68D40]" />
                <span>2. Lead Traveller Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Pickup Point / Hotel</label>
                  <input
                    type="text"
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    placeholder="e.g. Airport, Hotel Lobby"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-medium"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Special Preferences (Optional)</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Need child safety seat, pure vegetarian meals, early morning departure..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 resize-none font-medium"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons: Proceed to Payment + WhatsApp */}
            <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 bg-[#0E131F] hover:bg-black text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {submitting ? (
                  <span>Reserving Seats...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#B68D40]" />
                    <span>Proceed to Secure Online Payment ({formatPrice(grandTotal)})</span>
                    <ArrowRight className="w-4 h-4 text-[#B68D40] group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book via WhatsApp</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Tour Summary & Trust Strip */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-xs space-y-4">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={tour?.primary_image || tour?.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#B68D40] uppercase tracking-wider">
                {tour?.destination_name || tour?.departure_city}
              </span>
              <h3 className="font-serif font-normal text-base text-slate-900 mt-0.5 leading-snug">
                {tour?.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-light">
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
              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-sm font-bold text-slate-900">Total Payable</span>
                  <p className="text-[10px] text-emerald-600 font-medium">● 100% Direct Driver Share</p>
                </div>
                <span className="text-[#0E131F] font-serif font-bold text-xl">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Direct to Sarathi Driver (0% Commission)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B68D40] shrink-0" />
                <span>Free Cancellation up to 24h before departure</span>
              </div>
            </div>
          </div>

          {/* Direct Support Card */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#EAE3D9] text-slate-800 space-y-2 text-xs">
            <p className="font-semibold flex items-center gap-1.5 text-slate-900">
              <Phone className="w-4 h-4 text-[#B68D40]" />
              <span>Questions Before Payment?</span>
            </p>
            <p className="text-slate-500 text-[11px] font-light leading-relaxed">
              Our travel coordinator is directly available for booking queries and assistance:
            </p>
            <div className="pt-1 flex flex-col gap-1 font-semibold text-slate-800 text-[11px]">
              <a href="tel:1800-BHARAT" className="hover:text-[#B68D40] flex items-center gap-1">
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
