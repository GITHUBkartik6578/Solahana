import React from 'react';
import GoalsHero from '../components/goals/GoalsHero';
import PersonalizedGoalTimelineSection from '../components/goals/PersonalizedGoalTimelineSection';
import GoalsCTA from '../components/goals/GoalsCTA';

export default function GoalsPlanningPage({ onOpenSearch }) {

  const handleExploreCategories = () => {
    const el = document.getElementById('personalized-goal-timeline');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10">
      {/* SECTION 1: HERO BANNER */}
      <GoalsHero 
        onStartPlanning={onOpenSearch}
        onExploreCategories={handleExploreCategories}
      />

      {/* SECTION 2: HORIZON MATCHING & PERSONALIZED GOAL PLANNING */}
      <PersonalizedGoalTimelineSection />

      {/* SECTION 3: CONSULTATION CTA */}
      <GoalsCTA 
        onStartPlanning={onOpenSearch}
        onBookConsultation={onOpenSearch}
      />
    </div>
  );
}
