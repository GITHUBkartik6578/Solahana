import React, { useState } from 'react';
import { Check, Info, Loader2, Phone, User } from 'lucide-react';
import healthCheckService from '../../services/healthCheckService';
import { CONSENT_TEXTS, KUNDLI_CONSENT_VERSION, isValidMobile } from '../../utils/financialHealthCheck';
import { CALLBACK } from '../../utils/financialHealthCheckCopy';
import { CALLBACK_KUNDLI } from '../../utils/kundli/kundliCopy';
import { buildKundliLead } from '../../utils/kundli/kundliLead';
import { RetentionNote, TextWithLink } from '../planning/healthCheckParts';
import { inputBase } from './kundliStyles';

/**
 * Optional callback request under the Kundli report. Sends ONLY what buildKundliLead builds: name, mobile number, the
 * Kundli consent record and the hc-v1 score summary. The consent box is never pre-ticked, and success is shown only when
 * the server answers 201 (healthCheckService.submitCallback rejects on anything else).
 */
export default function KundliCallback({ result }) {
  const [contact, setContact] = useState({ fullName: '', phone: '' });
  const [consent, setConsent] = useState(false); // never pre-ticked
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | failed

  if (!result) return null;

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (contact.fullName.trim().length < 2) next.fullName = CALLBACK.nameError;
    if (!isValidMobile(contact.phone)) next.phone = CALLBACK.phoneError;
    if (!consent) next.consent = CALLBACK_KUNDLI.consentError;
    setErrors(next);
    if (Object.keys(next).length) return;
    setState('sending');
    try {
      await healthCheckService.submitCallback(buildKundliLead({ fullName: contact.fullName, phone: contact.phone, result }));
      setState('sent');
    } catch {
      setState('failed');
    }
  };

  if (state === 'sent') {
    return (
      <section className="kundli-noprint kundli-card rounded-2xl border border-[#2F5BC7]/30 bg-[#EEF2FB] p-5 sm:p-6" aria-live="polite">
        <p className="flex items-center gap-2 font-serif-luxury text-[18px] font-bold text-[#1A3170]">
          <Check className="h-5 w-5" aria-hidden="true" />
          {CALLBACK.success}
        </p>
      </section>
    );
  }

  const field = (key, label, Icon, props) => (
    <div>
      <label htmlFor={`kc-${key}`} className="block text-[14px] font-bold text-[#0F1F45]">
        {label}
      </label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5B6B84]" aria-hidden="true" />
        <input
          id={`kc-${key}`}
          value={contact[key]}
          onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
          aria-invalid={errors[key] ? 'true' : undefined}
          aria-describedby={errors[key] ? `kc-${key}-err` : undefined}
          className={`${inputBase} pl-10 ${errors[key] ? 'border-red-400' : 'border-[#E4E8F0]'}`}
          {...props}
        />
      </div>
      {errors[key] && (
        <p id={`kc-${key}-err`} className="mt-1.5 text-[13px] font-medium text-red-700">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <section aria-labelledby="kundli-callback" className="kundli-noprint kundli-card rounded-2xl border border-[#E4E8F0] bg-white p-5 sm:p-6">
      <h2 id="kundli-callback" className="font-serif-luxury text-[20px] font-bold text-[#0F1F45]">
        {CALLBACK_KUNDLI.heading}
      </h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-[#475569]">{CALLBACK_KUNDLI.intro}</p>
      <form noValidate onSubmit={submit} className="mt-5 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {field('fullName', CALLBACK.nameLabel, User, { type: 'text', autoComplete: 'name', maxLength: 80 })}
          {field('phone', CALLBACK.phoneLabel, Phone, { type: 'tel', inputMode: 'tel', autoComplete: 'tel', maxLength: 16 })}
        </div>
        <div>
          <label htmlFor="kc-consent" className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E4E8F0] bg-[#F7F8FB] px-4 py-3 text-[13.5px] leading-relaxed text-[#475569]">
            <input
              id="kc-consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-describedby={errors.consent ? 'kc-consent-err' : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-[#1A3170]"
            />
            <span>
              <TextWithLink text={CONSENT_TEXTS[KUNDLI_CONSENT_VERSION]} linkText="Privacy Policy" to="/privacy-policy" />
            </span>
          </label>
          {errors.consent && (
            <p id="kc-consent-err" className="mt-1.5 text-[13px] font-medium text-red-700">
              {errors.consent}
            </p>
          )}
        </div>
        <p className="text-[12.5px] leading-relaxed text-[#5B6B84]">
          <RetentionNote />
        </p>
        {state === 'failed' && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">
            {CALLBACK.failure}
          </p>
        )}
        <div>
          <button
            type="submit"
            disabled={!consent || state === 'sending'}
            aria-describedby={!consent ? 'kc-consent-hint' : undefined}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#24408A_0%,#1A3170_50%,#122552_100%)] px-7 text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(26,49,112,0.28)] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Phone className="h-4 w-4" aria-hidden="true" />}
            {state === 'sending' ? CALLBACK_KUNDLI.sending : CALLBACK_KUNDLI.button}
          </button>
          {!consent && (
            <p id="kc-consent-hint" className="mt-3 flex items-start gap-2 text-[13px] text-[#5B6B84]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
              {CALLBACK_KUNDLI.consentHint}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
