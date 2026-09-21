import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useCurrency } from '../../context/CurrencyContext';
import { MapPin, ArrowRight, Compass, Search, Star, Sparkles } from 'lucide-react';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const { formatPrice } = useCurrency();

  const regions = {
    'North India': ['kashmir', 'himachal', 'ladakh', 'uttarakhand', 'delhi-agra', 'amritsar'],
    'South India': ['hyderabad', 'bengaluru', 'kerala', 'hampi', 'tamil-nadu'],
    'West India': ['jaipur', 'udaipur', 'goa', 'gujarat', 'mumbai'],
    'East & Central': ['varanasi', 'sikkim', 'meghalaya', 'andaman', 'odisha', 'madhya-pradesh']
  };

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get('/destinations');
        if (res.success) setDestinations(res.data || []);
      } catch (e) {
        console.error('Failed to load destinations', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredDestinations = destinations.filter((d) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      d.name?.toLowerCase().includes(q) ||
      d.state?.toLowerCase().includes(q) ||
      d.landmark_highlight?.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (selectedRegion === 'ALL') return true;
    const regionSlugs = regions[selectedRegion] || [];
    return regionSlugs.includes(d.slug || d.id);
  });

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* 1. Header Banner */}
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[30px] bg-[#102039] p-8 text-white shadow-[0_20px_44px_rgba(15,23,42,0.14)] sm:p-12 md:flex-row md:items-center">
        <div className="space-y-3 max-w-2xl relative z-10">
          <span className="rounded-full border border-[#f0b66d]/30 bg-[#f0b66d]/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#f6c98f]">
            Explore Incredible Bharat
          </span>
          <h1 className="font-display text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            22 Iconic Destinations Across India
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            From the snow peaks of Ladakh and Kashmir to the golden deserts of Rajasthan and serene backwaters of Kerala.
            Every tour is operated by verified local Sarathi chauffeurs with 0% middleman margin.
          </p>
        </div>

        <div className="relative z-10 flex flex-col items-start md:items-end gap-2 shrink-0">
          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-center backdrop-blur-md">
            <span className="font-display text-2xl font-black text-[#f6c98f]">22 States &amp; Hubs</span>
            <p className="text-[11px] text-slate-300 font-semibold uppercase tracking-wider">100% Direct Driver Pricing</p>
          </div>
        </div>
      </div>

      {/* 2. Search & Region Filter Controls */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-[24px] border border-[#e8dfd5] bg-[#fffdf9] p-4 shadow-[0_14px_30px_rgba(15,23,42,0.04)] md:flex-row">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search city, state, or landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#e1d8ce] bg-[#f7f1eb] py-2.5 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#d97706] focus:outline-none focus:ring-2 focus:ring-[#d97706]/15"
          />
        </div>

        {/* Region Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'North India', 'South India', 'West India', 'East & Central'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedRegion === reg
                  ? 'bg-[#102039] text-white shadow-sm'
                  : 'bg-[#f3eee8] text-slate-600 hover:bg-[#ebe1d7]'
              }`}
            >
              {reg === 'ALL' ? 'All Regions' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Destinations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-[3/4] bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <p className="text-slate-500 text-sm font-semibold">No destinations found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRegion('ALL');
            }}
            className="mt-3 text-xs font-bold text-orange-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug || dest.id}`}
              className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[26px] border border-[#e8dfd5] p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_44px_rgba(15,23,42,0.16)]"
            >
              {/* Background Photo */}
              <img
                src={dest.image}
                alt={dest.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />

              {/* Rich Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20 group-hover:from-black/90 transition-colors" />

              {/* Top Meta: State Badge & Rating */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider bg-black/60 px-3 py-1 rounded-xl backdrop-blur-md border border-white/15">
                  {dest.state}
                </span>
                <span className="text-[11px] font-extrabold text-white bg-white/20 px-2.5 py-1 rounded-xl backdrop-blur-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9</span>
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 text-white space-y-2">
                <h3 className="font-display font-black text-2xl text-white group-hover:text-amber-300 transition-colors leading-tight">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-200 line-clamp-1 font-medium">
                  {dest.landmark_highlight}
                </p>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase block font-semibold">Tours From</span>
                    <span className="font-display font-bold text-amber-300 text-sm">
                      {formatPrice(dest.starting_price || 8999)}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 bg-white/20 group-hover:bg-orange-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl backdrop-blur-md transition-all">
                    <span>{dest.total_packages || 3} Tours</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
