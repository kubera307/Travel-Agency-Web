import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

const ARTICLES = [
  {
    id: 1,
    title: 'Best Time to Visit Kashmir Valley: A Month-by-Month Guide',
    excerpt:
      'From almond blossoms in April and alpine wildflower blooms in July to golden chinar leaves in October and Gulmarg powdery snow in January.',
    category: 'Field Guide',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    link: '/tours?search=kashmir'
  },
  {
    id: 2,
    title: 'Spiti Valley vs Ladakh: Which Himalayan Odyssey is Right for You?',
    excerpt:
      'Comparing altitudes, acclimatization routes, monastery culture, road conditions, and stargazing conditions across India\'s two high-altitude cold deserts.',
    category: 'Expedition Guide',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    link: '/tours?search=ladakh'
  },
  {
    id: 3,
    title: 'Top 7 Restored Heritage Havelis in Rajasthan for Royal Living',
    excerpt:
      'Discover intimate boutique palaces where 300-year-old fresco murals, courtyard thalis, and Rajput hospitality have been preserved.',
    category: 'Culture & Stays',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    link: '/tours?search=rajasthan'
  }
];

export default function TravelInspiration() {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="TRAVEL JOURNAL & INSPIRATION"
          title="Stories, guides & inspiration"
          subtitle="Curated field guides, seasonal advice, and cultural insights written by our expedition leaders."
          actionText="All Articles & Guides"
          actionLink="/tours"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <Link
              key={article.id}
              to={article.link}
              className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold shadow-xs">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display group-hover:text-orange-600 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                  <span>Read full guide</span>
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

