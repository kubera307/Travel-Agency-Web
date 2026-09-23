import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const DESTINATIONS = [
  {
    name: 'Kashmir',
    slug: 'kashmir',
    subtitle: 'Alpine Stillness & Chinar Valleys',
    size: 'large',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=85',
    tag: 'Northern Sanctuaries'
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    subtitle: 'Spice Hills & Bronze Backwaters',
    size: 'medium',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=85',
    tag: 'Coastal Calm'
  },
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    subtitle: 'Living Forts & Gilded Desert Havens',
    size: 'medium',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=85',
    tag: 'Royal Heritage'
  },
  {
    name: 'Goa',
    slug: 'goa',
    subtitle: 'Portuguese Mansions & Quiet Coves',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=85',
    tag: 'Southern Coast'
  },
  {
    name: 'Himachal',
    slug: 'himachal',
    subtitle: 'Cedar Forests & Mountain Passes',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=85',
    tag: 'Himalayan Ridge'
  },
  {
    name: 'Karnataka',
    slug: 'karnataka',
    subtitle: 'Hampi Ruins & Coffee Estates',
    size: 'small',
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=85',
    tag: 'Wilderness & Stone'
  }
];

export default function DestinationShowcase() {
  const kashmir = DESTINATIONS[0];
  const kerala = DESTINATIONS[1];
  const rajasthan = DESTINATIONS[2];
  const goa = DESTINATIONS[3];
  const himachal = DESTINATIONS[4];
  const karnataka = DESTINATIONS[5];

  return (
    <section className="py-20 sm:py-28 bg-[#F7F1E7] border-t border-[#EFE4D2]/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 text-left">
          <div>
            <span className="editorial-eyebrow">
              Geographies of Wonder
            </span>
            <h2 className="editorial-title">
              Destinations of Stillness
            </h2>
          </div>
          <Link
            to="/destinations"
            className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#1D1B18] hover:text-[#B99762] transition-colors inline-flex items-center gap-1.5"
          >
            <span>All 28 Regions</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric Masonry Layout:
            - Large: Kashmir (takes left 7 columns in top row)
            - Medium: Kerala (takes right 5 columns in top row)
            - Medium: Rajasthan (takes left 5 columns in bottom row)
            - Small: Goa, Himachal, Karnataka (fill remaining columns)
        */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LARGE: Kashmir */}
          <Link
            to={`/destinations/${kashmir.slug}`}
            className="group relative block md:col-span-7 h-[420px] lg:h-[500px] overflow-hidden bg-[#1D1B18] text-left shadow-sm"
          >
            <img
              src={kashmir.image}
              alt={kashmir.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B18]/85 via-transparent to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 text-white">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B99762] font-semibold block mb-1">
                {kashmir.tag}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                {kashmir.name}
              </h3>
              <p className="font-sans text-xs text-[#EFE4D2]/80 font-light mt-1">
                {kashmir.subtitle}
              </p>
            </div>
          </Link>

          {/* MEDIUM: Kerala */}
          <Link
            to={`/destinations/${kerala.slug}`}
            className="group relative block md:col-span-5 h-[420px] lg:h-[500px] overflow-hidden bg-[#1D1B18] text-left shadow-sm"
          >
            <img
              src={kerala.image}
              alt={kerala.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B18]/85 via-transparent to-transparent" />
            <div className="absolute bottom-7 left-7 right-7 text-white">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B99762] font-semibold block mb-1">
                {kerala.tag}
              </span>
              <h3 className="font-serif text-3xl text-white font-normal">
                {kerala.name}
              </h3>
              <p className="font-sans text-xs text-[#EFE4D2]/80 font-light mt-1">
                {kerala.subtitle}
              </p>
            </div>
          </Link>

          {/* MEDIUM: Rajasthan */}
          <Link
            to={`/destinations/${rajasthan.slug}`}
            className="group relative block md:col-span-5 h-[340px] lg:h-[380px] overflow-hidden bg-[#1D1B18] text-left shadow-sm"
          >
            <img
              src={rajasthan.image}
              alt={rajasthan.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B18]/85 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B99762] font-semibold block mb-1">
                {rajasthan.tag}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                {rajasthan.name}
              </h3>
              <p className="font-sans text-xs text-[#EFE4D2]/80 font-light mt-1">
                {rajasthan.subtitle}
              </p>
            </div>
          </Link>

          {/* 3 SMALL TILES (Col-span 7 in total: Goa, Himachal, Karnataka) */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {[goa, himachal, karnataka].map((item) => (
              <Link
                key={item.name}
                to={`/destinations/${item.slug}`}
                className="group relative block h-[340px] lg:h-[380px] overflow-hidden bg-[#1D1B18] text-left shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B18]/85 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-5 right-5 text-white">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#B99762] font-semibold block mb-0.5">
                    {item.tag}
                  </span>
                  <h4 className="font-serif text-xl text-white font-normal">
                    {item.name}
                  </h4>
                  <p className="font-sans text-[11px] text-[#EFE4D2]/80 font-light mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

