import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Building2, ShieldCheck, Sparkles, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import CalculatorLayout from './CalculatorLayout';
import { calculateFD, formatINR } from '../../utils/calculatorEngine';

export default function FdCalculator() {
  const location = useLocation();

  const [depositAmount, setDepositAmount] = useState(200000);
  const [interestRate, setInterestRate] = useState(7.25);
  const [durationYears, setDurationYears] = useState(5);
  const [frequency, setFrequency] = useState('Quarterly');

  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      if (prefill.depositAmount !== undefined) setDepositAmount(Number(prefill.depositAmount));
      if (prefill.interestRate !== undefined) setInterestRate(Number(prefill.interestRate));
      if (prefill.durationYears !== undefined) setDurationYears(Number(prefill.durationYears));
      if (prefill.frequency !== undefined) setFrequency(prefill.frequency);
    }
  }, [location.state]);

  const result = useMemo(() => {
    return calculateFD(depositAmount, interestRate, durationYears, frequency);
  }, [depositAmount, interestRate, durationYears, frequency]);

  const handleReset = () => {
    setDepositAmount(200000);
    setInterestRate(7.25);
    setDurationYears(5);
    setFrequency('Quarterly');
  };

  const getSavePayload = () => ({
    inputs: { depositAmount, interestRate, durationYears, frequency },
    results: {
      depositAmount: result.depositAmount,
      totalInterest: result.totalInterest,
      maturityAmount: result.maturityAmount,
      yieldPct: result.yieldPct,
    },
  });

  return (
    <CalculatorLayout
      title="Fixed Deposit (FD) Yield Calculator"
      subtitle="Compute guaranteed maturity returns and interest payout across quarterly, monthly, or annual compounding."
      icon={Building2}
      onReset={handleReset}
      getSavePayload={getSavePayload}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Controls */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/30 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#2F5BC7]/20 pb-3">
            <h3 className="font-serif-luxury text-lg font-bold text-[#0F1F45] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#5A7FD6]" />
              <span>FD Deposit Parameters</span>
            </h3>
            <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Guaranteed Yield
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Fixed Deposit Amount</label>
              <span className="font-mono text-sm font-bold text-[#5A7FD6]">{formatINR(depositAmount)}</span>
            </div>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono"
              step="10000"
            />
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#FFFFFF] rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Interest Rate (% p.a.)</label>
              <span className="font-mono text-sm font-bold text-[#5A7FD6]">{interestRate}% p.a.</span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              step="0.25"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#FFFFFF] rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Tenure (Years)</label>
              <input
                type="number"
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2 px-3 text-[#0F1F45] text-xs font-mono"
                min="0.5"
                max="20"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Compounding Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2 px-3 text-[#0F1F45] text-xs font-semibold"
              >
                <option value="Quarterly">Quarterly (Standard)</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Annually">Annually</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/50 shadow-2xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#5A7FD6]">TOTAL MATURITY VALUE</span>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-[#0F1F45]">{formatINR(result.maturityAmount)}</div>
            <p className="text-xs text-[#5B6B84]/80">
              Guaranteed maturity return after {durationYears} years with {frequency.toLowerCase()} compounding.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#F7F8FB]/80 border border-[#3B82F6]/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-blue-300">Principal Deposit</span>
              <div className="text-xl font-bold font-mono text-[#0F1F45]">{formatINR(result.depositAmount)}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FB]/80 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-emerald-400">Total Interest Earned</span>
              <div className="text-xl font-bold font-mono text-emerald-300">+{formatINR(result.totalInterest)}</div>
              <div className="text-[10px] text-emerald-400/70 font-semibold">{result.yieldPct}% Total Yield</div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="p-6 rounded-3xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/30 shadow-2xl space-y-3">
            <h4 className="text-xs font-bold font-mono text-[#5A7FD6] uppercase tracking-wider">
              Yearly FD Growth Trajectory
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="year" stroke="#5B6B8460" tick={{ fontSize: 10, fill: '#5B6B84' }} />
                  <YAxis stroke="#5B6B8460" tick={{ fontSize: 10, fill: '#5B6B84' }} tickFormatter={(val) => formatINR(val, true)} />
                  <Tooltip formatter={(val) => [formatINR(val), '']} contentStyle={{ backgroundColor: '#0F1F45', borderRadius: '10px' }} />
                  <Bar dataKey="deposit" name="Deposit" fill="#3B82F6" stackId="a" />
                  <Bar dataKey="interest" name="Interest" fill="#2F5BC7" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </CalculatorLayout>
  );
}
