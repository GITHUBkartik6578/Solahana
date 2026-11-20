import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Landmark, PiggyBank, ShieldCheck, Target } from 'lucide-react';
import { INTRO, TEASER } from '../../utils/kundli/kundliCopy';

/**
 * The Financial Health Check-up entry on the Calculators page (it replaces the earlier 3-step check-up section).
 * The old "#health-check" anchor is kept on this section so existing links still land here.
 */
export default function KundliTeaser() {
  const points = [
    { Icon: PiggyBank, text: TEASER.points[0] },
    { Icon: Landmark, text: TEASER.points[1] },
    { Icon: ShieldCheck, text: TEASER.points[2] },
    { Icon: Target, text: TEASER.points[3] },
  ];
  return (
    <section id="financial-health-checkup" className="relative scroll-mt-[80px] overflow-hidden border-y border-[#E4E8F0] bg-[#F7F8FB] py-16 sm:py-20 lg:py-24">
      <span id="health-check" className="absolute -top-20" aria-hidden="true" />
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#A67C2E]">{INTRO.eyebrow}</p>
            <h2 className="mt-3 font-serif-luxury text-[30px] font-bold leading-tight text-[#0F1F45] sm:text-[38px]">{TEASER.title}</h2>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[#475569]">{INTRO.body}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5B6B84]">{INTRO.privacy}</p>
            <Link
              to="/financial-health-checkup"
              className="mt-7 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-8 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)] transition-transform hover:scale-[1.02]"
            >
              {TEASER.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {points.map(({ Icon, text }) => (
              <li key={text} className="rounded-2xl border border-[#E4E8F0] bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FB] text-[#1A3170]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="mt-3 text-[14.5px] font-semibold leading-snug text-[#0F1F45]">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
