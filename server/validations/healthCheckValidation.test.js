import { describe, expect, it } from 'vitest';
import { submitHealthCheckSchema } from './healthCheckValidation.js';
import { buildLeadPayload, scoreHealthCheck } from '../../src/utils/financialHealthCheck.js';

const values = {
  income: 10_000_000, expenses: 3_000_000, emi: 1_000_000, savings: 20_000_000,
  termCover: 1_300_000_000, healthCover: 100_000_000, investments: 2_000_000, overlap: 'yes', business: 'na',
};
const payload = (over = {}) => ({
  ...buildLeadPayload({ fullName: 'Asha Rao', phone: '98765 43210', result: scoreHealthCheck(values) }),
  ...over,
});
const messages = (r) => r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);

describe('submitHealthCheckSchema', () => {
  it('accepts the payload the browser builds and cleans the phone number', () => {
    const r = submitHealthCheckSchema.safeParse(payload());
    expect(r.success).toBe(true);
    expect(r.data.phone).toBe('9876543210');
  });
  it('accepts a +91 phone number', () => {
    expect(submitHealthCheckSchema.safeParse(payload({ phone: '+91 98765-43210' })).data.phone).toBe('9876543210');
  });
  it('rejects bad names and phones', () => {
    expect(submitHealthCheckSchema.safeParse(payload({ fullName: 'A' })).success).toBe(false);
    expect(submitHealthCheckSchema.safeParse(payload({ phone: '12345' })).success).toBe(false);
    expect(submitHealthCheckSchema.safeParse(payload({ phone: '5876543210' })).success).toBe(false);
  });
  it('requires consent to be exactly true', () => {
    expect(submitHealthCheckSchema.safeParse(payload({ consent: { callback: false, textVersion: 'hc-consent-v1' } })).success).toBe(false);
    expect(submitHealthCheckSchema.safeParse(payload({ consent: { textVersion: 'hc-consent-v1' } })).success).toBe(false);
    const { consent, ...rest } = payload();
    expect(consent.callback).toBe(true);
    expect(submitHealthCheckSchema.safeParse(rest).success).toBe(false);
  });
  it('allows only a known consent text version', () => {
    const r = submitHealthCheckSchema.safeParse(payload({ consent: { callback: true, textVersion: 'hc-consent-v9' } }));
    expect(r.success).toBe(false);
    expect(messages(r).join()).toContain('Unknown consent text version');
    expect(submitHealthCheckSchema.safeParse(payload({ consent: { callback: true, textVersion: 'constructor' } })).success).toBe(false);
  });
  it('rejects unknown keys at every level, so amounts cannot slip in', () => {
    expect(submitHealthCheckSchema.safeParse({ ...payload(), income: 100000 }).success).toBe(false);
    expect(submitHealthCheckSchema.safeParse({ ...payload(), answers: [] }).success).toBe(false);
    const p = payload();
    expect(submitHealthCheckSchema.safeParse({ ...p, result: { ...p.result, income: 1 } }).success).toBe(false);
    expect(submitHealthCheckSchema.safeParse({ ...p, result: { ...p.result, points: { ...p.result.points, savings: 5 } } }).success).toBe(false);
    expect(submitHealthCheckSchema.safeParse({ ...p, consent: { ...p.consent, acceptedAt: '2020-01-01' } }).success).toBe(false);
  });
  it('rejects inconsistent results', () => {
    const p = payload();
    const ok = (patch) => submitHealthCheckSchema.safeParse({ ...p, result: { ...p.result, ...patch } }).success;
    expect(ok({})).toBe(true);
    expect(ok({ score: p.result.score + 1 })).toBe(false);
    expect(ok({ earned: p.result.earned + 1 })).toBe(false);
    expect(ok({ applicable: 100 })).toBe(false);
    expect(ok({ band: 'attention' })).toBe(false);
    expect(ok({ scoringVersion: 'hc-v0' })).toBe(false);
    expect(ok({ points: { ...p.result.points, emi: 7 } })).toBe(false);
    expect(ok({ points: { ...p.result.points, shielding: 5 } })).toBe(false);
    expect(ok({ score: 72.5 })).toBe(false);
  });
});
