import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown, Info, Printer, RotateCcw } from 'lucide-react';
import KundliCallback from './KundliCallback';
import { AssetsChart, CashFlowChart, GoalChart, RetirementChart, StandingChart } from './KundliCharts';
import { AtAGlance, ProgressCharts } from './KundliGrowth';
import { SaveKundliFile } from './KundliFiles';
import { shortDate } from '../../utils/kundli/kundliDates';
import { DISCLOSURES, HOW, NAV, REPORT, STATUS, TAG_MEANING, TAGS } from '../../utils/kundli/kundliCopy';

const STATUS_STYLE = {
  complete: 'border-[#2F5BC7]/30 bg-[#EEF2FB] text-[#1A3170]',
  incomplete: 'border-[#C9A04F]/50 bg-[#C9A04F]/10 text-[#0F1F45]',
  'out-of-range': 'border-[#C9A04F]/50 bg-[#C9A04F]/10 text-[#0F1F45]',
  unavailable: 'border-red-200 bg-red-50 text-red-800',
  'not-applicable': 'border-[#E4E8F0] bg-[#F7F8FB] text-[#475569]',
  'not-chosen': 'border-[#E4E8F0] bg-[#F7F8FB] text-[#475569]',
};

const LABEL_STYLE = {
  Priority: 'border-red-200 bg-red-50 text-red-800',
  'Worth Reviewing': 'border-[#C9A04F]/50 bg-[#C9A04F]/10 text-[#0F1F45]',
  'Good Practice': 'border-[#2F5BC7]/30 bg-[#EEF2FB] text-[#1A3170]',
  [REPORT.planningPoint]: 'border-[#C9A04F]/50 bg-white text-[#A67C2E]',
};

function StatusChip({ status }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[12px] font-bold ${STATUS_STYLE[status] || STATUS_STYLE.incomplete}`}>{STATUS[status]}</span>;
}

function Tag({ tag }) {
  if (!tag) return null;
  return <span className="kundli-tag inline-block rounded-md border border-[#E4E8F0] bg-[#F7F8FB] px-1.5 py-0.5 text-[11.5px] font-semibold text-[#5B6B84]">{TAGS[tag]}</span>;
}

function FigureRow({ f }) {
  return (
    <div className="flex flex-col gap-1 border-t border-[#EEF1F6] py-3 first:border-t-0 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="text-[14px] text-[#475569]">{f.label}</dt>
      <dd className="flex flex-wrap items-baseline gap-2 sm:justify-end">
        <span className={`font-serif-luxury text-[16px] font-bold tabular-nums ${f.hidden ? 'text-[#5B6B84]' : 'text-[#0F1F45]'}`}>{f.display}</span>
        <Tag tag={f.tag} />
      </dd>
    </div>
  );
}

const MSG_STYLE = {
  warn: { box: 'border-red-200 bg-red-50 text-red-900', Icon: AlertTriangle },
  good: { box: 'border-[#2F5BC7]/30 bg-[#EEF2FB] text-[#1A3170]', Icon: CheckCircle2 },
  info: { box: 'border-[#E4E8F0] bg-[#F7F8FB] text-[#475569]', Icon: Info },
  note: { box: 'border-[#E4E8F0] bg-white text-[#475569]', Icon: Info },
  status: { box: 'border-[#C9A04F]/40 bg-[#C9A04F]/10 text-[#0F1F45]', Icon: Info },
};

function Messages({ list }) {
  if (!list?.length) return null;
  return (
    <ul className="mt-3 grid gap-2">
      {list.map((m, i) => {
        const s = MSG_STYLE[m.kind] || MSG_STYLE.note;
        return (
          <li key={i} className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13.5px] leading-relaxed ${s.box}`}>
            <s.Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{m.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function How({ id }) {
  const [open, setOpen] = useState(false);
  if (!HOW[id]) return null;
  return (
    <div className="mt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`how-${id}`}
        onClick={() => setOpen((v) => !v)}
        className="kundli-noprint inline-flex min-h-[40px] items-center gap-1.5 text-[13px] font-semibold text-[#2F5BC7]"
      >
        {REPORT.howCalculated}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <p id={`how-${id}`} className={`${open ? 'block' : 'hidden'} kundli-how mt-1 text-[13px] leading-relaxed text-[#5B6B84]`}>
        {HOW[id]}
      </p>
    </div>
  );
}

function ModuleCard({ m, wide, charts }) {
  return (
    <section aria-labelledby={`mod-${m.id}`} className={`kundli-card rounded-2xl border border-[#E4E8F0] bg-white p-5 sm:p-6 ${wide ? 'lg:col-span-2' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 id={`mod-${m.id}`} className="font-serif-luxury text-[18px] font-bold text-[#0F1F45]">
          {REPORT.moduleNames[m.id]}
        </h3>
        <StatusChip status={m.status} />
      </div>
      {m.id === 'goals' ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {m.goals.map((g) => (
            <div key={g.id} className="kundli-card rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] p-4">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-serif-luxury text-[15.5px] font-bold text-[#0F1F45]">{g.title}</h4>
                <StatusChip status={g.status} />
              </div>
              {g.figures.length > 0 && <dl className="mt-3">{g.figures.map((f) => <FigureRow key={f.key} f={f} />)}</dl>}
              <Messages list={g.messages} />
              <GoalChart path={charts?.goals?.[g.id]} title={g.title} />
            </div>
          ))}
        </div>
      ) : (
        m.figures.length > 0 && <dl className="mt-4">{m.figures.map((f) => <FigureRow key={f.key} f={f} />)}</dl>
      )}
      <Messages list={m.messages} />
      {m.id === 'cashFlow' && <CashFlowChart data={charts?.cashFlow} />}
      {m.id === 'netWorth' && <AssetsChart data={charts?.assets} />}
      {m.id === 'retirement' && <RetirementChart path={charts?.retirement} />}
      {(m.id === 'goals' || m.id === 'retirement') && m.status !== 'not-chosen' && m.status !== 'not-applicable' && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[12.5px] leading-relaxed text-[#5B6B84]">
          <li>{DISCLOSURES.sipTiming}</li>
          <li>{DISCLOSURES.savedGrowth}</li>
          {m.id === 'goals' && <li>{DISCLOSURES.goalOngoing}</li>}
          {m.id === 'retirement' && (
            <>
              <li>{DISCLOSURES.retSpending}</li>
              <li>{DISCLOSURES.sameReturn}</li>
              <li>{DISCLOSURES.epf}</li>
            </>
          )}
        </ul>
      )}
      <How id={m.id} />
    </section>
  );
}

function ScoreCard({ score }) {
  if (score.status !== 'complete') {
    return (
      <section className="kundli-card rounded-2xl border border-[#E4E8F0] bg-white p-5 sm:p-6" aria-labelledby="kundli-score">
        <h2 id="kundli-score" className="font-serif-luxury text-[20px] font-bold text-[#0F1F45]">
          {REPORT.scoreHeading}
        </h2>
        <Messages list={[{ kind: 'status', text: score.text }]} />
      </section>
    );
  }
  return (
    <section className="kundli-card rounded-2xl border border-[#E4E8F0] bg-white p-5 sm:p-6" aria-labelledby="kundli-score">
      <div className="grid gap-6 md:grid-cols-[220px_1fr] md:items-start">
        <div className="text-center md:text-left">
          <h2 id="kundli-score" className="font-serif-luxury text-[18px] font-bold text-[#0F1F45]">
            {REPORT.scoreHeading}
          </h2>
          <p className="mt-3 font-serif-luxury text-[52px] font-bold leading-none tabular-nums text-[#0F1F45]">
            {score.score}
            <span className="text-[18px] font-semibold text-[#5B6B84]"> / 100</span>
          </p>
          <p className="mt-2 text-[15px] font-bold text-[#1A3170]">{score.bandTitle}</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[#5B6B84]">{score.note}</p>
        </div>
        <div>
          <h3 className="font-serif-luxury text-[17px] font-bold text-[#0F1F45]">{REPORT.areasHeading}</h3>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[#475569]">{score.bandLine}</p>
          {score.areas.length === 0 ? (
            <p className="mt-3 text-[14px] text-[#475569]">{REPORT.areasNone}</p>
          ) : (
            <ul className="mt-3 grid gap-2.5">
              {score.areas.map((x) => (
                <li key={x.id} className="rounded-xl border border-[#E4E8F0] bg-[#FEFDF9] px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11.5px] font-bold ${LABEL_STYLE[x.label] || LABEL_STYLE['Good Practice']}`}>{x.label}</span>
                    <span className="text-[14.5px] font-bold text-[#0F1F45]">{x.title}</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#475569]">{x.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/** The full Financial Kundli report (screen and print). `report` comes from buildReport. */
export default function KundliReport({ report, onStartOver, headingRef, progress, history = [], answers }) {
  const now = progress?.length ? progress[progress.length - 1] : null;
  const prev = progress?.length > 1 ? progress[progress.length - 2] : null;
  const { summary } = report;
  const modules = report.modules;
  return (
    <div className="kundli-report">
      {/* Print-only cover */}
      <div className="kundli-print-only kundli-cover">
        <img src="/solahana-logo.png" alt="SOLAHANA" className="h-12 w-auto" />
        <h1 className="mt-6 font-serif-luxury text-[34px] font-bold text-[#0F1F45]">{REPORT.title}</h1>
        <p className="mt-2 text-[14px] text-[#475569]">
          {REPORT.dateLabel} {report.date}
        </p>
        <p className="mt-2 text-[14px] text-[#475569]">{summary.text}</p>
        <p className="mt-10 text-[13px] text-[#475569]">{REPORT.printPrivacy}</p>
      </div>

      {/* On paper the cover page already carries the title and date */}
      <header className="kundli-noprint flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="font-serif-luxury text-[28px] font-bold text-[#0F1F45] focus:outline-none sm:text-[32px]">
            {REPORT.title}
          </h2>
          <p className="mt-1 text-[14px] text-[#5B6B84]">
            {REPORT.subtitle} {REPORT.dateLabel} {report.date}.
          </p>
        </div>
        <div className="kundli-noprint flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-5 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(26,49,112,0.25)]"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            {NAV.print}
          </button>
          <button type="button" onClick={onStartOver} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#E4E8F0] bg-white px-5 text-[14px] font-semibold text-[#0F1F45] hover:border-[#2F5BC7]/50">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {NAV.startOver}
          </button>
        </div>
      </header>

      {answers && (
        <div className="mt-4">
          <SaveKundliFile history={history} answers={answers} />
        </div>
      )}

      {now && (
        <div className="mt-6">
          <AtAGlance now={now} prev={prev} />
        </div>
      )}

      {progress?.length > 1 && (
        <div className="mt-6">
          <ProgressCharts series={progress} />
        </div>
      )}

      <section className="kundli-card mt-6 rounded-2xl border border-[#E4E8F0] bg-[#F7F8FB] p-5" aria-label={summary.text}>
        <p className="font-serif-luxury text-[18px] font-bold text-[#0F1F45]">{summary.text}</p>
        <p className="mt-1 text-[13px] text-[#5B6B84]">{REPORT.summaryNote}</p>
        {summary.incomplete.length > 0 && (
          <ul className="mt-3 grid gap-1.5 text-[13.5px] text-[#475569]">
            {summary.incomplete.map((x) => (
              <li key={x.id}>
                <a href={`#mod-${x.id}`} className="font-semibold text-[#2F5BC7] underline-offset-4 hover:underline">
                  {x.name}
                </a>
                {' · '}
                {STATUS[x.status]}
                {x.needs.length > 0 && ` · ${REPORT.needsPrefix} ${x.needs.join(', ')}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6">
        <ScoreCard score={report.score} />
      </div>

      {report.charts?.standing?.length > 0 && (
        <div className="mt-6">
          <StandingChart rows={report.charts.standing} prev={prev?.standing} prevDate={prev ? shortDate(prev.date) : null} />
        </div>
      )}

      {report.score.status === 'complete' && (
        <div className="mt-6">
          <KundliCallback result={report.score.result} />
        </div>
      )}

      <h2 className="mt-10 font-serif-luxury text-[22px] font-bold text-[#0F1F45]">{REPORT.modulesHeading}</h2>
      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {modules
          .filter((m) => m.status !== 'not-chosen')
          .map((m) => (
            <ModuleCard key={m.id} m={m} wide={m.id === 'goals' || m.id === 'retirement'} charts={report.charts} />
          ))}
      </div>

      <section className="kundli-card kundli-break mt-10 rounded-2xl border border-[#E4E8F0] bg-white p-5 sm:p-6" aria-labelledby="kundli-assumptions">
        <h2 id="kundli-assumptions" className="font-serif-luxury text-[20px] font-bold text-[#0F1F45]">
          {REPORT.assumptionsHeading}
        </h2>
        <h3 className="mt-5 text-[15px] font-bold text-[#0F1F45]">{REPORT.legendHeading}</h3>
        <dl className="mt-2 grid gap-2 sm:grid-cols-2">
          {Object.keys(TAGS).map((k) => (
            <div key={k} className="flex items-baseline gap-2">
              <dt>
                <Tag tag={k} />
              </dt>
              <dd className="text-[13px] text-[#475569]">{TAG_MEANING[k]}</dd>
            </div>
          ))}
        </dl>
        {report.rates && (
          <>
            <h3 className="mt-6 text-[15px] font-bold text-[#0F1F45]">{REPORT.yourRates}</h3>
            <ul className="mt-2 text-[13.5px] text-[#475569]">
              <li>Yearly rise in prices: {report.rates.inf} (your assumption)</li>
              <li>Yearly return: {report.rates.ret} (your assumption)</li>
            </ul>
          </>
        )}
        <h3 className="mt-6 text-[15px] font-bold text-[#0F1F45]">{REPORT.disclosuresHeading}</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-[#475569]">
          <li>{DISCLOSURES.rounding}</li>
          {report.showProjectionDisclosures && (
            <>
              <li>{DISCLOSURES.sipTiming}</li>
              <li>{DISCLOSURES.savedGrowth}</li>
            </>
          )}
          <li>{DISCLOSURES.cash}</li>
          <li>{DISCLOSURES.business}</li>
        </ul>
        <p className="mt-6 text-[12px] text-[#5B6B84]">{REPORT.versionLine(report.date)}</p>
        <p className="mt-3 text-[12.5px] leading-relaxed text-[#5B6B84]">{REPORT.disclaimer}</p>
      </section>
      <p className="kundli-print-only kundli-print-footer">{REPORT.printFooter}</p>
    </div>
  );
}

