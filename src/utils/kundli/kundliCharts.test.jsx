import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { scoreHealthCheck } from '../financialHealthCheck.js';
import { buildReport } from './kundliReport.js';
import { cashFlowParts, niceTicks, shortInr, standingRows } from './kundliCharts.js';
import { makeAnswers } from './kundliTestHelpers.js';
import KundliReport from '../../components/kundli/KundliReport.jsx';

const rel = (a, b) => Math.abs(a - b) / Math.max(1, Math.abs(b));
const known = (v) => ({ status: v === 0 ? 'none' : 'entered', value: v });

describe('Where you stand: every status matches the hc-v1 points (4,000 random cases)', () => {
  it('green / amber / red follow the score exactly', () => {
    let seed = 7;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed / 2147483648);
    const p = (max) => (rnd() < 0.1 ? 0 : Math.floor(rnd() * max * 100));
    const toStatus = (pts, max) => (pts === max ? 'good' : pts === 0 ? 'issue' : 'partial');
    for (let i = 0; i < 4000; i += 1) {
      const v = { income: 100 + p(1e7), expenses: 1 + p(1e7), emi: p(1e7), savings: p(1e9), investments: p(1e7), termCover: p(1e9), healthCover: p(1e9) };
      const hc = scoreHealthCheck({ ...v, overlap: 'yes', business: 'yes' });
      const rows = Object.fromEntries(standingRows(Object.fromEntries(Object.entries(v).map(([k, x]) => [k, known(x)]))).map((r) => [r.id, r]));
      expect(rows.emergency.status).toBe(toStatus(hc.points.emergency, 20));
      expect(rows.emi.status).toBe(toStatus(hc.points.emi, 20));
      expect(rows.investment.status).toBe(toStatus(hc.points.investment, 15));
      expect(rows.term.status).toBe(toStatus(hc.points.term, 20));
      expect(rows.health.status).toBe(toStatus(hc.points.health, 15));
    }
  });
  it('shows the same figures as the report (e.g. 6.8 months, 18.8%, 12.5%, 10.4×, ₹10.0 lakh)', () => {
    const rows = buildReport(makeAnswers({})).charts.standing.map((r) => r.display);
    expect(rows).toEqual(['6.8 months', '18.8%', '12.5%', '10.4×', '₹10.0 lakh']);
  });
});

describe('Where your monthly income goes', () => {
  it('the parts add up to income, with "Left over" as the rest', () => {
    const d = buildReport(makeAnswers({ core: { income: '80000', expenses: '35000', emi: '15000', other: '12000', investments: '10000' } })).charts.cashFlow;
    expect(d.parts.map((x) => [x.id, x.paise])).toEqual([['fixed', 3500000], ['emi', 1500000], ['other', 1200000], ['investing', 1000000], ['left', 800000]]);
    expect(d.parts.reduce((s, x) => s + x.paise, 0)).toBe(d.incomePaise);
    expect(d.parts.reduce((s, x) => s + x.shareOfTotal, 0)).toBeCloseTo(1, 12);
  });
  it('when costs pass income it marks income and says by how much; no "Left over"', () => {
    const d = cashFlowParts({ income: known(5000000), expenses: known(4000000), emi: known(1500000), other: known(500000), investments: known(0) });
    expect(d.overByPaise).toBe(1000000);
    expect(d.parts.find((x) => x.id === 'left')).toBeUndefined();
    expect(d.totalPaise).toBe(6000000);
  });
});

describe('Goal and retirement graphs meet the report figures exactly', () => {
  const r = buildReport(
    makeAnswers({
      assets: { RET: '1000000', MF: '500000', HOME: '7500000' },
      goals: [{ cost: '2000000', years: '10', saved: '200000' }, { cost: '300000', years: '5', saved: '500000' }],
      ret: { age: 35, at: 60, until: 70, spend: '50000' },
      asm: { inf: '6', ret: '10' },
    }),
  );
  const goals = r.modules.find((m) => m.id === 'goals').goals;
  it('G1: starts at today\'s cost and the money set aside; ends with money = cost = ₹35,81,696 (rounded up)', () => {
    const path = r.charts.goals[goals[0].id];
    expect(path.points[0]).toMatchObject({ x: 0, cost: 2000000, money: 200000 });
    const last = path.points.at(-1);
    expect(last.x).toBe(10);
    expect(rel(last.cost, goals[0].raw.FT)).toBeLessThan(1e-12);
    expect(rel(last.money, goals[0].raw.FT)).toBeLessThan(1e-9);
    expect(Math.ceil(last.cost)).toBe(3581696);
  });
  it('G3 (already covered): money stays above cost at the end', () => {
    const last = r.charts.goals[goals[1].id].points.at(-1);
    expect(last.money).toBeGreaterThan(last.cost);
  });
  it('R1: builds to the corpus at 60 (₹2,11,23,970) and runs down to zero at 70', () => {
    const path = r.charts.retirement;
    const at60 = path.points.find((p) => p.x === 60);
    expect(rel(at60.money, path.corpus)).toBeLessThan(1e-9);
    expect(Math.ceil(path.corpus)).toBe(21123970);
    expect(Math.abs(path.points.at(-1).money)).toBeLessThan(1);
    expect(path.points.at(-1).x).toBe(70);
    expect(path.points.filter((p) => p.phase === 'spend')).toHaveLength(10);
  });
  it('no graph when the section could not be fully shown', () => {
    const big = buildReport(makeAnswers({ goals: [{ cost: '100000', years: '50', saved: '1000000000' }], asm: { inf: '6', ret: '30' } }));
    const g = big.modules.find((m) => m.id === 'goals').goals[0];
    expect(big.charts.goals[g.id]).toBeNull();
  });
});

describe('axis and label formatting', () => {
  it.each([
    [45000, '₹45,000'],
    [100000, '₹1 L'],
    [1250000, '₹12.5 L'],
    [10000000, '₹1 Cr'],
    [12500000, '₹1.25 Cr'],
    [1000000000, '₹100 Cr'],
    [2500000000, '₹250 Cr'],
  ])('%s -> %s', (v, s) => expect(shortInr(v)).toBe(s));
  it('ticks start at 0 and always reach the maximum', () => {
    [1, 7, 99, 12345, 3581696, 21123970, 9e12].forEach((m) => {
      const t = niceTicks(m);
      expect(t[0]).toBe(0);
      expect(t.at(-1)).toBeGreaterThanOrEqual(m);
    });
  });
});

describe('the report renders the graphs', () => {
  it('shows Where you stand, the cash-flow bar, the goal and retirement graphs, each with its numbers table', () => {
    const report = buildReport(
      makeAnswers({ assets: { RET: '1000000' }, goals: [{ cost: '2000000', years: '10', saved: '200000' }], ret: { age: 35, at: 60, until: 70, spend: '50000' }, asm: { inf: '6', ret: '10' } }),
    );
    const html = renderToStaticMarkup(<MemoryRouter><KundliReport report={report} onStartOver={() => {}} /></MemoryRouter>);
    ['Where you stand', 'Where your monthly income goes', 'cost vs your money, year by year', 'Your retirement money, age by age', 'What your known assets are made of'].forEach((t) =>
      expect(html).toContain(t),
    );
    expect(html.match(/Show the numbers/g).length).toBeGreaterThanOrEqual(5);
    expect(html).not.toContain('NaN');
  });
});
