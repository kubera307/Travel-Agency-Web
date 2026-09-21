import React, { useState, useEffect } from 'react';
import SectionHeader from '../common/SectionHeader';
import TourCard from '../tours/TourCard';
import { TourCardSkeleton } from '../common/Skeleton';
import { tourService } from '../../services/tourService';

const FALLBACK_TOURS = [
  {
    id: 1,
    slug: 'kashmir-great-lakes-trek',
    title: 'Kashmir Great Lakes High Altitude Expedition',
    destination_name: 'Sonamarg & Gurez, Kashmir',
    duration_days: 7,
    duration_nights: 6,
    price: 18500,
    rating: 4.9,
    reviews_count: 52,
    category: 'Trek',
    overview: '7 days across 7 untouched alpine lakes, Sonamarg pass, and wildflower meadows with certified mountaineers.',
    image_url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    slug: 'leh-ladakh-monasteries-khardungla',
    title: 'Ladakh Odyssey: Khardung La & Pangong Tso',
    destination_name: 'Leh & Nubra Valley, Ladakh',
    duration_days: 8,
    duration_nights: 7,
    price: 26999,
    rating: 4.85,
    reviews_count: 84,
    category: 'Road Trip',
    overview: 'Drive through world\'s highest motorable pass, stay near turquoise Pangong lake under star-lit skies.',
    image_url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    slug: 'rajasthan-royal-forts-desert-camp',
    title: 'Royal Rajasthan: Palaces, Haveli Stays & Thar Camp',
    destination_name: 'Jaipur & Jaisalmer, Rajasthan',
    duration_days: 6,
    duration_nights: 5,
    price: 21500,
    rating: 4.92,
    reviews_count: 67,
    category: 'Heritage',
    overview: 'Live like royalty in heritage havelis, watch Rajasthani folk dances around a Thar desert bonfire.',
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    slug: 'kerala-backwaters-munnar-tea-estates',
    title: 'Kerala Serenade: Munnar Hills & Alleppey Houseboat',
    destination_name: 'Munnar & Alleppey, Kerala',
    duration_days: 5,
    duration_nights: 4,
    price: 17800,
    rating: 4.88,
    reviews_count: 46,
    category: 'Relaxation',
    overview: 'Wake up to misty tea plantations, cruise slow backwaters on an authentic teakwood kettuvallam houseboat.',
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    slug: 'spiti-valley-circuit-road-expedition',
    title: 'Spiti Valley High-Desert Circuit Expedition',
    destination_name: 'Kaza & Chandra Taal, Himachal',
    duration_days: 9,
    duration_nights: 8,
    price: 23500,
    rating: 4.95,
    reviews_count: 73,
    category: 'Adventure',
    overview: 'Traverse Kunzum Pass, ancient Key Monastery, post a letter at Hikkim (highest post office), camp at Chandra Taal.',
    image_url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    slug: 'meghalaya-living-root-bridges-dawki',
    title: 'Meghalaya Wonder: Living Root Bridges & Umngot River',
    destination_name: 'Cherrapunji & Mawlynnong, Meghalaya',
    duration_days: 6,
    duration_nights: 5,
    price: 19900,
    rating: 4.91,
    reviews_count: 39,
    category: 'Nature',
    overview: 'Hike to the Double Decker Root Bridge, boat on crystal clear Dawki waters, explore wet cave networks.',
    image_url: 'https://images.unsplash.com/photo-1623942004245-7ee4587db3d8?auto=format&fit=crop&w=800&q=80'
  }
];

export default function FeaturedTours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedTours() {
      try {
        const res = await tourService.getFeaturedTours();
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          setTours(res.data.slice(0, 6));
        } else {
          setTours(FALLBACK_TOURS);
        }
      } catch (err) {
        console.warn('Using fallback featured tours', err.message);
        setTours(FALLBACK_TOURS);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedTours();
  }, []);

  return (
    <section id="featured-tours" className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CURATED EXPERIENCES"
          title="Handpicked journeys"
          subtitle="Signature small-group and private itineraries curated by destination specialists with verified 4.8+ ratings."
          actionText="View All Tours"
          actionLink="/tours"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <TourCardSkeleton key={n} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

