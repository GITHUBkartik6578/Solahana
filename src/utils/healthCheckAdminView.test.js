import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  CSV_HEADERS,
  LEGACY_LABEL,
  NEW_LABEL,
  applicableText,
  bandTitle,
  buildCsv,
  categoryRows,
  consentText,
  csvRow,
  isCheckupLead,
  scoreText,
} from './healthCheckAdminView';
import { LEGAL_PAGES } from '../data/legalPages';

const checkup = (over = {}) => ({
  _id: 'a1', fullName: 'Asha Rao', phone: '9876543210', status: 'completed', schemaVersion: 2,
  createdAt: '2026-10-24T10:00:00Z', deleteAfter: '2028-10-24T10:00:00Z',
  consent: { callback: true, textVersion: 'hc-consent-v1', textHash: 'x', acceptedAt: '2026-10-24T10:00:00Z' },
  result: {
    scoringVersion: 'hc-v1', shieldingApplicable: false, emergencyMeasurable: true,
    points: { emi: 20, term: 10, emergency: 10, investment: 8, health: 0, overlap: 5, shielding: null },
    earned: 53, applicable: 95, score: 56, band: 'good',
  },
  ...over,
});
const legacy = (over = {}) => ({
  _id: 'l1', fullName: 'Old Row', phone: '9123456789', status: 'completed', score: 7, maxScore: 12, percent: 58,
  verdict: 'A solid start, with real gaps.', answers: [{ questionId: 'q1', area: 'Emergency fund', question: 'Q?', answer: 'A', score: 2 }],
  createdAt: '2025-01-05T10:00:00Z', ...over,
});

describe('admin health check view', () => {
  it('tells a Check-up row from a legacy row', () => {
    expect(isCheckupLead(checkup())).toBe(true);
    expect(isCheckupLead(legacy())).toBe(false);
    expect(isCheckupLead({ schemaVersion: 2 })).toBe(false);
    expect(isCheckupLead(null)).toBe(false);
  });
  it('shows score, applicable points, band and consent for a Check-up row', () => {
    const l = checkup();
    expect(scoreText(l)).toBe('56/100');
    expect(applicableText(l)).toBe('53 of 95 applicable points');
    expect(bandTitle('good')).toBe('A good base, with gaps to close');
    expect(consentText(l)).toMatch(/Callback consent given .*hc-consent-v1/);
    expect(consentText(checkup({ consent: undefined }))).toBe('No callback consent recorded');
  });
  it('lists all seven categories and marks the left-out one N/A', () => {
    const rows = categoryRows(checkup());
    expect(rows).toHaveLength(7);
    const shielding = rows.find((r) => r.id === 'shielding');
    expect(shielding.applies).toBe(false);
    expect(shielding.points).toBeNull();
    expect(rows.find((r) => r.id === 'emi')).toMatchObject({ points: 20, max: 20, applies: true });
  });
  it('keeps the legacy score format for a legacy row', () => {
    expect(scoreText(legacy())).toBe('7/12 (58%)');
    expect(scoreText(legacy({ status: 'started', score: null }))).toBe('—');
    expect(applicableText(legacy())).toBe('');
  });
});

describe('health check CSV', () => {
  it('has the new columns and keeps the legacy ones', () => {
    expect(CSV_HEADERS).toEqual(expect.arrayContaining(['Type', 'Score', 'Earned', 'Applicable', 'Band', 'Consent', 'Consent Time', 'Legacy Score', 'Legacy Max Score', 'Legacy Percent', 'Legacy Result', 'Taken On']));
    expect(CSV_HEADERS).toEqual(expect.arrayContaining(['EMI', 'Term cover', 'Emergency fund', 'Investment rate', 'Health cover', 'Overlap audit', 'Business asset shielding']));
  });
  it('writes a Check-up row with N/A for a left-out category and no legacy values', () => {
    const cells = csvRow(checkup()).map((c) => c.slice(1, -1));
    const at = (name) => cells[CSV_HEADERS.indexOf(name)];
    expect(at('Type')).toBe(NEW_LABEL);
    expect(at('Score')).toBe('56');
    expect(at('Earned')).toBe('53');
    expect(at('Applicable')).toBe('95');
    expect(at('Band')).toBe('A good base, with gaps to close');
    expect(at('Business asset shielding')).toBe('N/A');
    expect(at('EMI')).toBe('20');
    expect(at('Consent')).toBe('Given');
    expect(at('Source of Score')).toBe('Self-reported');
    expect(at('Legacy Score')).toBe('');
    expect(cells).toHaveLength(CSV_HEADERS.length);
  });
  it('writes a legacy row labelled Legacy with its old score and no new values', () => {
    const cells = csvRow(legacy()).map((c) => c.slice(1, -1));
    const at = (name) => cells[CSV_HEADERS.indexOf(name)];
    expect(at('Type')).toBe(LEGACY_LABEL);
    expect(at('Legacy Score')).toBe('7');
    expect(at('Legacy Max Score')).toBe('12');
    expect(at('Legacy Percent')).toBe('58');
    expect(at('Score')).toBe('');
    expect(at('Consent')).toBe('');
    expect(cells).toHaveLength(CSV_HEADERS.length);
  });
  it('quotes embedded quotes and defuses spreadsheet formulas in names', () => {
    const row = csvRow(checkup({ fullName: '=HYPERLINK("http://x")' }));
    expect(row[CSV_HEADERS.indexOf('Name')]).toBe('"\'=HYPERLINK(""http://x"")"');
    expect(csvRow(checkup({ fullName: '@sum' }))[1]).toBe('"\'@sum"');
  });
  it('contains no rupee-amount column or field', () => {
    expect(CSV_HEADERS.join(' ')).not.toMatch(/income|expense|saving|amount|paise|answers/i);
    const csv = buildCsv([checkup(), legacy()]);
    expect(csv.split('\n')).toHaveLength(3);
  });
  it('never exports or shows the internal consent hash', () => {
    const marker = 'f'.repeat(64);
    const lead = checkup({ consent: { callback: true, textVersion: 'hc-consent-v1', textHash: marker, acceptedAt: '2026-10-24T10:00:00Z' } });
    expect(CSV_HEADERS.join(' ')).not.toMatch(/hash/i);
    expect(buildCsv([lead])).not.toContain(marker);
    expect(consentText(lead)).not.toContain(marker);
    expect(JSON.stringify(categoryRows(lead))).not.toContain(marker);
    const page = readFileSync(new URL('../pages/AdminDashboardPage.jsx', import.meta.url), 'utf8');
    const helper = readFileSync(new URL('./healthCheckAdminView.js', import.meta.url), 'utf8');
    expect(page).not.toMatch(/textHash/);
    expect(helper.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/textHash/);
  });
  it('the admin page uses these helpers and does not read amounts', () => {
    const page = readFileSync(new URL('../pages/AdminDashboardPage.jsx', import.meta.url), 'utf8');
    expect(page).toContain("buildCsv(healthList)");
    expect(page).toContain('encodeURIComponent(buildCsv(healthList))');
    expect(page).toContain('isCheckupLead(lead)');
    expect(page).toContain('{SELF_REPORTED}');
  });
});

describe('privacy policy section', () => {
  it('has the approved Financial Health Check-up section right after Information Collection', () => {
    const sections = LEGAL_PAGES.privacy.sections;
    const i = sections.findIndex((s) => s.heading === 'Information Collection');
    expect(sections[i + 1].heading).toBe('Financial Health Check-up');
    expect(sections[i + 1].text).toBe(
      'You can complete the Check-up without sharing contact details; your answers are calculated in your browser and are not sent to us. If you request a callback, we store your name, mobile number, your score summary (category points, total and band), and a record of your consent, for up to 24 months, then delete them. We do not store the income, expense, savings or cover amounts you enter. You can ask us to delete your details earlier through the Contact page.'
    );
    expect(sections.map((s) => s.heading)).toEqual(['Information Collection', 'Financial Health Check-up', 'Data Protection & Security', 'Data Sharing', 'Your Rights']);
  });
});
