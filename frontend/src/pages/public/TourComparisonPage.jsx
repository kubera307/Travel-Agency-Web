import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { useCurrency } from '../../context/CurrencyContext';
import {
  Layers,
  Star,
  Clock,
  MapPin,
  Car,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  Trash2,
  Plus
} from 'lucide-react';

export default function TourComparisonPage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
          <Layers className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-display font-black text-slate-900 mb-3">
          No Tours Selected for Comparison
        </h1>
        <p className="text-slate-600 max-w-md mx-auto mb-8 text-sm">
          Select up to 4 tour packages using the "Compare" checkbox on tour cards to compare itineraries, inclusions, vehicle types, and pricing side-by-side.
        </p>
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all"
        >
          <span>Explore All Tour Packages</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Interactive Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-slate-900">
            Side-by-Side Tour Comparison
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Comparing {compareList.length} of 4 selected tours. Easily review vehicles, inclusions, and prices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {compareList.length < 4 && (
            <Link
              to="/tours"
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Tour</span>
            </Link>
          )}
          <button
            onClick={clearCompare}
            className="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid / Table */}
      <div className="overflow-x-auto pb-6">
        <div className="min-w-[768px]">
          {/* Tour Card Headers */}
          <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] gap-4 items-start mb-6">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-400 pt-4">
              Tour Overview
            </div>
            {compareList.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative flex flex-col justify-between"
              >
                <button
                  onClick={() => removeFromCompare(t.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-500 hover:text-white text-slate-500 flex items-center justify-center transition-colors"
                  title="Remove from comparison"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={t.primary_image || t.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80'}
                    alt={t.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-xs text-orange-600 font-bold mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{t.destination_name || t.departure_city}</span>
                </div>

                <h3 className="font-display font-bold text-sm text-slate-900 mb-2 line-clamp-2">
                  {t.title}
                </h3>

                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{Number(t.rating || 4.9).toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({t.reviews_count || 120} reviews)</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Price per Guest</span>
                    <span className="font-display font-black text-base text-slate-900">
                      {formatPrice(t.sale_price)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/booking?tour=${t.slug || t.id}`)}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-all"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison Rows */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-sm overflow-hidden">
            {/* Row: Duration */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] p-4 items-center bg-slate-50/50">
              <span className="font-semibold text-slate-700 text-xs">Duration</span>
              {compareList.map((t) => (
                <div key={t.id} className="text-slate-900 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{t.duration_days} Days / {t.duration_nights} Nights</span>
                </div>
              ))}
            </div>

            {/* Row: Vehicle & Transport */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] p-4 items-center">
              <span className="font-semibold text-slate-700 text-xs">Vehicle / Sarathi</span>
              {compareList.map((t) => (
                <div key={t.id} className="text-slate-900 font-medium flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-orange-600" />
                  <span>{t.vehicle_type || 'Private AC Vehicle'}</span>
                </div>
              ))}
            </div>

            {/* Row: Capacity */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] p-4 items-center bg-slate-50/50">
              <span className="font-semibold text-slate-700 text-xs">Group Capacity</span>
              {compareList.map((t) => (
                <div key={t.id} className="text-slate-900 font-medium flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{t.capacity || 'Up to 4 Guests'}</span>
                </div>
              ))}
            </div>

            {/* Row: Departure City */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] p-4 items-center">
              <span className="font-semibold text-slate-700 text-xs">Departure City</span>
              {compareList.map((t) => (
                <div key={t.id} className="text-slate-900 font-medium">
                  {t.departure_city || 'Local Hub'}
                </div>
              ))}
            </div>

            {/* Row: Distance */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] p-4 items-center bg-slate-50/50">
              <span className="font-semibold text-slate-700 text-xs">Distance Covered</span>
              {compareList.map((t) => (
                <div key={t.id} className="text-slate-900 font-medium">
                  {t.distance || 'Approx. 50 Km'}
                </div>
              ))}
            </div>

            {/* Row: Direct Driver Payment */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] p-4 items-center">
              <span className="font-semibold text-slate-700 text-xs">Direct Driver Payment</span>
              {compareList.map((t) => (
                <div key={t.id} className="text-emerald-700 font-semibold flex items-center gap-1.5 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>100% Direct to Sarathi</span>
                </div>
              ))}
            </div>

            {/* Row: Cancellation */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] p-4 items-center bg-slate-50/50">
              <span className="font-semibold text-slate-700 text-xs">Cancellation Policy</span>
              {compareList.map((t) => (
                <div key={t.id} className="text-slate-700 text-xs">
                  100% Full Refund up to 24 hours prior to departure
                </div>
              ))}
            </div>

            {/* Row: Action Links */}
            <div className="grid grid-cols-[180px_repeat(auto-fit,minmax(220px,1fr))] p-4 items-center">
              <span className="font-semibold text-slate-700 text-xs">Action</span>
              {compareList.map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <Link
                    to={`/tours/${t.slug || t.id}`}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => navigate(`/booking?tour=${t.slug || t.id}`)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-all"
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

