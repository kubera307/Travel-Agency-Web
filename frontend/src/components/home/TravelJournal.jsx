import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';

const ARTICLES = [
  {
    title: '7 Quiet Places in Kerala Beyond the Usual Backwaters',
    category: 'Coastal Sanctuary',
    readTime: '6 min read',
    excerpt:
      'From the silent mangrove estuaries of northern Kannur to misty secret estates in Wayanad where wild elephants cross at twilight.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    slug: 'quiet-places-in-kerala'
  },
  {
    title: 'The Art of Slow Travel in Royal Rajasthan',
    category: 'Cultural Essays',
    readTime: '8 min read',
    excerpt:
      'Why trading tourist highway coaches for private havelis in Shekhawati and quiet desert stepwells changes the entire soul of your trip.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    slug: 'art-of-slow-travel-rajasthan'
  },
  {
    title: 'A Weekend in Coorg: Coffee Blends & Ancient Kodava Rituals',
    category: 'Estate Living',
    readTime: '5 min read',
    excerpt:
      'Shadow-grown Arabica, sacred groves preserved for five centuries, and home-cooked pandi curry prepared over clay hearths.',
    image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=800&q=80',
    slug: 'weekend-in-coorg'
  },
  {
    title: 'Finding Winter in Kashmir: Chinar Leaves & Alpine Snow',
    category: 'Mountain Living',
    readTime: '7 min read',
    excerpt:
      'When frost covers the Dal Lake water lilies and woodstoves smoke fragrant cedar resin across traditional walnut cedar houseboats.',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    slug: 'winter-in-kashmir'
  }
];

export default function TravelJournal() {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F1E7] border-t border-[#EFE4D2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 text-left">
          <div>
            <span className="editorial-eyebrow">
              Field Notes & Dispatches
            </span>
            <h2 className="editorial-title">
              The Travel Journal
            </h2>
          </div>
          <Link
            to="/tours"
            className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#1D1B18] hover:text-[#B99762] transition-colors inline-flex items-center gap-1.5"
          >
            <span>All Dispatches</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Magazine Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.title}
              className="group flex flex-col justify-between text-left"
            >
              <div>
                {/* Large Editorial Image */}
                <div className="h-60 w-full overflow-hidden bg-[#EFE4D2] mb-5 shadow-xs">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-[0.2em] text-[#B99762] mb-2">
                  <span>{article.category}</span>
                  <span className="text-[#6D6A61] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>

                {/* Article Headline */}
                <h3 className="font-serif text-xl sm:text-2xl text-[#1D1B18] font-normal group-hover:text-[#B99762] transition-colors leading-snug">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="mt-2 font-sans text-xs text-[#6D6A61] leading-relaxed line-clamp-3 font-light">
                  {article.excerpt}
                </p>
              </div>

              {/* Read link */}
              <div className="mt-5 pt-3 border-t border-[#EFE4D2] flex items-center justify-between text-[11px] uppercase tracking-wider text-[#1D1B18] group-hover:text-[#B99762] transition-colors">
                <span>Read Story</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

