import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden text-white bg-slate-950">
      {/* Background panoramic mountain image with backpacker at dusk */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2200&q=85"
          alt="Panoramic misty mountains at peaceful dusk"
          className="w-full h-full object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left: Heading & Subtitle (Cols 1-5) */}
          <div className="lg:col-span-5 text-left space-y-1.5">
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-tight">
              India is Waiting. <br />
              Are You Ready?
            </h2>
            <p className="text-xs sm:text-[13px] text-white/80 font-light max-w-sm">
              Discover places, people and experiences that stay with you forever.
            </p>
          </div>

          {/* Center: Dual Action Buttons (Cols 6-8) */}
          <div className="lg:col-span-4 flex flex-wrap items-center justify-start lg:justify-center gap-3">
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 bg-[#B68D40] hover:bg-[#a77f34] text-white px-5 py-2.5 text-xs font-semibold rounded-md transition duration-200 shadow-md"
            >
              <span>Explore Journeys</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/custom-trip-planner"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 text-xs font-semibold rounded-md transition duration-200 backdrop-blur-xs"
            >
              <span>Plan My Trip</span>
            </Link>
          </div>

          {/* Right: "Collect Moments Not Things" Script (Cols 9-12) */}
          <div className="hidden lg:flex lg:col-span-3 justify-end pr-6">
            <div className="text-right select-none pointer-events-none transform -rotate-6 font-script">
              <span className="block text-4xl xl:text-5xl text-white/95 leading-none drop-shadow-md">
                Collect
              </span>
              <span className="block text-4xl xl:text-5xl text-[#E5C989] leading-none drop-shadow-md mt-1">
                Moments
              </span>
              <span className="block text-3xl xl:text-4xl text-white/80 leading-none drop-shadow-md mt-1">
                Not Things
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
