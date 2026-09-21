import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function TourCard({ tour }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  if (!tour) return null;

  const tourId = tour.id;
  const isSaved = isInWishlist(tourId);

  const price = tour.discount_price || tour.price || tour.base_price || 42999;
  const durationDays = tour.duration_days || 6;
  const durationNights = tour.duration_nights || Math.max(1, durationDays - 1);
  const rating = tour.rating || 4.9;
  const destinationName = tour.destination_name || tour.destination || 'India';
  const slug = tour.slug || `tour-${tour.id}`;

  const defaultImage = 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80';
  const imageUrl = tour.image_url || tour.featured_image || defaultImage;

  return (
    <article className="group bg-[#FFFFFF] border border-[#EFE4D2] overflow-hidden text-left hover:border-[#1D1B18]/30 transition-all duration-300 shadow-xs flex flex-col justify-between">
      {/* 1. Image first */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#EFE4D2]">
        <img
          src={imageUrl}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Minimal Wishlist icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(tourId, tour.title);
          }}
          className="absolute top-4 right-4 p-2 bg-[#F7F1E7]/85 backdrop-blur-xs hover:bg-[#FFFFFF] text-[#1D1B18] transition-colors"
          aria-label="Save journey"
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] ${
              isSaved ? 'fill-[#B99762] text-[#B99762]' : 'text-[#1D1B18]'
            }`}
          />
        </button>
      </div>

      {/* 2. Minimal Information Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Destination */}
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#B99762] block mb-1">
            {destinationName}
          </span>

          {/* Tour name (Serif, elegant) */}
          <Link to={`/tours/${slug}`}>
            <h3 className="font-serif text-xl sm:text-2xl text-[#1D1B18] font-normal group-hover:text-[#B99762] transition-colors leading-snug line-clamp-2">
              {tour.title}
            </h3>
          </Link>

          {/* Duration */}
          <p className="mt-2 text-xs font-sans text-[#6D6A61] font-light">
            {durationDays} days · {durationNights} nights
          </p>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#1D1B18]">
            <div className="flex text-[#B99762]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-[#B99762]' : 'text-[#EFE4D2]'}`}
                />
              ))}
            </div>
            <span className="font-semibold text-[11px] text-[#6D6A61]">{Number(rating).toFixed(1)}</span>
          </div>
        </div>

        {/* 3. Starting price & Explore link */}
        <div className="pt-4 border-t border-[#EFE4D2] flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#6D6A61] block leading-none">
              From
            </span>
            <span className="font-serif text-xl text-[#1D1B18] font-medium block mt-1">
              {formatPrice ? formatPrice(price) : `₹${Number(price).toLocaleString('en-IN')}`}
            </span>
          </div>

          <Link
            to={`/tours/${slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#1D1B18] hover:text-[#B99762] transition-colors"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
