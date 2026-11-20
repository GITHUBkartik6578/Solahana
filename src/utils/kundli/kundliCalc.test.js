import { describe, expect, it } from 'vitest';
import { calculateGoal, calculateRetirement } from '../calculatorEngine.js';
import { scoreHealthCheck } from '../financialHealthCheck.js';
import { buildReport } from './kundliReport.js';
import { goalMaths, lifeModule, healthModule, retirementMaths, safePaise } from './kundliCalc.js';
import { MSG, REPORT } from './kundliCopy.js';
import { makeAnswers } from './kundliTestHelpers.js';

const report = (spec) => buildReport(makeAnswers(spec), new Date(2026, 10, 20));
const mod = (spec, id) => report(spec).modules.find((m) => m.id === id);
const figOf = (m, key) => m.figures.find((f) => f.key === key);
const texts = (m) => m.messages.map((x) => x.text);

describe('Module 1: savings and cash flow (S1-S5)', () => {
  it('S1: all three figures with rates, no A3, nothing over income', () => {
    const m = mod({ core: { income: '80000', expenses: '35000', emi: '15000', other: '12000', investments: '10000' } }, 'cashFlow');
    expect(m.status).toBe('complete');
    expect(figOf(m, 'savingsCapacity').display).toBe('₹18,000 (22.5%)');
    expect(figOf(m, 'investing').display).toBe('₹10,000 (12.5%)');
    expect(figOf(m, 'cashAfter').display).toBe('₹8,000 (10.0%)');
    expect(m.a3).toBeNull();
    expect(figOf(m, 'fullBudget').tag).toBe('INFO');
    expect(m.identity.S).toBe(m.identity.V + m.identity.C);
  });
  it('S2: investing more than what is left gives MSG-S2 (and A3 investments), not MSG-S1', () => {
    const m = mod({ core: { income: '60000', expenses: '30000', emi: '15000', other: '10000', investments: '20000' } }, 'cashFlow');
    expect(figOf(m, 'savingsCapacity').display).toBe('₹5,000 (8.3%)');
    expect(figOf(m, 'investing').display).toBe('₹20,000 (33.3%)');
    expect(figOf(m, 'cashAfter')).toBeUndefined();
    expect(texts(m)).toContain(MSG.S2('₹15,000'));
    expect(texts(m).some((t) => t.startsWith('Your spending is'))).toBe(false);
    expect(m.a3.kind).toBe('investments');
    expect(texts(m)).toContain(MSG.FB('₹75,000', '₹15,000'));
  });
  it('S3: spending above income gives MSG-S1 only; CF-3 suppressed', () => {
    const m = mod({ core: { income: '50000', expenses: '40000', emi: '15000', other: '5000', investments: '0' } }, 'cashFlow');
    expect(texts(m)).toContain(MSG.S1('₹10,000'));
    expect(figOf(m, 'savingsCapacity')).toBeUndefined();
    expect(figOf(m, 'cashAfter')).toBeUndefined();
    expect(figOf(m, 'investing').display).toBe('₹0 (0.0%)');
    expect(m.a3.kind).toBe('essentialsAndEmi');
    expect(m.status).toBe('complete');
  });
  it('S3 variant: S < 0 and V > 0 still shows only MSG-S1', () => {
    const m = mod({ core: { income: '50000', expenses: '40000', emi: '15000', other: '5000', investments: '5000' } }, 'cashFlow');
    expect(texts(m).filter((t) => t.startsWith('Your monthly investing is'))).toHaveLength(0);
  });
  it('S4: paise kept exactly; rates rounded down', () => {
    const m = mod({ core: { income: '45333.33', expenses: '20000.50', emi: '0', other: 'none', investments: '3000' } }, 'cashFlow');
    expect(figOf(m, 'savingsCapacity').display).toBe('₹25,332.83 (55.8%)');
    expect(figOf(m, 'investing').display).toBe('₹3,000 (6.6%)');
    expect(figOf(m, 'cashAfter').display).toBe('₹22,332.83 (49.2%)');
  });
  it('S5: other spending Not sure -> MSG-S3, investing still shown, module incomplete, no full budget', () => {
    const m = mod({ core: { other: 'not-sure' } }, 'cashFlow');
    expect(m.status).toBe('incomplete');
    expect(texts(m)).toContain(MSG.S3(MSG.isNotSure));
    expect(figOf(m, 'investing')).toBeDefined();
    expect(figOf(m, 'fullBudget')).toBeUndefined();
  });
});

describe('Module 2: emergency fund (E1-E5)', () => {
  it('E1: 6.8 months, EMI-inclusive 4.8 as information only', () => {
    const m = mod({ core: { expenses: '35000', savings: '240000', emi: '15000' } }, 'emergency');
    expect(figOf(m, 'runway').display).toBe('6.8');
    expect(figOf(m, 'runwayWithEmi').tag).toBe('INFO');
    expect(texts(m)).toContain(MSG.EF3('4.8'));
  });
  it('E2: 2.0 months, A1; EF-3 1.4', () => {
    const m = mod({ core: { expenses: '25000', savings: '50000', emi: '10000' } }, 'emergency');
    expect(figOf(m, 'runway').display).toBe('2.0');
    expect(m.alertA1).toBe(true);
    expect(figOf(m, 'runwayWithEmi').display).toBe('1.4 months');
  });
  it('E3: no savings -> "less than 0.1"; no EMI -> no EF-3', () => {
    const m = mod({ core: { expenses: '30000', savings: '0', emi: '0' } }, 'emergency');
    expect(texts(m)).toContain(MSG.runwayTiny);
    expect(figOf(m, 'runwayWithEmi')).toBeUndefined();
  });
  it('E4: no fixed expenses -> not applicable', () => {
    expect(mod({ core: { expenses: '0', savings: '100000', emi: '5000' } }, 'emergency').status).toBe('not-applicable');
  });
  it('E5: exactly 3 months is partial', () => {
    const m = mod({ core: { expenses: '20000', savings: '60000', emi: '0' } }, 'emergency');
    expect(figOf(m, 'runway').display).toBe('3.0');
    expect(m.points).toBe(10);
  });
});

describe('Module 3: net worth (N1-N6) and its provenance', () => {
  const N1 = { core: { savings: '200000' }, assets: { MF: '500000', FIX: '300000', RET: '800000', GOLD: '200000', HOME: '7500000' }, liabilities: { HOME: '4000000', CARD: '20000' } };
  it('N1: own home inside known assets and as its own line; NW and KA tagged CAL+EST', () => {
    const m = mod(N1, 'netWorth');
    expect(figOf(m, 'knownAssets').display).toBe('₹95,00,000');
    expect(figOf(m, 'ownHome').display).toBe('₹75,00,000');
    expect(figOf(m, 'ownHome').tag).toBe('EST');
    expect(figOf(m, 'knownLiabilities').display).toBe('₹40,20,000');
    expect(figOf(m, 'netWorth').display).toBe('₹54,80,000');
    expect(figOf(m, 'netWorth').tag).toBe('CALEST');
    expect(figOf(m, 'knownAssets').tag).toBe('CALEST');
    expect(figOf(m, 'knownLiabilities').tag).toBe('CAL');
  });
  it('N2: one Not sure -> no NW, known totals and what is needed', () => {
    const m = mod({ ...N1, assets: { ...N1.assets, GOLD: 'not-sure' } }, 'netWorth');
    expect(m.status).toBe('incomplete');
    expect(figOf(m, 'netWorth')).toBeUndefined();
    expect(figOf(m, 'knownAssets').display).toBe('₹93,00,000');
    expect(texts(m).join(' ')).toContain('Gold or jewellery (Not sure)');
  });
  it('N3: liabilities skipped -> not provided, no NW', () => {
    const m = mod({ ...N1, liabilities: 'skip' }, 'netWorth');
    expect(texts(m)).toContain(MSG.liabilitiesNotProvided);
    expect(figOf(m, 'netWorth')).toBeUndefined();
  });
  it('N4: negative net worth is said in words, never as -₹', () => {
    const m = mod({ core: { savings: '50000' }, liabilities: { LOAN: '300000' } }, 'netWorth');
    expect(texts(m)).toContain(MSG.nwNegative('₹2,50,000'));
    expect(JSON.stringify(m)).not.toContain('-₹');
  });
  it('N5: assets skipped -> only liquid savings, no NW', () => {
    const m = mod({ core: { savings: '200000' }, assets: 'skip' }, 'netWorth');
    expect(texts(m)).toContain(MSG.assetsOnlyLiquid('₹2,00,000'));
    expect(figOf(m, 'knownLiabilities').display).toBe('₹0');
    expect(m.status).toBe('incomplete');
  });
  it('N6: no estimate used -> NW tagged CAL (Fix 1)', () => {
    const m = mod({ core: { savings: '200000' }, assets: { MF: '500000', FIX: '300000', RET: '800000' }, liabilities: { CARD: '20000' } }, 'netWorth');
    expect(figOf(m, 'knownAssets').display).toBe('₹18,00,000');
    expect(figOf(m, 'netWorth').display).toBe('₹17,80,000');
    expect(figOf(m, 'netWorth').tag).toBe('CAL');
    expect(figOf(m, 'knownAssets').tag).toBe('CAL');
  });
  it('goal money is never added to net worth', () => {
    const base = { ...N1, goals: [{ cost: '500000', years: '5', saved: '100000' }], asm: { inf: '6', ret: '8' } };
    const a = mod(base, 'netWorth');
    const b = mod({ ...base, goals: [{ cost: '500000', years: '5', saved: '400000' }] }, 'netWorth');
    expect(figOf(a, 'netWorth').display).toBe(figOf(b, 'netWorth').display);
  });
});

describe('Module 4-6: debt, life, health boundaries', () => {
  it.each([
    ['80000', '15000', '18.8%', 20],
    ['100000', '30000', '30.0%', 20],
    ['100000', '45000', '45.0%', 10],
    ['100000', '45000.01', '45.1%', 0],
    ['60000', '70000', '116.7%', 0],
  ])('EMI share %s / %s -> %s', (income, emi, shown, points) => {
    const m = mod({ core: { income, emi } }, 'debt');
    expect(figOf(m, 'emiShare').display).toBe(shown);
    expect(m.points).toBe(points);
  });
  it('DE-2 adds only loans; EMI consistency notes in both directions', () => {
    const m = mod({ liabilities: { HOME: '4000000', VEH: '500000', LOAN: '150000', CARD: '20000', PEOPLE: '50000' } }, 'debt');
    expect(figOf(m, 'loans').display).toBe('₹46,50,000');
    expect(texts(mod({ core: { emi: '5000' } }, 'debt'))).toContain('You entered a monthly EMI but did not tick any loan. You can go back and check either answer.');
    expect(texts(mod({ core: { emi: '0' }, liabilities: { VEH: '100000' } }, 'debt'))).toContain('You ticked a loan but entered ₹0 as your monthly EMI. You can go back and check either answer.');
  });
  it.each([
    ['5000000', '5.2×', 10],
    ['10000000', '10.4×', 20],
    ['0', '0.0×', 0],
    ['4799999', '4.9×', 0],
    ['4800000', '5.0×', 10],
    ['9600000', '10.0×', 20],
  ])('term cover %s on ₹80,000 income -> %s', (termCover, shown, points) => {
    const m = mod({ core: { income: '80000', termCover } }, 'life');
    expect(figOf(m, 'termMultiple').display).toBe(shown);
    expect(m.points).toBe(points);
    if (termCover === '0') expect(texts(m)).toContain(MSG.noTerm);
  });
  it.each([
    ['500000', 0],
    ['1000000', 15],
    ['999999.99', 0],
  ])('health cover %s -> %s points', (healthCover, points) => {
    expect(mod({ core: { healthCover } }, 'health').points).toBe(points);
  });
  it('Fix 2: term or health cover Not sure / skipped -> incomplete, never 0', () => {
    const base = { core: { income: { status: 'entered', value: 8_000_000 } } };
    for (const status of ['not-sure', 'skipped']) {
      const life = lifeModule({ core: { ...base.core, termCover: { status, value: null } } });
      expect(life.status).toBe('incomplete');
      expect(life.figures).toHaveLength(0);
      expect(life.alertR1).toBeUndefined();
      const health = healthModule({ core: { healthCover: { status, value: null } } });
      expect(health.status).toBe('incomplete');
      expect(health.alertR2).toBeUndefined();
    }
    expect(lifeModule({ core: { ...base.core, termCover: { status: 'not-sure', value: null } } }).messages[0].text).toBe(MSG.lifeNotChecked(MSG.isNotSure));
    expect(lifeModule({ core: { ...base.core, termCover: { status: 'none', value: 0 } } }).status).toBe('complete');
    expect(lifeModule({ core: { income: { status: 'missing', value: null }, termCover: { status: 'entered', value: 100 } } }).status).toBe('incomplete');
  });
});

describe('Module 7: goals (G1-G5) and the goal-money check', () => {
  const G = (goal, asm) => mod({ goals: [goal], asm }, 'goals').goals[0];
  it.each([
    ['G1', { cost: '2000000', years: '10', saved: '200000' }, { inf: '6', ret: '10' }, ['₹35,81,696', '₹5,18,748', '₹30,62,947', '₹14,829']],
    ['G2', { cost: '500000', years: '1', saved: 'none' }, { inf: '5', ret: '8' }, ['₹5,25,000', '₹0', '₹5,25,000', '₹41,890']],
    ['G3', { cost: '300000', years: '5', saved: '500000' }, { inf: '6', ret: '7' }, ['₹4,01,468', '₹7,01,275', '₹0', '₹0']],
    ['G4', { cost: '1000000', years: '50', saved: 'none' }, { inf: '0', ret: '0.1' }, ['₹10,00,000', '₹0', '₹10,00,000', '₹1,626']],
  ])('%s figures (directional rounding)', (_, goal, asm, expected) => {
    const g = G(goal, asm);
    expect(g.figures.map((f) => f.display)).toEqual(expected);
    expect(g.figures.every((f) => f.tag === 'PRJ')).toBe(true);
  });
  it('G3: already covered -> covered message', () => {
    expect(G({ cost: '300000', years: '5', saved: '500000' }, { inf: '6', ret: '7' }).messages[0].text).toBe(MSG.goalCovered);
  });
  it('calculator parity: SIP matches calculateGoal (G1-G3); G4 differs by ₹1 only because of rounding up', () => {
    expect(calculateGoal('x', 2000000, 10, 10, 200000, 6).requiredMonthlySIP).toBe(14829);
    expect(calculateGoal('x', 500000, 1, 8, 0, 5).requiredMonthlySIP).toBe(41890);
    expect(calculateGoal('x', 1000000, 50, 0.1, 0, 0).requiredMonthlySIP).toBe(1625);
  });
  it('G5: savings grown too large to show, need 0 -> complete, savings hidden, covered message (Step 4 rule)', () => {
    const g = G({ cost: '100000', years: '50', saved: '1000000000' }, { inf: '6', ret: '30' });
    expect(g.status).toBe('complete');
    const saved = g.figures.find((f) => f.key === 'savedFuture');
    expect(saved.display).toBe(REPORT.tooLargeSavings);
    expect(saved.tag).toBeNull();
    expect(g.figures.find((f) => f.key === 'stillNeeded').display).toBe('₹0');
    expect(g.messages[0].text).toBe(MSG.goalCovered);
  });
  it('a goal with a Not sure field is incomplete on its own; others still calculate', () => {
    const m = mod({ goals: [{ cost: 'not-sure', years: '5', saved: 'none' }, { cost: '100000', years: '5', saved: 'none' }], asm: { inf: '6', ret: '8' } }, 'goals');
    expect(m.goals[0].status).toBe('incomplete');
    expect(m.goals[1].status).toBe('complete');
    expect(m.status).toBe('incomplete');
  });
  it('rates Not sure -> no goal is calculated', () => {
    const m = mod({ goals: [{ cost: '100000', years: '5', saved: 'none' }], asm: { inf: '6', ret: 'not-sure' } }, 'goals');
    expect(m.goals[0].status).toBe('incomplete');
  });
  it('GL-6: vehicles (other) never count; warning only; unknown eligible box -> could not check', () => {
    const assets = { MF: '500000', FIX: '300000', GOLD: '200000', OTHER: '400000' };
    const asm = { inf: '6', ret: '8' };
    const ok = mod({ assets, goals: [{ cost: '900000', years: '5', saved: '200000' }, { cost: '900000', years: '5', saved: '300000' }], asm }, 'goals');
    expect(ok.messages).toHaveLength(0);
    const over = mod({ assets, goals: [{ cost: '900000', years: '5', saved: '1200000' }], asm }, 'goals');
    expect(over.messages[0].text).toBe(MSG.goalCap);
    const unknown = mod({ assets: { ...assets, GOLD: 'not-sure' }, goals: [{ cost: '900000', years: '5', saved: '900000' }], asm }, 'goals');
    expect(unknown.messages[0].text).toBe(MSG.goalCapUnknown);
  });
});

describe('Module 8: retirement (R1-R14)', () => {
  const R = (ret, rs, asm) => mod({ ret, assets: rs === null ? {} : { RET: rs }, asm }, 'retirement');
  const shown = (m) => Object.fromEntries(m.figures.map((f) => [f.key, f.display]));
  it.each([
    ['R1', { age: 35, at: 60, until: 70, spend: '50000' }, '1000000', { inf: '6', ret: '10' }, ['₹2,14,594', '₹2,11,23,970', '₹1,08,34,705', '₹1,02,89,264', '₹7,691']],
    ['R2', { age: 35, at: 60, until: 65, spend: '50000' }, '1000000', { inf: '6', ret: '10' }, ['₹2,14,594', '₹1,15,37,272', '₹1,08,34,705', '₹7,02,566', '₹526']],
    ['R3', { age: 40, at: 60, until: 70, spend: '40000' }, '500000', { inf: '8', ret: '6' }, ['₹1,86,439', '₹2,48,30,788', '₹16,03,567', '₹2,32,27,220', '₹50,021']],
    ['R4', { age: 30, at: 60, until: 70, spend: '30000' }, null, { inf: '7', ret: '7' }, ['₹2,28,368', '₹2,74,04,119', '₹0', '₹2,74,04,119', '₹22,333']],
    ['R5', { age: 45, at: 60, until: 70, spend: '60000' }, '50000000', { inf: '6', ret: '10' }, ['₹1,43,794', '₹1,41,54,618', '₹20,88,62,408', '₹0', '₹0']],
    ['R6', { age: 30, at: 40, until: 65, spend: '50000' }, '1000000', { inf: '6', ret: '10' }, ['₹89,543', '₹1,71,95,098', '₹25,93,742', '₹1,46,01,355', '₹70,691']],
    ['R7', { age: 35, at: 60, until: 70, spend: '42000', source: 'fixedPlusOther' }, '1000000', { inf: '6', ret: '10' }, ['₹1,80,259', '₹1,77,44,135', '₹1,08,34,705', '₹69,09,429', '₹5,165']],
    ['R8', { age: 35, at: 60, until: 90, spend: '50000' }, '1000000', { inf: '6', ret: '10' }, ['₹2,14,594', '₹4,57,79,224', '₹1,08,34,705', '₹3,49,44,518', '₹26,120']],
    ['R9', { age: 80, at: 89, until: 90, spend: '50000' }, '1000000', { inf: '6', ret: '10' }, ['₹84,474', '₹9,76,827', '₹23,57,947', '₹0', '₹0']],
    ['R11', { age: 30, at: 65, until: 90, spend: '50000' }, '1000000', { inf: '6', ret: '10' }, ['₹3,84,305', '₹7,37,99,134', '₹2,81,02,436', '₹4,56,96,697', '₹11,937']],
  ])('%s', (_, ret, rs, asm, [monthly, corpus, fs, net, sip]) => {
    const m = R(ret, rs, asm);
    expect(m.status).toBe('complete');
    const s = shown(m);
    expect([s.monthlyAtRetirement, s.corpus, s.retSavingsFuture, s.netNeeded, s.retMonthlyNeeded]).toEqual([monthly, corpus, fs, net, sip]);
    expect(m.figures.every((f) => f.tag === 'PRJ')).toBe(true);
  });
  it('engine parity at H = 25 (R6, R11)', () => {
    const e6 = calculateRetirement(30, 40, 50000, 6, 10, 1000000);
    expect([e6.requiredCorpus, e6.netCorpusNeeded, e6.requiredMonthlySIP]).toEqual([17195097, 14601355, 70691]);
    const k6 = retirementMaths({ age: 30, at: 40, until: 65, spend: 50000, savings: 1000000, inf: 6, ret: 10 });
    expect(Math.round(k6.K)).toBe(e6.requiredCorpus);
    expect(Math.round(k6.SIP)).toBe(e6.requiredMonthlySIP);
    const e11 = calculateRetirement(30, 65, 50000, 6, 10, 1000000);
    expect(Math.round(retirementMaths({ age: 30, at: 65, until: 90, spend: 50000, savings: 1000000, inf: 6, ret: 10 }).SIP)).toBe(e11.requiredMonthlySIP);
  });
  it('R5 and R9: covered -> covered message', () => {
    expect(R({ age: 45, at: 60, until: 70, spend: '60000' }, '50000000', { inf: '6', ret: '10' }).messages[0].text).toBe(MSG.retCovered);
  });
  it('R10: need side too large -> whole section out-of-range, no amounts, no tags', () => {
    const m = R({ age: 18, at: 19, until: 90, spend: '10000000' }, null, { inf: '25', ret: '0.1' });
    expect(m.status).toBe('out-of-range');
    expect(m.figures).toHaveLength(0);
    expect(m.messages[0].text).toBe(REPORT.tooLarge);
  });
  it('R12: only the yearly spending is too large -> out-of-range (annual is guarded); R13 just fits', () => {
    expect(R({ age: 18, at: 79, until: 80, spend: '9300000' }, null, { inf: '25', ret: '30' }).status).toBe('out-of-range');
    const r13 = R({ age: 18, at: 79, until: 80, spend: '9200000' }, null, { inf: '25', ret: '30' });
    expect(r13.status).toBe('complete');
    expect(r13.figures).toHaveLength(6);
  });
  it('R14: savings grown too large, need 0 -> complete, savings hidden, covered', () => {
    const m = R({ age: 18, at: 89, until: 90, spend: '50000' }, '1000000000', { inf: '6', ret: '30' });
    expect(m.status).toBe('complete');
    const s = shown(m);
    expect(s.retSavingsFuture).toBe(REPORT.tooLargeSavings);
    expect(s.netNeeded).toBe('₹0');
    expect(s.monthlyAtRetirement).toBe('₹31,31,025');
  });
  it('retirement savings come only from the EPF/PPF/NPS box; skipped or Not sure -> incomplete', () => {
    expect(mod({ ret: { age: 35, at: 60, until: 70, spend: '50000' }, assets: 'skip', asm: { inf: '6', ret: '10' } }, 'retirement').status).toBe('incomplete');
    expect(mod({ ret: { age: 35, at: 60, until: 70, spend: '50000' }, assets: { RET: 'not-sure' }, asm: { inf: '6', ret: '10' } }, 'retirement').status).toBe('incomplete');
  });
  it('already retired -> not applicable; not now -> not chosen', () => {
    expect(mod({ retGate: 'retired' }, 'retirement').status).toBe('not-applicable');
    expect(mod({}, 'retirement').status).toBe('not-chosen');
  });
  it('a longer planning horizon never needs less', () => {
    let last = 0;
    for (let until = 61; until <= 90; until += 1) {
      const sip = retirementMaths({ age: 35, at: 60, until, spend: 50000, savings: 1000000, inf: 6, ret: 10 }).SIP;
      expect(sip).toBeGreaterThanOrEqual(last);
      last = sip;
    }
  });
});

describe('rounding and the guard', () => {
  it('normalises to paise before rounding: no spurious rupee from float noise', () => {
    expect(safePaise(500000 * 1.05)).toBe(52500000);
    expect(goalMaths({ cost: 500000, years: 1, saved: 0, inf: 5, ret: 8 }).FT).toBeCloseTo(525000, 6);
  });
  it('rejects non-finite, negative and unsafe values', () => {
    expect(safePaise(Infinity)).toBeNull();
    expect(safePaise(NaN)).toBeNull();
    expect(safePaise(-1)).toBeNull();
    expect(safePaise(Number.MAX_SAFE_INTEGER)).toBeNull();
  });
});

describe('hc-v1 score and Areas to Look At', () => {
  it('Kundli score equals the Health Check-up score for the same nine answers', () => {
    const r = report({ core: { income: '80000', expenses: '35000', emi: '15000', savings: '50000', investments: '5000', termCover: '0', healthCover: '500000' }, overlap: 'no', business: 'na' });
    const hc = scoreHealthCheck({ income: 8000000, expenses: 3500000, emi: 1500000, savings: 5000000, investments: 500000, termCover: 0, healthCover: 50000000, overlap: 'no', business: 'na' });
    expect(r.score.score).toBe(hc.score);
    expect(r.score.areas.map((x) => x.label)).toEqual(['Priority', 'Worth Reviewing', 'Worth Reviewing', 'Good Practice', 'Good Practice']);
  });
  it('A3 essentials-and-EMI comes first as Priority; investments kind is a Planning Point', () => {
    const ess = report({ core: { income: '50000', expenses: '40000', emi: '15000', investments: '0' } });
    expect(ess.score.areas[0].id).toBe('A3');
    expect(ess.score.areas[0].label).toBe('Priority');
    const inv = report({ core: { income: '60000', expenses: '30000', emi: '15000', investments: '20000' } });
    expect(inv.score.areas.find((x) => x.id === 'A3').label).toBe(REPORT.planningPoint);
  });
  it('a missing core answer -> no score and no areas, never a substituted 0', () => {
    const a = makeAnswers({});
    a.fields.termCover = { raw: '', state: '' };
    const r = buildReport(a);
    expect(r.score.status).toBe('incomplete');
    expect(r.score.text).toContain('Total term insurance cover');
  });
});

describe('completeness summary', () => {
  it('counts only chosen and applicable sections', () => {
    const r = report({ assets: 'skip' });
    expect(r.summary.total).toBe(6);
    expect(r.summary.complete).toBe(5);
    expect(r.summary.incomplete.map((x) => x.id)).toEqual(['netWorth']);
  });
  it('emergency not applicable and already retired are left out of Y', () => {
    const r = report({ core: { expenses: '0' }, retGate: 'retired' });
    expect(r.summary.total).toBe(5);
  });
});

describe('audit: a needed amount is never understated (rounding fix)', () => {
  it('rounds up from the exact value, not from a paise-rounded value', () => {
    expect(safePaise(106937.0043, 'up')).toBe(10693701); // shows ₹1,06,938, never ₹1,06,937
    expect(safePaise(106937.0043, 'down')).toBe(10693700);
    expect(safePaise(500000 * 1.05, 'up')).toBe(52500000); // float noise still ignored: no spurious rupee
    expect(safePaise(500000 * 1.05, 'down')).toBe(52500000);
  });
  it('investing the shown monthly amount at the start of every month always reaches the goal (simulated, 3,000 goals)', () => {
    let seed = 99;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648), seed / 2147483648);
    const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    for (let i = 0; i < 3000; i += 1) {
      const g = { cost: int(1, 1e8), years: int(1, 50), saved: rnd() < 0.3 ? 0 : int(0, 5e7), inf: int(0, 250) / 10, ret: int(1, 300) / 10 };
      const m = goalMaths(g);
      if (m.N === 0) continue;
      const shownRupees = Math.ceil(safePaise(m.SIP, 'up') / 100);
      let acc = 0;
      for (let k = 0; k < g.years * 12; k += 1) acc = (acc + shownRupees) * (1 + g.ret / 1200);
      expect(acc, JSON.stringify(g)).toBeGreaterThanOrEqual(m.N * (1 - 1e-12));
    }
  });
  it('the retirement corpus pays every year of rising spending until the chosen age (simulated)', () => {
    for (const [age, at, until, inf, ret] of [[35, 60, 70, 6, 10], [30, 40, 90, 8, 6], [50, 55, 56, 7, 7], [18, 60, 90, 0, 0.1]]) {
      const m = retirementMaths({ age, at, until, spend: 50000, savings: 0, inf, ret });
      let bal = m.K;
      let w = m.annual;
      for (let t = 1; t <= until - at; t += 1) {
        w *= 1 + inf / 100;
        bal = bal * (1 + ret / 100) - w;
      }
      expect(Math.abs(bal)).toBeLessThan(Math.max(1, m.K * 1e-9));
    }
  });
});
