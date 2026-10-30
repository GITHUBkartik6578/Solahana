import crypto from 'crypto';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('../models/HealthCheckLead.js', () => ({ default: { create: vi.fn(), countDocuments: vi.fn(), find: vi.fn() } }));

import HealthCheckLead from '../models/HealthCheckLead.js';
import { addMonthsUtc, buildLeadDocument, getHealthChecks, submitHealthCheck } from './healthCheckController.js';
import { CONSENT_TEXTS, buildLeadPayload, scoreHealthCheck } from '../../src/utils/financialHealthCheck.js';
import { submitHealthCheckSchema } from '../validations/healthCheckValidation.js';

const values = {
  income: 10_000_000, expenses: 0, emi: 0, savings: 0, termCover: 0, healthCover: 0, investments: 0, overlap: 'no', business: 'na',
};
const body = () => submitHealthCheckSchema.parse(buildLeadPayload({ fullName: 'Asha Rao', phone: '9876543210', result: scoreHealthCheck(values) }));

describe('addMonthsUtc', () => {
  it('adds calendar months and clamps short months', () => {
    expect(addMonthsUtc(new Date('2026-10-24T10:00:00Z'), 24).toISOString()).toBe('2028-10-24T10:00:00.000Z');
    expect(addMonthsUtc(new Date('2028-02-29T00:00:00Z'), 24).toISOString()).toBe('2030-02-28T00:00:00.000Z');
  });
});

describe('buildLeadDocument', () => {
  const now = new Date('2026-10-24T10:00:00Z');
  it('sets server-side times and a hash of the allowlisted consent text', () => {
    const doc = buildLeadDocument(body(), now);
    expect(doc.consent.acceptedAt).toEqual(now);
    expect(doc.deleteAfter.toISOString()).toBe('2028-10-24T10:00:00.000Z');
    expect(doc.consent.textHash).toBe(crypto.createHash('sha256').update(CONSENT_TEXTS['hc-consent-v1']).digest('hex'));
    expect(doc.schemaVersion).toBe(2);
    expect(doc.status).toBe('completed');
  });
  it('copies only known keys, even if the body carries extras', () => {
    const doc = buildLeadDocument({ ...body(), income: 99999, answers: [1] }, now);
    expect(Object.keys(doc).sort()).toEqual(['completedAt', 'consent', 'deleteAfter', 'fullName', 'phone', 'result', 'schemaVersion', 'source', 'status']);
    expect(JSON.stringify(doc)).not.toContain('99999');
  });
});

describe('submitHealthCheck', () => {
  beforeEach(() => vi.clearAllMocks());
  const res = () => { const r = {}; r.status = vi.fn(() => r); r.json = vi.fn(() => r); return r; };
  it('responds 201 after the row is created', async () => {
    HealthCheckLead.create.mockResolvedValue({ _id: 'abc' });
    const r = res(); const next = vi.fn();
    submitHealthCheck({ body: body() }, r, next);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(HealthCheckLead.create).toHaveBeenCalledTimes(1);
    expect(r.status).toHaveBeenCalledWith(201);
    expect(next).not.toHaveBeenCalled();
  });
  it('does not respond 201 when saving fails', async () => {
    HealthCheckLead.create.mockRejectedValue(new Error('db down'));
    const r = res(); const next = vi.fn();
    submitHealthCheck({ body: body() }, r, next);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(r.status).not.toHaveBeenCalledWith(201);
    expect(next).toHaveBeenCalled();
  });
});

describe('getHealthChecks (admin list)', () => {
  beforeEach(() => vi.clearAllMocks());
  const res = () => { const r = {}; r.status = vi.fn(() => r); r.json = vi.fn(() => r); return r; };

  it('asks the database to leave out consent.textHash and still returns the rows', async () => {
    const rows = [{ fullName: 'Asha Rao', consent: { callback: true, textVersion: 'hc-consent-v1' } }];
    const calls = [];
    const chain = {};
    ['select', 'sort', 'skip', 'limit'].forEach((name) => { chain[name] = vi.fn((arg) => { calls.push([name, arg]); return chain; }); });
    chain.then = (resolve) => resolve(rows);
    HealthCheckLead.countDocuments.mockResolvedValue(1);
    HealthCheckLead.find.mockReturnValue(chain);
    const r = res(); const next = vi.fn();
    getHealthChecks({ query: {} }, r, next);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(chain.select).toHaveBeenCalledWith({ 'consent.textHash': 0 });
    expect(calls[0]).toEqual(['select', { 'consent.textHash': 0 }]);
    expect(r.status).toHaveBeenCalledWith(200);
    expect(JSON.stringify(r.json.mock.calls[0][0])).not.toMatch(/textHash/);
    expect(r.json.mock.calls[0][0].data.entries).toEqual(rows);
    expect(next).not.toHaveBeenCalled();
  });

  it('still stores the hash when a request is saved', () => {
    const doc = buildLeadDocument(body(), new Date('2026-10-24T10:00:00Z'));
    expect(doc.consent.textHash).toMatch(/^[0-9a-f]{64}$/);
  });
});
