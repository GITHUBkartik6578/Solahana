import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({ default: { post: vi.fn(), get: vi.fn(), patch: vi.fn() } }));

import apiClient from './apiClient';
import healthCheckService from './healthCheckService';
import { buildLeadPayload, scoreHealthCheck } from '../utils/financialHealthCheck';
import { submitHealthCheckSchema } from '../../server/validations/healthCheckValidation.js';

const values = {
  income: 8_000_000, expenses: 3_500_000, emi: 1_500_000, savings: 30_000_000,
  termCover: 1_000_000_000, healthCover: 100_000_000, investments: 1_200_000, overlap: 'no', business: 'na',
};
const payload = () => buildLeadPayload({ fullName: 'Priya Sharma', phone: '9876543210', result: scoreHealthCheck(values) });

describe('healthCheckService.submitCallback', () => {
  beforeEach(() => vi.clearAllMocks());

  it('posts the payload to the single endpoint and resolves on 201', async () => {
    apiClient.post.mockResolvedValue({ status: 201, data: { data: { id: 'abc' } } });
    const p = payload();
    await expect(healthCheckService.submitCallback(p)).resolves.toEqual({ id: 'abc' });
    expect(apiClient.post).toHaveBeenCalledWith('/api/health-check', p);
  });

  it('rejects on any other success status (200, 202, 204)', async () => {
    for (const status of [200, 202, 204]) {
      apiClient.post.mockResolvedValue({ status, data: {} });
      await expect(healthCheckService.submitCallback(payload())).rejects.toThrow();
    }
  });

  it('rejects on a network or HTTP error', async () => {
    apiClient.post.mockRejectedValue(Object.assign(new Error('boom'), { response: { status: 500 } }));
    await expect(healthCheckService.submitCallback(payload())).rejects.toThrow();
  });

  it('sends no rupee amounts: payload keys are contact, consent and score summary only', () => {
    const p = payload();
    expect(Object.keys(p).sort()).toEqual(['consent', 'fullName', 'phone', 'result', 'source']);
    expect(Object.keys(p.result).sort()).toEqual(['applicable', 'band', 'earned', 'emergencyMeasurable', 'points', 'score', 'scoringVersion', 'shieldingApplicable']);
    const text = JSON.stringify(p);
    [8_000_000, 3_500_000, 30_000_000, 1_000_000_000, 100_000_000, 1_200_000, 80000, 35000].forEach((n) => expect(text).not.toContain(String(n)));
  });

  it('no longer has the old start/complete flow', () => {
    expect(healthCheckService.start).toBeUndefined();
    expect(healthCheckService.complete).toBeUndefined();
  });

  it('every payload the browser can build passes the backend schema (flags, null N/A categories, bands, normalisation)', () => {
    const seen = { bands: new Set(), applicable: new Set(), nulls: new Set() };
    let count = 0;
    for (const expenses of [0, 3_000_000]) for (const business of ['yes', 'no', 'na']) for (const overlap of ['yes', 'no'])
      for (const emi of [0, 2_500_000, 4_000_000, 6_000_000]) for (const savings of [0, 9_000_000, 18_000_000, 60_000_000])
        for (const termCover of [0, 600_000_000, 1_200_000_000]) for (const healthCover of [0, 100_000_000])
          for (const investments of [0, 1_000_000, 2_000_000]) {
            const result = scoreHealthCheck({ income: 10_000_000, expenses, emi, savings, termCover, healthCover, investments, overlap, business });
            const payload = buildLeadPayload({ fullName: 'Priya Sharma', phone: '9876543210', result });
            const parsed = submitHealthCheckSchema.safeParse(payload);
            expect(parsed.success, JSON.stringify(result)).toBe(true);
            seen.bands.add(result.band); seen.applicable.add(result.applicable);
            if (result.points.emergency === null) seen.nulls.add('emergency');
            if (result.points.shielding === null) seen.nulls.add('shielding');
            count += 1;
          }
    expect(count).toBeGreaterThan(1000);
    expect([...seen.bands].sort()).toEqual(['attention', 'good', 'strong']);
    expect([...seen.applicable].sort((a, b) => a - b)).toEqual([75, 80, 95, 100]);
    expect([...seen.nulls].sort()).toEqual(['emergency', 'shielding']);
  });

  it('the payload carries the allowlisted consent version', () => {
    expect(payload().consent).toEqual({ callback: true, textVersion: 'hc-consent-v1' });
  });
});
