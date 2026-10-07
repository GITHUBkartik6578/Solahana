import React from 'react';
import { PlanningTop, PlanningCta } from '../components/planning-pages/PlanningPageTemplate';
import TaxCalculator from '../components/tax/TaxCalculator';
import { TAX_PAGE } from '../data/planningPages';

export default function TaxPlanningPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={TAX_PAGE} />
      {/* the existing tax calculator stays on the page */}
      <TaxCalculator />
      <PlanningCta config={TAX_PAGE} />
    </div>
  );
}
