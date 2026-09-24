import React from 'react';
import { Compass, Users, Home, Heart } from 'lucide-react';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Curated Experiences',
    desc: 'Never off-the-shelf tours. Every itinerary is individually shaped by our destination directors around your interests and cadence.',
    icon: Compass
  },
  {
    number: '02',
    title: 'Local Connections',
    desc: 'Direct partnerships with generational artisans, regional historians, and village elders who grant access to authentic cultural life.',
    icon: Users
  },
  {
    number: '03',
    title: 'Handpicked Stays',
    desc: 'From royal Mewar palaces to eco-sanctuaries in the Western Ghats, we choose properties with profound character and architectural grace.',
    icon: Home
  },
  {
    number: '04',
    title: 'Meaningful Journeys',
    desc: 'Conscious travel that leaves no environmental footprint, honors native customs, and directly enriches local grassroots communities.',
    icon: Heart
  }
];

export default function WhyTravelWithUs() {
  return (
    <section className="py-20 sm:py-28 bg-[#F7F1E7] border-t border-[#EFE4D2]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="editorial-eyebrow">
            The NammaYatra Distinction
          </span>
          <h2 className="editorial-title">
            Travel, thoughtfully.
          </h2>
          <p className="editorial-body mx-auto mt-3">
            In an era of mass travel, we design unhurried journeys of stillness, depth, and genuine connection.
          </p>
        </div>

        {/* 4 Refined Principles in Horizontal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {PRINCIPLES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="text-left space-y-4 p-6 bg-[#FFFFFF] border border-[#EFE4D2] shadow-xs hover:border-[#1D1B18]/30 transition-colors"
              >
                {/* Elegant line icon and serial number */}
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-[#B99762]">
                    {item.number}
                  </span>
                  <Icon className="w-5 h-5 text-[#6D725C] stroke-[1.5]" />
                </div>

                <div className="pt-2 border-t border-[#EFE4D2]/60">
                  <h3 className="font-serif text-xl text-[#1D1B18] font-normal leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 font-sans text-xs text-[#6D6A61] leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

