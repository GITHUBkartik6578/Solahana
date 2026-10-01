import React, { useEffect } from 'react';
import CalculatorsHero from '../components/calculators/CalculatorsHero';
import CalculatorCategoriesGrid from '../components/calculators/CalculatorCategoriesGrid';
import FeaturedCalculators from '../components/calculators/FeaturedCalculators';
import InteractiveCalculatorPreview from '../components/calculators/InteractiveCalculatorPreview';
import { WhyUseCalculators } from '../components/calculators/WhyUseCalculators';
import { PopularTools } from '../components/calculators/PopularTools';
import { CalculatorsFAQ } from '../components/calculators/CalculatorsFAQ';
import { CalculatorsCTA } from '../components/calculators/CalculatorsCTA';

export const CalculatorsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Financial Calculators | SOLAHANA — Wealth Planning Hub";
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#0F1F45] selection:bg-[#2F5BC7]/20 selection:text-[#1A3170]">
      {/* 1 Hero Banner */}
      <CalculatorsHero />

      {/* 2 Calculator Categories */}
      <div id="calculator-categories">
        <CalculatorCategoriesGrid />
      </div>

      {/* 3 Featured Calculators */}
      <FeaturedCalculators />

      {/* 4 Interactive Calculator Preview */}
      <div id="interactive-preview">
        <InteractiveCalculatorPreview />
      </div>

      {/* 5 Why Use Financial Calculators */}
      <WhyUseCalculators />

      {/* 6 Popular Planning Tools */}
      <PopularTools />

      {/* 7 FAQ */}
      <CalculatorsFAQ />

      {/* 8 Final CTA */}
      <CalculatorsCTA />
    </main>
  );
};
