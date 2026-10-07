import React from 'react';
import { PlanningTop, PlanningCta } from '../../components/planning-pages/PlanningPageTemplate';
import { REAL_ESTATE_PAGE } from '../../data/investPages';

export default function RealEstatePage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={REAL_ESTATE_PAGE} />
      <PlanningCta config={REAL_ESTATE_PAGE} />
    </div>
  );
}
