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
        inclusions: ['Fuel, parking & vehicle tolls', 'Doorstep pickup', 'Local storytelling guide', '4★ Accommodation'],
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
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0C1A32] via-[#122549] to-[#0A162C] rounded-3xl p-6 sm:p-8 border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-orange-400 uppercase tracking-widest bg-orange-500/15 px-3 py-1 rounded-full border border-orange-500/30">
            Catalog &amp; Fleet Inventory
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white mt-2">
            Tour Package Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Maintain curated itineraries, scheduled departures, pricing tiers, and vehicle allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Tour</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Packages</span>
          <p className="font-display font-black text-2xl text-white">{tours.length}</p>
          <span className="text-[10px] text-orange-400 font-semibold">Active Itineraries</span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Scheduled Departures</span>
          <p className="font-display font-black text-2xl text-emerald-400">{totalDepartures}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">Live across India</span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Destinations</span>
          <p className="font-display font-black text-2xl text-white">{destinations.length}</p>
          <span className="text-[10px] text-slate-400 font-semibold">22 Indian states</span>
        </div>
        <div className="bg-[#0D192F] p-4 sm:p-5 rounded-2xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Driver Model</span>
          <p className="font-display font-black text-2xl text-emerald-400">100% Direct</p>
          <span className="text-[10px] text-emerald-400 font-semibold">0% Brokerage Cut</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-[#0D192F] p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tours by title, destination, style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 text-xs font-bold text-slate-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-bold hidden md:inline">
            {filteredTours.length} tours found
          </span>
        </div>
      </div>

      {/* 4. Tours Table */}
      <div className="bg-[#0D192F] rounded-2xl border border-slate-800/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] bg-slate-900/60">
                <th className="py-3.5 px-4">Tour Package</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Direct Price</th>
                <th className="py-3.5 px-4">Departures</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredTours.map((t) => {
                const img = t.primary_image || t.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80';
                return (
                  <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={t.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700/80 shadow-xs"
                        />
                        <div className="max-w-xs">
                          <Link
                            to={`/tours/${t.slug || t.id}`}
                            target="_blank"
                            className="font-bold text-white hover:text-orange-400 transition-colors line-clamp-1 flex items-center gap-1"
                          >
                            <span>{t.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                          </Link>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{t.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-200">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                        <span>{t.destination_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-300">
                        {t.category_name}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-200">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{t.duration_days} Days</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-black text-amber-400 text-sm">
                      ₹{Number(t.sale_price).toLocaleString('en-IN')}
                      {t.base_price > t.sale_price && (
                        <span className="text-[10px] text-slate-500 line-through ml-1.5 font-normal">
                          ₹{Number(t.base_price).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{t.active_departures_count || 0} Live</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Link
                          to={`/tours/${t.slug || t.id}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleArchiveTour(t.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors border border-rose-500/20"
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

      {/* 5. Modal: Create Tour */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D192F] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-display font-black text-lg text-white">Create New Tour Package</h3>
                <p className="text-xs text-slate-400 mt-0.5">Define itinerary, pricing, and vehicle details</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTour} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Tour Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manali Snow Valley Rickshaw & Cab Safari"
                  value={newTour.title}
                  onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Destination *</label>
                  <select
                    value={newTour.destinationId}
                    onChange={(e) => setNewTour({ ...newTour, destinationId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category *</label>
                  <select
                    value={newTour.categoryId}
                    onChange={(e) => setNewTour({ ...newTour, categoryId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Short Tagline *</label>
                <input
                  type="text"
                  required
                  placeholder="Explore ancient pine forests, mountain cafes, and royal viewpoints"
                  value={newTour.tagline}
                  onChange={(e) => setNewTour({ ...newTour, tagline: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newTour.durationDays}
                    onChange={(e) => setNewTour({ ...newTour, durationDays: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2499"
                    value={newTour.salePrice}
                    onChange={(e) => setNewTour({ ...newTour, salePrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="3200"
                    value={newTour.basePrice}
                    onChange={(e) => setNewTour({ ...newTour, basePrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newTour.imageUrl}
                  onChange={(e) => setNewTour({ ...newTour, imageUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              {/* Image Preview */}
              {newTour.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-slate-700/80">
                  <img
                    src={newTour.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-orange-400" />
                    <span>Image Preview</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-extrabold shadow-lg transition-all"
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
