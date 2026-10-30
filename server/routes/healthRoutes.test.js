import { describe, expect, it } from 'vitest';
import healthRouter from './healthRoutes.js';

// GET /api/health, called directly (no network, no database connection)
const call = () => {
  const layer = healthRouter.stack.find((l) => l.route && l.route.path === '/' && l.route.methods.get);
  const handler = layer.route.stack[0].handle;
  const sent = {};
  const res = { status: (code) => { sent.status = code; return res; }, json: (body) => { sent.body = body; return res; } };
  handler({}, res);
  return sent;
};

describe('GET /api/health', () => {
  it('reports callback API version 2 (the number the website waits for before it posts a callback request)', () => {
    const { status, body } = call();
    expect(status).toBe(200);
    expect(body.healthCheckCallback).toBe(2);
    expect(Number.isInteger(body.healthCheckCallback)).toBe(true);
  });

  it('only adds that one field: every existing field is still there with the same meaning', () => {
    const { body } = call();
    expect(Object.keys(body).sort()).toEqual(['database', 'environment', 'healthCheckCallback', 'service', 'status', 'timestamp', 'version']);
    expect(body.status).toBe('healthy');
    expect(body.version).toBe('1.0.0');
    expect(body.service).toBe('SOLAHANA Financial Planning Backend Engine');
    expect(body.database).toBe('not connected'); // no database in this test
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  it('is still a public GET and nothing else is routed on /api/health', () => {
    const routes = healthRouter.stack.filter((l) => l.route).map((l) => `${Object.keys(l.route.methods).join(',')} ${l.route.path}`);
    expect(routes).toEqual(['get /']);
  });
});
