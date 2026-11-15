import { describe, it, expect } from 'vitest';
import { calculateGoal } from './calculatorEngine';

/**
 * Goal Planner timeline: the SIP line must show the SAME plan that the headline numbers describe.
 *
 * Convention (the engine's CURRENT assumption, not a confirmed product requirement):
 *   - existing savings compound once a year at the stated annual return (this is `futureSavings`);
 *   - each monthly SIP instalment is made at the start of the month and compounds monthly at (stated return / 12).
 * `requiredMonthlySIP` is solved for (futureTargetValue - futureSavings) under that convention, so the SIP line has to end
 * at futureTargetValue when a SIP is needed, and at futureSavings when no SIP is needed.
 *
 * Expected values were calculated independently of the engine (60-digit Decimal arithmetic, explicit month-by-month loop
 * cross-checked with the closed form), then rounded to whole rupees.
 *
 * Tolerances
 *   - Timeline values are whole rupees (Math.round of a double). The double arithmetic over at most 600 monthly steps is
 *     within about 1e-6 rupee of the exact value, so each value is compared within 1 rupee: that only absorbs a .5 rounding
 *     boundary on either side.
 *   - The target line is compared EXACTLY: each value is Math.round(target x year / years) of a number that no expected value
 *     lies within 0.01 of a .5 boundary of (checked against 60-digit Decimal), far more than the double error of about 1e-6.
 *   - The chart ends within 1 rupee of the headline ONLY because the projection uses the unrounded internal monthly SIP.
 *     The SIP shown to the user is rounded to a whole rupee, so rebuilding the target from the displayed SIP can be off by up
 *     to 0.5 x the annuity-due factor of the instalments; that check uses exactly that bound.
 */
const near = (actual, expected, tol = 1) => expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tol);
const annuityDue = (monthlyRate, months) => ((1 + monthlyRate) ** months - 1) / monthlyRate * (1 + monthlyRate);
const sipLine = (r) => r.timelineData.map((row) => row.sipProgress);

// Independent expected SIP-line values (whole rupees, one per year)
const A_LINE = [1407495, 1865851, 2381422, 2961352, 3613681, 4347453, 5172843, 6101295, 7145689, 8320510, 9642056, 11128664, 12800962, 14682158, 16798363, 19178954, 21856980, 24869626, 28258728, 32071355];
const B_LINE = [411163, 874471, 1396539, 1984818, 2647706, 3394664, 4236355, 5184794, 6253518, 7457784, 8814780, 10343878, 12066903, 14008451, 16196236, 18661487, 21439394, 24569609, 28096813, 32071355];
const C_LINE = [630196, 1002024, 1420734, 1892238, 2423196, 3021105, 3694412, 4452626, 5306457, 6267967];
const D_LINE = [967535, 1483791, 2053847, 2683309, 3378372, 4145871, 4993358, 5929170, 6962515, 8103559, 9363531, 10754826, 12291136, 13987578, 15860846];
const E_LINE = [11200000, 12544000, 14049280, 15735194, 17623417, 19738227, 22106814, 24759632, 27730788, 31058482];

// Independent expected lumpsum line: existing savings plus the lumpsum needed today, growing once a year at the stated return.
// (It does not depend on the existing savings: savings plus the lumpsum needed always grow to the same target, so A and B are equal.)
const A_LUMP = [3723702, 4170546, 4671011, 5231533, 5859317, 6562435, 7349927, 8231918, 9219748, 10326118, 11565252, 12953082, 14507452, 16248346, 18198148, 20381926, 22827757, 25567088, 28635138, 32071355];
const B_LUMP = A_LUMP;
const C_LUMP = [2260292, 2531527, 2835310, 3175547, 3556613, 3983406, 4461415, 4996785, 5596399, 6267967];
const D_LUMP = [4176656, 4594322, 5053754, 5559130, 6115043, 6726547, 7399202, 8139122, 8953034, 9848337, 10833171, 11916488, 13108137, 14418951, 15860846];
const E_LUMP = E_LINE; // no lumpsum is needed, so the line is just the savings growing once a year

// Independent expected target line: the inflation-adjusted target spread evenly over the years (target x year / years).
const A_TARGET = [1603568, 3207135, 4810703, 6414271, 8017839, 9621406, 11224974, 12828542, 14432110, 16035677, 17639245, 19242813, 20846381, 22449948, 24053516, 25657084, 27260652, 28864219, 30467787, 32071355];
const B_TARGET = A_TARGET;
const C_TARGET = [626797, 1253593, 1880390, 2507187, 3133983, 3760780, 4387577, 5014374, 5641170, 6267967];
const D_TARGET = [1057390, 2114779, 3172169, 4229559, 5286949, 6344338, 7401728, 8459118, 9516507, 10573897, 11631287, 12688676, 13746066, 14803456, 15860846];
const E_TARGET = [179085, 358170, 537254, 716339, 895424, 1074509, 1253593, 1432678, 1611763, 1790848];

const expectField = (r, field, expected) => {
  expect(r.timelineData).toHaveLength(expected.length);
  expected.forEach((value, i) => near(r.timelineData[i][field], value));
};
const expectLine = (r, expected) => expectField(r, 'sipProgress', expected);
const expectOtherLines = (r, lump, target) => {
  expectField(r, 'lumpsumProgress', lump);
  expect(r.timelineData).toHaveLength(target.length);
  expect(r.timelineData.map((row) => row.targetLine)).toEqual(target); // exact, see the tolerance note above
};
const expectLabels = (r, years) => {
  expect(r.timelineData.map((row) => row.year)).toEqual(Array.from({ length: years }, (_, i) => `Yr ${i + 1}`));
};

describe('[convention] Goal timeline: 1 crore, 20 years, 12%, 6% inflation, 10 lakh existing savings', () => {
  const r = calculateGoal('Goal', 10000000, 20, 12, 1000000);

  it('headline, required SIP, lumpsum and saved values stay exactly as they are', () => {
    expect(r.futureTargetValue).toBe(32071355);
    expect(r.futureSavings).toBe(9646293);
    expect(r.netTargetNeeded).toBe(22425062);
    expect(r.requiredMonthlySIP).toBe(22444);
    expect(r.requiredLumpsumToday).toBe(2324734);
  });
  it('the SIP line follows savings-once-a-year plus monthly SIP, every year', () => expectLine(r, A_LINE));
  it('the SIP line ends at the headline target, like the lumpsum line and the target line', () => {
    const last = r.timelineData.at(-1);
    near(last.sipProgress, r.futureTargetValue);
    near(last.lumpsumProgress, r.futureTargetValue);
    near(last.targetLine, r.futureTargetValue);
  });
  it('the displayed (whole-rupee) SIP rebuilds the target only within half the annuity factor', () => {
    const factor = annuityDue(0.01, 240);
    const rebuilt = 1000000 * 1.12 ** 20 + r.requiredMonthlySIP * factor;
    expect(Math.abs(rebuilt - r.futureTargetValue)).toBeLessThanOrEqual(0.5 * factor + 1);
  });
  it('the SIP line never falls', () => {
    sipLine(r).forEach((v, i, all) => i === 0 || expect(v).toBeGreaterThanOrEqual(all[i - 1]));
  });
  it('the lumpsum line and the target line match the independent values in every year', () => expectOtherLines(r, A_LUMP, A_TARGET));
  it('the year labels run from Yr 1 to Yr 20', () => expectLabels(r, 20));
});

describe('[convention] Goal timeline: same goal with zero existing savings (control, unchanged by the fix)', () => {
  const r = calculateGoal('Goal', 10000000, 20, 12, 0);

  it('headline, SIP and lumpsum are unchanged', () => {
    expect(r.futureTargetValue).toBe(32071355);
    expect(r.requiredMonthlySIP).toBe(32099);
    expect(r.requiredLumpsumToday).toBe(3324734);
  });
  it('the SIP line is the plain monthly SIP series and ends at the headline', () => {
    expectLine(r, B_LINE);
    near(r.timelineData.at(-1).sipProgress, r.futureTargetValue);
  });
  it('the lumpsum line and the target line match the independent values in every year', () => expectOtherLines(r, B_LUMP, B_TARGET));
  it('the year labels run from Yr 1 to Yr 20', () => expectLabels(r, 20));
});

describe('[convention] Goal timeline: Goal Planner default inputs (35 lakh, 10 years, 12%, 3 lakh existing savings)', () => {
  const r = calculateGoal('Child Higher Education', 3500000, 10, 12, 300000);

  it('headline, required SIP and lumpsum are unchanged', () => {
    expect(r.futureTargetValue).toBe(6267967);
    expect(r.requiredMonthlySIP).toBe(22967);
    expect(r.requiredLumpsumToday).toBe(1718118);
  });
  it('the SIP line follows the independent values and ends at the headline', () => {
    expectLine(r, C_LINE);
    near(r.timelineData.at(-1).sipProgress, r.futureTargetValue);
  });
  it('the lumpsum line and the target line match the independent values in every year', () => expectOtherLines(r, C_LUMP, C_TARGET));
  it('the year labels run from Yr 1 to Yr 10', () => expectLabels(r, 10));
});

describe('[convention] Goal timeline: further case (50 lakh, 15 years, 10%, 8% inflation, 5 lakh existing savings)', () => {
  const r = calculateGoal('Goal', 5000000, 15, 10, 500000, 8);

  it('headline, required SIP and lumpsum are unchanged', () => {
    expect(r.futureTargetValue).toBe(15860846);
    expect(r.requiredMonthlySIP).toBe(32954);
    expect(r.requiredLumpsumToday).toBe(3296960);
  });
  it('the SIP line follows the independent values and ends at the headline', () => {
    expectLine(r, D_LINE);
    near(r.timelineData.at(-1).sipProgress, r.futureTargetValue);
  });
  it('the lumpsum line and the target line match the independent values in every year', () => expectOtherLines(r, D_LUMP, D_TARGET));
  it('the year labels run from Yr 1 to Yr 15', () => expectLabels(r, 15));
});

describe('[convention] Goal timeline: existing savings already exceed the amount needed', () => {
  const r = calculateGoal('Goal', 1000000, 10, 12, 10000000);

  it('no SIP and no lumpsum are needed', () => {
    expect(r.futureTargetValue).toBe(1790848);
    expect(r.futureSavings).toBe(31058482);
    expect(r.netTargetNeeded).toBe(0);
    expect(r.requiredMonthlySIP).toBe(0);
    expect(r.requiredLumpsumToday).toBe(0);
  });
  it('the SIP line is just the savings growing once a year, so it ends at futureSavings (not at the headline)', () => {
    expectLine(r, E_LINE);
    near(r.timelineData.at(-1).sipProgress, r.futureSavings);
    expect(r.timelineData.at(-1).sipProgress).toBeGreaterThan(r.futureTargetValue);
  });
  it('the lumpsum line and the target line match the independent values in every year', () => expectOtherLines(r, E_LUMP, E_TARGET));
  it('the year labels run from Yr 1 to Yr 10', () => expectLabels(r, 10));
});
