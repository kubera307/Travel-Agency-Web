import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

const REVIEWS = [
  {
    id: 1,
    name: 'Aarav & Priya Sharma',
    location: 'Bengaluru, India',
    tourName: 'Kashmir Great Lakes Expedition',
    traveledDate: 'August 2025',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    quote:
      'The trek of a lifetime! Our trek leader Tariq and the support crew were exceptional. The food cooked at 12,000 feet was hot and delicious every single evening. The safety standards were truly world-class.'
  },
  {
    id: 2,
    name: 'David & Claire Miller',
    location: 'London, UK',
    tourName: 'Royal Rajasthan Heritage & Haveli Circuit',
    traveledDate: 'November 2025',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    quote:
      'Traveling through India for the first time could have been overwhelming, but NammaYathra made it seamless. Our chauffeur was punctual, courtly, and took us to secret chai spots no tourist book mentions.'
  },
  {
    id: 3,
    name: 'Sneha Patel',
    location: 'Mumbai, India',
    tourName: 'Spiti Valley Autumn Stargazing Roadtrip',
    traveledDate: 'September 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    quote:
      'I was traveling solo and was initially nervous. But the small group of 10 was so welcoming, and our trip captain made sure everyone was comfortable and acclimatized well at Kaza and Chandra Taal. 10/10 experience!'
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="TRAVELER EXPERIENCES"
          title="Stories from the road"
          subtitle="Real reviews from mindful travelers who crossed high Himalayan passes and tranquil backwaters with us."
          align="left"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating stars & Quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-orange-200" />
                </div>

                {/* Review Quote */}
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              {/* Traveler Info */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3.5">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {rev.name}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" title="Verified Traveler" />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">
                    {rev.location} &bull; {rev.tourName}
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

