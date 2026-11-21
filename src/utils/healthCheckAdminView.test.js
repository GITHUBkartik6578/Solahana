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
import { CONTACT_EMAIL, LEGAL_PAGES } from '../data/legalPages';
import { CONSENT_TEXTS, RETENTION_MONTHS, START_CONSENT_VERSION } from './financialHealthCheck';

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
      'To start the Financial Health Check-up, you give your name, mobile number and email address and tick a consent box. We use these details so that a Solahana planner can contact you by phone, WhatsApp or email about your Check-up. We store them, with a record of your consent, for up to 24 months and then delete them automatically. The financial answers you enter (such as your income, spending, savings, what you own and owe, your goals, your retirement plans and your insurance cover) are calculated in your browser. They are not sent to us and we do not store them. If you also ask for a callback after you see your result, we additionally store your score summary (category points, total and band). If you save your Check-up as a file, the file stays only on your own device. You can ask us to delete your details earlier through the Contact page or at online@solahana.com.'
    );
    expect(sections.map((s) => s.heading)).toEqual(['Information Collection', 'Financial Health Check-up', 'Data Protection & Security', 'Data Sharing', 'Your Rights']);
  });
});

describe('the privacy policy matches what the Financial Health Check-up really does', () => {
  const policy = LEGAL_PAGES.privacy.sections.find((s) => s.heading === 'Financial Health Check-up').text;
  const consent = CONSENT_TEXTS[START_CONSENT_VERSION];

  it('says the contact details are required, not optional (the old "without sharing contact details" line is gone)', () => {
    expect(policy).not.toMatch(/without sharing contact details/i);
    expect(policy).toMatch(/To start the Financial Health Check-up, you give your name, mobile number and email address/);
  });
  it('names every contact channel and every field that the start consent names', () => {
    ['phone', 'WhatsApp', 'email'].forEach((word) => {
      expect(consent, `consent: ${word}`).toContain(word);
      expect(policy, `policy: ${word}`).toContain(word);
    });
    ['name', 'mobile number', 'email address'].forEach((word) => {
      expect(consent, `consent: ${word}`).toContain(word);
      expect(policy, `policy: ${word}`).toContain(word);
    });
  });
  it('uses the same retention period as the code (and as the consent wording)', () => {
    expect(policy).toContain(`${RETENTION_MONTHS} months`);
    expect(consent).toContain(`${RETENTION_MONTHS} months`);
  });
  it('keeps the promise that the financial answers never reach Solahana, and says where a saved file stays', () => {
    expect(policy).toMatch(/calculated in your browser\. They are not sent to us and we do not store them/);
    expect(policy).toMatch(/file stays only on your own device/);
  });
  it('says how to get the details deleted earlier, with the real contact address', () => {
    expect(policy).toContain('Contact page');
    expect(policy).toContain(CONTACT_EMAIL);
  });
  it('the consent text links to a policy section that exists', () => {
    expect(consent).toContain('Privacy Policy');
    expect(LEGAL_PAGES.privacy.path).toBe('/privacy-policy');
  });
});
