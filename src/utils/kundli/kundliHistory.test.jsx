import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import KundliReport from '../../components/kundli/KundliReport.jsx';
import { buildReport } from './kundliReport.js';
import { buildKundliFile, FILE_ERRORS, FILE_FORMAT, fileNameFor, parseKundliFile, progressSeries, sanitizeAnswers, snapshotMetrics } from './kundliHistory.js';
import { emptyAnswers } from './kundliInputs.js';
import { makeAnswers } from './kundliTestHelpers.js';

const OLD = makeAnswers({ core: { income: '80000', expenses: '35000', emi: '15000', other: '12000', savings: '50000', investments: '5000', termCover: '0', healthCover: '500000' }, assets: { MF: '200000' }, liabilities: { LOAN: '300000' } });
const NEW = makeAnswers({ core: { income: '90000', expenses: '35000', emi: '10000', other: '12000', savings: '300000', investments: '15000', termCover: '10000000', healthCover: '1000000' }, assets: { MF: '600000' }, liabilities: { LOAN: '100000' } });

describe('the check-up file', () => {
  it('round-trips: what is saved is what loads, oldest first, one entry per day', () => {
    const first = buildKundliFile([], OLD, new Date(2025, 10, 20));
    const loaded1 = parseKundliFile(first);
    expect(loaded1.ok).toBe(true);
    const second = buildKundliFile(loaded1.history, NEW, new Date(2026, 10, 20));
    const loaded2 = parseKundliFile(second);
    expect(loaded2.history.map((h) => h.date)).toEqual(['2025-11-20', '2026-11-20']);
    expect(loaded2.history[1].answers.fields.income.raw).toBe('90000');
    // saving twice on the same day replaces that day
    const again = parseKundliFile(buildKundliFile(loaded2.history, OLD, new Date(2026, 10, 20)));
    expect(again.history).toHaveLength(2);
    expect(again.history[1].answers.fields.income.raw).toBe('80000');
  });
  it('files saved before the rename (format solahana-financial-kundli) still open; new files use the new format and name', () => {
    const old = buildKundliFile([], OLD, new Date(2025, 10, 20)).replace('"solahana-financial-health-checkup"', '"solahana-financial-kundli"');
    expect(old).toContain('solahana-financial-kundli');
    expect(parseKundliFile(old).ok).toBe(true);
    expect(JSON.parse(buildKundliFile([], OLD)).format).toBe('solahana-financial-health-checkup');
    expect(fileNameFor(new Date(2026, 10, 20))).toBe('solahana-financial-health-checkup-2026-11-20.json');
  });
  it('holds answers only: no calculated figure is stored in the file', () => {
    const text = buildKundliFile([], NEW, new Date(2026, 10, 20));
    expect(JSON.parse(text)).toMatchObject({ format: FILE_FORMAT, version: 1 });
    expect(text).not.toContain('score');
    expect(text).not.toContain('netWorth');
  });
  it.each([
    ['', FILE_ERRORS.empty],
    ['not json', FILE_ERRORS.notKundli],
    [JSON.stringify({ format: 'something-else', version: 1, history: [] }), FILE_ERRORS.notKundli],
    [JSON.stringify({ format: FILE_FORMAT, version: 2, history: [] }), FILE_ERRORS.version],
    [JSON.stringify({ format: FILE_FORMAT, version: 1, history: [{ date: 'yesterday', answers: {} }] }), FILE_ERRORS.noEntries],
    ['x'.repeat(1_000_001), FILE_ERRORS.tooBig],
  ])('rejects a bad file (%#)', (text, error) => {
    expect(parseKundliFile(text)).toEqual({ ok: false, error });
  });
  it('a tampered file can only produce answers the questionnaire could produce', () => {
    const evil = {
      fields: { income: { raw: '9'.repeat(500), state: 'hacked' }, extra: { raw: '1' } },
      overlap: '<script>',
      assets: { skipped: 'yes', confirmed: true, ticked: { MF: true, NOPE: true }, amounts: { MF: { raw: 123 } } },
      goalsGate: 'yes',
      goals: Array.from({ length: 9 }, () => ({ type: 'evil', name: 'x'.repeat(100) })),
      retGate: 'yes',
      ret: { spend: { raw: '5', source: 'admin' } },
      __proto__: { polluted: true },
    };
    const a = sanitizeAnswers(evil);
    expect(a.fields.income.raw).toHaveLength(40);
    expect(a.fields.income.state).toBe('');
    expect(a.fields.extra).toBeUndefined();
    expect(a.overlap).toBe('');
    expect(a.assets.skipped).toBe(false);
    expect(a.assets.ticked.NOPE).toBeUndefined();
    expect(a.assets.amounts.MF.raw).toBe('');
    expect(a.goals).toHaveLength(5);
    expect(a.goals.every((g) => g.type === '' && g.name.length === 40)).toBe(true);
    expect(a.ret.spend.source).toBe('typed');
    expect(Object.keys(a).sort()).toEqual(Object.keys(emptyAnswers()).sort());
    expect({}.polluted).toBeUndefined();
  });
});

describe('growth figures are recalculated from the saved answers', () => {
  it('metrics match the report built from the same answers', () => {
    const m = snapshotMetrics(NEW, '2026-11-20');
    const r = buildReport(NEW);
    expect(m.score).toBe(r.score.score);
    expect(m.netWorth).toBe(r.modules.find((x) => x.id === 'netWorth').NW);
    expect(m.monthlySavings).toBe((90000 - 35000 - 10000 - 12000) * 100);
    expect(m.monthlyInvesting).toBe(1500000);
    expect(m.standing.emergency.display).toBe('8.5 months');
  });
  it('a missing figure is null, never 0', () => {
    const a = makeAnswers({ core: { other: 'not-sure' }, assets: 'skip' });
    const m = snapshotMetrics(a, '2026-11-20');
    expect(m.monthlySavings).toBeNull();
    expect(m.netWorth).toBeNull();
  });
  it('the series is then (from the file) and now (today)', () => {
    const history = parseKundliFile(buildKundliFile([], OLD, new Date(2025, 10, 20))).history;
    const s = progressSeries(history, NEW, new Date(2026, 10, 20));
    expect(s.map((x) => x.date)).toEqual(['2025-11-20', '2026-11-20']);
    expect(s[1].score).toBeGreaterThan(s[0].score);
    expect(s[0].netWorth).toBe((50000 + 200000 - 300000) * 100);
    expect(s[1].netWorth).toBe((300000 + 600000 - 100000) * 100);
  });
});

describe('the report shows growth', () => {
  it('At a glance with changes since then, the progress charts, and then-vs-now in Where you stand', () => {
    const history = parseKundliFile(buildKundliFile([], OLD, new Date(2025, 10, 20))).history;
    const progress = progressSeries(history, NEW, new Date(2026, 10, 20));
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <KundliReport report={buildReport(NEW)} progress={progress} history={history} answers={NEW} onStartOver={() => {}} />
      </MemoryRouter>,
    );
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    expect(text).toContain('Your progress');
    expect(text).toContain('Financial health score over time');
    expect(text).toContain('What you own and owe over time');
    expect(text).toContain('since 20 Nov 2025');
    expect(text).toContain('Up ₹8,50,000'); // net worth: -₹50,000 then, ₹8,00,000 now
    expect(text).toContain('was 1.4 months (Issue)'); // ₹50,000 ÷ ₹35,000
    expect(text).toContain('Up 53 points since 20 Nov 2025'); // 30 then (EMI 20 + overlap 5 + shielding 5), 83 now
    expect(text).toContain('Save my check-up (file)');
    expect(text).not.toContain('Kundli');
    expect(text).not.toContain('-₹');
    expect(text).not.toContain('NaN');
  });
  it('without a file there is no progress section, but At a glance is shown', () => {
    const progress = progressSeries([], NEW, new Date(2026, 10, 20));
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <KundliReport report={buildReport(NEW)} progress={progress} history={[]} answers={NEW} onStartOver={() => {}} />
      </MemoryRouter>,
    );
    expect(html).not.toContain('Your progress');
    expect(html).toContain('Monthly savings capacity');
  });
});
