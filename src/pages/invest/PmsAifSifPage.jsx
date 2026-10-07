import React from 'react';
import { PlanningTop, PlanningCta } from '../../components/planning-pages/PlanningPageTemplate';
import { PMS_AIF_PAGE } from '../../data/investPages';

export default function PmsAifSifPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={PMS_AIF_PAGE} />
      <PlanningCta config={PMS_AIF_PAGE} />
    </div>
  );
}
