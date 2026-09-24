import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Sparkles,
  CheckCircle2,
  Luggage,
  ShieldCheck,
  Send,
  Compass,
  Car,
  Globe,
  Headphones,
  CreditCard,
  Building,
  HelpCircle,
  ArrowRight
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

export default function FeedbackPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('Tour');
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      showToast('Please select a star rating.', 'error');
      return;
    }

    if (!feedback.trim()) {
      showToast('Please provide your feedback remarks.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/feedback', {
        customer_name: name.trim(),
        email: email.trim(),
        rating,
        category,
        feedback: feedback.trim()
      });

      if (res.success) {
        setSubmitted(true);
        showToast('Thank you! Your feedback has been received.', 'success');
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
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pt-28 pb-20 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold text-[#B99762] uppercase tracking-[0.2em] inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99762]" />
            Your Experience Matters
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#1D1B18] tracking-tight">
            Traveler Feedback &amp; Suggestions
          </h1>
          <p className="text-xs text-[#1D1B18]/60 font-light max-w-lg mx-auto leading-relaxed">
            Help us continuously refine Bharat's authentic direct-to-driver luxury travel experience. Every review is reviewed directly by our concierge directorate.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-[#1D1B18]/10 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-3xl text-[#1D1B18]">Gratitude For Your Insights</h2>
            <p className="text-xs text-[#1D1B18]/60 max-w-md mx-auto font-light leading-relaxed">
              Your feedback helps us champion our Sarathi chauffeurs, elevate our handcrafted itineraries, and protect our 0% middleman guarantee.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
              >
                Return to Homepage
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFeedback('');
                }}
                className="bg-[#FAF8F5] hover:bg-[#EAE3D9] text-[#1D1B18] text-xs font-medium px-6 py-3 rounded-full border border-[#1D1B18]/10 transition-colors"
              >
                Submit Another Feedback
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#1D1B18]/10 shadow-xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Section */}
              <div className="text-center py-4 bg-[#FAF8F5] rounded-2xl border border-[#1D1B18]/5 p-4 space-y-2">
                <p className="text-xs font-semibold text-[#1D1B18]/80">Rate your overall experience</p>
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
                        className={`w-8 h-8 transition-colors ${
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
                  Select Feedback Category
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
                            : 'bg-[#FAF8F5] text-[#1D1B18]/70 border-[#1D1B18]/10 hover:border-[#B99762]'
                        }`}
                      >
                        <CatIcon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#B99762]' : 'text-[#1D1B18]/40'}`} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Remarks Textarea */}
              <div>
                <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">
                  Your Remarks, Praise, or Constructive Critique *
                </label>
                <textarea
                  required
                  rows={5}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share details regarding your journey, driver partner conduct, vehicle cleanliness, route stops, or booking process..."
                  className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-4 py-3 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762] placeholder:text-[#1D1B18]/35 transition-all"
                />
              </div>

              {/* Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ramesh Kumar"
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762]"
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
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:outline-none focus:ring-1 focus:ring-[#B99762]"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-[#1D1B18]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-[11px] text-[#1D1B18]/50 flex items-center gap-1.5 font-light">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Submissions are strictly confidential and protected by 256-Bit SSL.</span>
                </span>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-white font-medium text-xs px-7 py-3 rounded-full transition-all duration-300 shadow-sm disabled:opacity-50 self-end sm:self-auto"
                >
                  <Send className="w-3.5 h-3.5 text-[#B99762]" />
                  <span>{loading ? 'Submitting...' : 'Send Feedback'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

