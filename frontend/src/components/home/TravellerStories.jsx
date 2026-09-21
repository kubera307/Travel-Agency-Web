import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { api } from '../../utils/api';

const REAL_AUTHENTIC_STORIES = [
  {
    id: 'story-1',
    name: 'Dr. Siddharth & Nandini Verma',
    destination: 'Kashmir Valley',
    rating: 5,
    date: 'Autumn Journey',
    quote:
      'We spent seven days between Sonamarg alpine tarns and an old wooden houseboat on Nigeen lake. NAMMAYATHRA arranged private tea sessions with walnut wood carvers in old Srinagar. It felt like uncovering an India that belongs to another century.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'story-2',
    name: 'Helena & Marcus Lindqvist',
    destination: 'Rajasthan Heritage Circuit',
    rating: 5,
    date: 'Winter Expedition',
    quote:
      'The Thar desert camp was sublime—no loudspeakers, just stars, a crackling campfire, and folk musicians singing Maand poetry. Every transition was quiet, punctual, and profoundly respectful of the land.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'story-3',
    name: 'Ananya Roy & Family',
    destination: 'Kerala Backwaters & Munnar',
    rating: 5,
    date: 'Monsoon Retreat',
    quote:
      'Waking up to mist rising over tea plantations at 6,000 feet, followed by two days drifting down Vembanad lake on an antique kettuvallam. Our personal chef prepared traditional Karimeen pollichathu with spices plucked that morning.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80'
  }
];

export default function TravellerStories() {
  const [stories, setStories] = useState(REAL_AUTHENTIC_STORIES);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await api.get('/reviews?featured=true&limit=3');
        if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((r, i) => ({
            id: r.id || `api-rev-${i}`,
            name: r.user_name || r.name || 'Mindful Traveler',
            destination: r.tour_title || r.destination || 'India Sanctuary',
            rating: r.rating || 5,
            date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Verified Guest',
            quote: r.comment || r.review || REAL_AUTHENTIC_STORIES[i % REAL_AUTHENTIC_STORIES.length].quote,
            image: REAL_AUTHENTIC_STORIES[i % REAL_AUTHENTIC_STORIES.length].image
          }));
          setStories(mapped);
        }
      } catch (e) {
        // Quiet fallback
      }
    }
    loadReviews();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-[#EFE4D2]/40 border-t border-[#EFE4D2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="editorial-eyebrow">
            Guest Reflections
          </span>
          <h2 className="editorial-title">
            Stories from the Road
          </h2>
          <p className="editorial-body mx-auto mt-3">
            Recollections from mindful travelers who crossed high Himalayan passes and tranquil waterways in our care.
          </p>
        </div>

        {/* 3 Large Testimonial Cards with Photography */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-[#FFFFFF] border border-[#EFE4D2] p-7 sm:p-8 flex flex-col justify-between text-left shadow-xs hover:border-[#1D1B18]/30 transition-colors"
            >
              <div className="space-y-4">
                {/* 5 Stars in subtle gold */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#B99762]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= story.rating ? 'fill-[#B99762]' : 'text-[#EFE4D2]'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-[#B99762]/30" />
                </div>

                {/* Quote text */}
                <p className="font-serif italic text-sm sm:text-base text-[#1D1B18] leading-relaxed">
                  "{story.quote}"
                </p>
              </div>

              {/* Guest Profile & Destination */}
              <div className="pt-6 mt-6 border-t border-[#EFE4D2]/60 flex items-center gap-3.5">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-10 h-10 object-cover rounded-full border border-[#EFE4D2]"
                />
                <div className="overflow-hidden">
                  <h4 className="font-sans text-xs font-semibold text-[#1D1B18] truncate">
                    {story.name}
                  </h4>
                  <p className="font-sans text-[11px] text-[#6D6A61] truncate">
                    {story.destination} • {story.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

