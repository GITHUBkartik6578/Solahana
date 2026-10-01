import React from 'react';
import EstateHero from '../components/estate/EstateHero';
import WhyEstatePlanningMatters from '../components/estate/WhyEstatePlanningMatters';
import EstateSolutions from '../components/estate/EstateSolutions';
import WhyChooseSolahanaEstate from '../components/estate/WhyChooseSolahanaEstate';
import EstateBenefits from '../components/estate/EstateBenefits';

export default function EstatePlanningPage({ onOpenSearch }) {

  const scrollToConsultation = () => {
    const el = document.getElementById('global-consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      {/* 1. HERO SECTION */}
      <EstateHero 
        onStartEstatePlanning={scrollToConsultation}
        onRequestCallback={scrollToConsultation}
      />

      {/* 2. WHY ESTATE PLANNING MATTERS */}
      <WhyEstatePlanningMatters />

      {/* 3. ESTATE PLANNING SOLUTIONS */}
      <EstateSolutions onSelectSolution={onOpenSearch} />

      {/* 4. WHY CHOOSE SOLAHANA */}
      <WhyChooseSolahanaEstate />

      {/* 5. ESTATE PLANNING BENEFITS */}
      <EstateBenefits onStartEstatePlanning={scrollToConsultation} />
    </div>
  );
}
