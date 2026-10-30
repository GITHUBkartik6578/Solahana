import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { CONSENT_TEXTS, CONSENT_VERSION } from '../../utils/financialHealthCheck';
import { CALLBACK, NEW_MICROCOPY } from '../../utils/financialHealthCheckCopy';

// Small pieces of the Health Check-up that are worth testing on their own, rendered exactly as the page renders them.

const PRIVACY_PATH = '/privacy-policy';
const CONTACT_PATH = '/contact-us';

/**
 * Shows `text` exactly as written, turning the last occurrence of `linkText` into a link to `to`.
 * If the approved copy ever stops containing `linkText` the text is still shown unchanged (the approved wording is never
 * edited at run time), but it is no longer silent: the element is marked data-link-missing and development builds log a
 * warning. The tests below fail for the same reason, so a missing link is caught before it ships.
 */
export function TextWithLink({ text, linkText, to }) {
  const at = text.lastIndexOf(linkText);
  if (at === -1) {
    if (import.meta.env?.DEV) console.warn(`[HealthCheck] "${linkText}" is not in the copy, so no link to ${to} is shown.`);
    return <span data-link-missing="true">{text}</span>;
  }
  return (
    <>
      {text.slice(0, at)}
      <Link to={to} className="font-semibold text-[#1A3170] underline underline-offset-2 hover:text-[#2F5BC7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BC7]/40 rounded-sm">
        {linkText}
      </Link>
      {text.slice(at + linkText.length)}
    </>
  );
}

/** The approved consent sentence with its Privacy Policy link. */
export function ConsentText() {
  return <TextWithLink text={CONSENT_TEXTS[CONSENT_VERSION]} linkText="Privacy Policy" to={PRIVACY_PATH} />;
}

/** The approved retention note with its Contact page link. */
export function RetentionNote() {
  return <TextWithLink text={CALLBACK.retention} linkText="Contact page" to={CONTACT_PATH} />;
}

/** Explains why the callback button is off. Shown only while it is off because consent is not ticked. */
export function ConsentHint({ visible }) {
  if (!visible) return null;
  return (
    <p id="hc-consent-hint" className="mt-4 flex items-start gap-2.5 text-[13px] font-medium leading-relaxed text-[#5B6B84]">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#A67C2E]" aria-hidden="true" />
      <span>{NEW_MICROCOPY.consentHint}</span>
    </p>
  );
}

/** Always in the page (even when empty) so screen readers reliably announce each change of a typed amount. */
export function AmountAnnouncer({ message }) {
  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}
