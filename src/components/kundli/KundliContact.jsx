import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, Mail, Monitor, Phone, Send, User } from 'lucide-react';
import healthCheckService from '../../services/healthCheckService';
import { buildStartLeadPayload, CONSENT_TEXTS, START_CONSENT_VERSION, isValidEmail, isValidMobile } from '../../utils/financialHealthCheck';
import { CONTACT, NAV } from '../../utils/kundli/kundliCopy';
import { TextWithLink } from '../planning/healthCheckParts';
import { inputBase } from './kundliStyles';

/**
 * The required contact screen between Start and the first question. It sends ONLY buildStartLeadPayload (name, mobile,
 * email and the contact consent), never an answer or an amount. The consent box is never pre-ticked, and the check-up
 * continues only after the server confirms with HTTP 201 (healthCheckService.startCheckup rejects on anything else).
 */
export default function KundliContact({ saved, onSaved, onContinue, onBack, headingRef }) {
  const [form, setForm] = useState({ fullName: '', phone: '', email: '' });
  const [consent, setConsent] = useState(false); // never pre-ticked
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | failed

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (form.fullName.trim().length < 2) next.fullName = CONTACT.nameError;
    if (!isValidMobile(form.phone)) next.phone = CONTACT.phoneError;
    if (!isValidEmail(form.email)) next.email = CONTACT.emailError;
    if (!consent) next.consent = CONTACT.consentError;
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`kct-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setState('sending');
    try {
      const payload = buildStartLeadPayload(form);
      const data = await healthCheckService.startCheckup(payload);
      // Only the name and number stay in this tab's memory, to fill the optional callback form at the end
      onSaved({ fullName: payload.fullName, phone: payload.phone, id: data?.id || null });
    } catch {
      setState('failed');
    }
  };

  const heading = (
    <div className="relative overflow-hidden bg-[linear-gradient(135deg,#0F1F45_0%,#1A3170_100%)] px-6 py-7 sm:px-9 sm:py-9">
      <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#C9922E]/10 blur-2xl" />
      <ol aria-label="Steps" className="relative flex items-center gap-2 whitespace-nowrap text-[10.5px] font-bold uppercase tracking-[0.08em] sm:text-[11.5px] sm:tracking-[0.14em]">
        <li className="flex items-center gap-2 text-[#E8B755]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9922E] text-[11px] text-[#0F1F45]" aria-hidden="true">1</span>
          Your details
        </li>
        <li aria-hidden="true" className="h-px w-3 bg-white/25 sm:w-6" />
        <li className="flex items-center gap-2 text-white/55">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/30 text-[11px]" aria-hidden="true">2</span>
          Your check-up
        </li>
      </ol>
      <h2 ref={headingRef} tabIndex={-1} className="relative mt-5 font-serif-luxury text-[30px] font-bold leading-tight text-white focus:outline-none sm:text-[36px]">
        {CONTACT.heading}
      </h2>
      <p className="relative mt-3 max-w-[560px] text-[14.5px] leading-relaxed text-white/75">{CONTACT.intro}</p>
    </div>
  );

  const shell = 'mx-auto max-w-[680px] overflow-hidden rounded-3xl border border-[#E4E8F0] bg-white shadow-[0_24px_60px_-24px_rgba(15,31,69,0.35)]';

  if (saved) {
    return (
      <div className={shell}>
        {heading}
        <div className="px-6 py-7 sm:px-9">
          <p className="flex items-center gap-3 rounded-xl border border-[#2F5BC7]/25 bg-[#EEF2FB] px-4 py-3.5 text-[14.5px] font-semibold text-[#1A3170]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A3170] text-white">
              <Check className="h-4 w-4" aria-hidden="true" />
            </span>
            {CONTACT.saved(saved.fullName)}
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-6 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-8 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)] transition-transform hover:-translate-y-0.5"
          >
            {CONTACT.continue}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  // prefix is shown only (e.g. "+91"); it is never part of the typed value
  const field = (key, label, Icon, props, prefix = null) => (
    <div>
      <label htmlFor={`kct-${key}`} className="block text-[13px] font-bold uppercase tracking-[0.08em] text-[#0F1F45]">
        {label}
      </label>
      <div className="group relative mt-2">
        <Icon className={`pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors group-focus-within:text-[#2F5BC7] ${errors[key] ? 'text-red-500' : 'text-[#8593A8]'}`} aria-hidden="true" />
        {prefix && (
          <span aria-hidden="true" className="pointer-events-none absolute left-[2.75rem] top-1/2 flex h-7 -translate-y-1/2 items-center border-l border-[#DCE2EC] pl-3 text-[15px] font-semibold text-[#0F1F45]">
            {prefix}
          </span>
        )}
        <input
          id={`kct-${key}`}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          aria-invalid={errors[key] ? 'true' : undefined}
          aria-describedby={errors[key] ? `kct-${key}-err` : undefined}
          className={`${inputBase} min-h-[54px] ${prefix ? 'pl-[5.5rem]' : 'pl-12'} ${errors[key] ? 'border-red-400 bg-red-50/40' : 'border-[#DCE2EC] hover:border-[#B9C4D8]'}`}
          {...props}
        />
      </div>
      {errors[key] && (
        <p id={`kct-${key}-err`} className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-red-700">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className={shell}>
      {heading}
      <form noValidate onSubmit={submit}>
        <div className="grid gap-5 px-6 pt-7 sm:px-9">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1A3170]/10 text-[#1A3170]">
                <Send className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-[13px] leading-snug text-[#475569]">
                <span className="block font-bold text-[#0F1F45]">Sent to Solahana</span>
                Your name, mobile number and email
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C9922E]/15 text-[#9A6B12]">
                <Monitor className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-[13px] leading-snug text-[#475569]">
                <span className="block font-bold text-[#0F1F45]">Stays in this browser</span>
                Your financial answers
              </p>
            </div>
          </div>
          {field('fullName', CONTACT.nameLabel, User, { type: 'text', autoComplete: 'name', maxLength: 80 })}
          {field('phone', CONTACT.phoneLabel, Phone, { type: 'tel', inputMode: 'tel', autoComplete: 'tel', maxLength: 16, placeholder: '98765 43210' }, '+91')}
          {field('email', CONTACT.emailLabel, Mail, { type: 'email', inputMode: 'email', autoComplete: 'email', maxLength: 120 })}
          <div>
            <label
              htmlFor="kct-consent"
              className={`flex cursor-pointer items-start gap-3.5 rounded-xl border px-4 py-3.5 text-[13.5px] leading-relaxed text-[#475569] transition-colors ${
                errors.consent ? 'border-red-400 bg-red-50/40' : consent ? 'border-[#2F5BC7]/40 bg-[#EEF2FB]' : 'border-[#E4E8F0] bg-[#F7F8FB] hover:border-[#B9C4D8]'
              }`}
            >
              <input
                id="kct-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-describedby={errors.consent ? 'kct-consent-err' : undefined}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#1A3170]"
              />
              <span>
                <TextWithLink text={CONSENT_TEXTS[START_CONSENT_VERSION]} linkText="Privacy Policy" to="/privacy-policy" />
              </span>
            </label>
            {errors.consent && (
              <p id="kct-consent-err" className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-red-700">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {errors.consent}
              </p>
            )}
          </div>
          {state === 'failed' && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">
              {CONTACT.failure}
            </p>
          )}
        </div>
        <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#E4E8F0] bg-[#F7F8FB] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <button type="button" onClick={onBack} className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-[#DCE2EC] bg-white px-6 text-[14.5px] font-semibold text-[#0F1F45] transition-colors hover:border-[#2F5BC7]/50 hover:bg-[#EEF2FB]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {NAV.back}
          </button>
          <button
            type="submit"
            disabled={state === 'sending'}
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-8 text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
          >
            {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {state === 'sending' ? CONTACT.sending : CONTACT.button}
            {state !== 'sending' && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </form>
    </div>
  );
}
