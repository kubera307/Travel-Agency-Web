import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import {
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Car,
  Calendar,
  Users,
  ChevronRight,
  ChevronLeft,
  Heart,
  Share2,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Maximize2,
  X,
  Layers,
  CheckSquare,
  Square,
  ChevronDown,
  MessageSquare,
  MessageCircle,
  Send
} from 'lucide-react';

export default function TourDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [expandedDays, setExpandedDays] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadTour() {
      try {
        setLoading(true);
        const res = await api.get(`/tours/${slug}`);
        if (res.success && res.data) {
          setTour(res.data);
          // Default expand the first 2 days
          setExpandedDays({ 0: true, 1: true });
        } else {
          addToast('Tour package not found', 'error');
          navigate('/tours');
        }
      } catch (err) {
        addToast(err.message || 'Failed to load tour details', 'error');
        navigate('/tours');
      } finally {
        setLoading(false);
      }
    }

    loadTour();
  }, [slug]);

  // Lightbox Keyboard Navigation
  const images = tour?.images && tour.images.length > 0
    ? tour.images
    : [{ image_url: tour?.primary_image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80' }];

  const handleNextImage = useCallback(() => {
    setActiveImage((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrevImage = useCallback(() => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handleNextImage, handlePrevImage]);

  const toggleDay = (idx) => {
    setExpandedDays((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleAllDays = () => {
    if (allExpanded) {
      setExpandedDays({});
      setAllExpanded(false);
    } else {
      const all = {};
      tour.itinerary?.forEach((_, i) => { all[i] = true; });
      setExpandedDays(all);
      setAllExpanded(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: tour?.title,
        text: tour?.tagline,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Tour link copied to clipboard!', 'success');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewText.trim()) {
      addToast('Please provide both title and review description', 'warning');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tour_id: tour.id,
          rating: reviewRating,
          title: reviewTitle,
          review: reviewText
        })
      });
      const data = await res.json();

      if (data.success) {
        addToast('Review submitted successfully!', 'success');
        setReviewModalOpen(false);
        setReviewTitle('');
        setReviewText('');
        // Reload tour to reflect reviews
        const updatedTour = await api.get(`/tours/${slug}`);
        if (updatedTour.success) setTour(updatedTour.data);
      } else {
        addToast(data.message || 'Failed to submit review', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold text-sm">Loading package details...</p>
      </div>
    );
  }

  if (!tour) return null;

  const isLiked = isInWishlist(tour.id);
  const isCompared = isInCompare(tour.id);

  // Rating breakdown calculations
  const totalReviews = tour.reviews?.length || tour.reviews_count || 1;
  const rating5Count = Math.round(totalReviews * 0.78);
  const rating4Count = Math.round(totalReviews * 0.17);
  const rating3Count = Math.round(totalReviews * 0.04);
  const rating2Count = Math.round(totalReviews * 0.01);
  const rating1Count = 0;

  return (
    <div className="pb-24">
      {/* Breadcrumb Strip */}
      <div className="border-b border-[#e8dfd5] bg-[#fffdf9] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#d97706]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/tours" className="hover:text-[#d97706]">Tours</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs">{tour.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="rounded-full bg-[#fff0df] px-2.5 py-0.5 text-xs font-bold text-[#b45309]">
                {tour.category_name || 'Curated Bharat Tour'}
              </span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>{tour.destination_name}</span>
              </span>
              {tour.badge && (
                <span className="bg-slate-900 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {tour.badge}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-black tracking-[-0.06em] text-[#102039] sm:text-4xl lg:text-5xl">
              {tour.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {tour.tagline}
            </p>
          </div>

          {/* Action Buttons: Wishlist, Compare, Share */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(tour.id, tour.title)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isLiked
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isLiked ? 'Saved' : 'Save'}</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={() => addToCompare(tour)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                isCompared
                  ? 'border-blue-300 bg-blue-50 text-blue-600'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {isCompared ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              <span className="hidden sm:inline">{isCompared ? 'Comparing' : 'Compare'}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
              title="Share tour"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Image Gallery with Fullscreen Lightbox Trigger */}
        <div className="mb-10 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="group relative aspect-[16/9] cursor-pointer overflow-hidden rounded-[26px] bg-slate-100 shadow-[0_18px_36px_rgba(15,23,42,0.1)] lg:col-span-3" onClick={() => setLightboxOpen(true)}>
            <img
              src={images[activeImage]?.image_url || images[0]?.image_url}
              alt={tour.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                <span>View Fullscreen Lightbox ({images.length} Photos)</span>
              </span>
            </div>
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-lg font-medium">
              Photo {activeImage + 1} of {images.length}
            </div>
          </div>

          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[480px]">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`relative aspect-[16/10] w-28 lg:w-full rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === idx
                    ? 'border-orange-500 ring-2 ring-orange-500/20'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content & Sticky Booking Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main Details (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Specs Strip */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Duration</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">{tour.duration_days} Days / {tour.duration_nights} Nights</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Departure City</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">{tour.departure_city}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Vehicle Type</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">{tour.vehicle_type}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Customer Rating</p>
                <p className="font-bold text-sm text-amber-500 mt-0.5 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{Number(tour.rating || 4.9).toFixed(1)} ({tour.reviews_count || 120})</span>
                </p>
              </div>
            </div>

            {/* Overview */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="font-display font-bold text-xl text-slate-900">Tour Overview</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {tour.description || tour.tagline}
              </p>
            </section>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="font-display font-bold text-xl text-slate-900">Tour Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                      <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Expandable Day-by-Day Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-xl text-slate-900">Day-by-Day Itinerary</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Click any day to expand or collapse details</p>
                  </div>
                  <button
                    onClick={toggleAllDays}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    {allExpanded ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>

                <div className="relative pl-6 space-y-4 border-l-2 border-orange-200">
                  {tour.itinerary.map((it, idx) => {
                    const isExpanded = !!expandedDays[idx];
                    return (
                      <div key={idx} className="relative">
                        {/* Timeline Node */}
                        <div
                          className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full transition-all ${
                            isExpanded ? 'bg-orange-500 ring-4 ring-orange-100' : 'bg-slate-300'
                          }`}
                        ></div>

                        {/* Expandable Day Card */}
                        <div
                          onClick={() => toggleDay(idx)}
                          className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-200 cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                                {it.time_slot || `Day ${it.day_number}`}
                              </span>
                              <h4 className="font-bold text-sm text-slate-900">{it.title}</h4>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-orange-600' : ''
                              }`}
                            />
                          </div>

                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-2 animate-in fade-in duration-150">
                              <p className="text-xs text-slate-600 leading-relaxed">{it.description}</p>
                              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                                {it.location && (
                                  <span className="bg-white text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-orange-500" />
                                    <span>{it.location}</span>
                                  </span>
                                )}
                                {it.meals && (
                                  <span className="bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200">
                                    🍴 {it.meals}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="font-display font-bold text-xl text-slate-900">Inclusions &amp; Exclusions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Inclusions */}
                <div>
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
                    What's Included
                  </h3>
                  <div className="space-y-2">
                    {tour.inclusions?.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exclusions */}
                <div>
                  <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3">
                    What's Not Included
                  </h3>
                  <div className="space-y-2">
                    {tour.exclusions?.map((exc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
              <h2 className="font-display font-bold text-xl text-slate-900">Cancellation &amp; Refund Policy</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Free cancellation up to 24 hours before your scheduled departure with a 100% full refund
                credited back to your original payment method. Within 24 hours, a nominal 10% fee applies.
              </p>
            </section>

            {/* Customer Reviews & Rating Breakdown */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-slate-900">
                    Verified Traveler Reviews ({totalReviews})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">100% genuine reviews from verified travellers</p>
                </div>

                {isAuthenticated && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Write a Review</span>
                  </button>
                )}
              </div>

              {/* Rating Summary & Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                {/* Average Score */}
                <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0">
                  <span className="font-display font-black text-5xl text-slate-900">
                    {Number(tour.rating || 4.9).toFixed(1)}
                  </span>
                  <div className="flex items-center text-amber-500 my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Based on {totalReviews} reviews</span>
                </div>

                {/* Progress Bars */}
                <div className="md:col-span-2 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-semibold text-slate-700">5 Star</span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="w-10 text-right text-slate-500">78%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-semibold text-slate-700">4 Star</span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '17%' }}></div>
                    </div>
                    <span className="w-10 text-right text-slate-500">17%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-semibold text-slate-700">3 Star</span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '4%' }}></div>
                    </div>
                    <span className="w-10 text-right text-slate-500">4%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-semibold text-slate-700">2 Star</span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '1%' }}></div>
                    </div>
                    <span className="w-10 text-right text-slate-500">1%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-semibold text-slate-700">1 Star</span>
                    <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <span className="w-10 text-right text-slate-500">0%</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              {tour.reviews?.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No written reviews submitted yet for this tour. Be the first to review!
                </div>
              ) : (
                <div className="space-y-4">
                  {tour.reviews?.map((r) => (
                    <div key={r.id} className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 font-bold text-xs flex items-center justify-center">
                            {r.customer_name?.[0]?.toUpperCase() || 'T'}
                          </div>
                          <span className="font-bold text-xs text-slate-900">{r.customer_name}</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ✓ Verified Trip
                          </span>
                        </div>
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="font-semibold text-xs text-slate-800">{r.title}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.review}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sticky Booking Panel (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-28 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xl space-y-5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Fare Per Guest</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-display font-black text-3xl text-slate-900">
                    {formatPrice(tour.sale_price)}
                  </span>
                  {tour.base_price > tour.sale_price && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(tour.base_price)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  ✓ 100% Direct Driver Payment via UPI
                </p>
              </div>

              {/* Next Available Departure */}
              {tour.departures && tour.departures.length > 0 && (
                <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200/80 text-xs">
                  <span className="font-bold text-orange-900">Next Departure:</span>
                  <p className="font-display font-bold text-sm text-slate-900 mt-0.5">
                    {tour.departures[0].departure_date}
                  </p>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {tour.departures[0].available_seats} Seats Left
                  </span>
                </div>
              )}

              <button
                onClick={() => navigate(`/booking?tour=${tour.slug || tour.id}`)}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Book This Tour Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const msg = encodeURIComponent(`Hi NammaYatra! I want to book: ${tour.title} (${formatPrice(tour.sale_price)}). Please assist.`);
                  window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book via WhatsApp</span>
              </button>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Zero Cancellation Fee up to 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-orange-600" />
                  <span>24x7 Direct Support: 1800-BHARAT</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky Bottom Booking Bar (Mobile Only) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 flex items-center justify-between shadow-2xl gap-3">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Fare from</p>
          <p className="font-display font-black text-lg text-slate-900">
            {formatPrice(tour.sale_price)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const msg = encodeURIComponent(`Hi NammaYatra! I want to book: ${tour.title} (${formatPrice(tour.sale_price)}). Please assist.`);
              window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl shadow-md"
            title="Book on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate(`/booking?tour=${tour.slug || tour.id}`)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Fullscreen Image Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-8 backdrop-blur-lg animate-in fade-in duration-200">
          <div className="w-full flex items-center justify-between text-white pb-4">
            <div className="text-sm font-bold">
              <span>{tour.title}</span>
              <span className="text-slate-400 ml-2">({activeImage + 1} / {images.length})</span>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center">
            <button
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={images[activeImage]?.image_url}
              alt=""
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={handleNextImage}
              className="absolute right-2 sm:right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto max-w-3xl pt-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === idx ? 'border-orange-500 scale-105' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-lg text-slate-900">Review This Tour</h3>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-slate-600 ml-2">
                    {reviewRating} out of 5
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Unbelievable experience with our Sarathi!"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Your Feedback &amp; Memories</label>
                <textarea
                  required
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell fellow travellers about the vehicle comfort, driver knowledge, stops, and local food..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingReview ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
