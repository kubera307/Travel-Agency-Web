import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const SIGNATURES = [
  {
    region: 'RAJASTHAN',
    title: 'Palaces, Stories & Desert Nights',
    duration: '8 Days · 7 Nights',
    price: '₹54,000',
    slug: 'rajasthan-royal-trail',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Private access to Mewar royal residences, Thar desert glamping and artisan encounters in Jodhpur.'
  },
  {
    region: 'KERALA',
    title: 'Backwaters, Spice & Stillness',
    duration: '7 Days · 6 Nights',
    price: '₹46,000',
    slug: 'kerala-slow-journey',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Hand-carved teakwood houseboats, organic cardamom estates in Munnar and private Ayurvedic rejuvenation.'
  },
  {
    region: 'HIMALAYAS',
    title: 'Into the Quiet Mountains',
    duration: '9 Days · 8 Nights',
    price: '₹62,000',
    slug: 'kashmir-great-escape',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
    tagline: 'Ancient pine forests of Pahalgam, sacred alpine tarns, and secluded cedar chalets overlooking Nanga Parbat.'
  },
  {
    region: 'KARNATAKA',
    title: 'Wild Landscapes & Living Heritage',
    duration: '6 Days · 5 Nights',
    price: '₹38,000',
    slug: 'karnataka-culture-wild',
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=1200&q=85',
    tagline: 'The boulder-strewn ruins of Vijayanagara in Hampi, coffee plantations of Coorg and Kabini river safaris.'
  }
];

export default function SignatureJourneys() {
  return (
    <section className="py-20 sm:py-28 bg-[#EFE4D2]/40 border-t border-[#EFE4D2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 text-left">
          <div>
            <span className="editorial-eyebrow">
              Curated Expeditions
            </span>
            <h2 className="editorial-title">
              Signature Journeys
            </h2>
          </div>
          <Link
            to="/tours"
            className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#1D1B18] hover:text-[#B99762] transition-colors inline-flex items-center gap-1.5"
          >
            <span>View All Journeys</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Large Editorial Magazine Tiles (2x2 Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {SIGNATURES.map((item) => (
            <Link
              key={item.region}
              to={`/tours/${item.slug}`}
              className="group relative block h-[440px] sm:h-[500px] overflow-hidden bg-[#1D1B18] text-left shadow-sm"
            >
              {/* Cinematic Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 ease-out"
              />

              {/* Minimal Dark Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1D1B18]/90 via-[#1D1B18]/40 to-transparent" />

              {/* Top Region Label */}
              <div className="absolute top-7 left-7 right-7 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.35em] text-[#EFE4D2] bg-[#1D1B18]/40 backdrop-blur-xs px-3 py-1 border border-white/10">
                  {item.region}
                </span>
                <span className="text-[11px] font-sans text-[#EFE4D2]/90 tracking-wider">
                  {item.duration}
                </span>
              </div>

              {/* Bottom Editorial Content with smooth subtle hover lift */}
              <div className="absolute bottom-7 left-7 right-7 text-white transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-snug">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#EFE4D2]/80 font-sans line-clamp-2 max-w-md leading-relaxed font-light">
                  {item.tagline}
                </p>

                <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#B99762] block">Starting from</span>
                    <span className="font-serif text-xl text-white">{item.price}</span>
                    <span className="text-xs text-[#EFE4D2]/70 font-light"> / person</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#B99762] group-hover:text-white transition-colors">
                    <span>Discover</span>
                    <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

