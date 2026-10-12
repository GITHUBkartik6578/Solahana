/**
 * Human Life Value (HLV) gap calculator: pure maths and validation, no network and no storage.
 *
 * need = monthly expenses x 12 x replacement years + liabilities
 * gap  = max(0, need - existing life cover)
 *
 * A simple income-replacement estimate for education only. It ignores inflation, investment returns,
 * existing savings and taxes, and is not advice.
 */

export const DEFAULT_YEARS = 10;

export const LIMITS = {
  maxMonthlyExpenses: 1_000_000, // 10 lakh per month
  maxLiabilities: 1_000_000_000, // 100 crore
  maxCover: 1_000_000_000, // 100 crore
  minYears: 1,
  maxYears: 40,
};

const UNITS = [
  [/^(cr|crore|crores)$/, 10_000_000],
  [/^(l|lac|lacs|lakh|lakhs)$/, 100_000],
  [/^(k|thousand)$/, 1_000],
];

/** Rounds a rupee amount to 2 decimal places (paise), which also removes floating-point residue like 110000.00000000001. */
const toPaise = (n) => Math.round(n * 100) / 100;

// The exact amount typed, before rounding. NaN when the text is not a plain non-negative amount.
function exactAmount(raw) {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : NaN;
  const t = String(raw ?? '').toLowerCase().replace(/rs\.?|[₹,\s]/g, '');
  const match = /^(\d+(?:\.\d+)?)([a-z]*)$/.exec(t);
  if (!match) return NaN;
  const unit = match[2];
  if (!unit) return Number(match[1]);
  const found = UNITS.find(([re]) => re.test(unit));
  return found ? Number(match[1]) * found[1] : NaN;
}

/**
 * Turns "45,000", "₹45000", "1.5 lakh", "2cr" or "50k" into a number of rupees, rounded to 2 decimal places.
 * Returns NaN when the text is not a plain non-negative amount.
 */
export function parseAmount(raw) {
  const n = exactAmount(raw);
  return Number.isNaN(n) ? NaN : toPaise(n);
}

/**
 * True when parsing changed the amount the person typed, i.e. they gave more than 2 decimal places and it was
 * rounded (for example "50000.126" becomes 50000.13). Floating-point residue such as "1.1 lakh" is not a change.
 */
export function wasAmountRounded(raw) {
  const n = exactAmount(raw);
  return Number.isFinite(n) && Math.abs(n - toPaise(n)) > 1e-6;
}

/**
 * Parses a years answer. Plain whole-number digits only: "10" is fine, but "0x10", "1e1", "10 years",
 * "2.5", "-3" and "" are all NaN. Range (1-40) is checked by validateHlvInputs.
 */
export function parseYears(raw) {
  const t = String(raw ?? '').trim();
  return /^\d{1,6}$/.test(t) ? Number(t) : NaN;
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
// At most 2 decimal places (paise), tolerating floating-point noise.
const hasPaiseOnly = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6;

/**
 * Validates numeric inputs. Returns { ok: true, values } or { ok: false, errors: { field: message } }.
 * Values must be real finite numbers: booleans, null, arrays and numeric strings are rejected, not coerced.
 * Only an omitted (undefined) liabilities, cover or years falls back to its default (0, 0, 10).
 * Expenses must be above zero; liabilities and cover may be zero; amounts allow at most 2 decimal places;
 * years must be a whole number 1-40.
 */
export function validateHlvInputs(input) {
  const src = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const { monthlyExpenses, liabilities = 0, existingCover = 0, years = DEFAULT_YEARS } = src;
  const errors = {};

  const amount = (value, field, label, { min, max, maxText }) => {
    if (!isNum(value)) errors[field] = `${label} must be a number.`;
    else if (value < min || (min > 0 && value <= 0)) errors[field] = min > 0 ? `${label} must be more than 0.` : `${label} must be 0 or more.`;
    else if (value > max) errors[field] = `${label} can be at most ${maxText}.`;
    else if (!hasPaiseOnly(value)) errors[field] = `${label} can have at most 2 decimal places.`;
  };
  amount(monthlyExpenses, 'monthlyExpenses', 'Monthly expenses', { min: 0.01, max: LIMITS.maxMonthlyExpenses, maxText: '₹10 lakh' });
  amount(liabilities, 'liabilities', 'Liabilities', { min: 0, max: LIMITS.maxLiabilities, maxText: '₹100 crore' });
  amount(existingCover, 'existingCover', 'Existing cover', { min: 0, max: LIMITS.maxCover, maxText: '₹100 crore' });

  if (!isNum(years) || !Number.isInteger(years) || years < LIMITS.minYears || years > LIMITS.maxYears) {
    errors.years = `Years must be a whole number from ${LIMITS.minYears} to ${LIMITS.maxYears}.`;
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  // "+ 0" turns a negative zero into 0, so it never appears in stored or displayed values.
  return { ok: true, values: { monthlyExpenses: monthlyExpenses + 0, liabilities: liabilities + 0, existingCover: existingCover + 0, years: years + 0 } };
}

/** Runs the HLV maths. Throws if the inputs are invalid, so bad numbers never reach a result. */
export function calculateHlv(input) {
  const result = validateHlvInputs(input);
  if (!result.ok) throw new Error(Object.values(result.errors).join(' '));
  const { monthlyExpenses, liabilities, existingCover, years } = result.values;
  const need = monthlyExpenses * 12 * years + liabilities;
  const gap = Math.max(0, need - existingCover);
  return { need, gap, existingCover, years, monthlyExpenses, liabilities, covered: gap === 0 };
}

/** Indian-style rupee text, e.g. 12500000 -> "₹1.25 crore", 4500000 -> "₹45 lakh". */
export function formatInr(n) {
  const trim = (v) => String(Number(v.toFixed(2)));
  if (n >= 10_000_000) return `₹${trim(n / 10_000_000)} crore`;
  if (n >= 100_000) return `₹${trim(n / 100_000)} lakh`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

/** Exact rupee text with Indian digit grouping and up to 2 decimals, e.g. 5000013 -> "₹50,00,013", 50000.13 -> "₹50,000.13". */
export function formatRupees(n) {
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

/**
 * Display text for a result amount: the short lakh/crore form for whole rupees (unchanged from before), but the exact
 * figure when the amount has paise, so what is shown always matches what was calculated.
 */
export function formatInrExact(n) {
  return Number.isInteger(n) ? formatInr(n) : formatRupees(n);
}
