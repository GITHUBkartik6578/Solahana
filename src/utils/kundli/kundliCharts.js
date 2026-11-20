/**
 * Financial Kundli charts: the data behind every graph, as pure functions. No figure here is new: each point comes from the
 * same answers and formulas as the report's numbers (Step 3), so a chart can never disagree with the figures beside it.
 *
 *   standingRows      where you stand against the reference levels this check uses (growth / work on this / issue)
 *   cashFlowParts     where the monthly in-hand income goes
 *   assetParts        what the known assets are made of, and known liabilities
 *   goalPath          a goal, year by year: its cost rising with prices vs the money set aside plus the monthly amount
 *   retirementPath    retirement money, age by age: building up until retirement, then paying the spending until the chosen age
 *
 * Status in standingRows is decided with the same whole-paise comparisons as hc-v1 (never from a rounded float), so the
 * graph's "issue / work on this / strong" always matches the score's points.
 */
import { divCeil, divFloor, TARGETS } from '../healthCheckInsights.js';
import { ASSETS, ASSET_KEYS } from './kundliCopy.js';
import { isKnown } from './kundliCalc.js';

export const STANDING = Object.freeze({ good: 'Strong', partial: 'Work on this', issue: 'Issue' });

const tier = (full, partial) => (full ? 'good' : partial ? 'partial' : 'issue');

/**
 * One row per measurable area: value (for drawing), the reference marks, the zones, and the status.
 * higherIsBetter tells the chart which side of the scale is the good one.
 */
export function standingRows(core) {
  const { income, expenses, emi, savings, investments, termCover, healthCover } = core;
  const rows = [];
  const I = isKnown(income) ? income.value : 0;

  if (isKnown(expenses) && isKnown(savings) && expenses.value > 0) {
    const F = expenses.value;
    const L = savings.value;
    const tenths = divFloor(L * 10, F);
    rows.push({
      id: 'emergency',
      label: 'Emergency fund',
      value: tenths / 10,
      display: tenths === 0 ? 'less than 0.1 months' : `${(tenths / 10).toFixed(1)} months`,
      unit: 'months',
      marks: [TARGETS.runway.partialMonths, TARGETS.runway.fullMonths],
      higherIsBetter: true,
      status: tier(L >= F * TARGETS.runway.fullMonths, L >= F * TARGETS.runway.partialMonths),
      scaleMax: Math.max(9, Math.ceil(tenths / 10) + 1),
    });
  }
  if (I > 0 && isKnown(emi)) {
    const E = emi.value;
    const tenths = divCeil(E * 1000, I);
    rows.push({
      id: 'emi',
      label: 'EMIs as a share of income',
      value: tenths / 10,
      display: `${(tenths / 10).toFixed(1)}%`,
      unit: '%',
      marks: [TARGETS.emi.fullPct, TARGETS.emi.partialPct],
      higherIsBetter: false,
      status: tier(E * 100 <= I * TARGETS.emi.fullPct, E * 100 <= I * TARGETS.emi.partialPct),
      scaleMax: Math.max(60, Math.ceil(tenths / 10) + 5),
    });
  }
  if (I > 0 && isKnown(investments)) {
    const V = investments.value;
    const tenths = divFloor(V * 1000, I);
    rows.push({
      id: 'investment',
      label: 'Monthly investing as a share of income',
      value: tenths / 10,
      display: `${(tenths / 10).toFixed(1)}%`,
      unit: '%',
      marks: [TARGETS.investment.partialPct, TARGETS.investment.fullPct],
      higherIsBetter: true,
      status: tier(V * 100 >= I * TARGETS.investment.fullPct, V * 100 >= I * TARGETS.investment.partialPct),
      scaleMax: Math.max(30, Math.ceil(tenths / 10) + 5),
    });
  }
  if (I > 0 && isKnown(termCover)) {
    const T = termCover.value;
    const annual = I * 12;
    const tenths = divFloor(T * 10, annual);
    rows.push({
      id: 'term',
      label: 'Term cover (times yearly income)',
      value: tenths / 10,
      display: `${(tenths / 10).toFixed(1)}×`,
      unit: '×',
      marks: [TARGETS.term.partialMultiple, TARGETS.term.fullMultiple],
      higherIsBetter: true,
      status: tier(T >= annual * TARGETS.term.fullMultiple, T >= annual * TARGETS.term.partialMultiple),
      scaleMax: Math.max(15, Math.ceil(tenths / 10) + 2),
    });
  }
  if (isKnown(healthCover)) {
    const H = healthCover.value;
    const lakhTenths = divFloor(H, 1_000_000); // paise -> tenths of a lakh (₹10,000 = 1,000,000 paise)
    const refLakh = TARGETS.health.referencePaise / 10_000_000;
    rows.push({
      id: 'health',
      label: 'Health cover (₹ lakh)',
      value: lakhTenths / 10,
      display: `₹${(lakhTenths / 10).toFixed(1)} lakh`,
      unit: 'lakh',
      marks: [refLakh],
      higherIsBetter: true,
      status: H >= TARGETS.health.referencePaise ? 'good' : 'issue',
      scaleMax: Math.max(15, Math.ceil(lakhTenths / 10) + 2),
    });
  }
  // Values beyond the drawn scale are pinned to its end and say so (the exact value is in the label and the table)
  return rows.map((r) => {
    const cap = Math.min(r.scaleMax, r.unit === '%' ? 120 : r.unit === 'months' ? 24 : r.unit === '×' ? 30 : 50);
    return { ...r, scaleMax: cap, beyondScale: r.value > cap };
  });
}

/** Where the monthly income goes. Shares are of income; when spending and investing pass income, overBy says by how much. */
export function cashFlowParts(core) {
  const { income, expenses, emi, other, investments } = core;
  if (![income, expenses, emi, investments].every(isKnown) || income.value <= 0) return null;
  const I = income.value;
  const parts = [
    { id: 'fixed', label: 'Fixed expenses', paise: expenses.value },
    { id: 'emi', label: 'EMIs', paise: emi.value },
  ];
  const otherKnown = isKnown(other);
  if (otherKnown) parts.push({ id: 'other', label: 'Other spending', paise: other.value });
  parts.push({ id: 'investing', label: 'Investing', paise: investments.value });
  const used = parts.reduce((s, p) => s + p.paise, 0);
  if (used <= I && otherKnown) parts.push({ id: 'left', label: 'Left over', paise: I - used });
  const total = Math.max(I, used);
  return {
    incomePaise: I,
    totalPaise: total,
    overByPaise: Math.max(0, used - I),
    otherKnown,
    parts: parts.filter((p) => p.paise > 0).map((p) => ({ ...p, shareOfTotal: p.paise / total, pctOfIncomeTenths: divFloor(p.paise * 1000, I) })),
  };
}

const ASSET_LABELS = { LIQ: 'Liquid savings', RET: 'Retirement accounts', MF: 'Mutual funds and shares', FIX: 'Other deposits and savings', GOLD: 'Gold', HOME: 'Home you live in', PROP: 'Other property', OTHER: 'Anything else' };

/** Known assets by box (only boxes with an entered amount) and known liabilities. Null when net worth has nothing known. */
export function assetParts(inp, netWorth) {
  if (!netWorth || typeof netWorth.KA !== 'number') return null;
  const parts = [];
  if (isKnown(inp.core.savings) && inp.core.savings.value > 0) parts.push({ id: 'LIQ', label: ASSET_LABELS.LIQ, paise: inp.core.savings.value });
  if (inp.assets.section === 'confirmed') {
    ASSET_KEYS.forEach((k) => {
      const item = inp.assets.items[k];
      if (item.status === 'entered' && item.value > 0) parts.push({ id: k, label: ASSET_LABELS[k] || ASSETS.items[k].label, paise: item.value, estimate: ['GOLD', 'HOME', 'PROP', 'OTHER'].includes(k) });
    });
  }
  const KA = netWorth.KA;
  return {
    assetsPaise: KA,
    liabilitiesPaise: typeof netWorth.KL === 'number' ? netWorth.KL : null,
    parts: parts.map((p) => ({ ...p, share: KA > 0 ? p.paise / KA : 0 })),
  };
}

/** The money from monthly instalments invested at the start of each month, after `months` months (annuity due). */
export function sipValue(monthly, ret, months) {
  if (months <= 0 || monthly === 0) return 0;
  const r = ret / 1200;
  return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
}

/**
 * A goal year by year (year 0 = today): `cost` is today's cost grown at the yearly price rise; `money` is what was already set
 * aside (growing once a year) plus the monthly amount the report shows as needed. At the goal year money meets cost exactly
 * when something is still needed (it is how the monthly amount is worked out), or is above it when the goal is covered.
 */
export function goalPath(goal) {
  if (!goal || goal.status !== 'complete' || !goal.chartable) return null;
  const { cost, years, saved, inf, ret } = goal.params;
  const sip = goal.raw.SIP;
  const points = [];
  for (let y = 0; y <= years; y += 1) {
    points.push({ x: y, cost: cost * Math.pow(1 + inf / 100, y), money: saved * Math.pow(1 + ret / 100, y) + sipValue(sip, ret, y * 12) });
  }
  return { points, years, monthly: sip, covered: goal.raw.N === 0 };
}

/**
 * Retirement money by age: until retirement it is the retirement savings (growing once a year) plus the monthly amount the
 * report shows; from retirement it pays the yearly spending, which rises with prices every year and is taken out at the end
 * of each year, until the age chosen. With something still needed it reaches the amount needed at retirement and runs down
 * to (about) zero at the last age; when savings already cover it, it stays above zero.
 */
export function retirementPath(mod) {
  if (!mod || mod.status !== 'complete' || !mod.chartable) return null;
  const { age, at, until, savings, inf, ret } = mod.params;
  const { SIP, annual, K } = mod.raw;
  const points = [];
  for (let a = age; a <= at; a += 1) {
    const y = a - age;
    points.push({ x: a, money: savings * Math.pow(1 + ret / 100, y) + sipValue(SIP, ret, y * 12), phase: 'build' });
  }
  let balance = points[points.length - 1].money;
  let withdrawal = annual;
  for (let a = at + 1; a <= until; a += 1) {
    withdrawal *= 1 + inf / 100;
    balance = balance * (1 + ret / 100) - withdrawal;
    points.push({ x: a, money: balance, phase: 'spend' });
  }
  return { points, retireAge: at, corpus: K, covered: mod.raw.net === 0 };
}

/** ₹ in Indian short form for axes and labels: ₹45,000 · ₹12.5 L · ₹1.25 Cr. Negative values keep their sign. */
export function shortInr(rupees) {
  const sign = rupees < 0 ? '-' : '';
  const v = Math.abs(rupees);
  const trim = (s) => (s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s);
  if (v >= 1e7) return `${sign}₹${trim((v / 1e7).toFixed(v >= 1e9 ? 0 : 2))} Cr`;
  if (v >= 1e5) return `${sign}₹${trim((v / 1e5).toFixed(1))} L`;
  return `${sign}₹${Math.round(v).toLocaleString('en-IN')}`;
}

/** Clean axis ticks from 0 to at least max (1, 2, 2.5 or 5 times a power of ten). */
export function niceTicks(max, count = 4) {
  if (!(max > 0)) return [0, 1];
  const rough = max / count;
  const pow = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= rough);
  const ticks = [];
  for (let t = 0; t <= max + step * 0.999; t += step) ticks.push(Number(t.toPrecision(12)));
  return ticks;
}
