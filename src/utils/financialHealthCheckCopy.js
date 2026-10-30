/**
 * All user-facing wording of the Solahana Financial Health Check-up, in one place so it can be reviewed and tested
 * without rendering the component. The consent wording itself lives in financialHealthCheck.js (CONSENT_TEXTS), next to
 * the version the server accepts.
 *
 * Wording marked "approved" is copied from the approved specification. Strings under NEW_MICROCOPY are not in that
 * specification and wait for approval.
 */
import { CATEGORY_MAX } from './financialHealthCheck.js';

export const HEADER = Object.freeze({
  eyebrow: 'Free · About 3 minutes',
  title: 'Solahana Financial Health Check-up',
  subtitle:
    "Answer three short steps about your income, protection and investing. You'll get a score out of 100 and a plain-language breakdown, with no contact details needed.",
});

export const STEPS = Object.freeze([
  { id: 'income', label: 'Step 1 of 3: Income & expenses' },
  { id: 'protection', label: 'Step 2 of 3: Financial protection' },
  { id: 'investing', label: 'Step 3 of 3: Investing & financial discipline' },
]);

export const BUTTONS = Object.freeze({ next: 'Continue', back: 'Back', result: 'See my result' });

// Field names and help texts (approved)
export const FIELDS = Object.freeze({
  income: {
    label: 'Monthly in-hand income',
    help: 'The money credited to you each month after tax and deductions. If your income varies, use the average of the last 6 to 12 months.',
  },
  expenses: {
    label: 'Monthly fixed expenses',
    help: 'Regular monthly costs such as rent, utilities, groceries, school fees and insurance premiums. Do not include your EMIs; they are asked separately. Enter 0 if you have none.',
  },
  emi: {
    label: 'Monthly EMI',
    help: 'The total of all loan instalments you pay each month. Enter 0 if you have none.',
  },
  savings: {
    label: 'Liquid savings',
    help: 'Money you could reach within a few days without losing your principal: savings and current account balances, liquid funds and fixed deposits you can break. Leave out retirement accounts (EPF, PPF, NPS), property, gold, shares and money set aside for a specific goal.',
  },
  termCover: {
    label: 'Total term insurance cover',
    help: 'The combined sum assured of all pure term life policies on your life.',
  },
  healthCover: {
    label: 'Family health insurance cover',
    help: 'The largest amount that could be claimed for one hospital stay in a year, from your base policy plus any top-up or super top-up. For a family floater, enter its sum insured once; do not multiply it by the number of family members. For separate individual policies, enter the highest sum insured among them. Employer cover usually ends when you change jobs, so include it only if you expect to keep it; this check cannot tell, so the choice is yours.',
  },
  investments: {
    label: 'Monthly investments / SIPs',
    help: 'The total you choose to invest each month, for example mutual fund SIPs, recurring investments and regular contributions to PPF or NPS. If you invest yearly or irregularly, divide the yearly total by 12. Leave out EMIs, insurance premiums and contributions deducted automatically from your salary.',
  },
});

export const CHOICES = Object.freeze({
  overlap: {
    label: 'Annual overlap audit',
    help: 'Choose Yes only if, in the last 12 months, all your investments across every agent, platform and advisor were reviewed together by one person to check for repeated holdings and to confirm the mix still fits your goals.',
    options: [
      { value: 'yes', label: 'Yes, my whole portfolio was reviewed together in the last 12 months' },
      { value: 'no', label: 'No, or my investments are spread across multiple agents with no combined review' },
    ],
  },
  business: {
    label: 'Business shielding',
    help: 'If you own, co-own or run a business, or work as a self-employed professional: have you taken steps to keep personal assets (home, savings, your family\'s security) protected from business risks, for example through a suitable legal structure or by keeping business and personal finances separate? If you are not sure, choose No / Not sure.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No or not sure' },
      { value: 'na', label: "Not applicable: I don't own a business" },
    ],
  },
});

// Category names, taken from the approved observation and normalization wording
export const CATEGORY_LABELS = Object.freeze({
  emi: 'EMI',
  term: 'Term cover',
  emergency: 'Emergency fund',
  investment: 'Investment rate',
  health: 'Health cover',
  overlap: 'Overlap audit',
  shielding: 'Business asset shielding',
});

// Approved observations. For investment and emergency the specification abbreviates the partial and zero sentences with
// "..."; they are completed here on the pattern of the full sentence.
const OBSERVATIONS = Object.freeze({
  emi: {
    full: 'Your EMIs are within 30% of your take-home income, a level often treated as comfortable.',
    partial: 'Your EMIs take 30% to 45% of your income, which leaves less room for savings and surprises.',
    zero: 'Your EMIs are above 45% of your income. A high repayment load can strain monthly cash flow; your loan terms decide what options exist.',
  },
  term: {
    full: 'Your term cover is at least 10 times your annual income, a commonly used rule of thumb.',
    partial: 'Your term cover is 5 to 10 times your annual income.',
    zero: 'Your term cover is below 5 times your annual income. How much cover you need depends on dependants, liabilities and goals; a planner can help you work it out.',
  },
  emergency: {
    full: 'Your liquid savings cover 6 months or more of fixed expenses.',
    partial: 'Your liquid savings cover 3 to 6 months of fixed expenses.',
    zero: 'Your liquid savings cover less than 3 months of fixed expenses.',
    na: 'Not measurable: no fixed expenses were entered, so this category is left out. If you entered 0 by mistake, go back and correct it.',
  },
  investment: {
    full: 'You invest 20% or more of your take-home income each month.',
    partial: 'You invest 10% to 20% of your take-home income each month.',
    zero: 'You invest less than 10% of your take-home income each month.',
  },
  health: {
    full: 'The health cover you entered is ₹10 lakh or more, the level this check uses as its threshold. This is not a statement of what is enough for every family: needs vary with city, age, health history and family size.',
    zero: 'The health cover you entered is below ₹10 lakh, the threshold this check uses. The right amount for your family depends on city, age, health history and family size.',
  },
  overlap: {
    full: 'Your investments are reviewed together for overlap at least once a year.',
    zero: 'Your investments are not reviewed together, or are spread across several agents without a combined view.',
  },
  shielding: {
    full: 'You have taken steps to keep personal assets protected from business risks.',
    zero: 'Personal and business assets may not be shielded from each other.',
    na: "Not applicable: you don't own a business, so this category is left out and your score is scaled.",
  },
});

/** One sentence about one category's outcome. `points` is null when the category did not apply. */
export function observationFor(id, points) {
  const set = OBSERVATIONS[id];
  if (points === null || points === undefined) return set.na;
  if (points === 0) return set.zero;
  return points === CATEGORY_MAX[id] ? set.full : set.partial;
}

export const BANDS = Object.freeze({
  strong: {
    title: 'Strong foundation',
    line: 'Most of the basics in this check are in place. Keep reviewing them once a year and after big life changes such as a new loan, a new family member or a job change.',
  },
  good: {
    title: 'A good base, with gaps to close',
    line: 'Several areas are in good shape, while others fall short of the thresholds used in this check. The breakdown below shows where points were missed.',
  },
  attention: {
    title: 'Needs attention',
    line: 'Many of the basics in this check are not yet in place. That is common, and the breakdown below shows which areas to look at first.',
  },
});

/** The line that explains how the score was scaled (approved wording). */
export function normalizationNote(result) {
  const { score, earned, applicable, shieldingApplicable, emergencyMeasurable } = result;
  if (applicable === 100) return `Score: ${score} out of 100 (all 100 points applied).`;
  const left = [];
  if (!emergencyMeasurable) left.push('Emergency fund (not measurable because you entered no fixed expenses)');
  if (!shieldingApplicable) left.push("Business asset shielding (not applicable: you don't own a business)");
  return `Score: ${score} out of 100. Your earned points (${earned}) are out of ${applicable} applicable points, then scaled to 100. Left out: ${left.join(' and ')}.`;
}

export const DISCLAIMER =
  'This Financial Health Check-up is an educational self-assessment based only on the numbers you enter. The thresholds are general rules of thumb, not personalised advice, and a score does not guarantee any financial outcome. It does not recommend any product. For advice that fits your situation, speak to a qualified planner.';

export const CALLBACK = Object.freeze({
  heading: 'Want a free callback about your result?',
  retention:
    'We store your name, mobile number, score and consent for up to 24 months, then delete them. Your income, expense, savings and cover amounts are never sent to us or stored. You can ask us to delete your details earlier through the Contact page.',
  success: "Thank you. We've received your request.",
  failure: "We couldn't save your request just now. Your result is still shown above; please try again.",
  // Reused from the previous Health Check form
  nameLabel: 'Your name',
  phoneLabel: 'Mobile number',
  nameError: 'Please enter your name.',
  phoneError: 'Please enter a valid 10-digit mobile number.',
  restart: 'Start again',
});

/**
 * NEW MICROCOPY: wording that is not in the approved specification. Kept apart so it can be reviewed in one place.
 */
export const NEW_MICROCOPY = Object.freeze({
  callbackButton: 'Request a free callback',
  sending: 'Sending…',
  consentError: 'Please tick the consent box to request a callback.',
  emiAboveIncome: 'Your EMI is higher than your monthly income. Please check that you entered both amounts correctly.',
  progressLabel: 'Check-up progress',
  notApplicablePoints: 'N/A',
  stepPrivacyNote: 'The income, expense, savings and cover amounts you enter stay in your browser. They are not sent to Solahana.',
  consultationButton: 'Get these fixed, free call',
  // Small additions from the presentation pass: the echo of a typed amount and two screen-reader-only labels
  amountEchoPrefix: '= ',
  scoreRingLabel: 'Your score out of 100',
  breakdownLabel: 'Score breakdown by category',
  // Shown beside the callback button while it is off because the consent box is not ticked
  consentHint: 'This button turns on once you tick the consent box above.',
});
