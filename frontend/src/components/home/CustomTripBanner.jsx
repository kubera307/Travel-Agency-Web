import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Compass } from 'lucide-react';
import Button from '../common/Button';

export default function CustomTripBanner() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle Background Graphic */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Columns */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold tracking-wider uppercase border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tailor-Made Itineraries</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-display">
                Your trip. Your way.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Whether you're celebrating a honeymoon, planning an extended family reunion, or seeking a solo photographic expedition, our destination specialists craft bespoke itineraries matched precisely to your schedule and preferences.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>100% Bespoke Routes</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Private Chauffeur & Stays</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Proposal within 24 Hours</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link to="/custom-trip-planner">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="shadow-lg shadow-orange-600/30"
                  >
                    Plan My Trip
                  </Button>
                </Link>

                <a
                  href="https://wa.me/919876543210?text=Hi%20Travel%20India!%20I%20would%20like%20to%20discuss%20a%20custom%20itinerary."
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-4 py-3 rounded-xl border border-white/20 hover:border-white/40 transition"
                >
                  Speak with a Specialist &rarr;
                </a>
              </div>
            </div>

            {/* Right 4 Columns */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-sm">
                    TI
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Dedicated Travel Designer</p>
                    <p className="text-[11px] text-slate-400">Average response time: 25 mins</p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-xs text-slate-300 italic">
                  "We planned a 12-day Rajasthan & Varanasi private trip through NammaYatra. Every palace hotel, driver, and private monument entry was completely flawless!"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Vikram & Radhika S.</span>
                  <span className="text-orange-400 font-semibold">Custom Trip &bull; Nov 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

