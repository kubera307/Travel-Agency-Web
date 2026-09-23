import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { tourService } from '../../services/tourService';

const DEFAULT_FEATURED = [
  {
    id: 'tour_kashmir',
    slug: 'kashmir-great-escape',
    title: 'Kashmir Great Escape',
    duration_days: 6,
    duration_nights: 5,
    rating: 4.9,
    reviews_count: 126,
    sale_price: 42999,
    base_price: 49999,
    image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tour_kerala',
    slug: 'kerala-slow-journey',
    title: 'Kerala Backwaters Bliss',
    duration_days: 5,
    duration_nights: 4,
    rating: 4.8,
    reviews_count: 96,
    sale_price: 36999,
    base_price: 42999,
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tour_rajasthan',
    slug: 'rajasthan-royal-trail',
    title: 'Rajasthan Royal Trail',
    duration_days: 7,
    duration_nights: 6,
    rating: 4.9,
    reviews_count: 112,
    sale_price: 46999,
    base_price: 54999,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tour_coorg',
    slug: 'kudremukh-shola-rainforest-expedition',
    title: 'Coorg Nature Retreat',
    duration_days: 4,
    duration_nights: 3,
    rating: 4.7,
    reviews_count: 68,
    sale_price: 28999,
    base_price: 34999,
    image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  }
];

export default function FeaturedToursAndCustom() {
  const [tours, setTours] = useState(DEFAULT_FEATURED);
  const { isWishlisted, isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const checkWishlisted = isWishlisted || isInWishlist || (() => false);

  useEffect(() => {
    async function loadTours() {
      try {
        const res = await tourService.getFeaturedTours();
        if (res?.success && Array.isArray(res.data) && res.data.length >= 4) {
          const mapped = res.data.slice(0, 4).map((t, i) => {
            const fallback = DEFAULT_FEATURED[i % DEFAULT_FEATURED.length];
            return {
              id: t.id || fallback.id,
              slug: t.slug || fallback.slug,
              title: t.title || fallback.title,
              duration_days: t.duration_days ?? fallback.duration_days,
              duration_nights: t.duration_nights ?? fallback.duration_nights,
              rating: t.rating ?? fallback.rating,
              reviews_count: t.reviews_count ?? fallback.reviews_count,
              sale_price: t.sale_price || t.base_price || fallback.sale_price,
              base_price: t.base_price || fallback.base_price,
              image_url: t.primary_image || t.image_url || t.image || fallback.image_url
            };
          });
          setTours(mapped);
        }
      } catch (e) {
        // Safe fallback to curated signature tours
      }
    }
    loadTours();
  }, []);

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: Featured Tours (Cols 1-8) */}
          <div className="lg:col-span-8 text-left">
            <div className="flex items-end justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 block mb-1">
                  Handpicked Journeys
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-normal">
                  Featured Tours
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-light">
                  Carefully curated experiences for every kind of traveller.
                </p>
              </div>

              <Link
                to="/tours"
                className="text-xs font-semibold text-slate-700 hover:text-[#B68D40] transition flex items-center gap-1 shrink-0 ml-4"
              >
                <span>View All Tours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Premium Tour Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {tours.map((tour) => {
                const wishlisted = checkWishlisted(tour.id);
                return (
                  <div
                    key={tour.id}
                    className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative h-[125px] overflow-hidden bg-slate-100">
                        <Link to={`/tours/${tour.slug}`}>
                          <img
                            src={tour.image_url}
                            alt={tour.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </Link>
                        {/* Wishlist Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (toggleWishlist) toggleWishlist(tour.id, tour.title);
                          }}
                          aria-label="Toggle wishlist"
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center transition shadow-xs"
                        >
                          <Heart
                            className={`w-3 h-3 ${
                              wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-3 text-left">
                        <Link to={`/tours/${tour.slug}`}>
                          <h3 className="text-xs font-semibold text-slate-900 group-hover:text-[#B68D40] transition line-clamp-1">
                            {tour.title}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-slate-500 mt-0.5 font-light">
                          {tour.duration_days} Days / {tour.duration_nights} Nights
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-1.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-slate-800">{tour.rating}</span>
                          <span className="text-slate-400">({tour.reviews_count})</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="p-3 pt-0 text-left border-t border-slate-50 mt-1 flex items-baseline gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatPrice ? formatPrice(tour.sale_price) : `₹${tour.sale_price?.toLocaleString('en-IN')}`}
                      </span>
                      {tour.base_price && tour.base_price > tour.sale_price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatPrice ? formatPrice(tour.base_price) : `₹${tour.base_price?.toLocaleString('en-IN')}`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Custom Travel Experiences (Cols 9-12) */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden shadow-xs bg-[#111A15] text-white p-6 sm:p-7 flex flex-col justify-between text-left min-h-[300px]">
            {/* Dark tropical leaves background image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1000&q=80"
                alt="Tropical rainforest canopy"
                className="w-full h-full object-cover opacity-25 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111A15] via-[#111A15]/80 to-transparent" />
            </div>

            <div className="relative z-10 space-y-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B68D40] block">
                Your Trip. Your Way.
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal leading-tight text-white">
                Custom Travel <br />
                Experiences
              </h3>
              <p className="text-xs text-white/80 font-light leading-relaxed max-w-xs">
                Tell us what you're dreaming of, and we'll design a journey just for you.
              </p>
            </div>

            <div className="relative z-10 pt-5">
              <Link
                to="/custom-trip-planner"
                className="inline-flex items-center justify-center gap-2 bg-[#B68D40] hover:bg-[#a77f34] text-white py-2.5 px-5 rounded-xl text-xs font-semibold transition shadow-md"
              >
                <span>Plan My Custom Trip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
