/**
 * All customer-facing wording of the Solahana Financial Kundli, in one place so it can be reviewed and tested without
 * rendering anything. The nine Health Check-up questions reuse that tool's approved labels and help texts verbatim
 * (FIELDS and CHOICES from financialHealthCheckCopy.js), so the two tools ask the same questions in the same words.
 *
 * Sources: Step 2 questionnaire (and its revision), Step 3 formula specification (final), Step 4 architecture.
 */
import { CHOICES, FIELDS } from '../financialHealthCheckCopy.js';

export const KUNDLI_VERSION = 'kundli-v1';
export const CALC_SPEC_VERSION = 'kundli-calc-v1';

export const INTRO = Object.freeze({
  eyebrow: 'Free · About 10 to 15 minutes',
  title: 'Your Financial Kundli',
  body:
    'Answer questions about your income, spending, savings, what you own, what you owe, your goals and your retirement. You will get a report that shows where you stand today. This is an educational self-assessment, not financial advice.',
  privacy:
    'Your answers stay in this browser. They are not sent to Solahana and are not saved. If you close or refresh this page, your answers will be lost.',
  missing:
    "Many questions let you choose 'I have none' or 'Not sure'. We never treat a blank answer as zero. Anything missing is shown as missing in your report.",
  start: 'Start',
  resume: 'Continue where you left off',
  resumeNote: 'Your earlier answers are still on this page. They stay only until you close or refresh it.',
});

/** The Kundli entry on the Calculators page (it takes the Financial Health Check-up's place there). */
export const TEASER = Object.freeze({
  title: 'Solahana Financial Kundli',
  cta: 'Start my Financial Kundli',
  points: [
    'Savings, monthly cash flow and emergency fund',
    'Net worth: what you own and what you owe',
    'Life and health cover, EMIs and a financial health score',
    'Your goals and retirement, on your own yearly rates',
  ],
});

/** The callback form under the score (the Health Check-up's approved labels and messages are reused where they fit). */
export const CALLBACK_KUNDLI = Object.freeze({
  heading: 'Want a free callback about your Financial Kundli?',
  intro: 'A Solahana planner can walk you through your report. Only your name, mobile number and financial health score are sent; your amounts, goals and answers never leave this page.',
  button: 'Request a free callback',
  sending: 'Sending…',
  consentHint: 'This button turns on once you tick the consent box above.',
  consentError: 'Please tick the consent box to request a callback.',
});

/** Chart titles and notes (graphs in the report). */
export const CHARTS = Object.freeze({
  showNumbers: 'Show the numbers',
  beyond: 'beyond scale',
  standingTitle: 'Where you stand',
  wasThen: (display, status) => `was ${display} (${status})`,
  thenKey: (d) => `Then (${d})`,
  nowKey: 'Now',
  standingNote:
    'Each bar shows the reference levels this check uses. The dot is your figure: in the green part you are strong, in the amber part there is room to grow, and in the red part there is an issue to look at.',
  referenceAria: (r) => `Reference levels: ${r.marks.join(' and ')}${r.unit === 'lakh' ? ' lakh' : r.unit === 'months' ? ' months' : r.unit}.`,
  cashFlowTitle: 'Where your monthly income goes',
  incomeMarker: 'Your income',
  overIncome: (x) => `Your monthly costs and investing are ${x} more than your income: the bar goes past the income line.`,
  otherMissing: "Other monthly spending is not included because it is marked Not sure, so 'Left over' is not shown.",
  assetsTitle: 'What your known assets are made of',
  ownVsOwe: 'What you own and what you owe',
  goalTitle: (t) => `${t}: cost vs your money, year by year`,
  goalCost: 'Goal cost, rising with prices',
  goalMoney: 'Your money: amount set aside plus the monthly investment shown',
  yearsFromNow: 'Years from now',
  goalMeetsNote: (y, cost) => `If you invest the monthly amount shown from now, your money reaches the goal cost of about ${cost} in year ${y}.`,
  goalCoveredNote: (money, cost) => `The money already set aside grows to about ${money}, more than the goal cost of about ${cost}.`,
  retTitle: 'Your retirement money, age by age',
  retMoney: 'Retirement money',
  age: 'Age',
  retireLabel: (a) => `Retire at ${a}`,
  retNote: (k, a, end) =>
    `Investing the monthly amount shown builds about ${k} by age ${a}. It then pays your yearly spending, which rises with prices, and runs down to zero at age ${end}.`,
  retCoveredNote: (left, end) => `Your retirement savings alone cover the spending you planned; about ${left} would be left at age ${end}.`,
});

/** Growth over time: the customer's own Kundli file, the At-a-glance tiles and the progress charts. */
export const GROWTH = Object.freeze({
  glanceTitle: 'At a glance',
  score: 'Financial health score',
  netWorth: 'Net worth',
  knownAssets: 'Known assets',
  savings: 'Monthly savings capacity',
  investing: 'Monthly investing',
  notAvailable: 'Not available',
  up: 'Up',
  down: 'Down',
  same: 'No change',
  since: (d) => `since ${d}`,
  points: (n) => `${n} ${Math.abs(n) === 1 ? 'point' : 'points'}`,
  progressTitle: 'Your progress',
  progressNote: (n, first) => `Compared with ${n} earlier Kundli${n === 1 ? '' : 's'} from your own file, the first on ${first}. Every Kundli is recalculated with today's rules, so they compare like for like.`,
  scoreTrend: 'Financial health score over time',
  moneyTrend: 'What you own and owe over time',
  seriesScore: 'Financial health score',
  seriesAssets: 'Known assets',
  seriesLiabilities: 'Known liabilities',
  seriesNetWorth: 'Net worth',
  was: (display, status) => `was ${display} (${status})`,
  save: 'Save my Kundli (file)',
  saveNote: 'The file is saved only on your device, not with Solahana. Load it next time to see your growth. It contains your amounts, so keep it safe.',
  saved: 'Saved. Keep the file and load it at your next Kundli.',
  load: 'Load my previous Kundli',
  loadNote: 'Saved a Kundli before? Choose that file to see your growth. It is read only in this browser.',
  loaded: (n, d) => `Found ${n} saved Kundli${n === 1 ? '' : 's'}, the latest from ${d}. Your report will show your growth.`,
  useLatest: 'Start with my latest answers',
  startEmpty: 'Start with empty answers',
});

export const NAV = Object.freeze({
  next: 'Continue',
  back: 'Back',
  review: 'Review my answers',
  create: 'Create my Financial Kundli',
  edit: 'Edit',
  backToReview: 'Back to review',
  print: 'Print or save as PDF',
  startOver: 'Start over',
  startOverConfirm: 'Start over? All your answers will be cleared from this page.',
  progressLabel: 'Financial Kundli progress',
  errorSummary: (n) => (n === 1 ? '1 answer needs attention:' : `${n} answers need attention:`),
});

/** The questionnaire sections, in order (Step 2). The assumptions section only appears when goals or retirement are chosen. */
export const SECTIONS = Object.freeze({
  income: 'Income and monthly spending',
  savings: 'Savings and investing',
  protection: 'Protection',
  habits: 'Money habits',
  own: 'What you own',
  owe: 'What you owe',
  goals: 'Goals',
  retirement: 'Retirement',
  assumptions: 'Planning assumptions',
});

export const SECTION_WHY = Object.freeze({
  income: 'Your income and spending decide how much you can save each month.',
  savings: 'Liquid savings show how long you could manage without income. Investing shows what you put away each month.',
  protection: 'Insurance protects your family and savings if something unexpected happens.',
  habits: 'Two good habits that this report looks at.',
  own: 'What you own, added up, is one half of your net worth.',
  owe: 'What you still have to repay is the other half of your net worth.',
  goals: 'For each goal, the report works out how much you may need to invest each month.',
  retirement: 'The report works out how much you may need to invest each month for retirement.',
  assumptions: 'Goals and retirement need two yearly rates. These are your own assumptions; Solahana does not set them.',
});

// Answer-state controls (Step 2)
export const STATES = Object.freeze({
  none: 'I have none',
  noneShort: 'None',
  notSure: 'Not sure',
  skipped: 'Skipped',
  entered: 'Entered',
  estimate: 'Your estimate',
  change: 'Change',
  nothingYet: 'Nothing yet',
  enterInstead: 'Enter an amount instead',
});

/** Labels and help for the nine Health Check-up questions (verbatim) and the one new spending question. */
export const CORE_FIELDS = Object.freeze({
  income: FIELDS.income,
  expenses: FIELDS.expenses,
  emi: FIELDS.emi,
  other: {
    label: 'Other monthly spending',
    help:
      'Everything else you usually spend in a month that is not a fixed expense or an EMI, such as eating out, shopping, entertainment, travel and personal care. A rough monthly average is fine. We need this to work out how much you can save each month. Do not include your monthly investments or SIPs; they are asked separately.',
  },
  savings: FIELDS.savings,
  investments: FIELDS.investments,
  termCover: FIELDS.termCover,
  healthCover: FIELDS.healthCover,
});
export const CORE_CHOICES = CHOICES;

// What you own: eight mutually exclusive boxes in precedence order (Step 2 revision R1). Liquid savings is box 2 and was asked earlier.
export const ASSET_KEYS = Object.freeze(['RET', 'MF', 'FIX', 'GOLD', 'HOME', 'PROP', 'OTHER']);
export const ESTIMATE_ASSETS = Object.freeze(['GOLD', 'HOME', 'PROP', 'OTHER']);
export const GOAL_ELIGIBLE_ASSETS = Object.freeze(['MF', 'FIX', 'GOLD']);

export const ASSETS = Object.freeze({
  heading: 'What do you own?',
  instruction: 'Tick everything you have. Your liquid savings from earlier are already counted, so do not add them again.',
  precedence: 'If something fits more than one box, put it only in the first box that fits.',
  confirm: 'I have ticked everything I own from this list. Anything I did not tick, I do not have.',
  skip: 'Skip this section',
  skippedNote: 'You skipped this section. Your report will show only your liquid savings as known assets.',
  undoSkip: 'Answer this section instead',
  amountsHeading: 'How much is each one worth?',
  cashNote: "Cash kept at home is counted under 'Anything else of value', not in your emergency fund.",
  items: {
    RET: { label: 'Retirement accounts: EPF, PPF or NPS', amountLabel: 'Current balance in your EPF, PPF and NPS', help: 'Add up the latest balances from your statements.' },
    MF: {
      label: 'Mutual funds that invest in shares, and shares you own directly',
      amountLabel: 'Current value of your mutual funds and shares',
      help: 'Use the latest value from your statement or app. An approximate figure is fine. Do not include debt funds or liquid funds here.',
    },
    FIX: {
      label:
        'Other deposits and savings: fixed deposits, bonds, debt funds other than liquid funds already counted in liquid savings, post office schemes, NSC, Sukanya Samriddhi, and any bank money kept aside for a goal',
      amountLabel: 'Current value of your other deposits and savings',
      help: 'Do not include money you already counted in liquid savings. PPF belongs under retirement accounts.',
    },
    GOLD: { label: 'Gold or jewellery', amountLabel: 'Approximate value of your gold and jewellery', help: 'Your own estimate is fine. We show it as an estimate in your report.' },
    HOME: { label: 'The home you live in, if you own it', amountLabel: 'Approximate market value of the home you live in', help: 'What you think it would sell for today. We show it as an estimate.' },
    PROP: { label: 'Other property or land', amountLabel: 'Approximate market value of your other property or land', help: 'What you think it would sell for today. We show it as an estimate.' },
    OTHER: {
      label: 'Anything else of value, such as vehicles or cash kept at home',
      amountLabel: 'Approximate value of anything else you own',
      help: 'Your own estimate is fine. Do not include the value of insurance policies.',
    },
  },
});

export const LIABILITY_KEYS = Object.freeze(['HOME', 'VEH', 'LOAN', 'CARD', 'PEOPLE']);
export const LOAN_KEYS = Object.freeze(['HOME', 'VEH', 'LOAN']);

export const LIABILITIES = Object.freeze({
  heading: 'What do you owe?',
  instruction: 'Tick everything you still have to repay.',
  confirm: 'I have ticked everything I owe from this list. Anything I did not tick, I do not owe.',
  skip: 'Skip this section',
  skippedNote: 'You skipped this section. Your report will show what you owe as not provided.',
  undoSkip: 'Answer this section instead',
  amountsHeading: 'How much is still to repay?',
  items: {
    HOME: { label: 'Home loan', amountLabel: 'Amount still to repay on your home loan', help: 'The outstanding amount from your latest loan statement, not your EMI. If you have more than one, add them up.' },
    VEH: { label: 'Vehicle loan', amountLabel: 'Amount still to repay on your vehicle loan', help: 'The outstanding amount from your latest loan statement, not your EMI. If you have more than one, add them up.' },
    LOAN: {
      label: 'Personal, education or any other loan',
      amountLabel: 'Amount still to repay on your other loans',
      help: 'The outstanding amount from your latest loan statement, not your EMI. If you have more than one, add them up.',
    },
    CARD: { label: 'Credit card bill not paid in full', amountLabel: 'Unpaid credit card amount', help: 'The amount you have not paid off, including any balance carried from earlier months.' },
    PEOPLE: { label: 'Money borrowed from family, friends or others', amountLabel: 'Amount you still owe to family, friends or others', help: '' },
  },
  emiNoLoan: 'You entered a monthly EMI but did not tick any loan. You can go back and check either answer.',
  loanNoEmi: 'You ticked a loan but entered ₹0 as your monthly EMI. You can go back and check either answer.',
});

export const GOALS = Object.freeze({
  gate: "Do you have money goals you would like to plan for, such as a child's education or buying a home?",
  gateYes: 'Yes, add a goal',
  gateNo: 'Not now',
  max: 5,
  add: 'Add another goal',
  remove: 'Remove this goal',
  removeAllConfirm: 'Remove the goals you added?',
  goalHeading: (n) => `Goal ${n}`,
  type: 'What is this goal?',
  types: [
    { value: 'education', label: "Child's education" },
    { value: 'wedding', label: "Child's wedding" },
    { value: 'home', label: 'Buying a home' },
    { value: 'vehicle', label: 'Buying a vehicle' },
    { value: 'travel', label: 'Travel' },
    { value: 'other', label: 'Something else' },
  ],
  name: 'Name your goal',
  cost: 'How much would this cost if you paid for it today?',
  costHelp: "Use today's prices. Your report adjusts this for rising prices using the yearly price-rise rate shown in it.",
  years: 'In how many years will you need this money?',
  saved: 'How much have you already set aside for this goal?',
  savedHelp: "This money should already be part of what you entered under 'What you own'. We will not count it twice.",
  maxNote: 'You can plan up to 5 goals.',
});

export const RETIREMENT = Object.freeze({
  gate: 'Would you like to plan for retirement?',
  gateYes: 'Yes',
  gateRetired: 'I have already retired',
  gateNo: 'Not now',
  retiredNote: 'This section is for people who have not yet retired, so it will not be part of your report.',
  removeConfirm: 'Remove your retirement answers?',
  age: 'Your age',
  at: 'At what age do you plan to retire?',
  until: 'Until what age do you want your retirement money to last?',
  untilHelp: 'Choose the age you want to plan for. We do not suggest an age. Planning for a later age means you would need more savings.',
  spend: 'How much would you need each month after retirement, at today\'s prices?',
  spendHelp: "Think of your usual monthly costs at today's prices. Leave out EMIs you expect to have finished by then.",
  fixedButton: (amount) => `Use my monthly fixed expenses (${amount})`,
  fixedPlusOtherButton: (amount) => `Use my fixed expenses plus other spending (${amount})`,
  plusOtherDisabled: 'This option needs your other monthly spending, which is marked Not sure.',
  savingsNote: "We will use your EPF, PPF and NPS balance from 'What you own'.",
});

export const ASSUMPTIONS = Object.freeze({
  inf: 'Yearly rise in prices you want to plan with (%)',
  infHelp: 'Prices usually go up every year. Enter the yearly rate you want us to use. Solahana does not set or promise this number. Allowed: 0 to 25.',
  ret: 'Yearly return you want to plan with (%)',
  retHelp:
    'The yearly growth you expect on your savings and investments. This is your own assumption, not a promise. Actual returns can be lower, and can be negative. Allowed: 0.1 to 30.',
});

// Validation messages. The amount messages are the Health Check-up's own (MESSAGES in financialHealthCheck.js).
export const ERRORS = Object.freeze({
  tickedZero: 'If you do not have this, untick it on the previous screen.',
  confirmNeeded: "Please confirm that you have ticked everything, or choose 'Skip this section'.",
  amountPositive: 'Enter an amount more than ₹0, or choose Not sure.',
  goalYears: 'Enter a whole number of years from 1 to 50.',
  ageWhole: 'Enter your age in whole years.',
  ageRange: 'Your age must be from 18 to 80.',
  retireAfterAge: 'Your retirement age must be more than your current age.',
  retireMax: 'Please enter a retirement age of 89 or less.',
  untilAfterRetire: 'This age must be more than your retirement age.',
  untilMax: 'Please enter an age of 90 or less.',
  goalName: 'Please keep the goal name to 40 characters.',
  percentFormat: 'Enter a percentage with up to one decimal, for example 6 or 6.5.',
  infRange: 'Enter a rate from 0 to 25.',
  retRange: 'Enter a rate from 0.1 to 30.',
  required: 'Please answer this question.',
  addGoal: "Please add a goal, or choose 'Not now'.",
});

export const REVIEW = Object.freeze({
  heading: 'Check your answers',
  incompleteHeading: 'These parts of your report will be incomplete:',
  notChosen: 'Not chosen',
  goalsNone: 'No goals added',
});

// Provenance tags (U-C)
export const TAGS = Object.freeze({
  ENT: 'Entered by you',
  EST: 'Your estimate',
  ASM: 'Your assumption',
  CAL: 'Calculated',
  CALEST: 'Calculated (includes your estimates)',
  PRJ: 'Projection, based on your assumptions',
  REF: 'Reference level this check uses',
  INFO: 'Information only',
});

/** What each provenance tag means (the legend in the report). */
export const TAG_MEANING = Object.freeze({
  ENT: 'An amount or choice you gave.',
  EST: 'Your own estimate of a value.',
  ASM: 'A yearly rate you chose.',
  CAL: 'Worked out only from what you entered.',
  CALEST: 'Worked out from what you entered, including your estimates.',
  PRJ: 'A projection that uses your yearly rates.',
  REF: 'A general rule of thumb this check compares against.',
  INFO: 'Shown for information; not part of your score.',
});

export const STATUS = Object.freeze({
  complete: 'Complete',
  incomplete: 'Incomplete',
  'not-chosen': 'Not chosen',
  'not-applicable': 'Not applicable',
  'out-of-range': 'Too large to show',
  unavailable: 'Could not be shown',
});

export const SEVERITY_LABELS = Object.freeze({ high: 'Priority', medium: 'Worth Reviewing', low: 'Good Practice' });

export const REPORT = Object.freeze({
  title: 'Your Financial Kundli',
  subtitle: 'Prepared from your answers. Information only.',
  dateLabel: 'Prepared on',
  summary: (x, y) => `${x} of ${y} chosen sections complete`,
  summaryNote: 'This is not a score. It shows how many sections had every answer they need.',
  needsPrefix: 'Needs:',
  scoreHeading: 'Financial health score',
  scoreNeeds: (list) => `Your score and areas to look at need: ${list}.`,
  areasHeading: 'Areas to Look At',
  areasNone: 'No areas were flagged by this check.',
  planningPoint: 'Planning Point',
  modulesHeading: 'Your sections',
  moduleNames: {
    cashFlow: 'Savings and monthly cash flow',
    emergency: 'Emergency fund',
    netWorth: 'Net worth',
    debt: 'Debt and EMI',
    life: 'Life cover',
    health: 'Health cover',
    goals: 'Goals',
    retirement: 'Retirement',
  },
  unavailable: 'This section could not be shown.',
  tooLarge: 'This figure is too large to show reliably with the numbers entered.',
  tooLargeSavings: 'Too large to show reliably.',
  howCalculated: 'How this is calculated',
  assumptionsHeading: 'Assumptions and how to read this report',
  legendHeading: 'What the labels mean',
  yourRates: 'Your yearly rates',
  disclosuresHeading: 'How the projections work',
  versionLine: (date) => `Report version ${KUNDLI_VERSION} · Calculation version ${CALC_SPEC_VERSION} · ${date}. The yearly rates used are the ones you entered.`,
  printPrivacy: 'This report contains your personal financial details. Store or share it carefully.',
  printFooter: 'SOLAHANA Financial Kundli · Information only',
  disclaimer:
    'This Financial Kundli is an educational self-assessment based only on the numbers you enter. The reference levels are general rules of thumb, and the projections use the yearly rates you chose; neither is a promise of any outcome. It does not suggest any product. For guidance that fits your situation, speak to a qualified planner.',
});

// Figure labels and module messages (Step 3)
export const FIG = Object.freeze({
  savingsCapacity: 'Total savings capacity each month',
  investing: 'Monthly investing',
  cashAfter: 'Cash left after investing',
  fullBudget: 'Fixed expenses, EMIs, other spending and investing',
  runway: 'Months your liquid savings would last',
  runwayWithEmi: 'Counting EMIs as well',
  knownAssets: 'Known assets',
  ownHome: 'The home you live in (your estimate)',
  knownLiabilities: 'Known liabilities',
  netWorth: 'Net worth',
  emiShare: 'EMIs as a share of income',
  loans: 'Loans still to repay',
  termMultiple: 'Term cover as a multiple of yearly income',
  termCover: 'Term cover entered',
  healthCover: 'Health cover entered',
  healthReference: 'Reference level',
  futureCost: 'Cost when you need it',
  savedFuture: 'What you have set aside, grown',
  stillNeeded: 'Still needed',
  monthlyNeeded: 'Monthly investment needed (start of each month)',
  monthlyAtRetirement: 'Monthly spending when you retire',
  annualAtRetirement: 'Yearly spending when you retire',
  corpus: 'Amount needed at retirement',
  retSavingsFuture: 'Your retirement savings, grown',
  netNeeded: 'Still needed at retirement',
  retMonthlyNeeded: 'Monthly investment needed until retirement (start of each month)',
  months: (text) => `${text} months`,
});

export const MSG = Object.freeze({
  S1: (x) => `Your spending is ${x} more than your monthly in-hand income.`,
  S2: (x) => `Your monthly investing is ${x} more than what is left after your spending.`,
  S3: (why) => `Savings is not calculated because 'Other monthly spending' ${why}.`,
  FB: (x, y) => `Including your other monthly spending, your monthly costs and investing come to ${x}, which is ${y} more than your income.`,
  A3ess: (x) => `Your fixed expenses and EMIs together are ${x} more than your monthly in-hand income.`,
  A3inv: (x) =>
    `Your fixed expenses and EMIs fit within your income, but adding your monthly investing takes the total ${x} above it.`,
  runwayTiny: 'Your liquid savings cover less than 0.1 month of your fixed expenses.',
  EF3: (x) => `Counting your EMIs as well, your liquid savings would cover about ${x} months. This is for information only and is not part of your score.`,
  nwNeeds: (a, l, list) => `Known assets: ${a} · Known liabilities: ${l}. A full net-worth figure needs: ${list}.`,
  assetsOnlyLiquid: (a) => `Known assets: ${a} (only liquid savings; the rest was skipped).`,
  liabilitiesNotProvided: 'Known liabilities: not provided.',
  nwNeedsOnly: (list) => `A full net-worth figure needs: ${list}.`,
  partialNeeds: (list) => `Some figures in this section are not shown because they need: ${list}.`,
  nwNegative: (x) => `What you owe is ${x} more than what you own.`,
  noTerm: 'You entered no term cover.',
  noHealth: 'You entered no health cover.',
  lifeNotChecked: (why) => `Life cover is not checked because your term cover ${why}.`,
  healthNotChecked: (why) => `Health cover is not checked because your health cover ${why}.`,
  goalCovered: 'On the yearly rates you entered, the money you have already set aside for this goal would cover it.',
  retCovered: 'On the yearly rates you entered, your retirement savings would cover the spending you planned for.',
  goalCap: 'The money you have set aside for your goals is more than what you entered for mutual funds and shares, other deposits and savings, and gold. Please check both answers.',
  goalCapUnknown: 'We could not check this against what you own.',
  goalNotCalculated: (list) => `This goal is not calculated because it needs: ${list}.`,
  retNotCalculated: (list) => `Retirement is not calculated because it needs: ${list}.`,
  notCalculated: (list) => `Not calculated because it needs: ${list}.`,
  isNotSure: 'is marked Not sure',
  wasSkipped: 'was skipped',
});

export const DISCLOSURES = Object.freeze({
  sipTiming:
    'Each instalment is assumed to be invested at the start of the month, and the yearly rate is applied as one-twelfth each month, so the effective yearly return is a little higher than the rate entered.',
  savedGrowth: 'Money you have already set aside is assumed to grow once a year at the yearly return.',
  goalOngoing: 'This does not include anything you may already be investing each month for this goal.',
  retSpending:
    'Your retirement spending is assumed to rise with prices every year, including the first year of retirement, and is taken out at the end of each year until the age you chose.',
  sameReturn: 'The same yearly return is used before and after retirement.',
  epf: 'This does not include money already going into EPF from your salary or any part of your monthly investments meant for retirement.',
  rounding: 'Amounts you need are rounded up and amounts you would have are rounded down, so totals may differ by a rupee or two.',
  cash: "Cash kept at home is counted under 'Anything else of value', not in your emergency fund.",
  business: "'No or not sure' is one answer in this check, so the report cannot tell the two apart.",
});

/** "How this is calculated" for each section (new copy, plain description of the Step 3 formulas). */
export const HOW = Object.freeze({
  cashFlow:
    'Total savings capacity = monthly in-hand income − fixed expenses − EMIs − other spending. Cash left after investing = savings capacity − monthly investing. Percentages are of your monthly in-hand income, rounded down to one decimal.',
  emergency:
    'Months = liquid savings ÷ monthly fixed expenses, rounded down to one decimal. This check uses 3 and 6 months as reference levels. The figure that counts EMIs as well is for information only.',
  netWorth:
    "Known assets = liquid savings + every amount you entered under 'What you own'. Known liabilities = every amount under 'What you owe'. Net worth = known assets − known liabilities, shown only when every answer is known. Money set aside for goals is already inside what you own, so it is not added again.",
  debt: 'EMI share = monthly EMIs ÷ monthly in-hand income, rounded up to one decimal. This check uses 30% and 45% as reference levels. Loans still to repay add up your home, vehicle and other loans.',
  life: 'Term cover ÷ (monthly in-hand income × 12), rounded down to one decimal. This check uses 5 and 10 times your yearly income as reference levels. It is a rule of thumb, not a calculation of what your family needs.',
  health: 'Your cover is compared with the ₹10 lakh reference level this check uses. What is enough depends on city, age, health history and family size.',
  goals:
    "Cost when you need it = today's cost grown every year at your yearly price rise. What you have set aside grows once a year at your yearly return. Still needed = cost when you need it − what you have set aside, grown. The monthly investment is worked out from that.",
  retirement:
    'Your monthly spending is grown at your yearly price rise until you retire. The amount needed at retirement pays that spending, rising with prices, every year until the age you chose, while the rest stays invested at your yearly return. Your EPF, PPF and NPS balance grows once a year until you retire.',
});

/** Words that must never appear in the Kundli's customer copy (checked by tests). */
export const FORBIDDEN_WORDS = Object.freeze(['guaranteed', 'guarantee', 'ideal', 'recommended', 'verified', 'forecast', 'risk-free']);
