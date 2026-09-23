import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function EditorialIntro() {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F1E7] border-t border-[#EFE4D2]/70">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT: Editorial Philosophy Text (Cols 1-7) */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="editorial-eyebrow">
              The Art of Slow Travel
            </span>

            <h2 className="editorial-title">
              India rewards the curious.
            </h2>

            <p className="editorial-body">
              True travel in the subcontinent cannot be measured in landmark checklists or hurried transfers. It reveals itself in unscripted pauses—a steaming cup of Kahwa shared with a saffron farmer in Pampore, dawn chants reverberating across the Varanasi ghats, or the hypnotic rhythm of an Alleppey backwater as dusk turns the water to bronze.
            </p>

            <p className="editorial-body">
              At NAMMAYATHRA, we curate intimate sanctuaries: restored 300-year-old desert havelis, fragrant spice-plantation estates, and secluded Himalayan retreats. Each itinerary honors your personal rhythm, guided by regional historians and culinary custodians who call these lands home.
            </p>

            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1D1B18] hover:text-[#B99762] group transition-colors"
              >
                <span>Read Our Travel Manifesto</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Asymmetrical Editorial Photography (Cols 8-12) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Main portrait photo */}
              <div className="h-[420px] sm:h-[480px] w-full overflow-hidden bg-[#EFE4D2] shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80"
                  alt="Mindful traveler gazing over Himalayan mist and cedar valleys"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>

              {/* Minimalist quote plaque on border */}
              <div className="absolute -bottom-8 -left-6 sm:-left-8 bg-[#EFE4D2] p-6 max-w-[260px] text-left border border-[#E5DAC8] shadow-md hidden sm:block">
                <p className="font-serif italic text-sm text-[#1D1B18] leading-relaxed">
                  "To travel slowly is to allow the soul to catch up with the eyes."
                </p>
                <span className="block mt-2 text-[9px] uppercase tracking-[0.2em] text-[#B99762]">
                  NAMMAYATHRA Philosophy
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

