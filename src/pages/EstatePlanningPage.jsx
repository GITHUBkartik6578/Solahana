import React from 'react';
import { PlanningTop, PlanningCta } from '../components/planning-pages/PlanningPageTemplate';
import { ESTATE_PAGE } from '../data/planningPages';

export default function EstatePlanningPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      {/* "#estate-solutions" links (home slide) land on the four pillars */}
      <PlanningTop config={ESTATE_PAGE} pillarsId="estate-solutions" />
      <PlanningCta config={ESTATE_PAGE} />
    </div>
  );
}
