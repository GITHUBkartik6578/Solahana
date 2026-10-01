import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart as PieIcon, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import CalculatorLayout from './CalculatorLayout';
import { calculateLumpsum, formatINR } from '../../utils/calculatorEngine';

export default function LumpsumCalculator() {
  const location = useLocation();

  const [principalAmount, setPrincipalAmount] = useState(500000);
  const [returnRate, setReturnRate] = useState(12);
  const [durationYears, setDurationYears] = useState(10);

  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      if (prefill.principalAmount !== undefined) setPrincipalAmount(Number(prefill.principalAmount));
      if (prefill.returnRate !== undefined) setReturnRate(Number(prefill.returnRate));
      if (prefill.durationYears !== undefined) setDurationYears(Number(prefill.durationYears));
    }
  }, [location.state]);

  const result = useMemo(() => {
    return calculateLumpsum(principalAmount, returnRate, durationYears);
  }, [principalAmount, returnRate, durationYears]);

  const handleReset = () => {
    setPrincipalAmount(500000);
    setReturnRate(12);
    setDurationYears(10);
  };

  const getSavePayload = () => ({
    inputs: { principalAmount, returnRate, durationYears },
    results: {
      principalAmount: result.principalAmount,
      totalGain: result.totalGain,
      futureValue: result.futureValue,
      gainPct: result.gainPct,
    },
  });

  return (
    <CalculatorLayout
      title="Lumpsum Investment Calculator"
      subtitle="Simulate potential future growth and compound wealth from a single initial investment."
      icon={PieIcon}
      onReset={handleReset}
      getSavePayload={getSavePayload}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Controls */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/30 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#2F5BC7]/20 pb-3">
            <h3 className="font-serif-luxury text-lg font-bold text-[#0F1F45] flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-[#5A7FD6]" />
              <span>Investment Details</span>
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Total Initial Deposit</label>
              <span className="font-mono text-sm font-bold text-[#5A7FD6]">{formatINR(principalAmount)}</span>
            </div>
            <input
              type="number"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono"
              step="25000"
            />
            <input
              type="range"
              min="10000"
              max="5000000"
              step="25000"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(Number(e.target.value))}
              className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#FFFFFF] rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Expected Annual CAGR (%)</label>
              <span className="font-mono text-sm font-bold text-[#5A7FD6]">{returnRate}% p.a.</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#FFFFFF] rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Time Horizon (Years)</label>
              <span className="font-mono text-sm font-bold text-[#5A7FD6]">{durationYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              value={durationYears}
              onChange={(e) => setDurationYears(Number(e.target.value))}
              className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#FFFFFF] rounded-lg"
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/50 shadow-2xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#5A7FD6]">ESTIMATED MATURITY VALUE</span>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-[#0F1F45]">{formatINR(result.futureValue)}</div>
            <p className="text-xs text-[#5B6B84]/80">
              Future worth of your initial {formatINR(principalAmount)} after {durationYears} years.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#F7F8FB]/80 border border-[#3B82F6]/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-blue-300">Initial Deposit</span>
              <div className="text-xl font-bold font-mono text-[#0F1F45]">{formatINR(result.principalAmount)}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FB]/80 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-emerald-400">Total Profit Gain</span>
              <div className="text-xl font-bold font-mono text-emerald-300">+{formatINR(result.totalGain)}</div>
              <div className="text-[10px] text-emerald-400/70 font-semibold">+{result.gainPct}% Growth</div>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="p-6 rounded-3xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/30 shadow-2xl space-y-3">
            <h4 className="text-xs font-bold font-mono text-[#5A7FD6] uppercase tracking-wider">
              Compounded Lumpsum Timeline
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="year" stroke="#5B6B8460" tick={{ fontSize: 10, fill: '#5B6B84' }} />
                  <YAxis stroke="#5B6B8460" tick={{ fontSize: 10, fill: '#5B6B84' }} tickFormatter={(val) => formatINR(val, true)} />
                  <Tooltip formatter={(val) => [formatINR(val), 'Value']} contentStyle={{ backgroundColor: '#0F1F45', borderRadius: '10px' }} />
                  <Area type="monotone" dataKey="totalValue" stroke="#2F5BC7" fill="#2F5BC730" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </CalculatorLayout>
  );
}
