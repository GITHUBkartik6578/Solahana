import { describe, expect, it } from 'vitest';
import HealthCheckLead from './HealthCheckLead.js';
import { buildLeadDocument } from '../controllers/healthCheckController.js';
import { buildLeadPayload, isValidMobile, normalizePhone, scoreHealthCheck } from '../../src/utils/financialHealthCheck.js';
import { validate } from '../middleware/validateMiddleware.js';
import { submitHealthCheckSchema } from '../validations/healthCheckValidation.js';

const values = {
  income: 10_000_000, expenses: 3_000_000, emi: 1_000_000, savings: 20_000_000,
  termCover: 1_300_000_000, healthCover: 100_000_000, investments: 2_000_000, overlap: 'yes', business: 'yes',
};
const body = () => submitHealthCheckSchema.parse(buildLeadPayload({ fullName: 'Asha Rao', phone: '9876543210', result: scoreHealthCheck(values) }));

describe('HealthCheckLead model', () => {
  it('has a TTL index on deleteAfter that expires at that date', () => {
    const ttl = HealthCheckLead.schema.indexes().find(([fields]) => 'deleteAfter' in fields);
    expect(ttl).toBeTruthy();
    expect(ttl[1].expireAfterSeconds).toBe(0);
  });
  it('keeps the consent hash stored (required) but the admin projection excludes it', () => {
    expect(HealthCheckLead.schema.path('consent.textHash').isRequired).toBe(true);
    const query = HealthCheckLead.find({}).select({ 'consent.textHash': 0 });
    expect(query.projection()).toEqual({ 'consent.textHash': 0 });
  });
  it('has no path that could hold a rupee amount', () => {
    const paths = Object.keys(HealthCheckLead.schema.paths).join(' ');
    expect(paths).not.toMatch(/income|expense|saving|termCover|healthCover|investments|amount|paise/i);
  });
  it('accepts a built document with no completion token', () => {
    const doc = new HealthCheckLead(buildLeadDocument(body()));
    expect(doc.validateSync()).toBeUndefined();
    expect(doc.schemaVersion).toBe(2);
  });
  it('still reads a legacy 6-question row', () => {
    const doc = new HealthCheckLead({ fullName: 'Old Row', phone: '9876543210', status: 'completed', score: 7, maxScore: 12, percent: 58, verdict: 'ok', answers: [{ questionId: 'q1', score: 2 }] });
    expect(doc.validateSync()).toBeUndefined();
    expect(doc.schemaVersion).toBe(1);
    expect(doc.deleteAfter).toBeNull();
  });
});

describe('phone handling, browser to stored row', () => {
  const run = (phone) => {
    const req = { body: buildLeadPayload({ fullName: 'Asha Rao', phone, result: scoreHealthCheck(values) }) };
    let error = null;
    validate(submitHealthCheckSchema)(req, {}, (e) => { error = e || null; });
    return { req, error };
  };
  const accepted = ['9876543210', '98765 43210', '98765-43210', '+91 98765 43210', '+919876543210', '91 98765 43210', '919876543210', '098765 43210', '(98765) 43210', '  6000000000 ', '7000000000', '8000000000'];
  const rejected = ['', '12345', '5876543210', '98765432', '98765432101', '+1 9876543210', '0091 9876543210', '9876 5432 1x', '+91 0 9876543210', '0919876543210'];

  it.each(accepted)('accepts %j: the browser gate passes and the stored number is 10 digits', (phone) => {
    expect(isValidMobile(phone)).toBe(true);
    const { req, error } = run(phone);
    expect(error).toBeNull();
    expect(req.body.phone).toMatch(/^[6-9][0-9]{9}$/);
    expect(req.body.phone).toBe(normalizePhone(phone));
    const doc = new HealthCheckLead(buildLeadDocument(req.body));
    expect(doc.validateSync()).toBeUndefined();
    expect(doc.phone).toMatch(/^[6-9][0-9]{9}$/);
  });
  it.each(rejected)('rejects %j in the browser gate and on the server', (phone) => {
    expect(isValidMobile(phone)).toBe(false);
    const { error } = run(phone);
    expect(error?.statusCode).toBe(400);
    expect(error?.message).toBe('Please enter a valid 10-digit mobile number.');
  });
  it('the server and the browser agree on every sample', () => {
    [...accepted, ...rejected].forEach((phone) => expect(run(phone).error === null).toBe(isValidMobile(phone)));
  });
});
