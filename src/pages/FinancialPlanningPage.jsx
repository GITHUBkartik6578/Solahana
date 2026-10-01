import React from 'react';
import PlanningHero from '../components/planning/PlanningHero';
import HealthCheck from '../components/planning/HealthCheck';
import IsThisYou from '../components/planning/IsThisYou';
import { TwelveMonths, WhatYouGet, HonestFit } from '../components/planning/PlanningStory';
import PlanningJourney from '../components/planning/PlanningJourney';
import FirstThirtyDays from '../components/planning/FirstThirtyDays';
import PlanningFAQ from '../components/planning/PlanningFAQ';

export default function FinancialPlanningPage({ onOpenSearch }) {
  return (
    <div className="relative z-10">
      {/* 1. Hero — start from where the reader is */}
      <PlanningHero onBookConsultation={onOpenSearch} />

      {/* 2. Free self-check — gives value before asking for anything */}
      <HealthCheck />

      {/* 3. The sentence that sounds like you, and our answer to it */}
      <IsThisYou />

      {/* 4. What actually changes in a year */}
      <TwelveMonths />

      {/* 5. Your plan, stage by stage */}
      <PlanningJourney />

      {/* 6. What you walk away with */}
      <WhatYouGet />

      {/* 7. What the first two weeks look like */}
      <FirstThirtyDays />

      {/* 8. Who we're right for, and who we're not */}
      <HonestFit />

      {/* 9. Questions people actually ask */}
      <PlanningFAQ />
    </div>
  );
}
