import React from 'react';
import { PlanningTop, PlanningCta } from '../../components/planning-pages/PlanningPageTemplate';
import { BONDS_PAGE } from '../../data/investPages';

export default function BondsPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={BONDS_PAGE} />
      <PlanningCta config={BONDS_PAGE} />
    </div>
  );
}
