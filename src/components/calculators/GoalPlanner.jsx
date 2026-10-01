import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Target, Sparkles, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import CalculatorLayout from './CalculatorLayout';
import { calculateGoal, formatINR } from '../../utils/calculatorEngine';

export default function GoalPlanner() {
  const location = useLocation();

  const [goalName, setGoalName] = useState('Child Higher Education');
  const [targetAmount, setTargetAmount] = useState(3500000);
  const [yearsRemaining, setYearsRemaining] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [existingSavings, setExistingSavings] = useState(300000);

  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      if (prefill.goalName !== undefined) setGoalName(prefill.goalName);
      if (prefill.targetAmount !== undefined) setTargetAmount(Number(prefill.targetAmount));
      if (prefill.yearsRemaining !== undefined) setYearsRemaining(Number(prefill.yearsRemaining));
      if (prefill.expectedReturn !== undefined) setExpectedReturn(Number(prefill.expectedReturn));
      if (prefill.existingSavings !== undefined) setExistingSavings(Number(prefill.existingSavings));
    }
  }, [location.state]);

  const result = useMemo(() => {
    return calculateGoal(goalName, targetAmount, yearsRemaining, expectedReturn, existingSavings);
  }, [goalName, targetAmount, yearsRemaining, expectedReturn, existingSavings]);

  const handleReset = () => {
    setGoalName('Child Higher Education');
    setTargetAmount(3500000);
    setYearsRemaining(10);
    setExpectedReturn(12);
    setExistingSavings(300000);
  };

  const getSavePayload = () => ({
    inputs: { goalName, targetAmount, yearsRemaining, expectedReturn, existingSavings },
    results: {
      requiredMonthlySIP: result.requiredMonthlySIP,
      requiredLumpsumToday: result.requiredLumpsumToday,
      futureTargetValue: result.futureTargetValue,
      netTargetNeeded: result.netTargetNeeded,
    },
  });

  return (
    <CalculatorLayout
      title="Life Goal Planning Engine"
      subtitle="Define your target milestone amount, timeline, and generate custom SIP or Lumpsum investment blueprints."
      icon={Target}
      onReset={handleReset}
      getSavePayload={getSavePayload}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Input Controls */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/30 shadow-2xl backdrop-blur-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-[#2F5BC7]/20 pb-3">
            <h3 className="font-serif-luxury text-lg font-bold text-[#0F1F45] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#5A7FD6]" />
              <span>Goal Configuration</span>
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">Goal Identifier</label>
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-semibold"
              placeholder="e.g. Dream House Down Payment"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Target Corpus (Today's Value)</label>
              <span className="font-mono text-sm font-bold text-[#5A7FD6]">{formatINR(targetAmount)}</span>
            </div>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono"
              step="50000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Years to Goal</label>
              <input
                type="number"
                value={yearsRemaining}
                onChange={(e) => setYearsRemaining(Number(e.target.value))}
                className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2 px-3 text-[#0F1F45] text-xs font-mono"
                min="1"
                max="40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Expected Return %</label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2 px-3 text-[#0F1F45] text-xs font-mono"
                step="0.5"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#334155]">Existing Corpus Saved for Goal</label>
              <span className="font-mono text-sm font-bold text-emerald-400">{formatINR(existingSavings)}</span>
            </div>
            <input
              type="number"
              value={existingSavings}
              onChange={(e) => setExistingSavings(Number(e.target.value))}
              className="w-full bg-[#FFFFFF] border border-[#E4E8F0] focus:border-[#2F5BC7] rounded-xl py-2.5 px-4 text-[#0F1F45] text-xs font-mono"
              step="10000"
            />
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/50 shadow-2xl space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#5A7FD6]">RECOMMENDED MONTHLY SIP</span>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-[#0F1F45]">{formatINR(result.requiredMonthlySIP)}</div>
            <p className="text-xs text-[#5B6B84]/80">
              Required monthly investment to guarantee {goalName} in {yearsRemaining} years.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#F7F8FB]/80 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-emerald-400">Or One-time Lumpsum</span>
              <div className="text-xl font-bold font-mono text-emerald-300">{formatINR(result.requiredLumpsumToday)}</div>
              <div className="text-[10px] text-emerald-400/70">Invested today</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F8FB]/80 border border-[#2F5BC7]/30 space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#5A7FD6]">Future Target Value</span>
              <div className="text-xl font-bold font-mono text-[#5A7FD6]">{formatINR(result.futureTargetValue)}</div>
              <div className="text-[10px] text-[#5B6B84]">Adjusted for 6% inflation</div>
            </div>
          </div>

          {/* Goal Motivational Card */}
          <div className="p-5 rounded-2xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-left flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#2F5BC7]/20 text-[#5A7FD6] shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#5A7FD6] uppercase font-mono">Solahana Goal Roadmap</h4>
              <p className="text-xs text-[#5B6B84] leading-relaxed mt-0.5">
                Starting a monthly SIP of <strong>{formatINR(result.requiredMonthlySIP)}</strong> today ensures you fulfill <strong>{goalName}</strong> without financial stress.
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="p-6 rounded-3xl bg-[#F7F8FB]/70 border border-[#2F5BC7]/30 shadow-2xl space-y-3">
            <h4 className="text-xs font-bold font-mono text-[#5A7FD6] uppercase tracking-wider">
              Goal Completion Trajectory
            </h4>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="year" stroke="#5B6B8460" tick={{ fontSize: 10, fill: '#5B6B84' }} />
                  <YAxis stroke="#5B6B8460" tick={{ fontSize: 10, fill: '#5B6B84' }} tickFormatter={(val) => formatINR(val, true)} />
                  <Tooltip formatter={(val) => [formatINR(val), 'Corpus']} contentStyle={{ backgroundColor: '#0F1F45', borderRadius: '10px' }} />
                  <Area type="monotone" dataKey="sipProgress" stroke="#3B82F6" fill="#3B82F630" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </CalculatorLayout>
  );
}
