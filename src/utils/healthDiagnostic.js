/**
 * Financial Health Diagnostic: a three-question self-check. Pure data and logic, no network, no storage.
 * It only sorts the person's own answers into "looks aligned" and "worth a closer look".
 * It gives no score, no product advice and no promise of any outcome.
 */

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'term',
    text: 'Kya aapke paas pure Term Insurance cover hai jo aapke annual income ka kam se kam 10x ho?',
    options: [
      { label: 'Haan', value: 'yes' },
      { label: 'Nahi', value: 'no' },
      { label: 'Pata nahi', value: 'unsure' },
    ],
    aligned: ['yes'],
    alignedNote: 'You say your pure term cover is at least 10x your annual income.',
    reviewNote: 'You did not confirm this level of cover. The 10x figure is a commonly cited rule of thumb, and the right amount depends on each family’s circumstances. You may wish to discuss it with a financial planner.',
  },
  {
    id: 'review',
    text: 'Aapka investment portfolio (Mutual Funds / Equities) market inflation ke hisaab se kitni baar review hota hai?',
    options: [
      { label: 'Saal mein 1-2 baar', value: 'regular' },
      { label: 'Kabhi kabhi, fixed nahi', value: 'rare' },
      { label: 'Kabhi nahi', value: 'never' },
    ],
    aligned: ['regular'],
    alignedNote: 'You review your portfolio once or twice a year.',
    reviewNote: 'You do not review your portfolio on a regular schedule. A periodic review is one way to check that it still fits your goals as prices and markets change. You may wish to discuss this with a financial planner.',
  },
  {
    id: 'business',
    text: 'Business owners: Kya aapke personal assets business liabilities se protected hain?',
    options: [
      { label: 'Haan', value: 'yes' },
      { label: 'Nahi', value: 'no' },
      { label: 'Pata nahi', value: 'unsure' },
      { label: 'Main business owner nahi hoon', value: 'na' },
    ],
    aligned: ['yes'],
    notApplicable: ['na'],
    alignedNote: 'You say your personal assets are protected from business liabilities.',
    reviewNote: 'Whether personal assets are separate from business liabilities depends on the business structure and any personal guarantees given. You may wish to discuss this with a qualified professional.',
  },
];

export const DIAGNOSTIC_DISCLAIMER =
  'This is a general self-check based only on your three answers. It is not a score, a financial plan or advice, and it does not predict any outcome. Your answers are not saved or sent anywhere. Please speak to a qualified professional before making any financial decision.';

/** Finds the option for an answer value, or undefined when the value is not offered for that question. */
export function findOption(questionId, value) {
  const q = DIAGNOSTIC_QUESTIONS.find((x) => x.id === questionId);
  return q?.options.find((o) => o.value === value);
}

/**
 * answers: { term, review, business } with each value one of that question's option values.
 * Returns one entry per question with status 'aligned' | 'review' | 'na', plus the counts.
 * Throws when an answer is missing or not an offered option.
 */
export function evaluateDiagnostic(answers) {
  const items = DIAGNOSTIC_QUESTIONS.map((q) => {
    const value = answers?.[q.id];
    if (!findOption(q.id, value)) throw new Error(`Invalid or missing answer for "${q.id}".`);
    let status = 'review';
    if (q.notApplicable?.includes(value)) status = 'na';
    else if (q.aligned.includes(value)) status = 'aligned';
    return { id: q.id, status, note: status === 'aligned' ? q.alignedNote : status === 'review' ? q.reviewNote : '' };
  });
  return {
    items,
    aligned: items.filter((i) => i.status === 'aligned').length,
    review: items.filter((i) => i.status === 'review').length,
  };
}
