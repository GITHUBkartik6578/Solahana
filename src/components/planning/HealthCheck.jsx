import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, RotateCcw, Check, AlertTriangle, Loader2 } from 'lucide-react';
import healthCheckService from '../../services/healthCheckService';
import { scrollToConsultation } from '../../utils/consultation';
import {
  CATEGORY_IDS,
  CATEGORY_MAX,
  CONSENT_TEXTS,
  CONSENT_VERSION,
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


const inputClass =
  'w-full rounded-xl border bg-[#F7F8FB] px-4 py-3.5 text-[15px] text-[#0F1F45] placeholder-[#A7B1C2] focus:outline-none focus:border-[#2F5BC7] focus:ring-2 focus:ring-[#2F5BC7]/25';

const BAND_COLOUR = { strong: '#2F5BC7', good: '#C9A04F', attention: '#C2410C' };

function ErrorText({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-start gap-2 text-sm text-red-600">
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

// Shows the text exactly as approved, turning only the words `linkText` into a link
function TextWithLink({ text, linkText, to }) {
  const at = text.lastIndexOf(linkText);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <Link to={to} className="underline text-[#1A3170]">{linkText}</Link>
      {text.slice(at + linkText.length)}
    </>
  );
}

export default function HealthCheck() {
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

  const setValue = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const goNext = () => {
    const check = validateInputs(values);
    const stepErrors = {};
    STEP_FIELDS[step].forEach((field) => {
      if (check.errors[field]) stepErrors[field] = check.errors[field];
    });
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) return;
    if (step < STEP_FIELDS.length - 1) {
      setStep(step + 1);
      return;
    }
    if (check.ok) {
      setEmiAboveIncome(check.values.emi > check.values.income);
      setResult(scoreHealthCheck(check.values));
    }
  };

  const restart = () => {
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

  const renderField = (field) => {
    const copy = FIELDS[field];
    const error = errors[field];
    return (
      <div key={field}>
        <label htmlFor={`hc-${field}`} className="block text-sm font-semibold text-[#0F1F45]">{copy.label}</label>
        <p id={`hc-${field}-help`} className="mt-1 text-xs text-[#64748B] leading-snug">{copy.help}</p>
        <div className="relative mt-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A96AB] text-[15px]" aria-hidden="true">₹</span>
          <input
            id={`hc-${field}`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={values[field]}
            onChange={(e) => setValue(field, e.target.value)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={`hc-${field}-help${error ? ` hc-${field}-err` : ''}`}
            className={`${inputClass} pl-9 ${error ? 'border-red-400' : 'border-[#E4E8F0]'}`}
          />
        </div>
        <ErrorText id={`hc-${field}-err`}>{error}</ErrorText>
      </div>
    );
  };

  const renderChoice = (field) => {
    const copy = CHOICES[field];
    const error = errors[field];
    return (
      <fieldset key={field} aria-describedby={error ? `hc-${field}-err` : undefined}>
        <legend className="block text-sm font-semibold text-[#0F1F45]">{copy.label}</legend>
        <p className="mt-1 text-xs text-[#64748B] leading-snug">{copy.help}</p>
        <div className="mt-3 space-y-2">
          {copy.options.map((o) => (
            <label
              key={o.value}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                values[field] === o.value ? 'border-[#1A3170] bg-[#F1F4FB]' : 'border-[#E4E8F0] bg-white hover:border-[#CBD6EE]'
              }`}
            >
              <input
                type="radio"
                name={`hc-${field}`}
                value={o.value}
                checked={values[field] === o.value}
                onChange={() => setValue(field, o.value)}
                className="w-4 h-4 accent-[#1A3170]"
              />
              <span className="text-[15px] text-[#0F1F45]">{o.label}</span>
            </label>
          ))}
        </div>
        <ErrorText id={`hc-${field}-err`}>{error}</ErrorText>
      </fieldset>
    );
  };

  const band = result ? BANDS[result.band] : null;
  const CIRC = 2 * Math.PI * 52;

  return (
    <section id="health-check" className="relative scroll-mt-[80px] py-16 sm:py-20 lg:py-24 bg-[#F7F8FB] border-y border-[#E4E8F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E4E8F0] text-[11px] font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">
            {HEADER.eyebrow}
          </span>
          <h2 className="mt-5 text-[28px] sm:text-[40px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">
            {HEADER.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#475569]">{HEADER.subtitle}</p>
        </div>

        <div className="rounded-3xl bg-white border border-[#E4E8F0] shadow-[0_2px_8px_rgba(15,31,69,0.05),0_24px_56px_rgba(15,31,69,0.08)] overflow-hidden">
          <div
            className="h-1.5 bg-[#EEF1F6]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={result ? 3 : step}
            aria-label={NEW_MICROCOPY.progressLabel}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[#2F5BC7] to-[#1A3170]"
              animate={{ width: `${((result ? 3 : step) / 3) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>

          <div className="p-5 sm:p-9">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.form
                  key={`step-${step}`}
                  noValidate
                  onSubmit={(e) => { e.preventDefault(); goNext(); }}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2F5BC7]">{STEPS[step].label}</span>

                  <div className="mt-6 space-y-6">
                    {STEP_FIELDS[step].map((field) => (field in MONEY_FIELDS ? renderField(field) : renderChoice(field)))}
                  </div>

                  <p className="mt-6 text-[11px] text-[#8A96AB] leading-relaxed">{NEW_MICROCOPY.stepPrivacyNote}</p>

                  <div className="mt-7 flex flex-col-reverse sm:flex-row sm:items-center gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => { setErrors({}); setStep(step - 1); }}
                        className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-full border border-[#E4E8F0] text-sm font-bold text-[#1A3170] hover:border-[#CBD6EE] hover:bg-[#F7F8FB] transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" /> {BUTTONS.back}
                      </button>
                    )}
                    <button
                      type="submit"
                      className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#0F1F45] px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_10px_26px_rgba(15,31,69,0.3)] hover:shadow-[0_14px_34px_rgba(15,31,69,0.42)] transition-all cursor-pointer"
                    >
                      <span>{step === STEP_FIELDS.length - 1 ? BUTTONS.result : BUTTONS.next}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="relative w-28 h-28 shrink-0 mx-auto sm:mx-0">
                      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#EEF1F6" strokeWidth="12" />
                        <motion.circle
                          cx="60" cy="60" r="52" fill="none" stroke={BAND_COLOUR[result.band]} strokeWidth="12" strokeLinecap="round"
                          strokeDasharray={CIRC}
                          initial={{ strokeDashoffset: CIRC }}
                          animate={{ strokeDashoffset: CIRC * (1 - result.score / 100) }}
                          transition={{ duration: 0.9, ease: 'easeOut' }}
                        />
                      </svg>
                      <span className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[26px] font-bold text-[#0F1F45] leading-none">{result.score}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A96AB] mt-1">out of 100</span>
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-[24px] sm:text-[28px] font-serif-luxury font-bold text-[#0F1F45]">{band.title}</h3>
                      <p className="mt-2 text-[15px] text-[#475569] leading-relaxed">{band.line}</p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm text-[#0F1F45] font-medium" data-testid="hc-normalization">{normalizationNote(result)}</p>

                  <ul className="mt-6 rounded-2xl bg-[#F7F8FB] border border-[#E4E8F0] divide-y divide-[#E4E8F0]">
                    {CATEGORY_IDS.map((id) => {
                      const pts = result.points[id];
                      const full = pts === CATEGORY_MAX[id];
                      return (
                        <li key={id} className="flex items-start gap-3 p-4">
                          <span className={`w-5 h-5 mt-0.5 rounded-full flex items-center justify-center shrink-0 ${full ? 'bg-[#2F5BC7] text-white' : pts === null ? 'bg-[#E4E8F0] text-[#64748B]' : 'bg-[#FBF3E2] text-[#C9A04F]'}`}>
                            {full ? <Check className="w-3 h-3" strokeWidth={3.5} /> : pts === null ? <span className="text-[10px] font-bold">–</span> : <AlertTriangle className="w-3 h-3" />}
                          </span>
                          <span className="flex-1 text-sm text-[#0F1F45] leading-snug">
                            <strong className="font-bold">{CATEGORY_LABELS[id]}: </strong>{observationFor(id, pts)}
                            {id === 'emi' && emiAboveIncome && (
                              <span className="block mt-1 text-[#64748B]">{NEW_MICROCOPY.emiAboveIncome}</span>
                            )}
                          </span>
                          <span className="text-xs font-semibold text-[#64748B] whitespace-nowrap">
                            {pts === null ? NEW_MICROCOPY.notApplicablePoints : `${pts} / ${CATEGORY_MAX[id]}`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="mt-5 text-[11px] text-[#8A96AB] leading-relaxed">{DISCLAIMER}</p>

                  <div className="mt-8 rounded-2xl border border-[#E4E8F0] p-5 sm:p-6">
                    <h4 className="text-lg font-serif-luxury font-bold text-[#0F1F45]">{CALLBACK.heading}</h4>

                    {sent ? (
                      <p role="status" className="mt-4 flex items-start gap-2 text-[15px] font-semibold text-[#1A3170]">
                        <Check className="w-5 h-5 mt-0.5 shrink-0" strokeWidth={3} />
                        <span>{CALLBACK.success}</span>
                      </p>
                    ) : (
                      <form onSubmit={submitCallback} noValidate className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="hc-name" className="block text-sm font-semibold text-[#0F1F45]">{CALLBACK.nameLabel}</label>
                            <input
                              id="hc-name" type="text" autoComplete="name" maxLength={80}
                              value={contact.fullName}
                              onChange={(e) => { setContact((c) => ({ ...c, fullName: e.target.value })); setContactErrors((x) => ({ ...x, fullName: undefined })); }}
                              aria-invalid={contactErrors.fullName ? 'true' : 'false'}
                              className={`${inputClass} mt-2 ${contactErrors.fullName ? 'border-red-400' : 'border-[#E4E8F0]'}`}
                            />
                            <ErrorText id="hc-name-err">{contactErrors.fullName}</ErrorText>
                          </div>
                          <div>
                            <label htmlFor="hc-phone" className="block text-sm font-semibold text-[#0F1F45]">{CALLBACK.phoneLabel}</label>
                            <input
                              id="hc-phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={16}
                              value={contact.phone}
                              onChange={(e) => { setContact((c) => ({ ...c, phone: e.target.value.replace(/[^\d+\s-]/g, '') })); setContactErrors((x) => ({ ...x, phone: undefined })); }}
                              aria-invalid={contactErrors.phone ? 'true' : 'false'}
                              className={`${inputClass} mt-2 ${contactErrors.phone ? 'border-red-400' : 'border-[#E4E8F0]'}`}
                            />
                            <ErrorText id="hc-phone-err">{contactErrors.phone}</ErrorText>
                          </div>
                        </div>

                        <label className="mt-5 flex items-start gap-3 cursor-pointer">
                          <input
                            id="hc-consent" type="checkbox" checked={consent}
                            onChange={(e) => { setConsent(e.target.checked); setContactErrors((x) => ({ ...x, consent: undefined })); }}
                            className="mt-1 w-4 h-4 accent-[#1A3170] shrink-0"
                          />
                          <span className="text-sm text-[#0F1F45] leading-snug">
                            <TextWithLink text={CONSENT_TEXTS[CONSENT_VERSION]} linkText="Privacy Policy" to="/privacy-policy" />
                          </span>
                        </label>
                        <ErrorText id="hc-consent-err">{contactErrors.consent}</ErrorText>

                        <p className="mt-4 text-[11px] text-[#8A96AB] leading-relaxed">
                          <TextWithLink text={CALLBACK.retention} linkText="Contact page" to="/contact-us" />
                        </p>

                        <ErrorText id="hc-send-err">{sendError}</ErrorText>

                        <button
                          type="submit"
                          disabled={sending || !consent}
                          className="mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#0F1F45] px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_10px_26px_rgba(15,31,69,0.3)] hover:shadow-[0_14px_34px_rgba(15,31,69,0.42)] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {sending ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>{NEW_MICROCOPY.sending}</span></>) : (<><span>{NEW_MICROCOPY.callbackButton}</span><ArrowRight className="w-4 h-4" /></>)}
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button type="button" onClick={() => scrollToConsultation()} className="gold-glow-button group w-full sm:w-auto">
                    <span>{NEW_MICROCOPY.consultationButton}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#E4E8F0] text-sm font-bold text-[#1A3170] hover:border-[#CBD6EE] hover:bg-[#F7F8FB] transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" /> {CALLBACK.restart}
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
