import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, User, LayoutGrid, ArrowRight } from 'lucide-react';

const DESTINATIONS = [
  'All Destinations',
  'Mangalore',
  'Udupi',
  'Kashmir Valley',
  'Kerala Backwaters',
  'Coorg & Western Ghats',
  'Rajasthan Palaces',
  'Goa Heritage Coast',
  'Himachal Trails',
  'Hampi Heritage'
];

const EXPERIENCES = [
  { label: 'Any type', value: '' },
  { label: 'Heritage & Culture', value: 'heritage' },
  { label: 'Coastal & Beach', value: 'beach' },
  { label: 'Mountain Treks', value: 'adventure' },
  { label: 'Wildlife & Safari', value: 'wildlife' },
  { label: 'Wellness & Ayurveda', value: 'wellness' }
];

export default function FloatingTripSearch() {
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travellers, setTravellers] = useState('2 Adults');
  const [experience, setExperience] = useState('');

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination && destination !== 'All Destinations') {
      params.append('search', destination);
    }
    if (experience) {
      params.append('category', experience);
    }
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 mb-12">
      <div className="bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-100 p-2.5 sm:p-3">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
          
          {/* Field 1: Where do you want to go? */}
          <div className="md:col-span-3 text-left px-3.5 py-2 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-semibold text-slate-800 leading-tight">
                Where do you want to go?
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full text-xs text-slate-500 bg-transparent focus:outline-none cursor-pointer truncate font-normal mt-0.5"
              >
                <option value="">Search destinations</option>
                {DESTINATIONS.map((d) => (
                  <option key={d} value={d === 'All Destinations' ? '' : d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field 2: Travel Dates */}
          <div className="md:col-span-3 text-left px-3.5 py-2 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-semibold text-slate-800 leading-tight">
                Travel Dates
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full text-xs text-slate-500 bg-transparent focus:outline-none cursor-pointer font-normal mt-0.5"
                placeholder="Select dates"
              />
            </div>
          </div>

          {/* Field 3: Travellers */}
          <div className="md:col-span-2 text-left px-3.5 py-2 border-b md:border-b-0 md:border-r border-slate-100 flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-semibold text-slate-800 leading-tight">
                Travellers
              </label>
              <select
                value={travellers}
                onChange={(e) => setTravellers(e.target.value)}
                className="w-full text-xs text-slate-500 bg-transparent focus:outline-none cursor-pointer font-normal mt-0.5"
              >
                <option value="1 Adult">1 Adult</option>
                <option value="2 Adults">2 Adults</option>
                <option value="Small Group (3-5)">3–5 Adults</option>
                <option value="Family (6+)">6+ Adults</option>
              </select>
            </div>
          </div>

          {/* Field 4: Experience */}
          <div className="md:col-span-2 text-left px-3.5 py-2 border-b md:border-b-0 border-slate-100 flex items-center gap-3">
            <LayoutGrid className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-semibold text-slate-800 leading-tight">
                Experience
              </label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full text-xs text-slate-500 bg-transparent focus:outline-none cursor-pointer font-normal mt-0.5"
              >
                {EXPERIENCES.map((exp) => (
                  <option key={exp.label} value={exp.value}>
                    {exp.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field 5: Action Button */}
          <div className="md:col-span-2 p-1">
            <button
              type="submit"
              className="w-full h-11 bg-[#B68D40] hover:bg-[#a77f34] text-white rounded-xl text-xs font-semibold px-4 transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Search Trips</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
