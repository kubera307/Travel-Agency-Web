import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { ArrowUpDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import TourCard from '../../components/tours/TourCard';

const FALLBACK_TOURS = [
  {
    id: 1,
    title: 'Kashmir: Valleys, Alpine Tarns & Houseboat Stillness',
    slug: 'kashmir-great-escape',
    destination_name: 'Kashmir',
    price: 42999,
    duration_days: 6,
    duration_nights: 5,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2400&q=90',
    category: 'Himalayan'
  },
  {
    id: 2,
    title: 'Kerala: Backwaters, Spice Hills & Vembanad Cruise',
    slug: 'kerala-slow-journey',
    destination_name: 'Kerala',
    price: 36999,
    duration_days: 6,
    duration_nights: 5,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90',
    category: 'Backwaters'
  },
  {
    id: 3,
    title: 'Rajasthan: Living Palaces & Thar Stargazing Camp',
    slug: 'rajasthan-royal-trail',
    destination_name: 'Rajasthan',
    price: 49999,
    duration_days: 7,
    duration_nights: 6,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90',
    category: 'Heritage'
  },
  {
    id: 4,
    title: 'Goa: Portuguese Latin Mansions & Secluded Coves',
    slug: 'goa-heritage-stays',
    destination_name: 'Goa',
    price: 28999,
    duration_days: 4,
    duration_nights: 3,
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=90',
    category: 'Coastal'
  },
  {
    id: 5,
    title: 'Himachal: High Himalayan Ridges & Cedar Chalets',
    slug: 'himachal-trails',
    destination_name: 'Himachal',
    price: 39999,
    duration_days: 7,
    duration_nights: 6,
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
    category: 'Mountain'
  },
  {
    id: 6,
    title: 'Coastal Karnataka: Kapu Lighthouse & Coffee Estates',
    slug: 'karnataka-culture-wild',
    destination_name: 'Karnataka',
    price: 34999,
    duration_days: 5,
    duration_nights: 4,
    rating: 4.9,
    image_url: '/hero-lighthouse.jpg',
    category: 'Wilderness'
  },
  {
    id: 7,
    title: 'Ladakh: Pangong Tso Azure Lake & Khardung La Pass',
    slug: 'leh-ladakh-pangong-lake-nubra-valley-khardung-la',
    destination_name: 'Ladakh',
    price: 38999,
    duration_days: 7,
    duration_nights: 6,
    rating: 5.0,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
    category: 'Himalayan'
  },
  {
    id: 8,
    title: 'Varanasi: Subah-e-Banaras Ghats & Sacred Aarti',
    slug: 'vns-01-subah-e-banaras-ghats-kashi-vishwanath-rickshaw-yatra',
    destination_name: 'Varanasi',
    price: 18999,
    duration_days: 3,
    duration_nights: 2,
    rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90',
    category: 'Heritage'
  }
];

export default function ToursPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [duration, setDuration] = useState(searchParams.get('duration') || 'all');
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended');
  const [page, setPage] = useState(1);

  const [tours, setTours] = useState(FALLBACK_TOURS);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [destRes, catRes] = await Promise.all([
          api.get('/destinations'),
          api.get('/tours/categories')
        ]);
        if (destRes.success && Array.isArray(destRes.data)) setDestinations(destRes.data);
        if (catRes.success && Array.isArray(catRes.data)) setCategories(catRes.data);
      } catch (error) {
        console.error('Failed to load filter metadata', error);
      }
    }
    loadMeta();
  }, []);

  // Reactively synchronize local state when URL searchParams change
  useEffect(() => {
    const qSearch = searchParams.get('search') || '';
    const qDest = searchParams.get('destination') || 'all';
    const qCat = searchParams.get('category') || 'all';
    const qDur = searchParams.get('duration') || 'all';
    const qPrice = searchParams.get('priceRange') || 'all';
    const qSort = searchParams.get('sort') || 'recommended';

    setSearch(qSearch);
    setDestination(qDest);
    setCategory(qCat);
    setDuration(qDur);
    setPriceRange(qPrice);
    setSort(qSort);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    async function fetchTours() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search.trim()) params.set('search', search.trim());
        if (destination !== 'all') params.set('destination', destination);
        if (category !== 'all') params.set('category', category);
        if (duration !== 'all') params.set('duration', duration);
        if (priceRange === 'budget') params.set('maxPrice', '30000');
        else if (priceRange === 'mid') {
          params.set('minPrice', '30000');
          params.set('maxPrice', '50000');
        } else if (priceRange === 'luxury') {
          params.set('minPrice', '50000');
        }
        params.set('sort', sort);
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await api.get(`/tours?${params.toString()}`);
        if (res.success && Array.isArray(res.data)) {
          setTours(res.data);
        } else {
          setTours(FALLBACK_TOURS);
        }
      } catch (error) {
        console.error('Failed to fetch tours', error);
        setTours(FALLBACK_TOURS);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, [search, destination, category, duration, priceRange, sort, page]);

  const resetFilters = () => {
    setSearch('');
    setDestination('all');
    setCategory('all');
    setDuration('all');
    setPriceRange('all');
    setSort('recommended');
    setPage(1);
    setSearchParams({});
  };

  const paginationText = useMemo(() => `${tours.length} curated journeys found`, [tours.length]);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-10 md:py-16 text-left">
      {/* Header Banner */}
      <div className="mb-12 pb-8 border-b border-[#EFE4D2] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="editorial-eyebrow">
            The Complete Anthology
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#1D1B18] font-normal leading-tight">
            Curated Journeys
          </h1>
          <p className="mt-3 max-w-xl text-sm text-[#6D6A61] leading-relaxed font-light">
            Thoughtfully planned expeditions with regional custodians, sanctuary stays, and generous room to travel at your cadence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 border border-[#1D1B18]/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1D1B18] lg:hidden"
          >
            <Filter className="w-3.5 h-3.5 text-[#B99762]" /> Filters
          </button>

          <div className="flex items-center gap-2 border border-[#EFE4D2] bg-white px-3.5 py-2 text-xs text-[#1D1B18]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6D6A61]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs font-medium outline-none"
            >
              <option value="recommended">Recommended Order</option>
              <option value="price_asc">Price: Gentle to Rare</option>
              <option value="price_desc">Price: Rare to Gentle</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Filter Sidebar & Cards Grid */}
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE4D2]">
            <div className="flex items-center gap-2 text-[#1D1B18]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B99762]" />
              <h2 className="font-serif text-lg">Filter Portfolio</h2>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-sans uppercase tracking-wider text-[#B99762] hover:text-[#1D1B18]"
            >
              Reset
            </button>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-2">
                Search
              </label>
              <div className="flex items-center gap-2 border border-[#EFE4D2] bg-white px-3 py-2">
                <Search className="w-3.5 h-3.5 text-[#6D6A61]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Palace, tarn, spice..."
                  className="w-full bg-transparent text-xs text-[#1D1B18] outline-none placeholder:text-[#6D6A61]/50"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-2">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full border border-[#EFE4D2] bg-white px-3 py-2 text-xs text-[#1D1B18] outline-none"
              >
                <option value="all">All Destinations</option>
                {destinations.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-2">
                Travel Style
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#EFE4D2] bg-white px-3 py-2 text-xs text-[#1D1B18] outline-none"
              >
                <option value="all">All Styles</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.slug}>{item.name}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-2">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-[#EFE4D2] bg-white px-3 py-2 text-xs text-[#1D1B18] outline-none"
              >
                <option value="all">Any Length</option>
                <option value="1-3">Weekend (1–3 Days)</option>
                <option value="4-7">Mid-Length (4–7 Days)</option>
                <option value="8+">Extended (8+ Days)</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6D6A61] mb-2">
                Budget Tier
              </label>
              <div className="space-y-2 text-xs text-[#6D6A61]">
                {[
                  { id: 'all', label: 'All Tiers' },
                  { id: 'budget', label: 'Under ₹30,000' },
                  { id: 'mid', label: '₹30,000 - ₹50,000' },
                  { id: 'luxury', label: '₹50,000 & Above' }
                ].map((item) => (
                  <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceRange === item.id}
                      onChange={() => setPriceRange(item.id)}
                      className="text-[#B99762] focus:ring-0"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Tours Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between text-xs text-[#6D6A61]">
            <span>{paginationText}</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white border border-[#EFE4D2] p-4 h-[420px] animate-pulse">
                  <div className="h-60 bg-[#EFE4D2]/60 mb-4" />
                  <div className="h-4 bg-[#EFE4D2]/60 w-1/3 mb-2" />
                  <div className="h-6 bg-[#EFE4D2]/60 w-3/4 mb-4" />
                  <div className="h-4 bg-[#EFE4D2]/60 w-1/2" />
                </div>
              ))}
            </div>
          ) : tours.length === 0 ? (
            <div className="bg-white border border-[#EFE4D2] rounded-2xl p-12 text-center space-y-4 shadow-xs">
              <span className="text-4xl block">🧭</span>
              <h3 className="font-serif text-2xl text-[#1D1B18]">No Curated Journeys Found</h3>
              <p className="text-xs sm:text-sm text-[#6D6A61] max-w-md mx-auto font-light leading-relaxed">
                We couldn't find any journeys matching your exact combination of filters. Try clearing your filters or exploring our signature expeditions.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] text-xs uppercase tracking-widest font-semibold transition rounded-none shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {tours.map((tour) => (
                <TourCard key={tour.id || tour.slug} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-[#1D1B18]/60 backdrop-blur-xs lg:hidden">
          <div className="absolute inset-x-0 bottom-0 bg-[#F7F1E7] p-6 shadow-2xl border-t border-[#EFE4D2] max-h-[85vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between pb-3 border-b border-[#EFE4D2]">
              <h3 className="font-serif text-xl text-[#1D1B18]">Filter Journeys</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#6D6A61]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-left">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#6D6A61] block mb-1">Destination</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-white border border-[#EFE4D2] p-2.5 text-xs text-[#1D1B18]"
                >
                  <option value="all">All Destinations</option>
                  {destinations.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#6D6A61] block mb-1">Style</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-[#EFE4D2] p-2.5 text-xs text-[#1D1B18]"
                >
                  <option value="all">All Styles</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.slug}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full bg-[#1D1B18] text-[#F7F1E7] py-3 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
