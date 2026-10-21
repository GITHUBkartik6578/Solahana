import { describe, expect, it } from 'vitest';
import * as copy from './calculatorCopy';
import { calculateFD, calculateGoal, calculateLumpsum, calculateRetirement } from './calculatorEngine';

const { MARKET_RISK_NOTE, SIP_CONVENTION_NOTE, RETIREMENT_NOTE, FD_NOTE, SAMPLE_FIGURES_NOTE, RATE_LIMIT_NOTE, goalAssumptionNote } = copy;

// Phrases that deny a guarantee are fine; anything left after removing them must not promise an outcome.
const NEGATIONS = /\b(?:not|no)\s+(?:a\s+)?(?:forecast\s+or\s+a\s+)?guarantee[sd]?\b/gi;
const PROMISES = /guarant|ensure|assured|risk-free|without financial stress/i;
const promises = (text) => PROMISES.test(text.replace(NEGATIONS, ''));

const GOAL_ARGS = ['Child Higher Education', 3500000, 10];
const GOAL_SAVINGS = 300000;
// Outputs captured from the engine before effectiveReturn was added: they must not change.
const GOAL_BASELINE = {
  12: { futureSavings: 931754, netTargetNeeded: 5336212, requiredMonthlySIP: 22967, requiredLumpsumToday: 1718118, sip10: 6326329 },
  0: { futureSavings: 303014, netTargetNeeded: 5964953, requiredMonthlySIP: 49458, requiredLumpsumToday: 5905631, sip10: 6267968 },
  '-5': { futureSavings: 303014, netTargetNeeded: 5964953, requiredMonthlySIP: 49458, requiredLumpsumToday: 5905631, sip10: 6267968 },
  0.05: { futureSavings: 303014, netTargetNeeded: 5964953, requiredMonthlySIP: 49458, requiredLumpsumToday: 5905631, sip10: 6267968 },
  30: { futureSavings: 4135755, netTargetNeeded: 2132212, requiredMonthlySIP: 2833, requiredLumpsumToday: 154667, sip10: 7939657 },
  45: { futureSavings: 4135755, netTargetNeeded: 2132212, requiredMonthlySIP: 2833, requiredLumpsumToday: 154667, sip10: 7939657 },
  100: { futureSavings: 4135755, netTargetNeeded: 2132212, requiredMonthlySIP: 2833, requiredLumpsumToday: 154667, sip10: 7939657 },
};

describe('calculateGoal exposes the return rate it really used', () => {
  const expectedRate = { 12: 12, 0: 0.1, '-5': 0.1, 0.05: 0.1, 30: 30, 45: 30, 100: 30 };
  [12, 0, -5, 0.05, 30, 45, 100].forEach((typed) => {
    it(`typed ${typed}%: effectiveReturn is ${expectedRate[typed]}, and the outputs are the same as before the field was added`, () => {
      const r = calculateGoal(...GOAL_ARGS, typed, GOAL_SAVINGS);
      expect(r.effectiveReturn).toBe(expectedRate[typed]);
      const b = GOAL_BASELINE[typed];
      expect(r).toMatchObject({ goalName: 'Child Higher Education', targetToday: 3500000, futureTargetValue: 6267967, futureSavings: b.futureSavings, netTargetNeeded: b.netTargetNeeded, requiredMonthlySIP: b.requiredMonthlySIP, requiredLumpsumToday: b.requiredLumpsumToday });
      expect(r.timelineData).toHaveLength(10);
      expect(r.timelineData[9]).toEqual({ year: 'Yr 10', sipProgress: b.sip10, lumpsumProgress: 6267967, targetLine: 6267967 });
      // the exposed rate is the one that reproduces the result: feeding it back in changes nothing
      const again = calculateGoal(...GOAL_ARGS, r.effectiveReturn, GOAL_SAVINGS);
      expect(again).toEqual(r);
    });

    it(`typed ${typed}%: the note shown in the Goal Planner names ${expectedRate[typed]}%, the rate the engine used`, () => {
      const r = calculateGoal(...GOAL_ARGS, typed, GOAL_SAVINGS);
      expect(goalAssumptionNote(r.effectiveReturn)).toContain(`grow ${expectedRate[typed]}% a year`);
    });
  });

  it('the field only adds to the result: the same keys as before plus effectiveReturn', () => {
    expect(Object.keys(calculateGoal(...GOAL_ARGS, 12, GOAL_SAVINGS)).sort()).toEqual(
      ['effectiveReturn', 'futureSavings', 'futureTargetValue', 'goalName', 'netTargetNeeded', 'requiredLumpsumToday', 'requiredMonthlySIP', 'targetToday', 'timelineData']
    );
  });
});

describe('calculator risk and assumption copy', () => {
  it('states that the market note is an illustration, can be negative, is before tax and costs, and carries market risk', () => {
    expect(MARKET_RISK_NOTE).toMatch(/not a forecast or a guarantee/i);
    expect(MARKET_RISK_NOTE).toMatch(/can be negative/i);
    expect(MARKET_RISK_NOTE).toMatch(/before tax and costs/i);
    expect(MARKET_RISK_NOTE).toMatch(/subject to market risk/i);
  });

  it('describes the SIP convention the engine really uses: start-of-month instalments, one-twelfth of the yearly rate', () => {
    expect(SIP_CONVENTION_NOTE).toMatch(/start of the month/i);
    expect(SIP_CONVENTION_NOTE).toMatch(/one-twelfth/i);
  });

  it('states the retirement engine assumptions: 25 years, year-end withdrawals, one return, before tax', () => {
    expect(RETIREMENT_NOTE).toMatch(/25 years/);
    expect(RETIREMENT_NOTE).toMatch(/end of each year/i);
    expect(RETIREMENT_NOTE).toMatch(/same return before and after retirement/i);
    expect(RETIREMENT_NOTE).toMatch(/not guarantees/i);
    expect(RETIREMENT_NOTE).toMatch(/before tax/i);
  });

  it('describes the FD figure as an estimate with a fixed rate held to maturity, and does not promise it', () => {
    expect(FD_NOTE).toMatch(/fixed/i);
    expect(FD_NOTE).toMatch(/held to maturity/i);
    expect(FD_NOTE).toMatch(/before tax/i);
  });

  it('says sample figures are illustrations, not guarantees or forecasts', () => {
    expect(SAMPLE_FIGURES_NOTE).toMatch(/illustrations/i);
    expect(SAMPLE_FIGURES_NOTE).toMatch(/not guarantees or forecasts/i);
  });

  it('shows the entered return and the 6% inflation in the goal note, and copes with 0, decimals and missing values', () => {
    expect(goalAssumptionNote(12)).toContain('6% a year');
    expect(goalAssumptionNote(12)).toContain('grow 12% a year');
    expect(goalAssumptionNote(0)).toContain('grow 0% a year');
    expect(goalAssumptionNote(7.5)).toContain('grow 7.5% a year');
    expect(goalAssumptionNote(12, 4)).toContain('rises 4% a year');
    ['', undefined, null, NaN].forEach((v) => {
      const note = goalAssumptionNote(v);
      expect(note, String(v)).toContain('your chosen return');
      expect(note, String(v)).not.toMatch(/NaN|undefined|null/);
    });
  });

  it('no note promises an outcome (after removing the phrases that deny a guarantee)', () => {
    [MARKET_RISK_NOTE, SIP_CONVENTION_NOTE, RETIREMENT_NOTE, FD_NOTE, SAMPLE_FIGURES_NOTE, RATE_LIMIT_NOTE, goalAssumptionNote(12)].forEach((text) => {
      expect(promises(text), text).toBe(false);
    });
  });

  it('the promise check itself catches the wording this phase removed', () => {
    expect(promises('Required monthly investment to guarantee a goal')).toBe(true);
    expect(promises('today ensures you fulfill it without financial stress')).toBe(true);
    expect(promises('Guaranteed maturity return')).toBe(true);
    expect(promises('Returns are not guaranteed.')).toBe(false);
    expect(promises('This is not a forecast or a guarantee.')).toBe(false);
  });

  it('the rate-limit note matches what the Lumpsum, FD and Goal engines really do: below 0.1% is treated as 0.1%, above 30% as 30%', () => {
    expect(RATE_LIMIT_NOTE).toBe('Rates below 0.1% or above 30% a year are treated as 0.1% or 30%.');
    [0, -5, 0.05].forEach((low) => {
      expect(calculateLumpsum(100000, low, 10).futureValue, `lumpsum ${low}`).toBe(calculateLumpsum(100000, 0.1, 10).futureValue);
      expect(calculateFD(200000, low, 5).maturityAmount, `fd ${low}`).toBe(calculateFD(200000, 0.1, 5).maturityAmount);
      expect(calculateGoal('g', 1e6, 10, low, 0).requiredMonthlySIP, `goal ${low}`).toBe(calculateGoal('g', 1e6, 10, 0.1, 0).requiredMonthlySIP);
    });
    [30, 45, 100].forEach((high) => {
      expect(calculateLumpsum(100000, high, 10).futureValue, `lumpsum ${high}`).toBe(calculateLumpsum(100000, 30, 10).futureValue);
      expect(calculateFD(200000, high, 5).maturityAmount, `fd ${high}`).toBe(calculateFD(200000, 30, 5).maturityAmount);
      expect(calculateGoal('g', 1e6, 10, high, 0).requiredMonthlySIP, `goal ${high}`).toBe(calculateGoal('g', 1e6, 10, 30, 0).requiredMonthlySIP);
    });
  });

  it('the retirement note is true: returns above 30% are treated as 30%, and a 0% return is kept at 0%', () => {
    expect(RETIREMENT_NOTE).toContain('Returns above 30% a year are treated as 30%.');
    expect(calculateRetirement(30, 60, 50000, 6, 45, 0).requiredCorpus).toBe(calculateRetirement(30, 60, 50000, 6, 30, 0).requiredCorpus);
    expect(calculateRetirement(30, 60, 50000, 6, 0, 0).requiredCorpus).not.toBe(calculateRetirement(30, 60, 50000, 6, 0.1, 0).requiredCorpus);
  });

  it('keeps each note short enough to read on a phone', () => {
    [MARKET_RISK_NOTE, SIP_CONVENTION_NOTE, RETIREMENT_NOTE, FD_NOTE, RATE_LIMIT_NOTE, goalAssumptionNote(12)].forEach((text) => {
      expect(text.length, text).toBeLessThan(320);
    });
  });
});
