import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import {
  Compass,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  X,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminToursPage() {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { showToast } = useToast();

  // New Tour Form State
  const [newTour, setNewTour] = useState({
    title: '',
    destinationId: '',
    categoryId: '',
    tagline: '',
    durationDays: 3,
    departureCity: '',
    salePrice: '',
    basePrice: '',
    vehicleType: 'Private AC Sedan',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [toursRes, destRes, catRes] = await Promise.all([
        api.get('/admin/tours'),
        api.get('/destinations'),
        api.get('/tours/categories')
      ]);
      if (toursRes.success) setTours(toursRes.data || []);
      if (destRes.success) {
        setDestinations(destRes.data || []);
        if (destRes.data.length > 0) setNewTour((p) => ({ ...p, destinationId: destRes.data[0].id }));
      }
      if (catRes.success) {
        setCategories(catRes.data || []);
        if (catRes.data.length > 0) setNewTour((p) => ({ ...p, categoryId: catRes.data[0].id }));
      }
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateTour = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/tours', {
        ...newTour,
        images: [newTour.imageUrl],
        highlights: ['Verified Sarathi Chauffeur', 'Direct Driver UPI Payment', '100% Zero Commission'],
        inclusions: ['Fuel, parking & vehicle tolls', 'Doorstep pickup', 'Local storytelling guide', 'Heritage Accommodation'],
        exclusions: ['Personal shopping & monument entry']
      });

      if (res.success) {
        showToast('Tour package created successfully!', 'success');
        setModalOpen(false);
        loadData();
      }
    } catch (err) {
      showToast(err.message || 'Failed to create tour', 'error');
    }
  };

  const handleArchiveTour = async (id) => {
    if (!window.confirm('Are you sure you want to archive this tour package?')) return;
    try {
      const res = await api.delete(`/admin/tours/${id}`);
      if (res.success) {
        showToast('Tour package archived.', 'success');
        loadData();
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const filteredTours = tours.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      t.title?.toLowerCase().includes(q) ||
      t.destination_name?.toLowerCase().includes(q) ||
      t.category_name?.toLowerCase().includes(q);
    const matchCategory = !categoryFilter || t.category_id === categoryFilter || t.category_name === categoryFilter;
    return matchQuery && matchCategory;
  });

  const totalDepartures = tours.reduce((sum, t) => sum + Number(t.active_departures_count || 0), 0);

  return (
    <div className="space-y-6 w-full">
      {/* 1. Header Banner - Quiet Luxury Theme */}
      <div className="bg-gradient-to-r from-[#141A26] via-[#1B2332] to-[#121620] text-white rounded-3xl p-6 sm:p-8 border border-[#232B3E] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A74A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-bold text-[#D9A74A] uppercase tracking-widest bg-[#D9A74A]/15 px-3 py-1 rounded-full border border-[#D9A74A]/30">
            Catalog &amp; Fleet Inventory
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal mt-2">
            Tour Package Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-light">
            Maintain curated itineraries, scheduled departures, pricing tiers, and vehicle allocations across India
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B99762] to-[#9E7B3B] hover:from-[#C5A36E] hover:to-[#AC8846] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#B99762]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Tour</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Row - Crisp White Luxury Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total Packages</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">{tours.length}</p>
          <span className="text-[11px] text-[#B99762] font-semibold">Curated Itineraries</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Scheduled Departures</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700">{totalDepartures}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Live Across Bharat</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Destinations</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">{destinations.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">28 States &amp; UTs</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Driver Model</span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-emerald-700">100% Direct</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Zero Commission Cut</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3D9] shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tours by title, destination, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#B99762]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#EAE3D9] text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <span className="text-xs text-slate-500 font-medium hidden md:inline">
            {filteredTours.length} packages found
          </span>
        </div>
      </div>

      {/* 4. Tours Table - Crisp Luxury Style */}
      <div className="bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-[0_4px_20px_-2px_rgba(29,27,24,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D9] text-slate-500 font-semibold uppercase text-[10px] tracking-wider bg-[#FAF7F2]">
                <th className="py-3.5 px-4">Tour Package</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Direct Price</th>
                <th className="py-3.5 px-4">Departures</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D9]/60 text-slate-700">
              {filteredTours.map((t) => {
                const img = t.primary_image || t.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80';
                return (
                  <tr key={t.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={t.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#EAE3D9] shadow-xs"
                        />
                        <div className="max-w-xs">
                          <Link
                            to={`/tours/${t.slug || t.id}`}
                            target="_blank"
                            className="font-semibold text-slate-900 hover:text-[#B99762] transition-colors line-clamp-1 flex items-center gap-1"
                          >
                            <span>{t.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                          </Link>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{t.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B99762] shrink-0" />
                        <span>{t.destination_name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#EAE3D9] text-[10px] font-semibold text-slate-700">
                        {t.category_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{t.duration_days} Days</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-slate-900 text-sm">
                      ₹{Number(t.sale_price).toLocaleString('en-IN')}
                      {t.base_price > t.sale_price && (
                        <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">
                          ₹{Number(t.base_price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{t.active_departures_count || 0} Live</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Link
                          to={`/tours/${t.slug || t.id}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 shadow-xs"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleArchiveTour(t.id)}
                          className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors border border-rose-200 shadow-xs"
                          title="Archive Tour"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Modal: Create Tour - Quiet Luxury Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#EAE3D9] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D9]">
              <div>
                <h3 className="font-serif text-2xl text-slate-900 font-normal">Create Tour Package</h3>
                <p className="text-xs text-slate-500 mt-0.5">Define curated itinerary, pricing tiers, and vehicle allocations</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTour} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tour Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manali Snow Valley Rickshaw & Cab Safari"
                  value={newTour.title}
                  onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#B99762]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination *</label>
                  <select
                    value={newTour.destinationId}
                    onChange={(e) => setNewTour({ ...newTour, destinationId: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none cursor-pointer"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newTour.categoryId}
                    onChange={(e) => setNewTour({ ...newTour, categoryId: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Tagline *</label>
                <input
                  type="text"
                  required
                  placeholder="Explore ancient pine forests, mountain cafes, and royal viewpoints"
                  value={newTour.tagline}
                  onChange={(e) => setNewTour({ ...newTour, tagline: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#B99762]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newTour.durationDays}
                    onChange={(e) => setNewTour({ ...newTour, durationDays: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2499"
                    value={newTour.salePrice}
                    onChange={(e) => setNewTour({ ...newTour, salePrice: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-[#B99762] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    placeholder="3200"
                    value={newTour.basePrice}
                    onChange={(e) => setNewTour({ ...newTour, basePrice: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newTour.imageUrl}
                  onChange={(e) => setNewTour({ ...newTour, imageUrl: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE3D9] rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none"
                />
              </div>

              {/* Image Preview */}
              {newTour.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-[#EAE3D9]">
                  <img
                    src={newTour.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#D9A74A]" />
                    <span>Image Preview</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-4 border-t border-[#EAE3D9]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white bg-gradient-to-r from-[#B99762] to-[#9E7B3B] hover:from-[#C5A36E] hover:to-[#AC8846] font-bold shadow-md shadow-[#B99762]/20 transition-all"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
