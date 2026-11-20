import React from 'react';
import { Pencil } from 'lucide-react';
import { formatRupeesExact } from '../../utils/healthCheckInsights';
import { readField, CORE_RULES, RULES, sectionOrder } from '../../utils/kundli/kundliInputs';
import {
  ASSET_KEYS,
  ASSETS,
  ASSUMPTIONS,
  CORE_CHOICES,
  CORE_FIELDS,
  ESTIMATE_ASSETS,
  GOALS,
  LIABILITIES,
  LIABILITY_KEYS,
  NAV,
  RETIREMENT,
  REVIEW,
  SECTIONS,
  STATES,
  STATUS,
} from '../../utils/kundli/kundliCopy';

const BADGE_STYLE = {
  [STATES.entered]: 'border-[#E4E8F0] bg-white text-[#475569]',
  [STATES.estimate]: 'border-[#C9A04F]/50 bg-[#C9A04F]/10 text-[#A67C2E]',
  [STATES.noneShort]: 'border-[#E4E8F0] bg-[#F7F8FB] text-[#475569]',
  [STATES.notSure]: 'border-[#C9A04F]/50 bg-[#C9A04F]/10 text-[#0F1F45]',
  [STATES.skipped]: 'border-[#C9A04F]/50 bg-[#C9A04F]/10 text-[#0F1F45]',
};

function describe(field, rule, { estimate = false, unit = 'amount' } = {}) {
  const r = readField(field, rule, { required: false });
  if (r.status === 'not-sure') return { value: '—', badge: STATES.notSure };
  if (r.status === 'missing') return { value: '—', badge: STATES.skipped };
  if (r.status === 'none') return { value: unit === 'amount' ? '₹0' : '0', badge: STATES.noneShort };
  const value = unit === 'amount' ? formatRupeesExact(r.value) : unit === 'percent' ? `${r.value}%` : `${r.value} years`;
  return { value, badge: estimate ? STATES.estimate : STATES.entered };
}

/** Rows for one section of the review screen. */
function reviewRows(section, a) {
  const core = (k) => ({ label: CORE_FIELDS[k].label, ...describe(a.fields[k], CORE_RULES[k]) });
  const choice = (k) => ({ label: CORE_CHOICES[k].label, value: CORE_CHOICES[k].options.find((o) => o.value === a[k])?.label || '—', badge: STATES.entered });
  const list = (name, keys, copy, estimates = []) => {
    const l = a[name];
    if (l.skipped) return [{ label: copy.heading, value: '—', badge: STATES.skipped }];
    const ticked = keys.filter((k) => l.ticked[k]);
    if (ticked.length === 0) return [{ label: copy.heading, value: 'None of these', badge: STATES.noneShort }];
    return ticked.map((k) => ({ label: copy.items[k].amountLabel, ...describe(l.amounts[k], RULES.assetAmount, { estimate: estimates.includes(k) }) }));
  };
  switch (section) {
    case 'income':
      return ['income', 'expenses', 'emi', 'other'].map(core);
    case 'savings':
      return ['savings', 'investments'].map(core);
    case 'protection':
      return ['termCover', 'healthCover'].map(core);
    case 'habits':
      return ['overlap', 'business'].map(choice);
    case 'own':
      return list('assets', ASSET_KEYS, ASSETS, ESTIMATE_ASSETS);
    case 'owe':
      return list('liabilities', LIABILITY_KEYS, LIABILITIES);
    case 'goals':
      if (a.goalsGate !== 'yes') return [{ label: SECTIONS.goals, value: REVIEW.notChosen, badge: STATES.noneShort }];
      return a.goals.flatMap((g, i) => {
        const title = g.type === 'other' && g.name ? g.name : GOALS.types.find((t) => t.value === g.type)?.label || GOALS.goalHeading(i + 1);
        return [
          { label: `${title}: cost today`, ...describe(g.cost, RULES.goalCost, { estimate: true }) },
          { label: `${title}: years`, ...describe(g.years, RULES.goalYears, { unit: 'years' }) },
          { label: `${title}: already set aside`, ...describe(g.saved, RULES.goalSaved) },
        ];
      });
    case 'retirement':
      if (a.retGate !== 'yes') return [{ label: SECTIONS.retirement, value: a.retGate === 'retired' ? RETIREMENT.gateRetired : REVIEW.notChosen, badge: STATES.noneShort }];
      return [
        { label: RETIREMENT.age, ...describe(a.ret.age, RULES.age, { unit: 'years' }) },
        { label: RETIREMENT.at, ...describe(a.ret.at, RULES.age, { unit: 'years' }) },
        { label: RETIREMENT.until, ...describe(a.ret.until, RULES.age, { unit: 'years' }) },
        { label: RETIREMENT.spend, ...describe(a.ret.spend, RULES.retSpend, { estimate: true }) },
      ];
    case 'assumptions':
      return [
        { label: ASSUMPTIONS.inf, ...describe(a.asm.inf, RULES.inf, { unit: 'percent' }) },
        { label: ASSUMPTIONS.ret, ...describe(a.asm.ret, RULES.ret, { unit: 'percent' }) },
      ];
    default:
      return [];
  }
}

export default function KundliReview({ a, incomplete, onEdit, onCreate, headingRef }) {
  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="font-serif-luxury text-[26px] font-bold text-[#0F1F45] focus:outline-none">
        {REVIEW.heading}
      </h2>
      {incomplete.length > 0 && (
        <div className="mt-5 rounded-2xl border border-[#C9A04F]/50 bg-[#C9A04F]/10 p-4 sm:p-5">
          <p className="font-bold text-[#0F1F45]">{REVIEW.incompleteHeading}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-[#0F1F45]">
            {incomplete.map((x) => (
              <li key={x.id}>
                {x.name}
                {x.needs.length > 0 ? `: needs ${x.needs.join(', ')}` : ` (${STATUS[x.status]})`}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 grid gap-4">
        {sectionOrder(a).map((s) => (
          <section key={s} className="rounded-2xl border border-[#E4E8F0] bg-white p-4 sm:p-5" aria-labelledby={`rev-${s}`}>
            <div className="flex items-center justify-between gap-3">
              <h3 id={`rev-${s}`} className="font-serif-luxury text-[16.5px] font-bold text-[#0F1F45]">
                {SECTIONS[s]}
              </h3>
              <button
                type="button"
                onClick={() => onEdit(s)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-[14px] font-semibold text-[#2F5BC7] hover:bg-[#EEF2FB]"
                aria-label={`${NAV.edit}: ${SECTIONS[s]}`}
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                {NAV.edit}
              </button>
            </div>
            <dl className="mt-2">
              {reviewRows(s, a).map((row, i) => (
                <div key={i} className="flex flex-col gap-1 border-t border-[#EEF1F6] py-2.5 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <dt className="text-[13.5px] text-[#475569]">{row.label}</dt>
                  <dd className="flex items-baseline gap-2 sm:justify-end">
                    <span className="text-[14.5px] font-semibold tabular-nums text-[#0F1F45]">{row.value}</span>
                    <span className={`rounded-md border px-1.5 py-0.5 text-[11.5px] font-semibold ${BADGE_STYLE[row.badge]}`}>{row.badge}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-6 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)] sm:w-auto"
      >
        {NAV.create}
      </button>
    </div>
  );
}
