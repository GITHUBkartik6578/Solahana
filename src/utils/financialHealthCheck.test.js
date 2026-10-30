import { createHash } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import {
  ALLOWED_POINTS,
  BAND_IDS,
  CATEGORY_IDS,
  CATEGORY_MAX,
  CONSENT_TEXTS,
  CONSENT_VERSION,
  LIMITS,
  MESSAGES,
  SCORING_VERSION,
  applicableMax,
  bandFor,
  buildLeadPayload,
  checkLeadResult,
  normalizeScore,
  scoreHealthCheck,
  validateInputs,
} from './financialHealthCheck';

/**
 * Amounts below are in rupees for readability; `paise` turns them into the whole-number paise the scorer works on.
 * Base person: income 1,00,000 a month, EMI exactly 30% of it, savings exactly 6 months of expenses, term cover exactly
 * 10x annual income, health cover exactly 10 lakh, investing exactly 20%: every category sits on its top boundary.
 */
const BASE = {
  income: 100000,
  expenses: 50000,
  emi: 30000,
  savings: 300000,
  termCover: 12000000,
  healthCover: 1000000,
  investments: 20000,
  overlap: 'yes',
  business: 'yes',
};
const paise = (rupees) => Math.round(rupees * 100);
const values = (overrides = {}) => {
  const merged = { ...BASE, ...overrides };
  return {
    income: paise(merged.income),
    expenses: paise(merged.expenses),
    emi: paise(merged.emi),
    savings: paise(merged.savings),
    termCover: paise(merged.termCover),
    healthCover: paise(merged.healthCover),
    investments: paise(merged.investments),
    overlap: merged.overlap,
    business: merged.business,
  };
};
const score = (overrides) => scoreHealthCheck(values(overrides));

describe('model constants', () => {
  it('the category maximums add up to exactly 100', () => {
    expect(CATEGORY_IDS.reduce((sum, id) => sum + CATEGORY_MAX[id], 0)).toBe(100);
    expect(CATEGORY_MAX).toEqual({ emi: 20, term: 20, emergency: 20, investment: 15, health: 15, overlap: 5, shielding: 5 });
  });
  it('every category can only produce its listed point values, and the top value equals its maximum', () => {
    CATEGORY_IDS.forEach((id) => expect(Math.max(...ALLOWED_POINTS[id])).toBe(CATEGORY_MAX[id]));
  });
  it('the three bands are the approved ones', () => expect(BAND_IDS).toEqual(['strong', 'good', 'attention']));
});

describe('scoring: a person on every top boundary scores 100', () => {
  it('earns 100 of 100 points, in the strong band', () => {
    const r = score();
    expect(r.points).toEqual({ emi: 20, term: 20, emergency: 20, investment: 15, health: 15, overlap: 5, shielding: 5 });
    expect([r.earned, r.applicable, r.score, r.band]).toEqual([100, 100, 100, 'strong']);
    expect(r.scoringVersion).toBe(SCORING_VERSION);
  });
});

describe('scoring: each category, exact boundaries (inclusive) and the paise just beyond them', () => {
  it('EMI / income: <=30% is 20, <=45% is 10, above is 0', () => {
    expect(score({ emi: 30000 }).points.emi).toBe(20);
    expect(score({ emi: 30000.01 }).points.emi).toBe(10);
    expect(score({ emi: 45000 }).points.emi).toBe(10);
    expect(score({ emi: 45000.01 }).points.emi).toBe(0);
    expect(score({ emi: 0 }).points.emi).toBe(20); // no EMI is a valid answer and a full score
    expect(score({ emi: 90000 }).points.emi).toBe(0); // EMI can exceed income
  });
  it('term cover / annual income (income x 12): >=10x is 20, >=5x is 10, below is 0', () => {
    expect(score({ termCover: 12000000 }).points.term).toBe(20);
    expect(score({ termCover: 11999999.99 }).points.term).toBe(10);
    expect(score({ termCover: 6000000 }).points.term).toBe(10);
    expect(score({ termCover: 5999999.99 }).points.term).toBe(0);
    expect(score({ termCover: 0 }).points.term).toBe(0);
  });
  it('emergency savings in months of fixed expenses (EMI is not part of them): >=6 is 20, >=3 is 10, below is 0', () => {
    expect(score({ savings: 300000 }).points.emergency).toBe(20);
    expect(score({ savings: 299999.99 }).points.emergency).toBe(10);
    expect(score({ savings: 150000 }).points.emergency).toBe(10);
    expect(score({ savings: 149999.99 }).points.emergency).toBe(0);
    expect(score({ savings: 0 }).points.emergency).toBe(0);
    // EMI has no effect on the emergency months: a much larger EMI leaves the same points
    expect(score({ emi: 90000 }).points.emergency).toBe(20);
  });
  it('investment rate on monthly in-hand income: >=20% is 15, >=10% is 8, below is 0', () => {
    expect(score({ investments: 20000 }).points.investment).toBe(15);
    expect(score({ investments: 19999.99 }).points.investment).toBe(8);
    expect(score({ investments: 10000 }).points.investment).toBe(8);
    expect(score({ investments: 9999.99 }).points.investment).toBe(0);
    expect(score({ investments: 0 }).points.investment).toBe(0);
  });
  it('health cover: Rs 10 lakh or more is 15, anything below is 0 (no partial tier)', () => {
    expect(score({ healthCover: 1000000 }).points.health).toBe(15);
    expect(score({ healthCover: 999999.99 }).points.health).toBe(0);
    expect(score({ healthCover: 0 }).points.health).toBe(0);
    expect(score({ healthCover: LIMITS.balanceMaxRupees }).points.health).toBe(15);
  });
  it('overlap audit: yes is 5, no is 0', () => {
    expect(score({ overlap: 'yes' }).points.overlap).toBe(5);
    expect(score({ overlap: 'no' }).points.overlap).toBe(0);
  });
  it('business shielding: yes is 5, no or not sure is 0, not applicable leaves the category out', () => {
    expect(score({ business: 'yes' }).points.shielding).toBe(5);
    expect(score({ business: 'no' }).points.shielding).toBe(0);
    expect(score({ business: 'na' }).points.shielding).toBeNull();
  });
  it('the ratios use the income as typed: a bigger income moves every boundary', () => {
    expect(score({ income: 200000, emi: 60000 }).points.emi).toBe(20);
    expect(score({ income: 200000, emi: 60000.01 }).points.emi).toBe(10);
    expect(score({ income: 200000, termCover: 23999999 }).points.term).toBe(10);
  });
});

describe('scoring: the four applicable maximums and the normalisation', () => {
  it('business owner with fixed expenses: 100 applicable, the score is the earned points', () => {
    const r = score({ business: 'yes' });
    expect([r.applicable, r.earned, r.score]).toEqual([100, 100, 100]);
    expect(applicableMax({ shieldingApplicable: true, emergencyMeasurable: true })).toBe(100);
  });
  it('no business, with fixed expenses: 95 applicable, earned x 100 / 95 rounded', () => {
    const full = score({ business: 'na' });
    expect([full.applicable, full.earned, full.score]).toEqual([95, 95, 100]);
    const partial = score({ business: 'na', termCover: 6000000, investments: 10000 }); // 20+10+20+8+15+5 = 78
    expect([partial.earned, partial.applicable, partial.score]).toEqual([78, 95, 82]); // 82.1
    expect(applicableMax({ shieldingApplicable: false, emergencyMeasurable: true })).toBe(95);
  });
  it('business owner with no fixed expenses: the emergency fund is not measurable, 80 applicable', () => {
    const r = score({ expenses: 0 });
    expect(r.points.emergency).toBeNull();
    expect(r.emergencyMeasurable).toBe(false);
    expect([r.earned, r.applicable, r.score]).toEqual([80, 80, 100]);
    const partial = score({ expenses: 0, termCover: 6000000 }); // 20+10+15+15+5+5 = 70
    expect([partial.earned, partial.applicable, partial.score]).toEqual([70, 80, 88]); // 87.5 rounds up
  });
  it('no business and no fixed expenses: both are left out, 75 applicable', () => {
    const r = score({ expenses: 0, business: 'na' });
    expect(r.points.emergency).toBeNull();
    expect(r.points.shielding).toBeNull();
    expect([r.earned, r.applicable, r.score]).toEqual([75, 75, 100]);
    const partial = score({ expenses: 0, business: 'na', overlap: 'no', emi: 45000 }); // 10+20+15+15 = 60
    expect([partial.earned, partial.applicable, partial.score]).toEqual([60, 75, 80]);
    expect(applicableMax({ shieldingApplicable: false, emergencyMeasurable: false })).toBe(75);
  });
  it('zero fixed expenses never produces automatic full marks, a penalty, NaN or Infinity', () => {
    const rich = score({ expenses: 0, savings: LIMITS.balanceMaxRupees });
    const poor = score({ expenses: 0, savings: 0 });
    expect(rich.points.emergency).toBeNull();
    expect(poor.points.emergency).toBeNull();
    expect(rich.score).toBe(poor.score); // the savings cannot matter when the emergency fund is not measured
    [rich, poor].forEach((r) => expect(Number.isInteger(r.score)).toBe(true));
  });
  it('normalizeScore rounds half up with whole numbers: examples for every applicable maximum', () => {
    [
      [95, 95, 100], [85, 95, 89], [47, 95, 49], [90, 95, 95],
      [75, 75, 100], [60, 75, 80], [58, 75, 77], [55, 75, 73],
      [80, 80, 100], [60, 80, 75], [45, 80, 56],
      [60, 100, 60], [0, 100, 0], [0, 75, 0],
    ].forEach(([earned, applicable, expected]) => expect(normalizeScore(earned, applicable)).toBe(expected));
  });
  it('the whole-number formula equals Math.round(earned * 100 / applicable) for every possible total', () => {
    [100, 95, 80, 75].forEach((applicable) => {
      for (let earned = 0; earned <= applicable; earned += 1) {
        expect(normalizeScore(earned, applicable)).toBe(Math.round((earned * 100) / applicable));
      }
    });
  });
  it('only a complete score reaches 100, and the score never goes down when points go up', () => {
    [100, 95, 80, 75].forEach((applicable) => {
      for (let earned = 0; earned < applicable; earned += 1) expect(normalizeScore(earned, applicable)).toBeLessThan(100);
      for (let earned = 1; earned <= applicable; earned += 1) {
        expect(normalizeScore(earned, applicable)).toBeGreaterThanOrEqual(normalizeScore(earned - 1, applicable));
      }
    });
  });
  it('normalizeScore refuses impossible input instead of returning NaN', () => {
    expect(() => normalizeScore(10, 0)).toThrow(RangeError);
    expect(() => normalizeScore(101, 100)).toThrow(RangeError);
    expect(() => normalizeScore(-1, 100)).toThrow(RangeError);
    expect(() => normalizeScore(1.5, 100)).toThrow(RangeError);
  });
});

describe('bands (80-100, 50-79, 0-49, inclusive, on the normalised score)', () => {
  it('maps every score to one band', () => {
    expect([0, 49].map(bandFor)).toEqual(['attention', 'attention']);
    expect([50, 79].map(bandFor)).toEqual(['good', 'good']);
    expect([80, 100].map(bandFor)).toEqual(['strong', 'strong']);
  });
  it('the earned points that cross each band edge depend on the applicable maximum', () => {
    const firstEarnedAtLeast = (target, applicable) => {
      for (let e = 0; e <= applicable; e += 1) if (normalizeScore(e, applicable) >= target) return e;
      return null;
    };
    expect([100, 95, 80, 75].map((a) => firstEarnedAtLeast(50, a))).toEqual([50, 48, 40, 38]);
    expect([100, 95, 80, 75].map((a) => firstEarnedAtLeast(80, a))).toEqual([80, 76, 64, 60]);
  });
});

describe('scoring refuses input it cannot score safely', () => {
  it('income must be above zero (three ratios divide by it)', () => {
    expect(() => scoreHealthCheck({ ...values(), income: 0 })).toThrow(RangeError);
  });
  it('amounts must be whole paise', () => {
    expect(() => scoreHealthCheck({ ...values(), emi: 100.5 })).toThrow(RangeError);
    expect(() => scoreHealthCheck({ ...values(), savings: -1 })).toThrow(RangeError);
    expect(() => scoreHealthCheck({ ...values(), termCover: Number.NaN })).toThrow(RangeError);
    expect(() => scoreHealthCheck({ ...values(), termCover: undefined })).toThrow(RangeError);
  });
  it('the two choices must be valid', () => {
    expect(() => scoreHealthCheck({ ...values(), overlap: 'maybe' })).toThrow(RangeError);
    expect(() => scoreHealthCheck({ ...values(), business: '' })).toThrow(RangeError);
  });
});

describe('validateInputs', () => {
  const typed = {
    income: '1,00,000', expenses: '50k', emi: '30000', savings: '3 lakh', termCover: '1.2 cr', healthCover: '10 lakh', investments: '₹20,000',
    overlap: 'yes', business: 'yes',
  };
  it('accepts plain amounts and lakh / crore / k shorthand and converts them to whole paise', () => {
    const r = validateInputs(typed);
    expect(r.ok).toBe(true);
    expect(r.values).toEqual({
      income: 10000000, expenses: 5000000, emi: 3000000, savings: 30000000, termCover: 1200000000, healthCover: 100000000, investments: 2000000,
      overlap: 'yes', business: 'yes',
    });
    expect(scoreHealthCheck(r.values).score).toBe(100);
  });
  it('a blank field is missing, never 0, and each blank gets its own message', () => {
    const r = validateInputs({ ...typed, income: '', emi: '   ', expenses: undefined, savings: null });
    expect(r.ok).toBe(false);
    expect(r.errors.income).toBe(MESSAGES.income);
    expect(r.errors.emi).toBe(MESSAGES.blank);
    expect(r.errors.expenses).toBe(MESSAGES.blank);
    expect(r.errors.savings).toBe(MESSAGES.blank);
    expect(r.values).toBeNull();
  });
  it('0 is a valid answer for everything except income (EMI, expenses, savings, cover, investments)', () => {
    const r = validateInputs({ ...typed, emi: '0', expenses: '0', savings: '0', termCover: '0', healthCover: '0', investments: '0' });
    expect(r.ok).toBe(true);
    expect(validateInputs({ ...typed, income: '0' }).errors.income).toBe(MESSAGES.income);
    expect(validateInputs({ ...typed, income: '0.00' }).errors.income).toBe(MESSAGES.income);
  });
  it('rejects negative, non-numeric, scientific, wrong-unit and over-precise amounts', () => {
    ['-5', '-0', 'abc', '1e5', '12 months', '5 lakhs crore', '1..2', '50000.126', '0x10', 'Infinity', 'NaN', '₹'].forEach((bad) => {
      const r = validateInputs({ ...typed, emi: bad });
      expect(r.errors.emi, bad).toBe(MESSAGES.invalid);
    });
    expect(validateInputs({ ...typed, emi: -1 }).errors.emi).toBe(MESSAGES.invalid);
    expect(validateInputs({ ...typed, emi: Number.NaN }).errors.emi).toBe(MESSAGES.invalid);
    expect(validateInputs({ ...typed, emi: 12.345 }).errors.emi).toBe(MESSAGES.invalid);
  });
  it('enforces the limits: monthly amounts up to Rs 1 crore, balances and cover up to Rs 100 crore, both ends inclusive', () => {
    expect(validateInputs({ ...typed, income: '1 cr' }).ok).toBe(true);
    expect(validateInputs({ ...typed, income: '10000000.01' }).errors.income).toBe(MESSAGES.monthlyMax);
    expect(validateInputs({ ...typed, expenses: '1.01 cr' }).errors.expenses).toBe(MESSAGES.monthlyMax);
    expect(validateInputs({ ...typed, emi: '2 cr' }).errors.emi).toBe(MESSAGES.monthlyMax);
    expect(validateInputs({ ...typed, investments: '1.5 cr' }).errors.investments).toBe(MESSAGES.monthlyMax);
    expect(validateInputs({ ...typed, savings: '100 cr' }).ok).toBe(true);
    expect(validateInputs({ ...typed, savings: '100.01 cr' }).errors.savings).toBe(MESSAGES.balanceMax);
    expect(validateInputs({ ...typed, termCover: '101 cr' }).errors.termCover).toBe(MESSAGES.balanceMax);
    expect(validateInputs({ ...typed, healthCover: '500 cr' }).errors.healthCover).toBe(MESSAGES.balanceMax);
  });
  it('the two choices are required and limited to their options', () => {
    expect(validateInputs({ ...typed, overlap: '' }).errors.overlap).toBe(MESSAGES.choose);
    expect(validateInputs({ ...typed, overlap: 'na' }).errors.overlap).toBe(MESSAGES.choose);
    expect(validateInputs({ ...typed, business: undefined }).errors.business).toBe(MESSAGES.choose);
    expect(validateInputs({ ...typed, business: 'maybe' }).errors.business).toBe(MESSAGES.choose);
    expect(validateInputs({ ...typed, business: 'na' }).ok).toBe(true);
  });
  it('copes with a missing or odd input object', () => {
    [undefined, null, 5, 'x', []].forEach((odd) => expect(validateInputs(odd).ok).toBe(false));
  });
  it('the exact limit amounts survive the paise conversion and still score', () => {
    const r = validateInputs({ ...typed, income: '1 cr', savings: '100 cr', termCover: '100 cr', healthCover: '100 cr', emi: '1 cr', expenses: '1 cr', investments: '1 cr' });
    expect(r.ok).toBe(true);
    const scored = scoreHealthCheck(r.values);
    expect(Number.isSafeInteger(r.values.savings * 100)).toBe(true);
    expect(scored.points.emi).toBe(0); // EMI equal to income is 100%
    expect(scored.points.investment).toBe(15);
  });
});

describe('checkLeadResult (what the server verifies)', () => {
  const good = () => JSON.parse(JSON.stringify(score({ business: 'na', termCover: 6000000 })));
  it('accepts every result the scorer can produce', () => {
    const cases = [{}, { business: 'na' }, { expenses: 0 }, { expenses: 0, business: 'na' }, { business: 'no', emi: 90000, savings: 0, termCover: 0, healthCover: 0, investments: 0, overlap: 'no' }];
    cases.forEach((c) => expect(checkLeadResult(JSON.parse(JSON.stringify(score(c)))), JSON.stringify(c)).toEqual([]));
  });
  it('rejects a points value no category can produce', () => {
    const r = good();
    r.points.emi = 15;
    expect(checkLeadResult(r).length).toBeGreaterThan(0);
  });
  it('rejects points on a category that does not apply, and missing points on one that does', () => {
    const noBusiness = good();
    noBusiness.points.shielding = 5;
    expect(checkLeadResult(noBusiness).length).toBeGreaterThan(0);
    const owner = JSON.parse(JSON.stringify(score()));
    owner.points.shielding = null;
    expect(checkLeadResult(owner).length).toBeGreaterThan(0);
  });
  it('rejects a wrong applicable maximum, earned total, score or band', () => {
    const a = good(); a.applicable = 100;
    const e = good(); e.earned += 1;
    const s = good(); s.score += 1;
    const b = good(); b.band = 'attention'; // the real score is 89, which is the strong band
    [a, e, s, b].forEach((r) => expect(checkLeadResult(r).length).toBeGreaterThan(0));
  });
  it('rejects a wrong scoring version and non-boolean flags', () => {
    const v = good(); v.scoringVersion = 'hc-v0';
    const f = good(); f.emergencyMeasurable = 'yes';
    [v, f].forEach((r) => expect(checkLeadResult(r).length).toBeGreaterThan(0));
    [undefined, null, 5, 'x'].forEach((odd) => expect(checkLeadResult(odd).length).toBeGreaterThan(0));
  });
  it('the problem messages never repeat the submitted values', () => {
    const r = good();
    r.points.emi = 7777;
    expect(checkLeadResult(r).join(' ')).not.toContain('7777');
  });
});

describe('the callback payload (the only thing sent to the server)', () => {
  const result = score({ expenses: 0, business: 'na' });
  const payload = buildLeadPayload({ fullName: '  Priya Sharma ', phone: ' 98765 43210 ', result });

  it('has exactly the approved keys and nothing else', () => {
    expect(Object.keys(payload).sort()).toEqual(['consent', 'fullName', 'phone', 'result', 'source']);
    expect(Object.keys(payload.consent).sort()).toEqual(['callback', 'textVersion']);
    expect(Object.keys(payload.result).sort()).toEqual(
      ['applicable', 'band', 'earned', 'emergencyMeasurable', 'points', 'score', 'scoringVersion', 'shieldingApplicable']
    );
    expect(Object.keys(payload.result.points).sort()).toEqual([...CATEGORY_IDS].sort());
  });
  it('carries the consent version that exists in the allowlist, and an explicit consent', () => {
    expect(payload.consent).toEqual({ callback: true, textVersion: CONSENT_VERSION });
    expect(Object.keys(CONSENT_TEXTS)).toContain(payload.consent.textVersion);
  });
  it('is consistent, and contains no amount even when the result object is padded with extra fields', () => {
    expect(checkLeadResult(payload.result)).toEqual([]);
    const padded = { ...result, income: 10000000, savings: 123456789, rawAnswers: { income: '1,00,000' } };
    const p = buildLeadPayload({ fullName: 'A B', phone: '9876543210', result: padded });
    const text = JSON.stringify(p);
    ['10000000', '123456789', 'rawAnswers', '1,00,000', 'income', 'savings'].forEach((needle) => expect(text).not.toContain(needle));
  });
  it('trims the contact details and nothing else is invented', () => {
    expect(payload.fullName).toBe('Priya Sharma');
    expect(payload.phone).toBe('98765 43210');
    expect(payload.source).toBe('financial_health_checkup');
  });
});

describe('consent texts', () => {
  it('the current text says what the approved wording says', () => {
    const text = CONSENT_TEXTS[CONSENT_VERSION];
    expect(text).toContain('call me on the mobile number above');
    expect(text).toContain('stored for this purpose for up to 24 months');
    expect(text).toContain('Privacy Policy');
  });
  it('the allowlist is frozen so a version cannot be edited at run time', () => {
    expect(Object.isFrozen(CONSENT_TEXTS)).toBe(true);
  });
  // Stored consent records point at this wording by version and by hash. If this test fails, the published text of
  // "hc-consent-v1" was edited: restore it and add a new version (for example hc-consent-v2) instead.
  it('hc-consent-v1 is pinned: exact wording and exact SHA-256', () => {
    expect(CONSENT_VERSION).toBe('hc-consent-v1');
    expect(Object.keys(CONSENT_TEXTS)).toEqual(['hc-consent-v1']);
    const text = CONSENT_TEXTS['hc-consent-v1'];
    expect(text).toBe(
      'I agree that Solahana may call me on the mobile number above about my Financial Health Check-up result, and that my name, number and score are stored for this purpose for up to 24 months. I have read the Privacy Policy.'
    );
    expect(createHash('sha256').update(text).digest('hex')).toBe('6664f139c1b5483274d6c3db4005a29237c5145847f7954888d6f95c3e422bce');
  });
});
