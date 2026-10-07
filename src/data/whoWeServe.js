import { Briefcase, Plane, Sprout, Sunset, Users, Wallet } from 'lucide-react';

import age24 from '../assets/walker/age-24.webp';
import age30 from '../assets/walker/age-30.webp';
import age38 from '../assets/walker/age-38.webp';
import age45 from '../assets/walker/age-45.webp';
import age53 from '../assets/walker/age-53.webp';
import age60 from '../assets/walker/age-60.webp';

/** Solution pages each audience is pointed to ("Areas we'd focus on"). */
export const FOCUS_AREAS = {
  financial: { label: 'Financial planning', to: '/financial-planning' },
  investments: { label: 'Investment planning', to: '/investments' },
  tax: { label: 'Tax planning', to: '/tax-planning' },
  risk: { label: 'Risk management', to: '/risk-management' },
  estate: { label: 'Estate planning', to: '/estate-planning' },
  goals: { label: 'Goal planning', to: '/goals' },
  retirement: { label: 'Retirement planning', to: '/calculators/retirement' },
};

/** Columns of the "what needs attention first" map. Levels: 0 later, 1 low, 2 medium, 3 high. */
export const MAP_COLUMNS = [
  { key: 'cash', label: 'Cash flow' },
  { key: 'invest', label: 'Investing' },
  { key: 'protect', label: 'Protection' },
  { key: 'tax', label: 'Tax' },
  { key: 'retire', label: 'Retirement' },
  { key: 'legacy', label: 'Will & legacy' },
];

export const LEVEL_NAMES = ['Later', 'Low', 'Medium', 'High'];

/**
 * The six kinds of people we work with, in life order.
 * `consult.goal` must match an option in GlobalConsultationSection's "planningInterests".
 */
export const AUDIENCES = [
  {
    id: 'young-professionals',
    label: 'Young professionals',
    shortLabel: 'Starting out',
    icon: Sprout,
    figure: age24,
    quote: 'I’ve started earning. Where do I even begin?',
    title: 'Your first salary is the best time to start.',
    lead: 'Too many apps and too much advice. We give you a simple first plan, so small, steady habits do the heavy lifting over the years.',
    familiar: ['Not sure where to begin', 'Conflicting advice from apps and friends', 'Travel, a bike and a home, all at once'],
    start: ['An emergency fund of 3 to 6 months’ expenses', 'Term and health cover while premiums are low', 'Small SIPs that step up as your pay grows'],
    focus: ['investments', 'risk', 'goals'],
    tool: { label: 'SIP calculator', to: '/calculators/sip' },
    cta: 'Start my first plan',
    consult: { goal: 'Investment Planning', message: 'I’ve just started earning and would like a simple first plan.' },
    map: { cash: 3, invest: 3, protect: 2, tax: 1, retire: 1, legacy: 0 },
  },
  {
    id: 'salaried',
    label: 'Salaried professionals',
    shortLabel: 'Salaried',
    icon: Wallet,
    figure: age30,
    quote: 'My salary is gone by the 25th. Every month.',
    title: 'Salary comes in. By the 25th, it’s gone.',
    lead: 'Good income, busy life, and money that never seems to stay. We put your savings on autopilot so progress happens without you thinking about it.',
    familiar: ['Savings don’t grow even as salary does', 'Tax-saving products bought in a March rush', 'No idea if you’re on track for your goals'],
    start: ['See where each month’s salary actually goes', 'Choose the right tax regime and use it well', 'SIPs that run on salary day, before you spend'],
    focus: ['financial', 'tax', 'investments'],
    tool: { label: 'goal planner', to: '/calculators/goal-planner' },
    cta: 'Plan my salary',
    consult: { goal: 'Financial Planning', message: 'I’m a salaried professional and want my savings to grow with my salary.' },
    map: { cash: 3, invest: 3, protect: 2, tax: 3, retire: 2, legacy: 1 },
  },
  {
    id: 'families',
    label: 'Families',
    shortLabel: 'Families',
    icon: Users,
    figure: age38,
    quote: 'School fees, home loan, parents’ health. All at once.',
    title: 'Many goals. One income. A lot of responsibility.',
    lead: 'School fees, a home loan and your parents’ health, often all at once. We give every goal its own fund so they stop competing for the same money.',
    familiar: ['Every goal pulls from the same savings', 'Not sure if your insurance is enough', 'Will and nominees still pending'],
    start: ['Check your life and health cover is enough', 'A separate fund and timeline for each goal', 'A will, and every nominee up to date'],
    focus: ['risk', 'goals', 'estate'],
    tool: { label: 'EMI calculator', to: '/calculators/emi' },
    cta: 'Plan for my family',
    consult: { goal: 'Financial Planning', message: 'We’re a family juggling several goals and want one plan that covers all of them.' },
    map: { cash: 2, invest: 2, protect: 3, tax: 2, retire: 2, legacy: 2 },
  },
  {
    id: 'business-owners',
    label: 'Business owners',
    shortLabel: 'Business',
    icon: Briefcase,
    figure: age45,
    quote: 'Almost everything I own is tied up in the business.',
    title: 'The business is growing. Is your personal wealth?',
    lead: 'Most founders have almost everything tied up in the business. We help you build wealth outside it, and keep business and family money clearly apart.',
    familiar: ['Business and home money get mixed up', 'Most of your wealth is locked in one place', 'No clear plan for who takes over'],
    start: ['Keep business and family money apart', 'Build wealth outside the business', 'Put a succession plan in writing'],
    focus: ['financial', 'tax', 'estate'],
    tool: { label: 'lumpsum calculator', to: '/calculators/lumpsum' },
    cta: 'Plan for my business',
    consult: { goal: 'Custom Wealth Planning', message: 'I run a business and want to build personal wealth outside it.' },
    map: { cash: 2, invest: 3, protect: 2, tax: 3, retire: 2, legacy: 3 },
  },
  {
    id: 'nri',
    label: 'NRI families',
    shortLabel: 'NRIs',
    icon: Plane,
    figure: age53,
    quote: 'I earn abroad, but my plans are back home.',
    title: 'Earning abroad. Planning for home.',
    lead: 'Whether you’re in the Gulf, the US, the UK or Singapore, we help you keep your Indian money organised and working, without the paperwork headaches.',
    familiar: ['Confused between NRE and NRO accounts', 'Worried about paying tax twice', 'Investments in India left unmanaged'],
    start: ['NRE and NRO accounts set up the right way', 'No paying tax twice on the same income', 'A clear investment plan for your money in India'],
    focus: ['investments', 'tax', 'estate'],
    tool: { label: 'inflation calculator', to: '/calculators/inflation' },
    cta: 'Plan as an NRI',
    consult: { goal: 'Custom Wealth Planning', message: 'I’m an NRI and want my money in India organised and working.' },
    map: { cash: 1, invest: 3, protect: 1, tax: 3, retire: 2, legacy: 2 },
  },
  {
    id: 'retirees',
    label: 'Pre-retirees & retirees',
    shortLabel: 'Retiring',
    icon: Sunset,
    figure: age60,
    quote: 'My salary stops soon. My expenses won’t.',
    title: 'Your salary stops. Your expenses don’t.',
    lead: 'The big question is whether your money will last. We plan a steady monthly income and protect it from rising costs and medical bills.',
    familiar: ['Will my savings last?', 'Too much sitting idle in FDs', 'Medical costs keep going up'],
    start: ['Work out your retirement number', 'Turn savings into a steady monthly income', 'Health cover that lasts as long as you need it'],
    focus: ['retirement', 'risk', 'estate'],
    tool: { label: 'retirement calculator', to: '/calculators/retirement' },
    cta: 'Plan my retirement',
    consult: { goal: 'Retirement Planning', message: 'I’m close to (or in) retirement and want a steady monthly income plan.' },
    map: { cash: 3, invest: 2, protect: 3, tax: 2, retire: 3, legacy: 3 },
  },
];

export const DEFAULT_AUDIENCE = 'salaried';

export const audienceFromHash = (hash = '') => {
  const id = hash.replace(/^#/, '');
  return AUDIENCES.some((a) => a.id === id) ? id : null;
};

/** The same five steps as the Our Process page, in short. */
export const PROCESS_STEPS = [
  { title: 'Intro conversation', desc: 'A short call about where you are today and what you want.' },
  { title: 'Detailed discussion', desc: 'The full picture: income, spending, loans, goals and cover.' },
  { title: 'Financial review', desc: 'What’s working and what’s missing, in plain language.' },
  { title: 'Your written plan', desc: 'Clear actions, amounts and timelines you can follow.' },
  { title: 'Action & reviews', desc: 'We help you set it up, then review it with you every year.' },
];

export const GOOD_FIT = [
  'Want a plan first, and products second',
  'Are ready to invest steadily and give it time',
  'Like to understand the why behind every step',
];

export const NOT_A_FIT = [
  'Tips on which stock will double next',
  'Someone to promise you a fixed return',
  'A one-time product sale with no follow-up',
];

/**
 * Scrolls to the consultation form at the bottom of the page and, when `consult` is given,
 * pre-fills its goal and message (GlobalConsultationSection listens for this event).
 */
export function openConsultation(consult) {
  if (consult) {
    window.dispatchEvent(new CustomEvent('solahana:prefill-consultation', { detail: consult }));
  }
  const el = document.getElementById('global-consultation-section');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
