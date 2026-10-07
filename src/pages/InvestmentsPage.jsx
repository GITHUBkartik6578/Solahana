import React from 'react';
import { PlanningTop, PlanningCta } from '../components/planning-pages/PlanningPageTemplate';
import InvestmentCalculator from '../components/investments/InvestmentCalculator';
import { INVESTMENT_PAGE } from '../data/planningPages';

export default function InvestmentsPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={INVESTMENT_PAGE} />
      {/* the existing investment calculator stays on the page */}
      <InvestmentCalculator />
      <PlanningCta config={INVESTMENT_PAGE} />
    </div>
  );
}
