import { describe, expect, it } from 'vitest';
import { diagnosticAnswersSchema, hlvInputsSchema } from './chatDiagnosticValidation.js';

const validHlv = { monthlyExpenses: 50000, liabilities: 2000000, existingCover: 5000000, years: 10 };
const messages = (r) => r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);

describe('hlvInputsSchema', () => {
  it('recomputes need and gap on the server', () => {
    const r = hlvInputsSchema.safeParse(validHlv);
    expect(r.success).toBe(true);
    expect(r.data.need).toBe(8_000_000);
    expect(r.data.gap).toBe(3_000_000);
    expect(r.data.inputs).toEqual(validHlv);
  });
  it('floors the gap at zero when cover exceeds need', () => {
    const r = hlvInputsSchema.safeParse({ ...validHlv, existingCover: 99_000_000 });
    expect(r.data.gap).toBe(0);
  });
  it('accepts values exactly at the limits', () => {
    expect(hlvInputsSchema.safeParse({ monthlyExpenses: 1_000_000, liabilities: 1e9, existingCover: 1e9, years: 40 }).success).toBe(true);
    expect(hlvInputsSchema.safeParse({ monthlyExpenses: 1, liabilities: 0, existingCover: 0, years: 1 }).success).toBe(true);
  });
  it('rejects values just past each limit, naming the field', () => {
    const cases = [
      [{ monthlyExpenses: 1_000_001 }, 'monthlyExpenses'],
      [{ monthlyExpenses: 0 }, 'monthlyExpenses'],
      [{ liabilities: 1e9 + 1 }, 'liabilities'],
      [{ liabilities: -1 }, 'liabilities'],
      [{ existingCover: 1e9 + 1 }, 'existingCover'],
      [{ existingCover: -1 }, 'existingCover'],
      [{ years: 41 }, 'years'],
      [{ years: 0 }, 'years'],
      [{ years: 2.5 }, 'years'],
    ];
    cases.forEach(([patch, field]) => {
      const r = hlvInputsSchema.safeParse({ ...validHlv, ...patch });
      expect(r.success).toBe(false);
      expect(messages(r).some((m) => m.startsWith(`${field}:`))).toBe(true);
    });
  });
  it('rejects strings, null, NaN and Infinity instead of coercing them', () => {
    ['50000', null, NaN, Infinity, true, {}, []].forEach((bad) => {
      expect(hlvInputsSchema.safeParse({ ...validHlv, monthlyExpenses: bad }).success).toBe(false);
    });
  });
  it('rejects missing fields and non-object bodies', () => {
    const { years, ...rest } = validHlv;
    expect(years).toBe(10);
    expect(hlvInputsSchema.safeParse(rest).success).toBe(false);
    [null, undefined, 'x', 5, []].forEach((bad) => expect(hlvInputsSchema.safeParse(bad).success).toBe(false));
  });
  it('rejects unknown keys, including a client-sent result', () => {
    expect(hlvInputsSchema.safeParse({ ...validHlv, gap: 0 }).success).toBe(false);
    expect(hlvInputsSchema.safeParse({ ...validHlv, $where: '1' }).success).toBe(false);
  });
});

describe('hlvInputsSchema regression cases', () => {
  it('rejects a "__proto__" key arriving through JSON.parse, and does not pollute Object.prototype', () => {
    const body = JSON.parse('{"monthlyExpenses":50000,"liabilities":0,"existingCover":0,"years":10,"__proto__":{"polluted":true}}');
    const r = hlvInputsSchema.safeParse(body);
    expect(r.success).toBe(false);
    expect(r.error.issues.some((i) => i.code === 'unrecognized_keys')).toBe(true);
    expect({}.polluted).toBeUndefined();
  });
  it('rejects "constructor" and "prototype" keys too', () => {
    expect(hlvInputsSchema.safeParse({ ...validHlv, constructor: {} }).success).toBe(false);
    expect(hlvInputsSchema.safeParse({ ...validHlv, prototype: {} }).success).toBe(false);
  });
  it('rejects numeric strings, booleans, null and arrays for every field', () => {
    ['monthlyExpenses', 'liabilities', 'existingCover', 'years'].forEach((field) => {
      ['10', true, null, [10]].forEach((v) => expect(hlvInputsSchema.safeParse({ ...validHlv, [field]: v }).success).toBe(false));
    });
  });
  it('allows up to 2 decimal places and rejects more', () => {
    expect(hlvInputsSchema.safeParse({ ...validHlv, monthlyExpenses: 50000.25 }).success).toBe(true);
    const r = hlvInputsSchema.safeParse({ ...validHlv, monthlyExpenses: 50000.123456789 });
    expect(r.success).toBe(false);
    expect(messages(r).some((m) => m.startsWith('monthlyExpenses:') && /decimal/.test(m))).toBe(true);
  });
  it('normalises negative zero to 0 in the parsed inputs', () => {
    const body = JSON.parse('{"monthlyExpenses":50000,"liabilities":-0,"existingCover":-0,"years":10}');
    const r = hlvInputsSchema.safeParse(body);
    expect(r.success).toBe(true);
    expect(Object.is(r.data.inputs.liabilities, 0)).toBe(true);
    expect(Object.is(r.data.inputs.existingCover, 0)).toBe(true);
    expect(r.data.need).toBe(6_000_000);
    expect(r.data.gap).toBe(6_000_000);
  });
  it('rejects zero or negative-zero monthly expenses', () => {
    expect(hlvInputsSchema.safeParse({ ...validHlv, monthlyExpenses: 0 }).success).toBe(false);
    expect(hlvInputsSchema.safeParse({ ...validHlv, monthlyExpenses: -0 }).success).toBe(false);
  });
  it('rejects years that are not whole numbers, such as 10.0000001', () => {
    expect(hlvInputsSchema.safeParse({ ...validHlv, years: 10.0000001 }).success).toBe(false);
  });
});

describe('diagnosticAnswersSchema regression cases', () => {
  it('rejects a "__proto__" key arriving through JSON.parse', () => {
    const body = JSON.parse('{"term":"yes","review":"regular","business":"yes","__proto__":{"polluted":true}}');
    expect(diagnosticAnswersSchema.safeParse(body).success).toBe(false);
    expect({}.polluted).toBeUndefined();
  });
});

describe('diagnosticAnswersSchema', () => {
  const ok = { term: 'yes', review: 'regular', business: 'na' };
  it('accepts a full set of offered answers and evaluates them', () => {
    const r = diagnosticAnswersSchema.safeParse(ok);
    expect(r.success).toBe(true);
    expect(r.data.answers).toEqual(ok);
    expect(r.data.result.aligned).toBe(2);
    expect(r.data.result.review).toBe(0);
    expect(r.data.result.items[2].status).toBe('na');
  });
  it('flags review items for non-aligned answers', () => {
    const r = diagnosticAnswersSchema.safeParse({ term: 'no', review: 'never', business: 'unsure' });
    expect(r.data.result.review).toBe(3);
  });
  it('rejects an option that exists for another question', () => {
    expect(diagnosticAnswersSchema.safeParse({ ...ok, term: 'na' }).success).toBe(false);
    expect(diagnosticAnswersSchema.safeParse({ ...ok, review: 'yes' }).success).toBe(false);
  });
  it('rejects made-up, empty, wrongly-cased and non-string values', () => {
    ['maybe', '', 'YES', 1, null, ['yes'], { $ne: '' }].forEach((bad) => {
      expect(diagnosticAnswersSchema.safeParse({ ...ok, term: bad }).success).toBe(false);
    });
  });
  it('rejects missing questions, unknown keys and non-object bodies', () => {
    expect(diagnosticAnswersSchema.safeParse({ term: 'yes', review: 'regular' }).success).toBe(false);
    expect(diagnosticAnswersSchema.safeParse({ ...ok, extra: 'x' }).success).toBe(false);
    [null, undefined, 'x', []].forEach((bad) => expect(diagnosticAnswersSchema.safeParse(bad).success).toBe(false));
  });
});
