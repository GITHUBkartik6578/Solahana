import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { buildReport } from '../../utils/kundli/kundliReport';
import { kundliReducer } from '../../utils/kundli/kundliState';
import { emptyAnswers, screenOrder, validateScreen } from '../../utils/kundli/kundliInputs';
import { makeAnswers } from '../../utils/kundli/kundliTestHelpers';
import { DISCLOSURES, MSG, REPORT, TAGS } from '../../utils/kundli/kundliCopy';
import KundliReport from './KundliReport';
import KundliReview from './KundliReview';
import KundliScreen from './KundliScreens';
import { errorLabel } from './kundliIds';
import FinancialKundli from './FinancialKundli';
import KundliTeaser from './KundliTeaser';

const render = (node) => renderToStaticMarkup(<MemoryRouter>{node}</MemoryRouter>);
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');

const FULL = makeAnswers({
  core: { income: '120000', expenses: '45000', emi: '25000', other: '15000', savings: '300000', investments: '15000', termCover: '8000000', healthCover: '500000' },
  overlap: 'no',
  business: 'na',
  assets: { RET: '600000', MF: '400000', GOLD: 'not-sure', HOME: '9000000' },
  liabilities: { HOME: '3500000', CARD: '20000' },
  goals: [{ type: 'education', cost: '2500000', years: '12', saved: '200000' }],
  ret: { age: 34, at: 60, until: 85, spend: '60000', source: 'fixedPlusOther' },
  asm: { inf: '6', ret: '10' },
});

describe('the page renders', () => {
  it('starts on the intro with the privacy note and nothing pre-filled', () => {
    const html = text(render(<FinancialKundli />));
    expect(html).toContain('Your Financial Health Check-up');
    expect(html).toContain('Your answers stay in this browser.');
    expect(html).not.toContain('Kundli');
  });
  it('every questionnaire screen renders for a full answer set', () => {
    screenOrder(FULL)
      .filter((s) => !['intro', 'review', 'report'].includes(s))
      .forEach((s) => {
        const html = render(<KundliScreen screen={s} a={FULL} dispatch={() => {}} errors={{}} />);
        expect(html.length, s).toBeGreaterThan(100);
      });
  });
  it('the review shows badges, exact amounts and the incomplete list', () => {
    const report = buildReport(FULL);
    const html = text(render(<KundliReview a={FULL} incomplete={report.summary.incomplete} onEdit={() => {}} onCreate={() => {}} />));
    expect(html).toContain('₹1,20,000');
    expect(html).toContain('Your estimate');
    expect(html).toContain('Not sure');
    expect(html).toContain('These parts of your report will be incomplete:');
  });
});

describe('the report renders', () => {
  const html = text(render(<KundliReport report={buildReport(FULL, new Date(2026, 10, 20))} onStartOver={() => {}} />));
  it('shows the summary, score, areas and every chosen section', () => {
    expect(html).toContain('7 of 8 chosen sections complete');
    expect(html).toContain('61 / 100');
    expect(html).toContain(REPORT.areasHeading);
    Object.values(REPORT.moduleNames).forEach((name) => expect(html).toContain(name));
  });
  it('prints provenance as words, with a legend, and never shows a negative rupee sign', () => {
    Object.values(TAGS).forEach((t) => expect(html).toContain(t));
    expect(html).not.toContain('-₹');
  });
  it('carries the disclosures, rates, version line and disclaimer', () => {
    expect(html).toContain(DISCLOSURES.rounding);
    expect(html).toContain(DISCLOSURES.epf);
    expect(html).toContain('Yearly return: 10% a year (your assumption)');
    expect(html).toContain('Report version fhc-report-v1');
    expect(html).not.toContain('Kundli');
    expect(html).toContain(REPORT.printPrivacy);
  });
});

describe('audit fixes', () => {
  it('the cash-flow card shows the A3 mismatch itself', () => {
    const m = buildReport(makeAnswers({ core: { income: '50000', expenses: '40000', emi: '15000', other: '0', investments: '0' } })).modules[0];
    expect(m.messages.map((x) => x.text)).toContain(MSG.A3ess('₹5,000'));
    const notSure = buildReport(makeAnswers({ core: { income: '60000', expenses: '30000', emi: '15000', other: 'not-sure', investments: '20000' } })).modules[0];
    expect(notSure.messages.map((x) => x.text)).toContain(MSG.A3inv('₹5,000'));
  });
  it('net worth does not repeat the known totals when a section was skipped', () => {
    const m = buildReport(makeAnswers({ assets: 'skip', liabilities: 'skip' })).modules.find((x) => x.id === 'netWorth');
    const all = m.messages.map((x) => x.text).join(' | ');
    expect(all.match(/Known assets:/g)).toHaveLength(1);
    expect(all).toContain('A full net-worth figure needs: What you own (skipped), What you owe (skipped).');
  });
  it('an incomplete section says inside its card what it needs', () => {
    const debt = buildReport(makeAnswers({ liabilities: 'skip' })).modules.find((x) => x.id === 'debt');
    expect(debt.messages.map((x) => x.text)).toContain(MSG.partialNeeds('What you owe (skipped)'));
  });
  it('the error summary names the question for every error key', () => {
    const a = kundliReducer(kundliReducer(emptyAnswers(), { type: 'goalsGate', value: 'yes' }), { type: 'retGate', value: 'yes' });
    const keys = ['income', 'savings', 'termCover', 'overlap', 'business', 'goals', 'retirement', 'assumptions', 'ownList', 'oweList'].flatMap((s) => Object.keys(validateScreen(s, a)));
    expect(keys.length).toBeGreaterThan(10);
    keys.forEach((k) => expect(errorLabel(k, a), k).toBeTruthy());
  });
  it('choosing Not sure for a button-filled retirement spend clears the button source', () => {
    let a = kundliReducer(emptyAnswers(), { type: 'fillSpend', raw: '30000', source: 'fixed' });
    a = kundliReducer(a, { type: 'state', path: ['ret', 'spend'], state: 'not-sure' });
    expect(a.ret.spend.source).toBe('typed');
  });
});

describe('answers survive a trip to another page in the same tab (memory only)', () => {
  it('the intro offers to continue when answers are in memory, and Start over clears them', async () => {
    const { writeSession, clearSession, readSession } = await import('../../utils/kundli/kundliSession');
    writeSession(FULL, 'abc');
    const html = text(render(<FinancialKundli />));
    expect(html).toContain('Continue where you left off');
    expect(html).toContain('Start over');
    clearSession();
    expect(readSession().answers).toBeNull();
    expect(text(render(<FinancialKundli />))).not.toContain('Continue where you left off');
  });
});

describe('the Financial Health Check-up entry points', () => {
  it('the Calculators page section links to /financial-health-checkup and keeps the old #health-check anchor', () => {
    const html = render(<KundliTeaser />);
    expect(html).toContain('href="/financial-health-checkup"');
    expect(html).toContain('id="health-check"');
    expect(text(html)).toContain('Start my Financial Health Check-up');
    expect(html).not.toContain('Kundli');
  });
  it('the old /financial-kundli address redirects to /financial-health-checkup', async () => {
    const { readFileSync } = await import('node:fs');
    const app = readFileSync('src/App.jsx', 'utf8');
    expect(app).toContain('<Route path="/financial-health-checkup" element={<FinancialKundliPage />} />');
    expect(app).toContain('<Route path="/financial-kundli" element={<Navigate to="/financial-health-checkup" replace />} />');
  });
  it('the Calculators page and the Navbar open the new check-up, not the old 3-step one', async () => {
    const { readFileSync } = await import('node:fs');
    const calc = readFileSync('src/pages/calculators/CalculatorsLandingPage.jsx', 'utf8');
    expect(calc).not.toContain("from '../../components/planning/HealthCheck'");
    expect(calc).toContain('<KundliTeaser />');
    const nav = readFileSync('src/components/Navbar.jsx', 'utf8');
    expect(nav).toContain("navigate('/financial-health-checkup')");
    expect(nav).toContain('Check Your Financial Health');
    expect(nav).not.toMatch(/>[^<]*Kundli/);
  });
});
