import { describe, expect, it } from 'vitest';
import { CATEGORY_IDS, CATEGORY_MAX, LIMITS, scoreHealthCheck, validateInputs } from './financialHealthCheck.js';
import {
  DISPLAY_CEILINGS,
  INSIGHTS_VERSION,
  InsightsInputError,
  MAX_AMOUNT_PAISE,
  SEVERITY_RATIONALE,
  SEVERITY_TABLE,
  TARGETS,
  buildAlerts,
  buildInsights,
  computeFigures,
  divCeil,
  divFloor,
  formatMonthsTenths,
  formatMultipleTenths,
  formatPercentTenths,
  formatRupeesCeil,
  formatRupeesExact,
  formatRupeesFloor,
  informationalRunway,
  monthlySetAside12,
  rankFindings,
  scoreReasons,
  selectNextSteps,
  severityFor,
  severityForCashFlow,
  tryBuildInsights,
} from './healthCheckInsights.js';
import * as engineNamespace from './healthCheckInsights.js';

const HEALTH = LIMITS.healthThresholdRupees * 100;
const MAX_PAISE = LIMITS.balanceMaxRupees * 100;
const MONTHLY_MAX = LIMITS.monthlyMaxRupees * 100;
const rupees = (n) => n * 100;
const within = (n) => n >= 0 && n <= MAX_PAISE;

const base = (overrides = {}) => ({
  income: rupees(80_000), expenses: rupees(35_000), emi: rupees(15_000), savings: rupees(300_000),
  termCover: rupees(5_000_000), healthCover: rupees(500_000), investments: rupees(10_000), overlap: 'yes', business: 'na',
  ...overrides,
});

const POINTS_OF_TIER = {
  emi: { full: 20, partial: 10, zero: 0 },
  term: { full: 20, partial: 10, zero: 0 },
  emergency: { full: 20, partial: 10, zero: 0 },
  investment: { full: 15, partial: 8, zero: 0 },
  health: { full: 15, zero: 0 },
};

/** The severity of every category state, written out here (not read from the engine). Full points and "not applicable" have none. */
const EXPECTED_SEVERITY = {
  emi: { 0: 'high', 10: 'medium' },
  emergency: { 0: 'high', 10: 'medium' },
  term: { 0: 'medium', 10: 'low' },
  health: { 0: 'medium' },
  investment: { 0: 'low', 8: 'low' },
  overlap: { 0: 'low' },
  shielding: { 0: 'low' },
};

/** Differences between the tiers computed here and the points the existing scoring function awards (empty = identical). */
function tierDifferences(values) {
  const f = computeFigures(values);
  const { points } = scoreHealthCheck(values);
  const out = [];
  if (POINTS_OF_TIER.emi[f.emi.tier] !== points.emi) out.push('emi');
  if (POINTS_OF_TIER.term[f.lifeBenchmark.tier] !== points.term) out.push('term');
  if (POINTS_OF_TIER.investment[f.investmentRate.tier] !== points.investment) out.push('investment');
  if (POINTS_OF_TIER.health[f.healthReference.tier] !== points.health) out.push('health');
  if (f.runway.applies ? POINTS_OF_TIER.emergency[f.runway.tier] !== points.emergency : points.emergency !== null) out.push('emergency');
  return out;
}

function* leaves(value, path = '') {
  if (value && typeof value === 'object') for (const [key, inner] of Object.entries(value)) yield* leaves(inner, `${path}.${key}`);
  else yield [path, value];
}
function* keysOf(value) {
  if (value && typeof value === 'object') for (const [key, inner] of Object.entries(value)) { yield key; yield* keysOf(inner); }
}
const isDeepFrozen = (value) => !value || typeof value !== 'object' || (Object.isFrozen(value) && Object.values(value).every(isDeepFrozen));

/** The same incomes the audit used: Rs 80,000 with every boundary, plus tiny and awkward incomes (down to one paisa). */
function* matrixCases() {
  const income = 8_000_000;
  const invPartial = divCeil(income * 10, 100);
  const invFull = divCeil(income * 20, 100);
  const exSavings = [];
  for (const expenses of [0, 3_500_000]) for (const savings of expenses === 0 ? [0, 5_000_000] : [0, 3 * expenses - 1, 3 * expenses, 6 * expenses - 1, 6 * expenses]) exSavings.push([expenses, savings]);
  for (const emi of [0, divFloor(income * 30, 100), divFloor(income * 30, 100) + 1, divFloor(income * 45, 100), divFloor(income * 45, 100) + 1, income, 2 * income])
    for (const termCover of [0, 60 * income - 1, 60 * income, 120 * income - 1, 120 * income])
      for (const [expenses, savings] of exSavings)
        for (const investments of [0, invPartial - 1, invPartial, invFull - 1, invFull, income])
          for (const healthCover of [0, HEALTH - 1, HEALTH])
            for (const overlap of ['yes', 'no'])
              for (const business of ['yes', 'no', 'na']) yield { income, expenses, emi, savings, termCover, healthCover, investments, overlap, business };
  for (const small of [1, 2, 3, 4, 5, 6, 7, 9, 10, 99, 100, 12_345, MONTHLY_MAX]) {
    const eFull = divFloor(small * 30, 100);
    const ePartial = divFloor(small * 45, 100);
    const iPartial = divCeil(small * 10, 100);
    const iFull = divCeil(small * 20, 100);
    for (const emi of [0, eFull, eFull + 1, ePartial, ePartial + 1, small, 2 * small])
      for (const termCover of [0, 60 * small - 1, 60 * small, 120 * small - 1, 120 * small].filter(within))
        for (const expenses of [0, 1, 7])
          for (const savings of expenses === 0 ? [0] : [0, 3 * expenses - 1, 3 * expenses, 6 * expenses - 1, 6 * expenses])
            for (const investments of [0, Math.max(0, iPartial - 1), iPartial, Math.max(0, iFull - 1), iFull])
              for (const healthCover of [0, HEALTH])
                yield { income: small, expenses, emi, savings, termCover, healthCover, investments, overlap: 'no', business: 'na' };
  }
}

/** What the alerts must be, written from the raw amounts alone (not from points and not from the engine). */
function expectedAlertIds(v) {
  const ids = [];
  if (v.expenses > 0 && v.savings < 3 * v.expenses) ids.push('A1');
  if (v.emi * 100 > v.income * 45) ids.push('A2');
  if (v.expenses + v.emi + v.investments > v.income && !(v.emi > v.income)) ids.push('A3');
  if (v.termCover < 60 * v.income) ids.push('R1');
  if (v.healthCover < HEALTH) ids.push('R2');
  return ids;
}

function xorshift(seed) {
  let s = seed;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return s >>> 0; };
}

describe('the worked example (Rs 80,000 income): score 66', () => {
  const checked = validateInputs({ income: '80000', expenses: '35000', emi: '15000', savings: '300000', termCover: '5000000', healthCover: '500000', investments: '10000', overlap: 'yes', business: 'na' });
  const insights = buildInsights(checked.values);

  it('is accepted by the existing validation and scored 66 by the existing function', () => {
    expect(checked.ok).toBe(true);
    const result = scoreHealthCheck(checked.values);
    expect(result).toMatchObject({ earned: 63, applicable: 95, score: 66, band: 'good' });
    expect(insights.reasons).toMatchObject({ earned: 63, applicable: 95, score: 66, scaled: true, notApplicable: ['shielding'] });
  });
  it('shows the expected figures, in the expected text', () => {
    const f = insights.figures;
    expect(formatPercentTenths(f.emi.pctTenths)).toBe('18.8%');
    expect(formatMultipleTenths(f.lifeBenchmark.multipleTenths)).toBe('5.2×');
    expect(formatMonthsTenths(f.runway.monthsTenths)).toBe('8.5');
    expect(formatPercentTenths(f.investmentRate.pctTenths)).toBe('12.5%');
    expect(f.healthReference.gapPaise).toBe(rupees(500_000));
    expect(f.cashFlow).toMatchObject({ committedPaise: rupees(60_000), unallocatedPaise: rupees(20_000), exceedsIncome: false });
    expect(insights.info.withEmiRunway).toEqual({ applies: true, monthsTenths: 60 });
  });
  it('finds one review alert, ranks the findings and orders the steps', () => {
    expect(insights.alerts.map((a) => a.id)).toEqual(['R2']);
    expect(insights.findings.strengths).toEqual(['emi', 'emergency', 'overlap']);
    expect(insights.findings.improvements).toEqual(['health', 'term', 'investment']);
    expect(insights.steps.map((s) => [s.id, s.horizon])).toEqual([['HEALTH-0', 'd90'], ['TERM-1', 'm12'], ['INV-1', 'm12']]);
    expect(insights.severity).toEqual({ emi: null, term: 'low', emergency: null, investment: 'low', health: 'medium', overlap: null });
  });
  it('is stamped with the engine version', () => {
    expect(INSIGHTS_VERSION).toBe('hc-insights-v1');
    expect(insights.version).toBe('hc-insights-v1');
  });
});

describe('every threshold and every gap, against the existing scoring function', () => {
  const incomes = [...Array.from({ length: 120 }, (_, i) => i + 1), 999_999, 1_234_567, 8_000_000, 33_333_333, 100_000_000, MONTHLY_MAX];

  it('computes the tier the scoring function awards, on each boundary and one paisa either side', () => {
    const bad = [];
    for (const income of incomes) {
      const eFull = divFloor(income * 30, 100);
      const ePartial = divFloor(income * 45, 100);
      const iPartial = divCeil(income * 10, 100);
      const iFull = divCeil(income * 20, 100);
      const cases = [];
      for (const emi of [0, eFull, eFull + 1, ePartial, ePartial + 1, income, income + 1]) cases.push(base({ income, emi }));
      for (const termCover of [0, 60 * income - 1, 60 * income, 120 * income - 1, 120 * income].filter(within)) cases.push(base({ income, termCover }));
      for (const investments of [0, Math.max(0, iPartial - 1), iPartial, Math.max(0, iFull - 1), iFull, income]) cases.push(base({ income, investments }));
      for (const healthCover of [0, HEALTH - 1, HEALTH]) cases.push(base({ income, healthCover }));
      for (const expenses of [0, 1, 7, Math.min(MONTHLY_MAX, Math.floor(income * 0.4) + 1)])
        for (const savings of [0, 3 * expenses - 1, 3 * expenses, 6 * expenses - 1, 6 * expenses].filter((n) => within(n))) cases.push(base({ income, expenses, savings }));
      for (const values of cases) { const diff = tierDifferences(values); if (diff.length) bad.push({ income, diff }); }
    }
    expect(bad.slice(0, 5)).toEqual([]);
  });

  it('reaches the next level exactly with the stated gap, and not with one paisa less', () => {
    const bad = [];
    const tierOf = (values, pick) => pick(computeFigures(values));
    for (const income of [7, 99, 12_345, 1_234_567, 8_000_000]) {
      for (const emi of [0, 1, divFloor(income * 30, 100) + 1, divFloor(income * 45, 100) + 1, income, 2 * income, 5 * income]) {
        const f = computeFigures(base({ income, emi }));
        if (f.emi.reductionToFullPaise > 0) {
          const reduced = emi - f.emi.reductionToFullPaise;
          if (tierOf(base({ income, emi: reduced }), (x) => x.emi.tier) !== 'full') bad.push(['emi full', income, emi]);
          if (tierOf(base({ income, emi: reduced + 1 }), (x) => x.emi.tier) === 'full') bad.push(['emi full-1', income, emi]);
        }
        if (f.emi.reductionToPartialPaise > 0 && tierOf(base({ income, emi: emi - f.emi.reductionToPartialPaise }), (x) => x.emi.tier) === 'zero') bad.push(['emi partial', income, emi]);
      }
      for (const termCover of [0, 1, 60 * income - 1, 60 * income + 5, 120 * income - 1]) {
        const f = computeFigures(base({ income, termCover }));
        if (f.lifeBenchmark.gapToFullPaise > 0) {
          if (tierOf(base({ income, termCover: termCover + f.lifeBenchmark.gapToFullPaise }), (x) => x.lifeBenchmark.tier) !== 'full') bad.push(['term full', income, termCover]);
          if (tierOf(base({ income, termCover: termCover + f.lifeBenchmark.gapToFullPaise - 1 }), (x) => x.lifeBenchmark.tier) === 'full') bad.push(['term full-1', income, termCover]);
        }
        if (f.lifeBenchmark.gapToPartialPaise > 0 && tierOf(base({ income, termCover: termCover + f.lifeBenchmark.gapToPartialPaise }), (x) => x.lifeBenchmark.tier) === 'zero') bad.push(['term partial', income, termCover]);
      }
      for (const investments of [0, 1, divCeil(income * 10, 100) - 1, divCeil(income * 20, 100) - 1, income]) {
        const f = computeFigures(base({ income, investments: Math.max(0, investments) }));
        const have = Math.max(0, investments);
        if (f.investmentRate.topUpToFullPaise > 0) {
          if (tierOf(base({ income, investments: have + f.investmentRate.topUpToFullPaise }), (x) => x.investmentRate.tier) !== 'full') bad.push(['inv full', income, have]);
          if (tierOf(base({ income, investments: have + f.investmentRate.topUpToFullPaise - 1 }), (x) => x.investmentRate.tier) === 'full') bad.push(['inv full-1', income, have]);
        }
        if (f.investmentRate.topUpToPartialPaise > 0 && tierOf(base({ income, investments: have + f.investmentRate.topUpToPartialPaise }), (x) => x.investmentRate.tier) === 'zero') bad.push(['inv partial', income, have]);
      }
    }
    for (const expenses of [1, 7, 3_500_000]) for (const savings of [0, 3 * expenses - 1, 3 * expenses + 2, 6 * expenses - 1]) {
      const f = computeFigures(base({ expenses, savings }));
      if (f.runway.gapToFullPaise > 0) {
        if (computeFigures(base({ expenses, savings: savings + f.runway.gapToFullPaise })).runway.tier !== 'full') bad.push(['runway full', expenses, savings]);
        if (computeFigures(base({ expenses, savings: savings + f.runway.gapToFullPaise - 1 })).runway.tier === 'full') bad.push(['runway full-1', expenses, savings]);
      }
    }
    for (const healthCover of [0, 1, HEALTH - 1]) {
      const f = computeFigures(base({ healthCover }));
      if (computeFigures(base({ healthCover: healthCover + f.healthReference.gapPaise })).healthReference.tier !== 'full') bad.push(['health', healthCover]);
      if (computeFigures(base({ healthCover: healthCover + f.healthReference.gapPaise - 1 })).healthReference.tier === 'full') bad.push(['health-1', healthCover]);
    }
    expect(bad.slice(0, 5)).toEqual([]);
  });

  it('keeps the levels in the stated order and every gap at 0 once its level is reached', () => {
    for (const values of [base(), base({ emi: 0, termCover: rupees(100_000_000), savings: rupees(2_000_000), investments: rupees(40_000), healthCover: HEALTH })]) {
      const f = computeFigures(values);
      expect(f.emi.fullLimitPaise).toBeLessThanOrEqual(f.emi.partialLimitPaise);
      expect(f.lifeBenchmark.fullNeedPaise).toBeGreaterThan(f.lifeBenchmark.partialNeedPaise);
      expect(f.runway.fullNeedPaise).toBeGreaterThan(f.runway.partialNeedPaise);
      expect(f.investmentRate.fullNeedPaise).toBeGreaterThanOrEqual(f.investmentRate.partialNeedPaise);
    }
    const reached = computeFigures(base({ emi: 0, termCover: rupees(100_000_000), savings: rupees(2_000_000), investments: rupees(40_000), healthCover: HEALTH }));
    expect([reached.emi.reductionToFullPaise, reached.lifeBenchmark.gapToFullPaise, reached.runway.gapToFullPaise, reached.investmentRate.topUpToFullPaise, reached.healthReference.gapPaise]).toEqual([0, 0, 0, 0, 0]);
  });

  it('shows a one-decimal figure that agrees with the tier: it never crosses a level the exact value has not crossed', () => {
    const bad = [];
    for (let income = 1; income <= 120; income += 1) {
      for (let emi = 0; emi <= 2 * income; emi += 1) {
        const f = computeFigures(base({ income, emi })).emi;
        if ((f.pctTenths <= 10 * TARGETS.emi.fullPct) !== (f.tier === 'full') || (f.pctTenths <= 10 * TARGETS.emi.partialPct) !== (f.tier !== 'zero')) bad.push(['emi', income, emi]);
      }
      for (let investments = 0; investments <= income; investments += 1) {
        const f = computeFigures(base({ income, investments })).investmentRate;
        if ((f.pctTenths >= 10 * TARGETS.investment.fullPct) !== (f.tier === 'full') || (f.pctTenths >= 10 * TARGETS.investment.partialPct) !== (f.tier !== 'zero')) bad.push(['investment', income, investments]);
      }
    }
    for (let expenses = 1; expenses <= 120; expenses += 1) {
      for (let savings = 0; savings <= 7 * expenses; savings += 1) {
        const f = computeFigures(base({ expenses, savings })).runway;
        if ((f.monthsTenths >= 10 * TARGETS.runway.fullMonths) !== (f.tier === 'full') || (f.monthsTenths >= 10 * TARGETS.runway.partialMonths) !== (f.tier !== 'zero')) bad.push(['runway', expenses, savings]);
      }
    }
    for (let income = 1; income <= 40; income += 1) {
      for (let termCover = 0; termCover <= 130 * income; termCover += 1) {
        const f = computeFigures(base({ income, termCover })).lifeBenchmark;
        if ((f.multipleTenths >= 10 * TARGETS.term.fullMultiple) !== (f.tier === 'full') || (f.multipleTenths >= 10 * TARGETS.term.partialMultiple) !== (f.tier !== 'zero')) bad.push(['term', income, termCover]);
      }
    }
    expect(bad.slice(0, 5)).toEqual([]);
  });
});

describe('incomes of Rs 0.01 to Rs 0.05, zero income and invalid input', () => {
  it('works at 1 to 5 paise: levels that coincide are flagged, nothing is NaN or infinite, and the tiers still match scoring', () => {
    for (let income = 1; income <= 8; income += 1) {
      const f = computeFigures(base({ income, emi: 1, expenses: 1, savings: 1, termCover: 1, investments: 1 }));
      expect(f.investmentRate.partialDistinct).toBe(divCeil(income * 10, 100) < divCeil(income * 20, 100));
      expect(f.emi.partialDistinct).toBe(divFloor(income * 45, 100) > divFloor(income * 30, 100));
      for (const [path, value] of leaves(f)) if (typeof value === 'number') expect(Number.isFinite(value), path).toBe(true);
      expect(tierDifferences(base({ income, emi: 1, expenses: 1, savings: 1, termCover: 1, investments: 1 }))).toEqual([]);
      if (income <= 5) expect(f.investmentRate.partialDistinct).toBe(false);
    }
    const tiny = computeFigures(base({ income: 3, emi: 0, investments: 0 }));
    expect(tiny.investmentRate.topUpToPartialPaise).toBe(tiny.investmentRate.topUpToFullPaise);
  });
  it('refuses zero, negative, fractional, missing and out-of-range amounts, without repeating the value', () => {
    const bad = [base({ income: 0 }), base({ income: -5 }), base({ income: 1.5 }), base({ emi: Number.NaN }), base({ savings: undefined }), base({ termCover: '100' }),
      base({ expenses: MAX_PAISE + 1 }), base({ overlap: 'maybe' }), base({ business: undefined }), null, undefined, 'x'];
    for (const values of bad) {
      expect(() => computeFigures(values)).toThrow(RangeError);
      expect(() => buildInsights(values)).toThrow(RangeError);
    }
    expect(() => computeFigures(base({ savings: 123_456_789_123_456 }))).toThrow(/within the supported maximum/);
    try { computeFigures(base({ savings: 123_456_789_123_456 })); } catch (e) { expect(e.message).not.toMatch(/123/); }
  });
  it('accepts exactly the largest supported amount', () => {
    expect(() => computeFigures(base({ income: MONTHLY_MAX, savings: MAX_PAISE, termCover: MAX_PAISE, healthCover: MAX_PAISE }))).not.toThrow();
  });
});

describe('EMI at and above income, and cash flow above income', () => {
  it('EMI equal to income: zero points, A2, and A3 as well when the entered costs exceed the income', () => {
    const insights = buildInsights(base({ income: rupees(50_000), emi: rupees(50_000), expenses: rupees(10_000), investments: 0 }));
    expect(insights.figures.emi.tier).toBe('zero');
    expect(formatPercentTenths(insights.figures.emi.pctTenths)).toBe('100.0%');
    expect(insights.alerts.map((a) => a.id)).toEqual(expect.arrayContaining(['A2', 'A3']));
  });
  it('EMI equal to income with nothing else entered: A2 only, the costs do not exceed the income', () => {
    const ids = buildInsights(base({ income: rupees(50_000), emi: rupees(50_000), expenses: 0, investments: 0, savings: 0 })).alerts.map((a) => a.id);
    expect(ids).toContain('A2');
    expect(ids).not.toContain('A3');
  });
  it('EMI above income: A2 only (A3 would only repeat it), but a cost problem alongside a smaller EMI keeps both', () => {
    const above = buildInsights(base({ income: rupees(50_000), emi: rupees(60_000), expenses: rupees(10_000) }));
    expect(above.alerts.map((a) => a.id)).toContain('A2');
    expect(above.alerts.map((a) => a.id)).not.toContain('A3');
    expect(above.steps.filter((s) => s.id.startsWith('CASH'))).toEqual([]);
    const both = buildInsights(base({ income: rupees(50_000), emi: rupees(30_000), expenses: rupees(25_000) }));
    expect(both.alerts.map((a) => a.id)).toEqual(expect.arrayContaining(['A2', 'A3']));
    expect(both.steps[0].id).toBe('CASH-ESS'); // essentials + EMI alone are above income: the first step, under "now"
  });
  it('costs above income only because of investing: unallocated is negative, A3 fires as a medium "review" alert, step CASH-INV in the next 90 days', () => {
    const insights = buildInsights(base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(10_000), investments: rupees(15_000) }));
    expect(insights.figures.cashFlow).toMatchObject({ committedPaise: rupees(55_000), unallocatedPaise: -rupees(5_000), exceedsIncome: true });
    expect(formatRupeesExact(insights.figures.cashFlow.unallocatedPaise)).toBe('-₹5,000');
    expect(insights.alerts.find((a) => a.id === 'A3')).toMatchObject({ tier: 'review', severity: 'medium', detail: { kind: 'investments' } });
    expect(insights.steps[0]).toMatchObject({ id: 'CASH-INV', horizon: 'd90', categoryId: null });
  });
});

describe('the emergency runway: scored without EMI, informational with it', () => {
  it('Rs 35,000 expenses, Rs 15,000 EMI, Rs 2.4 lakh savings: 6.8 months scored (full), 4.8 months with EMI (information only)', () => {
    const values = base({ income: rupees(100_000), expenses: rupees(35_000), emi: rupees(15_000), savings: rupees(240_000) });
    const insights = buildInsights(values);
    expect(formatMonthsTenths(insights.figures.runway.monthsTenths)).toBe('6.8');
    expect(insights.figures.runway.tier).toBe('full');
    expect(scoreHealthCheck(values).points.emergency).toBe(20);
    expect(formatMonthsTenths(insights.info.withEmiRunway.monthsTenths)).toBe('4.8');
  });
  it('a short runway with EMIs adds no alert, step or ranking change when the scored runway is full', () => {
    const insights = buildInsights(base({ income: rupees(100_000), expenses: rupees(10_000), emi: rupees(40_000), savings: rupees(60_000), investments: rupees(20_000) }));
    expect(insights.figures.runway.tier).toBe('full');
    expect(insights.info.withEmiRunway.monthsTenths).toBe(12);
    expect(insights.alerts.map((a) => a.id)).not.toContain('A1');
    expect(insights.steps.map((s) => s.id).filter((id) => id.startsWith('EM-'))).toEqual([]);
    expect(insights.findings.strengths).toContain('emergency');
  });
  it('is not shown without EMIs or without fixed expenses', () => {
    expect(informationalRunway(base({ emi: 0 }))).toEqual({ applies: false, monthsTenths: null });
    expect(informationalRunway(base({ expenses: 0 }))).toEqual({ applies: false, monthsTenths: null });
    expect(informationalRunway(base())).toEqual({ applies: true, monthsTenths: 60 });
  });
  it('is read by nothing except buildInsights: no other function mentions it, and the rest of the result is the same without it', () => {
    for (const fn of [computeFigures, buildAlerts, rankFindings, selectNextSteps, scoreReasons, severityFor]) {
      expect(fn.toString()).not.toMatch(/informationalRunway|withEmiRunway/);
    }
    let compared = 0;
    for (const values of matrixCases()) {
      compared += 1;
      if (compared % 211 !== 0) continue;
      const insights = buildInsights(values);
      const result = scoreHealthCheck(values);
      const figures = computeFigures(values);
      const alerts = buildAlerts(values, result);
      expect(insights.alerts).toEqual(alerts);
      expect(insights.findings).toEqual(rankFindings(result));
      expect(insights.reasons).toEqual(scoreReasons(result));
      expect(insights.steps).toEqual(selectNextSteps(figures, result, alerts));
    }
  });
});

describe('categories that do not apply', () => {
  it('no fixed expenses: the runway does not apply, so no emergency alert, step, strength or severity', () => {
    const insights = buildInsights(base({ expenses: 0, savings: 0, emi: rupees(15_000) }));
    expect(insights.figures.runway).toMatchObject({ applies: false, monthsTenths: null, tier: null, gapToFullPaise: null });
    expect(insights.alerts.map((a) => a.id)).not.toContain('A1');
    expect(insights.steps.map((s) => s.categoryId)).not.toContain('emergency');
    expect(insights.findings.strengths).not.toContain('emergency');
    expect(insights.findings.improvements).not.toContain('emergency');
    expect(insights.severity).not.toHaveProperty('emergency');
    expect(insights.reasons.notApplicable).toContain('emergency');
    expect(insights.info.withEmiRunway.applies).toBe(false);
  });
  it('no business: shielding is in no list, there is no shielding step, and the score is scaled', () => {
    const insights = buildInsights(base({ business: 'na' }));
    expect(insights.reasons.scaled).toBe(true);
    expect(insights.reasons.notApplicable).toEqual(['shielding']);
    expect(JSON.stringify([insights.findings, insights.steps, insights.severity])).not.toMatch(/shielding|SHIELD/);
  });
  it('a business answered "no or not sure" scores nothing and gets a shielding step', () => {
    const insights = buildInsights(base({ business: 'no' }));
    expect(insights.steps.map((s) => s.id)).toContain('SHIELD-0');
    expect(insights.severity.shielding).toBe('low');
  });
});

describe('rounding and display', () => {
  it('rounds each figure in its cautious direction', () => {
    const f = computeFigures(base({ income: 3000, emi: 100, investments: 100, termCover: 100_000, expenses: 3000, savings: 10_000 }));
    expect(f.emi.pctTenths).toBe(34); // 3.33% rounds UP to 3.4%
    expect(f.investmentRate.pctTenths).toBe(33); // 3.33% rounds DOWN to 3.3%
    expect(f.lifeBenchmark.multipleTenths).toBe(27); // 2.77x rounds DOWN
    expect(f.runway.monthsTenths).toBe(33); // 3.33 months rounds DOWN
    expect(computeFigures(base({ income: 1001 })).emi.fullLimitPaise).toBe(300); // a limit rounds DOWN
    expect(formatRupeesCeil(12_345)).toBe('₹124');
    expect(formatRupeesFloor(12_345)).toBe('₹123');
    expect(formatRupeesCeil(12_300)).toBe('₹123');
    expect(formatRupeesFloor(0)).toBe('₹0');
  });
  it('formats exact amounts with Indian grouping up to Rs 120 crore, with paise only when there are some', () => {
    const cases = [[0, '₹0'], [99_900, '₹999'], [100_000, '₹1,000'], [9_999_900, '₹99,999'], [10_000_000, '₹1,00,000'], [123_456_700, '₹12,34,567'],
      [10_000_000_000, '₹10,00,00,000'], [100_000_000_000, '₹1,00,00,00,000'], [120_000_000_000, '₹1,20,00,00,000'], [12_345, '₹123.45'], [5, '₹0.05'], [150_050, '₹1,500.50']];
    cases.forEach(([paise, text]) => expect(formatRupeesExact(paise)).toBe(text));
    expect(formatRupeesExact(-150_050)).toBe('-₹1,500.50');
    expect(formatRupeesExact(-100)).toBe('-₹1');
    expect(formatRupeesCeil(100_000_000_000)).toBe('₹1,00,00,00,000');
    expect(formatRupeesFloor(120_000_000_000)).toBe('₹1,20,00,00,000');
  });
  const intl = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
  it.skipIf(intl.format(1_234_567) !== '12,34,567')('groups exactly like Intl en-IN (where this runtime supports it)', () => {
    const bad = [];
    const check = (rupeeCount) => { if (formatRupeesFloor(rupeeCount * 100) !== `₹${intl.format(rupeeCount)}`) bad.push(rupeeCount); };
    for (let n = 0; n <= 400_000; n += 7) check(n);
    for (let n = 1; n <= 1_200_000_000; n = Math.floor(n * 1.37) + 1) check(n);
    expect(bad.slice(0, 5)).toEqual([]);
  });
  it('rejects values that are not whole amounts', () => {
    expect(() => formatRupeesExact(1.5)).toThrow(RangeError);
    expect(() => formatRupeesCeil(-1)).toThrow(RangeError);
    expect(() => formatRupeesFloor(Number.NaN)).toThrow(RangeError);
    expect(() => formatPercentTenths(-1)).toThrow(RangeError);
    expect(() => formatMonthsTenths(1.5)).toThrow(RangeError);
  });
  it('uses one rule for units: a symbol where there is one, never a unit word', () => {
    expect(formatPercentTenths(0)).toBe('0.0%');
    expect(formatMultipleTenths(100)).toBe('10.0×');
    expect(formatMonthsTenths(60)).toBe('6.0');
    expect(formatMonthsTenths(60)).not.toMatch(/month/i);
  });
  it('caps absurd values at a display ceiling and says so, without touching the tier', () => {
    expect(formatPercentTenths(DISPLAY_CEILINGS.percentTenths)).toBe('1,000.0%');
    expect(formatPercentTenths(DISPLAY_CEILINGS.percentTenths + 1)).toBe('more than 1,000%');
    expect(formatMultipleTenths(DISPLAY_CEILINGS.multipleTenths + 1)).toBe('more than 1,000×');
    expect(formatMonthsTenths(DISPLAY_CEILINGS.monthsTenths)).toBe('1,200.0');
    expect(formatMonthsTenths(DISPLAY_CEILINGS.monthsTenths + 1)).toBe('more than 1,200');
    const extreme = computeFigures(base({ income: 1, expenses: 1, savings: MAX_PAISE, termCover: MAX_PAISE, emi: MONTHLY_MAX, investments: MONTHLY_MAX }));
    expect(formatMonthsTenths(extreme.runway.monthsTenths)).toBe('more than 1,200');
    expect(formatMultipleTenths(extreme.lifeBenchmark.multipleTenths)).toBe('more than 1,000×');
    expect(formatPercentTenths(extreme.emi.pctTenths)).toBe('more than 1,000%');
    expect([extreme.emi.tier, extreme.runway.tier, extreme.lifeBenchmark.tier, extreme.investmentRate.tier]).toEqual(['zero', 'full', 'full', 'full']);
  });
});

describe('integer arithmetic and the Rs 100 crore limit', () => {
  it('divFloor and divCeil agree with BigInt on 50,000 seeded pairs, and refuse unsafe input', () => {
    const next = xorshift(123_456_789);
    let bad = 0;
    for (let i = 0; i < 50_000; i += 1) {
      const b = Math.max(1, (next() % (i % 3 === 0 ? 1_000_000_000 : i % 3 === 1 ? 100_000 : 100)));
      const a = (next() % 1_000_000_000) * (i % 2 === 0 ? 1000 : 1);
      if (BigInt(divFloor(a, b)) !== BigInt(a) / BigInt(b) || BigInt(divCeil(a, b)) !== (BigInt(a) + BigInt(b) - 1n) / BigInt(b)) bad += 1;
    }
    expect(bad).toBe(0);
    [[-1, 2], [1.5, 2], [Number.NaN, 2], [5, 0], [5, -1], [Number.MAX_SAFE_INTEGER + 1, 1]].forEach(([a, b]) => expect(() => divFloor(a, b)).toThrow(RangeError));
    expect(() => divCeil(5, 0)).toThrow(RangeError);
  });
  it('handles every combination of the largest and smallest supported amounts, with whole-number results', () => {
    let combinations = 0;
    for (const income of [1, MONTHLY_MAX]) for (const expenses of [0, 1, MONTHLY_MAX]) for (const emi of [0, MONTHLY_MAX]) for (const investments of [0, MONTHLY_MAX])
      for (const savings of [0, MAX_PAISE]) for (const termCover of [0, MAX_PAISE]) for (const healthCover of [0, MAX_PAISE]) {
        combinations += 1;
        const insights = buildInsights(base({ income, expenses, emi, investments, savings, termCover, healthCover }));
        for (const [path, value] of leaves([insights.figures, insights.steps, insights.info, insights.alerts])) {
          if (typeof value === 'number') expect(Number.isSafeInteger(value), path).toBe(true);
        }
        for (const step of insights.steps) for (const key of Object.keys(step.params)) if (key.endsWith('Paise')) expect(formatRupeesCeil(step.params[key])).not.toMatch(/NaN|undefined|Infinity/);
      }
    expect(combinations).toBe(192);
  });
});

describe('the 12-month set-aside never understates the gap', () => {
  it('multiplied by 12 it is at least the gap, is a whole number of rupees, and overshoots by less than Rs 12', () => {
    const bad = [];
    const check = (gap) => { const each = monthlySetAside12(gap); if (each * 12 < gap || each % 100 !== 0 || each * 12 - gap >= 1200) bad.push(gap); };
    for (let gap = 0; gap <= 5000; gap += 1) check(gap);
    for (let gap = 5000; gap <= 5_000_000; gap += 97) check(gap);
    [99_999_999_999, MAX_PAISE, 12_000_000_000, 1_199, 1_200, 1_201].forEach(check);
    expect(bad.slice(0, 5)).toEqual([]);
    expect(monthlySetAside12(0)).toBe(0);
    expect(monthlySetAside12(1)).toBe(100);
    expect(monthlySetAside12(rupees(36_000))).toBe(rupees(3_000));
    expect(monthlySetAside12(rupees(36_001))).toBe(rupees(3_001));
    expect(() => monthlySetAside12(-1)).toThrow(RangeError);
    expect(() => monthlySetAside12(1.5)).toThrow(RangeError);
  });
});

// about 76,000 cases: a few seconds here, so the limit is raised for this block only (no assertion is skipped or weakened)
describe('alerts, findings, reasons and steps on the full boundary matrix', { timeout: 30_000 }, () => {
  it('agree with the scoring function and with each other on every case', () => {
    const stats = { cases: 0, maxSteps: 0, strongWithPriority: 0, cashSuppressed: 0, bothKept: 0, attentionNoPriority: 0, a3High: 0, a3Medium: 0 };
    const failures = [];
    const fail = (kind, values) => { if (failures.length < 6) failures.push(kind + ' ' + JSON.stringify(values)); };
    for (const values of matrixCases()) {
      stats.cases += 1;
      const result = scoreHealthCheck(values);
      const insights = buildInsights(values);
      if (tierDifferences(values).length) fail('tier', values);
      if (insights.reasons.lost.reduce((sum, entry) => sum + entry.lost, 0) !== result.applicable - result.earned) fail('reasons', values);
      const ids = insights.alerts.map((a) => a.id);
      if (ids.join() !== expectedAlertIds(values).join()) fail('alerts', values);
      const exceeds = values.expenses + values.emi + values.investments > values.income;
      if (exceeds && values.emi > values.income) { stats.cashSuppressed += 1; if (ids.includes('A3')) fail('A3 should be suppressed', values); }
      if (ids.includes('A2') && ids.includes('A3')) stats.bothKept += 1;
      if (result.band === 'strong' && insights.alerts.some((a) => a.tier === 'priority')) stats.strongWithPriority += 1;
      if (result.band === 'attention' && !insights.alerts.some((a) => a.tier === 'priority')) stats.attentionNoPriority += 1;
      const belowMax = CATEGORY_IDS.filter((id) => result.points[id] !== null && result.points[id] < CATEGORY_MAX[id]);
      const full = CATEGORY_IDS.filter((id) => result.points[id] === CATEGORY_MAX[id]);
      const categorySteps = insights.steps.filter((s) => s.categoryId);
      if (categorySteps.length !== belowMax.length || !belowMax.every((id) => categorySteps.some((s) => s.categoryId === id))) fail('steps', values);
      const a3 = insights.alerts.find((a) => a.id === 'A3');
      const essentialsAndEmiOver = values.expenses + values.emi > values.income;
      if (Boolean(a3) !== ids.includes('A3')) fail('A3 flag', values);
      if (a3) {
        const kind = essentialsAndEmiOver ? 'essentialsAndEmi' : 'investments';
        stats[kind === 'essentialsAndEmi' ? 'a3High' : 'a3Medium'] += 1;
        if (a3.detail.kind !== kind || a3.severity !== (kind === 'essentialsAndEmi' ? 'high' : 'medium') || a3.tier !== (kind === 'essentialsAndEmi' ? 'priority' : 'review')) fail('A3 kind, severity or tier', values);
        if (a3.detail.overByPaise !== values.expenses + values.emi + values.investments - values.income) fail('A3 amount', values);
      }
      const cashSteps = insights.steps.filter((s) => s.id.startsWith('CASH'));
      if (cashSteps.length !== (a3 ? 1 : 0) || (a3 && (cashSteps[0].id !== (essentialsAndEmiOver ? 'CASH-ESS' : 'CASH-INV') || cashSteps[0].horizon !== (essentialsAndEmiOver ? 'now' : 'd90')))) fail('cash step', values);
      if (!insights.steps.every((s, i, all) => i === 0 || ['now', 'd90', 'm12'].indexOf(all[i - 1].horizon) <= ['now', 'd90', 'm12'].indexOf(s.horizon))) fail('step order', values);
      stats.maxSteps = Math.max(stats.maxSteps, insights.steps.length);
      if (insights.findings.strengths.length !== Math.min(3, full.length) || !insights.findings.strengths.every((id) => full.includes(id))) fail('strengths', values);
      if (insights.findings.improvements.length !== Math.min(3, belowMax.length) || !insights.findings.improvements.every((id) => belowMax.includes(id))) fail('improvements', values);
      for (const id of CATEGORY_IDS) {
        const here = result.points[id];
        const want = here === null ? undefined : here === CATEGORY_MAX[id] ? null : EXPECTED_SEVERITY[id][here];
        if (insights.severity[id] !== want) fail(`severity ${id}`, values);
      }
      if (stats.cases % 97 === 0 && JSON.stringify(buildInsights(values)) !== JSON.stringify(insights)) fail('not repeatable', values);
    }
    expect(failures).toEqual([]);
    expect(stats.cases).toBeGreaterThan(70_000);
    expect(stats.maxSteps).toBeLessThanOrEqual(8); // one per category plus the cash-flow step: no cap is needed
    expect(stats.strongWithPriority).toBeGreaterThan(0); // an alert can stand beside a strong score
    expect(stats.attentionNoPriority).toBeGreaterThan(0);
    expect(stats.cashSuppressed).toBeGreaterThan(0);
    expect(stats.a3High).toBeGreaterThan(0); // both kinds of cash-flow alert are exercised
    expect(stats.a3Medium).toBeGreaterThan(0);
    expect(stats.bothKept).toBeGreaterThan(0); // A2 and A3 together when the EMI is below the income
  });

  it('builds alerts from the category points and the amounts only, never from the overall score or band', () => {
    const values = base({ income: rupees(50_000), emi: rupees(30_000), expenses: rupees(25_000), savings: 0, termCover: 0, healthCover: 0 });
    const { points } = scoreHealthCheck(values);
    const probe = { points, get score() { throw new Error('read the score'); }, get band() { throw new Error('read the band'); }, get earned() { throw new Error('read earned'); }, get applicable() { throw new Error('read applicable'); } };
    expect(buildAlerts(values, probe).map((a) => a.id)).toEqual(['A1', 'A2', 'A3', 'R1', 'R2']);
    expect(() => buildAlerts(values, {})).toThrow(RangeError);
  });

  it('breaks ties in a fixed order and caps strengths and improvements at three', () => {
    const allFull = buildInsights(base({ income: rupees(100_000), expenses: rupees(30_000), emi: rupees(30_000), savings: rupees(180_000), termCover: rupees(120_000_000), healthCover: HEALTH, investments: rupees(20_000), overlap: 'yes', business: 'yes' }));
    expect(allFull.findings.strengths).toEqual(['emi', 'term', 'emergency']);
    expect(allFull.findings.improvements).toEqual([]);
    expect(allFull.steps).toEqual([]);
    expect(allFull.alerts).toEqual([]);
    const allZero = buildInsights(base({ income: rupees(100_000), expenses: rupees(30_000), emi: rupees(50_000), savings: 0, termCover: 0, healthCover: 0, investments: 0, overlap: 'no', business: 'no' }));
    expect(allZero.findings.strengths).toEqual([]);
    expect(allZero.findings.improvements).toEqual(['emi', 'emergency', 'term']); // the two with a priority alert first, then by points lost
    expect(allZero.steps.map((s) => s.id)).toEqual(['EMI-0', 'EM-0', 'TERM-0', 'INV-0', 'HEALTH-0', 'OVERLAP-0', 'SHIELD-0']);
    expect(allZero.steps.map((s) => s.horizon)).toEqual(['now', 'now', 'd90', 'd90', 'd90', 'd90', 'd90']);
  });

  it('puts the steps in order: now, then the next 90 days, then the next 12 months, the most points lost first within each', () => {
    const insights = buildInsights(base({ income: rupees(100_000), expenses: rupees(30_000), emi: rupees(40_000), savings: rupees(120_000), termCover: rupees(7_000_000), healthCover: 0, investments: rupees(12_000), overlap: 'no', business: 'no' }));
    // nothing is in "now" (no priority alert); within "m12" the three that lost 10 points go in the fixed category order, then investing (7 lost)
    expect(insights.steps.map((s) => `${s.horizon}:${s.id}`)).toEqual(['d90:HEALTH-0', 'd90:OVERLAP-0', 'd90:SHIELD-0', 'm12:EMI-1', 'm12:TERM-1', 'm12:EM-1', 'm12:INV-1']);
  });

  it('gives each step the numbers it needs, and nothing but numbers', () => {
    const insights = buildInsights(base({ income: rupees(80_000), expenses: rupees(35_000), emi: rupees(40_000), savings: rupees(60_000), termCover: rupees(2_000_000), healthCover: rupees(500_000), investments: rupees(4_000), overlap: 'no', business: 'no' }));
    const byId = Object.fromEntries(insights.steps.map((s) => [s.id, s.params]));
    expect(byId['EM-0']).toMatchObject({ monthsTenths: 17, gapToPartialPaise: rupees(45_000), gapToFullPaise: rupees(150_000), setAsideToPartialPaise: rupees(3_750), setAsideToFullPaise: rupees(12_500) });
    expect(byId['EMI-0']).toMatchObject({ pctTenths: 500, partialLimitPaise: rupees(36_000), fullLimitPaise: rupees(24_000), reductionToPartialPaise: rupees(4_000), reductionToFullPaise: rupees(16_000) });
    expect(byId['TERM-0']).toMatchObject({ coverPaise: rupees(2_000_000), partialNeedPaise: rupees(4_800_000), fullNeedPaise: rupees(9_600_000) });
    expect(byId['INV-0']).toMatchObject({ partialNeedPaise: rupees(8_000), fullNeedPaise: rupees(16_000), topUpToPartialPaise: rupees(4_000), topUpToFullPaise: rupees(12_000) });
    expect(byId['HEALTH-0']).toEqual({ coverPaise: rupees(500_000), gapPaise: rupees(500_000) });
    for (const step of insights.steps) for (const value of Object.values(step.params)) expect(Number.isSafeInteger(value)).toBe(true);
    expect(byId['OVERLAP-0']).toEqual({});
    expect(byId['SHIELD-0']).toEqual({});
  });
});

describe('severity: every mapping, explained and configurable (there is no approval switch)', () => {
  it('maps every category state exactly as written down, and gives each one a reason', () => {
    const states = { emi: [0, 10], emergency: [0, 10], term: [0, 10], health: [0], investment: [0, 8], overlap: [0], shielding: [0] };
    let checked = 0;
    for (const [id, list] of Object.entries(states)) {
      for (const points of list) {
        checked += 1;
        expect(severityFor(id, points), `${id} at ${points}`).toBe(EXPECTED_SEVERITY[id][points]);
        expect(SEVERITY_TABLE[id][points], `${id} at ${points} (table)`).toBe(EXPECTED_SEVERITY[id][points]);
        expect(SEVERITY_RATIONALE[id][points].length, `${id} at ${points} (reason)`).toBeGreaterThan(40);
      }
      expect(severityFor(id, CATEGORY_MAX[id])).toBeNull();
      expect(severityFor(id, null)).toBeNull();
    }
    expect(checked).toBe(11);
    expect(severityForCashFlow('essentialsAndEmi')).toBe('high');
    expect(severityForCashFlow('investments')).toBe('medium');
    expect(Object.keys(SEVERITY_TABLE).sort()).toEqual([...CATEGORY_IDS, 'cashFlow'].sort());
    expect(Object.keys(SEVERITY_RATIONALE).sort()).toEqual(Object.keys(SEVERITY_TABLE).sort());
    CATEGORY_IDS.forEach((id) => expect(Object.keys(SEVERITY_RATIONALE[id]).sort()).toEqual(Object.keys(SEVERITY_TABLE[id]).sort()));
    expect(Object.keys(SEVERITY_RATIONALE.cashFlow).sort()).toEqual(['essentialsAndEmi', 'investments']);
    expect(SEVERITY_RATIONALE.cashFlow.essentialsAndEmi.length).toBeGreaterThan(40);
  });
  it('follows the stated principles: a partial state is never more severe than the zero state, investing is never high, only a strained budget or safety net is high', () => {
    const rank = { high: 0, medium: 1, low: 2 };
    ['emi', 'emergency', 'term', 'investment'].forEach((id) => {
      const [zero, partial] = Object.keys(SEVERITY_TABLE[id]).sort((a, b) => a - b).map((points) => SEVERITY_TABLE[id][points]);
      expect(rank[partial], id).toBeGreaterThanOrEqual(rank[zero]);
    });
    expect(Object.values(SEVERITY_TABLE.investment)).not.toContain('high');
    expect(SEVERITY_TABLE.cashFlow.investments).not.toBe('high');
    const highs = Object.entries(SEVERITY_TABLE).flatMap(([id, byState]) => Object.entries(byState).filter(([, level]) => level === 'high').map(([state]) => `${id}:${state}`));
    expect(highs.sort()).toEqual(['cashFlow:essentialsAndEmi', 'emergency:0', 'emi:0']);
  });
  it('never describes voluntary investing as debt or as a certain danger', () => {
    const text = JSON.stringify([SEVERITY_RATIONALE.cashFlow.investments, SEVERITY_RATIONALE.investment]).replace(/not a debt/g, '');
    expect(text).not.toMatch(/\bdebt\b|danger|disaster|crisis|will fail|guarantee/i);
    expect(SEVERITY_RATIONALE.cashFlow.investments).toMatch(/choice/);
    expect(SEVERITY_RATIONALE.cashFlow.investments).toMatch(/not a debt/);
  });
  it('rates each alert as written: A1 and A2 high, R1 and R2 medium, A3 by what the mismatch needs', () => {
    const values = base({ income: rupees(50_000), emi: rupees(25_000), expenses: rupees(30_000), savings: 0, termCover: 0, healthCover: 0 });
    expect(buildInsights(values).alerts.map((a) => [a.id, a.tier, a.severity])).toEqual([
      ['A1', 'priority', 'high'], ['A2', 'priority', 'high'], ['A3', 'priority', 'high'], ['R1', 'review', 'medium'], ['R2', 'review', 'medium'],
    ]);
  });
  it('depends on the category and its state, never on the overall score or band', () => {
    const onlyEmergencyMissing = base({ income: rupees(100_000), expenses: rupees(30_000), emi: rupees(30_000), savings: 0, termCover: rupees(120_000_000), healthCover: HEALTH, investments: rupees(20_000), overlap: 'yes', business: 'yes' });
    const everythingMissing = base({ income: rupees(100_000), expenses: rupees(30_000), emi: rupees(50_000), savings: 0, termCover: 0, healthCover: 0, investments: 0, overlap: 'no', business: 'no' });
    expect(scoreHealthCheck(onlyEmergencyMissing).band).toBe('strong');
    expect(scoreHealthCheck(everythingMissing).band).toBe('attention');
    expect(buildInsights(onlyEmergencyMissing).severity.emergency).toBe('high');
    expect(buildInsights(everythingMissing).severity.emergency).toBe('high');
    expect(buildInsights(onlyEmergencyMissing).alerts.find((a) => a.id === 'A1').severity).toBe('high');
  });
  it('changes the labels and the ranking, and nothing else, when another table is passed in', () => {
    const allLow = {
      emi: { 0: 'low', 10: 'low' }, term: { 0: 'low', 10: 'low' }, emergency: { 0: 'low', 10: 'low' }, investment: { 0: 'low', 8: 'low' },
      health: { 0: 'low' }, overlap: { 0: 'low' }, shielding: { 0: 'low' }, cashFlow: { essentialsAndEmi: 'low', investments: 'low' },
    };
    const values = base({ income: rupees(50_000), emi: rupees(25_000), expenses: rupees(30_000), savings: 0, termCover: 0, healthCover: 0 });
    const result = scoreHealthCheck(values);
    const custom = buildAlerts(values, result, allLow);
    const standard = buildAlerts(values, result);
    expect(custom.map((a) => a.id)).toEqual(standard.map((a) => a.id));
    expect(custom.map((a) => a.tier)).toEqual(standard.map((a) => a.tier)); // the tier follows the kind of alert, not the configured level
    expect(custom.every((a) => a.severity === 'low')).toBe(true);
    expect(standard.some((a) => a.severity === 'high')).toBe(true);
    const allZero = scoreHealthCheck(base({ income: rupees(100_000), expenses: rupees(30_000), emi: rupees(50_000), savings: 0, termCover: 0, healthCover: 0, investments: 0, overlap: 'no', business: 'no' }));
    expect(rankFindings(allZero).improvements).toEqual(['emi', 'emergency', 'term']); // most severe first
    expect(rankFindings(allZero, allLow).improvements).toEqual(['emi', 'term', 'emergency']); // all equal: points lost, then the fixed category order
  });
  it('refuses a table with a missing or invalid level, an unknown category and an unknown cash-flow kind', () => {
    expect(() => severityFor('emi', 0, { emi: { 0: 'severe' } })).toThrow(RangeError);
    expect(() => severityFor('emi', 0, {})).toThrow(RangeError);
    expect(() => severityFor('retirement', 0)).toThrow(RangeError);
    expect(() => severityForCashFlow('debt')).toThrow(RangeError);
    expect(() => severityForCashFlow('investments', { cashFlow: { essentialsAndEmi: 'high' } })).toThrow(RangeError);
    const values = base({ income: rupees(50_000), emi: rupees(25_000), expenses: rupees(30_000) });
    expect(() => buildAlerts(values, scoreHealthCheck(values), { ...SEVERITY_TABLE, cashFlow: undefined })).toThrow(RangeError);
  });
  it('has no approval switch left in the engine', () => {
    expect('SEVERITY_APPROVED' in engineNamespace).toBe(false);
  });
});

describe('what the engine is and is not', () => {
  const insights = buildInsights(base());
  it('returns exactly the planned keys, and no conclusion it has no inputs for', () => {
    expect(Object.keys(insights).sort()).toEqual(['alerts', 'figures', 'findings', 'info', 'reasons', 'severity', 'steps', 'version']);
    expect(Object.keys(insights.figures).sort()).toEqual(['cashFlow', 'emi', 'healthReference', 'investmentRate', 'lifeBenchmark', 'runway']);
    const names = [...keysOf(insights)];
    expect(names.filter((name) => /retire|net.?worth|savings.?rate|requirement|recommend|advice|surplus/i.test(name))).toEqual([]);
  });
  it('is frozen all the way down and leaves its input alone', () => {
    expect(isDeepFrozen(insights)).toBe(true);
    const input = Object.freeze(base());
    expect(() => buildInsights(input)).not.toThrow();
    expect(JSON.stringify(buildInsights(input))).toBe(JSON.stringify(buildInsights({ ...input })));
    expect(isDeepFrozen(TARGETS)).toBe(true);
    expect(isDeepFrozen(DISPLAY_CEILINGS)).toBe(true);
    expect(isDeepFrozen(SEVERITY_TABLE)).toBe(true);
  });
  it('takes only the amounts and calls the existing scoring itself, so the figures and the score cannot come from different inputs', () => {
    expect(buildInsights.length).toBe(1);
    const values = base({ emi: rupees(35_000) });
    expect(buildInsights(values).reasons.score).toBe(scoreHealthCheck(values).score);
  });
});

describe('A3: the monthly cash-flow mismatch (essentials + EMIs + investments against income)', () => {
  const essentialsOver = base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(25_000), investments: rupees(10_000) });
  const investingOver = base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(10_000), investments: rupees(15_000) });
  const a3Of = (values) => buildInsights(values).alerts.find((a) => a.id === 'A3');

  it('is HIGH when essentials + EMIs alone exceed income, and states every amount of the mismatch', () => {
    const a3 = a3Of(essentialsOver);
    expect(a3).toMatchObject({ id: 'A3', tier: 'priority', categoryId: null, severity: 'high' });
    expect(a3.detail).toEqual({
      kind: 'essentialsAndEmi', incomePaise: rupees(50_000), essentialsPaise: rupees(30_000), emiPaise: rupees(25_000), investmentsPaise: rupees(10_000),
      essentialsPlusEmiPaise: rupees(55_000), committedPaise: rupees(65_000), overByPaise: rupees(15_000), essentialsAndEmiOverByPaise: rupees(5_000), roomBeforeInvestmentsPaise: 0,
    });
  });
  it('is MEDIUM when essentials + EMIs fit within income and only the investing pushes the total over', () => {
    const a3 = a3Of(investingOver);
    expect(a3).toMatchObject({ id: 'A3', tier: 'review', categoryId: null, severity: 'medium' });
    expect(a3.detail).toEqual({
      kind: 'investments', incomePaise: rupees(50_000), essentialsPaise: rupees(30_000), emiPaise: rupees(10_000), investmentsPaise: rupees(15_000),
      essentialsPlusEmiPaise: rupees(40_000), committedPaise: rupees(55_000), overByPaise: rupees(5_000), essentialsAndEmiOverByPaise: 0, roomBeforeInvestmentsPaise: rupees(10_000),
    });
  });
  it('switches exactly at the paisa: equal is no alert, one paisa over is one', () => {
    const exact = base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(10_000), investments: rupees(10_000) });
    expect(a3Of(exact)).toBeUndefined();
    expect(a3Of({ ...exact, investments: exact.investments + 1 })).toMatchObject({ severity: 'medium', detail: { kind: 'investments', overByPaise: 1 } });
    const fullButFits = base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(20_000), investments: 0 });
    expect(a3Of(fullButFits)).toBeUndefined(); // essentials + EMI equal the income: nothing exceeds it
    expect(a3Of({ ...fullButFits, investments: 1 })).toMatchObject({ severity: 'medium', detail: { kind: 'investments', overByPaise: 1, essentialsAndEmiOverByPaise: 0, roomBeforeInvestmentsPaise: 0 } });
    expect(a3Of({ ...fullButFits, emi: fullButFits.emi + 1 })).toMatchObject({ severity: 'high', detail: { kind: 'essentialsAndEmi', overByPaise: 1, essentialsAndEmiOverByPaise: 1, roomBeforeInvestmentsPaise: 0 } });
  });
  it('is left out when the EMI alone is above income, because A2 already says it; it is kept when the EMI is high but still below income', () => {
    const above = buildInsights(base({ income: rupees(50_000), expenses: rupees(10_000), emi: rupees(50_000) + 1, investments: rupees(5_000) }));
    expect(above.alerts.map((a) => a.id)).toContain('A2');
    expect(above.alerts.map((a) => a.id)).not.toContain('A3');
    const equal = buildInsights(base({ income: rupees(50_000), expenses: 1, emi: rupees(50_000), investments: 0 }));
    expect(equal.alerts.map((a) => a.id)).toEqual(expect.arrayContaining(['A2', 'A3'])); // EMI equal to income is not above it
    const high = buildInsights(base({ income: rupees(50_000), expenses: rupees(21_000), emi: rupees(30_000), investments: 0 }));
    expect(high.alerts.map((a) => a.id)).toEqual(expect.arrayContaining(['A2', 'A3'])); // 60% EMI, a different problem from the cost total
  });
  it('the suppression holds on a grid: an EMI above income always gives A2 and never A3, whatever the rest', () => {
    const bad = [];
    for (const income of [1, 3, 100, 5_000, 8_000_000]) for (const emi of [income + 1, 2 * income, 5 * income]) for (const expenses of [0, 1, income]) for (const investments of [0, 1, income]) {
      const ids = buildInsights(base({ income, expenses, emi, investments })).alerts.map((a) => a.id);
      if (!ids.includes('A2') || ids.includes('A3')) bad.push({ income, emi, expenses, investments });
    }
    expect(bad).toEqual([]);
  });
  it('is followed by one step of its own kind: CASH-ESS under "now", CASH-INV under the next 90 days, never both', () => {
    const high = buildInsights(essentialsOver).steps;
    expect(high.filter((s) => s.id.startsWith('CASH')).map((s) => [s.id, s.horizon])).toEqual([['CASH-ESS', 'now']]);
    expect(high[0].id).toBe('CASH-ESS');
    const medium = buildInsights(investingOver).steps;
    expect(medium.filter((s) => s.id.startsWith('CASH')).map((s) => [s.id, s.horizon])).toEqual([['CASH-INV', 'd90']]);
    expect(medium[0].id).toBe('CASH-INV');
    expect(buildInsights(base()).steps.filter((s) => s.id.startsWith('CASH'))).toEqual([]);
  });
  it('carries the same amounts in the figures, and no other alert carries a detail', () => {
    expect(buildInsights(essentialsOver).figures.cashFlow).toEqual({
      incomePaise: rupees(50_000), essentialsPaise: rupees(30_000), emiPaise: rupees(25_000), investmentsPaise: rupees(10_000), essentialsPlusEmiPaise: rupees(55_000),
      committedPaise: rupees(65_000), unallocatedPaise: -rupees(15_000), exceedsIncome: true, overByPaise: rupees(15_000), essentialsAndEmiOverByPaise: rupees(5_000), roomBeforeInvestmentsPaise: 0,
    });
    const everything = buildInsights(base({ income: rupees(50_000), emi: rupees(25_000), expenses: rupees(30_000), savings: 0, termCover: 0, healthCover: 0 })).alerts;
    expect(everything.filter((a) => a.id !== 'A3').every((a) => a.detail === null)).toBe(true);
    expect(everything.find((a) => a.id === 'A3').detail).not.toBeNull();
  });
});

describe('step params, asserted by value for the steps that had none (CASH-ESS, CASH-INV, EM-1, EMI-1, TERM-1, INV-1)', () => {
  const stepOf = (values, id) => {
    const step = buildInsights(values).steps.find((s) => s.id === id);
    expect(step, `step ${id} should be present`).toBeDefined();
    return step;
  };
  it('CASH-ESS and CASH-INV carry the amounts of the mismatch', () => {
    expect(stepOf(base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(25_000), investments: rupees(10_000) }), 'CASH-ESS')).toEqual({
      id: 'CASH-ESS', horizon: 'now', categoryId: null,
      params: { incomePaise: rupees(50_000), essentialsPaise: rupees(30_000), emiPaise: rupees(25_000), investmentsPaise: rupees(10_000), essentialsPlusEmiPaise: rupees(55_000), committedPaise: rupees(65_000), overByPaise: rupees(15_000), essentialsAndEmiOverByPaise: rupees(5_000), roomBeforeInvestmentsPaise: 0 },
    });
    expect(stepOf(base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(10_000), investments: rupees(15_000) }), 'CASH-INV')).toEqual({
      id: 'CASH-INV', horizon: 'd90', categoryId: null,
      params: { incomePaise: rupees(50_000), essentialsPaise: rupees(30_000), emiPaise: rupees(10_000), investmentsPaise: rupees(15_000), essentialsPlusEmiPaise: rupees(40_000), committedPaise: rupees(55_000), overByPaise: rupees(5_000), essentialsAndEmiOverByPaise: 0, roomBeforeInvestmentsPaise: rupees(10_000) },
    });
  });
  it('EM-1: 5.1 months of savings, Rs 30,000 short of 6 months, Rs 2,500 a month over 12 months', () => {
    expect(stepOf(base({ income: rupees(100_000), expenses: rupees(35_000), emi: rupees(5_000), savings: rupees(180_000) }), 'EM-1')).toEqual({
      id: 'EM-1', horizon: 'm12', categoryId: 'emergency', params: { monthsTenths: 51, gapToFullPaise: rupees(30_000), setAsideToFullPaise: rupees(2_500) },
    });
  });
  it('EMI-1: EMIs at 37.5% of income, the 30% limit is Rs 24,000, Rs 6,000 less than paid now', () => {
    expect(stepOf(base({ income: rupees(80_000), expenses: rupees(20_000), emi: rupees(30_000) }), 'EMI-1')).toEqual({
      id: 'EMI-1', horizon: 'm12', categoryId: 'emi', params: { pctTenths: 375, fullLimitPaise: rupees(24_000), reductionToFullPaise: rupees(6_000) },
    });
  });
  it('TERM-1: cover of 7.2 times annual take-home income, the 10 times level is Rs 96 lakh, Rs 26 lakh more than entered', () => {
    expect(stepOf(base({ income: rupees(80_000), termCover: rupees(7_000_000) }), 'TERM-1')).toEqual({
      id: 'TERM-1', horizon: 'm12', categoryId: 'term', params: { multipleTenths: 72, fullNeedPaise: rupees(9_600_000), gapToFullPaise: rupees(2_600_000) },
    });
  });
  it('INV-1: investing 15% of income, the 20% level is Rs 16,000 a month, Rs 4,000 more than now', () => {
    expect(stepOf(base({ income: rupees(80_000), investments: rupees(12_000) }), 'INV-1')).toEqual({
      id: 'INV-1', horizon: 'm12', categoryId: 'investment', params: { pctTenths: 150, fullNeedPaise: rupees(16_000), topUpToFullPaise: rupees(4_000) },
    });
  });
});

describe('selectNextSteps and rankFindings without alerts', () => {
  const values = base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(10_000), investments: rupees(15_000), termCover: 0, savings: 0, healthCover: 0 });
  const result = scoreHealthCheck(values);
  const figures = computeFigures(values);
  it('gives the same steps for null, undefined and an empty list, which are the steps with the cash-flow step left out', () => {
    const withAlerts = selectNextSteps(figures, result, buildAlerts(values, result));
    expect(withAlerts.some((s) => s.id === 'CASH-INV')).toBe(true);
    const without = withAlerts.filter((s) => !s.id.startsWith('CASH'));
    expect(without.length).toBe(withAlerts.length - 1);
    [null, undefined, []].forEach((none) => expect(selectNextSteps(figures, result, none)).toEqual(without));
  });
  it('rankFindings needs no alerts at all, and its default table is the engine table', () => {
    expect(rankFindings(result)).toEqual(rankFindings(result, SEVERITY_TABLE));
    expect(rankFindings(result, undefined)).toEqual(rankFindings(result));
  });
  it('refuses a cash-flow alert that has no valid kind', () => {
    for (const broken of [{ id: 'A3', detail: null }, { id: 'A3', detail: { kind: 'debt' } }, { id: 'A3' }]) {
      try { selectNextSteps(figures, result, [broken]); expect.unreachable('should have thrown'); } catch (error) { expect(error).toBeInstanceOf(InsightsInputError); expect(error.code).toBe('alert-invalid'); }
    }
  });
});

describe('invalid input can be handled safely by UI code', () => {
  const cases = [
    [base({ income: 0 }), 'income-required', 'income'], [base({ income: -1 }), 'amount-invalid', 'income'], [base({ emi: 1.5 }), 'amount-invalid', 'emi'],
    [base({ savings: Number.NaN }), 'amount-invalid', 'savings'], [base({ termCover: '5' }), 'amount-invalid', 'termCover'], [base({ healthCover: undefined }), 'amount-invalid', 'healthCover'],
    [base({ expenses: 123_456_789_123_456 }), 'amount-too-large', 'expenses'], [base({ investments: MAX_AMOUNT_PAISE + 1 }), 'amount-too-large', 'investments'],
    [base({ overlap: 'maybe' }), 'choice-invalid', 'overlap'], [base({ business: 'x' }), 'choice-invalid', 'business'],
    [null, 'amount-invalid', 'income'], [undefined, 'amount-invalid', 'income'], ['text', 'amount-invalid', 'income'], [[], 'amount-invalid', 'income'], [{}, 'amount-invalid', 'income'],
  ];
  it('buildInsights throws a typed error with a stable code and field, and a message that repeats no value', () => {
    for (const [values, code, field] of cases) {
      let caught;
      try { buildInsights(values); } catch (error) { caught = error; }
      expect(caught, `${code}/${field}`).toBeInstanceOf(InsightsInputError);
      expect(caught).toBeInstanceOf(RangeError);
      expect(caught.name).toBe('InsightsInputError');
      expect([caught.code, caught.field]).toEqual([code, field]);
      expect(caught.message).not.toMatch(/\d{4,}/);
    }
  });
  it('tryBuildInsights never throws: it returns { ok: false, error: { code, field, message } } with the same code and field', () => {
    for (const [values, code, field] of cases) {
      const outcome = tryBuildInsights(values);
      expect(Object.keys(outcome).sort()).toEqual(['error', 'ok']);
      expect(outcome.ok).toBe(false);
      expect(outcome.error).toEqual({ code, field, message: expect.any(String) });
      expect(outcome.error.message).not.toMatch(/\d{4,}/);
      expect(Object.isFrozen(outcome)).toBe(true);
    }
  });
  it('tryBuildInsights returns { ok: true, insights } for a valid input, the same as buildInsights, frozen', () => {
    const values = base();
    const outcome = tryBuildInsights(values);
    expect(Object.keys(outcome).sort()).toEqual(['insights', 'ok']);
    expect(outcome.ok).toBe(true);
    expect(JSON.stringify(outcome.insights)).toBe(JSON.stringify(buildInsights(values)));
    expect(isDeepFrozen(outcome)).toBe(true);
  });
  it('tryBuildInsights hides anything unexpected behind a fixed message, even if reading the input throws', () => {
    const trap = Object.defineProperty({}, 'income', { get() { throw new Error('secret 12345 internal detail'); } });
    const proxy = new Proxy({}, { get() { throw new Error('secret 12345 internal detail'); } });
    for (const hostile of [trap, proxy]) {
      const outcome = tryBuildInsights(hostile);
      expect(outcome).toEqual({ ok: false, error: { code: 'unexpected', field: null, message: 'The insights could not be calculated.' } });
    }
  });
  it('a result that is not a score result is refused with its own code', () => {
    let caught;
    try { buildAlerts(base(), {}); } catch (error) { caught = error; }
    expect(caught).toBeInstanceOf(InsightsInputError);
    expect(caught.code).toBe('result-invalid');
  });
});

describe('MAX_AMOUNT_PAISE and the safe-integer boundary', () => {
  it('is the form limit for balances in paise, and every product the engine forms from it is an exact integer with a wide margin', () => {
    expect(MAX_AMOUNT_PAISE).toBe(LIMITS.balanceMaxRupees * 100);
    expect(MONTHLY_MAX).toBeLessThanOrEqual(MAX_AMOUNT_PAISE);
    [MAX_AMOUNT_PAISE * 1000, MAX_AMOUNT_PAISE * 12 * 10, MAX_AMOUNT_PAISE * 120, MAX_AMOUNT_PAISE * 45, MAX_AMOUNT_PAISE * 3 + MAX_AMOUNT_PAISE * 2].forEach((n) => expect(Number.isSafeInteger(n)).toBe(true));
    expect(MAX_AMOUNT_PAISE * 1000 * 50).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER); // the largest multiplier still has a 50x margin
  });
  it('accepts every field at exactly the maximum and refuses one paisa more, naming the field', () => {
    const everyField = ['income', 'expenses', 'emi', 'savings', 'termCover', 'healthCover', 'investments'];
    const atMax = base(Object.fromEntries(everyField.map((field) => [field, MAX_AMOUNT_PAISE])));
    expect(tryBuildInsights(atMax).ok).toBe(true);
    for (const field of everyField) {
      const outcome = tryBuildInsights({ ...atMax, [field]: MAX_AMOUNT_PAISE + 1 });
      expect(outcome.error, field).toEqual({ code: 'amount-too-large', field, message: `${field} must be a whole number of paise within the supported maximum` });
    }
  });
});

describe('the documented output shapes', () => {
  const insights = buildInsights(base({ income: rupees(50_000), expenses: rupees(30_000), emi: rupees(25_000), investments: rupees(10_000), termCover: 0, savings: 0, healthCover: 0 }));
  const keys = (object) => Object.keys(object).sort();
  const sorted = (list) => [...list].sort();
  it('info is { withEmiRunway: { applies, monthsTenths } } and nothing else', () => {
    expect(keys(insights.info)).toEqual(['withEmiRunway']);
    expect(keys(insights.info.withEmiRunway)).toEqual(['applies', 'monthsTenths']);
    expect(buildInsights(base({ emi: 0 })).info).toEqual({ withEmiRunway: { applies: false, monthsTenths: null } });
  });
  it('each figure group has exactly its documented fields', () => {
    expect(keys(insights.figures.emi)).toEqual(sorted(['pctTenths', 'tier', 'fullLimitPaise', 'partialLimitPaise', 'partialDistinct', 'reductionToFullPaise', 'reductionToPartialPaise']));
    expect(keys(insights.figures.lifeBenchmark)).toEqual(sorted(['coverPaise', 'multipleTenths', 'tier', 'fullNeedPaise', 'partialNeedPaise', 'gapToFullPaise', 'gapToPartialPaise']));
    expect(keys(insights.figures.runway)).toEqual(sorted(['applies', 'monthsTenths', 'tier', 'fullNeedPaise', 'partialNeedPaise', 'gapToFullPaise', 'gapToPartialPaise']));
    expect(keys(insights.figures.investmentRate)).toEqual(sorted(['pctTenths', 'tier', 'fullNeedPaise', 'partialNeedPaise', 'partialDistinct', 'topUpToFullPaise', 'topUpToPartialPaise']));
    expect(keys(insights.figures.healthReference)).toEqual(sorted(['coverPaise', 'referencePaise', 'tier', 'gapPaise']));
    expect(keys(insights.figures.cashFlow)).toEqual(sorted(['incomePaise', 'essentialsPaise', 'emiPaise', 'investmentsPaise', 'essentialsPlusEmiPaise', 'committedPaise', 'unallocatedPaise', 'exceedsIncome', 'overByPaise', 'essentialsAndEmiOverByPaise', 'roomBeforeInvestmentsPaise']));
  });
  it('alerts, steps, findings, reasons and severity have exactly their documented fields', () => {
    insights.alerts.forEach((alert) => expect(keys(alert)).toEqual(['categoryId', 'detail', 'id', 'severity', 'tier']));
    expect(keys(insights.alerts.find((a) => a.id === 'A3').detail)).toEqual(sorted(['kind', 'incomePaise', 'essentialsPaise', 'emiPaise', 'investmentsPaise', 'essentialsPlusEmiPaise', 'committedPaise', 'overByPaise', 'essentialsAndEmiOverByPaise', 'roomBeforeInvestmentsPaise']));
    insights.steps.forEach((step) => expect(keys(step)).toEqual(['categoryId', 'horizon', 'id', 'params']));
    expect(keys(insights.findings)).toEqual(['improvements', 'strengths']);
    expect(keys(insights.reasons)).toEqual(['applicable', 'earned', 'lost', 'notApplicable', 'scaled', 'score']);
    expect(['high', 'medium', 'low', null]).toEqual(expect.arrayContaining(Object.values(insights.severity)));
  });
  it('the formatters add a symbol where there is one and never a unit word, and say "more than" above their ceiling', () => {
    expect([formatPercentTenths(188), formatMultipleTenths(52), formatMonthsTenths(85)]).toEqual(['18.8%', '5.2×', '8.5']);
    expect([formatPercentTenths(10_001), formatMultipleTenths(10_001), formatMonthsTenths(12_001)]).toEqual(['more than 1,000%', 'more than 1,000×', 'more than 1,200']);
    expect(formatMonthsTenths(12_001)).not.toMatch(/month|year/i);
  });
});
