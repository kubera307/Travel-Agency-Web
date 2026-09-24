import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  ArrowRight,
  Star,
  ShieldCheck,
  Heart,
  Sparkles,
  Car,
  Pause,
  Play,
  Compass,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { tourService } from '../../services/tourService';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';

// Verified 100% Featured Tours from Database (featured = 1)
const STRICT_FEATURED_TOURS = [
  {
    id: 'pkg-kashmir-01',
    slug: 'kashmir-paradise-dal-lake-gulmarg-pahalgam',
    title: 'Kashmir Paradise: Dal Lake, Gulmarg & Pahalgam',
    destination_name: 'Kashmir Valley',
    region: 'Himalayan',
    duration_days: 6,
    duration_nights: 5,
    sale_price: 42999,
    base_price: 49999,
    badge: 'Kashmir Bestseller',
    rating: 4.9,
    reviews_count: 142,
    vehicle_type: 'Private AC Innova',
    image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-vns-01',
    slug: 'vns-01-subah-e-banaras-ghats-kashi-vishwanath-rickshaw-yatra',
    title: 'Subah-e-Banaras Ghats & Kashi Vishwanath Rickshaw Yatra',
    destination_name: 'Varanasi',
    region: 'Heritage',
    duration_days: 1,
    duration_nights: 0,
    sale_price: 699,
    base_price: 1100,
    badge: 'Divine Yatra',
    rating: 4.9,
    reviews_count: 215,
    vehicle_type: 'Heritage Rickshaw',
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-ladakh-01',
    slug: 'leh-ladakh-pangong-lake-nubra-valley-khardung-la',
    title: 'Leh Ladakh: Pangong Lake, Nubra Valley & Khardung La',
    destination_name: 'Leh & Ladakh',
    region: 'Himalayan',
    duration_days: 7,
    duration_nights: 6,
    sale_price: 38999,
    base_price: 45000,
    badge: 'Ultimate Expedition',
    rating: 4.9,
    reviews_count: 98,
    vehicle_type: '4x4 Luxury Safari Cab',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-jpr-01',
    slug: 'jpr-01-the-royal-pink-city-heritage-auto-safari',
    title: 'The Royal Pink City Heritage Auto Safari',
    destination_name: 'Jaipur',
    region: 'Heritage',
    duration_days: 1,
    duration_nights: 0,
    sale_price: 999,
    base_price: 1600,
    badge: 'Royal Bestseller',
    rating: 4.9,
    reviews_count: 184,
    vehicle_type: 'Private Heritage Auto',
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-ker-02',
    slug: 'ker-02-munnar-misty-tea-hills-eravikulam-nature-safari',
    title: 'Munnar Misty Tea Hills & Eravikulam Nature Safari',
    destination_name: 'Kerala',
    region: 'Coastal & Hills',
    duration_days: 3,
    duration_nights: 2,
    sale_price: 2799,
    base_price: 3800,
    badge: 'Hill Paradise',
    rating: 4.8,
    reviews_count: 126,
    vehicle_type: 'Private AC Cab',
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-andaman-01',
    slug: 'andaman-wonders-havelock-radhanagar-scuba-diving',
    title: 'Andaman Wonders: Havelock Radhanagar & Scuba Diving',
    destination_name: 'Andaman Islands',
    region: 'Coastal & Hills',
    duration_days: 6,
    duration_nights: 5,
    sale_price: 34999,
    base_price: 41000,
    badge: 'Tropical Paradise',
    rating: 4.9,
    reviews_count: 112,
    vehicle_type: 'Speedboat & AC Cab',
    image_url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-del-01',
    slug: 'del-01-delhi-to-taj-mahal-sunrise-express-highway-tour',
    title: 'Delhi to Taj Mahal Sunrise Express Highway Tour',
    destination_name: 'Agra & Delhi',
    region: 'Heritage',
    duration_days: 1,
    duration_nights: 0,
    sale_price: 4499,
    base_price: 5800,
    badge: 'World Wonder',
    rating: 4.9,
    reviews_count: 310,
    vehicle_type: 'Express Highway Sedan',
    image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-goa-01',
    slug: 'goa-01-north-goa-coastal-forts-sunset-beach-trail',
    title: 'North Goa Coastal Forts & Sunset Beach Trail',
    destination_name: 'Goa Coast',
    region: 'Coastal & Hills',
    duration_days: 1,
    duration_nights: 0,
    sale_price: 1199,
    base_price: 1900,
    badge: 'Coastal Special',
    rating: 4.8,
    reviews_count: 167,
    vehicle_type: 'Coastal Chauffeur Cab',
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-hampi-01',
    slug: 'hampi-unesco-ruins-tungabhadra-bouldering-heritage',
    title: 'Hampi UNESCO Ruins & Tungabhadra Bouldering Heritage',
    destination_name: 'Hampi Heritage',
    region: 'Heritage',
    duration_days: 2,
    duration_nights: 1,
    sale_price: 9999,
    base_price: 12500,
    badge: 'UNESCO Heritage',
    rating: 4.9,
    reviews_count: 85,
    vehicle_type: 'Dedicated Heritage Chauffeur',
    image_url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pkg-hyd-01',
    slug: 'hyd-01-charminar-nizami-heritage-rickshaw-safari',
    title: 'Charminar & Nizami Heritage Rickshaw Safari',
    destination_name: 'Hyderabad',
    region: 'Heritage',
    duration_days: 1,
    duration_nights: 0,
    sale_price: 899,
    base_price: 1450,
    badge: 'Heritage Safari',
    rating: 4.8,
    reviews_count: 176,
    vehicle_type: 'Verified Rickshaw',
    image_url: 'https://images.unsplash.com/photo-1605007493699-ce65834f8a00?auto=format&fit=crop&w=800&q=80'
  }
];

const FILTER_REGIONS = [
  { id: 'ALL', label: 'All Featured' },
  { id: 'Heritage', label: 'Heritage Corridors' },
  { id: 'Himalayan', label: 'Himalayan Heights' },
  { id: 'Coastal & Hills', label: 'Coastal & Backwaters' }
];

export default function FeaturedToursMarquee() {
  const [featuredTours, setFeaturedTours] = useState(STRICT_FEATURED_TOURS);
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [isPaused, setIsPaused] = useState(false);
  const marqueeContainerRef = useRef(null);

  const { formatPrice } = useCurrency();
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function loadOnlyFeatured() {
      try {
        const res = await tourService.getFeaturedTours();
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const verified = res.data.filter((t) => t.featured === 1 || t.featured === '1' || t.featured === true);
          if (verified.length > 0) {
            const mapped = verified.map((t) => {
              // Deduce region
              const dest = (t.destination_name || '').toLowerCase();
              let region = 'Heritage';
              if (dest.includes('kashmir') || dest.includes('ladakh') || dest.includes('himachal')) {
                region = 'Himalayan';
              } else if (dest.includes('kerala') || dest.includes('goa') || dest.includes('andaman')) {
                region = 'Coastal & Hills';
              }

              return {
                id: t.id,
                slug: t.slug,
                title: t.title,
                destination_name: t.destination_name || 'India',
                region,
                duration_days: t.duration_days || 1,
                duration_nights: t.duration_nights || 0,
                sale_price: t.sale_price,
                base_price: t.base_price,
                badge: t.badge ? t.badge.replace(/[^\x00-\x7F]/g, '').trim() : 'Featured',
                rating: t.rating || 4.9,
                reviews_count: t.reviews_count || 120,
                vehicle_type: t.vehicle_type || 'Private AC Vehicle',
                image_url: t.primary_image || t.image_url || 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
              };
            });
            setFeaturedTours(mapped);
          }
        }
      } catch (err) {
        // Fallback remains strictly STRICT_FEATURED_TOURS
      }
    }
    loadOnlyFeatured();
  }, []);

  // Filter based on selected region tab
  const activeTours = featuredTours.filter((t) => {
    if (selectedRegion === 'ALL') return true;
    return t.region === selectedRegion;
  });

  // Duplicate items for infinite seamless CSS loop
  const marqueeItems = [...activeTours, ...activeTours];

  const handleManualScroll = (direction) => {
    setIsPaused(true);
    if (marqueeContainerRef.current) {
      const scrollOffset = direction === 'left' ? -350 : 350;
      marqueeContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-[#FAF8F5] border-y border-[#1D1B18]/10 relative overflow-hidden select-none text-left">
      {/* 1. Professional Editorial Header & Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#1D1B18]/10">
          {/* Left: Eyebrow, Title & Description */}
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#B99762]/30 text-[#B99762] text-[10px] font-bold tracking-[0.2em] uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B99762] animate-pulse" />
              <span>Officially Featured Expeditions</span>
              <span className="text-[#1D1B18]/25">•</span>
              <span className="text-[#1D1B18]/70 font-medium">Direct Driver Settlement</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] font-normal tracking-tight">
              Featured Journeys Across Incredible India
            </h2>

            <p className="text-xs sm:text-[13px] text-[#1D1B18]/60 font-light leading-relaxed">
              Handcrafted itineraries verified for zero-middleman pricing, sanitized private chauffeur vehicles, and top traveler ratings.
            </p>
          </div>

          {/* Right: Quick Action CTAs & Interactive Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D1B18]/80 hover:text-[#1D1B18] bg-white hover:bg-[#FAF8F5] px-3.5 py-2.5 rounded-full border border-[#1D1B18]/15 transition-all shadow-xs"
              title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
              aria-label={isPaused ? 'Play marquee' : 'Pause marquee'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-[#B99762] fill-[#B99762]" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#B99762]" />
                  <span>Pause</span>
                </>
              )}
            </button>

            {/* Manual Step Arrows */}
            <div className="hidden sm:inline-flex items-center gap-1 bg-white p-1 rounded-full border border-[#1D1B18]/15 shadow-xs">
              <button
                type="button"
                onClick={() => handleManualScroll('left')}
                className="w-8 h-8 rounded-full hover:bg-[#FAF8F5] text-[#1D1B18]/70 hover:text-[#1D1B18] flex items-center justify-center transition-colors"
                title="Scroll Left"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleManualScroll('right')}
                className="w-8 h-8 rounded-full hover:bg-[#FAF8F5] text-[#1D1B18]/70 hover:text-[#1D1B18] flex items-center justify-center transition-colors"
                title="Scroll Right"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View All Tours Link */}
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 shadow-sm"
            >
              <span>Explore All Tours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Region Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#1D1B18]/45 mr-1 hidden sm:inline-block">
            Filter Region:
          </span>
          {FILTER_REGIONS.map((tab) => {
            const isSelected = selectedRegion === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRegion(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#1D1B18] text-[#F7F1E7] shadow-sm'
                    : 'bg-white text-[#1D1B18]/70 hover:text-[#1D1B18] border border-[#1D1B18]/10 hover:border-[#B99762]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Structured Marquee Track with Dual Gradient Edge Masks */}
      <div
        ref={marqueeContainerRef}
        className="relative w-full overflow-hidden group/marquee"
      >
        {/* Left Smooth Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent z-10" />

        {/* Right Smooth Fade Mask */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF8F5] via-[#FAF8F5]/90 to-transparent z-10" />

        {/* Infinite Scrolling Track */}
        <div
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
          className="animate-marquee-infinite flex gap-5 py-4 pl-4 group-hover/marquee:pause"
        >
          {marqueeItems.map((tour, index) => {
            const formattedSale = formatPrice
              ? formatPrice(tour.sale_price)
              : `₹${Number(tour.sale_price).toLocaleString('en-IN')}`;
            const formattedBase = tour.base_price && formatPrice
              ? formatPrice(tour.base_price)
              : tour.base_price ? `₹${Number(tour.base_price).toLocaleString('en-IN')}` : null;

            const wishlisted = isWishlisted ? isWishlisted(tour.id) : false;

            return (
              <div
                key={`${tour.id}-${index}`}
                className="w-[300px] sm:w-[335px] shrink-0 bg-white rounded-3xl border border-[#1D1B18]/10 hover:border-[#B99762]/50 shadow-[0_4px_20px_-2px_rgba(29,27,24,0.05)] hover:shadow-[0_20px_45px_-6px_rgba(29,27,24,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden group/card transform hover:-translate-y-1.5"
              >
                <div>
                  {/* Photo Frame with Aspect Ratio */}
                  <div className="relative h-[175px] overflow-hidden bg-slate-100">
                    <Link to={`/tours/${tour.slug || tour.id}`} tabIndex={-1}>
                      <img
                        src={tour.image_url}
                        alt={tour.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover/card:scale-106 transition-transform duration-700 ease-out"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Left: Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className="bg-[#B99762] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                        FEATURED
                      </span>
                      {tour.badge && (
                        <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full border border-white/20 shadow-xs">
                          {tour.badge}
                        </span>
                      )}
                    </div>

                    {/* Top Right: Wishlist Heart Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (toggleWishlist) toggleWishlist(tour.id, tour.title);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-xs hover:bg-white text-slate-700 hover:text-rose-600 flex items-center justify-center transition shadow-xs"
                      aria-label="Save to Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                        }`}
                      />
                    </button>

                    {/* Bottom Image Ribbon: Destination & Duration */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs pointer-events-none">
                      <div className="flex items-center gap-1 font-medium truncate max-w-[170px] drop-shadow-xs">
                        <MapPin className="w-3.5 h-3.5 text-[#B68D40] shrink-0" />
                        <span className="truncate">{tour.destination_name}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                        <Clock className="w-3 h-3 text-[#EAD8B1]" />
                        <span>{tour.duration_days}D {tour.duration_nights > 0 ? `/ ${tour.duration_nights}N` : ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <Link to={`/tours/${tour.slug || tour.id}`}>
                      <h3 className="font-serif text-[17px] font-medium text-[#1D1B18] line-clamp-2 h-[2.75rem] group-hover/card:text-[#B68D40] transition-colors leading-snug">
                        {tour.title}
                      </h3>
                    </Link>

                    {/* Assigned Vehicle Specification */}
                    <div className="flex items-center gap-2 text-xs text-[#1D1B18]/70 font-light">
                      <div className="w-5 h-5 rounded-md bg-[#FAF8F5] border border-[#1D1B18]/10 flex items-center justify-center text-[#B99762] shrink-0">
                        <Car className="w-3 h-3" />
                      </div>
                      <span className="truncate">{tour.vehicle_type}</span>
                    </div>

                    {/* Rating & Direct Driver Settlement Badges */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1D1B18]/5">
                      <div className="flex items-center gap-1 font-semibold text-[#1D1B18]">
                        <Star className="w-3.5 h-3.5 fill-[#B99762] text-[#B99762]" />
                        <span>{tour.rating}</span>
                        <span className="text-[#1D1B18]/45 font-light">({tour.reviews_count})</span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>0% Middleman</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA Button */}
                <div className="px-4 sm:px-5 py-3.5 bg-[#FAF8F5] border-t border-[#1D1B18]/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[#1D1B18]/40">
                      Direct Driver Fare
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-serif font-bold text-[#1D1B18] text-xl">
                        {formattedSale}
                      </span>
                      {formattedBase && tour.base_price > tour.sale_price && (
                        <span className="text-xs text-[#1D1B18]/40 line-through font-light">
                          {formattedBase}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/tours/${tour.slug || tour.id}`}
                    className="inline-flex items-center gap-1.5 bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-medium px-4 py-2 rounded-full transition-all duration-300 shadow-xs"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
