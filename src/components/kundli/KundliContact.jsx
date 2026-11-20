import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, Mail, Phone, User } from 'lucide-react';
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
    <>
      <h2 ref={headingRef} tabIndex={-1} className="font-serif-luxury text-[28px] font-bold text-[#0F1F45] focus:outline-none sm:text-[32px]">
        {CONTACT.heading}
      </h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[#475569]">{CONTACT.intro}</p>
    </>
  );

  if (saved) {
    return (
      <div className="mx-auto max-w-[640px]">
        {heading}
        <p className="mt-6 flex items-center gap-2 rounded-xl border border-[#2F5BC7]/30 bg-[#EEF2FB] px-4 py-3 text-[14.5px] font-semibold text-[#1A3170]">
          <Check className="h-5 w-5" aria-hidden="true" />
          {CONTACT.saved(saved.fullName)}
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="mt-6 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-8 text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)]"
        >
          {CONTACT.continue}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  const field = (key, label, Icon, props) => (
    <div>
      <label htmlFor={`kct-${key}`} className="block font-serif-luxury text-[15px] font-bold text-[#0F1F45]">
        {label}
      </label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B84]" aria-hidden="true" />
        <input
          id={`kct-${key}`}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          aria-invalid={errors[key] ? 'true' : undefined}
          aria-describedby={errors[key] ? `kct-${key}-err` : undefined}
          className={`${inputBase} pl-10 ${errors[key] ? 'border-red-400' : 'border-[#E4E8F0]'}`}
          {...props}
        />
      </div>
      {errors[key] && (
        <p id={`kct-${key}-err`} className="mt-1.5 text-[13px] font-medium text-red-700">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-[640px]">
      {heading}
      <form noValidate onSubmit={submit} className="mt-7 grid gap-5 rounded-2xl border border-[#E4E8F0] bg-white p-5 sm:p-6">
        {field('fullName', CONTACT.nameLabel, User, { type: 'text', autoComplete: 'name', maxLength: 80 })}
        {field('phone', CONTACT.phoneLabel, Phone, { type: 'tel', inputMode: 'tel', autoComplete: 'tel', maxLength: 16 })}
        {field('email', CONTACT.emailLabel, Mail, { type: 'email', inputMode: 'email', autoComplete: 'email', maxLength: 120 })}
        <div>
          <label htmlFor="kct-consent" className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] px-4 py-3 text-[13.5px] leading-relaxed text-[#475569]">
            <input
              id="kct-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-describedby={errors.consent ? 'kct-consent-err' : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-[#1A3170]"
            />
            <span>
              <TextWithLink text={CONSENT_TEXTS[START_CONSENT_VERSION]} linkText="Privacy Policy" to="/privacy-policy" />
            </span>
          </label>
          {errors.consent && (
            <p id="kct-consent-err" className="mt-1.5 text-[13px] font-medium text-red-700">
              {errors.consent}
            </p>
          )}
        </div>
        {state === 'failed' && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">
            {CONTACT.failure}
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={onBack} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#E4E8F0] bg-white px-5 text-[14.5px] font-semibold text-[#0F1F45] hover:border-[#2F5BC7]/50">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {NAV.back}
          </button>
          <button
            type="submit"
            disabled={state === 'sending'}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-7 text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)] disabled:opacity-60"
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
