import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Percent, TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import CalculatorLayout from './CalculatorLayout';
import { calculateInflation, formatINR } from '../../utils/calculatorEngine';

export default function InflationCalculator() {
  const location = useLocation();

  const [todayValue, setTodayValue] = useState(100000);
  const [inflationRate, setInflationRate] = useState(6.5);
  const [durationYears, setDurationYears] = useState(15);

  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      if (prefill.todayValue !== undefined) setTodayValue(Number(prefill.todayValue));
      if (prefill.inflationRate !== undefined) setInflationRate(Number(prefill.inflationRate));
      if (prefill.durationYears !== undefined) setDurationYears(Number(prefill.durationYears));
    }
  }, [location.state]);

  const result = useMemo(() => {
    return calculateInflation(todayValue, inflationRate, durationYears);
  }, [todayValue, inflationRate, durationYears]);

  const handleReset = () => {
    setTodayValue(100000);
    setInflationRate(6.5);
    setDurationYears(15);
  };

  const getSavePayload = () => ({
    inputs: { todayValue, inflationRate, durationYears },
    results: {
      todayValue: result.todayValue,
      futureCost: result.futureCost,
      costIncrease: result.costIncrease,
      purchasingPowerLossPct: result.purchasingPowerLossPct,
    },
  });

  return (
    <CalculatorLayout
      title="Inflation & Purchasing Power Loss Calculator"
      subtitle="Analyze how inflation erodes paper currency purchasing power and calculate the future cost of goods."
      icon={Percent}
      onReset={handleReset}
      getSavePayload={getSavePayload}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Controls */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/30 shadow-2xl backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#2F5BC7]/20 pb-3">
            <h3 className="font-serif-luxury text-lg font-bold text-[#0F1F45] flex items-center gap-2">
              <Percent className="w-5 h-5 text-[#5A7FD6]" />
              <span>Inflation Input</span>
            </h3>
            <span className="text-[10px] uppercase font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
              Purchasing Power Loss
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Current Cost / Price Today</label>
              <span className="font-mono text-sm font-bold text-[#5A7FD6]">{formatINR(todayValue)}</span>
            </div>
            <input
              type="number"
              value={todayValue}
              onChange={(e) => setTodayValue(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono"
              step="5000"
            />
            <input
              type="range"
              min="10000"
              max="2000000"
              step="10000"
              value={todayValue}
              onChange={(e) => setTodayValue(Number(e.target.value))}
              className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#FFFFFF] rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Annual Inflation Rate (%)</label>
              <span className="font-mono text-sm font-bold text-rose-400">{inflationRate}% / year</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer h-1.5 bg-[#FFFFFF] rounded-lg"
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
              max="40"
              value={durationYears}
              onChange={(e) => setDurationYears(Number(e.target.value))}
              className="w-full accent-[#2F5BC7] cursor-pointer h-1.5 bg-[#FFFFFF] rounded-lg"
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-rose-500/40 shadow-2xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-rose-400">EQUIVALENT FUTURE COST IN {durationYears} YEARS</span>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-[#0F1F45]">{formatINR(result.futureCost)}</div>
            <p className="text-xs text-[#5B6B84]/80">
              What costs {formatINR(todayValue)} today will require {formatINR(result.futureCost)} in {durationYears} years.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#F7F8FB]/80 border border-rose-500/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-rose-300">Purchasing Power Loss</span>
              <div className="text-xl font-bold font-mono text-rose-400">-{result.purchasingPowerLossPct}%</div>
              <div className="text-[10px] text-rose-300/70">Real value reduction</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FB]/80 border border-[#2F5BC7]/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#5A7FD6]">Extra Cost Amount</span>
              <div className="text-xl font-bold font-mono text-[#5A7FD6]">+{formatINR(result.costIncrease)}</div>
              <div className="text-[10px] text-[#5B6B84]">+{result.increasePct}% Price Rise</div>
            </div>
          </div>

          {/* Area Chart */}
          <div className="p-6 rounded-3xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/30 shadow-2xl space-y-3">
            <h4 className="text-xs font-bold font-mono text-[#5A7FD6] uppercase tracking-wider">
              Future Cost Escalation Graph
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="year" stroke="#5B6B8460" tick={{ fontSize: 10, fill: '#5B6B84' }} />
                  <YAxis stroke="#5B6B8460" tick={{ fontSize: 10, fill: '#5B6B84' }} tickFormatter={(val) => formatINR(val, true)} />
                  <Tooltip formatter={(val) => [formatINR(val), 'Future Cost']} contentStyle={{ backgroundColor: '#0F1F45', borderRadius: '10px' }} />
                  <Area type="monotone" dataKey="cost" stroke="#F43F5E" fill="#F43F5E30" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </CalculatorLayout>
  );
}
