import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { formatInr, parseAmount, wasAmountRounded } from '../../utils/hlvCalculator';
import { STATES } from '../../utils/kundli/kundliCopy';
import { inputBase, linkButton } from './kundliStyles';

/** "50k" -> "₹50,000" under the field, so the customer can see how a typed amount was read. */
function amountEcho(raw) {
  const t = String(raw ?? '').trim();
  if (!t) return '';
  const n = parseAmount(t);
  if (!Number.isFinite(n) || n < 0 || wasAmountRounded(t)) return '';
  return formatInr(n);
}

export function ErrorText({ id, children }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-sm font-medium text-red-700">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

function Label({ id, label, help, helpId }) {
  return (
    <>
      <label htmlFor={id} className="block font-serif-luxury text-[15px] font-bold text-[#0F1F45]">
        {label}
      </label>
      {help && (
        <p id={helpId} className="mt-1 text-[13.5px] leading-relaxed text-[#5B6B84]">
          {help}
        </p>
      )}
    </>
  );
}

/**
 * A text answer (amount, years, age, percent) with optional "I have none" / "Not sure" / "Nothing yet" choices.
 * When one of those is chosen it shows as a chip with a Change button; the raw text is cleared, so it can never be read as 0.
 */
export function AnswerField({ id, label, help, field, onType, onState, allow = [], error, kind = 'amount', suffix, noneLabel = STATES.none, children }) {
  const helpId = help ? `${id}-help` : undefined;
  const errId = error ? `${id}-err` : undefined;
  const describedBy = [helpId, errId].filter(Boolean).join(' ') || undefined;
  const chosen = field.state === 'none' || field.state === 'not-sure';
  const echo = kind === 'amount' ? amountEcho(field.raw) : '';
  return (
    <div className="kundli-field">
      <Label id={id} label={label} help={help} helpId={helpId} />
      {chosen ? (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span id={id} tabIndex={-1} className="inline-flex items-center gap-2 rounded-full border border-[#2F5BC7]/30 bg-[#EEF2FB] px-3.5 py-2 text-[14px] font-semibold text-[#1A3170]">
            <Check className="h-4 w-4" aria-hidden="true" />
            {field.state === 'none' ? noneLabel : STATES.notSure}
          </span>
          <button type="button" className={linkButton} onClick={() => onState('')}>
            {STATES.enterInstead}
          </button>
        </div>
      ) : (
        <>
          <div className="relative mt-3">
            {kind === 'amount' && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-semibold text-[#5B6B84]">₹</span>}
            <input
              id={id}
              type="text"
              inputMode={kind === 'whole' ? 'numeric' : 'decimal'}
              autoComplete="off"
              spellCheck={false}
              value={field.raw}
              onChange={(e) => onType(e.target.value)}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={describedBy}
              className={`${inputBase} ${kind === 'amount' ? 'pl-9' : ''} ${suffix ? 'pr-16' : ''} ${error ? 'border-red-400' : 'border-[#E4E8F0]'}`}
            />
            {suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#5B6B84]">{suffix}</span>}
          </div>
          {echo && (
            <p className="mt-1.5 text-[13px] font-semibold tabular-nums text-[#1A3170]" aria-hidden="true">
              = {echo}
            </p>
          )}
          {allow.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-x-4">
              {allow.includes('none') && (
                <button type="button" className={linkButton} onClick={() => onState('none')}>
                  {noneLabel}
                </button>
              )}
              {allow.includes('not-sure') && (
                <button type="button" className={linkButton} onClick={() => onState('not-sure')}>
                  {STATES.notSure}
                </button>
              )}
            </div>
          )}
        </>
      )}
      {children}
      <ErrorText id={errId}>{error}</ErrorText>
    </div>
  );
}

/** A single-choice question as a radio group of large, tappable cards. */
export function ChoiceField({ id, label, help, options, value, onChange, error }) {
  const helpId = help ? `${id}-help` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <fieldset className="kundli-field" aria-describedby={[helpId, errId].filter(Boolean).join(' ') || undefined}>
      <legend className="block font-serif-luxury text-[15px] font-bold text-[#0F1F45]">{label}</legend>
      {help && (
        <p id={helpId} className="mt-1 text-[13.5px] leading-relaxed text-[#5B6B84]">
          {help}
        </p>
      )}
      <div className="mt-3 grid gap-2.5">
        {options.map((opt, i) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-[14.5px] transition-colors focus-within:ring-2 focus-within:ring-[#2F5BC7]/30 ${
                checked ? 'border-[#2F5BC7] bg-[#EEF2FB] text-[#0F1F45]' : 'border-[#E4E8F0] bg-white text-[#475569] hover:border-[#2F5BC7]/50'
              }`}
            >
              <input
                type="radio"
                id={i === 0 ? id : undefined}
                name={id}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#1A3170]"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
      <ErrorText id={errId}>{error}</ErrorText>
    </fieldset>
  );
}

export function CheckboxRow({ id, checked, onChange, children, disabled }) {
  return (
    <label
      htmlFor={id}
      className={`flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-[14.5px] transition-colors focus-within:ring-2 focus-within:ring-[#2F5BC7]/30 ${
        checked ? 'border-[#2F5BC7] bg-[#EEF2FB] text-[#0F1F45]' : 'border-[#E4E8F0] bg-white text-[#475569]'
      } ${disabled ? 'opacity-60' : ''}`}
    >
      <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={onChange} className="mt-1 h-4 w-4 shrink-0 accent-[#1A3170]" />
      <span>{children}</span>
    </label>
  );
}
