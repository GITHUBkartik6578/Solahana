import React from 'react';
import { PlanningTop, PlanningCta } from '../components/planning-pages/PlanningPageTemplate';
import RiskCalculator from '../components/risk/RiskCalculator';
import { RISK_PAGE } from '../data/planningPages';

export default function RiskManagementPage() {
  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      <PlanningTop config={RISK_PAGE} />
      {/* the existing risk calculator stays on the page */}
      <RiskCalculator />
      <PlanningCta config={RISK_PAGE} />
    </div>
  );
}
