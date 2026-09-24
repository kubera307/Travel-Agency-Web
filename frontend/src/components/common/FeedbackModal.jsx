import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Sparkles,
  CheckCircle2,
  Luggage,
  ShieldCheck,
  Send,
  MessageSquareHeart,
  Globe,
  Compass,
  Car,
  Headphones,
  CreditCard,
  Building,
  HelpCircle
} from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const CATEGORIES = [
  { id: 'Tour', label: 'Tour & Itinerary', icon: Compass },
  { id: 'Transportation', label: 'Chauffeur & Vehicle', icon: Car },
  { id: 'Booking', label: 'Booking Experience', icon: Luggage },
  { id: 'Website', label: 'Website & App UI', icon: Globe },
  { id: 'Customer Support', label: 'Concierge & Support', icon: Headphones },
  { id: 'Payment', label: 'Payment Gateway', icon: CreditCard },
  { id: 'Hotel', label: 'Hotels & Lodging', icon: Building },
  { id: 'Other', label: 'Other Suggestions', icon: HelpCircle }
];

const RATING_DESCRIPTIONS = {
  1: 'Poor • Requires Urgent Attention',
  2: 'Fair • Could Be Better',
  3: 'Good • Met Expectations',
  4: 'Very Good • Highly Enjoyable',
  5: 'Exceptional • Flawless Luxury Experience'
};

export default function FeedbackModal({
  isOpen,
  onClose,
  booking = null,
  initialCategory = 'Tour',
  onFeedbackSubmitted
}) {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState(initialCategory);
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bookingId, setBookingId] = useState(booking?.id || '');
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (!name) setName(user.name || '');
      if (!email) setEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (booking) {
      setBookingId(booking.id);
    }
  }, [booking]);

  useEffect(() => {
    async function loadBookings() {
      if (isAuthenticated && !booking) {
        try {
          const res = await api.get('/bookings');
          if (res.success && res.data) {
            setUserBookings(res.data);
          }
        } catch (e) {
          // ignore
        }
      }
    }
    if (isOpen) {
      loadBookings();
      setSubmittedSuccess(false);
    }
  }, [isOpen, isAuthenticated, booking]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      showToast('Please select a star rating.', 'error');
      return;
    }

    if (!feedback.trim()) {
      showToast('Please provide your comments or suggestions.', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_name: name.trim(),
        email: email.trim(),
        rating,
        category,
        feedback: feedback.trim(),
        booking_id: bookingId || undefined
      };

      const res = await api.post('/feedback', payload);
      if (res.success) {
        setSubmittedSuccess(true);
        showToast('Thank you! Your feedback has been recorded.', 'success');
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(res.data);
        }
        setTimeout(() => {
          onClose();
          setFeedback('');
          setSubmittedSuccess(false);
        }, 1800);
      } else {
        showToast(res.message || 'Unable to submit feedback', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error submitting feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  const activeRatingDisplay = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 bg-[#0E131F]/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#1D1B18]/15 shadow-2xl p-6 sm:p-8 relative text-left my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EAE3D9] text-[#1D1B18]/60 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submittedSuccess ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-[#1D1B18]">Thank You For Your Voice</h3>
            <p className="text-xs text-[#1D1B18]/60 max-w-md mx-auto font-light leading-relaxed">
              Your insights have been shared directly with our executive travel desk. We continuously elevate our journeys based on traveler experiences.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-[#1D1B18]/10 pb-4 pr-8">
              <span className="text-[11px] font-bold text-[#B99762] uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B99762]" />
                Traveler Feedback &amp; Suggestions
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1D1B18] mt-1 font-normal tracking-tight">
                Share Your Experience
              </h2>
              <p className="text-xs text-[#1D1B18]/60 mt-1 font-light leading-relaxed">
                Tell us what you loved or how we can elevate your journey across Incredible India.
              </p>
            </div>

            {/* If linked to a booking */}
            {booking && (
              <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#B99762]/30 flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-xl bg-[#1D1B18] text-[#B99762] flex items-center justify-center shrink-0">
                  <Luggage className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-sm font-medium text-[#1D1B18] truncate">
                    {booking.tour_title}
                  </p>
                  <p className="text-[11px] text-[#1D1B18]/60 font-mono">
                    Ref: {booking.booking_number} • {booking.departure_date}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating Selector */}
              <div className="space-y-2 text-center py-2 bg-[#FAF8F5] rounded-2xl border border-[#1D1B18]/5 p-4">
                <p className="text-xs font-semibold text-[#1D1B18]/80">How would you rate your experience?</p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-hidden"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          star <= activeRatingDisplay
                            ? 'text-[#B68D40] fill-[#B68D40]'
                            : 'text-[#1D1B18]/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs font-serif text-[#B68D40] italic min-h-[1.25rem]">
                  {RATING_DESCRIPTIONS[activeRatingDisplay] || ''}
                </p>
              </div>

              {/* Category Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#1D1B18]/80">
                  Feedback Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium transition-all text-left border ${
                          isSelected
                            ? 'bg-[#1D1B18] text-[#F7F1E7] border-[#1D1B18] shadow-xs'
                            : 'bg-white text-[#1D1B18]/70 border-[#1D1B18]/10 hover:border-[#B99762]'
                        }`}
                      >
                        <CatIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#B99762]' : 'text-[#1D1B18]/40'}`} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Booking Picker if not passed as prop */}
              {!booking && userBookings.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">
                    Related Booking (Optional)
                  </label>
                  <select
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762]"
                  >
                    <option value="">General Platform Feedback (Not trip-specific)</option>
                    {userBookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.booking_number} — {b.tour_title} ({b.departure_date})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Feedback Textarea */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">
                  Your Remarks &amp; Observations *
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share details about the route, chauffeur etiquette, vehicle comfort, booking ease, or any suggestions for improvement..."
                  className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] placeholder:text-[#1D1B18]/35 transition-all"
                />
              </div>

              {/* Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ramesh Kumar"
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@example.com"
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#1D1B18]/50 flex items-center gap-1 font-light">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Shared securely with executive desk
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-white font-medium text-xs px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#B99762]" />
                  <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

