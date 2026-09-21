import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, ArrowRight, Flame } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { useCurrency } from '../../context/CurrencyContext';

const UPCOMING_TRIPS = [
  {
    id: 1,
    title: 'Kashmir Great Lakes Alpine Expedition',
    destination: 'Sonamarg, Kashmir',
    departureDate: '12 Oct 2026',
    duration: '7 Days',
    totalSlots: 12,
    slotsLeft: 3,
    price: 18500,
    slug: 'kashmir-great-lakes-trek'
  },
  {
    id: 2,
    title: 'Spiti Valley Autumn Stargazing Roadtrip',
    destination: 'Kaza & Chandra Taal, HP',
    departureDate: '18 Oct 2026',
    duration: '9 Days',
    totalSlots: 10,
    slotsLeft: 4,
    price: 23500,
    slug: 'spiti-valley-circuit-road-expedition'
  },
  {
    id: 3,
    title: 'Rajasthan Royal Heritage & Desert Dunes',
    destination: 'Jaipur & Jaisalmer',
    departureDate: '24 Oct 2026',
    duration: '6 Days',
    totalSlots: 14,
    slotsLeft: 5,
    price: 21500,
    slug: 'rajasthan-royal-forts-desert-camp'
  },
  {
    id: 4,
    title: 'Kerala Backwaters & Tea Trails Retreat',
    destination: 'Munnar & Alleppey',
    departureDate: '02 Nov 2026',
    duration: '5 Days',
    totalSlots: 12,
    slotsLeft: 2,
    price: 17800,
    slug: 'kerala-backwaters-munnar-tea-estates'
  }
];

export default function UpcomingTrips() {
  const { formatPrice } = useCurrency();

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FIXED DEPARTURES"
          title="Trips leaving soon"
          subtitle="Confirmed departure dates with like-minded travelers. Small groups of 8 to 14 people with verified trip captains."
          actionText="All Upcoming Departures"
          actionLink="/upcoming-departures"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {UPCOMING_TRIPS.map((trip) => {
            const isUrgent = trip.slotsLeft <= 3;
            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Departure Date Badge & Urgency */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>{trip.departureDate}</span>
                    </div>

                    {isUrgent && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg">
                        <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                        Almost Full
                      </span>
                    )}
                  </div>

                  {/* Destination & Duration */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{trip.destination}</span>
                    </span>
                    <span className="font-semibold text-slate-700">{trip.duration}</span>
                  </div>

                  {/* Trip Title */}
                  <Link to={`/tours/${trip.slug}`}>
                    <h3 className="text-base font-bold text-slate-900 font-display hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                      {trip.title}
                    </h3>
                  </Link>

                  {/* Availability Meter */}
                  <div className="pt-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-500">Availability:</span>
                      <span className={`font-bold ${isUrgent ? 'text-rose-600' : 'text-slate-800'}`}>
                        {trip.slotsLeft} of {trip.totalSlots} slots left
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isUrgent ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${((trip.totalSlots - trip.slotsLeft) / trip.totalSlots) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Per Person</span>
                    <span className="text-lg font-extrabold text-slate-900 font-display">
                      {formatPrice(trip.price)}
                    </span>
                  </div>

                  <Link
                    to={`/tours/${trip.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold transition shadow-xs"
                  >
                    <span>Join Trip</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

