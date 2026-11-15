/**
 * Sample figures shown on the calculators hub and the Investments page. Every number comes from the same engine the
 * calculators use, from the stated inputs, so a sample can never drift from what the calculator would show.
 */
import { calculateSIP, calculateEMI, formatINR } from './calculatorEngine';

export const SAMPLE_SIP = Object.freeze({ monthly: 50000, annualReturn: 12, years: 15, stepUpPct: 10 });
export const SAMPLE_EMI = Object.freeze({ principal: 7500000, annualRate: 8.5, years: 20 });
export const SAMPLE_PORTFOLIO = Object.freeze({ monthly: 75000, annualReturn: 12, years: 15, stepUpPct: 10, checkpoints: [1, 5, 10, 15] });

export function sipSample(s = SAMPLE_SIP) {
  const r = calculateSIP(s.monthly, s.annualReturn, s.years, s.stepUpPct);
  return {
    futureValue: r.futureValue,
    full: formatINR(r.futureValue),
    compact: formatINR(r.futureValue, true),
    detail: `${s.years} Yrs • ${formatINR(s.monthly)}/mo @ ${s.annualReturn}% • ${s.stepUpPct}% yearly step-up`,
  };
}

export function emiSample(s = SAMPLE_EMI) {
  const r = calculateEMI(s.principal, s.annualRate, s.years);
  return {
    monthlyEMI: r.monthlyEMI,
    text: `${formatINR(r.monthlyEMI)} / mo`,
    detail: `₹${s.principal / 100000}L Loan @ ${s.annualRate}% ${s.years} Yrs`,
  };
}

export function portfolioSample(s = SAMPLE_PORTFOLIO) {
  const r = calculateSIP(s.monthly, s.annualReturn, s.years, s.stepUpPct);
  return {
    heading: `${formatINR(s.monthly)}/mo SIP (${s.stepUpPct}% Step-Up) @ ${s.annualReturn}%`,
    points: s.checkpoints.map((year) => ({ year, value: r.yearlyData[year - 1].futureValue, text: formatINR(r.yearlyData[year - 1].futureValue, true) })),
  };
}
