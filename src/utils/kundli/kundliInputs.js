/**
 * Financial Kundli answers: the empty answer model, field rules, per-screen validation, the screen order, and the step that
 * turns what was typed into the clean inputs the calculations use.
 *
 * Rules that matter (Step 2):
 *   - Every answer has a state: entered, none (an explicit 0), not-sure, or skipped. Blank, not-sure and skipped are NEVER 0.
 *   - Unticked items count as 0 only after the customer confirms the checklist.
 *   - Values are never silently clamped: anything out of range is rejected with a message.
 * Browser memory only: nothing here stores, sends or logs a value.
 */
import { LIMITS, MESSAGES } from '../financialHealthCheck.js';
import { parseAmount, wasAmountRounded } from '../hlvCalculator.js';
import { ASSET_KEYS, ERRORS, GOALS, LIABILITY_KEYS } from './kundliCopy.js';

export const AGE_MIN = 18;
export const AGE_MAX = 80;
export const RETIRE_MAX = 89;
export const RU_MAX = 90;
export const GOAL_YEARS_MIN = 1;
export const GOAL_YEARS_MAX = 50;
export const INF_MIN = 0;
export const INF_MAX = 25;
export const RET_MIN = 0.1;
export const RET_MAX = 30;
export const GOAL_NAME_MAX = 40;

/** One answer: raw text plus a state. state '' means "typed" (entered once raw is not blank); 'none' and 'not-sure' clear raw. */
export const blankField = () => ({ raw: '', state: '' });

const blankChecklist = (keys) => ({
  skipped: false,
  confirmed: false,
  ticked: Object.fromEntries(keys.map((k) => [k, false])),
  amounts: Object.fromEntries(keys.map((k) => [k, blankField()])),
});

let goalCounter = 0;
export function blankGoal() {
  goalCounter += 1;
  return { id: `g${goalCounter}`, type: '', name: '', cost: blankField(), years: blankField(), saved: blankField() };
}

export function emptyAnswers() {
  return {
    fields: {
      income: blankField(),
      expenses: blankField(),
      emi: blankField(),
      other: blankField(),
      savings: blankField(),
      investments: blankField(),
      termCover: blankField(),
      healthCover: blankField(),
    },
    overlap: '',
    business: '',
    assets: blankChecklist(ASSET_KEYS),
    liabilities: blankChecklist(LIABILITY_KEYS),
    goalsGate: '',
    goals: [],
    retGate: '',
    ret: { age: blankField(), at: blankField(), until: blankField(), spend: { ...blankField(), source: 'typed' } },
    asm: { inf: blankField(), ret: blankField() },
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// Field rules
// ---------------------------------------------------------------------------------------------------------------------

/**
 * kind: 'income' (monthly, > 0), 'monthly' (0 allowed), 'balance' (0 allowed), 'positiveBalance' / 'positiveMonthly' (> 0),
 * 'goalYears', 'age', 'percent'. allow: which non-typed states the customer may choose.
 */
export const CORE_RULES = Object.freeze({
  income: { kind: 'income', allow: [] },
  expenses: { kind: 'monthly', allow: [] },
  emi: { kind: 'monthly', allow: [] },
  other: { kind: 'monthly', allow: ['none', 'not-sure'] },
  savings: { kind: 'balance', allow: [] },
  investments: { kind: 'monthly', allow: [] },
  termCover: { kind: 'balance', allow: [] },
  healthCover: { kind: 'balance', allow: [] },
});
export const RULES = Object.freeze({
  assetAmount: { kind: 'positiveBalance', allow: ['not-sure'] },
  liabilityAmount: { kind: 'positiveBalance', allow: ['not-sure'] },
  goalCost: { kind: 'positiveBalance', allow: ['not-sure'] },
  goalYears: { kind: 'goalYears', allow: ['not-sure'] },
  goalSaved: { kind: 'balance', allow: ['none', 'not-sure'] },
  age: { kind: 'age', allow: [] },
  retSpend: { kind: 'positiveMonthly', allow: ['not-sure'] },
  inf: { kind: 'percent', min: INF_MIN, max: INF_MAX, rangeError: ERRORS.infRange, allow: ['not-sure'] },
  ret: { kind: 'percent', min: RET_MIN, max: RET_MAX, rangeError: ERRORS.retRange, allow: ['not-sure'] },
});

const isBlank = (raw) => String(raw ?? '').trim() === '';
const toPaise = (rupees) => Math.round(rupees * 100);

function checkAmount(raw, kind) {
  const rupees = parseAmount(raw);
  if (!Number.isFinite(rupees) || rupees < 0 || wasAmountRounded(raw)) return { error: MESSAGES.invalid };
  const monthly = kind === 'income' || kind === 'monthly' || kind === 'positiveMonthly';
  const max = monthly ? LIMITS.monthlyMaxRupees : LIMITS.balanceMaxRupees;
  if (kind === 'income' && rupees <= 0) return { error: MESSAGES.income };
  if ((kind === 'positiveBalance' || kind === 'positiveMonthly') && rupees <= 0) return { error: ERRORS.amountPositive };
  if (rupees > max) return { error: monthly ? MESSAGES.monthlyMax : MESSAGES.balanceMax };
  const paise = toPaise(rupees);
  return { value: paise, status: paise === 0 ? 'none' : 'entered' };
}

function checkWhole(raw, min, max, formatError, rangeError) {
  const t = String(raw).trim();
  if (!/^\d{1,3}$/.test(t)) return { error: formatError };
  const n = Number(t);
  if (n < min || n > max) return { error: rangeError };
  return { value: n, status: 'entered' };
}

function checkPercent(raw, rule) {
  const t = String(raw).trim().replace(/%$/, '').trim();
  if (!/^\d{1,2}(\.\d)?$/.test(t)) return { error: ERRORS.percentFormat };
  const n = Number(t);
  if (n < rule.min || n > rule.max) return { error: rule.rangeError };
  return { value: n, status: 'entered' };
}

/**
 * Reads one answer against its rule. Returns { status, value, error }:
 *   status 'entered' | 'none' | 'not-sure' | 'missing'; value is paise (amounts), a whole number (years, ages) or a
 *   number (percent); error is the message to show, or null. A missing answer has an error only when required.
 */
export function readField(field, rule, { required = true } = {}) {
  const f = field || blankField();
  if (f.state === 'none' && rule.allow.includes('none')) return { status: 'none', value: 0, error: null };
  if (f.state === 'not-sure' && rule.allow.includes('not-sure')) return { status: 'not-sure', value: null, error: null };
  if (isBlank(f.raw)) {
    if (!required) return { status: 'missing', value: null, error: null };
    const error =
      rule.kind === 'income'
        ? MESSAGES.income
        : ['monthly', 'balance'].includes(rule.kind)
          ? MESSAGES.blank
          : ['positiveBalance', 'positiveMonthly'].includes(rule.kind)
            ? ERRORS.amountPositive
            : ERRORS.required;
    return { status: 'missing', value: null, error };
  }
  let out;
  if (rule.kind === 'goalYears') out = checkWhole(f.raw, GOAL_YEARS_MIN, GOAL_YEARS_MAX, ERRORS.goalYears, ERRORS.goalYears);
  else if (rule.kind === 'age') out = checkWhole(f.raw, 0, 999, ERRORS.ageWhole, ERRORS.ageWhole);
  else if (rule.kind === 'percent') out = checkPercent(f.raw, rule);
  else out = checkAmount(f.raw, rule.kind);
  if (out.error) return { status: 'missing', value: null, error: out.error };
  return { status: out.status, value: out.value, error: null };
}

// ---------------------------------------------------------------------------------------------------------------------
// Screens
// ---------------------------------------------------------------------------------------------------------------------

export const SCREEN_SECTION = Object.freeze({
  income: 'income',
  savings: 'savings',
  protection: 'protection',
  habits: 'habits',
  ownList: 'own',
  ownAmounts: 'own',
  oweList: 'owe',
  oweAmounts: 'owe',
  goals: 'goals',
  retirement: 'retirement',
  assumptions: 'assumptions',
});

const anyTicked = (list) => Object.values(list.ticked).some(Boolean);

/** True when goals or retirement need the planning assumptions. */
export const needsAssumptions = (a) => (a.goalsGate === 'yes' && a.goals.length > 0) || a.retGate === 'yes';

/** The screens this customer will see, in order. Amount screens appear only after ticks; assumptions only when needed. */
export function screenOrder(a) {
  const order = ['intro', 'income', 'savings', 'protection', 'habits', 'ownList'];
  if (!a.assets.skipped && anyTicked(a.assets)) order.push('ownAmounts');
  order.push('oweList');
  if (!a.liabilities.skipped && anyTicked(a.liabilities)) order.push('oweAmounts');
  order.push('goals', 'retirement');
  if (needsAssumptions(a)) order.push('assumptions');
  order.push('review', 'report');
  return order;
}

/** The sections shown in the progress indicator (assumptions only when needed). */
export function sectionOrder(a) {
  const list = ['income', 'savings', 'protection', 'habits', 'own', 'owe', 'goals', 'retirement'];
  if (needsAssumptions(a)) list.push('assumptions');
  return list;
}

function fieldErrors(keys, a) {
  const errors = {};
  keys.forEach((k) => {
    const { error } = readField(a.fields[k], CORE_RULES[k]);
    if (error) errors[k] = error;
  });
  return errors;
}

function checklistErrors(list, prefix) {
  const errors = {};
  if (!list.skipped && !list.confirmed) errors[`${prefix}.confirm`] = ERRORS.confirmNeeded;
  return errors;
}

function amountErrors(list, keys, prefix, rule) {
  const errors = {};
  keys.forEach((k) => {
    if (!list.ticked[k]) return;
    const amount = list.amounts[k];
    // Ticked + 0 gets its own message (Step 2): untick instead.
    const parsed = parseAmount(amount.raw);
    if (amount.state === '' && !isBlank(amount.raw) && parsed === 0) {
      errors[`${prefix}.${k}`] = ERRORS.tickedZero;
      return;
    }
    const { error } = readField(amount, rule);
    if (error) errors[`${prefix}.${k}`] = error;
  });
  return errors;
}

function goalErrors(a) {
  const errors = {};
  if (a.goalsGate === '') errors.goalsGate = MESSAGES.choose;
  if (a.goalsGate !== 'yes') return errors;
  if (a.goals.length === 0) errors.goalsGate = ERRORS.addGoal;
  a.goals.forEach((g) => {
    const p = `goal.${g.id}`;
    if (!g.type) errors[`${p}.type`] = MESSAGES.choose;
    if (g.type === 'other' && !g.name.trim()) errors[`${p}.name`] = ERRORS.required;
    if (g.name.length > GOAL_NAME_MAX) errors[`${p}.name`] = ERRORS.goalName;
    const cost = readField(g.cost, RULES.goalCost);
    if (cost.error) errors[`${p}.cost`] = cost.error;
    const years = readField(g.years, RULES.goalYears);
    if (years.error) errors[`${p}.years`] = years.error;
    const saved = readField(g.saved, RULES.goalSaved);
    if (saved.error) errors[`${p}.saved`] = saved.error;
  });
  return errors;
}

/** Retirement ages: current 18-80, retirement CA+1..89, planning-until RA+1..90 (U-1). No age is ever pre-filled. */
export function retirementErrors(a) {
  const errors = {};
  if (a.retGate === '') errors.retGate = MESSAGES.choose;
  if (a.retGate !== 'yes') return errors;
  const age = readField(a.ret.age, RULES.age);
  const at = readField(a.ret.at, RULES.age);
  const until = readField(a.ret.until, RULES.age);
  if (age.error) errors['ret.age'] = age.error;
  else if (age.value < AGE_MIN || age.value > AGE_MAX) errors['ret.age'] = ERRORS.ageRange;
  if (at.error) errors['ret.at'] = at.error;
  else if (!errors['ret.age'] && at.value <= age.value) errors['ret.at'] = ERRORS.retireAfterAge;
  else if (at.value > RETIRE_MAX) errors['ret.at'] = ERRORS.retireMax;
  if (until.error) errors['ret.until'] = until.error;
  else if (until.value > RU_MAX) errors['ret.until'] = ERRORS.untilMax;
  else if (!at.error && until.value <= at.value) errors['ret.until'] = ERRORS.untilAfterRetire;
  const spend = readField(a.ret.spend, RULES.retSpend);
  if (spend.error) errors['ret.spend'] = spend.error;
  return errors;
}

/** Errors that stop the customer from leaving a screen, keyed by answer path. Empty object = can continue. */
export function validateScreen(screen, a) {
  switch (screen) {
    case 'income':
      return fieldErrors(['income', 'expenses', 'emi', 'other'], a);
    case 'savings':
      return fieldErrors(['savings', 'investments'], a);
    case 'protection':
      return fieldErrors(['termCover', 'healthCover'], a);
    case 'habits': {
      const errors = {};
      if (!['yes', 'no'].includes(a.overlap)) errors.overlap = MESSAGES.choose;
      if (!['yes', 'no', 'na'].includes(a.business)) errors.business = MESSAGES.choose;
      return errors;
    }
    case 'ownList':
      return checklistErrors(a.assets, 'assets');
    case 'ownAmounts':
      return amountErrors(a.assets, ASSET_KEYS, 'assets', RULES.assetAmount);
    case 'oweList':
      return checklistErrors(a.liabilities, 'liabilities');
    case 'oweAmounts':
      return amountErrors(a.liabilities, LIABILITY_KEYS, 'liabilities', RULES.liabilityAmount);
    case 'goals':
      return goalErrors(a);
    case 'retirement':
      return retirementErrors(a);
    case 'assumptions': {
      const errors = {};
      const inf = readField(a.asm.inf, RULES.inf);
      const ret = readField(a.asm.ret, RULES.ret);
      if (inf.error) errors['asm.inf'] = inf.error;
      if (ret.error) errors['asm.ret'] = ret.error;
      return errors;
    }
    default:
      return {};
  }
}

/** Every answered screen before the review must be valid before the report can be created. */
export function firstInvalidScreen(a) {
  return screenOrder(a).find((s) => s !== 'review' && s !== 'report' && s !== 'intro' && Object.keys(validateScreen(s, a)).length > 0) || null;
}

// ---------------------------------------------------------------------------------------------------------------------
// Normalising answers for the calculations
// ---------------------------------------------------------------------------------------------------------------------

const norm = (r) => ({ status: r.status, value: r.value });

function normChecklist(list, keys, rule) {
  if (list.skipped) return { section: 'skipped', items: Object.fromEntries(keys.map((k) => [k, { ticked: false, status: 'skipped', value: null }])) };
  if (!list.confirmed) return { section: 'missing', items: Object.fromEntries(keys.map((k) => [k, { ticked: false, status: 'missing', value: null }])) };
  const items = {};
  keys.forEach((k) => {
    if (!list.ticked[k]) items[k] = { ticked: false, status: 'none', value: 0 };
    else {
      const r = readField(list.amounts[k], rule);
      items[k] = { ticked: true, status: r.status === 'none' ? 'missing' : r.status, value: r.status === 'entered' ? r.value : null };
    }
  });
  return { section: 'confirmed', items };
}

/**
 * Turns the answers into the inputs the calculations read. Invalid or blank answers become 'missing' (never 0). Amounts are
 * paise; ages and years are whole numbers; rates are percentages.
 */
export function normalizeAnswers(a) {
  const core = {};
  Object.keys(CORE_RULES).forEach((k) => {
    core[k] = norm(readField(a.fields[k], CORE_RULES[k]));
  });
  const goalsChosen = a.goalsGate === 'yes';
  const retChosen = a.retGate === 'yes';
  return {
    core,
    overlap: ['yes', 'no'].includes(a.overlap) ? a.overlap : null,
    business: ['yes', 'no', 'na'].includes(a.business) ? a.business : null,
    assets: normChecklist(a.assets, ASSET_KEYS, RULES.assetAmount),
    liabilities: normChecklist(a.liabilities, LIABILITY_KEYS, RULES.liabilityAmount),
    goals: {
      gate: a.goalsGate || null,
      list: goalsChosen
        ? a.goals.slice(0, GOALS.max).map((g) => ({
            id: g.id,
            type: g.type,
            name: g.name.trim(),
            cost: norm(readField(g.cost, RULES.goalCost)),
            years: norm(readField(g.years, RULES.goalYears)),
            saved: norm(readField(g.saved, RULES.goalSaved)),
          }))
        : [],
    },
    retirement: {
      gate: a.retGate || null,
      age: retChosen ? norm(readField(a.ret.age, RULES.age)) : null,
      at: retChosen ? norm(readField(a.ret.at, RULES.age)) : null,
      until: retChosen ? norm(readField(a.ret.until, RULES.age)) : null,
      spend: retChosen ? { ...norm(readField(a.ret.spend, RULES.retSpend)), source: a.ret.spend.source } : null,
      agesValid: retChosen && Object.keys(retirementErrors(a)).filter((k) => k !== 'ret.spend').length === 0,
    },
    asm: {
      inf: needsAssumptions(a) ? norm(readField(a.asm.inf, RULES.inf)) : null,
      ret: needsAssumptions(a) ? norm(readField(a.asm.ret, RULES.ret)) : null,
    },
  };
}
