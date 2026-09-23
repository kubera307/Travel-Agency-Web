import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, MapPin, Star } from 'lucide-react';
import Button from '../common/Button';

export default function Hero({ onExploreClick }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-slate-950">
      {/* Background Hero Image with Optimized Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
          alt="Majestic Indian Himalayan Landscape"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Dual Gradient: Deep left gradient for text readability, subtle bottom gradient for search card blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-8 text-left space-y-6">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-orange-400 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <Compass className="w-4 h-4 text-orange-400" />
              <span>AUTHENTIC EXPERIENTIAL TRAVEL</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
              Discover India, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                one journey
              </span>{' '}
              at a time.
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
              Handcrafted small-group journeys and bespoke private expeditions across the Himalayas, golden deserts, royal palaces, and tropical backwaters. Accompanied by certified local guides.
            </p>

            {/* Call To Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onExploreClick}
                icon={ArrowRight}
                iconPosition="right"
                className="shadow-lg shadow-orange-600/25"
              >
                Explore Tours
              </Button>

              <Link to="/custom-trip-planner">
                <Button
                  variant="white"
                  size="lg"
                  className="border border-white/20"
                >
                  Plan My Trip
                </Button>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-white">4.9/5</span>
                <span className="text-slate-400">(2,400+ reviews)</span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Ministry Recognized</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>28 States & 8 UTs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Visual Balance */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="relative p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Trending Expedition
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Fixed Departure
                </span>
              </div>
              <h3 className="text-xl font-bold font-display">
                Kashmir Great Lakes Trek
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                7 Days across 7 pristine alpine lakes, Sonamarg pass, and wildflower meadows with certified mountaineers.
              </p>
              <div className="pt-3 border-t border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">From</span>
                  <span className="text-lg font-extrabold text-white">₹16,500</span>
                  <span className="text-xs text-slate-400"> / person</span>
                </div>
                <Link
                  to="/tours/kashmir-great-lakes-trek"
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-white text-slate-900 hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

