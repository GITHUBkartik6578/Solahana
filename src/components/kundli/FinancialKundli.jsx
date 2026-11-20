import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, FileText, ListChecks, ShieldCheck } from 'lucide-react';
import { buildReport } from '../../utils/kundli/kundliReport';
import { firstInvalidScreen, screenOrder, sectionOrder, SCREEN_SECTION, validateScreen } from '../../utils/kundli/kundliInputs';
import { hasAnswers, initialState, kundliReducer } from '../../utils/kundli/kundliState';
import { INTRO, NAV, SECTION_WHY, SECTIONS } from '../../utils/kundli/kundliCopy';
import { readSession, writeHistory, writeSession } from '../../utils/kundli/kundliSession';
import { progressSeries } from '../../utils/kundli/kundliHistory';
import { LoadKundliFile } from './KundliFiles';
import KundliScreen from './KundliScreens';
import { errorLabel, fid } from './kundliIds';
import KundliReview from './KundliReview';
import KundliReport from './KundliReport';
import './kundliPrint.css';

// When a screen drops out of the order (for example, all ticks removed), show the screen it belongs to.
const FALLBACK = { ownAmounts: 'ownList', oweAmounts: 'oweList', assumptions: 'retirement' };
const SECTION_START = { income: 'income', savings: 'savings', protection: 'protection', habits: 'habits', own: 'ownList', owe: 'oweList', goals: 'goals', retirement: 'retirement', assumptions: 'assumptions' };

function Progress({ a, screen }) {
  const sections = sectionOrder(a);
  const current = sections.indexOf(SCREEN_SECTION[screen]);
  const pct = Math.round(((current + 1) / sections.length) * 100);
  return (
    <nav aria-label={NAV.progressLabel} className="kundli-noprint">
      {/* Phone: one line and a bar */}
      <div className="lg:hidden">
        <p className="text-[13px] font-semibold text-[#5B6B84]">
          Section {current + 1} of {sections.length} · <span className="text-[#0F1F45]">{SECTIONS[sections[current]]}</span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E4E8F0]" aria-hidden="true">
          <span className="block h-full rounded-full bg-gradient-to-r from-[#1A3170] to-[#C9A04F] transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {/* Desktop: the full list */}
      <ol className="hidden gap-1 lg:grid">
        {sections.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo';
          return (
            <li key={s} aria-current={state === 'current' ? 'step' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${state === 'current' ? 'bg-[#EEF2FB]' : ''}`}>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                  state === 'done' ? 'bg-[#1A3170] text-white' : state === 'current' ? 'border-2 border-[#C9A04F] bg-white text-[#0F1F45]' : 'border border-[#E4E8F0] bg-white text-[#5B6B84]'
                }`}
              >
                {state === 'done' ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : i + 1}
              </span>
              <span className={`text-[13.5px] font-semibold ${state === 'todo' ? 'text-[#5B6B84]' : 'text-[#0F1F45]'}`}>
                {SECTIONS[s]}
                {state === 'done' && <span className="sr-only"> (done)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ErrorSummary({ errors, summaryRef, a }) {
  const keys = Object.keys(errors);
  if (!keys.length) return null;
  return (
    <div ref={summaryRef} tabIndex={-1} role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 focus:outline-none focus:ring-2 focus:ring-red-300">
      <p className="font-bold text-red-800">{NAV.errorSummary(keys.length)}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-red-800">
        {keys.map((k) => (
          <li key={k}>
            <a
              href={`#${fid(k)}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(fid(k))?.focus();
              }}
              className="underline underline-offset-2"
            >
              {errorLabel(k, a) ? `${errorLabel(k, a)}: ` : ''}
              {errors[k]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Intro({ onStart, onResume, onStartOver, headingRef, fileProps }) {
  const cards = [
    { Icon: FileText, text: INTRO.body },
    { Icon: ShieldCheck, text: INTRO.privacy },
    { Icon: ListChecks, text: INTRO.missing },
  ];
  return (
    <div className="mx-auto max-w-[860px]">
      <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#A67C2E]">{INTRO.eyebrow}</p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-3 font-serif-luxury text-[32px] font-bold leading-tight text-[#0F1F45] focus:outline-none sm:text-[42px]">
        {INTRO.title}
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(({ Icon, text }, i) => (
          <div key={i} className="rounded-2xl border border-[#E4E8F0] bg-white p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2FB] text-[#1A3170]">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-[14.5px] leading-relaxed text-[#475569]">{text}</p>
          </div>
        ))}
      </div>
      {onResume ? (
        <div className="mt-8">
          <p className="text-[14px] text-[#475569]">{INTRO.resumeNote}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onResume}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-8 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)]"
            >
              {INTRO.resume}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={onStartOver} className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-[#E4E8F0] bg-white px-6 text-[15px] font-semibold text-[#0F1F45] hover:border-[#2F5BC7]/50">
              {NAV.startOver}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onStart}
          className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-8 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)] sm:w-auto"
        >
          {INTRO.start}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      {!onResume && <LoadKundliFile {...fileProps} />}
    </div>
  );
}

/**
 * The Financial Kundli: questionnaire, review and report on one route. Answers live only in JavaScript memory (this
 * component, mirrored in kundliSession.js so a trip to another page in the same tab does not lose them).
 * Each screen is a browser-history entry (the history state holds only the screen name and a per-visit id, never an
 * answer), so the browser Back button moves between screens without leaving the page.
 */
export default function FinancialKundli() {
  const [a, dispatch] = useReducer(kundliReducer, undefined, () => readSession().answers || initialState());
  const [errors, setErrors] = useState({});
  // A per-visit id, so a screen name left in browser history by an earlier visit is never reused
  const [sid] = useState(() => readSession().sid || Math.random().toString(36).slice(2));
  // Earlier Kundlis from the customer's own file (memory only), for the growth charts
  const [history, setHistory] = useState(() => readSession().history || []);
  useEffect(() => {
    writeHistory(history);
  }, [history]);
  useEffect(() => {
    writeSession(a, sid);
  }, [a, sid]);
  const navigate = useNavigate();
  const location = useLocation();
  const headingRef = useRef(null);
  const summaryRef = useRef(null);
  const topRef = useRef(null);

  const st = location.state && location.state.kundli;
  const fromReview = !!(st && st.sid === sid && st.fromReview);
  const order = screenOrder(a);
  let screen = st && st.sid === sid ? st.screen : 'intro';
  if (!order.includes(screen)) screen = FALLBACK[screen] || 'intro';
  if (screen === 'review' || screen === 'report') screen = firstInvalidScreen(a) || screen;

  const goTo = (next, opts = {}) => {
    setErrors({});
    navigate(location.pathname, { state: { kundli: { sid, screen: next, fromReview: !!opts.fromReview } }, replace: !!opts.replace });
  };

  // Move focus to the new screen's heading and bring it into view (not on the first load: the page starts at the top)
  const firstScreen = useRef(true);
  useEffect(() => {
    if (firstScreen.current) {
      firstScreen.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
    topRef.current?.scrollIntoView({ block: 'start' });
  }, [screen]);

  // Once errors are showing, keep them in step with the answers: a fixed answer loses its message straight away
  const showingErrors = Object.keys(errors).length > 0;
  useEffect(() => {
    if (showingErrors) setErrors(validateScreen(screen, a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a]);

  // Warn before a refresh or tab close would lose the answers
  const dirty = hasAnswers(a);
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const report = useMemo(() => (screen === 'review' || screen === 'report' ? buildReport(a) : null), [a, screen]);
  const progress = useMemo(() => (screen === 'report' ? progressSeries(history, a) : null), [history, a, screen]);

  const onContinue = () => {
    const errs = validateScreen(screen, a);
    if (Object.keys(errs).length) {
      setErrors(errs);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    if (fromReview) {
      const bad = firstInvalidScreen(a);
      goTo(bad || 'review', { fromReview: !!bad });
      return;
    }
    goTo(order[order.indexOf(screen) + 1]);
  };
  const onBack = () => goTo(fromReview ? 'review' : order[order.indexOf(screen) - 1]);
  const onStartOver = () => {
    if (!window.confirm(NAV.startOverConfirm)) return;
    dispatch({ type: 'reset' });
    setHistory([]);
    goTo('intro', { replace: true });
  };

  const section = SCREEN_SECTION[screen];
  const sections = sectionOrder(a);

  return (
    <div ref={topRef} className="kundli-root scroll-mt-28">
      <p className="sr-only" aria-live="polite">
        {section ? `Section ${sections.indexOf(section) + 1} of ${sections.length}: ${SECTIONS[section]}` : ''}
      </p>
      {screen === 'intro' && (
        <Intro
          onStart={() => goTo('income')}
          onResume={dirty ? () => goTo(firstInvalidScreen(a) || 'review') : null}
          onStartOver={onStartOver}
          headingRef={headingRef}
          fileProps={{
            history,
            onLoaded: setHistory,
            onUseLatest: () => {
              dispatch({ type: 'load', answers: history[history.length - 1].answers });
              goTo('review');
            },
            onStartEmpty: () => goTo('income'),
          }}
        />
      )}

      {section && (
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Progress a={a} screen={screen} />
          </aside>
          <div className="min-w-0 max-w-[720px]">
            <h2 ref={headingRef} tabIndex={-1} className="font-serif-luxury text-[24px] font-bold text-[#0F1F45] focus:outline-none sm:text-[28px]">
              {SECTIONS[section]}
            </h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#5B6B84]">{SECTION_WHY[section]}</p>
            <form
              noValidate
              className="mt-7"
              onSubmit={(e) => {
                e.preventDefault();
                onContinue();
              }}
            >
              <ErrorSummary errors={errors} summaryRef={summaryRef} a={a} />
              <KundliScreen screen={screen} a={a} dispatch={dispatch} errors={errors} />
              <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={onBack} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#E4E8F0] bg-white px-5 text-[14.5px] font-semibold text-[#0F1F45] hover:border-[#2F5BC7]/50">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  {fromReview ? NAV.backToReview : NAV.back}
                </button>
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-7 text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)]"
                >
                  {order[order.indexOf(screen) + 1] === 'review' || fromReview ? NAV.review : NAV.next}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {screen === 'review' && report && (
        <div className="mx-auto max-w-[860px]">
          <KundliReview a={a} incomplete={report.summary.incomplete} headingRef={headingRef} onEdit={(s) => goTo(SECTION_START[s], { fromReview: true })} onCreate={() => goTo('report')} />
        </div>
      )}

      {screen === 'report' && report && <KundliReport report={report} progress={progress} history={history} answers={a} onStartOver={onStartOver} headingRef={headingRef} />}
    </div>
  );
}
