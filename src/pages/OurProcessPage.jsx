import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Route, MessageCircle, HandCoins, SlidersHorizontal } from 'lucide-react';
import FeatureRow from '../components/common/FeatureRow';
import {
  IntroCallVisual,
  DiscussionVisual,
  ReviewVisual,
  PlanDocVisual,
  OngoingVisual,
} from '../components/illustrations/AudienceProcessVisuals';

const STEPS = [
  {
    id: 'step-1',
    short: 'Intro Conversation',
    title: 'Intro Conversation',
    lead: 'A short, free call to understand what you want and where you are today. No products, no pressure.',
    points: ['What you want to achieve', 'Your finances, in brief', 'Your questions and concerns', 'Whether we’re the right fit'],
    pointsTitle: 'What we cover',
    outcome: 'Clarity on the next steps',
    Visual: IntroCallVisual,
  },
  {
    id: 'step-2',
    short: 'Detailed Discussion',
    title: 'Detailed Discussion',
    lead: 'We sit down together and look at the full picture: what comes in, what goes out, what you own, what you owe and what you’re planning for.',
    points: ['Income and expenses', 'Investments and loans', 'Family goals and timelines', 'Insurance you already have'],
    pointsTitle: 'What we cover',
    outcome: 'Your complete money snapshot',
    Visual: DiscussionVisual,
  },
  {
    id: 'step-3',
    short: 'Financial Review',
    title: 'Financial Review',
    lead: 'We check what’s working and find the gaps, and explain every one of them in plain language.',
    points: ['Asset mix', 'Health and term cover', 'Emergency fund', 'Tax efficiency'],
    pointsTitle: 'What we check',
    outcome: 'A clear list of what needs fixing',
    Visual: ReviewVisual,
  },
  {
    id: 'step-4',
    short: 'Your Written Plan',
    title: 'Your Written Plan',
    lead: 'Everything comes together in a written plan with clear actions, amounts and timelines, so you know exactly what to do and when.',
    points: ['Investment direction', 'Protection plan', 'Tax-saving plan', 'Step-by-step timeline'],
    pointsTitle: 'What’s inside',
    outcome: 'A plan you can actually follow',
    Visual: PlanDocVisual,
  },
  {
    id: 'step-5',
    short: 'Action & Reviews',
    title: 'Action & Ongoing Reviews',
    lead: 'We help you put the plan into action, then review it every year, or sooner when life changes: a new job, a baby, a move.',
    points: ['Setting up SIPs and cover', 'Yearly reviews', 'Updates after big life events', 'A team you can always reach'],
    pointsTitle: 'What happens',
    outcome: 'A plan that keeps up with your life',
    Visual: OngoingVisual,
  },
];

const PRINCIPLES = [
  { icon: MessageCircle, title: 'Plain language, always', desc: 'No jargon. If something isn’t clear, we explain it again.' },
  { icon: HandCoins, title: 'No pushing products', desc: 'We recommend what fits your plan, not what’s on sale this month.' },
  { icon: SlidersHorizontal, title: 'You stay in control', desc: 'Every decision is yours. We lay out the options and the trade-offs.' },
];

export default function OurProcessPage() {
  return (
    <div className="relative z-10 bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-14 sm:pt-40 sm:pb-16 overflow-hidden bg-gradient-to-b from-[#F4F6FB] to-white">
        <div className="absolute -top-32 left-[-10%] w-[620px] h-[620px] rounded-full bg-[#2F5BC7]/[0.07] blur-[120px] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FB] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
              <Route className="w-3.5 h-3.5 text-[#C9A04F]" /> Our Process
            </span>
            <h1 className="mt-5 text-[36px] sm:text-5xl lg:text-[56px] font-serif-luxury font-bold text-[#0F1F45] leading-[1.1]">
              A clear process.
              <br />
              <span className="gold-gradient-text">No surprises.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-[#475569] max-w-2xl mx-auto leading-relaxed">
              Five simple steps, from our first conversation to reviewing your plan every year. You always know what’s happening, and why.
            </p>
          </motion.div>
        </div>

        {/* Step overview strip */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 mt-12">
          <ol className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-0 sm:rounded-2xl sm:border sm:border-[#E4E8F0] sm:bg-white sm:shadow-[0_1px_2px_rgba(15,31,69,0.04),0_12px_32px_rgba(15,31,69,0.06)] overflow-hidden">
            {STEPS.map((s, i) => (
              <li key={s.id} className={`${i === STEPS.length - 1 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <a
                  href={`#${s.id}`}
                  className={`group flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 h-full p-4 sm:p-5 rounded-2xl sm:rounded-none bg-white border border-[#E4E8F0] sm:border-0 ${
                    i > 0 ? 'sm:border-l sm:border-[#E4E8F0]' : ''
                  } hover:bg-[#F7F8FB] transition-colors`}
                >
                  <span className="w-8 h-8 rounded-full bg-[#1A3170] text-white text-xs font-bold flex items-center justify-center ring-4 ring-[#C9A04F]/20 shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors leading-snug">{s.short}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {STEPS.map((s, i) => (
        <FeatureRow key={s.id} index={i} eyebrow={`Step ${i + 1} of ${STEPS.length}`} {...s} />
      ))}

      {/* Principles */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-[28px] sm:text-[34px] font-serif-luxury font-bold text-[#0F1F45]">What you can expect from us</h2>
            <p className="mt-3 text-[#475569]">The same three things, at every step.</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="glass-card p-6">
                  <span className="w-11 h-11 rounded-xl bg-[#EEF2FB] text-[#2F5BC7] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[#0F1F45]">{p.title}</h3>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to="/who-we-serve" className="btn-luxury-outline inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm">
              See who we work with <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
