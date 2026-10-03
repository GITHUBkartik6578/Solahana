import React from 'react';
import PlanningHero from '../components/planning/PlanningHero';
import PlanningCoverage from '../components/planning/PlanningCoverage';
import IsThisYou from '../components/planning/IsThisYou';
import { TwelveMonths, WhatYouGet, HonestFit } from '../components/planning/PlanningStory';
import PlanningJourney from '../components/planning/PlanningJourney';
import FirstThirtyDays from '../components/planning/FirstThirtyDays';
import PlanningFAQ from '../components/planning/PlanningFAQ';
import {
  WhatIsFinancialPlanning,
  KeyElements,
  WhyPlanningImportant,
  FactorsAffectingPlanning,
  PlanningProcessGuide,
  InvestmentInstruments,
  PortfolioRestructuring,
  PlanningBenefitsGrid,
  WhoIsFinancialPlanner,
  WhySolahanaPlanning,
} from '../components/planning/PlanningGuide';

export default function FinancialPlanningPage({ onOpenSearch }) {
  return (
    <div className="relative z-10">
      {/* Hero — start from where the reader is */}
      <PlanningHero onBookConsultation={onOpenSearch} />

      {/* The basics: what it is, what it covers, what it's built on */}
      <WhatIsFinancialPlanning />
      <PlanningCoverage />
      <KeyElements />

      {/* Why it matters, and what shapes your plan */}
      <WhyPlanningImportant />
      <IsThisYou />
      <FactorsAffectingPlanning />

      {/* How it works: process, roadmap, tools, restructuring */}
      <PlanningProcessGuide />
      <PlanningJourney />
      <InvestmentInstruments />
      <PortfolioRestructuring />

      {/* What you gain */}
      <PlanningBenefitsGrid />
      <TwelveMonths />
      <WhatYouGet />

      {/* Planning with us */}
      <WhoIsFinancialPlanner />
      <WhySolahanaPlanning />
      <FirstThirtyDays />
      <HonestFit />

      {/* Questions people actually ask */}
      <PlanningFAQ />
    </div>
  );
}
