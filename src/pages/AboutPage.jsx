import React from 'react';
import AboutHeroBanner from '../components/about/AboutHeroBanner';
import AboutMissionVisionCards from '../components/about/AboutMissionVisionCards';
import AboutFounderNote from '../components/about/AboutFounderNote';
import AboutStandard from '../components/about/AboutStandard';
import AboutCredentials from '../components/about/AboutCredentials';
import AboutFinalCta from '../components/about/AboutFinalCta';

export default function AboutPage() {
  return (
    <div className="relative z-10 bg-white">
      <AboutHeroBanner />
      <AboutMissionVisionCards />
      <AboutFounderNote />
      <AboutStandard />
      <AboutCredentials />
      <AboutFinalCta />
    </div>
  );
}
