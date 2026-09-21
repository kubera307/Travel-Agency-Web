import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Compass, ChevronDown } from 'lucide-react';

const POPULAR_DESTINATIONS = [
  'Kashmir',
  'Ladakh',
  'Spiti Valley',
  'Rajasthan',
  'Kerala',
  'Meghalaya',
  'Himachal',
  'Goa'
];

const MONTHS = [
  'Any Month',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const TRAVELER_TYPES = [
  { label: 'Any Travellers', value: '' },
  { label: 'Solo Traveller', value: 'solo' },
  { label: 'Couple / Duo', value: 'couple' },
  { label: 'Small Group (3-5)', value: 'small_group' },
  { label: 'Family Trip', value: 'family' }
];

export default function SearchCard() {
  const [destination, setDestination] = useState('');
  const [month, setMonth] = useState('Any Month');
  const [travelers, setTravelers] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (destination.trim()) params.append('search', destination.trim());
    if (month && month !== 'Any Month') params.append('month', month);
    if (travelers) params.append('group', travelers);

    navigate(`/tours?${params.toString()}`);
  };

  const handleSelectQuickDest = (dest) => {
    setDestination(dest);
    const params = new URLSearchParams({ search: dest });
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16">
      <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-slate-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Destination Field with Autocomplete */}
          <div className="md:col-span-4 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Where to?</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kashmir, Ladakh, Kerala..."
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Popular Regions
                </p>
                {POPULAR_DESTINATIONS.filter((d) =>
                  d.toLowerCase().includes(destination.toLowerCase())
                ).map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onMouseDown={() => {
                      setDestination(dest);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2 transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-orange-500" />
                    <span>{dest}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Month / Season Selector */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>When?</span>
            </label>
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full appearance-none text-sm font-semibold text-slate-900 border border-slate-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition bg-white"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Travelers Selector */}
          <div className="md:col-span-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-orange-600" />
              <span>Travelers</span>
            </label>
            <div className="relative">
              <select
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                className="w-full appearance-none text-sm font-semibold text-slate-900 border border-slate-200 rounded-xl px-3.5 py-3 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition bg-white"
              >
                {TRAVELER_TYPES.map((t) => (
                  <option key={t.label} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Submit Search Button */}
          <div className="md:col-span-2 pt-2 md:pt-6">
            <button
              type="submit"
              className="w-full h-[46px] rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              <span>Explore</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Popular:</span>
          {POPULAR_DESTINATIONS.slice(0, 6).map((dest) => (
            <button
              key={dest}
              type="button"
              onClick={() => handleSelectQuickDest(dest)}
              className="text-xs font-medium text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-1 rounded-lg transition"
            >
              {dest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

