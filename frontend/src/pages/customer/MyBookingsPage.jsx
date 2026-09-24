import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import BookingTicketPass from '../../components/booking/BookingTicketPass';
import SecurePaymentCheckout from '../../components/booking/SecurePaymentCheckout';
import {
  Luggage,
  Calendar,
  MapPin,
  Printer,
  XCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  X,
  CreditCard,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  Star,
  MessageSquareHeart
} from 'lucide-react';
import FeedbackModal from '../../components/common/FeedbackModal';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [payingBooking, setPayingBooking] = useState(null);
  const [payingOrder, setPayingOrder] = useState(null);
  const [initiatingPayId, setInitiatingPayId] = useState(null);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'CONFIRMED' | 'PENDING' | 'CANCELLED'
  const [cancelTargetBooking, setCancelTargetBooking] = useState(null);
  const [feedbackBooking, setFeedbackBooking] = useState(null);
  const { showToast } = useToast();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings');
      if (res.success) setBookings(res.data || []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const confirmCancellation = async () => {
    if (!cancelTargetBooking) return;
    const id = cancelTargetBooking.id;

    try {
      setCancellingId(id);
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.success) {
        showToast('Booking cancelled successfully. 100% full refund initiated.', 'success');
        setCancelTargetBooking(null);
        loadBookings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const handleInitiatePayment = async (b) => {
    try {
      setInitiatingPayId(b.id);
      const res = await api.get(`/payments/order/${b.id}`);
      if (res.success && res.data) {
        setPayingBooking(b);
        setPayingOrder(res.data);
      } else {
        showToast(res.message || 'Unable to open payment gateway', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Payment gateway connection error', 'error');
    } finally {
      setInitiatingPayId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'CONFIRMED') return b.booking_status === 'CONFIRMED';
    if (filterTab === 'PENDING') return b.payment_status === 'PENDING' && b.booking_status !== 'CANCELLED';
    if (filterTab === 'CANCELLED') return b.booking_status === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1D1B18]/10 pb-6">
        <div>
          <span className="text-[11px] font-bold text-[#B99762] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99762]" />
            Travel History &amp; Boarding Passes
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
            My Expeditions &amp; Bookings
          </h1>
          <p className="text-xs text-[#1D1B18]/60 mt-1 max-w-xl font-light">
            View all confirmed journey vouchers, download ONDC-verified driver passes, or complete pending payments.
          </p>
        </div>

        <Link
          to="/tours"
          className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 shadow-sm self-start sm:self-auto shrink-0"
        >
          <span>Explore New Tours</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      {bookings.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: `All Trips (${bookings.length})` },
            { id: 'CONFIRMED', label: `Confirmed (${bookings.filter((b) => b.booking_status === 'CONFIRMED').length})` },
            { id: 'PENDING', label: `Payment Due (${bookings.filter((b) => b.payment_status === 'PENDING' && b.booking_status !== 'CANCELLED').length})` },
            { id: 'CANCELLED', label: `Cancelled (${bookings.filter((b) => b.booking_status === 'CANCELLED').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                filterTab === tab.id
                  ? 'bg-[#1D1B18] text-[#F7F1E7] shadow-sm'
                  : 'bg-white text-[#1D1B18]/70 hover:text-[#1D1B18] border border-[#1D1B18]/10 hover:border-[#1D1B18]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B99762] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#1D1B18]/60 font-light">Retrieving your verified expedition logs...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#1D1B18]/10 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#B99762]/30 flex items-center justify-center mx-auto text-[#B99762]">
            <Luggage className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-[#1D1B18] font-normal">
            {bookings.length === 0 ? 'No Expeditions Reserved Yet' : 'No Trips Found In This Category'}
          </h3>
          <p className="text-xs text-[#1D1B18]/60 max-w-md mx-auto font-light leading-relaxed">
            {bookings.length === 0
              ? 'Begin your bespoke travel journey across the timeless heritage and royal sanctuaries of Incredible India.'
              : 'Try selecting a different filter above to view your other bookings and travel history.'}
          </p>
          <div className="pt-2">
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white font-medium text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
            >
              <span>Discover Handcrafted Itineraries</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((b) => {
            const isPendingPayment = b.payment_status === 'PENDING' && b.booking_status !== 'CANCELLED';

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-[#1D1B18]/10 hover:border-[#B99762]/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Booking Details */}
                <div className="space-y-3 max-w-xl">
                  {/* Status Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[#B99762] bg-[#FAF8F5] px-3 py-1 rounded-full border border-[#B99762]/30 tracking-wider">
                      REF: {b.booking_number}
                    </span>

                    <span
                      className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-full uppercase ${
                        b.booking_status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : b.booking_status === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {b.booking_status}
                    </span>

                    <span
                      className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-full ${
                        b.payment_status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {b.payment_status === 'PAID' ? '● 100% PAID' : '○ PAYMENT DUE'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1D1B18] font-normal tracking-tight">
                    {b.tour_title}
                  </h3>

                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#1D1B18]/70 font-light">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B99762]" />
                      <span>{b.departure_date}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Luggage className="w-3.5 h-3.5 text-[#B99762]" />
                      <span>{b.traveller_count} {b.traveller_count === 1 ? 'Guest' : 'Guests'}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#B99762]" />
                      <span>Pickup: {b.pickup_point || 'City Center / Hotel'}</span>
                    </span>
                  </div>
                </div>

                {/* Right: Price & CTA Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-[#1D1B18]/5">
                  <div className="text-left sm:text-right lg:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#1D1B18]/40">
                      Total Expedition Fare
                    </p>
                    <p className="font-serif text-2xl sm:text-3xl text-[#1D1B18] font-normal mt-0.5">
                      ₹{Number(b.grand_total).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    {isPendingPayment ? (
                      <button
                        onClick={() => handleInitiatePayment(b)}
                        disabled={initiatingPayId === b.id}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-medium px-5 py-3 rounded-full transition-all duration-300 shadow-sm disabled:opacity-50"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#B99762]" />
                        <span>{initiatingPayId === b.id ? 'Connecting...' : 'Pay Online Now'}</span>
                      </button>
                    ) : (
                      <Link
                        to={`/customer/bookings/${b.id}`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-medium px-5 py-3 rounded-full transition-all duration-300 shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#B99762]" />
                        <span>View Boarding Pass</span>
                      </Link>
                    )}

                    {b.booking_status !== 'CANCELLED' && (
                      <button
                        type="button"
                        onClick={() => setFeedbackBooking(b)}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#1D1B18] hover:text-[#B99762] bg-[#FAF8F5] hover:bg-[#EAE3D9] border border-[#1D1B18]/15 hover:border-[#B99762]/40 px-4 py-3 rounded-full transition-all duration-200"
                        title="Rate this tour and chauffeur"
                      >
                        <Star className="w-3.5 h-3.5 text-[#B99762] fill-[#B99762]/30" />
                        <span>Feedback</span>
                      </button>
                    )}

                    {b.booking_status === 'CONFIRMED' && (
                      <button
                        onClick={() => setCancelTargetBooking(b)}
                        className="text-xs font-medium text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-3 rounded-full transition-all duration-200"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelTargetBooking && (
        <div className="fixed inset-0 z-50 bg-[#0E131F]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#1D1B18]/10 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#1D1B18]/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-[#1D1B18]">Cancel Reservation?</h3>
                  <p className="text-[11px] text-[#1D1B18]/60 font-mono">
                    Ref: {cancelTargetBooking.booking_number}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCancelTargetBooking(null)}
                className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EAE3D9] text-[#1D1B18]/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#1D1B18]/70 font-light leading-relaxed">
              <p>
                Are you sure you want to cancel your reservation for{' '}
                <strong className="text-[#1D1B18] font-serif text-sm">
                  {cancelTargetBooking.tour_title}
                </strong>
                ?
              </p>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#B99762]/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Full Refund Guarantee</span>
                </div>
                <p className="text-[11px] text-[#1D1B18]/70">
                  Under the ONDC Direct-to-Driver protocol, your total booking amount of{' '}
                  <strong className="text-[#1D1B18]">₹{Number(cancelTargetBooking.grand_total).toLocaleString('en-IN')}</strong> will be returned to your original payment method with zero cancellation fees.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTargetBooking(null)}
                className="px-5 py-2.5 rounded-full text-xs font-medium text-[#1D1B18] hover:bg-[#FAF8F5] border border-[#1D1B18]/10 transition-colors"
              >
                Keep My Booking
              </button>

              <button
                type="button"
                onClick={confirmCancellation}
                disabled={cancellingId === cancelTargetBooking.id}
                className="px-5 py-2.5 rounded-full text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm disabled:opacity-50"
              >
                {cancellingId === cancelTargetBooking.id ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Online Payment Modal for Pending Bookings */}
      {payingBooking && payingOrder && (
        <div className="fixed inset-0 z-50 bg-[#0E131F]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-[#1D1B18]/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setPayingBooking(null);
                setPayingOrder(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EAE3D9] text-[#1D1B18]/60 flex items-center justify-center transition z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <SecurePaymentCheckout
              booking={payingBooking}
              paymentOrder={payingOrder}
              onPaymentSuccess={() => {
                setPayingBooking(null);
                setPayingOrder(null);
                showToast('Payment successful! Boarding pass confirmed.', 'success');
                loadBookings();
              }}
              onBack={() => {
                setPayingBooking(null);
                setPayingOrder(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Feedback Modal for Expedition */}
      {feedbackBooking && (
        <FeedbackModal
          isOpen={!!feedbackBooking}
          booking={feedbackBooking}
          onClose={() => setFeedbackBooking(null)}
          onFeedbackSubmitted={() => {
            showToast('Thank you for sharing your feedback on this expedition!', 'success');
          }}
        />
      )}
    </div>
  );
}

export function BookingDetailsPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadTicket() {
      try {
        setLoading(true);
        const res = await api.get(`/bookings/${id}`);
        if (res.success && res.data) {
          setTicket(res.data.ticket || res.data);
        } else {
          showToast('Failed to load ticket pass', 'error');
        }
      } catch (err) {
        showToast(err.message || 'Error loading pass', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#B99762] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-[#1D1B18]/60 font-light">Retrieving your verified boarding pass...</p>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between">
        <Link
          to="/customer/bookings"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#1D1B18]/70 hover:text-[#B99762] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>
      </div>

      <BookingTicketPass ticket={ticket} />
    </div>
  );
}
