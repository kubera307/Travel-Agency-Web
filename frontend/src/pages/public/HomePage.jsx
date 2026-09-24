import React, { useRef } from 'react';
import HeroSection from '../../components/home/HeroSection';
import FloatingTripSearch from '../../components/home/FloatingTripSearch';
import FeaturedToursMarquee from '../../components/home/FeaturedToursMarquee';
import RecentHighlights from '../../components/home/RecentHighlights';
import DestinationsAndServices from '../../components/home/DestinationsAndServices';
import ExperienceSection from '../../components/home/ExperienceSection';
import FeaturedToursAndCustom from '../../components/home/FeaturedToursAndCustom';
import TravellerStoriesAndHelp from '../../components/home/TravellerStoriesAndHelp';
import FinalCTA from '../../components/home/FinalCTA';

export default function HomePage() {
  const toursRef = useRef(null);

  const handleExploreClick = () => {
    if (toursRef.current) {
      toursRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-slate-900 overflow-hidden font-sans">
      {/* 1. Hero Section (Occupies majority of first viewport with coastal lighthouse imagery) */}
      <HeroSection onExploreClick={handleExploreClick} />

      {/* 2. Floating Trip Search (Overlaps the bottom of the hero) */}
      <FloatingTripSearch />

      {/* 2b. Featured Tours Marquee (Infinite scrolling expedition showcase) */}
      <FeaturedToursMarquee />

      {/* 3. Recent Highlights ("What's New at NammaYatra" - 4 visual cards) */}
      <RecentHighlights />

      {/* 4. Popular Destinations (6 vertical cards) & Our Services (6 services) */}
      <DestinationsAndServices />

      {/* 4b. Immersive Travel Experiences (#experiences anchor) */}
      <ExperienceSection />

      {/* 5. Featured Tours (4 cards) & Custom Travel Experiences (dark card) */}
      <div ref={toursRef}>
        <FeaturedToursAndCustom />
      </div>

      {/* 6. Traveller Stories (3 testimonials) & Need Help Planning? (contact panel) */}
      <TravellerStoriesAndHelp />

      {/* 7. Final CTA ("India is Waiting. Are You Ready?" & "Collect Moments Not Things") */}
      <FinalCTA />
    </div>
  );
}
