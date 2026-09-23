import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CustomJourneySection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#1D1B18] text-white overflow-hidden">
      {/* Full-width cinematic Indian backdrop with subtle dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=85"
          alt="Taj Mahal at sunrise across the Yamuna River"
          className="w-full h-full object-cover object-center opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D1B18] via-[#1D1B18]/90 to-[#1D1B18]/70" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 mx-auto">
          <span className="h-[1px] w-6 bg-[#B99762]" />
          <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-[#B99762]">
            Bespoke Travel Design
          </span>
          <span className="h-[1px] w-6 bg-[#B99762]" />
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.1] tracking-[-0.01em]">
          Your India. <br />
          <span className="italic font-light text-[#B99762]">Your</span> rhythm.
        </h2>

        <p className="font-sans text-sm sm:text-base text-[#EFE4D2]/80 max-w-xl mx-auto leading-relaxed font-light">
          Tell us what inspires you and we’ll design a journey around it. Whether you are traveling solo, celebrating with family, or planning an intimate honeymoon, our destination specialists will tailor every detail.
        </p>

        <div className="pt-4">
          <Link
            to="/custom-trip-planner"
            className="inline-flex items-center gap-2.5 bg-[#B99762] hover:bg-white text-[#1D1B18] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg"
          >
            <span>Design My Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quiet footer note */}
        <p className="pt-4 text-[11px] font-sans uppercase tracking-widest text-[#EFE4D2]/40">
          Private Chauffeurs • Palaces & Sanctuaries • 24/7 Dedicated Concierge
        </p>
      </div>
    </section>
  );
}

