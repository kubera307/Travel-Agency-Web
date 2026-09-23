import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import BookingTicketPass from '../../components/booking/BookingTicketPass';
import { Luggage, Calendar, MapPin, Printer, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
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

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A 100% refund will be processed.')) {
      return;
    }

    try {
      setCancellingId(id);
      const res = await api.put(`/bookings/${id}/cancel`);
      if (res.success) {
        showToast('Booking cancelled. Full refund initiated.', 'success');
        loadBookings();
      }
    } catch (err) {
      showToast(err.message || 'Failed to cancel booking', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Travel History &amp; Passes
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
          My Trips &amp; Bookings
        </h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
          <Luggage className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">No Bookings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have not booked any tours yet. Explore our verified itineraries across Incredible India!
          </p>
          <Link
            to="/tours"
            className="inline-block bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-orange-700 transition-colors shadow-md"
          >
            Find Tours
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2 max-w-md">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-xs text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200">
                    {b.booking_number}
                  </span>
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
                </div>

                <h3 className="font-display font-bold text-base text-slate-900">
                  {b.tour_title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-500" />
                    <span>{b.departure_date}</span>
                  </span>
                  <span>{b.traveller_count} Guests</span>
                  <span>Pickup: {b.pickup_point || 'City Center'}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Total Fare</p>
                  <p className="font-display font-black text-lg text-slate-900">
                    ₹{Number(b.grand_total).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/customer/bookings/${b.id}`}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Pass</span>
                  </Link>

                  {b.booking_status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      disabled={cancellingId === b.id}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3.5 py-2.5 rounded-xl transition-colors"
                    >
                      {cancellingId === b.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
          setTicket(res.data);
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
    return <div className="py-16 text-center text-xs text-slate-500">Loading travel pass...</div>;
  }

  if (!ticket) return null;

  return (
    <div>
      <BookingTicketPass ticket={ticket} />
    </div>
  );
}

