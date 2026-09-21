import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Sparkles, Compass, ArrowRight } from 'lucide-react';

export default function HeroSearchWidget({ destinations = [], categories = [] }) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tours'); // 'tours' | 'custom' | 'treks'
  const [destination, setDestination] = useState('all');
  const [category, setCategory] = useState('all');
  const [date, setDate] = useState('');
  const [travellers, setTravellers] = useState('2');

  const popularChips = [
    { label: 'Kashmir Valley', value: 'kashmir', icon: '❄️' },
    { label: 'Goa Beaches', value: 'goa', icon: '🏖️' },
    { label: 'Kerala Backwaters', value: 'kerala', icon: '🌴' },
    { label: 'Rajasthan Palaces', value: 'jaipur', icon: '🏰' },
    { label: 'Leh Ladakh', value: 'ladakh', icon: '🏔️' },
    { label: 'Varanasi Ghats', value: 'varanasi', icon: '🪔' }
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'custom') {
      navigate('/custom-trip-planner');
    } else if (tab === 'treks') {
      navigate('/tours?category=adventure');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination !== 'all') params.set('destination', destination);
    if (category !== 'all') params.set('category', category);
    if (date) params.set('date', date);
    if (travellers) params.set('travellers', travellers);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] border border-slate-100 text-left">
      {/* Top Search Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => handleTabClick('tours')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tours'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🏖️</span>
            <span>All Tour Packages</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Custom Itinerary</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('treks')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-all flex items-center gap-1.5 hidden sm:flex"
          >
            <span>⛰️</span>
            <span>Himalayan Treks</span>
          </button>
        </div>

        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>100% Direct Driver Booking</span>
        </div>
      </div>

      {/* Main Search Fields Grid */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Field 1: Destination */}
        <div className="lg:col-span-4 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-2xl p-3 border border-slate-200/80 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-orange-500" />
            <span>Where to in India?</span>
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="all">All 22 Top Destinations</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>

        {/* Field 2: Date */}
        <div className="lg:col-span-3 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-2xl p-3 border border-slate-200/80 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-orange-500" />
            <span>Travel Date</span>
          </label>
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          />
        </div>

        {/* Field 3: Travellers */}
        <div className="lg:col-span-2 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-2xl p-3 border border-slate-200/80 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
            <Users className="w-3 h-3 text-orange-500" />
            <span>Guests</span>
          </label>
          <select
            value={travellers}
            onChange={(e) => setTravellers(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="1">1 Solo Explorer</option>
            <option value="2">2 Couple / Duo</option>
            <option value="4">3-4 Family</option>
            <option value="6">5-8 Friends Group</option>
            <option value="12">9+ Big Group</option>
          </select>
        </div>

        {/* Field 4: Category */}
        <div className="lg:col-span-3 bg-slate-50 hover:bg-slate-100/70 transition-colors rounded-2xl p-3 border border-slate-200/80 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
            <Compass className="w-3 h-3 text-orange-500" />
            <span>Trip Style</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="all">All Trip Styles</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bottom Quick Chips + Submit Button */}
        <div className="lg:col-span-12 pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Popular Now:
            </span>
            {popularChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setDestination(chip.value);
                  navigate(`/tours?destination=${chip.value}`);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 px-3 py-1.5 rounded-full transition-all border border-slate-200/60"
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Explore Tours</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
