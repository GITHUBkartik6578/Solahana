import React from 'react';
import AboutHero from '../components/about/AboutHero';
import AboutMissionVision from '../components/about/AboutMissionVision';
import FounderNote from '../components/about/FounderNote';
import SolahanaStandard from '../components/about/SolahanaStandard';
import ProfessionalPedigree from '../components/about/ProfessionalPedigree';
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

      {/* SECTION 3: MISSION & VISION */}
      <AboutMissionVision />

      {/* FOUNDER'S NOTE & PHILOSOPHY (replaces Our Guiding Values) */}
      <FounderNote />

      {/* THE SOLAHANA STANDARD (replaces "How we think / Why SOLAHANA Exists") */}
      <SolahanaStandard />

      {/* PROFESSIONAL PEDIGREE & EXPERIENCE (replaces "Choose how to connect") */}
      <ProfessionalPedigree />

      {/* SECTION 7: OFFICE LOCATION & WORKING HOURS (MERGED CONTACT) */}
      <AboutOfficeLocation />
    </div>
  );
}
