import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, RotateCcw, Bookmark, Sparkles, ShieldCheck, CheckCircle2, TrendingDown } from 'lucide-react';
import { formatINR } from '../../utils/calculatorEngine';

export default function TaxCalculator() {
  const [grossIncome, setGrossIncome] = useState(1800000);
  const [sec80C, setSec80C] = useState(150000);
  const [sec80D, setSec80D] = useState(50000);
  const [nps80CCD, setNps80CCD] = useState(50000);
  const [hraOther, setHraOther] = useState(100000);
  const [isSaved, setIsSaved] = useState(false);

  // Compute Indian Tax under Old vs New Regime (FY 2024-25 / 2025-26 rules)
  const taxResult = useMemo(() => {
    const inc = Math.max(0, Number(grossIncome) || 0);
    const c80 = Math.min(150000, Math.max(0, Number(sec80C) || 0));
    const d80 = Math.min(100000, Math.max(0, Number(sec80D) || 0));
    const nps = Math.min(50000, Math.max(0, Number(nps80CCD) || 0));
    const other = Math.max(0, Number(hraOther) || 0);

    // Standard Deduction
    const stdDeductionOld = 50000;
    const stdDeductionNew = 75000;

    // 1. OLD REGIME TAX CALCULATION
    const totalOldDeductions = stdDeductionOld + c80 + d80 + nps + other;
    const taxableOld = Math.max(0, inc - totalOldDeductions);

    let taxOld = 0;
    if (taxableOld > 1000000) {
      taxOld = 112500 + (taxableOld - 1000000) * 0.3;
    } else if (taxableOld > 500000) {
      taxOld = 12500 + (taxableOld - 500000) * 0.2;
    } else if (taxableOld > 250000) {
      taxOld = (taxableOld - 250000) * 0.05;
    }
    // Rebate 87A under Old Regime up to 5L taxable
    if (taxableOld <= 500000) taxOld = 0;

    // Add 4% Cess
    taxOld = Math.round(taxOld * 1.04);

    // 2. NEW REGIME TAX CALCULATION
    const taxableNew = Math.max(0, inc - stdDeductionNew);
    let taxNew = 0;

    if (taxableNew > 1500000) {
      taxNew = 150000 + (taxableNew - 1500000) * 0.3;
    } else if (taxableNew > 1200000) {
      taxNew = 90000 + (taxableNew - 1200000) * 0.2;
    } else if (taxableNew > 900000) {
      taxNew = 45000 + (taxableNew - 900000) * 0.15;
    } else if (taxableNew > 600000) {
      taxNew = 15000 + (taxableNew - 600000) * 0.1;
    } else if (taxableNew > 300000) {
      taxNew = (taxableNew - 300000) * 0.05;
    }
    // Rebate 87A under New Regime up to 7L taxable
    if (taxableNew <= 700000) taxNew = 0;

    // Add 4% Cess
    taxNew = Math.round(taxNew * 1.04);

    const recommendedRegime = taxOld < taxNew ? 'Old Regime' : 'New Regime';
    const netTaxSavings = Math.abs(taxOld - taxNew);
    const lowestTax = Math.min(taxOld, taxNew);

    return {
      taxOld,
      taxNew,
      taxableOld,
      taxableNew,
      totalOldDeductions,
      recommendedRegime,
      netTaxSavings,
      lowestTax,
    };
  }, [grossIncome, sec80C, sec80D, nps80CCD, hraOther]);

  const handleReset = () => {
    setGrossIncome(1800000);
    setSec80C(150000);
    setSec80D(50000);
    setNps80CCD(50000);
    setHraOther(100000);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <section id="tax-calculator" className="py-16 sm:py-24 bg-[#F7F8FB] relative overflow-hidden border-t border-[#E4E8F0]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2F5BC7]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E8F0] text-[#2F5BC7] text-xs font-semibold uppercase tracking-widest font-sora shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-[#2F5BC7]" />
            <span>INTELLIGENT TAX ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45]">
            Old vs New Tax Regime Calculator
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Compare total tax liability under Old vs New Regime and optimize deductions for maximum net savings.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Box: Input Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white border border-[#E4E8F0] shadow-xl text-left space-y-6"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-[#E4E8F0]/60 pb-4">
              <h3 className="font-serif-luxury text-lg font-bold text-[#0F1F45] flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#2F5BC7]" />
                <span>Income &amp; Deductions</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-[#64748B] hover:text-[#0F1F45] hover:border-[#2F5BC7] transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 rounded-xl bg-[#F7F8FB] border border-[#E4E8F0] text-[#2F5BC7] hover:border-[#2F5BC7] transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#2F5BC7]" />
                  <span>{isSaved ? 'Saved!' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Gross Annual Salary / Income */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-[#0F1F45]">Gross Annual Income (₹)</label>
                <span className="font-mono text-sm font-bold text-[#2F5BC7]">{formatINR(grossIncome)}</span>
              </div>
              <input
                type="number"
                min="300000"
                max="50000000"
                step="25000"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono outline-none"
              />
              <input
                type="range"
                min="500000"
                max="5000000"
                step="50000"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#F7F8FB] rounded-lg"
              />
            </div>

            {/* Section 80C Deductions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-[#0F1F45]">Section 80C Deductions (ELSS, PPF, EPF)</label>
                <span className="font-mono text-sm font-bold text-[#0F1F45]">{formatINR(sec80C)}</span>
              </div>
              <input
                type="number"
                min="0"
                max="150000"
                step="5000"
                value={sec80C}
                onChange={(e) => setSec80C(Number(e.target.value))}
                className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono outline-none"
              />
              <input
                type="range"
                min="0"
                max="150000"
                step="5000"
                value={sec80C}
                onChange={(e) => setSec80C(Number(e.target.value))}
                className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#F7F8FB] rounded-lg"
              />
            </div>

            {/* Section 80D & NPS 80CCD */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0F1F45]">Sec 80D Health Cover (₹)</label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="5000"
                  value={sec80D}
                  onChange={(e) => setSec80D(Number(e.target.value))}
                  className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-3 text-[#0F1F45] text-xs font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0F1F45]">NPS 80CCD 1B (₹)</label>
                <input
                  type="number"
                  min="0"
                  max="50000"
                  step="5000"
                  value={nps80CCD}
                  onChange={(e) => setNps80CCD(Number(e.target.value))}
                  className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-3 text-[#0F1F45] text-xs font-mono outline-none"
                />
              </div>
            </div>

            {/* HRA & Other Deductions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-[#0F1F45]">HRA / Home Loan Interest / Other Deductions</label>
                <span className="font-mono text-sm font-bold text-[#0F1F45]">{formatINR(hraOther)}</span>
              </div>
              <input
                type="number"
                min="0"
                max="500000"
                step="10000"
                value={hraOther}
                onChange={(e) => setHraOther(Number(e.target.value))}
                className="w-full bg-[#F7F8FB] border border-[#E4E8F0] focus:border-[#2F5BC7] focus:ring-1 focus:ring-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono outline-none"
              />
            </div>

          </motion.div>

          {/* Right Box: Output Comparison Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            {/* Primary Recommended Output Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#F7F8FB] to-white border-2 border-[#2F5BC7] shadow-xl space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-widest text-[#2F5BC7] font-bold">
                  RECOMMENDED TAX REGIME
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {taxResult.recommendedRegime} Best
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-bold font-mono text-[#0F1F45]">
                {formatINR(taxResult.lowestTax)}
              </div>

              <p className="text-xs text-[#64748B] font-sans">
                Lowest total tax payable under {taxResult.recommendedRegime}. Saving you <span className="font-bold text-emerald-700">{formatINR(taxResult.netTaxSavings)}</span> compared to the alternative regime.
              </p>
            </div>

            {/* Regime Side-by-Side Comparison Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Old Regime Card */}
              <div className={`p-5 rounded-2xl bg-white border text-left space-y-2 transition-all ${taxResult.recommendedRegime === 'Old Regime' ? 'border-[#2F5BC7] shadow-md bg-[#FFFFFF]' : 'border-[#E4E8F0] shadow-xs'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0F1F45]">OLD REGIME</span>
                  {taxResult.recommendedRegime === 'Old Regime' && (
                    <span className="text-[10px] uppercase font-mono font-bold text-[#2F5BC7]">Optimal</span>
                  )}
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F1F45]">
                  {formatINR(taxResult.taxOld)}
                </div>
                <div className="text-[10px] text-[#64748B] font-medium">
                  Total Deductions: {formatINR(taxResult.totalOldDeductions)}
                </div>
              </div>

              {/* New Regime Card */}
              <div className={`p-5 rounded-2xl bg-white border text-left space-y-2 transition-all ${taxResult.recommendedRegime === 'New Regime' ? 'border-emerald-500 shadow-md bg-emerald-50/20' : 'border-[#E4E8F0] shadow-xs'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0F1F45]">NEW REGIME</span>
                  {taxResult.recommendedRegime === 'New Regime' && (
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-700">Optimal</span>
                  )}
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F1F45]">
                  {formatINR(taxResult.taxNew)}
                </div>
                <div className="text-[10px] text-[#64748B] font-medium">
                  Std. Deduction: ₹75,000
                </div>
              </div>
            </div>

            {/* Key Tax Savings Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-[#E4E8F0] shadow-xl space-y-4">
              <h4 className="text-xs font-bold font-mono text-[#0F1F45] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2F5BC7]" />
                <span>Eligible Deductions Summary</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-[#E4E8F0]/50">
                  <span className="text-[#64748B]">Section 80C (ELSS, PPF, EPF)</span>
                  <span className="font-mono font-bold text-[#0F1F45]">{formatINR(sec80C)}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#E4E8F0]/50">
                  <span className="text-[#64748B]">Section 80D (Health Insurance)</span>
                  <span className="font-mono font-bold text-[#0F1F45]">{formatINR(sec80D)}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-[#E4E8F0]/50">
                  <span className="text-[#64748B]">Section 80CCD 1B (NPS Additional)</span>
                  <span className="font-mono font-bold text-[#0F1F45]">{formatINR(nps80CCD)}</span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-[#64748B]">HRA / Home Loan &amp; Other Deductions</span>
                  <span className="font-mono font-bold text-[#0F1F45]">{formatINR(hraOther)}</span>
                </div>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
