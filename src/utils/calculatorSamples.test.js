import { describe, expect, it } from 'vitest';
import { calculateSIP } from './calculatorEngine';
import { SAMPLE_EMI, SAMPLE_PORTFOLIO, SAMPLE_SIP, emiSample, portfolioSample, sipSample } from './calculatorSamples';

// Independent closed forms, written without the engine: a SIP paid at the start of each month with the yearly rate applied as
// one-twelfth each month, the instalment stepped up once a year.
function steppedSipValue(monthly, annualPct, years, stepPct) {
  const i = annualPct / 12 / 100;
  const annuityDueOfOneYear = (((1 + i) ** 12 - 1) / i) * (1 + i);
  let total = 0;
  for (let y = 1; y <= years; y += 1) {
    const instalment = monthly * (1 + stepPct / 100) ** (y - 1);
    total += instalment * annuityDueOfOneYear * (1 + i) ** (12 * (years - y));
  }
  return total;
}
function emi(principal, annualPct, years) {
  const r = annualPct / 12 / 100;
  const n = years * 12;
  return (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}

describe('calculator sample figures are computed from stated inputs', () => {
  it('the SIP sample equals an independent closed form for 50,000 a month, 12%, 15 years, 10% step-up', () => {
    const s = sipSample();
    expect(Math.abs(s.futureValue - steppedSipValue(50000, 12, 15, 10))).toBeLessThanOrEqual(1);
    expect(s.futureValue).toBe(43419247);
    expect(s.full).toBe('₹4,34,19,247');
    expect(s.compact).toBe('₹4.34 Cr');
  });

  it('the SIP sample states every assumption it depends on', () => {
    const { detail } = sipSample();
    expect(detail).toContain('15 Yrs');
    expect(detail).toContain('₹50,000/mo');
    expect(detail).toContain('12%');
    expect(detail).toContain('10% yearly step-up');
  });

  it('the old hard-coded SIP figure is not the sample any more, and the no-step-up figure differs from the step-up one', () => {
    expect(sipSample().futureValue).not.toBe(25340000);
    expect(calculateSIP(50000, 12, 15, 0).futureValue).toBe(25228800);
    expect(sipSample().futureValue).toBeGreaterThan(calculateSIP(50000, 12, 15, 0).futureValue);
  });

  it('the EMI sample equals the textbook formula for 75 lakh at 8.5% for 20 years, not the old 68,450', () => {
    const e = emiSample();
    expect(e.monthlyEMI).toBe(Math.round(emi(7500000, 8.5, 20)));
    expect(e.monthlyEMI).toBe(65087);
    expect(e.text).toBe('₹65,087 / mo');
    expect(e.detail).toBe('₹75L Loan @ 8.5% 20 Yrs');
  });

  it('the Investments-page sample equals the closed form at years 1, 5, 10 and 15, and states its return assumption', () => {
    const p = portfolioSample();
    expect(p.points.map((x) => x.year)).toEqual([1, 5, 10, 15]);
    p.points.forEach((x) => {
      expect(Math.abs(x.value - steppedSipValue(75000, 12, x.year, 10)), `year ${x.year}`).toBeLessThanOrEqual(1);
    });
    expect(p.points.map((x) => x.text)).toEqual(['₹9.61 L', '₹73.84 L', '₹2.53 Cr', '₹6.51 Cr']);
    expect(p.heading).toContain('@ 12%');
    expect(p.heading).toContain('10% Step-Up');
  });

  it('the stated inputs are the ones that were used, and they cannot be changed by accident', () => {
    expect(Object.isFrozen(SAMPLE_SIP) && Object.isFrozen(SAMPLE_EMI) && Object.isFrozen(SAMPLE_PORTFOLIO)).toBe(true);
    expect(SAMPLE_SIP).toMatchObject({ monthly: 50000, annualReturn: 12, years: 15, stepUpPct: 10 });
    expect(SAMPLE_PORTFOLIO).toMatchObject({ monthly: 75000, annualReturn: 12, years: 15, stepUpPct: 10 });
  });

  it('a different input changes the sample, so it is not a constant in disguise', () => {
    expect(sipSample({ ...SAMPLE_SIP, annualReturn: 8 }).futureValue).toBeLessThan(sipSample().futureValue);
    expect(emiSample({ ...SAMPLE_EMI, annualRate: 9 }).monthlyEMI).toBeGreaterThan(emiSample().monthlyEMI);
  });

  it('the engine used by the interactive preview gives the old inline result at the defaults and never NaN at 0%', () => {
    const inline = Math.round(50000 * ((Math.pow(1 + 0.01, 180) - 1) / 0.01) * 1.01);
    expect(calculateSIP(50000, 12, 15, 0).futureValue).toBe(inline);
    [0, 0.0001, 6, 16].forEach((rate) => {
      const r = calculateSIP(50000, rate, 15, 0);
      [r.totalInvested, r.estimatedReturns, r.futureValue].forEach((v) => expect(Number.isFinite(v), `rate ${rate}`).toBe(true));
    });
    expect(calculateSIP(50000, 0, 15, 0).futureValue).toBe(50000 * 180);
  });
});
