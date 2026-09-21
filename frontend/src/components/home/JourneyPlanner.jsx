import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Compass, Calendar, Users, Sparkles } from 'lucide-react';

const REGIONS = [
  'All Destinations',
  'Kashmir Valley',
  'Rajasthan Palaces',
  'Kerala Backwaters',
  'Ladakh & Himalayas',
  'Goa Heritage Coast',
  'Karnataka Wilderness'
];

const EXPERIENCES = [
  'All Styles',
  'Private Heritage Stays',
  'Wellness & Ayurveda',
  'High Altitude Treks',
  'Wildlife Safaris',
  'Culinary Expeditions'
];

const SEASONS = [
  'Flexible Timing',
  'Autumn (Sep - Nov)',
  'Winter (Dec - Feb)',
  'Spring (Mar - Apr)',
  'Summer (May - Aug)'
];

export default function JourneyPlanner() {
  const [destination, setDestination] = useState('All Destinations');
  const [dates, setDates] = useState('Flexible Timing');
  const [travellers, setTravellers] = useState('2 Travellers');
  const [experience, setExperience] = useState('All Styles');

  const navigate = useNavigate();

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination && destination !== 'All Destinations') {
      const cleanDest = destination.split(' ')[0];
      params.append('search', cleanDest);
    }
    if (experience && experience !== 'All Styles') {
      params.append('category', experience.toLowerCase());
    }
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 -mt-8 sm:-mt-12 mb-16">
      <div className="bg-[#FFFFFF] border border-[#EFE4D2] p-4 sm:p-6 shadow-[0_15px_40px_rgba(29,27,24,0.06)]">
        <div className="text-left mb-3 pb-2 border-b border-[#EFE4D2]/60 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B99762]">
            Concierge Journey Planner
          </span>
          <span className="hidden sm:inline text-xs text-[#6D6A61] font-serif italic">
            Tailored around your calendar and rhythm
          </span>
        </div>

        <form onSubmit={handlePlanSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Field 1: Destination */}
          <div className="text-left">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-1">
              Destination
            </label>
            <div className="relative">
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#F7F1E7]/50 border border-[#EFE4D2] px-3.5 py-2.5 text-xs font-serif text-[#1D1B18] appearance-none focus:outline-none focus:border-[#1D1B18] transition"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Field 2: Dates / Season */}
          <div className="text-left">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-1">
              When
            </label>
            <div className="relative">
              <select
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full bg-[#F7F1E7]/50 border border-[#EFE4D2] px-3.5 py-2.5 text-xs font-serif text-[#1D1B18] appearance-none focus:outline-none focus:border-[#1D1B18] transition"
              >
                {SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Field 3: Travellers */}
          <div className="text-left">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-1">
              Travellers
            </label>
            <div className="relative">
              <select
                value={travellers}
                onChange={(e) => setTravellers(e.target.value)}
                className="w-full bg-[#F7F1E7]/50 border border-[#EFE4D2] px-3.5 py-2.5 text-xs font-serif text-[#1D1B18] appearance-none focus:outline-none focus:border-[#1D1B18] transition"
              >
                <option value="Solo Explorer">Solo Explorer</option>
                <option value="2 Travellers">2 Travellers (Couple / Duo)</option>
                <option value="Small Group (3-5)">Small Group (3–5)</option>
                <option value="Private Family (6+)">Private Family (6+)</option>
              </select>
            </div>
          </div>

          {/* Field 4: Experience */}
          <div className="text-left">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-1">
              Travel Style
            </label>
            <div className="relative">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-[#F7F1E7]/50 border border-[#EFE4D2] px-3.5 py-2.5 text-xs font-serif text-[#1D1B18] appearance-none focus:outline-none focus:border-[#1D1B18] transition"
              >
                {EXPERIENCES.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Field 5: CTA */}
          <div className="pt-2 sm:pt-0">
            <button
              type="submit"
              className="w-full h-[40px] bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white text-xs font-semibold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span>Plan Journey</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

