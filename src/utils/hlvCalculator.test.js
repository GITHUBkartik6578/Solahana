import { describe, expect, it } from 'vitest';
import { calculateHlv, formatInr, formatInrExact, formatRupees, parseAmount, parseYears, validateHlvInputs, wasAmountRounded } from './hlvCalculator';

describe('parseAmount', () => {
  it('parses plain numbers, commas and rupee signs', () => {
    expect(parseAmount('45000')).toBe(45000);
    expect(parseAmount('₹45,000')).toBe(45000);
    expect(parseAmount('Rs. 1,00,000')).toBe(100000);
  });
  it('parses k, lakh and crore', () => {
    expect(parseAmount('50k')).toBe(50000);
    expect(parseAmount('1.5 lakh')).toBe(150000);
    expect(parseAmount('2cr')).toBe(20000000);
  });
  it('rejects junk and negatives', () => {
    expect(parseAmount('abc')).toBeNaN();
    expect(parseAmount('-5')).toBeNaN();
    expect(parseAmount('')).toBeNaN();
    expect(parseAmount('5 bananas')).toBeNaN();
  });
});

describe('calculateHlv', () => {
  it('applies need = expenses x 12 x years + liabilities', () => {
    const r = calculateHlv({ monthlyExpenses: 50000, liabilities: 2000000, existingCover: 5000000, years: 10 });
    expect(r.need).toBe(50000 * 12 * 10 + 2000000); // 8,000,000
    expect(r.gap).toBe(3000000);
    expect(r.covered).toBe(false);
  });
  it('defaults to 10 years', () => {
    expect(calculateHlv({ monthlyExpenses: 10000 }).need).toBe(1200000);
  });
  it('never returns a negative gap', () => {
    const r = calculateHlv({ monthlyExpenses: 10000, existingCover: 99999999, years: 10 });
    expect(r.gap).toBe(0);
    expect(r.covered).toBe(true);
  });
});

describe('validateHlvInputs', () => {
  const base = { monthlyExpenses: 50000, liabilities: 0, existingCover: 0, years: 10 };
  it('accepts values at the limits', () => {
    expect(validateHlvInputs({ ...base, monthlyExpenses: 1000000, liabilities: 1e9, existingCover: 1e9, years: 40 }).ok).toBe(true);
    expect(validateHlvInputs({ ...base, years: 1 }).ok).toBe(true);
  });
  it('rejects values past the limits', () => {
    expect(validateHlvInputs({ ...base, monthlyExpenses: 1000001 }).errors.monthlyExpenses).toBeTruthy();
    expect(validateHlvInputs({ ...base, liabilities: 1e9 + 1 }).errors.liabilities).toBeTruthy();
    expect(validateHlvInputs({ ...base, existingCover: 1e9 + 1 }).errors.existingCover).toBeTruthy();
    expect(validateHlvInputs({ ...base, years: 41 }).errors.years).toBeTruthy();
    expect(validateHlvInputs({ ...base, years: 0 }).errors.years).toBeTruthy();
  });
  it('rejects zero expenses, negatives, fractions and NaN', () => {
    expect(validateHlvInputs({ ...base, monthlyExpenses: 0 }).ok).toBe(false);
    expect(validateHlvInputs({ ...base, liabilities: -1 }).ok).toBe(false);
    expect(validateHlvInputs({ ...base, years: 2.5 }).ok).toBe(false);
    expect(validateHlvInputs({ ...base, monthlyExpenses: NaN }).ok).toBe(false);
  });
  it('makes calculateHlv throw on invalid input', () => {
    expect(() => calculateHlv({ ...base, years: 99 })).toThrow();
  });
});

describe('formatInr', () => {
  it('formats in Indian units', () => {
    expect(formatInr(12500000)).toBe('₹1.25 crore');
    expect(formatInr(4500000)).toBe('₹45 lakh');
    expect(formatInr(0)).toBe('₹0');
  });
});

describe('parseAmount rounding (floating-point edge cases)', () => {
  it('removes floating-point residue', () => {
    expect(parseAmount('1.1 lakh')).toBe(110000);
    expect(parseAmount('2.3 lakh')).toBe(230000);
    expect(parseAmount('0.7 cr')).toBe(7000000);
    expect(parseAmount('1.15 cr')).toBe(11500000);
    expect(parseAmount('4.35 lakh')).toBe(435000);
  });
  it('rounds to two decimal places', () => {
    expect(parseAmount('100.456')).toBe(100.46);
    expect(parseAmount('100.001')).toBe(100);
    expect(parseAmount(100.456)).toBe(100.46);
  });
  it('keeps the limit boundaries exact', () => {
    expect(parseAmount('10 lakh')).toBe(1_000_000);
    expect(parseAmount('100 cr')).toBe(1_000_000_000);
    expect(validateHlvInputs({ monthlyExpenses: parseAmount('10 lakh') }).ok).toBe(true);
    expect(validateHlvInputs({ monthlyExpenses: 1, liabilities: parseAmount('100 cr') }).ok).toBe(true);
  });
  it('still returns NaN for junk, and never a negative from text', () => {
    ['', 'abc', '-5', '1e3', '0x10', '5 hrs', '1.2.3', '12 lakh crore'].forEach((t) => expect(parseAmount(t)).toBeNaN());
    expect(parseAmount(NaN)).toBeNaN();
    expect(parseAmount(Infinity)).toBeNaN();
  });
});

describe('parseYears', () => {
  it('accepts plain whole-number digits', () => {
    expect(parseYears('10')).toBe(10);
    expect(parseYears(' 7 ')).toBe(7);
    expect(parseYears('40')).toBe(40);
    expect(parseYears('010')).toBe(10);
  });
  it('rejects hex, exponent, units, decimals, signs and empties', () => {
    ['0x10', '1e1', '10 years', '10y', '2.5', '-3', '+3', '', '  ', 'ten', '1 0', '1,0', '१०', null, undefined].forEach((t) =>
      expect(parseYears(t)).toBeNaN());
  });
  it('leaves the 1-40 range to validateHlvInputs', () => {
    expect(parseYears('41')).toBe(41);
    expect(validateHlvInputs({ monthlyExpenses: 1, years: parseYears('41') }).errors.years).toBeTruthy();
    expect(validateHlvInputs({ monthlyExpenses: 1, years: parseYears('0') }).errors.years).toBeTruthy();
  });
});

describe('validateHlvInputs is strict about types', () => {
  const base = { monthlyExpenses: 50000, liabilities: 0, existingCover: 0, years: 10 };
  const bad = [true, false, null, [], [5], '50000', '', {}, NaN, Infinity, -Infinity];
  it('rejects non-numbers for every field instead of coercing them', () => {
    ['monthlyExpenses', 'liabilities', 'existingCover', 'years'].forEach((field) => {
      bad.forEach((v) => {
        const r = validateHlvInputs({ ...base, [field]: v });
        expect(r.ok, `${field}=${JSON.stringify(v)}`).toBe(false);
        expect(r.errors[field]).toBeTruthy();
      });
    });
  });
  it('rejects a non-object input without throwing', () => {
    [null, undefined, 'x', 5, []].forEach((v) => expect(validateHlvInputs(v).ok).toBe(false));
  });
  it('still defaults only an omitted liabilities, cover and years', () => {
    const r = validateHlvInputs({ monthlyExpenses: 1000 });
    expect(r.ok).toBe(true);
    expect(r.values).toEqual({ monthlyExpenses: 1000, liabilities: 0, existingCover: 0, years: 10 });
    expect(validateHlvInputs({ monthlyExpenses: 1000, years: undefined }).ok).toBe(true);
  });
  it('requires expenses (no default)', () => {
    expect(validateHlvInputs({}).errors.monthlyExpenses).toBeTruthy();
  });
});

describe('fractional rupees and negative zero', () => {
  const base = { monthlyExpenses: 50000, liabilities: 0, existingCover: 0, years: 10 };
  it('allows up to 2 decimal places, including values with floating-point noise', () => {
    expect(validateHlvInputs({ ...base, monthlyExpenses: 50000.5 }).ok).toBe(true);
    expect(validateHlvInputs({ ...base, monthlyExpenses: 50000.25 }).ok).toBe(true);
    expect(validateHlvInputs({ ...base, monthlyExpenses: 110000.00000000001 }).ok).toBe(true);
    expect(validateHlvInputs({ ...base, monthlyExpenses: 0.01 }).ok).toBe(true);
  });
  it('rejects more than 2 decimal places and sub-paise expenses', () => {
    expect(validateHlvInputs({ ...base, monthlyExpenses: 50000.123 }).errors.monthlyExpenses).toMatch(/decimal/);
    expect(validateHlvInputs({ ...base, liabilities: 1.005 }).errors.liabilities).toMatch(/decimal/);
    expect(validateHlvInputs({ ...base, existingCover: 10.999 }).errors.existingCover).toMatch(/decimal/);
    expect(validateHlvInputs({ ...base, monthlyExpenses: 0.001 }).ok).toBe(false);
  });
  it('treats negative zero as zero for liabilities and cover, never as valid expenses', () => {
    const r = validateHlvInputs({ ...base, liabilities: -0, existingCover: -0 });
    expect(r.ok).toBe(true);
    expect(Object.is(r.values.liabilities, 0)).toBe(true);
    expect(Object.is(r.values.existingCover, 0)).toBe(true);
    expect(validateHlvInputs({ ...base, monthlyExpenses: -0 }).ok).toBe(false);
    const calc = calculateHlv({ ...base, liabilities: -0, existingCover: -0 });
    expect(Object.is(calc.liabilities, 0)).toBe(true);
    expect(calc.gap).toBe(6_000_000);
    expect(Object.is(calc.need - calc.gap, 0)).toBe(true);
  });
});

describe('wasAmountRounded', () => {
  it('is true only when more than 2 decimal places were rounded away', () => {
    expect(wasAmountRounded('50000.126')).toBe(true);
    expect(wasAmountRounded('50000.123456789')).toBe(true);
    expect(wasAmountRounded('100.001')).toBe(true);
    expect(wasAmountRounded('1.234567 cr')).toBe(false); // 12,345,670 exactly
    expect(wasAmountRounded('0.0000001 cr')).toBe(false); // exactly 1 rupee
    expect(wasAmountRounded('1.00000001 lakh')).toBe(true); // 100,000.001 rupees
  });
  it('is false for whole rupees, up to 2 decimals, and unit amounts with only floating-point residue', () => {
    ['50000', '50,000', '₹45,000', '50000.5', '50000.25', '1.1 lakh', '2.3 lakh', '4.35 lakh', '0.7 cr', '1.5 lakh', '2cr', '50k'].forEach((t) =>
      expect(wasAmountRounded(t), t).toBe(false));
  });
  it('is false for junk and for 0', () => {
    ['', 'abc', '-5', '1e3', null, undefined, NaN, '0'].forEach((t) => expect(wasAmountRounded(t)).toBe(false));
  });
  it('agrees with parseAmount: the note is shown exactly when the accepted value differs from the typed number', () => {
    expect(parseAmount('50000.126')).toBe(50000.13);
    expect(parseAmount('50000.124')).toBe(50000.12);
    expect(wasAmountRounded('50000.124')).toBe(true);
  });
});

describe('formatRupees and formatInrExact', () => {
  it('shows exact rupees with Indian grouping and up to 2 decimals', () => {
    expect(formatRupees(50000.13)).toBe('₹50,000.13');
    expect(formatRupees(50000)).toBe('₹50,000');
    expect(formatRupees(6000015.6)).toBe('₹60,00,015.6');
    expect(formatRupees(6000015.600000001)).toBe('₹60,00,015.6');
  });
  it('keeps the short lakh/crore form for whole rupees (unchanged display)', () => {
    expect(formatInrExact(4500000)).toBe(formatInr(4500000));
    expect(formatInrExact(12500000)).toBe('₹1.25 crore');
    expect(formatInrExact(0)).toBe('₹0');
  });
  it('shows exact figures when the amount has paise, so the display matches the calculation', () => {
    expect(formatInrExact(50000.13)).toBe('₹50,000.13');
    expect(formatInr(50000.13)).toBe('₹50,000'); // the old short form would have hidden the paise
    const r = calculateHlv({ monthlyExpenses: 50000.13, liabilities: 0, existingCover: 0, years: 10 });
    expect(formatInrExact(r.need)).toBe('₹60,00,015.6');
  });
});
