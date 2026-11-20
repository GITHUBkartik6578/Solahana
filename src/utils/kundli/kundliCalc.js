/**
 * Financial Kundli calculations (Step 3 formula specification, final). Pure functions: no network, no storage, no logging.
 *
 * Money from the questionnaire is in paise (whole numbers) and every Health Check-style comparison is done on those
 * integers, exactly like hc-v1 and the PR-A engine. Projections (goals, retirement) run in full-precision floating point
 * rupees; only the DISPLAY is rounded, in a fixed direction:
 *   amounts needed (future cost, still needed, monthly needed, spending, corpus) are rounded UP;
 *   amounts the customer would have (savings grown) are rounded DOWN.
 * A displayed (rounded) value is never used in a further calculation.
 *
 * Out-of-range rule (Step 3 + Step 4): if any "need side" figure is not a finite, safely countable number of paise, the
 * goal (or the whole retirement section) shows no amounts and says the figure is too large. If only the "savings grown"
 * figure is too large, the need is 0 (it can only exceed a need that fits): the section stays complete, the savings figure
 * is hidden with a short note, and the "covered" message is shown.
 *
 * Every figure carries a provenance tag (ENT, EST, ASM, CAL, CALEST, PRJ, REF, INFO). A figure that could not be
 * calculated has no tag, only a status text.
 */
import { observationFor } from '../financialHealthCheckCopy.js';
import {
  divCeil,
  divFloor,
  formatMonthsTenths,
  formatMultipleTenths,
  formatPercentTenths,
  formatRupeesCeil,
  formatRupeesExact,
  formatRupeesFloor,
  TARGETS,
} from '../healthCheckInsights.js';
import { ASSET_KEYS, ASSETS, ESTIMATE_ASSETS, FIG, GOAL_ELIGIBLE_ASSETS, GOALS, LIABILITIES, LOAN_KEYS, MSG, REPORT, SECTIONS } from './kundliCopy.js';

const KNOWN = ['entered', 'none'];
export const isKnown = (f) => !!f && KNOWN.includes(f.status);

const why = (f) => (f && f.status === 'not-sure' ? MSG.isNotSure : MSG.wasSkipped);

const fig = (key, label, display, tag, extra = {}) => ({ key, label, display, tag, ...extra });

// ---------------------------------------------------------------------------------------------------------------------
// Display rounding and the out-of-range guard (projections)
// ---------------------------------------------------------------------------------------------------------------------

/** Float noise this small (a millionth of a paisa) is ignored, so 525000.00000000006 is still exactly ₹5,25,000. */
const NOISE_PAISE = 1e-6;

/**
 * Rupees (float) -> whole paise, rounded in the display direction: 'up' for an amount the customer needs (it must never be
 * understated, not even by a fraction of a paisa), 'down' for an amount they would have. Only float noise below
 * NOISE_PAISE is ignored. Returns null when the value is not finite, negative, or beyond Number.MAX_SAFE_INTEGER paise.
 */
export function safePaise(rupees, direction = 'up') {
  if (!Number.isFinite(rupees) || rupees < 0) return null;
  const raw = rupees * 100;
  const paise = direction === 'down' ? Math.floor(raw + NOISE_PAISE) : Math.ceil(raw - NOISE_PAISE);
  return Number.isSafeInteger(paise) ? Math.max(0, paise) : null;
}
export const showUp = (paise) => formatRupeesCeil(paise);
export const showDown = (paise) => formatRupeesFloor(paise);

// ---------------------------------------------------------------------------------------------------------------------
// Module 1: savings and monthly cash flow
// ---------------------------------------------------------------------------------------------------------------------

export function cashFlowModule(inp) {
  const { income, expenses, emi, investments, other } = inp.core;
  const needs = [];
  [['income', income], ['expenses', expenses], ['emi', emi], ['investments', investments]].forEach(([name, f]) => {
    if (!isKnown(f)) needs.push(name);
  });
  if (needs.length) return { id: 'cashFlow', status: 'incomplete', figures: [], messages: [], needs };

  const I = income.value;
  const F = expenses.value;
  const E = emi.value;
  const V = investments.value;
  const figures = [];
  const messages = [];

  // CF-2 (exists in PR-A as the investment rate)
  const investing = fig('investing', FIG.investing, `${formatRupeesExact(V)} (${formatPercentTenths(divFloor(V * 1000, I))})`, 'CAL', { paise: V });

  // CF-4 (A3), unchanged from PR-A: committed = F + E + V above income, left out when the EMI alone is above income.
  let a3 = null;
  const committed = F + E + V;
  if (committed > I && !(E > I)) {
    const kind = F + E > I ? 'essentialsAndEmi' : 'investments';
    a3 = { kind, overByPaise: committed - I, essentialsAndEmiOverByPaise: Math.max(0, F + E - I) };
  }
  // A3 is shown in this section too, with or without 'Other monthly spending' (Step 3: CF-4 is always shown)
  const a3Message = a3
    ? { kind: a3.kind === 'essentialsAndEmi' ? 'warn' : 'info', text: a3.kind === 'essentialsAndEmi' ? MSG.A3ess(formatRupeesExact(a3.essentialsAndEmiOverByPaise)) : MSG.A3inv(formatRupeesExact(a3.overByPaise)) }
    : null;

  if (!isKnown(other)) {
    figures.push(investing);
    messages.push({ kind: 'status', text: MSG.S3(why(other)) });
    if (a3Message) messages.push(a3Message);
    return { id: 'cashFlow', status: 'incomplete', figures, messages, a3, needs: [otherNeed(other)] };
  }

  const D = other.value;
  const S = I - F - E - D; // CF-1
  if (S < 0) {
    // The negative capacity is said in words (MSG-S1); CF-3 and its message are suppressed.
    figures.push(investing);
    messages.push({ kind: 'warn', text: MSG.S1(formatRupeesExact(-S)) });
  } else {
    figures.push(fig('savingsCapacity', FIG.savingsCapacity, `${formatRupeesExact(S)} (${formatPercentTenths(divFloor(S * 1000, I))})`, 'CAL', { paise: S }));
    figures.push(investing);
    const C = S - V; // CF-3
    if (C < 0) messages.push({ kind: 'warn', text: MSG.S2(formatRupeesExact(-C)) });
    else figures.push(fig('cashAfter', FIG.cashAfter, `${formatRupeesExact(C)} (${formatPercentTenths(divFloor(C * 1000, I))})`, 'CAL', { paise: C }));
  }

  // CF-5: informational full budget
  const full = F + E + D + V;
  const over = Math.max(0, full - I);
  figures.push(fig('fullBudget', FIG.fullBudget, formatRupeesExact(full), 'INFO', { paise: full }));
  if (over > 0) messages.push({ kind: 'info', text: MSG.FB(formatRupeesExact(full), formatRupeesExact(over)) });
  if (a3Message) messages.push(a3Message);

  return { id: 'cashFlow', status: 'complete', figures, messages, a3, identity: S >= 0 ? { S, V, C: S - V } : null };
}

function otherNeed(other) {
  return `Other monthly spending (${other && other.status === 'not-sure' ? 'Not sure' : 'skipped'})`;
}

// ---------------------------------------------------------------------------------------------------------------------
// Module 2: emergency fund
// ---------------------------------------------------------------------------------------------------------------------

export function emergencyModule(inp) {
  const { expenses, savings, emi } = inp.core;
  if (!isKnown(expenses) || !isKnown(savings)) return { id: 'emergency', status: 'incomplete', figures: [], messages: [], needs: ['fixed expenses and liquid savings'] };
  const F = expenses.value;
  const L = savings.value;
  if (F === 0) {
    return { id: 'emergency', status: 'not-applicable', figures: [], messages: [{ kind: 'status', text: observationFor('emergency', null) }] };
  }
  const tenths = divFloor(L * 10, F);
  const points = L >= F * TARGETS.runway.fullMonths ? 20 : L >= F * TARGETS.runway.partialMonths ? 10 : 0;
  const figures = [fig('runway', FIG.runway, tenths === 0 ? 'less than 0.1' : formatMonthsTenths(tenths), 'CAL', { tenths })];
  figures.push(fig('runwayRef', 'Reference levels', '3 and 6 months', 'REF'));
  const messages = [];
  if (tenths === 0) messages.push({ kind: 'warn', text: MSG.runwayTiny });
  messages.push({ kind: points === 0 ? 'warn' : 'note', text: observationFor('emergency', points) });
  if (isKnown(emi) && emi.value > 0) {
    const withEmi = divFloor(L * 10, F + emi.value);
    figures.push(fig('runwayWithEmi', FIG.runwayWithEmi, `${formatMonthsTenths(withEmi)} months`, 'INFO', { tenths: withEmi }));
    messages.push({ kind: 'info', text: MSG.EF3(formatMonthsTenths(withEmi)) });
  }
  return { id: 'emergency', status: 'complete', figures, messages, points, alertA1: points === 0 };
}

// ---------------------------------------------------------------------------------------------------------------------
// Module 3: assets, liabilities and net worth
// ---------------------------------------------------------------------------------------------------------------------

/** Known assets, known liabilities and (only when everything is known) net worth. GOAL-SAVED is never added. */
export function netWorthModule(inp) {
  const { savings } = inp.core;
  if (!isKnown(savings)) return { id: 'netWorth', status: 'incomplete', figures: [], messages: [], needs: ['liquid savings'] };

  const assets = inp.assets;
  const liabilities = inp.liabilities;
  const needs = [];
  let KA = savings.value;
  let usedEstimate = false;
  let homePaise = null;

  if (assets.section === 'confirmed') {
    ASSET_KEYS.forEach((k) => {
      const item = assets.items[k];
      if (item.status === 'entered') {
        KA += item.value;
        if (ESTIMATE_ASSETS.includes(k)) usedEstimate = true;
        if (k === 'HOME') homePaise = item.value;
      } else if (item.ticked) needs.push(`${ASSETS.items[k].label.split(':')[0]} (Not sure)`);
    });
  } else needs.push(`${SECTIONS.own} (${assets.section === 'skipped' ? 'skipped' : 'not answered'})`);

  let KL = 0;
  if (liabilities.section === 'confirmed') {
    Object.entries(liabilities.items).forEach(([k, item]) => {
      if (item.status === 'entered') KL += item.value;
      else if (item.ticked) needs.push(`${LIABILITIES.items[k].label} (Not sure)`);
    });
  } else needs.push(`${SECTIONS.owe} (${liabilities.section === 'skipped' ? 'skipped' : 'not answered'})`);

  const kaTag = usedEstimate ? 'CALEST' : 'CAL';
  const figures = [fig('knownAssets', FIG.knownAssets, formatRupeesExact(KA), kaTag, { paise: KA })];
  if (homePaise !== null) figures.push(fig('ownHome', FIG.ownHome, formatRupeesExact(homePaise), 'EST', { paise: homePaise, note: 'included' }));
  const messages = [];
  const liabilitiesKnown = liabilities.section === 'confirmed';
  if (liabilitiesKnown) figures.push(fig('knownLiabilities', FIG.knownLiabilities, formatRupeesExact(KL), 'CAL', { paise: KL }));
  else messages.push({ kind: 'status', text: MSG.liabilitiesNotProvided });
  if (assets.section === 'skipped') messages.unshift({ kind: 'status', text: MSG.assetsOnlyLiquid(formatRupeesExact(KA)) });

  if (needs.length) {
    // When a section was skipped its own line already gives the known totals, so only the missing list is added
    const sectionLine = assets.section !== 'confirmed' || !liabilitiesKnown;
    messages.push({
      kind: 'status',
      text: sectionLine ? MSG.nwNeedsOnly(needs.join(', ')) : MSG.nwNeeds(formatRupeesExact(KA), formatRupeesExact(KL), needs.join(', ')),
    });
    return { id: 'netWorth', status: 'incomplete', figures, messages, needs, KA, KL: liabilitiesKnown ? KL : null };
  }
  const NW = KA - KL;
  figures.push(fig('netWorth', FIG.netWorth, NW < 0 ? `${formatRupeesExact(-NW)} more owed than owned` : formatRupeesExact(NW), kaTag, { paise: NW }));
  if (NW < 0) messages.push({ kind: 'warn', text: MSG.nwNegative(formatRupeesExact(-NW)) });
  return { id: 'netWorth', status: 'complete', figures, messages, KA, KL, NW };
}

// ---------------------------------------------------------------------------------------------------------------------
// Module 4: debt and EMI
// ---------------------------------------------------------------------------------------------------------------------

export function debtModule(inp) {
  const { income, emi } = inp.core;
  if (!isKnown(income) || !isKnown(emi) || income.value <= 0) return { id: 'debt', status: 'incomplete', figures: [], messages: [], needs: ['income and EMI'] };
  const I = income.value;
  const E = emi.value;
  const points = E * 100 <= I * 30 ? 20 : E * 100 <= I * 45 ? 10 : 0;
  const figures = [fig('emiShare', FIG.emiShare, formatPercentTenths(divCeil(E * 1000, I)), 'CAL', { tenths: divCeil(E * 1000, I) })];
  figures.push(fig('emiRef', 'Reference levels', '30% and 45%', 'REF'));
  const messages = [{ kind: points === 0 ? 'warn' : 'note', text: observationFor('emi', points) }];
  const needs = [];

  const liab = inp.liabilities;
  if (liab.section === 'confirmed') {
    let loans = 0;
    let unknown = false;
    LOAN_KEYS.forEach((k) => {
      const item = liab.items[k];
      if (item.status === 'entered') loans += item.value;
      else if (item.ticked) unknown = true;
    });
    if (unknown) needs.push('loan amounts marked Not sure');
    else figures.push(fig('loans', FIG.loans, formatRupeesExact(loans), 'CAL', { paise: loans }));
    const anyLoan = LOAN_KEYS.some((k) => liab.items[k].ticked);
    if (E > 0 && !anyLoan) messages.push({ kind: 'info', text: LIABILITIES.emiNoLoan });
    if (anyLoan && E === 0) messages.push({ kind: 'info', text: LIABILITIES.loanNoEmi });
  } else needs.push(`${SECTIONS.owe} (${liab.section === 'skipped' ? 'skipped' : 'not answered'})`);

  return { id: 'debt', status: needs.length ? 'incomplete' : 'complete', figures, messages, needs, points, alertA2: points === 0 };
}

// ---------------------------------------------------------------------------------------------------------------------
// Modules 5 and 6: life cover (income multiple) and health cover (reference level)
// ---------------------------------------------------------------------------------------------------------------------

export function lifeModule(inp) {
  const { income, termCover } = inp.core;
  if (!isKnown(termCover)) {
    return { id: 'life', status: 'incomplete', figures: [], messages: [{ kind: 'status', text: MSG.lifeNotChecked(why(termCover)) }], needs: ['term cover'] };
  }
  if (!isKnown(income) || income.value <= 0) return { id: 'life', status: 'incomplete', figures: [], messages: [], needs: ['monthly income'] };
  const I = income.value;
  const cover = termCover.value;
  const annual = I * 12;
  const points = cover >= annual * TARGETS.term.fullMultiple ? 20 : cover >= annual * TARGETS.term.partialMultiple ? 10 : 0;
  const tenths = divFloor(cover * 10, annual);
  const figures = [
    fig('termMultiple', FIG.termMultiple, formatMultipleTenths(tenths), 'CAL', { tenths }),
    fig('termCover', FIG.termCover, formatRupeesExact(cover), 'ENT', { paise: cover }),
    fig('termRef', 'Reference levels', '5 and 10 times yearly income', 'REF'),
  ];
  const messages = [];
  if (cover === 0) messages.push({ kind: 'warn', text: MSG.noTerm });
  messages.push({ kind: points === 0 ? 'warn' : 'note', text: observationFor('term', points) });
  return { id: 'life', status: 'complete', figures, messages, points, alertR1: points === 0 };
}

export function healthModule(inp) {
  const { healthCover } = inp.core;
  if (!isKnown(healthCover)) {
    return { id: 'health', status: 'incomplete', figures: [], messages: [{ kind: 'status', text: MSG.healthNotChecked(why(healthCover)) }], needs: ['health cover'] };
  }
  const cover = healthCover.value;
  const points = cover >= TARGETS.health.referencePaise ? 15 : 0;
  const figures = [
    fig('healthCover', FIG.healthCover, formatRupeesExact(cover), 'ENT', { paise: cover }),
    fig('healthRef', FIG.healthReference, formatRupeesExact(TARGETS.health.referencePaise), 'REF'),
  ];
  const messages = [];
  if (cover === 0) messages.push({ kind: 'warn', text: MSG.noHealth });
  messages.push({ kind: points === 0 ? 'warn' : 'note', text: observationFor('health', points) });
  return { id: 'health', status: 'complete', figures, messages, points, alertR2: points === 0 };
}

// ---------------------------------------------------------------------------------------------------------------------
// Module 7: goals
// ---------------------------------------------------------------------------------------------------------------------

/** The goal maths (calculateGoal, with the customer's own rates): returns raw floats. */
export function goalMaths({ cost, years, saved, inf, ret }) {
  const FT = cost * Math.pow(1 + inf / 100, years);
  const FS = saved * Math.pow(1 + ret / 100, years);
  const N = Math.max(0, FT - FS);
  const r = ret / 1200;
  const n = years * 12;
  const SIP = N === 0 ? 0 : (N * r) / (Math.pow(1 + r, n) - 1) / (1 + r);
  return { FT, FS, N, SIP };
}

const goalTitle = (g) => (g.type === 'other' && g.name ? g.name : GOALS.types.find((t) => t.value === g.type)?.label || 'Goal');

function oneGoal(g, inf, ret) {
  const needs = [];
  if (!isKnown(g.cost)) needs.push(`cost (${g.cost.status === 'not-sure' ? 'Not sure' : 'missing'})`);
  if (!isKnown(g.years)) needs.push(`years (${g.years.status === 'not-sure' ? 'Not sure' : 'missing'})`);
  if (!isKnown(g.saved)) needs.push(`amount already set aside (${g.saved.status === 'not-sure' ? 'Not sure' : 'missing'})`);
  if (!isKnown(inf)) needs.push(`yearly rise in prices (${inf?.status === 'not-sure' ? 'Not sure' : 'missing'})`);
  if (!isKnown(ret)) needs.push(`yearly return (${ret?.status === 'not-sure' ? 'Not sure' : 'missing'})`);
  const base = { id: g.id, title: goalTitle(g) };
  if (needs.length) return { ...base, status: 'incomplete', figures: [], messages: [{ kind: 'status', text: MSG.goalNotCalculated(needs.join(', ')) }], needs };

  const params = { cost: g.cost.value / 100, years: g.years.value, saved: g.saved.value / 100, inf: inf.value, ret: ret.value };
  const m = goalMaths(params);
  const pFT = safePaise(m.FT);
  const pN = safePaise(m.N);
  const pSIP = safePaise(m.SIP);
  if (pFT === null || pN === null || pSIP === null) {
    return { ...base, status: 'out-of-range', figures: [], messages: [{ kind: 'status', text: REPORT.tooLarge }] };
  }
  const pFS = safePaise(m.FS, 'down');
  const figures = [
    fig('futureCost', FIG.futureCost, showUp(pFT), 'PRJ'),
    pFS === null ? fig('savedFuture', FIG.savedFuture, REPORT.tooLargeSavings, null, { hidden: true }) : fig('savedFuture', FIG.savedFuture, showDown(pFS), 'PRJ'),
    fig('stillNeeded', FIG.stillNeeded, showUp(pN), 'PRJ'),
    fig('monthlyNeeded', FIG.monthlyNeeded, showUp(pSIP), 'PRJ'),
  ];
  const messages = m.N === 0 ? [{ kind: 'good', text: MSG.goalCovered }] : [];
  // params + raw feed the year-by-year chart (kundliCharts.js); the FS-too-large case gets no chart
  return { ...base, status: 'complete', figures, messages, years: g.years.value, raw: m, params, chartable: pFS !== null };
}

/** GL-6: total set aside for goals vs the goal-eligible boxes (mutual funds and shares, other deposits, gold). Warning only. */
export function goalCapCheck(inp) {
  const total = inp.goals.list.reduce((sum, g) => sum + (g.saved.status === 'entered' ? g.saved.value : 0), 0);
  if (total === 0) return null;
  const assets = inp.assets;
  let eligible = 0;
  let unknown = assets.section !== 'confirmed';
  if (!unknown) {
    GOAL_ELIGIBLE_ASSETS.forEach((k) => {
      const item = assets.items[k];
      if (item.status === 'entered') eligible += item.value;
      else if (item.ticked) unknown = true;
    });
  }
  if (total <= eligible) return null;
  return unknown ? { kind: 'info', text: MSG.goalCapUnknown } : { kind: 'warn', text: MSG.goalCap };
}

export function goalsModule(inp) {
  if (inp.goals.gate !== 'yes' || inp.goals.list.length === 0) return { id: 'goals', status: 'not-chosen', goals: [], messages: [] };
  const goals = inp.goals.list.map((g) => oneGoal(g, inp.asm.inf, inp.asm.ret));
  const messages = [];
  const cap = goalCapCheck(inp);
  if (cap) messages.push(cap);
  const status = goals.every((g) => g.status === 'complete') ? 'complete' : 'incomplete';
  return { id: 'goals', status, goals, messages, needs: goals.filter((g) => g.status !== 'complete').map((g) => g.title) };
}

// ---------------------------------------------------------------------------------------------------------------------
// Module 8: retirement
// ---------------------------------------------------------------------------------------------------------------------

/** calculateRetirement with the customer's own planning-until age instead of a fixed 25 years. Returns raw floats. */
export function retirementMaths({ age, at, until, spend, savings, inf, ret }) {
  const Yr = at - age;
  const H = until - at;
  const monthly = spend * Math.pow(1 + inf / 100, Yr);
  const annual = monthly * 12;
  const g = (1 + ret / 100) / (1 + inf / 100) - 1;
  const K = Math.abs(g) < 1e-9 ? annual * H : annual * ((1 - Math.pow(1 + g, -H)) / g);
  const FS = savings * Math.pow(1 + ret / 100, Yr);
  const net = Math.max(0, K - FS);
  const m = ret / 1200;
  const N = Yr * 12;
  const SIP = net === 0 ? 0 : (net * m) / (Math.pow(1 + m, N) - 1) / (1 + m);
  return { Yr, H, monthly, annual, K, FS, net, SIP };
}

export function retirementModule(inp) {
  const r = inp.retirement;
  if (r.gate === 'retired') return { id: 'retirement', status: 'not-applicable', figures: [], messages: [] };
  if (r.gate !== 'yes') return { id: 'retirement', status: 'not-chosen', figures: [], messages: [] };
  const needs = [];
  if (!r.agesValid) needs.push('your ages');
  if (!isKnown(r.spend)) needs.push(`monthly spending after retirement (${r.spend?.status === 'not-sure' ? 'Not sure' : 'missing'})`);
  // Retirement savings = the EPF, PPF and NPS box from 'What you own'
  let savingsPaise = null;
  const a = inp.assets;
  if (a.section !== 'confirmed') needs.push(`retirement savings (${SECTIONS.own} ${a.section === 'skipped' ? 'was skipped' : 'not answered'})`);
  else if (a.items.RET.status === 'entered' || a.items.RET.status === 'none') savingsPaise = a.items.RET.value;
  else needs.push('retirement savings (Not sure)');
  if (!isKnown(inp.asm.inf)) needs.push(`yearly rise in prices (${inp.asm.inf?.status === 'not-sure' ? 'Not sure' : 'missing'})`);
  if (!isKnown(inp.asm.ret)) needs.push(`yearly return (${inp.asm.ret?.status === 'not-sure' ? 'Not sure' : 'missing'})`);
  if (needs.length) return { id: 'retirement', status: 'incomplete', figures: [], messages: [{ kind: 'status', text: MSG.retNotCalculated(needs.join(', ')) }], needs };

  const params = {
    age: r.age.value,
    at: r.at.value,
    until: r.until.value,
    spend: r.spend.value / 100,
    savings: savingsPaise / 100,
    inf: inp.asm.inf.value,
    ret: inp.asm.ret.value,
  };
  const m = retirementMaths(params);
  const need = { monthly: safePaise(m.monthly), annual: safePaise(m.annual), K: safePaise(m.K), net: safePaise(m.net), SIP: safePaise(m.SIP) };
  if (Object.values(need).some((p) => p === null)) {
    return { id: 'retirement', status: 'out-of-range', figures: [], messages: [{ kind: 'status', text: REPORT.tooLarge }] };
  }
  const pFS = safePaise(m.FS, 'down');
  const figures = [
    fig('monthlyAtRetirement', FIG.monthlyAtRetirement, showUp(need.monthly), 'PRJ'),
    fig('annualAtRetirement', FIG.annualAtRetirement, showUp(need.annual), 'PRJ'),
    fig('corpus', FIG.corpus, showUp(need.K), 'PRJ'),
    pFS === null ? fig('retSavingsFuture', FIG.retSavingsFuture, REPORT.tooLargeSavings, null, { hidden: true }) : fig('retSavingsFuture', FIG.retSavingsFuture, showDown(pFS), 'PRJ'),
    fig('netNeeded', FIG.netNeeded, showUp(need.net), 'PRJ'),
    fig('retMonthlyNeeded', FIG.retMonthlyNeeded, showUp(need.SIP), 'PRJ'),
  ];
  const messages = m.net === 0 ? [{ kind: 'good', text: MSG.retCovered }] : [];
  return { id: 'retirement', status: 'complete', figures, messages, years: { toRetire: m.Yr, after: m.H }, raw: m, params, chartable: pFS !== null };
}
