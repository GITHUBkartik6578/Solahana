import { describe, expect, it } from 'vitest';
import { DIAGNOSTIC_QUESTIONS, evaluateDiagnostic, findOption } from './healthDiagnostic';

describe('DIAGNOSTIC_QUESTIONS', () => {
  it('has the three approved questions, word for word', () => {
    expect(DIAGNOSTIC_QUESTIONS.map((q) => q.text)).toEqual([
      'Kya aapke paas pure Term Insurance cover hai jo aapke annual income ka kam se kam 10x ho?',
      'Aapka investment portfolio (Mutual Funds / Equities) market inflation ke hisaab se kitni baar review hota hai?',
      'Business owners: Kya aapke personal assets business liabilities se protected hain?',
    ]);
  });
});

describe('evaluateDiagnostic', () => {
  it('marks all-aligned answers as aligned', () => {
    const r = evaluateDiagnostic({ term: 'yes', review: 'regular', business: 'yes' });
    expect(r.aligned).toBe(3);
    expect(r.review).toBe(0);
  });
  it('flags "no", "unsure", "rare" and "never" for review', () => {
    const r = evaluateDiagnostic({ term: 'unsure', review: 'never', business: 'no' });
    expect(r.review).toBe(3);
    expect(r.items.every((i) => i.note.length > 0)).toBe(true);
  });
  it('treats "not a business owner" as not applicable, not as a problem', () => {
    const r = evaluateDiagnostic({ term: 'yes', review: 'regular', business: 'na' });
    expect(r.items[2].status).toBe('na');
    expect(r.review).toBe(0);
    expect(r.aligned).toBe(2);
  });
  it('throws on missing or unknown answers', () => {
    expect(() => evaluateDiagnostic({ term: 'yes', review: 'regular' })).toThrow();
    expect(() => evaluateDiagnostic({ term: 'maybe', review: 'regular', business: 'yes' })).toThrow();
    expect(() => evaluateDiagnostic()).toThrow();
  });
});

describe('findOption', () => {
  it('only accepts options offered for that question', () => {
    expect(findOption('term', 'yes')).toBeTruthy();
    expect(findOption('term', 'na')).toBeUndefined();
    expect(findOption('nope', 'yes')).toBeUndefined();
  });
});
