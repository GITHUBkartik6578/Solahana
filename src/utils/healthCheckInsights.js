/**
 * Solahana Financial Health Check-up: the insight engine behind the result report (PR-A, calculation only).
 * Full documentation: docs/health-check-insights-engine.md
 *
 * Pure functions on the validated amounts (whole paise, as returned by validateInputs in financialHealthCheck.js) and on the
 * existing hc-v1 score. Nothing here scores anything: the score, its weights and its thresholds stay in
 * financialHealthCheck.js and are only called, never changed. The module reads no browser state, makes no network call, uses
 * no clock and no randomness, and is not imported by the server or by the lead payload.
 *
 * UNITS. Money is whole paise throughout and every comparison is integer arithmetic. Ratios are whole TENTHS ("tenths"): 188 means
 * 18.8. Amounts that must be REACHED (gaps, needs, set-asides) round up and amounts that must be STAYED UNDER (limits) round
 * down, so a rounded figure never understates what is required. The one-decimal ratios round in the cautious direction (the EMI
 * share up, the others down), which keeps a displayed value from crossing a scoring threshold the exact value has not crossed.
 *
 * FORMATTERS add a symbol (% or ×) but never a unit word ("months" belongs to the sentence that uses the figure). Above the display
 * ceilings (1,000% / 1,000× / 1,200 months) a figure is written "more than ..." instead of a number nobody can read; the tier is
 * always decided on the exact paise, never on the displayed text.
 *
 * ERRORS. Invalid amounts throw InsightsInputError (a RangeError with a stable `code` and `field`, and a message that never repeats
 * a value). UI code that must not throw calls tryBuildInsights, which returns { ok, insights } or { ok: false, error }.
 *
 * The output of buildInsights contains the person's own amounts (in paise): it stays in the browser and is never part of the lead payload.
 */
import { BUSINESS_CHOICES, CATEGORY_IDS, CATEGORY_MAX, LIMITS, OVERLAP_CHOICES, scoreHealthCheck } from './financialHealthCheck.js';

export const INSIGHTS_VERSION = 'hc-insights-v1';

/** Raised for an amount or choice this module cannot use. `code` is stable ('amount-invalid', 'amount-too-large', 'income-required', 'choice-invalid', 'result-invalid', 'alert-invalid'); `field` names the field, or is null. */
export class InsightsInputError extends RangeError {
  constructor(code, field, message) {
    super(message);
    this.name = 'InsightsInputError';
    this.code = code;
    this.field = field;
  }
}

/** Rupees to paise, refusing a limit so large that the biggest multiplier used below (1000) could pass 2^53. */
function supportedMaxPaise(rupees) {
  const paise = rupees * 100;
  if (!Number.isSafeInteger(paise * 1000)) throw new RangeError('the amount limit is too large for exact whole-number arithmetic');
  return paise;
}

/** Largest amount accepted in any field, in paise (the Rs 100 crore the form allows for balances). */
export const MAX_AMOUNT_PAISE = supportedMaxPaise(LIMITS.balanceMaxRupees);
const MONEY_FIELDS = ['income', 'expenses', 'emi', 'savings', 'termCover', 'healthCover', 'investments'];

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach((inner) => deepFreeze(inner));
    Object.freeze(value);
  }
  return value;
}

/**
 * The reference levels. They repeat the thresholds inside scoreHealthCheck on purpose, so that scoring stays untouched; the tests
 * compare every tier computed here with the points scoreHealthCheck awards, so the two cannot drift apart unnoticed.
 */
export const TARGETS = deepFreeze({
  emi: { partialPct: 45, fullPct: 30 },
  term: { partialMultiple: 5, fullMultiple: 10 },
  runway: { partialMonths: 3, fullMonths: 6 },
  investment: { partialPct: 10, fullPct: 20 },
  health: { referencePaise: LIMITS.healthThresholdRupees * 100 },
  setAsideMonths: 12,
});

/** Above these tenths, a one-decimal figure is shown as "more than ...". */
export const DISPLAY_CEILINGS = deepFreeze({ percentTenths: 10_000, multipleTenths: 10_000, monthsTenths: 12_000 });

// ---------------------------------------------------------------------------------------------------------------------
// Whole-number division and display
// ---------------------------------------------------------------------------------------------------------------------

const isWhole = (n) => Number.isSafeInteger(n) && n >= 0;

/** floor(a / b) for whole a >= 0 and b >= 1, without floating point. */
export function divFloor(a, b) {
  if (!isWhole(a) || !Number.isSafeInteger(b) || b < 1) throw new RangeError('divFloor needs a whole a >= 0 and a whole b >= 1');
  return (a - (a % b)) / b;
}

/** ceil(a / b) for whole a >= 0 and b >= 1, without floating point. */
export function divCeil(a, b) {
  const quotient = divFloor(a, b);
  return a % b === 0 ? quotient : quotient + 1;
}

/** Indian digit grouping of a whole number: 1234567 -> "12,34,567". */
function groupIndian(whole) {
  const digits = String(whole);
  if (digits.length <= 3) return digits;
  let rest = digits.slice(0, -3);
  const groups = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) groups.unshift(rest);
  return `${groups.join(',')},${digits.slice(-3)}`;
}

function tenthsText(tenths, ceiling, symbol) {
  if (!isWhole(tenths)) throw new RangeError('tenths must be a whole number >= 0');
  if (tenths > ceiling) return `more than ${groupIndian(ceiling / 10)}${symbol}`;
  return `${groupIndian(divFloor(tenths, 10))}.${tenths % 10}${symbol}`;
}

/** Whole tenths of a percent -> "18.8%" ("more than 1,000%" above the ceiling). */
export const formatPercentTenths = (tenths) => tenthsText(tenths, DISPLAY_CEILINGS.percentTenths, '%');
/** Whole tenths of a multiple -> "5.2×" ("more than 1,000×" above the ceiling). */
export const formatMultipleTenths = (tenths) => tenthsText(tenths, DISPLAY_CEILINGS.multipleTenths, '×');
/** Whole tenths of a month -> "8.5", no unit word ("more than 1,200" above the ceiling). */
export const formatMonthsTenths = (tenths) => tenthsText(tenths, DISPLAY_CEILINGS.monthsTenths, '');

/** Exactly what was entered or computed, with paise only when there are some: 8000000 -> "₹80,000", -150050 -> "-₹1,500.50". */
export function formatRupeesExact(paise) {
  if (!Number.isSafeInteger(paise)) throw new RangeError('paise must be a whole number');
  const size = Math.abs(paise);
  const rest = size % 100;
  return `${paise < 0 ? '-' : ''}₹${groupIndian(divFloor(size, 100))}${rest ? `.${String(rest).padStart(2, '0')}` : ''}`;
}

/** Whole rupees, rounded UP: for an amount that has to be reached, so it is never understated. */
export function formatRupeesCeil(paise) {
  if (!isWhole(paise)) throw new RangeError('paise must be a whole number >= 0');
  return `₹${groupIndian(divCeil(paise, 100))}`;
}

/** Whole rupees, rounded DOWN: for a limit that must not be exceeded, so it is never overstated. */
export function formatRupeesFloor(paise) {
  if (!isWhole(paise)) throw new RangeError('paise must be a whole number >= 0');
  return `₹${groupIndian(divFloor(paise, 100))}`;
}

/** What to put aside each month to cover a gap in TARGETS.setAsideMonths months, in paise (a whole number of rupees, rounded up). No returns are assumed. */
export function monthlySetAside12(gapPaise) {
  return divCeil(divCeil(gapPaise, 100), TARGETS.setAsideMonths) * 100;
}

// ---------------------------------------------------------------------------------------------------------------------
// Figures
// ---------------------------------------------------------------------------------------------------------------------

/** Same checks as scoreHealthCheck, plus an upper bound so that no product below can pass 2^53. Messages never repeat a value. */
function assertValues(values) {
  const v = values && typeof values === 'object' ? values : {};
  MONEY_FIELDS.forEach((field) => {
    if (!isWhole(v[field])) throw new InsightsInputError('amount-invalid', field, `${field} must be a whole number of paise, 0 or more`);
    if (v[field] > MAX_AMOUNT_PAISE) throw new InsightsInputError('amount-too-large', field, `${field} must be a whole number of paise within the supported maximum`);
  });
  if (v.income <= 0) throw new InsightsInputError('income-required', 'income', 'income must be more than 0');
  if (!OVERLAP_CHOICES.includes(v.overlap)) throw new InsightsInputError('choice-invalid', 'overlap', 'overlap must be a valid choice');
  if (!BUSINESS_CHOICES.includes(v.business)) throw new InsightsInputError('choice-invalid', 'business', 'business must be a valid choice');
  return v;
}

const short = (need, have) => Math.max(0, need - have);
const tierOf = (full, partial) => (full ? 'full' : partial ? 'partial' : 'zero');

/**
 * The monthly budget as entered: essentials (the "fixed expenses" field) + EMIs + investments against income. All figures in paise.
 * overByPaise is how far the three together are above income; essentialsAndEmiOverByPaise is how far essentials + EMIs ALONE are above
 * income; roomBeforeInvestmentsPaise is what is left of the income after essentials + EMIs (0 when they already exceed it).
 */
function cashFlowParts(v) {
  const essentialsPlusEmi = v.expenses + v.emi;
  const committed = essentialsPlusEmi + v.investments;
  return {
    incomePaise: v.income,
    essentialsPaise: v.expenses,
    emiPaise: v.emi,
    investmentsPaise: v.investments,
    essentialsPlusEmiPaise: essentialsPlusEmi,
    committedPaise: committed,
    unallocatedPaise: v.income - committed,
    exceedsIncome: committed > v.income,
    overByPaise: short(committed, v.income),
    essentialsAndEmiOverByPaise: short(essentialsPlusEmi, v.income),
    roomBeforeInvestmentsPaise: short(v.income, essentialsPlusEmi),
  };
}

/**
 * The figures behind each part of the report, from the validated amounts. Names say what a figure is: the life figure is a
 * benchmark (a multiple of take-home income), not a needs-based requirement, and the health figure is a reference level, not
 * a recommendation. There is no savings rate (only the investment rate is known) and nothing about retirement or net worth.
 *
 * Gaps are 0 once a level is reached. "partialDistinct" is false when, for a very small income, the partial and full levels
 * are the same number of paise (so only the full level is worth showing).
 */
export function computeFigures(values) {
  const { income, expenses, emi, savings, termCover, healthCover, investments } = assertValues(values);
  const t = TARGETS;

  const emiFullLimit = divFloor(income * t.emi.fullPct, 100);
  const emiPartialLimit = divFloor(income * t.emi.partialPct, 100);
  const termFullNeed = income * 12 * t.term.fullMultiple;
  const termPartialNeed = income * 12 * t.term.partialMultiple;
  const runwayFullNeed = expenses * t.runway.fullMonths;
  const runwayPartialNeed = expenses * t.runway.partialMonths;
  const investFullNeed = divCeil(income * t.investment.fullPct, 100);
  const investPartialNeed = divCeil(income * t.investment.partialPct, 100);

  const runwayApplies = expenses > 0;
  return deepFreeze({
    emi: {
      pctTenths: divCeil(emi * 1000, income),
      tier: tierOf(emi <= emiFullLimit, emi <= emiPartialLimit),
      fullLimitPaise: emiFullLimit,
      partialLimitPaise: emiPartialLimit,
      partialDistinct: emiPartialLimit > emiFullLimit,
      reductionToFullPaise: short(emi, emiFullLimit),
      reductionToPartialPaise: short(emi, emiPartialLimit),
    },
    lifeBenchmark: {
      coverPaise: termCover,
      multipleTenths: divFloor(termCover * 10, income * 12),
      tier: tierOf(termCover >= termFullNeed, termCover >= termPartialNeed),
      fullNeedPaise: termFullNeed,
      partialNeedPaise: termPartialNeed,
      gapToFullPaise: short(termFullNeed, termCover),
      gapToPartialPaise: short(termPartialNeed, termCover),
    },
    runway: runwayApplies
      ? {
          applies: true,
          monthsTenths: divFloor(savings * 10, expenses),
          tier: tierOf(savings >= runwayFullNeed, savings >= runwayPartialNeed),
          fullNeedPaise: runwayFullNeed,
          partialNeedPaise: runwayPartialNeed,
          gapToFullPaise: short(runwayFullNeed, savings),
          gapToPartialPaise: short(runwayPartialNeed, savings),
        }
      : { applies: false, monthsTenths: null, tier: null, fullNeedPaise: null, partialNeedPaise: null, gapToFullPaise: null, gapToPartialPaise: null },
    investmentRate: {
      pctTenths: divFloor(investments * 1000, income),
      tier: tierOf(investments >= investFullNeed, investments >= investPartialNeed),
      fullNeedPaise: investFullNeed,
      partialNeedPaise: investPartialNeed,
      partialDistinct: investPartialNeed < investFullNeed,
      topUpToFullPaise: short(investFullNeed, investments),
      topUpToPartialPaise: short(investPartialNeed, investments),
    },
    healthReference: {
      coverPaise: healthCover,
      referencePaise: t.health.referencePaise,
      tier: healthCover >= t.health.referencePaise ? 'full' : 'zero',
      gapPaise: short(t.health.referencePaise, healthCover),
    },
    cashFlow: cashFlowParts({ income, expenses, emi, investments }),
  });
}

/**
 * Information only: how long the liquid savings last when EMIs are counted with the fixed expenses. It is NOT what the score uses
 * (the score divides by fixed expenses alone), and nothing else in this module reads it: it appears only under "info" in
 * buildInsights. It is shown only when there are both EMIs and fixed expenses.
 */
export function informationalRunway(values) {
  const { expenses, emi, savings } = assertValues(values);
  const applies = emi > 0 && expenses > 0;
  return deepFreeze({ applies, monthsTenths: applies ? divFloor(savings * 10, expenses + emi) : null });
}

// ---------------------------------------------------------------------------------------------------------------------
// Severity
// ---------------------------------------------------------------------------------------------------------------------

/**
 * SEVERITY says how urgent a finding is, not how many points it cost. It is decided by the category and the state it is in (zero
 * points, partial points), never by the overall score.
 *   high    the monthly budget or the safety net is already strained: it can hurt within weeks or months
 *   medium  a protection or planning gap that matters if something happens, a partial shortfall in a core category, or voluntary
 *           investing that pushes the plan over income
 *   low     a long-term refinement or good practice, nothing that strains the household now
 * A partial state is one step below the zero state of the same category (never below low). Investing is voluntary and is never
 * rated above medium. The levels live in SEVERITY_TABLE and can be changed there (or by passing another table); SEVERITY_RATIONALE
 * gives the reason for every entry. Nothing else in the module depends on a particular level.
 */
const SEVERITY_LEVELS = ['high', 'medium', 'low'];

export const SEVERITY_TABLE = deepFreeze({
  emi: { 0: 'high', 10: 'medium' },
  emergency: { 0: 'high', 10: 'medium' },
  term: { 0: 'medium', 10: 'low' },
  health: { 0: 'medium' },
  investment: { 0: 'low', 8: 'low' },
  overlap: { 0: 'low' },
  shielding: { 0: 'low' },
  cashFlow: { essentialsAndEmi: 'high', investments: 'medium' },
});

/** Why each SEVERITY_TABLE entry has the level it has (same shape as the table). */
export const SEVERITY_RATIONALE = deepFreeze({
  emi: {
    0: 'EMIs above 45% of take-home income leave little room for everyday costs or a surprise, and they are fixed commitments.',
    10: 'EMIs of 30% to 45% of income still leave room, but less for savings and surprises.',
  },
  emergency: {
    0: 'Less than 3 months of fixed expenses in liquid savings: a gap in income would be felt within weeks.',
    10: '3 to 6 months of savings is a cushion, but short of the 6 months this check looks for.',
  },
  term: {
    0: 'Term cover below 5 times annual income matters if dependants rely on the income, but it does not strain the monthly budget today.',
    10: 'Term cover of 5 to 10 times income is already partly in place; the right level depends on dependants and loans.',
  },
  health: {
    0: 'Cover below the reference level can matter in one hospital stay, but what is enough depends on city, family and existing cover.',
  },
  investment: {
    0: 'Investing under 10% of income is a long-term shortfall, not an immediate strain, and investing is voluntary.',
    8: 'Investing 10% to 20% is a good start; the gap to 20% is a long-term refinement.',
  },
  overlap: { 0: 'Reviewing all investments together once a year is good practice and carries no immediate risk.' },
  shielding: { 0: 'Keeping personal and business assets apart is a structural safeguard, and the answer may also mean "not sure", so it is kept low.' },
  cashFlow: {
    essentialsAndEmi: 'Fixed expenses plus EMIs alone are above income: the monthly budget does not close even before any investing.',
    investments: 'Fixed expenses and EMIs fit within income; only the planned investing pushes the total over. Investing is a choice, so this is a planning point, not a debt.',
  },
});

/** 'high' | 'medium' | 'low', or null when the category has full points or does not apply. Throws if the table has no level for it. */
export function severityFor(categoryId, points, table = SEVERITY_TABLE) {
  if (!CATEGORY_IDS.includes(categoryId)) throw new RangeError('unknown category');
  if (points === null || points === CATEGORY_MAX[categoryId]) return null;
  const level = table?.[categoryId]?.[points];
  if (!SEVERITY_LEVELS.includes(level)) throw new RangeError(`the severity table has no level for ${categoryId} at ${points} points`);
  return level;
}

/** Severity of the monthly cash-flow alert: kind is 'essentialsAndEmi' (essentials + EMIs alone are above income) or 'investments' (only the investing pushes it over). */
export function severityForCashFlow(kind, table = SEVERITY_TABLE) {
  const level = table?.cashFlow?.[kind];
  if (!SEVERITY_LEVELS.includes(level)) throw new RangeError(`the severity table has no level for the cash-flow alert of kind ${kind}`);
  return level;
}

// ---------------------------------------------------------------------------------------------------------------------
// Alerts, findings, reasons, next steps
// ---------------------------------------------------------------------------------------------------------------------

const pointsOf = (result) => {
  if (!result || typeof result.points !== 'object' || result.points === null) throw new InsightsInputError('result-invalid', null, 'result must be a hc-v1 score result');
  return result.points;
};

/**
 * The risk alerts, as { id, tier, categoryId, severity, detail }. They read only the category points and the amounts, never the
 * overall score or band, so a strong score can still carry an alert.
 *   A1  emergency fund below 3 months (priority, severity from the table)
 *   A2  EMIs above 45% of income (priority)
 *   A3  monthly cash-flow mismatch: essentials + EMIs + investments are above income. Two kinds, told apart by what the mismatch needs:
 *         'essentialsAndEmi'  essentials + EMIs ALONE are above income: tier priority, severity high
 *         'investments'       essentials + EMIs fit, only the investing pushes the total over: tier review, severity medium
 *       It is left out when the EMI alone is above income, because A2 already says that and A3 would only repeat it (when the EMI is
 *       high but still below income, both are kept: they are different problems). `detail` carries every amount of the mismatch.
 *   R1  term cover below 5x annual income (review)
 *   R2  health cover below the reference level (review)
 * `detail` is null except for A3. The tier of A3 follows its kind, not the configured severity.
 */
export function buildAlerts(values, result, table = SEVERITY_TABLE) {
  const v = assertValues(values);
  const points = pointsOf(result);
  const alerts = [];
  const add = (id, tier, categoryId, severity, detail = null) => alerts.push({ id, tier, categoryId, severity, detail });

  if (points.emergency === 0) add('A1', 'priority', 'emergency', severityFor('emergency', 0, table));
  if (points.emi === 0) add('A2', 'priority', 'emi', severityFor('emi', 0, table));
  const flow = cashFlowParts(v);
  if (flow.exceedsIncome && !(v.emi > v.income)) {
    const kind = flow.essentialsAndEmiOverByPaise > 0 ? 'essentialsAndEmi' : 'investments';
    add('A3', kind === 'essentialsAndEmi' ? 'priority' : 'review', null, severityForCashFlow(kind, table), {
      kind,
      incomePaise: flow.incomePaise,
      essentialsPaise: flow.essentialsPaise,
      emiPaise: flow.emiPaise,
      investmentsPaise: flow.investmentsPaise,
      essentialsPlusEmiPaise: flow.essentialsPlusEmiPaise,
      committedPaise: flow.committedPaise,
      overByPaise: flow.overByPaise,
      essentialsAndEmiOverByPaise: flow.essentialsAndEmiOverByPaise,
      roomBeforeInvestmentsPaise: flow.roomBeforeInvestmentsPaise,
    });
  }
  if (points.term === 0) add('R1', 'review', 'term', severityFor('term', 0, table));
  if (points.health === 0) add('R2', 'review', 'health', severityFor('health', 0, table));
  return deepFreeze(alerts);
}

const ORDER = (id) => CATEGORY_IDS.indexOf(id);
const SEVERITY_RANK = { high: 0, medium: 1, low: 2 };

/**
 * Up to three strengths (categories with full points, largest first) and three improvement areas (categories that lost points:
 * the most severe first, then the most points lost). Categories that do not apply are in neither list.
 */
export function rankFindings(result, table = SEVERITY_TABLE) {
  const points = pointsOf(result);
  const applying = CATEGORY_IDS.filter((id) => points[id] !== null);
  const lost = (id) => CATEGORY_MAX[id] - points[id];
  const rank = (id) => SEVERITY_RANK[severityFor(id, points[id], table)];
  const strengths = applying
    .filter((id) => points[id] === CATEGORY_MAX[id])
    .sort((a, b) => CATEGORY_MAX[b] - CATEGORY_MAX[a] || ORDER(a) - ORDER(b))
    .slice(0, 3);
  const improvements = applying
    .filter((id) => points[id] < CATEGORY_MAX[id])
    .sort((a, b) => rank(a) - rank(b) || lost(b) - lost(a) || CATEGORY_MAX[b] - CATEGORY_MAX[a] || ORDER(a) - ORDER(b))
    .slice(0, 3);
  return deepFreeze({ strengths, improvements });
}

/** Why the score is what it is: the points earned out of those that apply, and where the missing points are. earned + sum(lost) = applicable. */
export function scoreReasons(result) {
  const points = pointsOf(result);
  const lost = CATEGORY_IDS.filter((id) => points[id] !== null)
    .map((id) => ({ id, points: points[id], max: CATEGORY_MAX[id], lost: CATEGORY_MAX[id] - points[id] }))
    .filter((entry) => entry.lost > 0)
    .sort((a, b) => b.lost - a.lost || ORDER(a.id) - ORDER(b.id));
  return deepFreeze({
    earned: result.earned,
    applicable: result.applicable,
    score: result.score,
    scaled: result.applicable < 100,
    notApplicable: CATEGORY_IDS.filter((id) => points[id] === null),
    lost,
  });
}

const STEP_FOR = {
  emi: { zero: 'EMI-0', partial: 'EMI-1' },
  term: { zero: 'TERM-0', partial: 'TERM-1' },
  emergency: { zero: 'EM-0', partial: 'EM-1' },
  investment: { zero: 'INV-0', partial: 'INV-1' },
  health: { zero: 'HEALTH-0' },
  overlap: { zero: 'OVERLAP-0' },
  shielding: { zero: 'SHIELD-0' },
};
const CASH_STEP_FOR = { essentialsAndEmi: 'CASH-ESS', investments: 'CASH-INV' };

/** Step id -> horizon: 'now' = a strained budget or safety net, 'd90' = no points elsewhere or investing over income, 'm12' = partial points. */
const HORIZON = {
  'CASH-ESS': 'now', 'EM-0': 'now', 'EMI-0': 'now',
  'CASH-INV': 'd90', 'TERM-0': 'd90', 'HEALTH-0': 'd90', 'INV-0': 'd90', 'OVERLAP-0': 'd90', 'SHIELD-0': 'd90',
  'EM-1': 'm12', 'EMI-1': 'm12', 'TERM-1': 'm12', 'INV-1': 'm12',
};
const HORIZON_ORDER = { now: 0, d90: 1, m12: 2 };

const cashParams = (f) => ({
  incomePaise: f.cashFlow.incomePaise,
  essentialsPaise: f.cashFlow.essentialsPaise,
  emiPaise: f.cashFlow.emiPaise,
  investmentsPaise: f.cashFlow.investmentsPaise,
  essentialsPlusEmiPaise: f.cashFlow.essentialsPlusEmiPaise,
  committedPaise: f.cashFlow.committedPaise,
  overByPaise: f.cashFlow.overByPaise,
  essentialsAndEmiOverByPaise: f.cashFlow.essentialsAndEmiOverByPaise,
  roomBeforeInvestmentsPaise: f.cashFlow.roomBeforeInvestmentsPaise,
});

/** The numbers each step needs, taken from the figures (no text here: the wording lives in the copy that PR-B adds). */
const STEP_PARAMS = {
  'CASH-ESS': cashParams,
  'CASH-INV': cashParams,
  'EM-0': (f) => ({
    monthsTenths: f.runway.monthsTenths,
    gapToPartialPaise: f.runway.gapToPartialPaise,
    gapToFullPaise: f.runway.gapToFullPaise,
    setAsideToPartialPaise: monthlySetAside12(f.runway.gapToPartialPaise),
    setAsideToFullPaise: monthlySetAside12(f.runway.gapToFullPaise),
  }),
  'EM-1': (f) => ({ monthsTenths: f.runway.monthsTenths, gapToFullPaise: f.runway.gapToFullPaise, setAsideToFullPaise: monthlySetAside12(f.runway.gapToFullPaise) }),
  'EMI-0': (f) => ({
    pctTenths: f.emi.pctTenths,
    partialLimitPaise: f.emi.partialLimitPaise,
    fullLimitPaise: f.emi.fullLimitPaise,
    reductionToPartialPaise: f.emi.reductionToPartialPaise,
    reductionToFullPaise: f.emi.reductionToFullPaise,
  }),
  'EMI-1': (f) => ({ pctTenths: f.emi.pctTenths, fullLimitPaise: f.emi.fullLimitPaise, reductionToFullPaise: f.emi.reductionToFullPaise }),
  'TERM-0': (f) => ({
    multipleTenths: f.lifeBenchmark.multipleTenths,
    coverPaise: f.lifeBenchmark.coverPaise,
    partialNeedPaise: f.lifeBenchmark.partialNeedPaise,
    fullNeedPaise: f.lifeBenchmark.fullNeedPaise,
  }),
  'TERM-1': (f) => ({ multipleTenths: f.lifeBenchmark.multipleTenths, fullNeedPaise: f.lifeBenchmark.fullNeedPaise, gapToFullPaise: f.lifeBenchmark.gapToFullPaise }),
  'HEALTH-0': (f) => ({ coverPaise: f.healthReference.coverPaise, gapPaise: f.healthReference.gapPaise }),
  'INV-0': (f) => ({
    pctTenths: f.investmentRate.pctTenths,
    partialNeedPaise: f.investmentRate.partialNeedPaise,
    fullNeedPaise: f.investmentRate.fullNeedPaise,
    topUpToPartialPaise: f.investmentRate.topUpToPartialPaise,
    topUpToFullPaise: f.investmentRate.topUpToFullPaise,
  }),
  'INV-1': (f) => ({ pctTenths: f.investmentRate.pctTenths, fullNeedPaise: f.investmentRate.fullNeedPaise, topUpToFullPaise: f.investmentRate.topUpToFullPaise }),
  'OVERLAP-0': () => ({}),
  'SHIELD-0': () => ({}),
};

/**
 * One step for every category that lost points (never for full points or "not applicable"), and one for the cash-flow alert when
 * `alerts` carries one (CASH-ESS or CASH-INV, by its kind). Without alerts (null, undefined or empty) there is no cash-flow step.
 * Ordered by horizon, then by the points lost, then in the fixed category order. There is no cap: at most one step per category
 * plus the cash-flow step, so never more than eight.
 */
export function selectNextSteps(figures, result, alerts) {
  const points = pointsOf(result);
  const entries = []; // each step with the points it stands for, only to order them
  CATEGORY_IDS.forEach((id) => {
    if (points[id] === null || points[id] === CATEGORY_MAX[id]) return;
    const stepId = STEP_FOR[id][points[id] === 0 ? 'zero' : 'partial'];
    entries.push({ lost: CATEGORY_MAX[id] - points[id], step: { id: stepId, horizon: HORIZON[stepId], categoryId: id, params: STEP_PARAMS[stepId](figures) } });
  });
  const cashAlert = (alerts || []).find((a) => a.id === 'A3');
  if (cashAlert) {
    const stepId = CASH_STEP_FOR[cashAlert.detail?.kind];
    if (!stepId) throw new InsightsInputError('alert-invalid', null, 'the cash-flow alert has no valid kind');
    entries.push({ lost: Number.MAX_SAFE_INTEGER, step: { id: stepId, horizon: HORIZON[stepId], categoryId: null, params: STEP_PARAMS[stepId](figures) } });
  }
  entries.sort(
    (a, b) => HORIZON_ORDER[a.step.horizon] - HORIZON_ORDER[b.step.horizon] || b.lost - a.lost || ORDER(a.step.categoryId) - ORDER(b.step.categoryId),
  );
  return deepFreeze(entries.map((entry) => entry.step));
}

/**
 * Everything the report needs, from the validated amounts alone. The hc-v1 score is calculated inside by scoreHealthCheck, so the
 * figures and the score can never come from different inputs. Throws InsightsInputError for an invalid amount or choice (see
 * tryBuildInsights for a version that never throws). The output is frozen:
 *   version    INSIGHTS_VERSION
 *   figures    computeFigures(values)
 *   alerts     buildAlerts(...)
 *   findings   { strengths, improvements } category ids, at most three each
 *   reasons    scoreReasons(...)
 *   steps      selectNextSteps(...)
 *   severity   { [categoryId]: 'high' | 'medium' | 'low' | null }, only for categories that apply (null = full points)
 *   info       { withEmiRunway: { applies, monthsTenths } }  information only, never an input to anything else
 */
export function buildInsights(values) {
  const v = assertValues(values);
  const result = scoreHealthCheck(v);
  const figures = computeFigures(v);
  const alerts = buildAlerts(v, result);
  const severity = {};
  CATEGORY_IDS.forEach((id) => {
    if (result.points[id] !== null) severity[id] = severityFor(id, result.points[id]);
  });
  return deepFreeze({
    version: INSIGHTS_VERSION,
    figures,
    alerts,
    findings: rankFindings(result),
    reasons: scoreReasons(result),
    steps: selectNextSteps(figures, result, alerts),
    severity,
    info: { withEmiRunway: informationalRunway(v) },
  });
}

/**
 * buildInsights for code that must not throw: { ok: true, insights } or { ok: false, error: { code, field, message } }. The message
 * never repeats a value. Anything unexpected comes back as code 'unexpected' with a fixed message (no internal detail).
 */
export function tryBuildInsights(values) {
  try {
    return deepFreeze({ ok: true, insights: buildInsights(values) });
  } catch (error) {
    if (error instanceof InsightsInputError) return deepFreeze({ ok: false, error: { code: error.code, field: error.field, message: error.message } });
    return deepFreeze({ ok: false, error: { code: 'unexpected', field: null, message: 'The insights could not be calculated.' } });
  }
}
