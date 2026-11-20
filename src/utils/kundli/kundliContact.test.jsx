import React from 'react';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { startHealthCheckSchema } from '../../../server/validations/healthCheckValidation.js';
import { buildStartLeadDocument } from '../../../server/controllers/healthCheckController.js';
import { buildStartLeadPayload, CONSENT_TEXTS, isValidEmail, START_CONSENT_VERSION } from '../financialHealthCheck.js';
import { buildCsv, consentText, CSV_HEADERS, isStartLead, typeLabel } from '../healthCheckAdminView.js';
import FinancialKundli from '../../components/kundli/FinancialKundli.jsx';
import KundliContact from '../../components/kundli/KundliContact.jsx';
import { clearSession, writeContact, writeSession } from './kundliSession.js';
import { makeAnswers } from './kundliTestHelpers.js';

const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ');
const at = (screen) =>
  renderToStaticMarkup(
    <MemoryRouter initialEntries={[{ pathname: '/financial-health-checkup', state: { kundli: { sid: 'visit1', screen, fromReview: false } } }]}>
      <FinancialKundli />
    </MemoryRouter>,
  );

afterEach(() => clearSession());

describe('the required contact screen', () => {
  it('asks for name, mobile and email with the start consent, never pre-ticked', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <KundliContact saved={null} onSaved={() => {}} onBack={() => {}} />
      </MemoryRouter>,
    );
    const t = text(html);
    ['Before we begin', 'Your name', 'Mobile number', 'Email address', 'Continue to the check-up'].forEach((s) => expect(t).toContain(s));
    expect(t).toContain(CONSENT_TEXTS[START_CONSENT_VERSION].replace(' Privacy Policy.', ''));
    expect(html).toMatch(/id="kct-consent" type="checkbox"(?![^>]*checked)/);
  });
  it('no question, review or report screen opens before the details are saved', () => {
    writeSession(makeAnswers({}), 'visit1');
    for (const screen of ['income', 'savings', 'review', 'report']) expect(text(at(screen)), screen).toContain('Before we begin');
  });
  it('once saved, the screen that was asked for opens', () => {
    writeSession(makeAnswers({}), 'visit1');
    writeContact({ fullName: 'Asha Rao', phone: '9876543210', id: 'x' });
    const t = text(at('income'));
    expect(t).not.toContain('Before we begin');
    expect(t).toContain('Monthly in-hand income');
  });
  it('the contact screen sends only buildStartLeadPayload, through the service, and only proceeds on success', () => {
    const src = readFileSync('src/components/kundli/KundliContact.jsx', 'utf8');
    expect([...new Set(src.match(/healthCheckService\.\w+/g))]).toEqual(['healthCheckService.startCheckup']);
    expect(src).toContain('const payload = buildStartLeadPayload(form);');
    expect(src).toContain('await healthCheckService.startCheckup(payload);');
    expect(src).toContain('useState(false); // never pre-ticked');
    expect(src.indexOf('onSaved(')).toBeGreaterThan(src.indexOf('await healthCheckService.startCheckup'));
  });
});

describe('start lead payload and server validation', () => {
  const payload = buildStartLeadPayload({ fullName: '  Asha Rao ', phone: '+91 98765 43210', email: '  Asha.Rao@Example.COM ' });
  it('carries only name, mobile, email, source and the contact consent', () => {
    expect(Object.keys(payload).sort()).toEqual(['consent', 'email', 'fullName', 'phone', 'source']);
    expect(payload.consent).toEqual({ contact: true, textVersion: 'hc-start-consent-v1' });
    expect(payload.email).toBe('asha.rao@example.com');
    expect(payload.source).toBe('financial_health_checkup_full');
  });
  it('the server accepts it and normalises the mobile number', () => {
    const parsed = startHealthCheckSchema.safeParse(payload);
    expect(parsed.success, JSON.stringify(parsed.error?.issues)).toBe(true);
    expect(parsed.data.phone).toBe('9876543210');
  });
  it.each([
    ['a bad email', { email: 'asha@' }],
    ['no email', { email: undefined }],
    ['a bad mobile', { phone: '12345' }],
    ['a one-letter name', { fullName: 'A' }],
    ['an extra field (an amount)', { income: 8000000 }],
    ['the callback consent version', { consent: { contact: true, textVersion: 'hc-consent-v1' } }],
    ['consent not ticked', { consent: { contact: false, textVersion: 'hc-start-consent-v1' } }],
  ])('the server rejects %s', (_, change) => {
    expect(startHealthCheckSchema.safeParse({ ...payload, ...change }).success).toBe(false);
  });
  it.each([
    ['asha@example.com', true],
    ['a.b+c@mail.co.in', true],
    ['asha@example', false],
    ['asha example.com', false],
    ['@example.com', false],
    [`${'a'.repeat(115)}@x.com`, false],
  ])('isValidEmail(%s) is %s', (email, ok) => expect(isValidEmail(email)).toBe(ok));
});

describe('the stored row and the admin view', () => {
  const now = new Date('2026-11-20T10:00:00Z');
  const doc = buildStartLeadDocument(startHealthCheckSchema.parse(buildStartLeadPayload({ fullName: 'Asha Rao', phone: '9876543210', email: 'asha@example.com' })), now);
  it('is a started row with contact details and consent only (no score, no answers), due for deletion in 24 months', () => {
    expect(Object.keys(doc).sort()).toEqual(['consent', 'deleteAfter', 'email', 'fullName', 'phone', 'schemaVersion', 'source', 'status']);
    expect(doc).toMatchObject({ status: 'started', schemaVersion: 3, email: 'asha@example.com' });
    expect(doc.consent.textVersion).toBe('hc-start-consent-v1');
    expect(doc.consent.textHash).toMatch(/^[0-9a-f]{64}$/);
    expect(doc.deleteAfter.toISOString()).toBe('2028-11-20T10:00:00.000Z');
  });
  it('admin shows it as "Check-up started" with the email, in the table and in the CSV', () => {
    const lead = { ...doc, createdAt: now };
    expect(isStartLead(lead)).toBe(true);
    expect(typeLabel(lead)).toBe('Check-up started');
    expect(consentText(lead)).toContain('Contact consent given');
    expect(CSV_HEADERS).toContain('Email');
    const csv = buildCsv([lead]);
    expect(csv).toContain('"Check-up started","Asha Rao","9876543210","asha@example.com","started"');
  });
});
