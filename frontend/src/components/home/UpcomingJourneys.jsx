import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { api } from '../../utils/api';
import { useCurrency } from '../../context/CurrencyContext';

const FALLBACK_DEPARTURES = [
  {
    date: '26 SEP',
    region: 'KASHMIR',
    title: 'Valleys & Quiet Mornings',
    duration: '6 DAYS',
    price: 42999,
    seatsLeft: 4,
    slug: 'kashmir-great-escape'
  },
  {
    date: '04 OCT',
    region: 'RAJASTHAN',
    title: 'Royal Routes & Desert Silence',
    duration: '7 DAYS',
    price: 49999,
    seatsLeft: 6,
    slug: 'rajasthan-royal-trail'
  },
  {
    date: '11 OCT',
    region: 'KERALA',
    title: 'Backwaters, Spice & Stillness',
    duration: '6 DAYS',
    price: 36999,
    seatsLeft: 3,
    slug: 'kerala-slow-journey'
  },
  {
    date: '22 OCT',
    region: 'HIMALAYAS',
    title: 'High Altitude Cedar Passes',
    duration: '8 DAYS',
    price: 46500,
    seatsLeft: 5,
    slug: 'kashmir-great-lakes-trek'
  },
  {
    date: '05 NOV',
    region: 'KARNATAKA',
    title: 'Stone Temples & Coffee Hills',
    duration: '6 DAYS',
    price: 38000,
    seatsLeft: 7,
    slug: 'karnataka-culture-wild'
  }
];

export default function UpcomingJourneys() {
  const [departures, setDepartures] = useState(FALLBACK_DEPARTURES);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    // Attempt to load live upcoming tours/departures from the backend
    async function loadDepartures() {
      try {
        const res = await api.get('/tours?upcoming=true&limit=5');
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((t, idx) => {
            const depDate = t.departures?.[0]?.departure_date || 'Upcoming';
            return {
              date: depDate,
              region: t.destination_name ? t.destination_name.toUpperCase() : 'INDIA',
              title: t.title,
              duration: `${t.duration_days || 6} DAYS`,
              price: t.discount_price || t.price || 42999,
              seatsLeft: t.departures?.[0]?.available_seats || 4,
              slug: t.slug
            };
          });
          setDepartures(mapped);
        }
      } catch (e) {
        // Quiet fallback
      }
    }
    loadDepartures();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-[#F7F1E7] border-t border-[#EFE4D2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 text-left">
          <div>
            <span className="editorial-eyebrow">
              Fixed Small-Group Expeditions
            </span>
            <h2 className="editorial-title">
              Upcoming Departures
            </h2>
          </div>
          <Link
            to="/upcoming-departures"
            className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#1D1B18] hover:text-[#B99762] transition-colors inline-flex items-center gap-1.5"
          >
            <span>Full Departure Calendar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Minimal Editorial Departure List */}
        <div className="divide-y divide-[#EFE4D2] border-y border-[#EFE4D2]">
          {departures.map((item, index) => (
            <div
              key={index}
              className="py-6 sm:py-7 grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center hover:bg-[#EFE4D2]/25 px-3 transition-colors text-left"
            >
              {/* Col 1: Date (Cols 1-2) */}
              <div className="sm:col-span-2">
                <span className="font-serif text-2xl text-[#1D1B18] font-medium tracking-tight block">
                  {item.date}
                </span>
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#B99762]">
                  Confirmed
                </span>
              </div>

              {/* Col 2: Region & Title (Cols 3-7) */}
              <div className="sm:col-span-5">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.28em] text-[#6D725C] block mb-0.5">
                  {item.region}
                </span>
                <Link
                  to={`/tours/${item.slug}`}
                  className="font-serif text-xl sm:text-2xl text-[#1D1B18] hover:text-[#B99762] transition-colors leading-snug"
                >
                  {item.title}
                </Link>
              </div>

              {/* Col 3: Duration & Slots (Cols 8-9) */}
              <div className="sm:col-span-2 text-left sm:text-center">
                <span className="text-xs uppercase tracking-wider text-[#6D6A61] block">
                  {item.duration}
                </span>
                <span className="text-[11px] font-sans text-[#B99762]">
                  {item.seatsLeft} guests maximum
                </span>
              </div>

              {/* Col 4: Price & Action (Cols 10-12) */}
              <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-5">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#6D6A61] block leading-none">
                    From
                  </span>
                  <span className="font-serif text-xl text-[#1D1B18] font-medium">
                    {formatPrice ? formatPrice(item.price) : `₹${item.price.toLocaleString('en-IN')}`}
                  </span>
                </div>

                <Link
                  to={`/tours/${item.slug}`}
                  className="inline-flex items-center gap-1.5 border border-[#1D1B18] text-[#1D1B18] hover:bg-[#1D1B18] hover:text-[#F7F1E7] px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold transition-all duration-300"
                >
                  <span>Reserve</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

