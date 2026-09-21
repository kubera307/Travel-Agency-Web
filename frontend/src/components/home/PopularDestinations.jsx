import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

const DESTINATIONS = [
  {
    name: 'Kashmir Valley',
    state: 'Jammu & Kashmir',
    slug: 'kashmir',
    toursCount: 14,
    season: 'Apr - Oct',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1000&q=80',
    featured: true,
    tagline: 'Pristine alpine lakes, saffron fields & tranquil Dal Lake shikaras'
  },
  {
    name: 'Leh & Ladakh',
    state: 'Ladakh',
    slug: 'ladakh',
    toursCount: 12,
    season: 'May - Sep',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    tagline: 'High-altitude cold deserts & Buddhist monasteries'
  },
  {
    name: 'Rajasthan Palaces',
    state: 'Rajasthan',
    slug: 'rajasthan',
    toursCount: 18,
    season: 'Oct - Mar',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    tagline: 'Gilded forts, camel dunes & royal heritage havelis'
  },
  {
    name: 'Kerala Backwaters',
    state: 'Kerala',
    slug: 'kerala',
    toursCount: 15,
    season: 'Sep - Mar',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    tagline: 'Slow houseboats, spice plantations & Ayurvedic retreats'
  },
  {
    name: 'Himachal Trails',
    state: 'Himachal Pradesh',
    slug: 'himachal',
    toursCount: 16,
    season: 'All Year',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    tagline: 'Cedar forests, Parvati river trails & snow peaks'
  }
];

export default function PopularDestinations() {
  const featured = DESTINATIONS[0];
  const others = DESTINATIONS.slice(1);

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FEATURED REGIONS"
          title="Where will you go next?"
          subtitle="Explore India's most extraordinary landscapes — from snow-crowned Himalayan valleys to warm Arabian sea lagoons."
          actionText="All Destinations"
          actionLink="/destinations"
        />

        {/* Editorial Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Featured Card (Left / 5 cols) */}
          <div className="lg:col-span-5">
            <Link
              to={`/destinations/${featured.slug}`}
              className="group relative block h-[420px] lg:h-full min-h-[420px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={featured.image}
                alt={featured.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Badges top */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold tracking-wide shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Editor's Choice
                </span>
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                  {featured.season}
                </span>
              </div>

              {/* Info bottom */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{featured.state}</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-extrabold font-display leading-tight">
                  {featured.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {featured.tagline}
                </p>
                <div className="pt-3 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white">
                  <span>{featured.toursCount} Curated Journeys</span>
                  <span className="inline-flex items-center gap-1 text-orange-400 group-hover:translate-x-1 transition-transform">
                    Explore Region &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* 4 Cards Grid (Right / 7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {others.map((dest) => (
              <Link
                key={dest.name}
                to={`/destinations/${dest.slug}`}
                className="group relative block h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />

                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                    {dest.season}
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider block">
                    {dest.state}
                  </span>
                  <h4 className="text-lg font-bold font-display group-hover:text-orange-300 transition-colors">
                    {dest.name}
                  </h4>
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-300">
                    <span>{dest.toursCount} Journeys</span>
                    <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

