import { MessageCircle, HandCoins, SlidersHorizontal } from 'lucide-react';
import introArt from '../assets/families-planning-together.jpg';
import discussionArt from '../assets/stages/02.webp';
import reviewArt from '../assets/services/financial.webp';
import planArt from '../assets/services/goal.webp';
import ongoingArt from '../assets/stages/05.webp';

// Copy carried over from the previous Our Process page; images are existing site artwork.
export const STEPS = [
  {
    id: 'step-1',
    short: 'Intro Conversation',
    title: 'Intro Conversation',
    lead: 'A short, free call to understand what you want and where you are today. No products, no pressure.',
    points: ['What you want to achieve', 'Your finances, in brief', 'Your questions and concerns', 'Whether we’re the right fit'],
    pointsTitle: 'What we cover',
    outcome: 'Clarity on the next steps',
    art: introArt,
    artAlt: 'A couple talking through their finances together',
  },
  {
    id: 'step-2',
    short: 'Detailed Discussion',
    title: 'Detailed Discussion',
    lead: 'We sit down together and look at the full picture: what comes in, what goes out, what you own, what you owe and what you’re planning for.',
    points: ['Income and expenses', 'Investments and loans', 'Family goals and timelines', 'Insurance you already have'],
    pointsTitle: 'What we cover',
    outcome: 'Your complete money snapshot',
    art: discussionArt,
    artAlt: 'A laptop and a cup of coffee on a desk',
  },
  {
    id: 'step-3',
    short: 'Financial Review',
    title: 'Financial Review',
    lead: 'We check what’s working and find the gaps, and explain every one of them in plain language.',
    points: ['Asset mix', 'Health and term cover', 'Emergency fund', 'Tax efficiency'],
    pointsTitle: 'What we check',
    outcome: 'A clear list of what needs fixing',
    art: reviewArt,
    artAlt: 'A golden compass pointing the way',
  },
  {
    id: 'step-4',
    short: 'Your Written Plan',
    title: 'Your Written Plan',
    lead: 'Everything comes together in a written plan with clear actions, amounts and timelines, so you know exactly what to do and when.',
    points: ['Investment direction', 'Protection plan', 'Tax-saving plan', 'Step-by-step timeline'],
    pointsTitle: 'What’s inside',
    outcome: 'A plan you can actually follow',
    art: planArt,
    artAlt: 'A golden target with an arrow in the centre',
  },
  {
    id: 'step-5',
    short: 'Action & Reviews',
    title: 'Action & Ongoing Reviews',
    lead: 'We help you put the plan into action, then review it every year, or sooner when life changes: a new job, a baby, a move.',
    points: ['Setting up SIPs and cover', 'Yearly reviews', 'Updates after big life events', 'A team you can always reach'],
    pointsTitle: 'What happens',
    outcome: 'A plan that keeps up with your life',
    art: ongoingArt,
    artAlt: 'Stacks of gold coins growing step by step',
  },
];

export const HERO_FACTS = ['Free first call', 'Plain language', 'No product pushing'];

export const PRINCIPLES = [
  { icon: MessageCircle, title: 'Plain language, always', desc: 'No jargon. If something isn’t clear, we explain it again.' },
  { icon: HandCoins, title: 'No pushing products', desc: 'We recommend what fits your plan, not what’s on sale this month.' },
  { icon: SlidersHorizontal, title: 'You stay in control', desc: 'Every decision is yours. We lay out the options and the trade-offs.' },
];

// Things worth keeping handy for the detailed discussion (step 2)
export const PREP_ITEMS = [
  'A rough idea of your monthly income and expenses',
  'Investment statements, if you have any (mutual funds, shares, FDs)',
  'Details of loans and EMIs',
  'Your current insurance policies, health and term',
  'Your goals and roughly when you want them (a home, education, retirement)',
];

export const PROCESS_FAQS = [
  {
    q: 'Does the first call cost anything?',
    a: 'No. Step 1 is a short, free conversation. We understand what you want and tell you honestly whether and how we can help.',
  },
  {
    q: 'Will I be pushed to buy something?',
    a: 'No. We recommend what fits your plan, not what’s on sale this month. Every decision stays with you.',
  },
  {
    q: 'What if I don’t have all my documents ready?',
    a: 'That’s fine. Bring what you have and we’ll work out the rest together. A rough picture is enough to start.',
  },
  {
    q: 'How often is my plan reviewed?',
    a: 'Every year, or sooner when life changes: a new job, a baby, a move.',
  },
  {
    q: 'Can I talk to someone before booking?',
    a: 'Yes. You can call or WhatsApp +91 73044 42171, Monday to Saturday, 10 AM to 7 PM.',
  },
];
