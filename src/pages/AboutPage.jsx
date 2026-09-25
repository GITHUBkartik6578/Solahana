import React from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutStory from '../components/about/AboutStory';
import AboutMissionVision from '../components/about/AboutMissionVision';
import AboutValues from '../components/about/AboutValues';
import WhySolahanaExists from '../components/about/WhySolahanaExists';
import AboutConnectOptions from '../components/about/AboutConnectOptions';
import AboutOfficeLocation from '../components/about/AboutOfficeLocation';

export default function AboutPage({ onOpenSearch }) {

  const handleExplorePhilosophy = () => {
    const el = document.getElementById('our-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      {/* SECTION 1: HERO BANNER */}
      <AboutHero 
        onExplorePhilosophy={handleExplorePhilosophy}
        onOpenSearch={onOpenSearch}
      />

      {/* SECTION 2: OUR STORY */}
      <AboutStory />

      {/* SECTION 3: MISSION & VISION */}
      <AboutMissionVision />

      {/* SECTION 4: OUR VALUES */}
      <AboutValues />

      {/* SECTION 5: WHY SOLAHANA EXISTS */}
      <WhySolahanaExists />

      {/* SECTION 6: CHOOSE HOW TO CONNECT (MERGED CONTACT) */}
      <AboutConnectOptions />

      {/* SECTION 7: OFFICE LOCATION & WORKING HOURS (MERGED CONTACT) */}
      <AboutOfficeLocation />
    </div>
  );
}
