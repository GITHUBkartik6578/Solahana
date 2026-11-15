/**
 * Solahana Financial Health Check-up: the scoring model, input validation and the callback payload, as pure functions.
 *
 * Plain ESM with a single relative import, so the browser (which calculates the score) and the server (which only
 * validates that a submitted result is consistent) use the same constants and the same rules.
 *
 * Money is handled in paise (whole numbers), and every comparison is a cross-multiplication on those integers, never a
 * divide-then-compare, so a value exactly on a boundary (30% EMI, 10x term cover, 6 months of expenses...) is
 * decided exactly. The raw amounts the person types are used in the browser only: they are never part of the payload
 * built here, and the server never receives them.
 */
import { parseAmount, wasAmountRounded } from './hlvCalculator.js';

export const SCORING_VERSION = 'hc-v1';
export const RETENTION_MONTHS = 24;

/**
 * Consent wording. The version string is what a submitted record carries; the server only accepts versions listed
 * here, and keeps a hash of the matching text, so a stored consent record always points at the exact wording shown.
 * Never edit a published text in place: add a new version instead.
 */
export const CONSENT_VERSION = 'hc-consent-v1';
export const CONSENT_TEXTS = Object.freeze({
  'hc-consent-v1':
    'I agree that Solahana may call me on the mobile number above about my Financial Health Check-up result, and that my name, number and score are stored for this purpose for up to 24 months. I have read the Privacy Policy.',
});

export const CATEGORY_IDS = Object.freeze(['emi', 'term', 'emergency', 'investment', 'health', 'overlap', 'shielding']);

export const CATEGORY_MAX = Object.freeze({ emi: 20, term: 20, emergency: 20, investment: 15, health: 15, overlap: 5, shielding: 5 });

/** The only point values each category can ever produce. */
export const ALLOWED_POINTS = Object.freeze({
  emi: [0, 10, 20],
  term: [0, 10, 20],
  emergency: [0, 10, 20],
  investment: [0, 8, 15],
  health: [0, 15],
  overlap: [0, 5],
  shielding: [0, 5],
});

export const BAND_IDS = Object.freeze(['strong', 'good', 'attention']);

/** Input limits, in rupees: monthly amounts up to Rs 1 crore, balances and cover up to Rs 100 crore. */
export const LIMITS = Object.freeze({
  monthlyMaxRupees: 10_000_000,
  balanceMaxRupees: 1_000_000_000,
  healthThresholdRupees: 1_000_000,
});

export const MESSAGES = Object.freeze({
  income: 'Enter your monthly in-hand income; it must be more than ₹0.',
  blank: 'Enter an amount, or 0 if none.',
  monthlyMax: 'Amount can be at most ₹1 crore per month.',
  balanceMax: 'Amount can be at most ₹100 crore.',
  invalid: 'Please enter a valid amount, for example 50000, 50k or 1.5 lakh.',
  choose: 'Please choose an option.',
});

/** kind: 'income' = monthly and must be above 0, 'monthly' = monthly, 'balance' = a balance or a cover amount. */
export const MONEY_FIELDS = Object.freeze({
  income: 'income',
  expenses: 'monthly',
  emi: 'monthly',
  savings: 'balance',
  termCover: 'balance',
  healthCover: 'balance',
  investments: 'monthly',
});

export const OVERLAP_CHOICES = Object.freeze(['yes', 'no']);
export const BUSINESS_CHOICES = Object.freeze(['yes', 'no', 'na']);

const toPaise = (rupees) => Math.round(rupees * 100);
const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

/**
 * Checks everything the person typed. Returns { ok, errors, values } where errors is keyed by field name and values holds
 * the amounts in paise (only when ok). Blank is "missing", never 0: a person who has no EMI has to enter 0.
 */
export function validateInputs(raw) {
  const input = raw && typeof raw === 'object' ? raw : {};
  const errors = {};
  const values = {};

  Object.entries(MONEY_FIELDS).forEach(([field, kind]) => {
    const value = input[field];
    if (isBlank(value)) {
      errors[field] = kind === 'income' ? MESSAGES.income : MESSAGES.blank;
      return;
    }
    const rupees = parseAmount(value);
    if (!Number.isFinite(rupees) || rupees < 0 || wasAmountRounded(value)) {
      errors[field] = MESSAGES.invalid;
      return;
    }
    if (kind === 'income' && rupees <= 0) {
      errors[field] = MESSAGES.income;
      return;
    }
    const max = kind === 'balance' ? LIMITS.balanceMaxRupees : LIMITS.monthlyMaxRupees;
    if (rupees > max) {
      errors[field] = kind === 'balance' ? MESSAGES.balanceMax : MESSAGES.monthlyMax;
      return;
    }
    values[field] = toPaise(rupees);
  });

  if (OVERLAP_CHOICES.includes(input.overlap)) values.overlap = input.overlap;
  else errors.overlap = MESSAGES.choose;

  if (BUSINESS_CHOICES.includes(input.business)) values.business = input.business;
  else errors.business = MESSAGES.choose;

  const ok = Object.keys(errors).length === 0;
  return { ok, errors, values: ok ? values : null };
}

/** Maximum points that apply: 100, minus 5 without a business, minus 20 when no fixed expenses make the emergency fund measurable. */
export function applicableMax({ shieldingApplicable, emergencyMeasurable }) {
  return 100 - (shieldingApplicable ? 0 : CATEGORY_MAX.shielding) - (emergencyMeasurable ? 0 : CATEGORY_MAX.emergency);
}

/** round-half-up(earned x 100 / applicable), in integers. With 100 applicable points the score is the earned points. */
export function normalizeScore(earned, applicable) {
  if (!Number.isInteger(earned) || !Number.isInteger(applicable) || applicable <= 0 || earned < 0 || earned > applicable) {
    throw new RangeError('earned and applicable must be whole numbers with 0 <= earned <= applicable');
  }
  return Math.floor((earned * 200 + applicable) / (2 * applicable));
}

/** 80-100 strong, 50-79 good, 0-49 attention (on the normalised score). */
export function bandFor(score) {
  if (score >= 80) return 'strong';
  if (score >= 50) return 'good';
  return 'attention';
}

/**
 * Scores validated values (amounts in paise, from validateInputs). Categories that do not apply have null points and
 * are left out of the applicable maximum; nothing is ever divided by zero or awarded automatically.
 */
export function scoreHealthCheck(values) {
  const v = values || {};
  const amounts = ['income', 'expenses', 'emi', 'savings', 'termCover', 'healthCover', 'investments'];
  amounts.forEach((field) => {
    if (!Number.isSafeInteger(v[field]) || v[field] < 0) throw new RangeError(`${field} must be a whole number of paise`);
  });
  if (v.income <= 0) throw new RangeError('income must be more than 0');
  if (!OVERLAP_CHOICES.includes(v.overlap) || !BUSINESS_CHOICES.includes(v.business)) throw new RangeError('overlap and business must be valid choices');

  const annualIncome = v.income * 12;
  const emergencyMeasurable = v.expenses > 0;
  const shieldingApplicable = v.business !== 'na';

  const points = {
    emi: v.emi * 100 <= v.income * 30 ? 20 : v.emi * 100 <= v.income * 45 ? 10 : 0,
    term: v.termCover >= annualIncome * 10 ? 20 : v.termCover >= annualIncome * 5 ? 10 : 0,
    emergency: !emergencyMeasurable ? null : v.savings >= v.expenses * 6 ? 20 : v.savings >= v.expenses * 3 ? 10 : 0,
    investment: v.investments * 100 >= v.income * 20 ? 15 : v.investments * 100 >= v.income * 10 ? 8 : 0,
    health: v.healthCover >= LIMITS.healthThresholdRupees * 100 ? 15 : 0,
    overlap: v.overlap === 'yes' ? 5 : 0,
    shielding: !shieldingApplicable ? null : v.business === 'yes' ? 5 : 0,
  };

  const flags = { shieldingApplicable, emergencyMeasurable };
  const applicable = applicableMax(flags);
  const earned = CATEGORY_IDS.reduce((sum, id) => sum + (points[id] ?? 0), 0);
  const score = normalizeScore(earned, applicable);

  return {
    scoringVersion: SCORING_VERSION,
    shieldingApplicable,
    emergencyMeasurable,
    points,
    earned,
    applicable,
    score,
    band: bandFor(score),
  };
}

/**
 * Consistency check for a result submitted to the server. It can only prove that the numbers agree with each other
 * (allowed point values, applicable maximum, earned total, normalisation, band); it cannot verify the financial figures
 * the person typed, because those never leave the browser. Returns a list of problems (empty when consistent).
 * The messages never include the submitted values.
 */
export function checkLeadResult(result) {
  const problems = [];
  const r = result && typeof result === 'object' ? result : {};
  if (r.scoringVersion !== SCORING_VERSION) problems.push('Unknown scoring version.');
  if (typeof r.shieldingApplicable !== 'boolean' || typeof r.emergencyMeasurable !== 'boolean') {
    problems.push('Applicability flags must be true or false.');
    return problems;
  }
  const points = r.points && typeof r.points === 'object' ? r.points : {};
  CATEGORY_IDS.forEach((id) => {
    const applies = id === 'emergency' ? r.emergencyMeasurable : id === 'shielding' ? r.shieldingApplicable : true;
    const value = points[id];
    if (!applies) {
      if (value !== null) problems.push(`Category ${id} does not apply, so it must have no points.`);
    } else if (!ALLOWED_POINTS[id].includes(value)) {
      problems.push(`Category ${id} has a points value that this check can never produce.`);
    }
  });
  if (problems.length) return problems;

  const applicable = applicableMax(r);
  if (r.applicable !== applicable) problems.push('The applicable maximum does not match the categories that apply.');
  const earned = CATEGORY_IDS.reduce((sum, id) => sum + (points[id] ?? 0), 0);
  if (r.earned !== earned) problems.push('The earned points do not match the category points.');
  if (problems.length) return problems;

  const score = normalizeScore(earned, applicable);
  if (r.score !== score) problems.push('The score does not match the earned and applicable points.');
  if (r.band !== bandFor(score)) problems.push('The band does not match the score.');
  return problems;
}

const clean = (value) => String(value ?? '').trim();

/**
 * Indian mobile numbers: accepts "98765 43210", "98765-43210", "+91 98765 43210", "91 98765 43210" and "098765 43210"
 * (spaces, hyphens and brackets are ignored) and returns the bare 10 digits. Anything else comes back unchanged apart
 * from those separators, so isValidMobile rejects it. The browser and the server both use this one function.
 */
export const normalizePhone = (value) =>
  String(value ?? '').replace(/[\s\-()]/g, '').replace(/^(\+?91|0)(?=[6-9][0-9]{9}$)/, '');

/** A valid Indian mobile number is 10 digits starting with 6, 7, 8 or 9 (after normalizePhone). */
export const isValidMobile = (value) => /^[6-9][0-9]{9}$/.test(normalizePhone(value));

/**
 * The only thing ever sent to the server: contact details, the consent record and the score summary. It is built key by
 * key from the result, so nothing else in the page's state (above all the amounts) can end up in it.
 */
export function buildLeadPayload({ fullName, phone, result, source = 'financial_health_checkup' }) {
  const p = result.points;
  return {
    fullName: clean(fullName),
    phone: clean(phone),
    source,
    consent: { callback: true, textVersion: CONSENT_VERSION },
    result: {
      scoringVersion: result.scoringVersion,
      shieldingApplicable: result.shieldingApplicable,
      emergencyMeasurable: result.emergencyMeasurable,
      points: {
        emi: p.emi,
        term: p.term,
        emergency: p.emergency,
        investment: p.investment,
        health: p.health,
        overlap: p.overlap,
        shielding: p.shielding,
      },
      earned: result.earned,
      applicable: result.applicable,
      score: result.score,
      band: result.band,
    },
  };
}
