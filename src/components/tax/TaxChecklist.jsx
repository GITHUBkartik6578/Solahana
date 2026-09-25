import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TaxChecklist() {
  const [checkedItems, setCheckedItems] = useState([0, 1]);

  const items = [
    { title: 'ELSS Mutual Funds (Sec 80C)', detail: 'Invested up to ₹1.5 Lakh for shortest 3-year lock-in with equity compounding.' },
    { title: 'NPS Tier 1 Additional Deduction (Sec 80CCD 1B)', detail: 'Deposited additional ₹50,000 for exclusive retirement tax shelter.' },
    { title: 'Health Insurance Premiums (Sec 80D)', detail: 'Claimed medical insurance premium for self, spouse, children, and parents.' },
    { title: 'Capital Gains Tax Loss Harvesting', detail: 'Harvested up to ₹1.25 Lakh tax-free equity LTCG before March end.' },
    { title: 'Home Loan Interest Deduction (Sec 24b)', detail: 'Claimed up to ₹2 Lakh interest deduction on self-occupied residential property.' },
    { title: 'HRA Rent Receipt Declaration', detail: 'Submitted valid rental agreements & landlord PAN for monthly rent deductions.' },
  ];

  const toggleCheck = (idx) => {
    if (checkedItems.includes(idx)) {
      setCheckedItems(checkedItems.filter((i) => i !== idx));
    } else {
      setCheckedItems([...checkedItems, idx]);
    }
  };

  const progressPercent = Math.round((checkedItems.length / items.length) * 100);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-[#FFFFFF] border-t border-[#E4E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EEF2FB] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>INTERACTIVE TAX CHECKLIST</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#0F1F45]">
            Annual Tax Readiness Scorecard
          </h2>
          <p className="text-base text-[#475569] font-inter">
            Check off your completed deductions to calculate your financial year tax readiness score.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="p-6 rounded-2xl bg-white border border-[#E4E8F0] shadow-sm mb-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold font-sora text-[#0F1F45]">
            <span>Your Tax Optimization Score</span>
            <span className="text-[#2F5BC7]">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#FFFFFF] border border-[#E4E8F0] overflow-hidden">
            <div
              className="h-full bg-[#1A3170] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist Grid */}
        <div className="space-y-4">
          {items.map((item, idx) => {
            const isChecked = checkedItems.includes(idx);
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
                  isChecked
                    ? 'bg-white border-[#2F5BC7] shadow-md'
                    : 'bg-[#FFFFFF] border-[#E4E8F0] hover:border-[#2F5BC7]/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                  isChecked ? 'bg-[#1A3170] border-[#2F5BC7] text-white' : 'border-[#E4E8F0] bg-white'
                }`}>
                  {isChecked && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className={`text-base font-bold font-serif-luxury ${isChecked ? 'text-[#2F5BC7]' : 'text-[#0F1F45]'}`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#475569] font-inter mt-1 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
