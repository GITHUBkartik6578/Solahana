/**
 * "My check-up file": the customer's own record of past check-ups (the Kundli module in code), so the report can show growth over time.
 *
 * The file is created in the browser and downloaded to the customer's device; loading it reads it back in the browser.
 * Solahana never receives or stores it, and nothing is written to browser storage. A loaded file is UNTRUSTED input: it is
 * size-limited, parsed as JSON only, and every value is copied key by key into a fresh answer model (unknown keys dropped,
 * strings length-capped, choices checked against their allowed values), so a tampered file can only produce answers the
 * questionnaire itself could produce. Figures are never read from the file: each saved Kundli is recalculated from its
 * answers with today's calculation rules, so then and now are always compared like for like.
 */
import { ASSET_KEYS, GOALS, LIABILITY_KEYS } from './kundliCopy.js';
import { blankGoal, emptyAnswers } from './kundliInputs.js';
import { buildReport } from './kundliReport.js';

export const FILE_FORMAT = 'solahana-financial-health-checkup';
/** Files saved before the rename carry this format id and still open. */
export const LEGACY_FILE_FORMATS = Object.freeze(['solahana-financial-kundli']);
export const FILE_VERSION = 1;
export const MAX_FILE_BYTES = 1_000_000;
export const MAX_HISTORY = 24;

const STATES = ['', 'none', 'not-sure'];
const str = (v, max = 40) => (typeof v === 'string' ? v.slice(0, max) : '');
const oneOf = (v, allowed) => (allowed.includes(v) ? v : '');
const field = (f) => ({ raw: str(f?.raw), state: oneOf(f?.state, STATES) });

/** Copies a stored answer object into a clean answer model. Anything unexpected is dropped. */
export function sanitizeAnswers(raw) {
  const a = emptyAnswers();
  if (!raw || typeof raw !== 'object') return a;
  Object.keys(a.fields).forEach((k) => {
    a.fields[k] = field(raw.fields?.[k]);
  });
  a.overlap = oneOf(raw.overlap, ['', 'yes', 'no']);
  a.business = oneOf(raw.business, ['', 'yes', 'no', 'na']);
  [['assets', ASSET_KEYS], ['liabilities', LIABILITY_KEYS]].forEach(([name, keys]) => {
    const src = raw[name] || {};
    a[name].skipped = src.skipped === true;
    a[name].confirmed = src.confirmed === true && !a[name].skipped;
    keys.forEach((k) => {
      a[name].ticked[k] = !a[name].skipped && src.ticked?.[k] === true;
      a[name].amounts[k] = a[name].ticked[k] ? field(src.amounts?.[k]) : { raw: '', state: '' };
    });
  });
  a.goalsGate = oneOf(raw.goalsGate, ['', 'yes', 'no']);
  const goals = Array.isArray(raw.goals) ? raw.goals.slice(0, GOALS.max) : [];
  a.goals =
    a.goalsGate === 'yes'
      ? goals.map((g) => ({
          ...blankGoal(),
          type: oneOf(g?.type, GOALS.types.map((t) => t.value)),
          name: str(g?.name, 40),
          cost: field(g?.cost),
          years: field(g?.years),
          saved: field(g?.saved),
        }))
      : [];
  if (a.goalsGate === 'yes' && a.goals.length === 0) a.goalsGate = '';
  a.retGate = oneOf(raw.retGate, ['', 'yes', 'retired', 'no']);
  if (a.retGate === 'yes') {
    a.ret = {
      age: field(raw.ret?.age),
      at: field(raw.ret?.at),
      until: field(raw.ret?.until),
      spend: { ...field(raw.ret?.spend), source: oneOf(raw.ret?.spend?.source, ['typed', 'fixed', 'fixedPlusOther']) || 'typed' },
    };
  }
  a.asm = { inf: field(raw.asm?.inf), ret: field(raw.asm?.ret) };
  return a;
}

const isDay = (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(d));
export const dayOf = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Reads a Kundli file's text. Returns { ok: true, history } (oldest first) or { ok: false, error } with a customer message. */
export function parseKundliFile(text) {
  if (typeof text !== 'string' || text.length === 0) return { ok: false, error: FILE_ERRORS.empty };
  if (text.length > MAX_FILE_BYTES) return { ok: false, error: FILE_ERRORS.tooBig };
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: FILE_ERRORS.notKundli };
  }
  const knownFormat = data && (data.format === FILE_FORMAT || LEGACY_FILE_FORMATS.includes(data.format));
  if (!knownFormat || !Array.isArray(data.history)) return { ok: false, error: FILE_ERRORS.notKundli };
  if (data.version !== FILE_VERSION) return { ok: false, error: FILE_ERRORS.version };
  const history = data.history
    .filter((h) => h && isDay(h.date) && h.answers && typeof h.answers === 'object')
    .slice(-MAX_HISTORY)
    .map((h) => ({ date: h.date, answers: sanitizeAnswers(h.answers) }))
    .sort((x, y) => x.date.localeCompare(y.date));
  if (history.length === 0) return { ok: false, error: FILE_ERRORS.noEntries };
  return { ok: true, history };
}

/** The file text: the earlier entries plus today's Kundli (a second save on the same day replaces that day's entry). */
export function buildKundliFile(history, answers, now = new Date()) {
  const today = dayOf(now);
  const earlier = (history || []).filter((h) => h.date !== today);
  const all = [...earlier, { date: today, answers: sanitizeAnswers(answers) }].sort((x, y) => x.date.localeCompare(y.date)).slice(-MAX_HISTORY);
  return JSON.stringify({ format: FILE_FORMAT, version: FILE_VERSION, savedOn: today, history: all }, null, 1);
}

export const fileNameFor = (now = new Date()) => `solahana-financial-health-checkup-${dayOf(now)}.json`;

export const FILE_ERRORS = Object.freeze({
  empty: 'This file is empty.',
  tooBig: 'This file is too large to be a Financial Health Check-up file.',
  notKundli: 'This is not a Solahana Financial Health Check-up file. Please choose the file you saved from your report.',
  version: 'This Financial Health Check-up file was made by a different version and cannot be opened here.',
  noEntries: 'This Financial Health Check-up file has no saved check-up in it.',
});

/** The figures compared over time, recalculated from one Kundli's answers. Unknown figures are null, never 0. */
export function snapshotMetrics(answers, date) {
  const r = buildReport(answers, new Date(`${date}T12:00:00`));
  const byId = Object.fromEntries(r.modules.map((m) => [m.id, m]));
  const core = r.inputs.core;
  const known = (f) => f && (f.status === 'entered' || f.status === 'none');
  const allKnown = ['income', 'expenses', 'emi', 'other'].every((k) => known(core[k]));
  return {
    date,
    score: r.score.status === 'complete' ? r.score.score : null,
    netWorth: byId.netWorth.status === 'complete' ? byId.netWorth.NW : null,
    knownAssets: typeof byId.netWorth.KA === 'number' ? byId.netWorth.KA : null,
    knownLiabilities: typeof byId.netWorth.KL === 'number' ? byId.netWorth.KL : null,
    monthlySavings: allKnown ? core.income.value - core.expenses.value - core.emi.value - core.other.value : null,
    monthlyInvesting: known(core.investments) ? core.investments.value : null,
    standing: Object.fromEntries((r.charts?.standing || []).map((s) => [s.id, { value: s.value, display: s.display, status: s.status }])),
  };
}

/** Then-and-now series: every saved Kundli (oldest first) plus the current one, which replaces a saved entry of the same day. */
export function progressSeries(history, answers, now = new Date()) {
  const today = dayOf(now);
  const past = (history || []).filter((h) => h.date !== today).map((h) => snapshotMetrics(h.answers, h.date));
  return [...past, snapshotMetrics(answers, today)];
}
