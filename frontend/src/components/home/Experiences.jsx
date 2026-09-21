import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Landmark, Waves, Trees, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

const CATEGORIES = [
  {
    title: 'Himalayan Treks',
    desc: 'Alpine lakes, high-altitude passes & basecamps with certified mountaineers.',
    icon: Mountain,
    category: 'adventure',
    count: '24 Trips',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Heritage & Forts',
    desc: 'Royal palaces, gilded havelis & living Rajput & Mughal history.',
    icon: Landmark,
    category: 'heritage',
    count: '18 Trips',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Coastal & Backwaters',
    desc: 'Teakwood houseboats, coconut lagoons & slow tropical sunsets.',
    icon: Waves,
    category: 'relaxation',
    count: '15 Trips',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Wildlife & Safaris',
    desc: 'Tiger tracking, elephant corridors & birding in pristine national parks.',
    icon: Trees,
    category: 'nature',
    count: '12 Trips',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Spiritual Quests',
    desc: 'Sacred river ghats, ancient temple architecture & morning aartis.',
    icon: Sparkles,
    category: 'spiritual',
    count: '14 Trips',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Wellness & Ayurveda',
    desc: 'Holistic Ayurvedic healing, meditation retreats & organic valley living.',
    icon: HeartHandshake,
    category: 'wellness',
    count: '10 Trips',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80'
  }
];

export default function Experiences() {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="TRAVEL BY INTEREST"
          title="Travel your way"
          subtitle="Explore curated collections designed around passions — from adrenaline-charged mountain crossings to serene holistic retreats."
          actionText="All Travel Styles"
          actionLink="/tours"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                to={`/tours?category=${cat.category}`}
                className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                {/* Background image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                    {cat.count}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-orange-600/90 backdrop-blur-md flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold font-display group-hover:text-orange-300 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-orange-400 group-hover:translate-x-1 transition-transform">
                    <span>Explore journeys</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

