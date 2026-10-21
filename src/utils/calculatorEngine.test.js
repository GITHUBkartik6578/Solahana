import { describe, it, expect } from 'vitest';
import {
  calculateSIP,
  calculateEMI,
  calculateGoal,
  calculateLumpsum,
  calculateFD,
  calculateRetirement,
  calculateInflation,
  formatINR,
} from './calculatorEngine';

/**
 * Test labels used in this file
 *
 *   [intended]    Mathematically unambiguous expected behaviour (standard formulas and identities). The expected numbers were
 *                 worked out independently of the engine (Decimal arithmetic, closed forms or explicit sums), so a failure
 *                 means the engine is wrong.
 *
 *   [convention]  Results that depend on the engine's CURRENT financial assumptions. They are correct for those assumptions,
 *                 which are listed below. They are NOT confirmed product requirements and are not an approval to keep or to
 *                 standardise these conventions. If a convention is changed on purpose, update these tests in the same change.
 *
 *   [current]     What the engine does today for out-of-range or invalid input, and for extreme rates. It is NOT a statement
 *                 that the behaviour is right. If a rule is changed on purpose, update these tests in the same change.
 *
 * Current engine assumptions (documentation only, not a decision):
 *   SIP         instalments are made at the START of each month; the yearly rate is divided by 12 (nominal monthly rate).
 *   Goal        the monthly SIP grows at (yearly rate / 12) per month, while existing savings and the lumpsum grow at the
 *               yearly rate once a year. The same stated rate therefore is not the same effective yearly yield for the two.
 *   Retirement  25 years of withdrawals, taken once a year at the END of each year; the first withdrawal is the spending at
 *               the retirement date (no extra inflation step before it); the same return is assumed before and after
 *               retirement; the monthly SIP to reach the corpus is treated like the SIP above (start of month, rate / 12).
 *
 * Rupee results are rounded by the engine, so derived values are compared within 1 rupee unless a test says otherwise.
 */
const near = (actual, expected, tol = 1) => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tol);

/* ------------------------------------------------------------------------------------------------------------------ */
/* [intended] standard formulas and identities                                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

describe('[intended] known values (standard formulas, independently calculated)', () => {
  it('EMI, 75 lakh at 8.5% for 20 years', () => {
    const r = calculateEMI(7500000, 8.5, 20);
    near(r.monthlyEMI, 65087);
    near(r.totalPayment, 15620818);
    near(r.totalInterest, 8120818);
  });
  it('EMI, 50 lakh at 9% for 25 years', () => {
    const r = calculateEMI(5000000, 9, 25);
    near(r.monthlyEMI, 41960);
    near(r.totalPayment, 12587945);
  });
  it('Lumpsum, 10 lakh at 12% for 10 years', () => near(calculateLumpsum(1000000, 12, 10).futureValue, 3105848));
  it('FD, 10 lakh at 7% for 5 years: quarterly and monthly compounding of the stated rate', () => {
    near(calculateFD(1000000, 7, 5, 'Quarterly').maturityAmount, 1414778);
    near(calculateFD(1000000, 7, 5, 'Monthly').maturityAmount, 1417625);
  });
  it('FD, 10 lakh at 6.5% for half a year, quarterly', () => near(calculateFD(1000000, 6.5, 0.5, 'Quarterly').maturityAmount, 1032764));
  it('Inflation, 1 lakh at 6% for 20 years', () => near(calculateInflation(100000, 6, 20).futureCost, 320714));
});

describe('[intended] zero-rate cases that do not depend on a convention', () => {
  it('SIP at 0% is just the money put in', () => {
    const r = calculateSIP(50000, 0, 10);
    expect(r.futureValue).toBe(6000000);
    expect(r.totalInvested).toBe(6000000);
  });
  it('EMI at 0% is principal divided by the number of months, with no interest', () => {
    const r = calculateEMI(1200000, 0, 10);
    expect(r.monthlyEMI).toBe(10000);
    expect(r.totalInterest).toBe(0);
  });
  it('Inflation at 0% leaves the cost unchanged', () => expect(calculateInflation(100000, 0, 20).futureCost).toBe(100000));
  it('Goal keeps a deliberately typed 0% inflation (does not fall back to the 6% default)', () => {
    expect(calculateGoal('Goal', 10000000, 10, 12, 0, 0).futureTargetValue).toBe(10000000);
  });
});

describe('[intended] results are consistent with themselves', () => {
  it('EMI schedule has one row per month, ends at zero balance and repays the principal', () => {
    const r = calculateEMI(7500000, 8.5, 20);
    expect(r.schedule).toHaveLength(240);
    expect(r.schedule.at(-1).balance).toBe(0);
    near(r.schedule.reduce((sum, row) => sum + row.principalPaid, 0), 7500000, 120); // each of the 240 months is rounded to a whole rupee: at most 240 x 0.5
    near(r.principalAmount + r.totalInterest, r.totalPayment);
  });
  it('SIP yearly table ends at the total and never falls, and invested plus returns equals the total', () => {
    const r = calculateSIP(50000, 12, 15, 10);
    expect(r.yearlyData).toHaveLength(15);
    expect(r.yearlyData.at(-1).futureValue).toBe(r.futureValue);
    r.yearlyData.forEach((row, i, rows) => i === 0 || expect(row.futureValue).toBeGreaterThanOrEqual(rows[i - 1].futureValue));
    near(r.totalInvested + r.estimatedReturns, r.futureValue);
  });
  it('FD pays more the more often it compounds', () => {
    const [a, h, q, m] = ['Annually', 'Half-Yearly', 'Quarterly', 'Monthly'].map((f) => calculateFD(1000000, 7, 5, f).maturityAmount);
    expect(a).toBeLessThan(h);
    expect(h).toBeLessThan(q);
    expect(q).toBeLessThan(m);
  });
  it('Lumpsum gain is the future value minus the principal and the table ends at the future value', () => {
    const r = calculateLumpsum(1000000, 12, 10);
    expect(r.totalGain).toBe(r.futureValue - 1000000);
    expect(r.yearlyData.at(-1).totalValue).toBe(r.futureValue);
  });
  it('Goal: savings that already cover the target need no SIP', () => {
    expect(calculateGoal('Goal', 1000000, 10, 12, 10000000).requiredMonthlySIP).toBe(0);
  });
  it('Inflation: purchasing power loss matches 100 - 100/(1+i)^n', () => {
    expect(Math.abs(calculateInflation(100000, 6, 20).purchasingPowerLossPct - (100 - 100 / 1.06 ** 20))).toBeLessThan(0.06);
  });
  it('Retirement: more spending needs a bigger corpus, and savings that cover the corpus need no SIP', () => {
    expect(calculateRetirement(30, 60, 60000, 6, 12).requiredCorpus).toBeGreaterThan(calculateRetirement(30, 60, 50000, 6, 12).requiredCorpus);
    expect(calculateRetirement(30, 60, 1000, 6, 12, 1e9).requiredMonthlySIP).toBe(0);
  });
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* [convention] results that depend on the engine's current financial assumptions                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

describe('[convention] SIP: instalment at the start of each month, yearly rate / 12', () => {
  it('flat 50,000/month at 12% for 15 years', () => {
    const r = calculateSIP(50000, 12, 15);
    near(r.futureValue, 25228800);
    near(r.totalInvested, 9000000);
  });
  it('with a 10% yearly step-up (the step-up applies once a year, from the second year: invested = 12 x SIP x ((1.1^15 - 1) / 0.1))', () => {
    const r = calculateSIP(50000, 12, 15, 10);
    near(r.futureValue, 43419247);
    near(r.totalInvested, 19063489);
    expect(r.totalInvested).toBe(Math.round(12 * 50000 * ((1.1 ** 15 - 1) / 0.1)));
  });
  it('at a 30% return', () => near(calculateSIP(10000, 30, 10).futureValue, 7526841));
  it('timing: 1,000/month for a year at 12% gives 12,809 (start of month); an end-of-month convention would give 12,683', () => {
    near(calculateSIP(1000, 12, 1).futureValue, 12809);
  });
});

describe('[convention] Goal: SIP grows monthly (rate / 12), savings and lumpsum grow once a year at the stated rate', () => {
  it('1 crore in 20 years at 12%, 6% inflation, no savings', () => {
    const r = calculateGoal('Goal', 10000000, 20, 12);
    near(r.futureTargetValue, 32071355);
    near(r.requiredMonthlySIP, 32099);
    near(r.requiredLumpsumToday, 3324734);
  });
  it('50 lakh in 10 years at 10% with 5 lakh already saved', () => {
    const r = calculateGoal('Goal', 5000000, 10, 10, 500000);
    near(r.futureTargetValue, 8954238);
    near(r.futureSavings, 1296871);
    near(r.netTargetNeeded, 7657367);
    near(r.requiredMonthlySIP, 37072);
    near(r.requiredLumpsumToday, 2952247);
  });
  it('the monthly SIP and the lumpsum each reach the net target, each under its own compounding', () => {
    const r = calculateGoal('Goal', 10000000, 20, 12);
    const rm = 0.12 / 12;
    expect(Math.abs((r.requiredMonthlySIP * (((1 + rm) ** 240 - 1) / rm) * (1 + rm)) / r.netTargetNeeded - 1)).toBeLessThan(0.001);
    expect(Math.abs((r.requiredLumpsumToday * 1.12 ** 20) / r.netTargetNeeded - 1)).toBeLessThan(0.001);
  });
  it('the lumpsum is NOT calculated at the SIP\'s monthly rate: 12% a year here is 3,324,734, while 1% a month would give about 2,944,338', () => {
    const r = calculateGoal('Goal', 10000000, 20, 12);
    near(r.requiredLumpsumToday, 3324734);
    expect(r.requiredLumpsumToday).toBeGreaterThan(Math.round(r.netTargetNeeded / 1.01 ** 240));
  });
});

describe('[convention] Retirement: 25 years of withdrawals, once a year at year-end, same return before and after retirement', () => {
  it('age 30 to 60, 50,000/month today, 6% inflation, 12% return, no savings', () => {
    const r = calculateRetirement(30, 60, 50000, 6, 12, 0);
    near(r.futureMonthlyExpense, 287175);
    near(r.requiredCorpus, 45510864);
    near(r.requiredMonthlySIP, 12893);
  });
  it('with 10 lakh of existing savings, which grow at the same 12% as the corpus is assumed to earn', () => {
    const r = calculateRetirement(30, 60, 50000, 6, 12, 1000000);
    near(r.futureSavingsValue, 29959922);
    near(r.netCorpusNeeded, 15550942);
    near(r.requiredMonthlySIP, 4405);
  });
  it('real rate 0 (inflation equals the return): corpus is 25 years of the retirement-date spending', () => {
    const r = calculateRetirement(30, 60, 50000, 8, 8, 0);
    near(r.requiredCorpus, 150939853);
    near(r.requiredMonthlySIP, 100607);
    near(r.requiredCorpus, 50000 * 1.08 ** 30 * 12 * 25);
  });
  it('0% return and 0% inflation: exactly 25 years of today\'s spending, no extra inflation step before the first withdrawal', () => {
    const r = calculateRetirement(30, 60, 10000, 0, 0, 0);
    expect(r.requiredCorpus).toBe(10000 * 12 * 25);
    expect(r.requiredMonthlySIP).toBe(8333); // 3,000,000 over 360 months
  });
  it('0% return with inflation: equal instalments', () => {
    const r = calculateRetirement(35, 60, 40000, 6, 0, 0);
    near(r.requiredCorpus, 119807845);
    near(r.requiredMonthlySIP, 399359);
  });
  it('saving the required SIP reaches the corpus (SIP treated as start of month, rate / 12)', () => {
    const r = calculateRetirement(30, 60, 50000, 6, 12, 0);
    expect(Math.abs(r.projectionData.at(-1).accumulated / r.requiredCorpus - 1)).toBeLessThan(0.005);
  });
});

/* ------------------------------------------------------------------------------------------------------------------ */
/* [current] limits, invalid input and extreme rates                                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

describe('[current] input limits and invalid input (documents what happens today; not an approval of each rule)', () => {
  it('SIP: years below 1 become 1, above 50 become 50', () => {
    expect(calculateSIP(1000, 12, 0).yearlyData).toHaveLength(1);
    expect(calculateSIP(1000, 12, -3).yearlyData).toHaveLength(1);
    expect(calculateSIP(1000, 12, 100).yearlyData).toHaveLength(50);
  });
  it('SIP: step-up is kept between 0% and 100%; a negative rate is treated as 0%', () => {
    expect(calculateSIP(1000, 12, 2, 150).futureValue).toBe(calculateSIP(1000, 12, 2, 100).futureValue);
    expect(calculateSIP(1000, 12, 2, -5).futureValue).toBe(calculateSIP(1000, 12, 2, 0).futureValue);
    expect(calculateSIP(1000, -5, 10).futureValue).toBe(calculateSIP(1000, 0, 10).futureValue);
  });
  it('negative, NaN or non-numeric amounts become 0', () => {
    expect(calculateSIP(-5000, 12, 10).futureValue).toBe(0);
    expect(calculateSIP(NaN, 12, 10).futureValue).toBe(0);
    expect(calculateSIP('abc', 12, 10).futureValue).toBe(0);
    expect(calculateEMI(-1000000, 9, 10).monthlyEMI).toBe(0);
    expect(calculateLumpsum(-5, 12, 10).futureValue).toBe(0);
  });
  it('SIP: a numeric string is accepted as a number', () => {
    expect(calculateSIP('50000', 12, 10).futureValue).toBe(calculateSIP(50000, 12, 10).futureValue);
  });
  it('EMI: rate above 30% is treated as 30%; tenure is kept between 1 and 40 years; an empty rate means 0%', () => {
    expect(calculateEMI(1000000, 31, 10).monthlyEMI).toBe(calculateEMI(1000000, 30, 10).monthlyEMI);
    expect(calculateEMI(1000000, 9, 0).monthlyEMI).toBe(calculateEMI(1000000, 9, 1).monthlyEMI);
    expect(calculateEMI(1000000, 9, 100).monthlyEMI).toBe(calculateEMI(1000000, 9, 40).monthlyEMI);
    expect(calculateEMI(1200000, '', 10).monthlyEMI).toBe(10000);
  });
  it('Goal: the yearly return is kept between 0.1% and 30% (0 -> 0.1, 31 -> 30); an empty return means the 12% default', () => {
    const sip = (ret) => calculateGoal('Goal', 1e7, 20, ret, 500000);
    expect(sip(0)).toEqual(sip(0.1));
    expect(sip(31)).toEqual(sip(30));
    expect(sip('')).toEqual(sip(12));
  });
  it('Lumpsum: a 0% return is treated as 0.1% (so 10 lakh shows a small gain); above 30% is treated as 30%', () => {
    near(calculateLumpsum(1000000, 0, 10).futureValue, 1010045);
    expect(calculateLumpsum(1000000, 31, 10).futureValue).toBe(calculateLumpsum(1000000, 30, 10).futureValue);
  });
  it('FD: an unknown frequency means quarterly; a duration below half a year means half a year', () => {
    expect(calculateFD(1000000, 7, 5, 'Weekly').maturityAmount).toBe(calculateFD(1000000, 7, 5, 'Quarterly').maturityAmount);
    expect(calculateFD(1000000, 7, 0.1).maturityAmount).toBe(calculateFD(1000000, 7, 0.5).maturityAmount);
  });
  it('Inflation: a rate above 30% is treated as 30%', () => {
    expect(calculateInflation(100000, 31, 10).futureCost).toBe(calculateInflation(100000, 30, 10).futureCost);
  });
  it('Retirement: ages and rates are limited (17 -> 18, retire <= current -> one year, inflation <= 25%, return <= 30%)', () => {
    expect(calculateRetirement(17, 60, 50000, 6, 12).yearsToRetire).toBe(42);
    expect(calculateRetirement(30, 30, 50000, 6, 12).yearsToRetire).toBe(1);
    expect(calculateRetirement(30, 60, 50000, 99, 99).requiredCorpus).toBe(calculateRetirement(30, 60, 50000, 25, 30).requiredCorpus);
  });
});

describe('[current] extreme SIP rates (no upper limit today; the intended rule is undecided)', () => {
  it('SIP has no cap on the yearly rate, so very large rates give astronomically large or infinite results', () => {
    expect(calculateSIP(50000, 100, 50).futureValue).toBeGreaterThan(1e26);
    expect(Number.isFinite(calculateSIP(50000, 1000, 50).futureValue)).toBe(true);
    expect(Number.isFinite(calculateSIP(50000, 1000000, 50).futureValue)).toBe(false);
  });
  it('formatINR shows an infinite amount as an infinity symbol or word (the exact text depends on the ICU version)', () => {
    expect(formatINR(Infinity)).toMatch(/∞|Infinity/);
  });
  it.todo('SIP: decide the intended rule for a yearly rate above 30% (clamp like the other calculators, validate in the form, or leave as is)');
  it.todo('Goal, Lumpsum and FD: decide whether a typed 0% should be calculated as 0% instead of 0.1%');
});
