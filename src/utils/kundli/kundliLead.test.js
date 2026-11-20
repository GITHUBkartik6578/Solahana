import { describe, expect, it } from 'vitest';
import { submitHealthCheckSchema } from '../../../server/validations/healthCheckValidation.js';
import { CONSENT_TEXTS } from '../financialHealthCheck.js';
import { buildKundliLead, KUNDLI_LEAD_SOURCE } from './kundliLead.js';
import { buildReport } from './kundliReport.js';
import { makeAnswers } from './kundliTestHelpers.js';

const report = buildReport(
  makeAnswers({
    assets: { MF: '400000', HOME: '9000000' },
    goals: [{ cost: '2500000', years: '12', saved: '200000' }],
    ret: { age: 34, at: 60, until: 85, spend: '60000' },
    asm: { inf: '6', ret: '10' },
  }),
);
const lead = buildKundliLead({ fullName: '  Asha Rao ', phone: '+91 98765 43210', result: report.score.result });

describe('Kundli callback lead', () => {
  it('uses the Kundli source and consent version, and the existing server validation accepts it unchanged', () => {
    expect(lead.source).toBe(KUNDLI_LEAD_SOURCE);
    expect(lead.consent).toEqual({ callback: true, textVersion: 'kundli-consent-v1' });
    expect(CONSENT_TEXTS['kundli-consent-v1']).toContain('about my Financial Kundli');
    const parsed = submitHealthCheckSchema.safeParse(lead);
    expect(parsed.success, JSON.stringify(parsed.error?.issues)).toBe(true);
    expect(parsed.data.phone).toBe('9876543210');
  });
  it('carries only name, phone, source, consent and the score summary: no amount, goal, age or rate', () => {
    expect(Object.keys(lead).sort()).toEqual(['consent', 'fullName', 'phone', 'result', 'source']);
    expect(Object.keys(lead.result).sort()).toEqual(['applicable', 'band', 'earned', 'emergencyMeasurable', 'points', 'score', 'scoringVersion', 'shieldingApplicable']);
    const json = JSON.stringify(lead);
    ['80000', '400000', '9000000', '2500000', '60000', '"age"', 'goal', 'inflation', '"ret"'].forEach((s) => expect(json).not.toContain(s));
  });
  it('the server rejects an unknown consent version and any extra key', () => {
    expect(submitHealthCheckSchema.safeParse({ ...lead, consent: { callback: true, textVersion: 'kundli-consent-v9' } }).success).toBe(false);
    expect(submitHealthCheckSchema.safeParse({ ...lead, income: 8000000 }).success).toBe(false);
  });
});
