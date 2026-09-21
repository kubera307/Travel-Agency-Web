import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const HIGHLIGHTS = [
  {
    id: 'coastal-karnataka',
    badge: 'NEW',
    title: 'Coastal Karnataka Escape',
    subtitle: 'Mangalore • Udupi • Malpe',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    link: '/tours/coastal-karnataka-mangalore-udupi-malpe'
  },
  {
    id: 'kashmir-winter',
    badge: 'TRENDING',
    title: 'Kashmir Winter Special',
    subtitle: 'Snow • Lakes • Local Life',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    link: '/tours/kashmir-great-escape'
  },
  {
    id: 'hampi-heritage',
    badge: 'UPCOMING',
    title: 'Hampi Heritage Trail',
    subtitle: 'History • Culture • Photography',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    link: '/tours/karnataka-culture-wild'
  },
  {
    id: 'monsoon-coorg',
    badge: 'SPECIAL',
    title: 'Monsoon in Coorg',
    subtitle: 'Waterfalls • Coffee • Nature',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    link: '/tours/kudremukh-shola-rainforest-expedition'
  }
];

export default function RecentHighlights() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Nav Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-7 text-left">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 block mb-1">
              Recent Highlights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-normal">
              What's New at Trekora
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-light">
              Fresh experiences, new destinations and exclusive journeys handpicked for you.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <Link
              to="/tours"
              className="text-xs font-semibold text-slate-700 hover:text-[#B68D40] transition flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="hidden sm:flex items-center gap-1.5 ml-2">
              <button
                type="button"
                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition"
                aria-label="Previous"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:border-slate-400 transition"
                aria-label="Next"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {HIGHLIGHTS.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group relative h-[210px] sm:h-[230px] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 block text-left"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Badge top left (clean white rounded pill) */}
              <div className="absolute top-3.5 left-3.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-white/95 text-slate-900 shadow-xs">
                  {item.badge}
                </span>
              </div>

              {/* Content bottom */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
                <div>
                  <h3 className="text-white text-sm sm:text-[15px] font-semibold leading-snug group-hover:text-[#F3D7B5] transition">
                    {item.title}
                  </h3>
                  <p className="text-white/75 text-[11px] font-light mt-0.5">
                    {item.subtitle}
                  </p>
                </div>

                {/* White Circle Arrow Button */}
                <div className="w-7 h-7 rounded-full bg-white text-slate-900 group-hover:bg-[#B68D40] group-hover:text-white flex items-center justify-center transition-colors shadow-sm shrink-0 ml-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
