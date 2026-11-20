/**
 * Test helpers only (imported by *.test.js files, never by the app): build a Financial Kundli answer object from short
 * descriptions. Amount strings are typed exactly as a customer would type them.
 */
import { emptyAnswers } from './kundliInputs.js';

const typed = (raw) => ({ raw: String(raw), state: '' });
const asState = (v) => (v === 'none' ? { raw: '', state: 'none' } : v === 'not-sure' ? { raw: '', state: 'not-sure' } : typed(v));

/**
 * core: { income, expenses, emi, other, savings, investments, termCover, healthCover } (strings, or 'none' / 'not-sure')
 * assets / liabilities: 'skip' | { KEY: amount | 'not-sure' } (confirmed); omitted = confirmed with nothing ticked
 * goals: [{ type, name, cost, years, saved }] ; ret: { age, at, until, spend, source } ; asm: { inf, ret }
 */
export function makeAnswers({ core = {}, overlap = 'yes', business = 'yes', assets = {}, liabilities = {}, goals = null, ret = null, retGate = null, asm = null } = {}) {
  const a = emptyAnswers();
  const defaults = { income: '80000', expenses: '35000', emi: '15000', other: '12000', savings: '240000', investments: '10000', termCover: '10000000', healthCover: '1000000' };
  Object.entries({ ...defaults, ...core }).forEach(([k, v]) => {
    a.fields[k] = asState(v);
  });
  a.overlap = overlap;
  a.business = business;
  const fill = (list, spec) => {
    if (spec === 'skip') {
      list.skipped = true;
      return;
    }
    list.confirmed = true;
    Object.entries(spec).forEach(([k, v]) => {
      list.ticked[k] = true;
      list.amounts[k] = asState(v);
    });
  };
  fill(a.assets, assets);
  fill(a.liabilities, liabilities);
  if (goals) {
    a.goalsGate = 'yes';
    a.goals = goals.map((g, i) => ({ id: `t${i + 1}`, type: g.type || 'education', name: g.name || '', cost: asState(g.cost), years: asState(g.years), saved: asState(g.saved) }));
  } else a.goalsGate = 'no';
  if (ret) {
    a.retGate = 'yes';
    a.ret = { age: typed(ret.age), at: typed(ret.at), until: typed(ret.until), spend: { ...asState(ret.spend), source: ret.source || 'typed' } };
  } else a.retGate = retGate || 'no';
  if (asm) a.asm = { inf: asState(asm.inf), ret: asState(asm.ret) };
  return a;
}
