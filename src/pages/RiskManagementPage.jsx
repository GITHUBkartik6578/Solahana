import React from 'react';
import RiskHero from '../components/risk/RiskHero';
import WhyRiskManagementMatters from '../components/risk/WhyRiskManagementMatters';
import RiskSolutions from '../components/risk/RiskSolutions';
import WhyChooseSolahanaRisk from '../components/risk/WhyChooseSolahanaRisk';
import RiskBenefits from '../components/risk/RiskBenefits';
import RiskCalculator from '../components/risk/RiskCalculator';

export default function RiskManagementPage({ onOpenSearch }) {

  const scrollToCalculator = () => {
    const el = document.getElementById('risk-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToConsultation = () => {
    const el = document.getElementById('global-consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 bg-[#F7F8FB]">
      {/* 1. HERO SECTION */}
      <RiskHero 
        onStartRiskPlanning={scrollToCalculator}
        onRequestCallback={scrollToConsultation}
      />

      {/* 2. WHY RISK MANAGEMENT MATTERS */}
      <WhyRiskManagementMatters />

      {/* 3. RISK MANAGEMENT SOLUTIONS */}
      <RiskSolutions onSelectSolution={onOpenSearch} />

      {/* 4. WHY CHOOSE SOLAHANA */}
      <WhyChooseSolahanaRisk />

      {/* 5. PROTECTION BENEFITS SECTION */}
      <RiskBenefits onStartRiskPlanning={scrollToCalculator} />

      {/* 6. RISK PROTECTION CALCULATOR (LAST CONTENT SECTION) */}
      <RiskCalculator />
    </div>
  );
}
