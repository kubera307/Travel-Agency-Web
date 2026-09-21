import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Luggage, 
  Map, 
  Building, 
  Users, 
  Car, 
  UserCheck 
} from 'lucide-react';

const POPULAR_DESTINATIONS = [
  {
    name: 'Mangalore',
    tagline: 'Coastal Charm',
    slug: 'mangalore',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Kerala',
    tagline: 'Backwaters & Beyond',
    slug: 'kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Rajasthan',
    tagline: 'Royal Heritage',
    slug: 'rajasthan',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Himachal',
    tagline: 'Mountains & Adventure',
    slug: 'himachal',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Goa',
    tagline: 'Sun, Sand & Serenity',
    slug: 'goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Karnataka',
    tagline: 'Nature & Culture',
    slug: 'karnataka',
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=600&q=80'
  }
];

const SERVICES = [
  {
    title: 'Tour Packages',
    icon: Luggage,
    link: '/tours'
  },
  {
    title: 'Custom Trips',
    icon: Map,
    link: '/custom-trip-planner'
  },
  {
    title: 'Hotel Booking',
    icon: Building,
    link: '/tours?category=heritage'
  },
  {
    title: 'Group Tours',
    icon: Users,
    link: '/tours'
  },
  {
    title: 'Transportation',
    icon: Car,
    link: '/about'
  },
  {
    title: 'Travel Assistance',
    icon: UserCheck,
    link: '/contact'
  }
];

export default function DestinationsAndServices() {
  return (
    <section className="py-10 sm:py-14 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: Popular Destinations (Cols 1-8) */}
          <div className="lg:col-span-8 text-left flex flex-col justify-between">
            <div>
              <div className="flex items-end justify-between mb-5">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 block mb-1">
                    Explore India
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-normal">
                    Popular Destinations
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-light">
                    From mountains to beaches, heritage to wildlife — find your next destination.
                  </p>
                </div>

                <Link
                  to="/destinations"
                  className="text-xs font-semibold text-slate-700 hover:text-[#B68D40] transition flex items-center gap-1 shrink-0 ml-4"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 6 Vertical Destination Cards in a row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <Link
                    key={dest.name}
                    to={`/destinations/${dest.slug}`}
                    className="group relative h-[210px] sm:h-[225px] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 block"
                  >
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                      <h3 className="text-white text-xs sm:text-sm font-semibold leading-tight group-hover:text-[#F3D7B5] transition">
                        {dest.name}
                      </h3>
                      <p className="text-white/70 text-[9px] font-light mt-0.5 truncate">
                        {dest.tagline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Our Services Panel (Cols 9-12) */}
          <div className="lg:col-span-4 relative text-left bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-xs flex flex-col justify-between overflow-hidden">
            {/* Soft decorative palm/botanical watermark on right corner */}
            <div className="absolute right-0 bottom-0 w-36 h-36 pointer-events-none opacity-5">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0C50 30 20 50 0 50C30 50 50 80 50 100C50 70 80 50 100 50C70 50 50 20 50 0Z" />
              </svg>
            </div>

            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 block mb-1">
                Travel Made Easy
              </span>
              <h2 className="font-serif text-xl sm:text-2xl text-slate-900 font-normal">
                Our Services
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-light leading-relaxed">
                Everything you need for a seamless travel experience.
              </p>

              {/* 2-Column Grid of 6 Services */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-2.5 pt-4">
                {SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  return (
                    <Link
                      key={srv.title}
                      to={srv.link}
                      className="group flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-stone-100 flex items-center justify-center text-[#B68D40] group-hover:bg-[#B68D40] group-hover:text-white transition-colors shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] text-slate-700 group-hover:text-slate-900 font-medium leading-tight">
                        {srv.title}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <Link
                to="/about"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
              >
                <span>View All Services</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
