import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../utils/api';
import TourCard from '../../components/tours/TourCard';
import { MapPin, ChevronRight, Sparkles } from 'lucide-react';

export default function DestinationDetailsPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get(`/destinations/${slug}`);
        if (res.success && res.data) {
          setDestination(res.data);
        }
      } catch (err) {
        console.error('Failed to load destination', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold text-sm">Loading destination...</p>
      </div>
    );
  }

  if (!destination) return null;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <div className="relative flex h-[410px] items-end overflow-hidden bg-[#102039] p-8 text-white sm:p-12">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="eyebrow flex items-center gap-2 text-[#f6c98f]">
            <MapPin className="w-4 h-4" />
            <span>{destination.state}, India</span>
          </div>
          <h1 className="font-display text-4xl font-black tracking-[-0.06em] text-white sm:text-6xl">
            {destination.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
            {destination.short_description || destination.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Landmark Highlights */}
        {destination.landmark_highlight && (
          <div className="flex items-center gap-3 rounded-2xl border border-[#ead8bf] bg-[#fff7eb] p-5 text-xs text-[#6b451a]">
            <Sparkles className="h-5 w-5 shrink-0 text-[#d97706]" />
            <div>
              <span className="font-bold">Key Landmark Highlights:</span>{' '}
              <span>{destination.landmark_highlight}</span>
            </div>
          </div>
        )}

        {/* Tours Available */}
        <div>
          <h2 className="font-display mb-6 text-3xl font-extrabold tracking-[-0.055em] text-[#102039]">
            Available Tours in {destination.name} ({destination.tours?.length || 0})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.tours?.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

