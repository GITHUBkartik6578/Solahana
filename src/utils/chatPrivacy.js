/**
 * Privacy helpers for text typed into the chatbot. Pure: no React, no DOM, no network, no storage, no logging, and
 * deliberately NO imports. It does not depend on the knowledge content, so it can ship on its own, and a build that
 * includes it does not pull the knowledge data in with it.
 *
 * NOT WIRED IN YET. SolahanaChat.jsx does not use this file. Until the component calls screenUserText() on every typed
 * message before it creates a bubble, nothing is masked on screen.
 *
 * HEURISTIC, NOT A GUARANTEE. This looks for the common shapes of a PAN, a bank, card or account number, an Aadhaar-shaped
 * number, an OTP and a password, PIN or CVV. It cannot promise to find every secret, and a secret in a shape it does not
 * recognise is shown like any other text. KNOWN_LIMITATIONS lists the gaps that are known today. A caller must not tell a
 * visitor that their data "is always hidden".
 *
 * What it does
 *   screenUserText(text, { step }) returns only:  { blocked, kinds, display, truncated }
 *     blocked   : true when the message must NOT be used. Either it contains something recognised as sensitive, or it was
 *                 rejected for form reasons (too long, not text, unknown step). Safe input is always blocked: false.
 *     kinds     : why. Sensitive kinds: 'pan', 'aadhaar', 'account-or-card', 'otp', 'password'. Rejection kinds (listed in
 *                 REJECTION_KINDS): 'too-long', 'invalid-input', 'invalid-step'. [] for safe input.
 *     display   : the only text that may be shown. For safe input it is the trimmed text itself. For anything blocked it is
 *                 redacted, and for 'invalid-input' and 'invalid-step' it is empty.
 *     truncated : true when the message was over the step's limit or over the scan cap. A truncated result is ALWAYS
 *                 blocked (kinds includes 'too-long'), so it can never be mistaken for safe input.
 *   The original text is never returned as a separate field, so the caller cannot show it by mistake. The caller keeps the
 *   original in a local variable for normal handling. When `blocked` is true it must not pass that text to any handler,
 *   must not put it in state, a ref or a log, and must let it go out of scope. isRejection(result) tells a form rejection
 *   from a sensitive-data block.
 *
 * Steps (the places the chat accepts typed text): 'chat' (free text), 'name', 'phone', 'email', 'hlv'. The HLV question
 * names used by the component ('expenses', 'liabilities', 'cover', 'years') are accepted as aliases of 'hlv'. An omitted step
 * means 'chat'. Any other step fails closed: blocked, kind 'invalid-step', nothing displayed.
 *   - phone: a normal Indian mobile number is NOT sensitive here, in any format the booking validator accepts. The display
 *     keeps only the last four digits. A number of 12 to 15 digits is left to the booking validator unless it passes the
 *     Luhn check (then it is treated as a card); 16 or more digits is always blocked.
 *   - email: a valid email address is not treated as an account number just because it contains a long number.
 *
 * How detection works (so the limits are clear)
 *   1. The text is cut to SENSITIVE_SCAN_CAP characters. Anything longer is rejected as too long.
 *   2. A normalised copy is made for DETECTION ONLY (it is never cut short: NORM_CAP is above the scan cap times the longest
 *      expansion of one character, and anything past it would be masked, not skipped): zero-width and other invisible characters are removed, every Unicode
 *      decimal digit becomes an ASCII digit, full-width and similar compatibility characters are folded to ASCII, and all
 *      dashes, dots, slashes and spaces become '-', '.', '/' and ' '. The normalised copy is never shown.
 *      Number detectors work on groups of digits: every group of twelve or more digits is a span, and so is every window of up to
 *      five joined groups with a card or Aadhaar layout, wherever it starts, so a number next to an expiry date, an amount, a
 *      mobile number, an OTP or another card is found on its own.
 *   3. Detectors find spans in the normalised copy, and each span is mapped back to the ORIGINAL text. Redaction is done on
 *      the original text, so nothing outside a recognised span is altered, and normalisation cannot cause a leak.
 *   4. All spans from all detectors are merged and redacted together, so one recognised secret never leaves another
 *      recognised secret visible in the same message.
 *
 * Limits
 *   - FIELD_LIMITS are the maximum typed lengths per step (for the input's maxLength). Longer input is rejected.
 *   - Detection scans at most SENSITIVE_SCAN_CAP characters. Longer input is rejected, not scanned in part and passed on.
 *
 * Patterns use bounded quantifiers only: no unbounded wildcard, no nested quantifier, no lookbehind (older Safari cannot
 * parse lookbehinds), and none is a shared global regular expression (each use makes a fresh one, so no state carries over
 * between calls). The source contains no escape sequences for special characters and no invisible characters; tests check it.
 */

export const SENSITIVE_SCAN_CAP = 5000;

/** Maximum typed length per step. The free-chat limit equals the knowledge layer's classification bound. */
export const FIELD_LIMITS = Object.freeze({ chat: 500, name: 80, phone: 20, email: 254, hlv: 30 });
export const STEPS = Object.freeze(Object.keys(FIELD_LIMITS));
/** The component's HLV question names, accepted as the 'hlv' step. */
export const STEP_ALIASES = Object.freeze({ expenses: 'hlv', liabilities: 'hlv', cover: 'hlv', years: 'hlv' });
/** Reasons for blocking that are about the form of the input, not about sensitive content. */
export const REJECTION_KINDS = Object.freeze(['too-long', 'invalid-input', 'invalid-step']);

/** Static texts, all for owner review. No digits, no figures, nothing that echoes what was typed. */
export const PRIVACY_HINT = 'Please don’t type PAN, passwords, OTPs or account numbers.';
export const LIVE_WARNING = 'That looks like sensitive information. It will be hidden and not used.';
export const LENGTH_WARNING = 'That message is too long to send here. Please shorten it.';
export const FLOW_REMINDER = 'That looks like sensitive information, so I have not used it. Please do not share PAN, passwords, OTPs or account numbers.';

/** Gaps that are known today. Detection is heuristic; these are shapes it does not recognise or recognises wrongly. */
export const KNOWN_LIMITATIONS = Object.freeze([
  'Detection is heuristic. A secret in a shape that is not recognised is displayed like ordinary text.',
  'Card, Aadhaar and account numbers are recognised in groups of four (the last may be shorter), as 4-6-5, 4-6-4 or 4-6-6, or with at least twelve digits in one group. Other groupings (for example 3-3-3-3, 4-4-5, 5-5-5, two groups of six, or single digits separated by spaces) are not recognised unless an account keyword comes first. Groups of four joined by commas are recognised only from four groups up.',
  'Three four-digit amounts in a row (for example "1000 2000 3000") read as an Aadhaar-like number, and four as a card. A list of years, or of one repeated number, is left alone.',
  'Letters from other alphabets that look like Latin letters are not folded, so a PAN written with them is not recognised.',
  'A PAN with a space as its only separator is recognised only in capital letters, and a capitalised five-letter word, a year and a capital letter (for example "SINCE 2026 I") can be mistaken for one. Other separators are space, dot, underscore, slash and hyphen, up to three characters each, in any case, so "Apple-2024-a" is also read as a PAN; anything else (for example a comma) is not recognised. A PAN glued to a word ("PANABCDE1234F") is not recognised.',
  'Passwords are recognised only straight after a keyword (password, passcode, passwd, pw, pin, cvv and similar), optionally with "is" and a colon or equals sign. Words between the keyword and the value ("password for my bank is ...") are not followed. A quoted value may hold spaces, and a word followed by a short token with a digit ("hunter 2") is taken together, but a passphrase of several plain words without quotes is missed, and so is a keyword glued to letters ("passwordhunter2"). A plain word after "is" is treated as a password only when it is six or more letters and not a common word, so short or common-word passwords are missed and some ordinary sentences are flagged.',
  'A PIN written as "PIN 560001" (a postal PIN) looks like a PIN number and is flagged; "pin code" followed by six digits is left alone, and followed by four digits is flagged.',
  'An OTP is recognised next to a keyword (otp, verification code and similar), also in short groups ("123 456", "12 34 56") and after small words ("the otp I got was ..."). An OTP separated from its keyword by other words ("the code from my bank is ...", "your code is ...", "482913 please use as my otp") is not recognised, a four-digit year directly after "OTP" with no connecting word is ignored, and two groups of four are taken together only when each has four digits.',
  'A bank account number of nine to eleven digits is recognised only after an account keyword (account, acct, a/c); without one it is shown like any other number. A ten-digit number starting with 6 to 9 looks like a mobile number and is not flagged without a keyword. After a keyword the digit groups that follow are taken as one number up to nineteen digits, so a number that follows closely may be hidden with it.',
  'Twelve digits that read as 91 followed by a mobile number are treated as a phone number only at the phone step or after a plus sign, and only when written without grouping or in groups that are not 4-4-4; elsewhere, and at the phone step when written in groups of four ("9198 7654 3210"), they are flagged, because an Aadhaar number can look the same.',
  'The Luhn check at the phone step is a checksum, not proof: about one in ten random numbers passes, some card numbers of local schemes may not, and account numbers do not follow it. At the phone step, a contiguous number of 12 to 15 digits that fails it is left to the booking validator, which rejects it.',
  'A card, Aadhaar or account number written with letters or other words between its groups is not recognised as one number.',
  'At the email step a message with exactly the shape the booking form accepts is an email address and is not screened for PANs, numbers or OTPs, because the local part of a real address can look like any of them. A password, PIN, CVV or OTP written as an explicit assignment inside it ("password=...", "pin:...") is still screened, but a card or other secret with no such keyword is not. Anything else typed there is screened.',
]);

const BULLET = '•';
const FIXED_MASK = BULLET.repeat(6);
export const NORM_CAP = 100000; // the scan cap times the longest NFKC expansion of one character (18) is 90000; anything past this cap is masked, never skipped

/* ------------------------------------------------------------------ */
/* Patterns (sources only; every use builds a fresh regular expression)  */
/* ------------------------------------------------------------------ */
const P = {
  // PAN: five letters, four digits, one letter, with up to three separators (space . _ / -) on either side of the digits. Contiguous in any
  // case; with a separator only if it is punctuation, or if every letter is a capital (the code applies that rule).
  pan: { src: String.raw`(^|[^a-z0-9])([a-z]{5})([ ._/-]{0,3})(\d{4})([ ._/-]{0,3})([a-z])(?![a-z0-9])`, flags: 'gi' },
  // OTP keyword, then up to ten characters that are punctuation or small words ("is", "received", "the", "I got was"), ending where
  // the digits should start. The digits themselves are read in code, so that 123456, 123 456 and 12 34 56 are all found.
  otpKw: {
    src: String.raw`\b(?:otp|one[- ]time (?:password|code|pin)|verification code|auth(?:entication)? code|sms code|login code)(?![a-z])((?:[^0-9a-z•]|\b(?:is|was|are|hai|hain|received|sent|got|get|code|number|no|the|a|to|me|my|i|you|your|from|here|new|latest|this|it|pin)\b){0,10})`,
    flags: 'gi',
  },
  // Applied to the text just before an OTP keyword: a digit, then the small words and punctuation up to the keyword ("482913 is my otp").
  otpLead: { src: String.raw`(\d)((?:[^0-9a-z•]|\b(?:is|as|hai|was|my|the)\b){0,15})$`, flags: 'i' },
  // Password, PIN, CVV and similar: keyword, a connector (":" or "=", " - ", "is", "is:" or just a space), then a value.
  secret: {
    src: String.raw`\b(pin code|(?:cvv2?|cvc2?) number|password|passcode|passphrase|passwd|pwd|pw|login pass|pin(?: number)?|mpin|upi pin|atm pin|cvv2?|cvc2?|security code|net ?banking (?:id|password)|login (?:id|password|pass))(?![a-z])["']?((?:\s+(?:is|was|are|hai|hain))?(?:\s*[:=]\s*|\s+-\s+|\s+|(?=\d)))["']?([^\s•"']\S*)`,
    flags: 'gi',
  },
  // An account keyword, with its optional "no", "number" and "is", ending where the number should start. The digits are read in code.
  acct: {
    src: String.raw`\b(?:a\/c|acct|acc|account)(?![a-z])\.?[^0-9a-z•]{0,3}(?:(?:no|num|number)\b\.?[^0-9a-z•]{0,3})?(?:(?:is|was|hai)\b[^0-9a-z•]{0,3})?`,
    flags: 'gi',
  },
  // A normal Indian mobile number: optional 91 or 0, then ten digits starting 6 to 9.
  mobile: { src: String.raw`^(?:91|0)?[6-9]\d{9}$`, flags: '' },
  // The same shape the booking form uses for an email address.
  email: { src: String.raw`^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`, flags: '' },
  year: { src: String.raw`^(?:19|20)\d\d$`, flags: '' },
  gap: { src: String.raw`^(?: {1,3}| ?[-./_] ?)$`, flags: '' }, // between two digit groups: one to three spaces, or one of - . / _ with a space either side at most
  comma: { src: String.raw`^, ?$`, flags: '' }, // a comma, accepted between groups only when four or more groups line up
};
const fresh = (key) => new RegExp(P[key].src, P[key].flags);

const STOPWORDS = new Set(
  ('a an the on in at to for of it not no my your our this that here there used use needed need required require mandatory optional weak strong ' +
    'safe secure secured private hidden stored saved encrypted wrong invalid incorrect correct valid changed reset forgotten expired blocked ' +
    'locked set same different long short simple complex important necessary sent shared asked entered generated issued printed written case ' +
    'sensitive protected confidential compromised leaked stolen lost ok fine good bad what which when how why unique common default temporary ' +
    'permanent one two three four five six digits digit characters character letters numbers number only also').split(' '),
);

/** Every pattern this module can run on visitor text, for the static audit tests (flags g and y removed). Not used at run time. */
export function auditablePatterns() {
  return Object.keys(P).map((k) => [k, new RegExp(P[k].src, P[k].flags.replace(/[gy]/g, ''))]);
}

/* ------------------------------------------------------------------ */
/* Steps and limits                                                     */
/* ------------------------------------------------------------------ */
const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

/** The canonical step for a name, or null for an unknown one. An omitted step is 'chat'. */
function resolveStep(step) {
  if (step === undefined) return 'chat';
  if (typeof step !== 'string') return null;
  if (has(FIELD_LIMITS, step)) return step;
  if (has(STEP_ALIASES, step)) return STEP_ALIASES[step];
  return null;
}

/** The maximum typed length for a step. An unknown step has a limit of 0: nothing is accepted for it. */
export function fieldLimit(step) {
  const s = resolveStep(step);
  return s ? FIELD_LIMITS[s] : 0;
}

/* ------------------------------------------------------------------ */
/* Normalisation (detection only; the normalised text is never shown)    */
/* ------------------------------------------------------------------ */
// Invisible or control characters that are removed before detection: C0 and C1 controls other than tab, line feed and
// carriage return, soft hyphen, zero-width and bidirectional marks, word joiners, filler and variation characters, tags.
const REMOVABLE = [
  [0x00, 0x08], [0x0b, 0x0c], [0x0e, 0x1f], [0x7f, 0x9f], [0xad, 0xad], [0x34f, 0x34f], [0x61c, 0x61c], [0x115f, 0x1160],
  [0x17b4, 0x17b5], [0x180b, 0x180f], [0x200b, 0x200f], [0x202a, 0x202e], [0x2060, 0x206f], [0x3164, 0x3164], [0xfe00, 0xfe0f],
  [0xfeff, 0xfeff], [0xffa0, 0xffa0], [0xfff9, 0xfffb], [0xe0000, 0xe007f],
];
const isRemovable = (cp) => REMOVABLE.some(([a, b]) => cp >= a && cp <= b);
const DASHES = new Set([0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2015, 0x2212, 0xfe58, 0xfe63, 0xff0d]);
const DOTS = new Set([0xb7, 0x2024, 0xff0e, 0x30fb]);
const SLASHES = new Set([0x2044, 0x2215, 0xff0f]);
const ND = /\p{Nd}/u;
const LETTER_OR_NUMBER = /[\p{L}\p{N}]/u;
const WHITESPACE = /\s/;

/** The value 0 to 9 of any Unicode decimal digit. Digits come in contiguous runs of ten that start at zero. */
function digitValue(cp) {
  let start = cp;
  while (start > 1 && cp - start < 50 && ND.test(String.fromCodePoint(start - 1))) start -= 1;
  return (cp - start) % 10;
}

/** What one code point becomes in the normalised copy: '' (removed, or a space in the spaced view), or one or more ASCII-oriented characters. */
function normalChar(cp, spaced) {
  if (isRemovable(cp)) return spaced ? ' ' : '';
  const ch = String.fromCodePoint(cp);
  if (cp >= 0x30 && cp <= 0x39) return ch;
  if (cp < 0x80) return WHITESPACE.test(ch) ? ' ' : ch;
  if (ND.test(ch)) return String(digitValue(cp));
  if (DASHES.has(cp)) return '-';
  if (DOTS.has(cp)) return '.';
  if (SLASHES.has(cp)) return '/';
  if (WHITESPACE.test(ch)) return ' ';
  return ch.normalize('NFKC');
}

/**
 * The normalised copy of `text`, with, for each of its characters, where it came from in the original (start and end). `stoppedAt`
 * is the original index where normalising stopped because of NORM_CAP, or -1. That cannot happen for text within the scan cap;
 * if it ever does, analyse() masks the rest instead of skipping it.
 */
function normaliseWithMap(text, spaced) {
  let norm = '';
  const starts = [];
  const ends = [];
  let stoppedAt = -1;
  let removed = false;
  for (let i = 0; i < text.length; ) {
    if (norm.length > NORM_CAP) {
      stoppedAt = i;
      break;
    }
    const cp = text.codePointAt(i);
    const len = cp > 0xffff ? 2 : 1;
    const out = normalChar(cp, spaced);
    if (!spaced && out === '') removed = true;
    for (let k = 0; k < out.length; k += 1) {
      norm += out[k];
      starts.push(i);
      ends.push(i + len);
    }
    i += len;
  }
  return { norm, starts, ends, stoppedAt, removed };
}

/* ------------------------------------------------------------------ */
/* Detection: spans in the normalised copy                               */
/* ------------------------------------------------------------------ */
/** Luhn checksum over a string of digits. */
function luhnValid(digits) {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = digits.charCodeAt(i) - 48;
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return digits.length > 0 && sum % 10 === 0;
}

/** Runs of consecutive ASCII digits: [{ s, e }]. */
function digitGroups(norm) {
  const groups = [];
  let i = 0;
  while (i < norm.length) {
    const c = norm.charCodeAt(i);
    if (c >= 48 && c <= 57) {
      let j = i + 1;
      while (j < norm.length && norm.charCodeAt(j) >= 48 && norm.charCodeAt(j) <= 57) j += 1;
      groups.push({ s: i, e: j });
      i = j;
    } else i += 1;
  }
  return groups;
}

/** How two digit groups are joined: 'plain' (spaces, or one of - . / _), 'comma', or null when they are not joined. */
function joinKind(between) {
  if (fresh('gap').test(between)) return 'plain';
  if (fresh('comma').test(between)) return 'comma';
  return null;
}

const MAX_WINDOW_GROUPS = 5;
const MAX_WINDOW_DIGITS = 19;

/**
 * Whether digit groups of these widths form a card-like or Aadhaar-like number: groups of four (the last may be shorter) totalling
 * at least twelve digits, or an American Express layout (4-6-5 or 4-6-4). Groups joined by commas count only from four groups up,
 * so that "1000, 2000, 3000" (three amounts) is left alone. Returns 'aadhaar', 'account-or-card' or null.
 */
function layoutKind(widths, total, comma, parts) {
  const n = widths.length;
  if (n < 3 || total < 12 || total > MAX_WINDOW_DIGITS) return null;
  const fours = widths.slice(0, -1).every((w) => w === 4) && widths[n - 1] <= 4;
  const amex = n === 3 && widths[0] === 4 && widths[1] === 6 && (widths[2] === 5 || widths[2] === 4);
  const maestro = n === 3 && widths[0] === 4 && widths[1] === 6 && widths[2] === 6; // for example 6759 649826 438453
  if (comma && !(fours && n >= 4)) return null;
  if (!fours && !amex && !maestro) return null;
  // A list of years ("2019 2020 2021") or of one repeated amount ("5000 5000 5000") is not a card or Aadhaar number.
  if (parts.every((x) => /^(?:19|20)\d\d$/.test(x))) return null;
  if (n === 3 && parts.every((x) => x === parts[0])) return null;
  return n === 3 && widths.every((w) => w === 4) ? 'aadhaar' : 'account-or-card';
}

/**
 * Spans for numbers that look like an Aadhaar, card or account number: [{ kind, s, e, digits }].
 *   - Every single group of 12 or more digits is one span, wherever it is. The only exception is a bare twelve digits that read
 *     as 91 and a mobile number, and only at the phone step or after a "+" (so that "+919876543210" is a phone number and
 *     "918765432109" in chat is treated as Aadhaar-like).
 *   - Every window of up to five groups that has a card or Aadhaar layout is a span, wherever it starts. Windows are found
 *     independently, so a number next to an expiry date, an amount, a mobile number, another card or an OTP is still found,
 *     and finding one number never hides another from the detector. Only maximal windows are kept.
 */
function numberSpans(norm, { phone = false } = {}) {
  const out = [];
  const groups = digitGroups(norm);
  groups.forEach((g) => {
    const w = g.e - g.s;
    if (w < 12) return;
    const digits = norm.slice(g.s, g.e);
    if (w === 12 && /^91[6-9]/.test(digits) && (phone || norm[g.s - 1] === '+')) return;
    out.push({ kind: 'account-or-card', s: g.s, e: g.e, digits });
  });
  const windows = [];
  for (let i = 0; i < groups.length; i += 1) {
    const widths = [];
    const parts = [];
    let total = 0;
    let comma = false;
    let best = null;
    for (let j = i; j < groups.length && j < i + MAX_WINDOW_GROUPS; j += 1) {
      if (j > i) {
        const kind = joinKind(norm.slice(groups[j - 1].e, groups[j].s));
        if (!kind) break;
        if (kind === 'comma') comma = true;
      }
      const w = groups[j].e - groups[j].s;
      widths.push(w);
      parts.push(norm.slice(groups[j].s, groups[j].e));
      total += w;
      if (total > MAX_WINDOW_DIGITS) break;
      const kind = layoutKind(widths, total, comma, parts);
      if (kind) best = { i, j, kind };
    }
    if (best) windows.push(best);
  }
  let reach = -1;
  windows.forEach((w) => {
    if (w.j <= reach) return; // inside an earlier, larger span
    reach = w.j;
    const digits = groups.slice(w.i, w.j + 1).map((g) => norm.slice(g.s, g.e)).join('');
    out.push({ kind: w.kind, s: groups[w.i].s, e: groups[w.j].e, digits });
  });
  return out;
}

const MAX_ACCOUNT_DIGITS = 19;

/**
 * Spans for a number written after an account keyword ("account number 12345678901", "a/c 123 456 789 012 345"): nine or more
 * digits. A single group of nine or more digits is the whole number. Otherwise every following group joined by a plain separator
 * is taken, up to MAX_ACCOUNT_DIGITS, so that no part of a grouped number is left behind.
 */
function accountSpans(norm) {
  const out = [];
  const groups = digitGroups(norm);
  const byStart = new Map(groups.map((g, i) => [g.s, i]));
  const re = fresh('acct');
  let m = re.exec(norm);
  while (m) {
    const first = byStart.get(m.index + m[0].length);
    if (first !== undefined) {
      let total = groups[first].e - groups[first].s;
      let last = first;
      if (total < 9) {
        for (let j = first + 1; j < groups.length; j += 1) {
          if (joinKind(norm.slice(groups[j - 1].e, groups[j].s)) !== 'plain') break;
          const w = groups[j].e - groups[j].s;
          if (total + w > MAX_ACCOUNT_DIGITS) break;
          total += w;
          last = j;
        }
      }
      if (total >= 9 && total <= MAX_ACCOUNT_DIGITS) {
        const digits = groups.slice(first, last + 1).map((g) => norm.slice(g.s, g.e)).join('');
        out.push({ kind: 'account-or-card', s: groups[first].s, e: groups[last].e, digits });
      }
    }
    m = re.exec(norm);
  }
  return out;
}

/** Spans for PANs. A separator that is only a space, or a mix of letters and no separator, counts only when every letter is a capital. */
function panSpans(norm) {
  const out = [];
  const re = fresh('pan');
  let m = re.exec(norm);
  while (m) {
    const [, pre, head, sepA, , sepB, tail] = m;
    const contiguous = !sepA && !sepB;
    const punctuated = /[._/-]/.test(sepA + sepB);
    const capitals = /^[A-Z]{5}$/.test(head) && /^[A-Z]$/.test(tail);
    if (contiguous || punctuated || capitals) {
      const s = m.index + pre.length;
      out.push({ kind: 'pan', s, e: m.index + m[0].length });
    }
    m = re.exec(norm);
  }
  return out;
}

const MAX_OTP_DIGITS = 8;

/**
 * Digit groups that make up one OTP, starting at group `at` and going `dir` (1 forward, -1 backward): a single group of four to
 * eight digits, or a few short groups ("123 456", "12 34 56", "1 2 3 4"), or two groups of four. Returns { from, to } indices or null.
 */
function otpGroups(norm, groups, at, dir) {
  const width = (i) => groups[i].e - groups[i].s;
  let total = width(at);
  if (total > MAX_OTP_DIGITS) return null;
  const firstWidth = total;
  let lo = at;
  let hi = at;
  for (let j = at + dir; j >= 0 && j < groups.length; j += dir) {
    const [a, b] = dir === 1 ? [j - 1, j] : [j, j + 1];
    if (joinKind(norm.slice(groups[a].e, groups[b].s)) !== 'plain') break;
    const w = width(j);
    if (total + w > MAX_OTP_DIGITS) break;
    if (!(firstWidth < 4 || (firstWidth === 4 && w === 4))) break;
    total += w;
    if (dir === 1) hi = j;
    else lo = j;
  }
  return total >= 4 ? { from: lo, to: hi, total } : null;
}

/** Spans for the digits of an OTP, in the forms 'otp 123456', 'otp 123 456', 'the otp I got was 482913' and '123456 is my otp'. */
function otpSpans(norm) {
  const out = [];
  const groups = digitGroups(norm);
  const byStart = new Map(groups.map((g, i) => [g.s, i]));
  const byEnd = new Map(groups.map((g, i) => [g.e, i]));
  const kw = fresh('otpKw');
  let m = kw.exec(norm);
  while (m) {
    const after = byStart.get(m.index + m[0].length);
    if (after !== undefined) {
      const found = otpGroups(norm, groups, after, 1);
      if (found) {
        const connected = /[:=]|\b(?:is|was|are|hai|hain|received|sent|got)\b/i.test(m[1]);
        const single = found.from === found.to && fresh('year').test(norm.slice(groups[after].s, groups[after].e));
        if (connected || !single) out.push({ kind: 'otp', assign: /[:=]/.test(m[1]), s: groups[found.from].s, e: groups[found.to].e });
      }
    }
    const base = Math.max(0, m.index - 24);
    const lead = fresh('otpLead').exec(norm.slice(base, m.index));
    if (lead) {
      const before = byEnd.get(base + lead.index + 1);
      const found = before === undefined ? null : otpGroups(norm, groups, before, -1);
      if (found) {
        const single = found.from === found.to && fresh('year').test(norm.slice(groups[found.from].s, groups[found.to].e));
        if (!single || /\b(?:is|as|hai|was)\b/i.test(lead[2])) out.push({ kind: 'otp', s: groups[found.from].s, e: groups[found.to].e });
      }
    }
    m = kw.exec(norm);
  }
  return out;
}

/** Whether the word after a password keyword looks like an actual secret. `keyword` is the keyword as typed. */
function looksLikeSecret(value, connector, keyword) {
  if (/^pin code$/i.test(keyword)) return /^\d{4}$/.test(value); // "pin code 560001" is a postal code; four digits are an ATM PIN
  if (value.length < 3) return false;
  if (/^•+$/.test(value)) return false;
  if (STOPWORDS.has(value.toLowerCase())) return false;
  if (/\d/.test(value)) return true; // three or more characters, at least one digit: for example 123, abc123, Hunter2
  if (/[:=]/.test(connector)) return value.length >= 4; // an explicit assignment: password: hunter
  if (/\b(?:is|was|are|hai|hain)\b/i.test(connector)) return value.length >= 6; // "password is hunter"
  return false;
}

const DIGIT_KEYWORD = /^(?:pin|pin number|mpin|upi pin|atm pin|(?:cvv2?|cvc2?)(?: number)?|security code)$/i;
const MAX_QUOTED_SECRET = 64;

/** Spans for the value after a password, PIN or CVV keyword. */
function secretSpans(norm) {
  const out = [];
  const groups = digitGroups(norm);
  const byStart = new Map(groups.map((g, i) => [g.s, i]));
  const re = fresh('secret');
  let m = re.exec(norm);
  while (m) {
    const keyword = m[1];
    const full = m[3];
    const raw = full.includes('•') ? full.slice(0, full.indexOf('•')) : full; // text that is already masked is not part of a value
    const s = m.index + m[0].length - full.length;
    const assign = /[:=]/.test(m[2]); // an explicit assignment ("password=", "pin:"), the one form still screened inside a valid email address
    if (!raw) {
      m = re.exec(norm);
      continue;
    }
    const quote = s > 0 ? norm[s - 1] : '';
    const close = quote === '"' || quote === "'" ? norm.indexOf(quote, s) : -1;
    const value = raw.replace(/[.,;?)\]"']+$/, ''); // "!" and other symbols stay: they are often the last character of a password
    if (close > s && close - s <= MAX_QUOTED_SECRET && !/^•+$/.test(norm.slice(s, close)) && norm.slice(s, close).length >= 3) {
      out.push({ kind: 'password', assign, s, e: close }); // a quoted value, which may hold spaces
    } else if (DIGIT_KEYWORD.test(keyword) && /^\d+$/.test(value) && byStart.has(s) && value.length < (/pin/i.test(keyword) ? 4 : 3)) {
      // a PIN or CVV written in short groups ("pin 48 29", "cvv 1 2 3")
      const need = /pin/i.test(keyword) ? 4 : 3;
      const first = byStart.get(s);
      let total = groups[first].e - groups[first].s;
      let last = first;
      for (let j = first + 1; j < groups.length && total < need; j += 1) {
        if (joinKind(norm.slice(groups[j - 1].e, groups[j].s)) !== 'plain') break;
        total += groups[j].e - groups[j].s;
        last = j;
      }
      if (total >= need && total <= MAX_OTP_DIGITS) out.push({ kind: 'password', assign, s, e: groups[last].e });
      else if (looksLikeSecret(value, m[2], keyword)) out.push({ kind: 'password', assign, s, e: s + value.length });
    } else if (looksLikeSecret(value, m[2], keyword)) {
      let e = s + value.length;
      if (!/\d/.test(value)) {
        // a word followed by short tokens that hold a digit ("hunter 2"): the digits are part of the value
        const more = /^ ([^\s•"']{1,6})(?![^\s])/.exec(norm.slice(e));
        if (more && /\d/.test(more[1])) e += 1 + more[1].length;
      }
      out.push({ kind: 'password', assign, s, e });
    }
    m = re.exec(norm);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Analysis: kinds and redaction ranges in the ORIGINAL text             */
/* ------------------------------------------------------------------ */
const KIND_ORDER = ['pan', 'aadhaar', 'account-or-card', 'otp', 'password'];

/** Merge overlapping or touching ranges, keeping the set of kinds. Ranges are in the original text. */
function mergeRanges(ranges) {
  const sorted = ranges.slice().sort((a, b) => a.start - b.start || a.end - b.end);
  const merged = [];
  for (const r of sorted) {
    const last = merged[merged.length - 1];
    if (last && r.start <= last.end) {
      last.end = Math.max(last.end, r.end);
      r.kinds.forEach((k) => last.kinds.add(k));
    } else merged.push({ start: r.start, end: r.end, kinds: new Set(r.kinds) });
  }
  return merged;
}

/**
 * Finds everything recognised in `text` (already cut to the scan cap and trimmed) for a step.
 * Returns { kinds, ranges } where ranges are in the ORIGINAL text, merged, each with the kinds it holds.
 */
function analyse(text, step) {
  const first = viewRanges(text, step, false);
  // Invisible characters are removed in the first view, which joins digits they split ("12345<zero-width>6789012"). When there
  // were any, a second view turns each into a space, which finds groups they separate ("4111<zero-width>1111 1111 1111").
  const second = first.removed ? viewRanges(text, step, true) : { found: [] };
  const ranges = mergeRanges([...first.found, ...second.found]);
  const found = new Set();
  ranges.forEach((r) => r.kinds.forEach((k) => found.add(k)));
  return { kinds: KIND_ORDER.filter((k) => found.has(k)), ranges };
}

/** Detection on one normalised view of the text: { found, removed } where found holds ranges in the ORIGINAL text. */
function viewRanges(text, step, spaced) {
  const { norm, starts, ends, stoppedAt, removed } = normaliseWithMap(text, spaced);
  let spans = [...panSpans(norm), ...numberSpans(norm, { phone: step === 'phone' }), ...accountSpans(norm), ...otpSpans(norm), ...secretSpans(norm)];

  if (step === 'email' && text.length <= FIELD_LIMITS.email && fresh('email').test(text)) {
    // A whole message with the exact shape the booking form accepts is an email address: its local part may look like a PAN, an OTP or a
    // number, so those are not screened. An explicit credential assignment ("password=...", "pin:...", "otp=...") still is.
    spans = spans.filter((sp) => sp.assign);
  }
  if (step === 'phone') {
    // A number of 12 to 15 digits that is not a card (fails the Luhn check) is left to the booking validator.
    spans = spans.filter((sp) => !(sp.kind === 'account-or-card' && sp.digits && sp.digits.length >= 12 && sp.digits.length <= 15 && !luhnValid(sp.digits)));
  }

  const found = spans
    .filter((sp) => sp.e > sp.s && ends[sp.e - 1] !== undefined)
    .map((sp) => ({ start: starts[sp.s], end: ends[sp.e - 1], kinds: [sp.kind] }));
  if (stoppedAt !== -1) found.push({ start: stoppedAt, end: text.length, kinds: ['password'] }); // fail closed: text that was not scanned is masked
  return { found, removed };
}

/** Replace the letters and digits inside a range by bullets, keep separators, drop invisible characters. */
function maskSegment(segment) {
  let out = '';
  for (const ch of segment) {
    if (isRemovable(ch.codePointAt(0))) continue;
    out += LETTER_OR_NUMBER.test(ch) ? BULLET : ch;
  }
  return out;
}

/** The original text with every range masked. A range that holds an OTP or a password becomes a fixed mask (its length is not shown). */
function applyRanges(text, ranges) {
  let out = '';
  let pos = 0;
  for (const r of ranges) {
    out += text.slice(pos, r.start);
    out += r.kinds.has('otp') || r.kinds.has('password') ? FIXED_MASK : maskSegment(text.slice(r.start, r.end));
    pos = r.end;
  }
  return out + text.slice(pos);
}

/** Cut to at most n UTF-16 units without splitting a surrogate pair. */
function safeSlice(str, n) {
  if (str.length <= n) return str;
  let s = str.slice(0, n);
  const last = s.charCodeAt(s.length - 1);
  if (last >= 0xd800 && last <= 0xdbff) s = s.slice(0, -1);
  return s;
}

/** Text from any input: null and undefined are empty text, numbers, bigints and booleans are written out, anything else is not text. */
function asText(raw) {
  if (raw === null || raw === undefined) return '';
  const t = typeof raw;
  if (t === 'string') return raw;
  if (t === 'number' || t === 'bigint' || t === 'boolean') return String(raw);
  return null;
}

/** Whether a screening result is a rejection for form reasons (too long, not text, unknown step) rather than a sensitive-data block. */
export function isRejection(result) {
  return Boolean(result && Array.isArray(result.kinds) && result.kinds.some((k) => REJECTION_KINDS.includes(k)));
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */
const rejected = (kind) => ({ blocked: true, kinds: [kind], display: '', truncated: false });

/** The step from an options argument. A missing or non-object argument means no step; an argument that throws counts as an invalid step. */
function stepOf(options) {
  try {
    return options === null || options === undefined ? undefined : options.step;
  } catch {
    return Symbol('unreadable step'); // not a string, so the step is rejected as invalid
  }
}

/** Shared by screenUserText and liveWarning. */
function inspect(raw, step) {
  const stepName = resolveStep(step);
  if (!stepName) return { early: rejected('invalid-step') };
  const original = asText(raw);
  if (original === null) return { early: rejected('invalid-input') };
  const overCap = original.length > SENSITIVE_SCAN_CAP;
  const text = original.slice(0, SENSITIVE_SCAN_CAP).trim();
  const limit = FIELD_LIMITS[stepName];
  const tooLong = overCap || text.length > limit;
  const { kinds, ranges } = analyse(text, stepName);
  return { stepName, text, limit, tooLong, kinds, ranges };
}

/**
 * Display form of a phone-step entry: every digit except the last four becomes a bullet, separators are kept. Any Unicode
 * decimal digit counts as a digit. "9876543210" becomes "••••••3210", exactly what the chat shows today for a plain 10-digit
 * number. The chat's current mask only hides a digit that is followed by four more digits, so "+91 98765 43210" leaves most
 * digits visible; this one hides them all except the last four.
 */
export function maskPhoneDisplay(raw) {
  const s = asText(raw) ?? '';
  const total = Array.from(s).filter((ch) => ND.test(ch)).length;
  let seen = 0;
  let out = '';
  for (const ch of s) {
    if (ND.test(ch)) {
      seen += 1;
      out += total - seen < 4 ? ch : BULLET;
    } else out += ch;
  }
  return out;
}

/**
 * Redaction of everything recognised in a text, with no step rules and no length limit (only the scan cap). Idempotent. A normal
 * Indian mobile number is left alone. Returns text, never the original separately.
 */
export function redact(raw) {
  try {
    const original = asText(raw);
    if (original === null) return '';
    const text = original.slice(0, SENSITIVE_SCAN_CAP).trim();
    const { ranges } = analyse(text, 'chat');
    return applyRanges(text, ranges);
  } catch {
    return ''; // fails closed: nothing is returned rather than text that could not be checked
  }
}

/**
 * Screens one typed message. Returns { blocked, kinds, display, truncated } and NEVER the original text as a field.
 * See the header for the exact meaning of each field. In short: use the message only when `blocked` is false, show only
 * `display`, and treat every other result (sensitive, too long, not text, unknown step) as rejected.
 */
export function screenUserText(raw, options) {
  try {
    const r = inspect(raw, stepOf(options));
    if (r.early) return r.early;
    let display = r.ranges.length ? applyRanges(r.text, r.ranges) : r.text;
    if (r.stepName === 'phone') display = maskPhoneDisplay(display);
    const kinds = r.tooLong ? ['too-long', ...r.kinds] : r.kinds;
    if (r.tooLong) display = safeSlice(display, r.limit);
    return { blocked: kinds.length > 0, kinds, display, truncated: r.tooLong };
  } catch {
    return rejected('invalid-input'); // anything unexpected fails closed, and never returns the input
  }
}

/** The warning to show under the input while typing, or '' when there is nothing to warn about. */
export function liveWarning(raw, options) {
  try {
    const r = inspect(raw, stepOf(options));
    if (r.early) return '';
    if (r.kinds.length) return LIVE_WARNING;
    return r.tooLong ? LENGTH_WARNING : '';
  } catch {
    return '';
  }
}

/* ------------------------------------------------------------------ */
/* Texts for the chat: the hidden-message bubble and field-specific rejections */
/* ------------------------------------------------------------------ */
/** The only thing shown in the transcript for a blocked message. Never the input, and never a redacted copy of it. */
export const HIDDEN_BUBBLE_TEXT = 'Message hidden for your privacy';

const GENERIC_REJECTION = 'Something went wrong with that message. Please try again.';
const SENSITIVE_REJECTION = Object.freeze({
  chat: 'That looks like sensitive information, so I haven’t used it. Please don’t share PAN, passwords, OTPs or account numbers. How can I help instead?',
  name: 'That doesn’t look like a name and may contain sensitive information, so I haven’t used it. Please type just your name.',
  phone: 'That doesn’t look like a mobile number and may be sensitive, so I haven’t used it. Please type only your mobile number: ten digits, with or without +91, not grouped in fours.',
  email: 'I couldn’t use that. Please type only your email address, for example name@example.com.',
  hlv: 'That doesn’t look like an amount I can use, so I haven’t used it. Please enter just the amount, for example 50000 or 1.5 lakh.',
  years: 'That doesn’t look like a number of years I can use, so I haven’t used it. Please enter just the number of years, using digits only.',
});
const LENGTH_REJECTION = Object.freeze({
  chat: LENGTH_WARNING,
  name: 'That is too long for a name. Please shorten it.',
  phone: 'That is too long for a mobile number. Please type only the number.',
  email: 'That is too long for an email address. Please check it.',
  hlv: 'That is too long for an amount. Please enter just the number.',
  years: 'That is too long for a number of years. Please enter just the number.',
});
export const REJECTION_TEXTS = Object.freeze({ sensitive: SENSITIVE_REJECTION, length: LENGTH_REJECTION, generic: GENERIC_REJECTION });

/**
 * The reply for a blocked message, specific to the field it was typed into. `step` is the same step passed to screenUserText
 * (an HLV question name such as 'years' selects the years wording). Returns '' for a message that was not blocked. The text never
 * contains anything that was typed.
 */
export function rejectionMessage(result, step) {
  try {
    if (!result || result.blocked !== true) return '';
    const kinds = Array.isArray(result.kinds) ? result.kinds : [];
    if (kinds.includes('invalid-step') || kinds.includes('invalid-input')) return GENERIC_REJECTION;
    const name = resolveStep(step);
    if (!name) return GENERIC_REJECTION;
    const key = name === 'hlv' && step === 'years' ? 'years' : name;
    const sensitive = kinds.some((k) => !REJECTION_KINDS.includes(k));
    return sensitive || !kinds.includes('too-long') ? SENSITIVE_REJECTION[key] : LENGTH_REJECTION[key];
  } catch {
    return GENERIC_REJECTION;
  }
}

/**
 * Safe description of a failed request for the console: only the error's name, the HTTP status and a short error code. Never the
 * message, the request (which holds the booking details) or the response. Anything unexpected gives the defaults.
 */
export function safeErrorInfo(err) {
  const info = { name: 'Error', status: null, code: null };
  try {
    if (err && typeof err === 'object') {
      if (typeof err.name === 'string' && /^[A-Za-z]{1,40}$/.test(err.name)) info.name = err.name;
      const status = err.response && err.response.status;
      if (Number.isInteger(status) && status >= 100 && status <= 599) info.status = status;
      if (typeof err.code === 'string' && /^[A-Za-z0-9_]{1,40}$/.test(err.code)) info.code = err.code;
    }
  } catch {
    // a getter that throws is ignored: the defaults are returned
  }
  return info;
}

/**
 * Last check before a booking is sent: true only when the name, the stored phone number and the email each pass the screening for
 * their own step. Anything else (missing, not text, blocked, too long) is false, and nothing should be sent.
 */
export function screenBookingFields(fields) {
  try {
    if (!fields || typeof fields !== 'object') return false;
    const { fullName, phone, email } = fields;
    if (typeof fullName !== 'string' || typeof phone !== 'string' || typeof email !== 'string') return false;
    return [screenUserText(fullName, { step: 'name' }), screenUserText(phone, { step: 'phone' }), screenUserText(email, { step: 'email' })].every((r) => r.blocked === false);
  } catch {
    return false;
  }
}
