import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AmountAnnouncer, ConsentHint, ConsentText, RetentionNote, TextWithLink } from './healthCheckParts';
import HealthCheck from './HealthCheck';
import { CONSENT_TEXTS, CONSENT_VERSION } from '../../utils/financialHealthCheck';
import { CALLBACK, NEW_MICROCOPY, STEPS } from '../../utils/financialHealthCheckCopy';

// These tests render the real components to HTML (react-dom/server, already a dependency) and look at what a visitor gets.
const render = (node) => renderToStaticMarkup(<MemoryRouter>{node}</MemoryRouter>);
const textOf = (html) =>
  html.replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
const links = (html) => [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g)].map((m) => ({ href: m[1], text: textOf(m[2]) }));

afterEach(() => vi.restoreAllMocks());

describe('TextWithLink', () => {
  it('turns only the named words into a link and leaves every other character of the text alone', () => {
    const html = render(<TextWithLink text="Read our Privacy Policy before you agree." linkText="Privacy Policy" to="/privacy-policy" />);
    expect(links(html)).toEqual([{ href: '/privacy-policy', text: 'Privacy Policy' }]);
    expect(textOf(html)).toBe('Read our Privacy Policy before you agree.');
    expect(html).not.toContain('data-link-missing');
  });

  it('links the LAST occurrence when the words appear twice', () => {
    const html = render(<TextWithLink text="Contact page first, then the Contact page." linkText="Contact page" to="/contact-us" />);
    expect(links(html)).toHaveLength(1);
    expect(html.indexOf('<a ')).toBeGreaterThan(html.indexOf('then the'));
    expect(textOf(html)).toBe('Contact page first, then the Contact page.');
  });

  it('does not fail silently when the link words are missing: text unchanged, no link, marked, and a development warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const html = render(<TextWithLink text="You can ask us to delete your details earlier." linkText="Contact page" to="/contact-us" />);
    expect(links(html)).toEqual([]);
    expect(html).toContain('data-link-missing="true"');
    expect(textOf(html)).toBe('You can ask us to delete your details earlier.');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toContain('Contact page');
    expect(String(warn.mock.calls[0][0])).toContain('/contact-us');
  });
});

describe('the approved copy still carries its links', () => {
  it('consent text: exact approved wording, with "Privacy Policy" linking to /privacy-policy', () => {
    const html = render(<ConsentText />);
    expect(textOf(html)).toBe(CONSENT_TEXTS[CONSENT_VERSION]);
    expect(links(html)).toEqual([{ href: '/privacy-policy', text: 'Privacy Policy' }]);
    expect(html).not.toContain('data-link-missing');
  });

  it('retention note: exact approved wording, with "Contact page" linking to /contact-us', () => {
    const html = render(<RetentionNote />);
    expect(textOf(html)).toBe(CALLBACK.retention);
    expect(links(html)).toEqual([{ href: '/contact-us', text: 'Contact page' }]);
    expect(html).not.toContain('data-link-missing');
  });

  it('catches a copy edit that removes a link word (this is the failure the missing-link marker is for)', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const edited = CALLBACK.retention.replace('Contact page', 'contact form');
    const html = render(<TextWithLink text={edited} linkText="Contact page" to="/contact-us" />);
    expect(html).toContain('data-link-missing="true"');
    expect(links(html)).toEqual([]);
  });
});

describe('ConsentHint', () => {
  it('explains why the button is off, in a paragraph the button can point to', () => {
    const html = render(<ConsentHint visible />);
    expect(html).toContain('id="hc-consent-hint"');
    expect(textOf(html)).toBe(NEW_MICROCOPY.consentHint);
    expect(html).not.toContain('role="alert"'); // it is guidance, not an error
  });

  it('renders nothing once consent is ticked or an error is already showing', () => {
    expect(render(<ConsentHint visible={false} />)).toBe('');
  });
});

describe('AmountAnnouncer', () => {
  it('is in the page even when there is nothing to say, as a polite live region', () => {
    const html = render(<AmountAnnouncer message="" />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-atomic="true"');
    expect(html).toContain('sr-only');
    expect(textOf(html)).toBe('');
  });

  it('carries the announcement text and is hidden visually', () => {
    const html = render(<AmountAnnouncer message="Monthly in-hand income: ₹80,000" />);
    expect(textOf(html)).toBe('Monthly in-hand income: ₹80,000');
    expect(html).toContain('sr-only');
  });
});

describe('the whole Health Check-up as first rendered', () => {
  const html = render(<HealthCheck />);

  it('keeps the page anchor and the approved first step', () => {
    expect(html).toContain('id="health-check"');
    expect(textOf(html)).toContain(STEPS[0].label);
  });

  it('has the live region from the very first render, before anything is typed', () => {
    expect(html).toMatch(/<p class="sr-only" role="status" aria-live="polite" aria-atomic="true"><\/p>/);
  });

  it('shows the three step-1 amount fields, labelled, with no placeholder text, and the amounts privacy note', () => {
    ['hc-income', 'hc-expenses', 'hc-emi'].forEach((id) => {
      expect(html).toContain(`id="${id}"`);
      expect(html).toContain(`for="${id}"`);
    });
    expect(html).not.toContain('placeholder=');
    expect(textOf(html)).toContain(NEW_MICROCOPY.stepPrivacyNote);
  });

  it('marks step 1 as the current step and does not show the callback form yet', () => {
    expect(html).toContain('aria-current="step"');
    expect(html).not.toContain('hc-consent');
    expect(html).not.toContain('id="hc-consent-hint"');
  });
});
