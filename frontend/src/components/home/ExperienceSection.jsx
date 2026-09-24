import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const EXPERIENCES = [
  {
    title: 'Private Heritage Stays',
    desc: 'Waking up in 17th-century havelis, restored palaces, and aristocratic tea bungalows.',
    category: 'heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90'
  },
  {
    title: 'Village Encounters',
    desc: 'Unmediated interactions with weavers, potters, and organic farmers in pastoral India.',
    category: 'culture',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90'
  },
  {
    title: 'Wildlife Safaris',
    desc: 'Tracking Royal Bengal tigers and Asiatic elephants alongside naturalists.',
    category: 'wildlife',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=2400&q=90'
  },
  {
    title: 'Culinary Journeys',
    desc: 'Mastering generational Awadhi, Malabar, and Kashmiri wazwan ancestral recipes.',
    category: 'culinary',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=2400&q=90'
  },
  {
    title: 'Wellness Retreats',
    desc: 'Classical Ayurvedic therapies, silent pranayama, and Himalayan herb sanctuaries.',
    category: 'wellness',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=90'
  },
  {
    title: 'Spiritual Journeys',
    desc: 'Dawn boat chants at Assi Ghat, ancient monastery pujas, and sacred temple trails.',
    category: 'spiritual',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90'
  },
  {
    title: 'Himalayan Escapes',
    desc: 'Silent cedar ridges, high-altitude alpine lakes, and stargazing in Spiti Valley.',
    category: 'adventure',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90'
  },
  {
    title: 'Backwater Retreats',
    desc: 'Teakwood solar houseboats drifting through silent lagoons and coconut estuaries.',
    category: 'relaxation',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90'
  }
];

export default function ExperienceSection() {
  return (
    <section id="experiences" className="py-20 sm:py-28 bg-[#EFE4D2]/30 border-t border-[#EFE4D2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 text-left">
          <div>
            <span className="editorial-eyebrow">
              Immersive Traditions
            </span>
            <h2 className="editorial-title">
              Travel Beyond Sightseeing
            </h2>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-1.5">
            <p className="font-sans text-xs text-[#6D6A61] max-w-xs font-light">
              Every itinerary is woven around personal passions rather than generic tourist trails.
            </p>
            <Link
              to="/experiences"
              className="text-xs uppercase tracking-widest font-semibold text-[#B99762] hover:text-[#1D1B18] transition inline-flex items-center gap-1 mt-1"
            >
              <span>Explore All Experiences Anthology</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 8 Curated Experience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIENCES.map((exp) => (
            <Link
              key={exp.title}
              to={`/tours?category=${exp.category}`}
              className="group block bg-[#FFFFFF] border border-[#EFE4D2] overflow-hidden text-left hover:border-[#1D1B18]/30 transition-all duration-300 shadow-xs"
            >
              {/* Image Frame */}
              <div className="h-52 w-full overflow-hidden bg-[#EFE4D2]">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              {/* Text info */}
              <div className="p-5 flex flex-col justify-between min-h-[140px]">
                <div>
                  <h3 className="font-serif text-lg text-[#1D1B18] font-medium group-hover:text-[#B99762] transition-colors leading-snug">
                    {exp.title}
                  </h3>
                  <p className="mt-1.5 font-sans text-xs text-[#6D6A61] leading-relaxed line-clamp-2 font-light">
                    {exp.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#EFE4D2]/60 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#B99762]">
                  <span>Explore Style</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

