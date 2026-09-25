import React from 'react';
import TaxHero from '../components/tax/TaxHero';
import WhyTaxPlanningMatters from '../components/tax/WhyTaxPlanningMatters';
import TaxServices from '../components/tax/TaxServices';
import WhyChooseSolahanaTax from '../components/tax/WhyChooseSolahanaTax';
import TaxBenefits from '../components/tax/TaxBenefits';
import TaxCalculator from '../components/tax/TaxCalculator';

export default function TaxPlanningPage({ onOpenSearch }) {

  const scrollToCalculator = () => {
    const el = document.getElementById('tax-calculator');
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
      {/* 1. PREMIUM HERO SECTION */}
      <TaxHero 
        onStartTaxPlanning={scrollToCalculator}
        onRequestCallback={scrollToConsultation}
      />

      {/* 2. WHY TAX PLANNING MATTERS */}
      <WhyTaxPlanningMatters />

      {/* 3. TAX PLANNING SOLUTIONS */}
      <TaxServices onSelectService={onOpenSearch} />

      {/* 4. WHY CHOOSE SOLAHANA */}
      <WhyChooseSolahanaTax />

      {/* 5. TAX SAVING BENEFITS SECTION */}
      <TaxBenefits onStartTaxPlanning={scrollToCalculator} />

      {/* 6. TAX PLANNING CALCULATOR (LAST CONTENT SECTION) */}
      <TaxCalculator />
    </div>
  );
}
