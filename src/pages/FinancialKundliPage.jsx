import React from 'react';
import FinancialKundli from '../components/kundli/FinancialKundli';

/**
 * /financial-health-checkup: the Solahana Financial Health Check-up (the "Kundli" module in code). It reuses the nine
 * questions and hc-v1 scoring of the earlier 3-step check-up read-only. Browser memory only.
 */
export default function FinancialKundliPage() {
  return (
    <div className="kundli-page min-h-screen bg-[#F7F8FB] px-4 pb-32 pt-28 sm:px-6 lg:pt-32">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="kundli-noprint text-[12px] font-bold uppercase tracking-[0.18em] text-[#1A3170]">Solahana Financial Health Check-up</h1>
        <div className="mt-5">
          <FinancialKundli />
        </div>
      </div>
    </div>
  );
}
