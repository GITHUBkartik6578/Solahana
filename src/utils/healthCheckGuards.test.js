import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as engine from './healthCheckInsights.js';
import {
  BUSINESS_CHOICES,
  CONSENT_TEXTS,
  CONSENT_VERSION,
  LIMITS,
  MONEY_FIELDS,
  OVERLAP_CHOICES,
  buildLeadPayload,
  scoreHealthCheck,
} from './financialHealthCheck.js';

/**
 * Guards for PR-A. They prove that adding the insight engine changes nothing that already exists (the score, the lead payload, the
 * questions, the consent, the server) and that the engine itself stays pure. A source scan alone proves little (it cannot see
 * indirection or code in another module), so each scan sits beside a check that runs the code with the browser and clock globals
 * made to throw, and beside an allow-list of what the module may import. None of this proves that nothing can read the page.
 */

const HEALTH = LIMITS.healthThresholdRupees * 100;
const floorDiv = (a, b) => (a - (a % b)) / b;
const ceilDiv = (a, b) => floorDiv(a, b) + (a % b === 0 ? 0 : 1);
const read = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8');
const engineSource = read('./healthCheckInsights.js');

// ---------------------------------------------------------------------------------------------------------------------
// The score did not change
// ---------------------------------------------------------------------------------------------------------------------

/** 63,000 deterministic cases on and around every threshold, hashed result by result. The digest was taken from the scoring function on main before PR-A. */
function goldenGrid() {
  const hash = createHash('sha256');
  let count = 0;
  for (const income of [1, 100, 12345, 8_000_000, 1_000_000_000]) {
    const emiFull = floorDiv(income * 30, 100);
    const emiPartial = floorDiv(income * 45, 100);
    const invPartial = ceilDiv(income * 10, 100);
    const invFull = ceilDiv(income * 20, 100);
    const emis = [0, emiFull, emiFull + 1, emiPartial, emiPartial + 1, income + 1];
    const terms = [0, 60 * income - 1, 60 * income, 120 * income - 1, 120 * income];
    const investments = [0, Math.max(0, invPartial - 1), invPartial, Math.max(0, invFull - 1), invFull];
    for (const expenses of [0, Math.max(1, floorDiv(income * 4, 10))]) {
      const savingsChoices = expenses === 0 ? [0, 1_000_000] : [0, 3 * expenses - 1, 3 * expenses, 6 * expenses - 1, 6 * expenses];
      for (const emi of emis) for (const termCover of terms) for (const savings of savingsChoices) for (const inv of investments)
        for (const healthCover of [0, HEALTH - 1, HEALTH]) for (const [overlap, business] of [['yes', 'yes'], ['no', 'no'], ['yes', 'na'], ['no', 'na']]) {
          hash.update(`${JSON.stringify(scoreHealthCheck({ income, expenses, emi, savings, termCover, healthCover, investments: inv, overlap, business }))}\n`);
          count += 1;
        }
    }
  }
  return { count, digest: hash.digest('hex') };
}

describe('the existing hc-v1 score is unchanged', () => {
  it('gives the same result on all 63,000 golden cases', () => {
    expect(goldenGrid()).toEqual({ count: 63_000, digest: '16649332153ad73ad87244b1fd4f1e13315e89d65c5ce173e12bbfd45a4c7fd1' });
  });

  it('gives these results, written out by hand, on six named cases', () => {
    const named = [
      [{ income: 8_000_000, expenses: 3_500_000, emi: 1_500_000, savings: 30_000_000, termCover: 500_000_000, healthCover: 50_000_000, investments: 1_000_000, overlap: 'yes', business: 'na' },
        { points: { emi: 20, term: 10, emergency: 20, investment: 8, health: 0, overlap: 5, shielding: null }, earned: 63, applicable: 95, score: 66, band: 'good' }],
      [{ income: 10_000_000, expenses: 3_000_000, emi: 3_000_000, savings: 18_000_000, termCover: 1_200_000_000, healthCover: 100_000_000, investments: 2_000_000, overlap: 'yes', business: 'yes' },
        { points: { emi: 20, term: 20, emergency: 20, investment: 15, health: 15, overlap: 5, shielding: 5 }, earned: 100, applicable: 100, score: 100, band: 'strong' }],
      [{ income: 10_000_000, expenses: 3_000_000, emi: 5_000_000, savings: 0, termCover: 0, healthCover: 0, investments: 0, overlap: 'no', business: 'no' },
        { points: { emi: 0, term: 0, emergency: 0, investment: 0, health: 0, overlap: 0, shielding: 0 }, earned: 0, applicable: 100, score: 0, band: 'attention' }],
      [{ income: 10_000_000, expenses: 0, emi: 3_000_000, savings: 0, termCover: 1_200_000_000, healthCover: 100_000_000, investments: 2_000_000, overlap: 'yes', business: 'na' },
        { points: { emi: 20, term: 20, emergency: null, investment: 15, health: 15, overlap: 5, shielding: null }, earned: 75, applicable: 75, score: 100, band: 'strong' }],
      [{ income: 10_000_000, expenses: 3_000_000, emi: 3_000_000, savings: 9_000_000, termCover: 600_000_000, healthCover: 99_999_999, investments: 1_000_000, overlap: 'no', business: 'na' },
        { points: { emi: 20, term: 10, emergency: 10, investment: 8, health: 0, overlap: 0, shielding: null }, earned: 48, applicable: 95, score: 51, band: 'good' }],
      [{ income: 10_000_000, expenses: 3_000_000, emi: 3_000_001, savings: 8_999_999, termCover: 599_999_999, healthCover: 100_000_000, investments: 999_999, overlap: 'yes', business: 'yes' },
        { points: { emi: 10, term: 0, emergency: 0, investment: 0, health: 15, overlap: 5, shielding: 5 }, earned: 35, applicable: 100, score: 35, band: 'attention' }],
    ];
    named.forEach(([values, expected]) => {
      const result = scoreHealthCheck(values);
      expect({ points: result.points, earned: result.earned, applicable: result.applicable, score: result.score, band: result.band }).toEqual(expected);
      expect(engine.buildInsights(values).reasons).toMatchObject({ earned: expected.earned, applicable: expected.applicable, score: expected.score });
    });
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// Nothing was added to what a visitor is asked or what is sent
// ---------------------------------------------------------------------------------------------------------------------

describe('the questions, the consent and the lead payload are unchanged', () => {
  const values = { income: 8_000_000, expenses: 3_500_000, emi: 1_500_000, savings: 30_000_000, termCover: 500_000_000, healthCover: 50_000_000, investments: 1_000_000, overlap: 'yes', business: 'na' };
  const result = scoreHealthCheck(values);
  const payload = buildLeadPayload({ fullName: ' Asha Rao ', phone: '98765 43210', result });

  it('still asks exactly the seven amounts and two choices', () => {
    expect(Object.keys(MONEY_FIELDS)).toEqual(['income', 'expenses', 'emi', 'savings', 'termCover', 'healthCover', 'investments']);
    expect(OVERLAP_CHOICES).toEqual(['yes', 'no']);
    expect(BUSINESS_CHOICES).toEqual(['yes', 'no', 'na']);
  });
  it('the Health Check-up still uses its one approved consent version (the Kundli adds its own, never edits this one)', () => {
    expect(CONSENT_VERSION).toBe('hc-consent-v1');
    expect(Object.keys(CONSENT_TEXTS)).toEqual(['hc-consent-v1', 'kundli-consent-v1']);
  });
  it('still sends exactly these keys and nothing from the insight engine', () => {
    expect(Object.keys(payload)).toEqual(['fullName', 'phone', 'source', 'consent', 'result']);
    expect(Object.keys(payload.consent)).toEqual(['callback', 'textVersion']);
    expect(Object.keys(payload.result)).toEqual(['scoringVersion', 'shieldingApplicable', 'emergencyMeasurable', 'points', 'earned', 'applicable', 'score', 'band']);
    expect(Object.keys(payload.result.points)).toEqual(['emi', 'term', 'emergency', 'investment', 'health', 'overlap', 'shielding']);
    expect(Object.keys(payload).filter((key) => ['version', 'figures', 'alerts', 'findings', 'reasons', 'steps', 'severity', 'info'].includes(key))).toEqual([]);
  });
  it('carries none of the amounts, in paise or in rupees', () => {
    const text = JSON.stringify(payload);
    Object.values(values).filter((value) => typeof value === 'number').forEach((paise) => {
      expect(text).not.toContain(String(paise));
      expect(text).not.toContain(String(paise / 100));
    });
  });
  it('is not reached by the engine: nothing on the server or in the payload code imports it', () => {
    const walk = (dir) => readdirSync(dir).flatMap((name) => {
      const full = `${dir}/${name}`;
      return statSync(full).isDirectory() ? (name === 'node_modules' ? [] : walk(full)) : [full];
    });
    const serverFiles = walk(fileURLToPath(new URL('../../server', import.meta.url))).filter((file) => file.endsWith('.js'));
    expect(serverFiles.length).toBeGreaterThan(10);
    expect(serverFiles.filter((file) => readFileSync(file, 'utf8').includes('healthCheckInsights'))).toEqual([]);
    ['./financialHealthCheck.js', '../services/healthCheckService.js', './financialHealthCheckCopy.js', './healthCheckAdminView.js', '../../server/validations/healthCheckValidation.js']
      .forEach((file) => expect(read(file)).not.toContain('healthCheckInsights'));
  });
});

// ---------------------------------------------------------------------------------------------------------------------
// The engine stays pure
// ---------------------------------------------------------------------------------------------------------------------

/** The source without comments, so that a word in an explanation does not trip the scan (a word in code or in a string still does). */
const code = engineSource.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('the engine imports, exports and source', () => {
  it('imports only the existing scoring module, statically', () => {
    const imports = [...code.matchAll(/^\s*import\s[^;]*?from\s*['"]([^'"]+)['"]/gm)].map((match) => match[1]);
    expect(imports).toEqual(['./financialHealthCheck.js']);
    expect(code).not.toMatch(/^\s*import\s*['"]/m); // no import for side effects
    expect(code).not.toMatch(/\bexport\s+(\*|\{[^}]*\})\s*from\b/); // no re-export of anything else
    expect(code).not.toMatch(/\bimport\s*\(|\brequire\s*\(/);
  });

  it('exports exactly the planned names and nothing else', () => {
    expect(Object.keys(engine).sort()).toEqual([
      'DISPLAY_CEILINGS', 'INSIGHTS_VERSION', 'InsightsInputError', 'MAX_AMOUNT_PAISE', 'SEVERITY_RATIONALE', 'SEVERITY_TABLE', 'TARGETS',
      'buildAlerts', 'buildInsights', 'computeFigures', 'divCeil', 'divFloor', 'formatMonthsTenths', 'formatMultipleTenths', 'formatPercentTenths',
      'formatRupeesCeil', 'formatRupeesExact', 'formatRupeesFloor', 'informationalRunway', 'monthlySetAside12', 'rankFindings', 'scoreReasons',
      'selectNextSteps', 'severityFor', 'severityForCashFlow', 'tryBuildInsights',
    ]);
    expect(engineSource).not.toMatch(/SEVERITY_APPROVED/); // the old approval switch is gone for good
    Object.entries(engine).forEach(([name, value]) => {
      if (typeof value === 'object') expect(Object.isFrozen(value), name).toBe(true);
    });
  });

  const forbidden = {
    'browser storage': /\b(localStorage|sessionStorage|indexedDB|openDatabase|caches)\b/,
    'cookies': /cookie/i,
    'page, window or location': /\b(document|window|navigator|location|history|screen)\b/,
    'network': /\b(fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|axios|apiClient|postMessage|importScripts|BroadcastChannel)\b/,
    'analytics or tracking': /gtag|dataLayer|analytics|pixel|tracker|tracking|telemetry|mixpanel|sentry|hotjar|clarity/i,
    'payment or checkout': /payment|checkout|razorpay|stripe|payu|paytm|cashfree|gateway|billing|invoice/i,
    'logging or debugging': /\b(console|debugger)\b/,
    'time, randomness or timers': /\bMath\.random\b|\bDate\b|\bperformance\b|\bcrypto\b|\bsetTimeout\b|\bsetInterval\b|\brequestAnimationFrame\b|\bqueueMicrotask\b/,
    'indirection and dynamic code': /\beval\b|\bnew Function\b|\bFunction\s*\(|\bglobalThis\b|\bself\b|\bprocess\b|\bWindow\b/,
  };
  Object.entries(forbidden).forEach(([what, pattern]) => {
    it(`does not mention ${what}`, () => expect(code.match(pattern)).toBeNull());
  });

  it('has no top-level statement other than imports, declarations and exports', () => {
    const topLevel = code.split('\n').filter((line) => /^\S/.test(line) && !/^[}\])]/.test(line));
    const odd = topLevel.filter((line) => !/^(import |export |const |function |let )/.test(line));
    expect(odd).toEqual([]);
  });
});

describe('the engine runs with the browser, clock and network globals made to throw', () => {
  const names = ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'localStorage', 'sessionStorage', 'indexedDB', 'document', 'window', 'Date'];

  /** Runs `work` while each of those globals, Math.random and performance.now throw if touched, then puts everything back. */
  function withForbiddenGlobals(work) {
    const saved = names.map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]);
    const realRandom = Math.random;
    const realNow = performance.now;
    const trap = (name) => () => { throw new Error(`the engine touched ${name}`); };
    names.forEach((name) => Object.defineProperty(globalThis, name, { configurable: true, get: trap(name) }));
    Math.random = trap('Math.random');
    performance.now = trap('performance.now');
    try {
      return work();
    } finally {
      Math.random = realRandom;
      performance.now = realNow;
      saved.forEach(([name, descriptor]) => (descriptor ? Object.defineProperty(globalThis, name, descriptor) : delete globalThis[name]));
    }
  }

  it('calls nothing outside itself over a few thousand cases', () => {
    const outcome = withForbiddenGlobals(() => {
      let runs = 0;
      let failure = null;
      try {
        for (const income of [1, 5, 100, 8_000_000, 1_000_000_000]) {
          for (const emi of [0, 1, income, 2 * income]) for (const expenses of [0, 1, 3_500_000]) for (const savings of [0, 5, 30_000_000]) for (const termCover of [0, 60 * income, Math.min(120 * income, LIMITS.balanceMaxRupees * 100)])
            for (const investments of [0, income]) for (const healthCover of [0, HEALTH]) for (const business of ['yes', 'na']) {
              const values = { income, expenses, emi, savings, termCover, healthCover, investments, overlap: 'no', business };
              const insights = engine.buildInsights(values);
              if (!engine.tryBuildInsights(values).ok) throw new Error('tryBuildInsights refused a valid input');
              engine.computeFigures(values);
              engine.informationalRunway(values);
              insights.steps.forEach((step) => Object.values(step.params).forEach((paise) => { engine.formatRupeesCeil(paise); engine.formatRupeesFloor(paise); engine.formatRupeesExact(paise); }));
              engine.formatPercentTenths(insights.figures.emi.pctTenths);
              engine.formatMultipleTenths(insights.figures.lifeBenchmark.multipleTenths);
              if (insights.figures.runway.applies) engine.formatMonthsTenths(insights.figures.runway.monthsTenths);
              engine.monthlySetAside12(insights.figures.healthReference.gapPaise);
              runs += 1;
            }
        }
      } catch (error) {
        failure = error.message;
      }
      return { runs, failure };
    });
    expect(outcome.failure).toBeNull();
    expect(outcome.runs).toBeGreaterThan(1500);
  });

  it('really would have failed on a forbidden call (the trap itself works)', () => {
    expect(() => withForbiddenGlobals(() => Math.random())).toThrow(/Math\.random/);
    expect(() => withForbiddenGlobals(() => new Date())).toThrow(/Date/);
    expect(typeof Math.random()).toBe('number'); // and everything was put back
    expect(typeof Date.now()).toBe('number');
  });
});

describe('the engine documentation stays in step with the code', () => {
  const docs = read('../../docs/health-check-insights-engine.md');
  it('names every export, in backticks', () => {
    expect(Object.keys(engine).filter((name) => !docs.includes(`\`${name}\``))).toEqual([]);
  });
  it('explains the A3 kinds and suppression, the severity rule, the units, the info shape, the safe error handling and the privacy boundary', () => {
    ['essentialsAndEmi', 'Suppression rule', 'EMI alone is above income', 'how urgent', 'not how many points', 'SEVERITY_RATIONALE', 'tenths', 'rounded **up**', 'display ceilings',
      'withEmiRunway', 'tryBuildInsights', 'InsightsInputError', 'MAX_AMOUNT_PAISE', 'Privacy boundary', 'must never be passed to `buildLeadPayload`', 'no approval switch'].forEach((phrase) => {
      expect(docs, phrase).toContain(phrase);
    });
    expect(docs).not.toMatch(/SEVERITY_APPROVED/);
  });
  it('lists every step id and every severity level it uses', () => {
    ['CASH-ESS', 'CASH-INV', 'EM-0', 'EM-1', 'EMI-0', 'EMI-1', 'TERM-0', 'TERM-1', 'HEALTH-0', 'INV-0', 'INV-1', 'OVERLAP-0', 'SHIELD-0'].forEach((id) => expect(docs, id).toContain(id));
    ['high', 'medium', 'low'].forEach((level) => expect(docs, level).toContain(`**${level}**`));
  });
});
