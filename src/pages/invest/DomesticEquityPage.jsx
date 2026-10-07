import React from 'react';
import { PlanningTop, PlanningCta } from '../../components/planning-pages/PlanningPageTemplate';
import { EQUITY_PAGE } from '../../data/investPages';

export default function DomesticEquityPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={EQUITY_PAGE} />
      <PlanningCta config={EQUITY_PAGE} />
    </div>
  );
}
