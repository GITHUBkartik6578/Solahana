/**
 * Builds the whole Financial Kundli report from the answers: one pure, deterministic function.
 *
 *   answers -> normalizeAnswers -> each module (kundliCalc) -> hc-v1 score and Areas to Look At (PR-A engine, read-only)
 *           -> completeness summary
 *
 * Each module is calculated on its own and wrapped, so one failing section shows "could not be shown" and never takes
 * the rest of the report down (fail-closed). The hc-v1 score and the PR-A areas are built only when all nine Health
 * Check-up inputs are known; a missing one is never replaced by 0.
 */
import { CATEGORY_IDS, CATEGORY_MAX, scoreHealthCheck } from '../financialHealthCheck.js';
import { BANDS, CATEGORY_LABELS, normalizationNote, observationFor } from '../financialHealthCheckCopy.js';
import { formatRupeesExact, tryBuildInsights } from '../healthCheckInsights.js';
import {
  cashFlowModule,
  debtModule,
  emergencyModule,
  goalsModule,
  healthModule,
  isKnown,
  lifeModule,
  netWorthModule,
  retirementModule,
} from './kundliCalc.js';
import { CORE_FIELDS, CORE_CHOICES, MSG, REPORT, SEVERITY_LABELS } from './kundliCopy.js';
import { normalizeAnswers } from './kundliInputs.js';
import { assetParts, cashFlowParts, goalPath, retirementPath, standingRows } from './kundliCharts.js';

export const MODULE_ORDER = Object.freeze(['cashFlow', 'emergency', 'netWorth', 'debt', 'life', 'health', 'goals', 'retirement']);

const BUILDERS = {
  cashFlow: cashFlowModule,
  emergency: emergencyModule,
  netWorth: netWorthModule,
  debt: debtModule,
  life: lifeModule,
  health: healthModule,
  goals: goalsModule,
  retirement: retirementModule,
};

function safeModule(id, inp) {
  try {
    const m = BUILDERS[id](inp);
    // An incomplete section always says, inside its own card, what it is missing
    // (goals explain themselves goal by goal)
    if (m.id !== 'goals' && m.status === 'incomplete' && m.needs?.length &&!(m.messages || []).some((x) => x.kind === 'status')) {
      return { ...m, messages: [...(m.messages || []), { kind: 'status', text: MSG.partialNeeds(m.needs.join(', ')) }] };
    }
    return m;
  } catch {
    return { id, status: 'unavailable', figures: [], messages: [{ kind: 'status', text: REPORT.unavailable }] };
  }
}

const CORE_NAMES = {
  income: CORE_FIELDS.income.label,
  expenses: CORE_FIELDS.expenses.label,
  emi: CORE_FIELDS.emi.label,
  savings: CORE_FIELDS.savings.label,
  termCover: CORE_FIELDS.termCover.label,
  healthCover: CORE_FIELDS.healthCover.label,
  investments: CORE_FIELDS.investments.label,
};

/** The nine hc-v1 inputs in paise, or the list of what is missing. */
export function coreValues(inp) {
  const missing = Object.keys(CORE_NAMES).filter((k) => !isKnown(inp.core[k]));
  if (!inp.overlap) missing.push(CORE_CHOICES.overlap.label);
  if (!inp.business) missing.push(CORE_CHOICES.business.label);
  const names = missing.map((k) => CORE_NAMES[k] || k);
  if (names.length) return { ok: false, missing: names };
  const values = Object.fromEntries(Object.keys(CORE_NAMES).map((k) => [k, inp.core[k].value]));
  return { ok: true, values: { ...values, overlap: inp.overlap, business: inp.business } };
}

const RANK = { high: 0, medium: 1, low: 2 };

/** Areas to Look At: every category that lost points (severity from PR-A's table) plus the cash-flow alert (A3). */
export function buildAreas(insights, points) {
  const areas = [];
  const a3 = insights.alerts.find((a) => a.id === 'A3');
  if (a3) {
    const ess = a3.detail.kind === 'essentialsAndEmi';
    areas.push({
      id: 'A3',
      severity: a3.severity,
      label: ess ? SEVERITY_LABELS.high : REPORT.planningPoint,
      title: 'Monthly cash flow',
      text: ess ? MSG.A3ess(formatRupeesExact(a3.detail.essentialsAndEmiOverByPaise)) : MSG.A3inv(formatRupeesExact(a3.detail.overByPaise)),
      lost: Number.MAX_SAFE_INTEGER,
    });
  }
  CATEGORY_IDS.forEach((id) => {
    const severity = insights.severity[id];
    if (!severity) return;
    areas.push({ id, severity, label: SEVERITY_LABELS[severity], title: CATEGORY_LABELS[id], text: observationFor(id, points[id]), lost: CATEGORY_MAX[id] - points[id] });
  });
  return areas.sort((x, y) => RANK[x.severity] - RANK[y.severity] || y.lost - x.lost);
}

function scoreSection(inp) {
  const core = coreValues(inp);
  if (!core.ok) return { status: 'incomplete', text: REPORT.scoreNeeds(core.missing.join(', ')) };
  const built = tryBuildInsights(core.values);
  if (!built.ok) return { status: 'unavailable', text: REPORT.unavailable };
  const { insights } = built;
  const result = scoreHealthCheck(core.values); // the same hc-v1 function the Health Check-up and PR-A use
  return {
    status: 'complete',
    score: result.score,
    band: result.band,
    bandTitle: BANDS[result.band].title,
    bandLine: BANDS[result.band].line,
    note: normalizationNote(result),
    areas: buildAreas(insights, result.points),
    points: result.points,
    result, // the hc-v1 result: the only thing (with name and number) a callback request sends
  };
}

/** Sections counted in the "X of Y" summary: chosen and applicable ones only. It is not a score. */
export function summarize(modules) {
  const counted = modules.filter((m) => m.status !== 'not-chosen' && m.status !== 'not-applicable');
  const complete = counted.filter((m) => m.status === 'complete');
  return {
    complete: complete.length,
    total: counted.length,
    text: REPORT.summary(complete.length, counted.length),
    incomplete: counted.filter((m) => m.status !== 'complete').map((m) => ({ id: m.id, name: REPORT.moduleNames[m.id], status: m.status, needs: m.needs || [] })),
  };
}

/** The complete report view-model. `now` is passed in so tests are deterministic. */
export function buildReport(answers, now = new Date()) {
  const inp = normalizeAnswers(answers);
  const modules = MODULE_ORDER.map((id) => safeModule(id, inp));
  let score;
  try {
    score = scoreSection(inp);
  } catch {
    score = { status: 'unavailable', text: REPORT.unavailable };
  }
  const rates =
    inp.asm.inf || inp.asm.ret
      ? {
          inf: isKnown(inp.asm.inf) ? `${inp.asm.inf.value}% a year` : 'Not sure',
          ret: isKnown(inp.asm.ret) ? `${inp.asm.ret.value}% a year` : 'Not sure',
        }
      : null;
  // Graph data comes from the same answers and module results; a failure only hides the graphs (fail-closed)
  let charts = null;
  try {
    const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
    charts = {
      standing: standingRows(inp.core),
      cashFlow: cashFlowParts(inp.core),
      assets: assetParts(inp, byId.netWorth),
      goals: Object.fromEntries((byId.goals.goals || []).map((g) => [g.id, goalPath(g)])),
      retirement: retirementPath(byId.retirement),
    };
  } catch {
    charts = null;
  }
  return {
    date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    modules,
    charts,
    score,
    summary: summarize(modules),
    rates,
    showProjectionDisclosures: modules.some((m) => (m.id === 'goals' || m.id === 'retirement') && m.status !== 'not-chosen' && m.status !== 'not-applicable'),
    inputs: inp,
  };
}
