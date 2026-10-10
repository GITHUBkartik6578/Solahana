import React from 'react';
import { PlanningTop, PlanningCta } from '../../components/planning-pages/PlanningPageTemplate';
import { PhotoHero, IconPhilosophy, PhotoPillars, PhotoStewardship } from '../../components/invest/DesignSections';
import { EQUITY_PAGE } from '../../data/investPages';

// Hero, philosophy, the four pillars and "Beyond Standard Planning" use this page's own designs
const PAGE = {
  ...EQUITY_PAGE,
  pillarBadge: true,
  HeroSection: PhotoHero,
  PhilosophySection: IconPhilosophy,
  PillarsSection: PhotoPillars,
  StewardshipSection: PhotoStewardship,
};

export default function DomesticEquityPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={PAGE} />
      <PlanningCta config={PAGE} />
    </div>
  );
}
