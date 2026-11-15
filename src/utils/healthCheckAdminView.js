/**
 * How the admin dashboard shows a Health Check lead and writes it to CSV, as pure functions so they can be tested
 * without rendering. A lead is either a Financial Health Check-up request (schemaVersion 2: contact details, consent
 * and a score summary) or a legacy row from the earlier 6-question check. No row ever holds a rupee amount.
 */
import { CATEGORY_IDS, CATEGORY_MAX } from './financialHealthCheck.js';
import { BANDS, CATEGORY_LABELS } from './financialHealthCheckCopy.js';

export const LEGACY_LABEL = 'Legacy 6-question';
export const NEW_LABEL = 'Check-up';
export const SELF_REPORTED = 'Self-reported';

/** True for a Financial Health Check-up request, false for a legacy 6-question row. */
export const isCheckupLead = (lead) => Boolean(lead && lead.schemaVersion === 2 && lead.result && typeof lead.result === 'object');

const formatDate = (value, locale = 'en-IN') => (value ? new Date(value).toLocaleString(locale) : '');

/** Per-category points for display: { id, label, points, max, applies }. */
export function categoryRows(lead) {
  const points = lead?.result?.points || {};
  return CATEGORY_IDS.map((id) => {
    const value = points[id];
    const applies = value !== null && value !== undefined;
    return { id, label: CATEGORY_LABELS[id], points: applies ? value : null, max: CATEGORY_MAX[id], applies };
  });
}

export const bandTitle = (band) => BANDS[band]?.title || '';

/** The text of the score cell for any lead. */
export function scoreText(lead) {
  if (isCheckupLead(lead)) return `${lead.result.score}/100`;
  if (lead?.status === 'completed' && lead.score !== null && lead.score !== undefined) return `${lead.score}/${lead.maxScore} (${lead.percent}%)`;
  return '—';
}

/** Second line under the score of a Check-up lead, e.g. "53 of 95 applicable points". */
export const applicableText = (lead) => (isCheckupLead(lead) ? `${lead.result.earned} of ${lead.result.applicable} applicable points` : '');

/** Consent line for a Check-up lead. */
export function consentText(lead) {
  const c = lead?.consent;
  if (!c || c.callback !== true) return 'No callback consent recorded';
  return `Callback consent given ${formatDate(c.acceptedAt)} (wording ${c.textVersion})`;
}

/** Stops a spreadsheet from running a name that starts with = + - @ as a formula. */
const safeText = (value) => {
  const text = String(value ?? '');
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
};

const quote = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;

export const CSV_HEADERS = Object.freeze([
  'Type',
  'Name',
  'Phone',
  'Status',
  'Score',
  'Earned',
  'Applicable',
  'Band',
  ...CATEGORY_IDS.map((id) => CATEGORY_LABELS[id]),
  'Consent',
  'Consent Text Version',
  'Consent Time',
  'Delete After',
  'Source of Score',
  'Legacy Score',
  'Legacy Max Score',
  'Legacy Percent',
  'Legacy Result',
  'Taken On',
]);

/** One CSV row (array of quoted cells) in the order of CSV_HEADERS. */
export function csvRow(lead) {
  const checkup = isCheckupLead(lead);
  const r = checkup ? lead.result : null;
  const legacyDone = !checkup && lead.status === 'completed';
  const cells = [
    checkup ? NEW_LABEL : LEGACY_LABEL,
    safeText(lead.fullName),
    lead.phone,
    lead.status,
    checkup ? r.score : '',
    checkup ? r.earned : '',
    checkup ? r.applicable : '',
    checkup ? bandTitle(r.band) : '',
    ...CATEGORY_IDS.map((id) => (checkup ? (r.points?.[id] === null || r.points?.[id] === undefined ? 'N/A' : r.points[id]) : '')),
    checkup ? (lead.consent?.callback === true ? 'Given' : 'Not recorded') : '',
    checkup ? lead.consent?.textVersion : '',
    checkup ? formatDate(lead.consent?.acceptedAt) : '',
    checkup ? formatDate(lead.deleteAfter) : '',
    checkup ? SELF_REPORTED : '',
    legacyDone ? lead.score : '',
    legacyDone ? lead.maxScore : '',
    legacyDone ? lead.percent : '',
    legacyDone ? lead.verdict : '',
    formatDate(lead.createdAt),
  ];
  return cells.map(quote);
}

/** The whole CSV text (header line plus one line per lead). */
export const buildCsv = (leads) => [CSV_HEADERS.map(quote).join(','), ...leads.map((l) => csvRow(l).join(','))].join('\n');
