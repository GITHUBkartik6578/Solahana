import { ASSETS, ASSUMPTIONS, CORE_CHOICES, CORE_FIELDS, GOALS, LIABILITIES, RETIREMENT } from '../../utils/kundli/kundliCopy';

/** DOM id for an answer path key such as "assets.MF" or "goal.g1.cost" (used by fields and the error summary links). */
export const fid = (key) => `k-${key.replace(/[^a-zA-Z0-9]+/g, '-')}`;

/** The question an error belongs to, for the error summary ("Monthly EMI: Enter an amount, or 0 if none."). */
export function errorLabel(key, a) {
  const [head, second, third] = key.split('.');
  if (CORE_FIELDS[key]) return CORE_FIELDS[key].label;
  if (CORE_CHOICES[key]) return CORE_CHOICES[key].label;
  if (head === 'assets') return second === 'confirm' ? ASSETS.heading : ASSETS.items[second]?.amountLabel;
  if (head === 'liabilities') return second === 'confirm' ? LIABILITIES.heading : LIABILITIES.items[second]?.amountLabel;
  if (key === 'goalsGate') return GOALS.gate;
  if (head === 'goal') {
    const n = a.goals.findIndex((g) => g.id === second) + 1;
    const labels = { type: GOALS.type, name: GOALS.name, cost: GOALS.cost, years: GOALS.years, saved: GOALS.saved };
    return `${GOALS.goalHeading(n)}: ${labels[third]}`;
  }
  if (key === 'retGate') return RETIREMENT.gate;
  if (head === 'ret') return { age: RETIREMENT.age, at: RETIREMENT.at, until: RETIREMENT.until, spend: RETIREMENT.spend }[second];
  if (head === 'asm') return second === 'inf' ? ASSUMPTIONS.inf : ASSUMPTIONS.ret;
  return '';
}
