import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Compass, Users, Star, Gift } from 'lucide-react';

export default function HeroSection({ onExploreClick }) {
  return (
    <section className="relative min-h-[90vh] sm:min-h-[94vh] flex flex-col justify-between pt-28 pb-24 sm:pb-28 overflow-hidden text-white bg-slate-950">
      {/* Background Image: Aerial coastal lighthouse with turquoise waves and palms */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-lighthouse.jpg"
          alt="Kapu Beach Lighthouse, Coastal Karnataka"
          className="w-full h-full object-cover object-[center_35%]"
        />
        {/* Cinematic gradient overlays matching the reference image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto text-left pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Eyebrow, Heading, Paragraph, Buttons */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            {/* Small Eyebrow */}
            <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90">
              Experience A Deeper India
            </div>

            {/* Large Serif Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[76px] font-normal leading-[1.05] tracking-tight text-white">
              Journeys <br />
              Beyond Ordinary
            </h1>

            {/* Supporting Text */}
            <div className="space-y-1 text-sm sm:text-[15px] text-white/85 max-w-lg font-light leading-relaxed">
              <p>Curated tours. Authentic experiences. Unforgettable moments.</p>
              <p>Discover a more meaningful way to travel across India.</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 bg-[#B68D40] hover:bg-[#a77f34] text-white px-6 py-2.5 sm:px-7 sm:py-3 text-xs font-medium rounded-md transition duration-200 shadow-md"
              >
                <span>Explore Tours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                to="/custom-trip-planner"
                className="inline-flex items-center gap-2 bg-black/25 hover:bg-black/40 text-white border border-white/30 px-6 py-2.5 sm:px-7 sm:py-3 text-xs font-medium rounded-md transition duration-200 backdrop-blur-xs"
              >
                <span>Plan My Trip</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Handwritten Cursive Script ("Coastal Karnataka Unexplored Unforgettable") */}
          <div className="hidden lg:flex lg:col-span-4 justify-end pr-6">
            <div className="text-right select-none pointer-events-none transform -rotate-6 font-script">
              <span className="block text-4xl xl:text-5xl text-white leading-none drop-shadow-md">
                Coastal
              </span>
              <span className="block text-4xl xl:text-5xl text-[#E5C989] leading-none drop-shadow-md mt-1">
                Karnataka
              </span>
              <span className="block text-3xl xl:text-4xl text-white/95 leading-none drop-shadow-md mt-1">
                Unexplored
              </span>
              <span className="block text-3xl xl:text-4xl text-[#E5C989] leading-none drop-shadow-md mt-1">
                Unforgettable
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Row: Stats Strip on the Left & Location Tag on the Right */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/15 pt-5">
          {/* Statistics Strip */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-white">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#B68D40]" />
              <div className="text-left">
                <span className="font-semibold text-white block leading-none text-xs">200+</span>
                <span className="text-[10px] text-white/70">Curated Tours</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#B68D40]" />
              <div className="text-left">
                <span className="font-semibold text-white block leading-none text-xs">50+</span>
                <span className="text-[10px] text-white/70">Destinations</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#B68D40]" />
              <div className="text-left">
                <span className="font-semibold text-white block leading-none text-xs">10K+</span>
                <span className="text-[10px] text-white/70">Happy Travellers</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#B68D40] fill-[#B68D40]" />
              <div className="text-left">
                <span className="font-semibold text-white block leading-none text-xs">4.8★</span>
                <span className="text-[10px] text-white/70">Average Rating</span>
              </div>
            </div>
          </div>

          {/* Location Pin */}
          <div className="inline-flex items-center gap-1.5 text-[11px] text-white/80 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10 self-start sm:self-auto">
            <MapPin className="w-3 h-3 text-[#B68D40]" />
            <span>Kapu Beach, Udupi, Karnataka</span>
          </div>
        </div>
      </div>
    </section>
  );
}
