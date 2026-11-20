import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FIELDS, CHOICES } from '../financialHealthCheckCopy.js';
import * as COPY from './kundliCopy.js';
import { ERRORS } from './kundliCopy.js';
import { emptyAnswers, normalizeAnswers, readField, RULES, CORE_RULES, screenOrder, validateScreen, firstInvalidScreen } from './kundliInputs.js';
import { hasAnswers, kundliReducer } from './kundliState.js';
import { makeAnswers } from './kundliTestHelpers.js';

const typed = (raw) => ({ raw: String(raw), state: '' });

describe('field reading', () => {
  it('accepts the Health Check-up amount formats and limits', () => {
    expect(readField(typed('50k'), CORE_RULES.expenses).value).toBe(5_000_000);
    expect(readField(typed('1.5 lakh'), CORE_RULES.savings).value).toBe(15_000_000);
    expect(readField(typed('₹45,000'), CORE_RULES.expenses).value).toBe(4_500_000);
    expect(readField(typed('50000.126'), CORE_RULES.expenses).error).toBeTruthy();
    expect(readField(typed('10000001'), CORE_RULES.expenses).error).toBe('Amount can be at most ₹1 crore per month.');
    expect(readField(typed('1000000001'), CORE_RULES.savings).error).toBe('Amount can be at most ₹100 crore.');
  });
  it('blank is missing, never 0; a typed 0 is an explicit none', () => {
    expect(readField(typed(''), CORE_RULES.emi)).toMatchObject({ status: 'missing', error: 'Enter an amount, or 0 if none.' });
    expect(readField(typed('0'), CORE_RULES.emi)).toMatchObject({ status: 'none', value: 0 });
    expect(readField(typed('0'), CORE_RULES.income).error).toBe('Enter your monthly in-hand income; it must be more than ₹0.');
  });
  it('Not sure is only accepted where the question offers it', () => {
    expect(readField({ raw: '', state: 'not-sure' }, CORE_RULES.other).status).toBe('not-sure');
    expect(readField({ raw: '', state: 'not-sure' }, CORE_RULES.termCover).status).toBe('missing');
  });
  it.each([
    ['0', false], ['1', true], ['50', true], ['51', false], ['2.5', false],
  ])('goal years %s accepted: %s', (raw, ok) => {
    expect(!readField(typed(raw), RULES.goalYears).error).toBe(ok);
  });
  it.each([
    ['inf', '-0.1', false], ['inf', '0', true], ['inf', '25', true], ['inf', '25.1', false], ['inf', '6.55', false], ['inf', '6.5', true],
    ['ret', '0', false], ['ret', '0.1', true], ['ret', '30', true], ['ret', '30.1', false],
  ])('%s rate %s accepted: %s', (rule, raw, ok) => {
    expect(!readField(typed(raw), RULES[rule]).error).toBe(ok);
  });
});

describe('retirement age boundaries (RU_MAX = 90, no default ages)', () => {
  const errs = (age, at, until) => {
    const a = emptyAnswers();
    a.retGate = 'yes';
    a.ret = { age: typed(age), at: typed(at), until: typed(until), spend: { ...typed('50000'), source: 'typed' } };
    return Object.keys(validateScreen('retirement', a)).sort().join(',');
  };
  it.each([
    [17, 18, 19, 'ret.age'],
    [18, 19, 20, ''],
    [18, 19, 90, ''],
    [80, 81, 82, ''],
    [80, 89, 90, ''],
    [81, 82, 83, 'ret.age'],
    [80, 90, 91, 'ret.at,ret.until'],
    [80, 89, 91, 'ret.until'],
    [40, 40, 41, 'ret.at'],
    [40, 41, 41, 'ret.until'],
    [40, 60, 60, 'ret.until'],
    [40, 41, 42, ''],
    [40, 60, 61, ''],
    [40, 89, 90, ''],
    [40, 90, 90, 'ret.at,ret.until'],
    ['40.5', 60, 70, 'ret.age'],
    [40, '60.5', 70, 'ret.at'],
    [40, 60, '70.5', 'ret.until'],
  ])('%s / %s / %s -> errors: "%s"', (age, at, until, expected) => {
    expect(errs(age, at, until)).toBe(expected);
  });
  it('error messages', () => {
    const a = emptyAnswers();
    a.retGate = 'yes';
    a.ret = { age: typed(40), at: typed(40), until: typed(91), spend: { ...typed('1'), source: 'typed' } };
    const e = validateScreen('retirement', a);
    expect(e['ret.at']).toBe(ERRORS.retireAfterAge);
    expect(e['ret.until']).toBe(ERRORS.untilMax);
  });
  it('ages start empty: nothing is pre-filled', () => {
    const a = kundliReducer(emptyAnswers(), { type: 'retGate', value: 'yes' });
    expect([a.ret.age.raw, a.ret.at.raw, a.ret.until.raw, a.asm.inf.raw, a.asm.ret.raw]).toEqual(['', '', '', '', '']);
    expect(Object.keys(validateScreen('retirement', a))).toEqual(expect.arrayContaining(['ret.age', 'ret.at', 'ret.until', 'ret.spend']));
  });
});

describe('checklists', () => {
  it('ticks without confirmation cannot continue; confirm or skip can', () => {
    let a = kundliReducer(emptyAnswers(), { type: 'tick', list: 'assets', key: 'MF' });
    expect(validateScreen('ownList', a)['assets.confirm']).toBe(ERRORS.confirmNeeded);
    a = kundliReducer(a, { type: 'confirm', list: 'assets', value: true });
    expect(validateScreen('ownList', a)).toEqual({});
    expect(kundliReducer(a, { type: 'skip', list: 'assets', value: true }).assets.skipped).toBe(true);
  });
  it('any checklist change resets the confirmation; unticking removes the amount', () => {
    let a = kundliReducer(emptyAnswers(), { type: 'tick', list: 'assets', key: 'MF' });
    a = kundliReducer(a, { type: 'confirm', list: 'assets', value: true });
    a = kundliReducer(a, { type: 'typed', path: ['assets', 'amounts', 'MF'], raw: '500000' });
    a = kundliReducer(a, { type: 'tick', list: 'assets', key: 'MF' });
    expect(a.assets.confirmed).toBe(false);
    expect(a.assets.amounts.MF.raw).toBe('');
  });
  it('ticked + 0 is an error with its own message', () => {
    const a = makeAnswers({ assets: { MF: '0' } });
    expect(validateScreen('ownAmounts', a)['assets.MF']).toBe(ERRORS.tickedZero);
  });
  it('no ticks + confirm -> every box is a confirmed 0', () => {
    const inp = normalizeAnswers(makeAnswers({}));
    expect(inp.assets.section).toBe('confirmed');
    expect(Object.values(inp.assets.items).every((i) => i.status === 'none' && i.value === 0)).toBe(true);
  });
});

describe('screens and flow', () => {
  it('amount screens only after ticks; assumptions only with goals or retirement', () => {
    expect(screenOrder(emptyAnswers())).toEqual(['intro', 'income', 'savings', 'protection', 'habits', 'ownList', 'oweList', 'goals', 'retirement', 'review', 'report']);
    const a = makeAnswers({ assets: { MF: '100' }, goals: [{ cost: '1', years: '1', saved: 'none' }] });
    expect(screenOrder(a)).toEqual(expect.arrayContaining(['ownAmounts', 'assumptions']));
    expect(screenOrder(a)).not.toContain('oweAmounts');
  });
  it('a complete answer set has no invalid screen', () => {
    expect(firstInvalidScreen(makeAnswers({ goals: [{ cost: '100000', years: '5', saved: 'none' }], asm: { inf: '6', ret: '8' } }))).toBeNull();
    expect(firstInvalidScreen(emptyAnswers())).toBe('income');
  });
  it('goal gate: Not now removes goals; max 5 goals', () => {
    let a = kundliReducer(emptyAnswers(), { type: 'goalsGate', value: 'yes' });
    expect(a.goals).toHaveLength(1);
    for (let i = 0; i < 10; i += 1) a = kundliReducer(a, { type: 'addGoal' });
    expect(a.goals).toHaveLength(5);
    a = kundliReducer(a, { type: 'goalsGate', value: 'no' });
    expect(a.goals).toHaveLength(0);
  });
  it('retirement spend buttons fill the value and mark the source; typing resets it', () => {
    let a = kundliReducer(emptyAnswers(), { type: 'fillSpend', raw: '35000', source: 'fixed' });
    expect(a.ret.spend).toMatchObject({ raw: '35000', source: 'fixed' });
    a = kundliReducer(a, { type: 'typed', path: ['ret', 'spend'], raw: '40000' });
    expect(a.ret.spend.source).toBe('typed');
  });
  it('hasAnswers is false only for a fresh form; reset clears everything', () => {
    expect(hasAnswers(emptyAnswers())).toBe(false);
    const a = kundliReducer(emptyAnswers(), { type: 'typed', path: ['fields', 'income'], raw: '5' });
    expect(hasAnswers(a)).toBe(true);
    expect(hasAnswers(kundliReducer(a, { type: 'reset' }))).toBe(false);
  });
});

describe('never zero: Not sure / skipped / blank never reach a calculation as 0 (property test)', () => {
  it('every unknown answer normalises to a status other than entered/none, with no value', () => {
    let seed = 7;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 300; i += 1) {
      const a = makeAnswers({ goals: [{ cost: '100000', years: '5', saved: 'none' }], asm: { inf: '6', ret: '8' }, assets: { MF: '100000', GOLD: '5000' } });
      const pick = ['other', 'income', 'savings'][Math.floor(rand() * 3)];
      a.fields[pick] = rand() < 0.5 ? { raw: '', state: '' } : { raw: '', state: 'not-sure' };
      if (rand() < 0.5) a.assets.amounts.GOLD = { raw: '', state: 'not-sure' };
      if (rand() < 0.5) a.goals[0].cost = { raw: '', state: 'not-sure' };
      const inp = normalizeAnswers(a);
      const f = inp.core[pick];
      if (pick !== 'other' || f.status !== 'not-sure') expect(['missing', 'not-sure']).toContain(f.status);
      expect(f.value).toBeNull();
      if (a.assets.amounts.GOLD.state === 'not-sure') expect(inp.assets.items.GOLD.value).toBeNull();
      if (a.goals[0].cost.state === 'not-sure') expect(inp.goals.list[0].cost.value).toBeNull();
    }
  });
});

describe('copy', () => {
  it('reuses the nine Health Check-up questions verbatim', () => {
    expect(COPY.CORE_FIELDS.income).toBe(FIELDS.income);
    expect(COPY.CORE_FIELDS.savings.help).toBe(FIELDS.savings.help);
    expect(COPY.CORE_CHOICES).toBe(CHOICES);
  });
  it('has no forbidden words and no regulatory claims', () => {
    const all = JSON.stringify(Object.fromEntries(Object.entries(COPY).filter(([k]) => k !== 'FORBIDDEN_WORDS'))).toLowerCase();
    COPY.FORBIDDEN_WORDS.forEach((w) => expect(all).not.toContain(w.toLowerCase()));
    expect(all).not.toContain('25 years');
  });
  it('carries the approved disclosures', () => {
    expect(COPY.DISCLOSURES.rounding).toBe('Amounts you need are rounded up and amounts you would have are rounded down, so totals may differ by a rupee or two.');
    expect(COPY.CORE_FIELDS.other.help).toContain('Do not include your monthly investments or SIPs');
    expect(COPY.ASSETS.items.FIX.label).toContain('other than liquid funds already counted in liquid savings');
  });
});

describe('privacy guard: the Kundli never sends or stores anything', () => {
  const dirs = ['src/utils/kundli', 'src/components/kundli', 'src/pages'];
  const files = dirs.flatMap((d) => {
    try {
      return readdirSync(d)
        .filter((f) => /\.(js|jsx)$/.test(f) && !f.includes('.test.') && (d !== 'src/pages' || f.startsWith('FinancialKundli')))
        .map((f) => join(d, f));
    } catch {
      return [];
    }
  });
  it('finds the Kundli source files', () => {
    expect(files.length).toBeGreaterThanOrEqual(5);
  });
  it.each(['fetch(', 'XMLHttpRequest', 'sendBeacon', 'localStorage', 'sessionStorage', 'indexedDB', 'document.cookie', 'console.', '/services/', 'axios', '/api/'])(
    'no "%s" in Kundli source',
    (needle) => {
      // The one allowed exception: the optional callback form may use the callback service (checked below)
      files
        .filter((f) => !(needle === '/services/' && (f.endsWith('KundliCallback.jsx') || f.endsWith('KundliContact.jsx'))))
        .forEach((f) => expect(readFileSync(f, 'utf8'), f).not.toContain(needle));
    },
  );
  it('the callback form sends only buildKundliLead output, through the existing callback service', () => {
    const src = readFileSync('src/components/kundli/KundliCallback.jsx', 'utf8');
    expect(src).toContain("import healthCheckService from '../../services/healthCheckService';");
    expect([...new Set(src.match(/healthCheckService\.\w+/g))]).toEqual(['healthCheckService.submitCallback']);
    expect(src).toContain('healthCheckService.submitCallback(buildKundliLead({ fullName: contact.fullName, phone: contact.phone, result }))');
    expect(src).toContain('useState(false); // never');
  });
});
