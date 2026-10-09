import React from 'react';
import { PlanningTop, PlanningCta } from '../../components/planning-pages/PlanningPageTemplate';
import { PhotoPillars, PhotoStewardship } from '../../components/invest/DesignSections';
import { PMS_AIF_PAGE } from '../../data/investPages';

// "The Spectrum of Strategic & Alternative Funds" and "Beyond Standard Planning" use this page's own designs
const PAGE = { ...PMS_AIF_PAGE, PillarsSection: PhotoPillars, StewardshipSection: PhotoStewardship };

export default function PmsAifSifPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={PAGE} />
      <PlanningCta config={PAGE} />
    </div>
  );
}
