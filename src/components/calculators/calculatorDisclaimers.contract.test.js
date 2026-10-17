import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { calculateSIP } from '../../utils/calculatorEngine';

/**
 * Source-contract tests for the Phase 1 wording changes. The repo has no DOM test tooling, so these read the component sources
 * (line endings normalised) and check that the notes are rendered, the misleading wording stays out, and the old hard-coded sample
 * figures are not back.
 */
const here = (rel) => fileURLToPath(new URL(rel, import.meta.url));
const read = (rel) => readFileSync(here(rel), 'utf8').replace(/\r\n/g, '\n');

const NEGATIONS = /\b(?:not|no)\s+(?:a\s+)?(?:forecast\s+or\s+a\s+)?guarantee[sd]?\b/gi;
const PROMISES = /guarant|\bensures?\b|assured|risk-free|without financial stress/i;
const promises = (text) => PROMISES.test(text.replace(NEGATIONS, ''));

const GOAL = read('./GoalPlanner.jsx');

describe('GoalPlanner wording', () => {
  it('no longer says it guarantees or ensures a goal', () => {
    expect(GOAL).not.toMatch(/to guarantee/i);
    expect(GOAL).not.toMatch(/\bensures\b/i);
    expect(GOAL).not.toMatch(/without financial stress/i);
    expect(promises(GOAL)).toBe(false);
  });

  it('calls the headline figure an estimate and says returns are not guaranteed', () => {
    expect(GOAL).toContain('ESTIMATED MONTHLY SIP NEEDED');
    expect(GOAL).not.toContain('RECOMMENDED MONTHLY SIP');
    expect(GOAL).toContain('if returns average {result.effectiveReturn}% a year. Returns are not guaranteed.');
    expect(GOAL).toContain('if returns average {result.effectiveReturn}% a year. Actual returns will differ.');
    expect(GOAL).toContain('goalAssumptionNote(result.effectiveReturn)');
  });

  it('shows the effective return of the engine, never the raw typed rate, in every sentence that names a return', () => {
    expect(GOAL).not.toContain('{expectedReturn}%');
    expect(GOAL).not.toContain('goalAssumptionNote(expectedReturn)');
    expect(GOAL.split('result.effectiveReturn').length - 1).toBe(3);
  });

  it('keeps the calculation call and the saved payload unchanged', () => {
    expect(GOAL).toContain('calculateGoal(goalName, targetAmount, yearsRemaining, expectedReturn, existingSavings)');
    expect(GOAL).toContain('requiredMonthlySIP: result.requiredMonthlySIP');
  });
});

describe('risk and assumption notes are rendered on every investment calculator', () => {
  const cases = [
    ['./GoalPlanner.jsx', ['goalAssumptionNote(result.effectiveReturn)', 'MARKET_RISK_NOTE', 'RATE_LIMIT_NOTE']],
    ['./SipCalculator.jsx', ['MARKET_RISK_NOTE', 'SIP_CONVENTION_NOTE']],
    ['../investments/InvestmentCalculator.jsx', ['MARKET_RISK_NOTE', 'SIP_CONVENTION_NOTE']],
    ['./LumpsumCalculator.jsx', ['MARKET_RISK_NOTE', 'RATE_LIMIT_NOTE']],
    ['./RetirementCalculator.jsx', ['RETIREMENT_NOTE']],
    ['./FdCalculator.jsx', ['FD_NOTE', 'RATE_LIMIT_NOTE']],
    ['./InteractiveCalculatorPreview.jsx', ['MARKET_RISK_NOTE', 'SIP_CONVENTION_NOTE']],
  ];
  cases.forEach(([file, notes]) => {
    it(`${file} renders the disclaimer with ${notes.join(' and ')}`, () => {
      const src = read(file);
      expect(src).toMatch(/import CalculatorDisclaimer from '(?:\.\/|\.\.\/calculators\/)CalculatorDisclaimer';/);
      const use = src.match(/<CalculatorDisclaimer notes=\{\[([^\]]*)\]\} \/>/);
      expect(use, 'disclaimer element').not.toBeNull();
      notes.forEach((n) => expect(use[1]).toContain(n));
    });
  });

  it('the disclaimer component uses only existing colour tokens and a small, readable size', () => {
    const src = read('./CalculatorDisclaimer.jsx');
    expect(src).toContain('text-[11px]');
    expect(src).toContain('text-[#64748B]');
    expect(src).toContain('border-[#E4E8F0]');
    expect(src.match(/#[0-9A-Fa-f]{3,8}\b/g).sort()).toEqual(['#64748B', '#E4E8F0']);
  });
});

describe('no misleading guarantee wording in the calculator and investment sources', () => {
  const dir = here('./');
  const files = [
    ...readdirSync(dir).filter((f) => f.endsWith('.jsx')).map((f) => `./${f}`),
    '../investments/InvestmentCalculator.jsx',
    '../investments/PortfolioPreview.jsx',
  ];
  files.forEach((file) => {
    it(`${file} does not promise an outcome`, () => {
      expect(promises(read(file)), file).toBe(false);
    });
  });

  it('the FD calculator no longer calls its result guaranteed, and its calculation call is unchanged', () => {
    const fd = read('./FdCalculator.jsx');
    expect(fd).not.toMatch(/guaranteed/i);
    expect(fd).toContain('Fixed-Rate Illustration');
    expect(fd).toContain('calculateFD(depositAmount, interestRate, durationYears, frequency)');
  });
});

describe('unsupported hard-coded sample figures are gone', () => {
  const hero = read('./CalculatorsHero.jsx');
  const featured = read('./FeaturedCalculators.jsx');
  const preview = read('./InteractiveCalculatorPreview.jsx');
  const portfolio = read('../investments/PortfolioPreview.jsx');

  it('the hub cards no longer contain the old SIP, EMI, FIRE and tax-saved figures', () => {
    [hero, featured].forEach((src) => {
      ['₹2,53,40,000', '₹2.53 Cr', '₹68,450', '₹4.50 Cr', 'FIRE Age', 'Retirement Age 48', '₹48,500'].forEach((old) => {
        expect(src).not.toContain(old);
      });
    });
  });

  it('the hub cards take their SIP and EMI figures from the shared samples module', () => {
    [hero, featured].forEach((src) => {
      expect(src).toContain("from '../../utils/calculatorSamples'");
      expect(src).toContain('sipSample()');
      expect(src).toContain('emiSample()');
    });
    expect(hero).toContain('{SIP.full}');
    expect(hero).toContain('{EMI.text}');
    expect(featured).toContain('value: SIP.compact');
  });

  it('the interactive preview calls the engine and no longer carries its own SIP formula', () => {
    expect(preview).toContain("import { calculateSIP } from '../../utils/calculatorEngine';");
    expect(preview).toContain('calculateSIP(monthlySip, returnRate, years, 0)');
    expect(preview).not.toMatch(/Math\.pow\(1 \+ i,/);
  });

  it('the Investments page preview is computed, shows its return assumption, and drops the unsupported claims', () => {
    ['Stress-tested', 'Passive Income', '₹1.80 Lakhs', '₹9 Lakhs', '₹58 Lakhs', '₹1.45 Cr', '₹2.50 Cr', 'Retirement Age 48', '12.4%'].forEach((old) => {
      expect(portfolio).not.toContain(old);
    });
    expect(portfolio).toContain('portfolioSample()');
    expect(portfolio).toContain('SAMPLE.points.map');
    expect(portfolio).toContain('Assumed return: {SAMPLE_PORTFOLIO.annualReturn}% a year (illustrative)');
    expect(portfolio).toContain('{SAMPLE_FIGURES_NOTE}');
  });
});

describe('FeaturedCalculators section text', () => {
  it('no longer claims the calculators are relied on by thousands of families, and adds no usage or trust claim in its place', () => {
    const featured = read('./FeaturedCalculators.jsx');
    expect(featured).not.toMatch(/thousands|relied on|families to structure/i);
    expect(featured).toContain('Three core calculators for estimating your savings, your loan repayments and your retirement needs.');
    expect(featured).not.toMatch(/(trusted by|millions|thousands|award|top-rated)/i);
  });
});

describe('Phase 1b: unsupported claims are gone from the calculator and investment-calculator sources', () => {
  const dir = here('./');
  const files = [
    ...readdirSync(dir).filter((f) => f.endsWith('.jsx')).map((f) => `./${f}`),
    '../investments/InvestmentCalculator.jsx',
    '../investments/PortfolioPreview.jsx',
  ];
  const banned = [
    ['2.4x', /2\.4\s*x/i],
    ['SEBI', /SEBI/],
    ['tax-loss harvesting', /tax-loss/i],
    ['inflation hedged', /inflation hedged/i],
    ['accuracy claim', /Accuracy:|PRECISION|Precision Engine/i],
    ['shield claim', /Growth Shield/],
    ['zero commission', /Zero[- ]Commission/i],
    ['pure compound growth', /Pure compound growth/],
    ['exact target', /exact net worth/i],
  ];
  files.forEach((file) => {
    it(`${file} contains none of the removed claims`, () => {
      const src = read(file);
      banned.forEach(([name, re]) => {
        expect(re.test(src), `${file}: ${name}`).toBe(false);
      });
    });
  });

  it('the SIP step-up line makes no numeric promise', () => {
    const sip = read('./SipCalculator.jsx');
    expect(sip).toContain('builds a larger corpus than a flat SIP');
    expect(sip).toContain('depends on the step-up, the return and the number of years');
  });

  it('the replacement wording is in place', () => {
    expect(read('./CalculatorLayout.jsx')).toContain('They are estimates, not guaranteed results.');
    expect(read('./RetirementCalculator.jsx')).toContain('Inflation-Adjusted Estimate');
    expect(read('../investments/PortfolioPreview.jsx')).toContain('Before tax and costs');
  });

  it('the engine behaviour behind the SIP wording holds: a step-up gives a larger corpus than a flat SIP, by an amount that varies', () => {
    const ratio = (years, step) => calculateSIP(25000, 12, years, step).futureValue / calculateSIP(25000, 12, years, 0).futureValue;
    expect(ratio(15, 10)).toBeGreaterThan(1);
    expect(ratio(5, 10)).toBeLessThan(ratio(15, 10));
    expect(ratio(30, 30)).toBeGreaterThan(2.4); // so no fixed "up to 2.4x" can be true
  });
});

describe('files this phase must not touch', () => {
  it('CalculatorsPreview.jsx still exists and is not imported anywhere under src', () => {
    const root = here('../../');
    const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}${e.name}/`) : [`${d}${e.name}`]));
    const all = walk(root.endsWith('/') ? root : `${root}/`).filter((f) => /\.(jsx?|tsx?)$/.test(f));
    expect(all.some((f) => f.endsWith('CalculatorsPreview.jsx'))).toBe(true);
    const importers = all.filter((f) => !f.endsWith('CalculatorsPreview.jsx') && !f.endsWith('calculatorDisclaimers.contract.test.js') && /CalculatorsPreview/.test(readFileSync(f, 'utf8')));
    expect(importers).toEqual([]);
  });
});
