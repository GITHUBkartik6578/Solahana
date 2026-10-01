import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import FeatureRow from '../components/common/FeatureRow';
import {
  SalariedVisual,
  BusinessVisual,
  FamiliesVisual,
  NriVisual,
  YoungProVisual,
  RetireeVisual,
} from '../components/illustrations/AudienceProcessVisuals';
import familiesPhoto from '../assets/families-planning-together.jpg';

const AUDIENCES = [
  {
    id: 'salaried',
    chip: 'Salaried Professionals',
    eyebrow: 'Salaried Professionals',
    title: 'Salary comes in. By the 25th, it’s gone.',
    lead: 'Good income, busy life, and money that never seems to stay. We put your savings on autopilot so progress happens without you thinking about it.',
    problems: ['Savings don’t grow even as salary does', 'Tax-saving products bought in a March rush', 'No idea if you’re on track for your goals'],
    points: ['SIPs that run on salary day', 'The right tax regime, used well', 'An emergency fund you won’t touch'],
    cta: 'Plan My Salary',
    Visual: SalariedVisual,
  },
  {
    id: 'business-owners',
    chip: 'Business Owners',
    eyebrow: 'Business Owners',
    title: 'The business is growing. Is your personal wealth?',
    lead: 'Most founders have almost everything tied up in the business. We help you build wealth outside it, and keep business and family money clearly apart.',
    problems: ['Business and home money get mixed up', 'Most of your wealth is locked in one place', 'No clear plan for who takes over'],
    points: ['Separate business and family money', 'Pay yourself the tax-smart way', 'Build wealth outside the business', 'Plan succession clearly'],
    cta: 'Plan for My Business',
    Visual: BusinessVisual,
  },
  {
    id: 'families',
    chip: 'Families',
    eyebrow: 'Families',
    title: 'Many goals. One income. A lot of responsibility.',
    lead: 'School fees, a home loan and your parents’ health, often all at once. We give every goal its own fund so they stop competing for the same money.',
    problems: ['Every goal pulls from the same savings', 'Not sure if your insurance is enough', 'Will and nominees still pending'],
    points: ['Its own fund for every goal', 'Right-sized health and term cover', 'Will and nominees, sorted'],
    cta: 'Plan for My Family',
    Visual: FamiliesVisual,
    photo: familiesPhoto,
    photoAlt: 'A couple sitting together at home, going through their financial plan',
  },
  {
    id: 'nri',
    chip: 'NRI Families',
    eyebrow: 'NRI Families',
    title: 'Earning abroad. Planning for home.',
    lead: 'Whether you’re in the Gulf, the US, the UK or Singapore, we help you keep your Indian money organised and working, without the paperwork headaches.',
    problems: ['Confused between NRE and NRO accounts', 'Worried about paying tax twice', 'Investments in India left unmanaged'],
    points: ['Accounts set up the right way', 'Avoid paying tax twice on the same income', 'A clear investment plan for India'],
    cta: 'Plan as an NRI',
    Visual: NriVisual,
  },
  {
    id: 'young-professionals',
    chip: 'Young Professionals',
    eyebrow: 'Young Professionals',
    title: 'Your first salary is the best time to start.',
    lead: 'Too many apps and too much advice. We give you a simple first plan, so small, steady habits do the heavy lifting over the years.',
    problems: ['Not sure where to begin', 'Conflicting advice from apps and friends', 'Travel, a bike and a home, all at once'],
    points: ['A simple first plan', 'Small SIPs that grow with your pay', 'Term cover while it’s cheap'],
    cta: 'Start My First Plan',
    Visual: YoungProVisual,
  },
  {
    id: 'retirees',
    chip: 'Pre-retirees & Retirees',
    eyebrow: 'Pre-retirees & Retirees',
    title: 'Your salary stops. Your expenses don’t.',
    lead: 'The big question is whether your money will last. We plan a steady monthly income and protect it from rising costs and medical bills.',
    problems: ['Will my savings last?', 'Too much sitting idle in FDs', 'Medical costs keep going up'],
    points: ['Know your retirement number', 'A monthly income plan', 'Health cover that lasts'],
    cta: 'Plan My Retirement',
    Visual: RetireeVisual,
  },
];

export default function WhoWeServePage() {
  return (
    <div className="relative z-10 bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-14 sm:pt-40 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#F4F6FB] to-white">
        <div className="absolute -top-32 right-[-10%] w-[620px] h-[620px] rounded-full bg-[#2F5BC7]/[0.07] blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
              <Users className="w-3.5 h-3.5 text-[#C9A04F]" /> Who We Serve
            </span>
            <h1 className="mt-5 text-[36px] sm:text-5xl lg:text-[56px] font-serif-luxury font-bold text-[#0F1F45] leading-[1.1]">
              Different lives.
              <br />
              <span className="gold-gradient-text">Different money questions.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
              First salary or family business, we start from where you are today, not from a template.
            </p>
          </motion.div>

          {/* Jump chips */}
          <nav aria-label="Jump to a section" className="mt-9 flex flex-wrap justify-center gap-2.5">
            {AUDIENCES.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="px-4 py-2 rounded-full bg-white border border-[#E4E8F0] text-sm font-semibold text-[#0F1F45] hover:border-[#CBD6EE] hover:text-[#2F5BC7] hover:-translate-y-0.5 transition-all shadow-[0_1px_2px_rgba(15,31,69,0.04)]"
              >
                {a.chip}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {AUDIENCES.map((a, i) => (
        <FeatureRow key={a.id} index={i} {...a} />
      ))}

      {/* Not listed? */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#0F1F45]">Don’t see yourself here?</h2>
          <p className="mt-3 text-[#475569]">
            Most people are a mix of these. Tell us your situation and we’ll shape the plan around it.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/our-process" className="btn-luxury-outline inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm">
              See how we work <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
