import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('./apiClient', () => ({ default: { post: vi.fn(), get: vi.fn(), patch: vi.fn() } }));

import apiClient from './apiClient';
import healthCheckService from './healthCheckService';
import { buildLeadPayload, scoreHealthCheck } from '../utils/financialHealthCheck';
import { submitHealthCheckSchema } from '../../server/validations/healthCheckValidation.js';
import healthRouter from '../../server/routes/healthRoutes.js';

const values = {
  income: 8_000_000, expenses: 3_500_000, emi: 1_500_000, savings: 30_000_000,
  termCover: 1_000_000_000, healthCover: 100_000_000, investments: 1_200_000, overlap: 'no', business: 'na',
};
const payload = () => buildLeadPayload({ fullName: 'Priya Sharma', phone: '9876543210', result: scoreHealthCheck(values) });

// What a server that speaks callback API version 2 answers on GET /api/health, and what the earlier deploy answers
const HEALTH_V2 = { status: 200, data: { status: 'healthy', version: '1.0.0', database: 'connected', healthCheckCallback: 2 } };
const HEALTH_OLD_SERVER = { status: 200, data: { status: 'healthy', environment: 'development', version: '1.0.0', service: 'SOLAHANA Financial Planning Backend Engine', database: 'connected' } };

// The real GET /api/health handler of this repo, called directly (no network, no database)
const realHealthResponse = () => {
  const layer = healthRouter.stack.find((l) => l.route && l.route.path === '/' && l.route.methods.get);
  const handler = layer.route.stack[0].handle;
  const sent = {};
  const res = { status: (code) => { sent.status = code; return res; }, json: (body) => { sent.data = body; return res; } };
  handler({}, res);
  return sent;
};

describe('healthCheckService.submitCallback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiClient.get.mockResolvedValue(HEALTH_V2);
  });

  it('posts the payload to the single endpoint and resolves on 201', async () => {
    apiClient.post.mockResolvedValue({ status: 201, data: { data: { id: 'abc' } } });
    const p = payload();
    await expect(healthCheckService.submitCallback(p)).resolves.toEqual({ id: 'abc' });
    expect(apiClient.post).toHaveBeenCalledWith('/api/health-check', p);
  });

  it('asks the server which callback API it speaks BEFORE it posts anything', async () => {
    apiClient.post.mockResolvedValue({ status: 201, data: { data: { id: 'abc' } } });
    await healthCheckService.submitCallback(payload());
    expect(apiClient.get).toHaveBeenCalledWith('/api/health');
    expect(apiClient.get.mock.invocationCallOrder[0]).toBeLessThan(apiClient.post.mock.invocationCallOrder[0]);
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

describe('callback version handshake: nothing is posted unless the server says it speaks callback API version 2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiClient.post.mockResolvedValue({ status: 201, data: { data: { id: 'abc' } } }); // would succeed if it were ever called
  });

  const expectBlocked = async () => {
    await expect(healthCheckService.submitCallback(payload())).rejects.toThrow();
    expect(apiClient.post).not.toHaveBeenCalled();
  };

  it('POST is NOT sent when the version field is missing (the earlier deploy of the server)', async () => {
    apiClient.get.mockResolvedValue(HEALTH_OLD_SERVER);
    await expectBlocked();
    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });

  it('POST is NOT sent for any other version value: 1, 3, "2", 2.5, null, true, 0', async () => {
    for (const value of [1, 3, '2', 2.5, null, true, 0, [2]]) {
      vi.clearAllMocks();
      apiClient.post.mockResolvedValue({ status: 201, data: { data: { id: 'abc' } } });
      apiClient.get.mockResolvedValue({ status: 200, data: { healthCheckCallback: value } });
      await expectBlocked();
    }
  });

  it('POST is NOT sent when the health endpoint is unreachable or errors', async () => {
    apiClient.get.mockRejectedValue(new Error('Network Error'));
    await expectBlocked();
    vi.clearAllMocks();
    apiClient.post.mockResolvedValue({ status: 201, data: { data: { id: 'abc' } } });
    apiClient.get.mockRejectedValue(Object.assign(new Error('Request failed with status code 503'), { response: { status: 503 } }));
    await expectBlocked();
  });

  it('POST is NOT sent when the health answer is not a normal 200 JSON object', async () => {
    const odd = [
      { status: 204, data: { healthCheckCallback: 2 } }, // right field, wrong status
      { status: 200, data: '<!doctype html><html></html>' }, // a static host answering with its page
      { status: 200, data: null },
      { status: 200, data: undefined },
      { status: 200, data: [] },
      { status: 200, data: 2 },
      undefined,
      null,
    ];
    for (const answer of odd) {
      vi.clearAllMocks();
      apiClient.post.mockResolvedValue({ status: 201, data: { data: { id: 'abc' } } });
      apiClient.get.mockResolvedValue(answer);
      await expectBlocked();
    }
  });

  it('the blocked request rejects, which is exactly what the page turns into its existing failure message', async () => {
    apiClient.get.mockResolvedValue(HEALTH_OLD_SERVER);
    await expect(healthCheckService.submitCallback(payload())).rejects.toBeInstanceOf(Error);
  });

  it('POST is sent, unchanged, once the server reports version 2', async () => {
    apiClient.get.mockResolvedValue(HEALTH_V2);
    const p = payload();
    await expect(healthCheckService.submitCallback(p)).resolves.toEqual({ id: 'abc' });
    expect(apiClient.post).toHaveBeenCalledTimes(1);
    expect(apiClient.post).toHaveBeenCalledWith('/api/health-check', p);
  });

  it('asks again on every request (an earlier "no" is never remembered, and neither is an earlier "yes")', async () => {
    apiClient.get.mockResolvedValueOnce(HEALTH_OLD_SERVER).mockResolvedValueOnce(HEALTH_V2).mockResolvedValueOnce(HEALTH_OLD_SERVER);
    await expect(healthCheckService.submitCallback(payload())).rejects.toThrow();
    await expect(healthCheckService.submitCallback(payload())).resolves.toEqual({ id: 'abc' });
    await expect(healthCheckService.submitCallback(payload())).rejects.toThrow();
    expect(apiClient.get).toHaveBeenCalledTimes(3);
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it('a 201-only success still applies after the handshake (any other post status rejects)', async () => {
    apiClient.get.mockResolvedValue(HEALTH_V2);
    apiClient.post.mockResolvedValue({ status: 200, data: {} });
    await expect(healthCheckService.submitCallback(payload())).rejects.toThrow();
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it("this repo's real /api/health answer passes the handshake, so the page and the server agree", async () => {
    const real = realHealthResponse();
    expect(real.status).toBe(200);
    apiClient.get.mockResolvedValue(real);
    await expect(healthCheckService.submitCallback(payload())).resolves.toEqual({ id: 'abc' });
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });
});
