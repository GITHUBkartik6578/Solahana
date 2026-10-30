import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowLeft, RotateCcw, Check, AlertTriangle, Info, Loader2, Minus, Phone, ShieldCheck, User } from 'lucide-react';
import healthCheckService from '../../services/healthCheckService';
import { AmountAnnouncer, ConsentHint, ConsentText, RetentionNote } from './healthCheckParts';
import { scrollToConsultation } from '../../utils/consultation';
import { formatInr, parseAmount, wasAmountRounded } from '../../utils/hlvCalculator';
import {
  CATEGORY_IDS,
  CATEGORY_MAX,
  MONEY_FIELDS,
  buildLeadPayload,
  isValidMobile,
  scoreHealthCheck,
  validateInputs,
} from '../../utils/financialHealthCheck';
import {
  BANDS,
  BUTTONS,
  CALLBACK,
  CATEGORY_LABELS,
  CHOICES,
  DISCLAIMER,
  FIELDS,
  HEADER,
  NEW_MICROCOPY,
  STEPS,
  normalizationNote,
  observationFor,
} from '../../utils/financialHealthCheckCopy';

// Which fields belong to which step
const STEP_FIELDS = [['income', 'expenses', 'emi'], ['savings', 'termCover', 'healthCover'], ['investments', 'overlap', 'business']];

const EMPTY = { income: '', expenses: '', emi: '', savings: '', termCover: '', healthCover: '', investments: '', overlap: '', business: '' };

// Band presentation uses the site palette: royal/navy for strong, logo gold for good, the site's error red for attention
const BAND_STYLE = {
  strong: { from: '#2F5BC7', to: '#1A3170', chip: 'bg-[#EEF2FB] text-[#1A3170] border-[#2F5BC7]/30' },
  good: { from: '#E6C27A', to: '#A67C2E', chip: 'bg-[#C9A04F]/10 text-[#0F1F45] border-[#C9A04F]/45' },
  attention: { from: '#DC2626', to: '#B91C1C', chip: 'bg-red-50 text-red-700 border-red-200' },
};

const inputBase =
  'w-full rounded-xl border bg-white px-4 py-3.5 text-[15px] text-[#0F1F45] transition-colors focus:outline-none focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25';
const cardBase = 'rounded-2xl border border-[#E4E8F0] bg-[#FEFDF9]';

/** The amount a person typed, written back in plain form ("50k" -> "₹50,000"). Empty when it can't be read yet. */
function amountEcho(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  const n = parseAmount(raw);
  if (!Number.isFinite(n) || n < 0 || wasAmountRounded(raw)) return '';
  return formatInr(n);
}

/** 0 up to `target`, easing out; shows the final number straight away when the visitor prefers reduced motion. */
function useCountUp(target, reduce) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (reduce) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 900);
      setValue(Math.round(target * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduce]);
  return reduce ? target : value;
}

function ErrorText({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-2 text-sm font-medium text-red-600">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

function Stepper({ step, finished }) {
  return (
    <ol aria-label={NEW_MICROCOPY.progressLabel} className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((s, i) => {
        const state = finished || i < step ? 'done' : i === step ? 'current' : 'todo';
        const short = s.label.split(': ')[1] || s.label;
        return (
          <React.Fragment key={s.id}>
            <li aria-current={state === 'current' ? 'step' : undefined} className="flex items-center gap-2.5 min-w-0">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors duration-300 ${
                  state === 'done'
                    ? 'bg-[#1A3170] text-white shadow-[0_4px_10px_rgba(26,49,112,0.28)]'
                    : state === 'current'
                      ? 'border-2 border-[#C9A04F] bg-white text-[#0F1F45] shadow-[0_0_0_4px_rgba(201,160,79,0.14)]'
                      : 'border border-[#E4E8F0] bg-white text-[#8A96AB]'
                }`}
              >
                {state === 'done' ? <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> : i + 1}
              </span>
              <span className={`hidden sm:block truncate text-[13px] font-semibold ${state === 'todo' ? 'text-[#8A96AB]' : 'text-[#0F1F45]'}`}>{short}</span>
            </li>
            {i < STEPS.length - 1 && (
              <span aria-hidden="true" className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-[#E4E8F0]">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#1A3170] to-[#C9A04F] transition-[width] duration-500"
                  style={{ width: finished || i < step ? '100%' : '0%' }}
                />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
}

function ScoreGauge({ result, reduce }) {
  const style = BAND_STYLE[result.band];
  const shown = useCountUp(result.score, reduce);
  const R = 50;
  const CIRC = 2 * Math.PI * R;
  const gid = `hc-ring-${result.band}`;
  return (
    <div className="mx-auto w-full max-w-[220px]">
      <div className="relative aspect-square" role="img" aria-label={`${NEW_MICROCOPY.scoreRingLabel}: ${result.score}`}>
        <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={style.from} />
              <stop offset="100%" stopColor={style.to} />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={R} fill="none" stroke="#EEF1F6" strokeWidth="11" />
          <motion.circle
            cx="60" cy="60" r={R} fill="none" stroke={`url(#${gid})`} strokeWidth="11" strokeLinecap="round"
            strokeDasharray={CIRC}
            transform="rotate(-90 60 60)"
            initial={{ strokeDashoffset: reduce ? CIRC * (1 - result.score / 100) : CIRC }}
            animate={{ strokeDashoffset: CIRC * (1 - result.score / 100) }}
            transition={{ duration: reduce ? 0 : 0.9, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif-luxury text-[44px] font-bold leading-none tabular-nums text-[#0F1F45]">{shown}</span>
          <span className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A96AB]">out of 100</span>
        </div>
      </div>
    </div>
  );
}

/** A three-part scale (0-49, 50-79, 80-100, as in the approved bands) with a marker at the score. */
function BandScale({ score }) {
  return (
    <div className="mt-6" aria-hidden="true">
      <div className="relative">
        <div className="flex h-2 overflow-hidden rounded-full">
          <span className="bg-red-500/25" style={{ width: '50%' }} />
          <span className="bg-[#C9A04F]/45" style={{ width: '30%' }} />
          <span className="bg-[#2F5BC7]/35" style={{ width: '20%' }} />
        </div>
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0F1F45] bg-white shadow-[0_2px_6px_rgba(15,31,69,0.3)]"
          style={{ left: `${score}%` }}
        />
      </div>
      <div className="relative mt-2 h-4 text-[10px] font-semibold tabular-nums text-[#8A96AB]">
        {[[0, '0'], [50, '50'], [80, '80'], [100, '100']].map(([at, label]) => (
          <span key={at} className="absolute -translate-x-1/2" style={{ left: `${at}%` }}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function BreakdownRow({ id, points, emiNote }) {
  const max = CATEGORY_MAX[id];
  const applies = points !== null;
  const state = !applies ? 'na' : points === max ? 'full' : points === 0 ? 'zero' : 'partial';
  const ratio = applies ? points / max : 0;
  const icon = {
    full: <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2F5BC7] text-white"><Check className="h-3.5 w-3.5" strokeWidth={3.5} aria-hidden="true" /></span>,
    partial: <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A04F]/20 text-[#A67C2E]"><AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /></span>,
    zero: <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-600"><AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /></span>,
    na: <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EEF1F6] text-[#5B6B84]"><Minus className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /></span>,
  }[state];
  return (
    <li className="rounded-2xl border border-[#E4E8F0] bg-white p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-serif-luxury text-[15px] font-bold text-[#0F1F45]">{CATEGORY_LABELS[id]}</p>
            <p className="shrink-0 text-sm font-bold tabular-nums text-[#0F1F45]">
              {applies ? <>{points}<span className="font-semibold text-[#8A96AB]"> / {max}</span></> : NEW_MICROCOPY.notApplicablePoints}
            </p>
          </div>
          <div aria-hidden="true" className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#EEF1F6]">
            {applies && ratio > 0 && (
              <span
                className={`block h-full rounded-full ${state === 'full' ? 'bg-gradient-to-r from-[#2F5BC7] to-[#1A3170]' : 'bg-gradient-to-r from-[#E6C27A] to-[#C9A04F]'}`}
                style={{ width: `${ratio * 100}%` }}
              />
            )}
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-[#475569]">{observationFor(id, points)}</p>
          {emiNote && <p className="mt-2 text-[13px] leading-relaxed text-[#5B6B84]">{emiNote}</p>}
        </div>
      </div>
    </li>
  );
}

export default function HealthCheck() {
  const reduce = useReducedMotion();
  // The amounts live only in this component's state: they are never put in a payload, storage, URL or log.
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [emiAboveIncome, setEmiAboveIncome] = useState(false); // browser-only, from the typed amounts

  const [contact, setContact] = useState({ fullName: '', phone: '' });
  const [consent, setConsent] = useState(false); // never pre-ticked
  const [contactErrors, setContactErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sent, setSent] = useState(false);
  const inFlight = useRef(false);

  // What a screen reader hears when a typed amount changes ("Monthly in-hand income: ₹80,000"), after a short pause in typing
  const [announcement, setAnnouncement] = useState('');
  const announceTimer = useRef(null);
  const announceAmount = (field, value) => {
    clearTimeout(announceTimer.current);
    const echo = amountEcho(value);
    announceTimer.current = setTimeout(() => setAnnouncement(echo ? `${FIELDS[field].label}: ${echo}` : ''), 700);
  };
  const clearAnnouncement = () => {
    clearTimeout(announceTimer.current);
    setAnnouncement('');
  };
  useEffect(() => () => clearTimeout(announceTimer.current), []);

  // Move keyboard and screen-reader focus to the new heading after the visitor changes step (not on first load)
  const headingRef = useRef(null);
  const moved = useRef(false);
  // Only the entering view counts: the leaving view also reports "animation complete" when it fades out
  const focusHeading = (definition) => {
    if (definition?.opacity !== 1 || !moved.current) return;
    moved.current = false;
    headingRef.current?.focus();
  };

  const setValue = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const focusField = (field) => {
    const el = field in MONEY_FIELDS ? document.getElementById(`hc-${field}`) : document.querySelector(`input[name="hc-${field}"]`);
    el?.focus();
  };

  const goNext = () => {
    const check = validateInputs(values);
    const stepErrors = {};
    STEP_FIELDS[step].forEach((field) => {
      if (check.errors[field]) stepErrors[field] = check.errors[field];
    });
    setErrors(stepErrors);
    const firstBad = STEP_FIELDS[step].find((field) => stepErrors[field]);
    if (firstBad) {
      requestAnimationFrame(() => focusField(firstBad));
      return;
    }
    moved.current = true;
    clearAnnouncement();
    if (step < STEP_FIELDS.length - 1) {
      setStep(step + 1);
      return;
    }
    if (check.ok) {
      setEmiAboveIncome(check.values.emi > check.values.income);
      setResult(scoreHealthCheck(check.values));
    }
  };

  const goBack = () => {
    moved.current = true;
    clearAnnouncement();
    setErrors({});
    setStep(step - 1);
  };

  const restart = () => {
    moved.current = true;
    clearAnnouncement();
    setStep(0);
    setValues(EMPTY);
    setErrors({});
    setResult(null);
    setEmiAboveIncome(false);
    setConsent(false);
    setContactErrors({});
    setSendError('');
    setSent(false);
  };

  const submitCallback = async (e) => {
    e.preventDefault();
    if (inFlight.current || sent) return;
    const payload = buildLeadPayload({ fullName: contact.fullName, phone: contact.phone, result });
    const next = {};
    if (payload.fullName.length < 2) next.fullName = CALLBACK.nameError;
    if (!isValidMobile(payload.phone)) next.phone = CALLBACK.phoneError;
    if (!consent) next.consent = NEW_MICROCOPY.consentError;
    setContactErrors(next);
    if (Object.keys(next).length) return;

    inFlight.current = true;
    setSending(true);
    setSendError('');
    try {
      await healthCheckService.submitCallback(payload);
      setSent(true); // only reached after an HTTP 201
    } catch {
      setSendError(CALLBACK.failure);
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  };

  const slide = reduce ? 0 : 14;
  const dur = reduce ? 0 : 0.25;

  const renderMoneyField = (field) => {
    const copy = FIELDS[field];
    const error = errors[field];
    const echo = amountEcho(values[field]);
    return (
      <div key={field} className={`${cardBase} p-4 sm:p-5`}>
        <label htmlFor={`hc-${field}`} className="block font-serif-luxury text-[15px] font-bold text-[#0F1F45]">{copy.label}</label>
        <p id={`hc-${field}-help`} className="mt-1 text-[13px] leading-relaxed text-[#5B6B84]">{copy.help}</p>
        <div className="relative mt-3">
          <span
            className="absolute inset-y-0 left-0 flex w-11 items-center justify-center rounded-l-xl border-r border-[#C9A04F]/30 bg-[#C9A04F]/10 text-[15px] font-semibold text-[#A67C2E]"
            aria-hidden="true"
          >
            ₹
          </span>
          <input
            id={`hc-${field}`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            enterKeyHint="next"
            maxLength={24}
            value={values[field]}
            onChange={(e) => { setValue(field, e.target.value); announceAmount(field, e.target.value); }}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={`hc-${field}-help${echo && !error ? ` hc-${field}-echo` : ''}${error ? ` hc-${field}-err` : ''}`}
            className={`${inputBase} pl-14 ${error ? 'border-red-400 bg-red-50/40' : 'border-[#E4E8F0]'}`}
          />
        </div>
        {echo && !error && (
          <p id={`hc-${field}-echo`} className="mt-2 text-[13px] font-semibold tabular-nums text-[#1A3170]">
            {NEW_MICROCOPY.amountEchoPrefix}{echo}
          </p>
        )}
        <ErrorText id={`hc-${field}-err`}>{error}</ErrorText>
      </div>
    );
  };

  const renderChoice = (field) => {
    const copy = CHOICES[field];
    const error = errors[field];
    return (
      <fieldset key={field} className={`${cardBase} p-4 sm:p-5`} aria-describedby={error ? `hc-${field}-err` : undefined}>
        <legend className="float-left w-full font-serif-luxury text-[15px] font-bold text-[#0F1F45]">{copy.label}</legend>
        <p className="clear-both mt-1 text-[13px] leading-relaxed text-[#5B6B84]">{copy.help}</p>
        <div className="mt-3 space-y-2.5">
          {copy.options.map((o) => (
            <label
              key={o.value}
              className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border border-[#E4E8F0] bg-white px-4 py-3 transition-colors hover:border-[#CBD6EE] has-[:checked]:border-[#1A3170] has-[:checked]:bg-[#EEF2FB] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2F5BC7]/40"
            >
              <input
                type="radio"
                name={`hc-${field}`}
                value={o.value}
                checked={values[field] === o.value}
                onChange={() => setValue(field, o.value)}
                className="h-5 w-5 shrink-0 accent-[#1A3170]"
              />
              <span className="text-[15px] leading-snug text-[#0F1F45]">{o.label}</span>
            </label>
          ))}
        </div>
        <ErrorText id={`hc-${field}-err`}>{error}</ErrorText>
      </fieldset>
    );
  };

  const band = result ? BANDS[result.band] : null;
  // The hint explains the off button; if a consent error is on screen it already says the same, so never show both
  const showConsentHint = !consent && !contactErrors.consent && !sending;
  const bandStyle = result ? BAND_STYLE[result.band] : null;

  return (
    <section id="health-check" className="relative scroll-mt-[80px] overflow-hidden border-y border-[#E4E8F0] bg-[#F7F8FB] py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(201,160,79,0.10),transparent)]" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#E4E8F0] bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7] shadow-[0_1px_2px_rgba(15,31,69,0.05)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A04F]" aria-hidden="true" />
            {HEADER.eyebrow}
          </span>
          <h2 className="font-serif-luxury mt-5 text-[28px] font-bold leading-tight text-[#0F1F45] [text-wrap:balance] sm:text-[40px]">{HEADER.title}</h2>
          <p className="mt-4 text-base text-[#475569] sm:text-lg">{HEADER.subtitle}</p>
        </div>

        <AmountAnnouncer message={announcement} />

        <div className="overflow-hidden rounded-3xl border border-[#E4E8F0] bg-white shadow-[0_2px_8px_rgba(15,31,69,0.05),0_24px_56px_rgba(15,31,69,0.08)]">
          <div className="border-b border-[#E4E8F0] bg-[#FEFDF9] px-5 py-4 sm:px-9 sm:py-5">
            <Stepper step={step} finished={Boolean(result)} />
          </div>

          <div className="p-5 sm:p-9">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.form
                  key={`step-${step}`}
                  noValidate
                  onSubmit={(e) => { e.preventDefault(); goNext(); }}
                  initial={{ opacity: 0, x: slide }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -slide }}
                  transition={{ duration: dur }}
                  onAnimationComplete={focusHeading}
                  className="mx-auto max-w-2xl"
                >
                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    className="font-serif-luxury scroll-mt-28 text-[20px] font-bold text-[#0F1F45] focus:outline-none sm:text-[22px]"
                  >
                    {STEPS[step].label}
                  </h3>

                  <div className="mt-6 space-y-4">
                    {STEP_FIELDS[step].map((field) => (field in MONEY_FIELDS ? renderMoneyField(field) : renderChoice(field)))}
                  </div>

                  <p className="mt-6 flex items-start gap-2.5 text-[12px] leading-relaxed text-[#5B6B84]">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
                    <span>{NEW_MICROCOPY.stepPrivacyNote}</span>
                  </p>

                  <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        className="btn-luxury-outline inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BC7]/40"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> {BUTTONS.back}
                      </button>
                    )}
                    <button type="submit" className="gold-glow-button group w-full sm:w-auto">
                      <span>{step === STEP_FIELDS.length - 1 ? BUTTONS.result : BUTTONS.next}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                  onAnimationComplete={focusHeading}
                >
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
                    {/* Score summary */}
                    <div className="lg:sticky lg:top-28 lg:self-start">
                      <div className={`${cardBase} p-6 sm:p-7`}>
                        <ScoreGauge result={result} reduce={reduce} />
                        <div className="mt-6 text-center">
                          <span
                            aria-hidden="true"
                            className="mx-auto mb-3 block h-1 w-10 rounded-full"
                            style={{ backgroundImage: `linear-gradient(90deg, ${bandStyle.from}, ${bandStyle.to})` }}
                          />
                          <h3
                            ref={headingRef}
                            tabIndex={-1}
                            className={`font-serif-luxury scroll-mt-28 inline-block rounded-xl border px-3.5 py-1.5 text-[18px] font-bold leading-snug focus:outline-none sm:text-[19px] ${bandStyle.chip}`}
                          >
                            {band.title}
                          </h3>
                          <p className="mt-3 text-[14px] leading-relaxed text-[#475569]">{band.line}</p>
                        </div>
                        <BandScale score={result.score} />
                      </div>
                      <p
                        className="mt-4 flex items-start gap-2.5 rounded-2xl border border-[#C9A04F]/30 bg-[#C9A04F]/[0.07] p-4 text-[13px] font-medium leading-relaxed text-[#0F1F45]"
                        data-testid="hc-normalization"
                      >
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
                        <span>{normalizationNote(result)}</span>
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div>
                      <ul aria-label={NEW_MICROCOPY.breakdownLabel} className="space-y-3">
                        {CATEGORY_IDS.map((id) => (
                          <BreakdownRow key={id} id={id} points={result.points[id]} emiNote={id === 'emi' && emiAboveIncome ? NEW_MICROCOPY.emiAboveIncome : ''} />
                        ))}
                      </ul>
                      <p className="mt-5 flex items-start gap-2.5 text-[12px] leading-relaxed text-[#5B6B84]">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{DISCLAIMER}</span>
                      </p>
                    </div>
                  </div>

                  {/* Optional callback */}
                  <div className="mt-8 rounded-2xl border border-[#C9A04F]/30 bg-[#FEFDF9] p-5 shadow-[0_1px_2px_rgba(15,31,69,0.04)] sm:p-7">
                    <h4 className="font-serif-luxury text-[19px] font-bold text-[#0F1F45]">{CALLBACK.heading}</h4>

                    {sent ? (
                      <div role="status" className="mt-5 flex items-start gap-3 rounded-xl border border-[#2F5BC7]/25 bg-[#EEF2FB] p-4 text-[#1A3170]">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A3170] text-white">
                          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                        </span>
                        <p className="pt-1 text-[15px] font-semibold">{CALLBACK.success}</p>
                      </div>
                    ) : (
                      <form onSubmit={submitCallback} noValidate className="mt-5" aria-busy={sending}>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="hc-name" className="block text-sm font-semibold text-[#0F1F45]">{CALLBACK.nameLabel}</label>
                            <div className="relative mt-2">
                              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A96AB]" aria-hidden="true" />
                              <input
                                id="hc-name" type="text" autoComplete="name" maxLength={80}
                                value={contact.fullName}
                                onChange={(e) => { setContact((c) => ({ ...c, fullName: e.target.value })); setContactErrors((x) => ({ ...x, fullName: undefined })); }}
                                aria-invalid={contactErrors.fullName ? 'true' : 'false'}
                                aria-describedby={contactErrors.fullName ? 'hc-name-err' : undefined}
                                className={`${inputBase} pl-11 ${contactErrors.fullName ? 'border-red-400 bg-red-50/40' : 'border-[#E4E8F0]'}`}
                              />
                            </div>
                            <ErrorText id="hc-name-err">{contactErrors.fullName}</ErrorText>
                          </div>
                          <div>
                            <label htmlFor="hc-phone" className="block text-sm font-semibold text-[#0F1F45]">{CALLBACK.phoneLabel}</label>
                            <div className="relative mt-2">
                              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A96AB]" aria-hidden="true" />
                              <input
                                id="hc-phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={16}
                                value={contact.phone}
                                onChange={(e) => { setContact((c) => ({ ...c, phone: e.target.value.replace(/[^\d+\s-]/g, '') })); setContactErrors((x) => ({ ...x, phone: undefined })); }}
                                aria-invalid={contactErrors.phone ? 'true' : 'false'}
                                aria-describedby={contactErrors.phone ? 'hc-phone-err' : undefined}
                                className={`${inputBase} pl-11 ${contactErrors.phone ? 'border-red-400 bg-red-50/40' : 'border-[#E4E8F0]'}`}
                              />
                            </div>
                            <ErrorText id="hc-phone-err">{contactErrors.phone}</ErrorText>
                          </div>
                        </div>

                        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-[#E4E8F0] bg-white p-4 transition-colors hover:border-[#CBD6EE] has-[:checked]:border-[#1A3170] has-[:checked]:bg-[#EEF2FB] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2F5BC7]/40">
                          <input
                            id="hc-consent" type="checkbox" checked={consent}
                            onChange={(e) => { setConsent(e.target.checked); setContactErrors((x) => ({ ...x, consent: undefined })); }}
                            aria-describedby={contactErrors.consent ? 'hc-consent-err' : undefined}
                            className="mt-0.5 h-5 w-5 shrink-0 accent-[#1A3170]"
                          />
                          <span className="text-sm leading-snug text-[#0F1F45]">
                            <ConsentText />
                          </span>
                        </label>
                        <ErrorText id="hc-consent-err">{contactErrors.consent}</ErrorText>

                        <p className="mt-4 flex items-start gap-2.5 text-[12px] leading-relaxed text-[#5B6B84]">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
                          <span>
                            <RetentionNote />
                          </span>
                        </p>

                        <ErrorText id="hc-send-err">{sendError}</ErrorText>

                        <ConsentHint visible={showConsentHint} />

                        <button
                          type="submit"
                          disabled={sending || !consent}
                          aria-describedby={showConsentHint ? 'hc-consent-hint' : undefined}
                          className="gold-glow-button group mt-5 w-full sm:w-auto"
                        >
                          {sending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                              <span>{NEW_MICROCOPY.sending}</span>
                            </>
                          ) : (
                            <>
                              <span>{NEW_MICROCOPY.callbackButton}</span>
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={() => scrollToConsultation()}
                      className="group inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A04F]/60 bg-[#FEFDF9] px-6 py-3 text-sm font-bold text-[#0F1F45] transition-colors hover:border-[#C9A04F] hover:bg-[#C9A04F]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A04F]/50"
                    >
                      <span>{NEW_MICROCOPY.consultationButton}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={restart}
                      className="btn-luxury-outline inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BC7]/40"
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" /> {CALLBACK.restart}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
