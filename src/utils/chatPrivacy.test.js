import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as privacy from './chatPrivacy';
import {
  FIELD_LIMITS,
  FLOW_REMINDER,
  HIDDEN_BUBBLE_TEXT,
  KNOWN_LIMITATIONS,
  LENGTH_WARNING,
  LIVE_WARNING,
  NORM_CAP,
  PRIVACY_HINT,
  REJECTION_KINDS,
  REJECTION_TEXTS,
  SENSITIVE_SCAN_CAP,
  STEPS,
  STEP_ALIASES,
  auditablePatterns,
  fieldLimit,
  isRejection,
  liveWarning,
  maskPhoneDisplay,
  redact,
  rejectionMessage,
  safeErrorInfo,
  screenBookingFields,
  screenUserText,
} from './chatPrivacy';

const read = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8');
const screen = (t, step) => screenUserText(t, step === undefined ? undefined : { step });
const bullets = (s) => (s.match(/•/g) || []).length;
const digitsOf = (s) => (s.match(/\d/g) || []).join('');

// Special characters are always built from code points, never typed as escapes.
const cp = (n) => String.fromCodePoint(n);
const ZWSP = cp(0x200b);
const ZWNJ = cp(0x200c);
const BOM = cp(0xfeff);
const SOFT_HYPHEN = cp(0xad);
const NBSP = cp(0xa0);
const EM_DASH = cp(0x2014);
const EN_DASH = cp(0x2013);
const MINUS = cp(0x2212);
const PUA_START = cp(0xe000);
const PUA_END = cp(0xe001);
const digitsIn = (zero) => (ascii) => [...ascii].map((c) => (/\d/.test(c) ? cp(zero + Number(c)) : c)).join('');
const devanagari = digitsIn(0x966);
const arabicIndic = digitsIn(0x660);
const fullwidthDigits = digitsIn(0xff10);
const mathBoldDigits = digitsIn(0x1d7ce);
const fullwidthLetters = (s) => [...s].map((c) => (/[A-Z]/.test(c) ? cp(0xff21 + c.charCodeAt(0) - 65) : /[a-z]/.test(c) ? cp(0xff41 + c.charCodeAt(0) - 97) : c)).join('');

/** A copy of the booking validators in SolahanaChat.jsx (handleLeadInput), so the tests can show valid input is unaffected. */
const bookingAcceptsPhone = (v) => /^[6-9]\d{9}$/.test(v.trim().replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, ''));
const bookingAcceptsEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const luhnValid = (d) => {
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i -= 1) {
    let n = d.charCodeAt(i) - 48;
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};
const withLuhn = (prefix) => { for (let c = 0; c < 10; c += 1) if (luhnValid(prefix + c)) return prefix + c; return prefix; };
const withoutLuhn = (prefix) => { for (let c = 0; c < 10; c += 1) if (!luhnValid(prefix + c)) return prefix + c; return prefix; };

/** Sensitive messages, each with the value that must never appear in the display. */
const SENSITIVE = [
  { text: 'my PAN is ABCDE1234F what is SIP', secret: 'ABCDE1234F', kind: 'pan' },
  { text: 'abcde1234f', secret: 'abcde1234f', kind: 'pan' },
  { text: 'PAN: BNZPM2501F', secret: 'BNZPM2501F', kind: 'pan' },
  { text: 'my account number is 123456789012', secret: '123456789012', kind: 'account-or-card' },
  { text: 'account 1234567890123456', secret: '1234567890123456', kind: 'account-or-card' },
  { text: 'a/c 00123456789012345', secret: '00123456789012345', kind: 'account-or-card' },
  { text: 'card 4111 1111 1111 1111', secret: '4111 1111 1111 1111', kind: 'account-or-card' },
  { text: 'card 4111-1111-1111-1111', secret: '4111-1111-1111-1111', kind: 'account-or-card' },
  { text: 'aadhaar 1234 5678 9012', secret: '1234 5678 9012', kind: 'aadhaar' },
  { text: 'my otp is 482913', secret: '482913', kind: 'otp' },
  { text: '482913 is my otp', secret: '482913', kind: 'otp' },
  { text: 'verification code: 123456', secret: '123456', kind: 'otp' },
  { text: 'OTP 7391', secret: '7391', kind: 'otp' },
  { text: 'my password is Hunter2', secret: 'Hunter2', kind: 'password' },
  { text: 'net banking password: abc123', secret: 'abc123', kind: 'password' },
  { text: 'my pin is 4321', secret: '4321', kind: 'password' },
  { text: 'cvv is 123', secret: '123', kind: 'password' },
  { text: 'UPI PIN is 9087', secret: '9087', kind: 'password' },
];

const digitWindows = (s, n = 4) => {
  const d = digitsOf(s);
  const out = [];
  for (let i = 0; i + n <= d.length; i += 1) out.push(d.slice(i, i + n));
  return out;
};

/* ================================================================== */
describe('limits, constants and documented limitations', () => {
  it('sets a maximum length for each typed step', () => {
    expect(FIELD_LIMITS).toEqual({ chat: 500, name: 80, phone: 20, email: 254, hlv: 30 });
    expect(STEPS).toEqual(['chat', 'name', 'phone', 'email', 'hlv']);
    expect(Object.isFrozen(FIELD_LIMITS)).toBe(true);
    expect(Object.isFrozen(STEP_ALIASES)).toBe(true);
    expect(Object.isFrozen(REJECTION_KINDS)).toBe(true);
    expect(Object.isFrozen(KNOWN_LIMITATIONS)).toBe(true);
  });
  it('fixes the free-chat limit at 500 characters, and enforces it at exactly that length', () => {
    expect(FIELD_LIMITS.chat).toBe(500);
    expect(screen('a'.repeat(500))).toEqual({ blocked: false, kinds: [], display: 'a'.repeat(500), truncated: false });
    expect(screen('a'.repeat(501))).toMatchObject({ blocked: true, kinds: ['too-long'], truncated: true });
    expect(screen('a'.repeat(501)).display).toHaveLength(500);
  });
  it('keeps every limit above what valid input needs, so no valid booking input is cut', () => {
    ['+91 98765-43210', '+91-98765-43210', '09876543210', '+91 98 76 54 32 10'].forEach((p) => expect(p.length).toBeLessThanOrEqual(FIELD_LIMITS.phone));
    const longestEmail = `${'x'.repeat(64)}@${'y'.repeat(63)}.${'z'.repeat(63)}.com`;
    expect(longestEmail.length).toBeLessThanOrEqual(FIELD_LIMITS.email);
    expect(bookingAcceptsEmail(longestEmail)).toBe(true);
    expect('Priya Sharma-Iyer'.length).toBeLessThan(FIELD_LIMITS.name);
    expect('₹1,00,00,000.50 a month'.length).toBeLessThanOrEqual(FIELD_LIMITS.hlv);
  });
  it('caps scanning at 5000 characters', () => {
    expect(SENSITIVE_SCAN_CAP).toBe(5000);
  });
  it('accepts the component\'s HLV question names as the hlv step, and nothing else', () => {
    expect(STEP_ALIASES).toEqual({ expenses: 'hlv', liabilities: 'hlv', cover: 'hlv', years: 'hlv' });
    Object.keys(STEP_ALIASES).forEach((a) => expect(fieldLimit(a)).toBe(FIELD_LIMITS.hlv));
    expect(screen('a'.repeat(31), 'expenses').kinds).toContain('too-long');
    expect(screen('50000', 'expenses').blocked).toBe(false);
  });
  it('documents what it cannot do, and says plainly that detection is heuristic', () => {
    expect(KNOWN_LIMITATIONS.length).toBeGreaterThanOrEqual(8);
    expect(KNOWN_LIMITATIONS[0]).toMatch(/heuristic/i);
    KNOWN_LIMITATIONS.forEach((l) => expect(typeof l === 'string' && l.length > 30).toBe(true));
    const src = read('./chatPrivacy.js');
    expect(src).toMatch(/HEURISTIC, NOT A GUARANTEE/);
    expect(src).toMatch(/must not tell a\s+\*\s+visitor that their data "is always hidden"/);
    expect(PRIVACY_HINT + LIVE_WARNING + FLOW_REMINDER + LENGTH_WARNING).not.toMatch(/\b(always|guarantee|every secret)\b/i);
  });
  it('pins each documented limitation to real behaviour, so the list cannot drift from the code', () => {
    expect(screen('123 456 789 012').blocked).toBe(false); // 3-3-3-3 grouping is not recognised
    expect(screen('123456 789012').blocked).toBe(false); // two groups of six are not recognised
    expect(screen('1000 2000 3000').kinds).toEqual(['aadhaar']); // a list of four-digit amounts reads as Aadhaar-shaped
    expect(screen('SINCE 2026 I started').kinds).toEqual(['pan']); // capitalised five-letter word, year, capital letter
    expect(screen('PIN 560001').blocked).toBe(true); // a postal PIN looks like a PIN number
    expect(screen('OTP 2026').blocked).toBe(false); // a bare year after OTP is ignored
    expect(screen('my password is abc').blocked).toBe(false); // a short plain word after "is" is missed
    expect(screen('ABCDE1234F'.replace('A', cp(0x410))).blocked).toBe(false); // a Cyrillic letter is not folded to Latin
  });
});

/* ================================================================== */
describe('result shape and the rejection contract (H2)', () => {
  it('returns only the four documented fields, and never the original text as a field', () => {
    const text = 'my PAN is ABCDE1234F';
    const r = screen(text);
    expect(Object.keys(r).sort()).toEqual(['blocked', 'display', 'kinds', 'truncated']);
    expect(Object.values(r).some((v) => v === text)).toBe(false);
    expect(JSON.stringify(r)).not.toContain('ABCDE1234F');
    expect(Object.keys(screen('hello')).sort()).toEqual(['blocked', 'display', 'kinds', 'truncated']);
  });
  it('treats safe input as blocked: false, truncated: false, with no kinds', () => {
    ['What is a SIP?', '50000', 'hello', ''].forEach((t) => expect(screen(t)).toEqual({ blocked: false, kinds: [], display: t.trim(), truncated: false }));
  });
  it('rejects over-limit input at every step: blocked, truncated, kind too-long, display cut to the limit', () => {
    STEPS.forEach((step) => {
      const r = screen('a'.repeat(FIELD_LIMITS[step] + 1), step);
      expect(r.blocked, step).toBe(true);
      expect(r.truncated, step).toBe(true);
      expect(r.kinds, step).toEqual(['too-long']);
      expect(r.display.length, step).toBe(FIELD_LIMITS[step]);
      expect(isRejection(r), step).toBe(true);
    });
  });
  it('accepts input of exactly the limit', () => {
    STEPS.forEach((step) => {
      const r = screen('a'.repeat(FIELD_LIMITS[step]), step);
      expect(r, step).toEqual({ blocked: false, kinds: [], display: 'a'.repeat(FIELD_LIMITS[step]), truncated: false });
    });
  });
  it('rejects input over the scan cap, however it is laid out, and never shows the tail', () => {
    const tail = ' my pan is ABCDE1234F';
    const inputs = ['hello '.repeat(1000) + tail, 'a'.repeat(6000), ' '.repeat(6000) + 'x', 'x' + ' '.repeat(SENSITIVE_SCAN_CAP + 5) + 'ABCDE1234F'];
    inputs.forEach((t) => {
      const r = screen(t);
      expect(r.blocked).toBe(true);
      expect(r.truncated).toBe(true);
      expect(r.kinds).toContain('too-long');
      expect(r.display).not.toContain('ABCDE1234F');
      expect(r.display.length).toBeLessThanOrEqual(FIELD_LIMITS.chat);
    });
  });
  it('still reports the sensitive kinds found inside the cap when a message is also too long', () => {
    const r = screen('hello '.repeat(300) + ' my pan is ABCDE1234F');
    expect(r.kinds[0]).toBe('too-long');
    expect(r.kinds).toContain('pan');
    expect(r.display).not.toContain('ABCDE1234F');
    expect(r.display.length).toBeLessThanOrEqual(FIELD_LIMITS.chat);
  });
  it('NEVER lets truncated: true be safe, and never reports blocked: false with sensitive kinds (invariants over many inputs)', () => {
    let seed = 11;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    const pieces = ['hello ', 'a', '9876543210 ', '1234 5678 9012 3456 ', 'pin 4321 ', 'ABCDE1234F ', 'x'.repeat(40), ' ', '50000 ', cp(0x1f600), '😀', '12', 'my otp is 482913 '];
    for (let i = 0; i < 3000; i += 1) {
      const n = 1 + Math.floor(rnd() * 40);
      let t = '';
      for (let k = 0; k < n; k += 1) t += pieces[Math.floor(rnd() * pieces.length)];
      STEPS.forEach((step) => {
        const r = screen(t, step);
        if (r.truncated) expect(r.blocked, `${step}: ${t.length}`).toBe(true);
        if (!r.blocked) { expect(r.truncated).toBe(false); expect(r.kinds).toEqual([]); }
        if (r.kinds.length) expect(r.blocked).toBe(true);
        expect(r.display.length).toBeLessThanOrEqual(Math.max(FIELD_LIMITS[step], SENSITIVE_SCAN_CAP));
        if (r.truncated) expect(r.display.length).toBeLessThanOrEqual(FIELD_LIMITS[step]);
      });
    }
  });
  it('tells a form rejection from a sensitive-data block', () => {
    expect(isRejection(screen('my pan is ABCDE1234F'))).toBe(false);
    expect(isRejection(screen('a'.repeat(501)))).toBe(true);
    expect(isRejection(screen({}))).toBe(true);
    expect(isRejection(screen('x', 'nope'))).toBe(true);
    expect(isRejection(screen('fine'))).toBe(false);
    expect(isRejection(null)).toBe(false);
    expect(isRejection(undefined)).toBe(false);
    expect(isRejection({ kinds: 'too-long' })).toBe(false);
    expect(REJECTION_KINDS).toEqual(['too-long', 'invalid-input', 'invalid-step']);
  });
});

/* ================================================================== */
describe('invalid step handling fails closed (L4)', () => {
  it('rejects an unknown or non-string step with kind invalid-step and shows nothing', () => {
    ['nonsense', 'Chat', ' chat', 'toString', '__proto__', 'constructor', '', 'time', 'sending', 5, null, {}, []].forEach((step) => {
      const r = screenUserText('hello', { step });
      expect(r, String(step)).toEqual({ blocked: true, kinds: ['invalid-step'], display: '', truncated: false });
    });
  });
  it('rejects even empty or sensitive input for an unknown step, without leaking it', () => {
    expect(screenUserText('', { step: 'nope' }).blocked).toBe(true);
    const r = screenUserText('ABCDE1234F', { step: 'nope' });
    expect(r.display).toBe('');
    expect(JSON.stringify(r)).not.toContain('ABCDE1234F');
  });
  it('treats an omitted step, or step: undefined, as free chat', () => {
    expect(screenUserText('hello')).toEqual(screen('hello', 'chat'));
    expect(screenUserText('hello', {})).toEqual(screen('hello', 'chat'));
    expect(screenUserText('hello', { step: undefined })).toEqual(screen('hello', 'chat'));
    expect(screenUserText('hello', undefined)).toEqual(screen('hello', 'chat'));
  });
  it('gives an unknown step a limit of zero', () => {
    ['nonsense', 'toString', 'x', 5, null, {}].forEach((s) => expect(fieldLimit(s)).toBe(0));
    expect(fieldLimit()).toBe(FIELD_LIMITS.chat);
  });
  it('has the live warning say nothing for an unknown step, since there is nothing safe to say', () => {
    expect(liveWarning('ABCDE1234F', { step: 'nope' })).toBe('');
  });
});

/* ================================================================== */
describe('non-string input (L5)', () => {
  it('treats null and undefined as empty, safe text', () => {
    [null, undefined].forEach((v) => expect(screen(v)).toEqual({ blocked: false, kinds: [], display: '', truncated: false }));
  });
  it('writes out numbers, bigints and booleans, so a number typed or pasted as a number is still screened', () => {
    expect(screen(12345678901234).kinds).toEqual(['account-or-card']);
    expect(screen(12345678901234).display).toBe('••••••••••••••');
    expect(screen(1234567890123456n).kinds).toEqual(['account-or-card']);
    expect(screen(50000)).toEqual({ blocked: false, kinds: [], display: '50000', truncated: false });
    expect(screen(true).display).toBe('true');
    expect(screen(NaN).display).toBe('NaN');
  });
  it('rejects objects, arrays, functions, symbols and dates as invalid-input, shows nothing, and does not throw', () => {
    const throwing = { toString() { throw new Error('should never be called'); }, valueOf() { throw new Error('should never be called'); } };
    [{}, [], ['ABCDE1234F'], { a: 1 }, () => 'ABCDE1234F', Symbol('s'), new Date(), /x/, throwing, new Map(), new Uint8Array(3)].forEach((v) => {
      let r;
      expect(() => { r = screen(v); }).not.toThrow();
      expect(r).toEqual({ blocked: true, kinds: ['invalid-input'], display: '', truncated: false });
    });
  });
  it('does the same for the live warning, the redaction and the phone mask', () => {
    expect(liveWarning({})).toBe('');
    expect(redact({})).toBe('');
    expect(redact(['ABCDE1234F'])).toBe('');
    expect(maskPhoneDisplay({})).toBe('');
    expect(maskPhoneDisplay(null)).toBe('');
  });
});

/* ================================================================== */
describe('sensitive detection', () => {
  it.each(SENSITIVE)('flags "$text" as $kind in free chat', ({ text, kind }) => {
    const r = screen(text);
    expect(r.blocked).toBe(true);
    expect(r.kinds).toContain(kind);
    expect(isRejection(r)).toBe(false);
  });
  it('flags the same messages at the name, email and HLV steps', () => {
    ['name', 'email', 'hlv'].forEach((step) => {
      SENSITIVE.filter((s) => s.text.length <= FIELD_LIMITS[step]).forEach(({ text }) => expect(screen(text, step).blocked, `${step}: ${text}`).toBe(true));
    });
  });
  it('flags a PAN typed as a name, which today would be sent to the backend as the name', () => {
    const r = screen('ABCDE1234F', 'name');
    expect(r.blocked).toBe(true);
    expect(r.display).not.toContain('ABCDE1234F');
  });
  it('does not flag harmless text', () => {
    ['What is a SIP?', 'what is a password manager', 'what is an OTP', 'how do I reset my pin', 'ABCDE is a word', 'pan card kya hota hai', 'I am 35 and earn 1.2 lakh a month', 'in 2026 I want to retire', 'my wife is 33', 'call me on 9876543210', 'hello', '', '   '].forEach((t) => {
      const r = screen(t);
      expect(r.blocked, t).toBe(false);
      expect(r.kinds, t).toEqual([]);
    });
  });
  it('flags every real-credential fixture with the right kind, hides its secret, and leaves nothing to flag in the display', () => {
    SENSITIVE.forEach(({ text, secret, kind }) => {
      const r = screen(text);
      expect(r.blocked, text).toBe(true);
      expect(r.kinds, text).toContain(kind);
      expect(leaked(r.display, secret, text), `${text} -> ${r.display}`).toBe(false);
      expect(sensitiveKinds(r.display), `${text} -> ${r.display}`).toEqual([]);
    });
  });
});

/* ================================================================== */
describe('H1: alternate separators, Unicode digits, spaced PANs and credential-like secrets', () => {
  describe('card, Aadhaar and account numbers with other separators', () => {
    const grouped = ['1234.5678.9012.3456', '1234/5678/9012/3456', '1234 - 5678 - 9012 - 3456', '1234 . 5678 . 9012 . 3456', '1234-5678-9012-3456', `1234${NBSP}5678${NBSP}9012${NBSP}3456`, `1234${EN_DASH}5678${EN_DASH}9012${EN_DASH}3456`, `1234${EM_DASH}5678${EM_DASH}9012${EM_DASH}3456`, `1234${MINUS}5678${MINUS}9012${MINUS}3456`];
    it.each(grouped)('"%s"', (n) => {
      const r = screen(`card ${n}`);
      expect(r.blocked).toBe(true);
      expect(r.kinds).toEqual(['account-or-card']);
      expect(digitsOf(r.display)).toBe('');
    });
    it('recognises a twelve-digit number in fours with any separator as Aadhaar-shaped', () => {
      ['1234.5678.9012', '1234/5678/9012', '1234 - 5678 - 9012', '1234 5678 9012', '1234-5678-9012'].forEach((n) => expect(screen(n).kinds, n).toEqual(['aadhaar']));
    });
    it('recognises American Express layouts', () => {
      ['3782 822463 10005', '3782-822463-10005', '3714 496353 98431'].forEach((n) => {
        const r = screen(n);
        expect(r.kinds, n).toEqual(['account-or-card']);
        expect(digitsOf(r.display), n).toBe('');
      });
    });
  });
  describe('Unicode digits', () => {
    const makers = { Devanagari: devanagari, 'Arabic-Indic': arabicIndic, 'full-width': fullwidthDigits, 'mathematical bold': mathBoldDigits };
    Object.entries(makers).forEach(([name, make]) => {
      it(`${name} digits are detected and fully hidden`, () => {
        const twelve = screen(`account ${make('123456789012')}`);
        expect(twelve.kinds).toEqual(['account-or-card']);
        expect(twelve.display).toBe('account ••••••••••••');
        const card = screen(`card ${make('4111 1111 1111 1111')}`);
        expect(card.blocked).toBe(true);
        expect(card.display).toBe('card •••• •••• •••• ••••');
        const otp = screen(`my otp is ${make('482913')}`);
        expect(otp.kinds).toEqual(['otp']);
        expect(otp.display).toBe('my otp is ••••••');
        const pin = screen(`pin ${make('4321')}`);
        expect(pin.kinds).toEqual(['password']);
        expect(pin.display).toBe('pin ••••••');
      });
      it(`${name} digits do not hide ordinary short numbers or amounts`, () => {
        expect(screen(make('50000')).blocked).toBe(false);
        expect(screen(make('9876543210'), 'phone').blocked).toBe(false);
        expect(screen(`I earn ${make('120000')} a month`).blocked).toBe(false);
      });
    });
    it('hides a Devanagari mobile number to the last four digits at the phone step, and does not block it', () => {
      const r = screen(devanagari('9876543210'), 'phone');
      expect(r.blocked).toBe(false);
      expect(r.display).toBe(`••••••${devanagari('3210')}`);
    });
    it('keeps surrounding non-Latin text exactly as typed while hiding only the secret', () => {
      const text = 'मेरा PAN ABCDE1234F है, धन्यवाद';
      const r = screen(text);
      expect(r.display).toBe('मेरा PAN •••••••••• है, धन्यवाद');
    });
  });
  describe('PANs with separators, in capitals and in lower case', () => {
    ['ABCDE1234F', 'abcde1234f', 'AbCdE1234f', 'ABCDE 1234 F', 'ABCDE 1234F', 'ABCDE1234 F', 'ABCDE-1234-F', 'abcde-1234-f', 'ABCDE-1234F', 'ABCDE1234-F'].forEach((pan) => {
      it(`"${pan}"`, () => {
        const r = screen(`my pan is ${pan} ok`);
        expect(r.kinds).toEqual(['pan']);
        expect(r.display).toMatch(/^my pan is [•\s-]+ ok$/);
        expect(r.display).not.toMatch(/[A-Za-z0-9]{4}/);
      });
    });
    it('folds full-width and zero-width tricks', () => {
      expect(screen(fullwidthLetters('ABCDE') + fullwidthDigits('1234') + fullwidthLetters('F')).kinds).toEqual(['pan']);
      expect(screen(`ABC${ZWSP}DE1234F`).kinds).toEqual(['pan']);
      expect(screen(`ABCDE${ZWNJ}1234${BOM}F`).kinds).toEqual(['pan']);
    });
    it('does not flag lower-case words that happen to be shaped like a spaced PAN', () => {
      ['since 2026 i started', 'about 2030 a plan', 'years 2026 a lot', 'ABCDE 12345 F', 'ABCDEF 1234 F', 'XXABCDE 1234 F ok'].forEach((t) => expect(screen(t).blocked, t).toBe(false));
    });
  });
  describe('credential-like secrets', () => {
    const secrets = [
      ['pin 4321', '4321'], ['my pin is 4321', '4321'], ['PIN: 4321', '4321'], ['pin number is 4321', '4321'], ['mpin 4321', '4321'],
      ['cvv 123', '123'], ['cvv: 123', '123'], ['cvv is 123', '123'], ['cvc 456', '456'], ['security code 123', '123'],
      ['password hunter2', 'hunter2'], ['password: hunter2', 'hunter2'], ['my password is Hunter2', 'Hunter2'], ['mera password abc123', 'abc123'],
      ['password hai abc123', 'abc123'], ['passcode 482913', '482913'], ['upi pin is 9087', '9087'], ['atm pin 5566', '5566'],
      ['net banking password: abc123', 'abc123'], ['login password is abc123', 'abc123'], ['pwd abc123', 'abc123'],
      ['password is hunter', 'hunter'], ['password: hunter', 'hunter'], ['password = Tr0ub4dor', 'Tr0ub4dor'], ['"password": "hunter2"', 'hunter2'],
    ];
    it.each(secrets)('"%s" is flagged and the value is hidden', (text, value) => {
      const r = screen(text);
      expect(r.blocked).toBe(true);
      expect(r.kinds).toEqual(['password']);
      expect(r.display).not.toContain(value);
      expect(bullets(r.display)).toBeGreaterThan(0);
    });
    it('hides the value with a fixed-length mask, so its length is not shown', () => {
      expect(screen('pin 43').display).toBe('pin 43'); // too short to be a PIN: not flagged
      expect(screen('password hunter2').display).toBe(screen('password a1b2c3d4e5f6g7h8').display);
    });
    it('keeps the words around the secret', () => {
      expect(screen('my password is Hunter2 ok').display).toBe('my password is •••••• ok');
      expect(screen('cvv 123 and pin 4321').display).toBe('cvv •••••• and pin ••••••');
    });
  });
  describe('a message that holds several secrets never leaves one visible because another was found', () => {
    it('hides every recognised secret in a single message', () => {
      const text = 'PAN ABCDE1234F, a/c 123456789012, card 4111 1111 1111 1111, aadhaar 1234.5678.9012, my otp is 482913, pin 4321, cvv 123, password hunter2';
      const r = screen(text + ' ');
      expect(r.blocked).toBe(true);
      ['ABCDE1234F', '123456789012', '4111', '1234.5678.9012', '482913', '4321', ' 123', 'hunter2'].forEach((s) => expect(r.display, s).not.toContain(s));
      expect(r.kinds).toEqual(['pan', 'aadhaar', 'account-or-card', 'otp', 'password']);
    });
    it('hides the reported example: a PAN together with a PIN', () => {
      const r = screen('my pan is ABCDE1234F and pin 4321');
      expect(r.display).toBe('my pan is •••••••••• and pin ••••••');
    });
    it('holds when the secrets are written in different alphabets and with invisible characters', () => {
      const text = `pan ABC${ZWSP}DE1234F, card ${devanagari('4111 1111 1111 1111')}, pin ${fullwidthDigits('4321')}, otp ${arabicIndic('482913')}`;
      const r = screen(text);
      expect(r.blocked).toBe(true);
      expect(r.display).not.toMatch(/\p{Nd}/u);
      expect(r.display).not.toMatch(/ABC|DE1234/);
      expect(r.kinds).toEqual(['pan', 'account-or-card', 'otp', 'password']);
    });
    it('property: random messages built from secrets and ordinary text always hide every secret they contain', () => {
      const secretsList = [
        'ABCDE1234F', 'abcde-1234-f', 'ABCDE 1234 F', 'account 123456789012', 'card 4111 1111 1111 1111', 'card 4111.1111.1111.1111', 'aadhaar 1234 5678 9012',
        'my otp is 482913', '482913 is my otp', 'verification code 123456', 'pin 7391', 'cvv: 123', 'password hunter2', 'my password is Hunter2',
        `acct ${devanagari('123456789012')}`, `card ${fullwidthDigits('4111111111111111')}`, `pin ${arabicIndic('7391')}`, `12345${ZWSP}6789012`,
      ];
      const values = ['ABCDE1234F', 'abcde-1234-f', 'ABCDE 1234 F', '123456789012', '4111', '1234 5678 9012', '482913', '123456', '7391', 'hunter2', 'Hunter2'];
      const benign = ['hello', 'what is a SIP', 'I earn 1.2 lakh a month', 'call 9876543210', '50000', 'thanks', 'how much should I invest', 'my wife and kids', 'in 2026'];
      let seed = 5;
      const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      for (let i = 0; i < 4000; i += 1) {
        const n = 1 + Math.floor(rnd() * 5);
        const chosen = [];
        for (let k = 0; k < n; k += 1) chosen.push(rnd() < 0.55 ? secretsList[Math.floor(rnd() * secretsList.length)] : benign[Math.floor(rnd() * benign.length)]);
        const text = chosen.join(rnd() < 0.5 ? ', ' : ' and ');
        const r = screen(text);
        const hasSecret = chosen.some((c) => secretsList.includes(c));
        if (hasSecret) {
          expect(r.blocked, text).toBe(true);
          values.forEach((v) => expect(r.display, `${v} in ${text}`).not.toContain(v));
          expect(screen(r.display).blocked, `idempotent: ${text}`).toBe(false);
        } else expect(r.blocked, text).toBe(false);
      }
    });
  });
});

/* ================================================================== */
describe('M2: zero-width characters and Unicode digits are normalised safely', () => {
  it('detects numbers split by zero-width or soft-hyphen characters, and hides the whole number', () => {
    [`1234567${ZWSP}89012`, `1234${ZWNJ}5678${BOM}9012`, `12345${SOFT_HYPHEN}6789012`].forEach((n) => {
      const r = screen(`acct ${n}`);
      expect(r.kinds.length, n).toBeGreaterThan(0); // twelve digits split by invisible characters read as a long number and as an Aadhaar-like one
      expect(r.kinds.every((k) => k === 'account-or-card' || k === 'aadhaar'), n).toBe(true);
      expect(r.display, n).toBe('acct ••••••••••••');
    });
  });
  it('does not leave the tail of a split number visible (the reported 3456 leak)', () => {
    const r = screen(`123456789012${ZWSP}3456`);
    expect(r.display).toBe('••••••••••••••••');
    expect(digitsOf(r.display)).toBe('');
  });
  it('removes the invisible characters from inside a hidden span, and leaves them outside it untouched', () => {
    const r = screen(`note${ZWSP}: 123456${ZWSP}789012 ok`);
    expect(r.display).toBe(`note${ZWSP}: •••••••••••• ok`);
  });
  it('treats a message made only of invisible characters as empty', () => {
    expect(screen(`${ZWSP}${ZWNJ}${BOM}`).blocked).toBe(false);
  });
  it('maps every redacted range back to the original text without shifting it, even after characters were removed or expanded', () => {
    const text = `${ZWSP}${ZWSP}ab ${cp(0x33af)} ${cp(0x2460)} pin 4321 ${fullwidthLetters('x')} acct 123456789012 end`;
    const r = screen(text);
    expect(r.display.endsWith(' end')).toBe(true);
    expect(r.display).toContain('acct ••••••••••••');
    expect(r.display).not.toContain('4321');
  });
  it('does not turn ordinary compatibility characters into false alarms', () => {
    ['ﬁnance plan', `${cp(0x00bd)} lakh`, `m${cp(0xb2)} area 1200`, `${cp(0x2460)} first`, 'x² + y²'].forEach((t) => expect(screen(t).blocked, t).toBe(false));
  });
  it('does not change what is shown for safe input, including odd characters', () => {
    ['नमस्ते', 'こんにちは 12', `a${ZWSP}b`, cp(0x1f600), 'ﬁnance'].forEach((t) => expect(screen(t).display).toBe(t.trim()));
  });
  it('handles text that normalises to many characters without slowing down or shifting the redaction', () => {
    const long = cp(0x33af).repeat(300) + ' pin 4321';
    const r = screen(long);
    expect(r.kinds).toEqual(['password']);
    expect(r.display.endsWith('pin ••••••')).toBe(true);
    expect(r.display.startsWith(cp(0x33af))).toBe(true);
  });
});

/* ================================================================== */
describe('M3: false positives', () => {
  const benign = [
    '5000 10000 15000', '1000 2000', '500 600 700 800', 'my SIP dates are 1 5 10 15 20 25 30', 'invest 100000 200000', '100000, 200000', '100000 or 200000',
    'password is required for upi', 'the pin is on the back', 'cvv is on the card', 'my password is weak', 'my password is secure', 'the password is stored encrypted',
    'pin is needed', 'password is 8 characters', 'pin is 4 digits', 'my pin is a 4 digit number', 'what pin is it', 'password manager', 'forgot password', 'how to change password',
    'reset my pin', 'what is a pin', 'pin code 400001', 'OTP 2026', 'otp is valid for 10 minutes', 'otp expires in 5 minutes', 'what is an OTP in 2026', 'since 2026 I started',
    '12-10-2026', '10.12.2026', '2026 10 12', '1,00,00,00,000', '50,00,000', 'call 98765 43210 or 98765 43211', 'I have 3 SIPs of 5000 each', 'I want 20 lakh in 15 years',
  ];
  it.each(benign)('"%s" is not flagged', (t) => expect(screen(t).blocked).toBe(false));
  it('does not alter benign text at all', () => {
    benign.forEach((t) => expect(screen(t).display).toBe(t));
  });
  it('still flags real credentials next to the same keywords (detection is not weakened to pass the benign cases)', () => {
    ['my password is Hunter2', 'my password is hunter', 'password: hunter', 'my pin is 4321', 'pin 4321', 'cvv is 123', 'cvv 123', 'otp is 2026', 'my otp is 482913', '482913 is my otp', 'verification code 2026 is my otp', 'password hunter2'].forEach((t) =>
      expect(screen(t).blocked, t).toBe(true));
  });
  it('treats an OTP year as an OTP when a connecting word is present, and ignores it when the year stands alone', () => {
    expect(screen('OTP 2026').blocked).toBe(false);
    expect(screen('otp is 2026').blocked).toBe(true);
    expect(screen('otp: 2026').blocked).toBe(true);
    expect(screen('2026 is my otp').blocked).toBe(true);
    expect(screen('otp 7391').blocked).toBe(true);
  });
  it('requires the same width for separated groups, so lists of unequal numbers are not read as one number', () => {
    expect(screen('4 5 6 7 8 9 1 2 3 4 5 6').blocked).toBe(false);
    expect(screen('100 2000 30000 400000').blocked).toBe(false);
    expect(screen('1234 5678 9012').blocked).toBe(true);
  });
  it('does not weaken contiguous long numbers: twelve or more digits without separators are always flagged', () => {
    ['123456789012', '9'.repeat(25), '4111111111111111'].forEach((n) => expect(screen(n).blocked, n).toBe(true));
    expect(screen('12345678901').blocked).toBe(false);
  });
});

/* ================================================================== */
describe('valid Indian phone numbers at the phone step', () => {
  const validFormats = [
    '9876543210', '98765 43210', '98765-43210', '+91 98765 43210', '+91-98765-43210', '+919876543210', '09876543210', '919876543210', '91 9876543210', '91-9876543210',
    '+91 98 76 54 32 10', '98 76 54 32 10', '9 8 7 6 5 4 3 2 1 0', '(+91) 98765 43210', '98765.43210', '0 9876543210', 'call 9876543210', '+91  98765  43210', '98765 - 43210',
    `98765${NBSP}43210`, '  9876543210  ', '8765432109', '7012345678', '6123456789',
  ];
  it.each(validFormats)('"%s" is accepted by the booking validator and is not blocked here', (n) => {
    expect(bookingAcceptsPhone(n), 'booking validator').toBe(true);
    const r = screen(n, 'phone');
    expect(r.blocked).toBe(false);
    expect(r.kinds).toEqual([]);
    expect(r.truncated).toBe(false);
  });
  it('does not flag any of them in free chat or at other steps either', () => {
    const bareTwelve = '919876543210'; // ambiguous with an Aadhaar number, so it is flagged outside the phone step (see the second hardening tests)
    validFormats.filter((n) => n !== bareTwelve).forEach((n) => ['chat', 'name', 'hlv'].forEach((step) => expect(screen(n, step).kinds.filter((k) => k !== 'too-long'), `${step}: ${n}`).toEqual([])));
  });
  it('shows only the last four digits in the phone-step display', () => {
    expect(screen('9876543210', 'phone').display).toBe('••••••3210');
    expect(screen('98765 43210', 'phone').display).toBe('••••• •3210');
    expect(screen('+91 98765 43210', 'phone').display).toBe('+•• ••••• •3210');
    expect(screen('+91-98765-43210', 'phone').display).toBe('+••-•••••-•3210');
    expect(screen('09876543210', 'phone').display).toBe('•••••••3210');
    validFormats.forEach((n) => expect(digitsOf(screen(n, 'phone').display).length, n).toBeLessThanOrEqual(4));
  });
  it('hides more than the chat\'s current mask does for spaced numbers, and matches it for the plain form', () => {
    const current = (t) => t.replace(/\d(?=\d{4})/g, '•'); // what SolahanaChat.jsx does today
    expect(screen('9876543210', 'phone').display).toBe(current('9876543210'));
    expect(digitsOf(current('+91 98765 43210')).length).toBeGreaterThan(4);
    expect(digitsOf(screen('+91 98765 43210', 'phone').display).length).toBe(4);
  });
  it('does not block numbers the booking validator rejects, so its normal message still appears', () => {
    ['12345', '5876543210', '98765', '987654321'].forEach((n) => expect(screen(n, 'phone').blocked, n).toBe(false));
    expect(bookingAcceptsPhone('5876543210')).toBe(false);
  });
});

/* ================================================================== */
describe('M5: card-like numbers at the phone step (Luhn)', () => {
  it('blocks a Luhn-valid number of 13 to 15 digits, which is probably a card', () => {
    ['378282246310005', '30569309025904', '4222222222222', withLuhn('411111111111'), withLuhn('37828224631000'), withLuhn('3056930902590')].forEach((n) => {
      expect(luhnValid(n), `${n} is Luhn-valid`).toBe(true);
      const r = screen(n, 'phone');
      expect(r.blocked, n).toBe(true);
      expect(r.kinds, n).toEqual(['account-or-card']);
      expect(digitsOf(r.display), n).toBe('');
    });
  });
  it('leaves a number of 12 to 15 digits that fails the Luhn check to the booking validator, which rejects it', () => {
    ['12345678901234', '123456789012345', withoutLuhn('411111111111'), withoutLuhn('4111111111111'), withoutLuhn('37828224631000')].forEach((n) => {
      expect(luhnValid(n), `${n} fails Luhn`).toBe(false);
      expect(screen(n, 'phone').blocked, n).toBe(false);
      expect(bookingAcceptsPhone(n), `${n} rejected by booking`).toBe(false);
    });
  });
  it('always blocks 16 or more digits at the phone step, whatever the checksum', () => {
    ['4111111111111111', '1234567890123456', withoutLuhn('411111111111111'), '12345678901234567', '9'.repeat(19)].forEach((n) => expect(screen(n, 'phone').blocked, n).toBe(true));
  });
  it('does not touch a valid mobile number, even when the digits happen to pass the Luhn check', () => {
    const luhnMobile = withLuhn('987654321');
    expect(luhnMobile.length).toBe(10);
    const r = screen(luhnMobile, 'phone');
    expect(r.blocked).toBe(false);
    expect(bookingAcceptsPhone(luhnMobile)).toBe(true);
  });
  it('applies the Luhn exemption only at the phone step', () => {
    expect(screen('12345678901234').blocked).toBe(true); // chat
    expect(screen('123456789012345', 'name').blocked).toBe(true);
    expect(screen('123456789012345', 'phone').blocked).toBe(false);
  });
  it('is documented as a checksum, not proof: some Luhn-valid phone-length numbers are blocked, and the limitation list says so', () => {
    const international = withLuhn('97150123456'); // twelve digits that happen to pass
    expect(screen(`+${international}`, 'phone').blocked).toBe(true);
    expect(KNOWN_LIMITATIONS.some((l) => /Luhn/.test(l))).toBe(true);
  });
  it('still hides the digits of an Aadhaar-shaped number at the phone step', () => {
    expect(screen('1234 5678 9012', 'phone').kinds).toEqual(['aadhaar']);
  });
});

/* ================================================================== */
describe('normal email addresses at the email step', () => {
  const emails = ['john1234@example.com', 'priya.sharma@gmail.com', '9876543210@gmail.com', 'user+tag@sub.example.co.in', 'priya.987654321012@gmail.com', 'x1234567890123456789@example.org', 'a.b-c_d@e-f.io', '  priya@example.com  ', "o'brien+x@example.co.in", 'user@123456789012.com', 'x@y.zz', '12345678901234567890@example.com', 'otp123456@gmail.com', 'pin1234@x.com', 'password@example.com'];
  it.each(emails)('"%s" is accepted by the booking validator and is not blocked at the email step', (e) => {
    expect(bookingAcceptsEmail(e)).toBe(true);
    const r = screen(e, 'email');
    expect(r.blocked).toBe(false);
    expect(r.display).toBe(e.trim());
  });
  it('applies the allowance only at the email step', () => {
    expect(screen('priya.987654321012@gmail.com', 'chat').blocked).toBe(true);
    expect(screen('priya.987654321012@gmail.com', 'name').blocked).toBe(true);
  });
  it('still blocks a long number that is not an email, and an email-like string that is not valid', () => {
    expect(screen('987654321012', 'email').blocked).toBe(true);
    expect(screen('987654321012@', 'email').blocked).toBe(true);
    expect(screen('priya 987654321012 @gmail', 'email').blocked).toBe(true);
  });
  it('still blocks a PAN, OTP or password typed in an email-shaped line', () => {
    expect(screen('my password is abc123', 'email').blocked).toBe(true);
    expect(screen('my otp is 482913', 'email').blocked).toBe(true);
    expect(screen('ABCDE1234F @example.com', 'email').display).toBe('•••••••••• @example.com'); // not the shape of an email, so it is screened
    expect(screen('ABCDE1234F@example.com', 'chat').display).toBe('••••••••••@example.com'); // outside the email step it is still screened
  });
});

/* ================================================================== */
describe('normal financial amounts at the HLV step and in chat', () => {
  const amounts = ['50000', '50,000', '₹1,20,000', '1.1 lakh', '1.5 cr', '2cr', '100 crore', '10 lakh', '50k', '50000.126', '0', '0.5 lakh', '1,00,00,000', '1000000000', 'Rs. 45,000', '10', '40', '₹ 1,00,000.50'];
  it.each(amounts)('"%s" is not blocked at the HLV step', (a) => {
    const r = screen(a, 'hlv');
    expect(r.blocked).toBe(false);
    expect(r.display).toBe(a.trim());
    expect(r.truncated).toBe(false);
  });
  it('does not block the same amounts in free chat, or in the component\'s HLV step names', () => {
    amounts.forEach((a) => {
      expect(screen(a, 'chat').blocked, a).toBe(false);
      ['expenses', 'liabilities', 'cover', 'years'].forEach((s) => expect(screen(a, s).blocked, `${s}: ${a}`).toBe(false));
    });
  });
  it('does not block sentences that contain amounts', () => {
    ['I earn 1.2 lakh a month', 'my expenses are 50000 a month', 'I have a loan of 20 lakh', 'how will 5000 SIP grow in 10 years', 'I want to invest 10000 every month'].forEach((t) => expect(screen(t).blocked, t).toBe(false));
  });
  it('blocks a number that is only plausible as an account or card number (12 or more digits), and not one just under', () => {
    ['100000000000', '123456789012'].forEach((n) => expect(screen(n, 'hlv').blocked, n).toBe(true));
    expect(screen('99999999999', 'hlv').blocked).toBe(false);
  });
});

/* ================================================================== */
describe('whole digit runs: grouped cards, long numbers and short numbers', () => {
  it('hides a grouped sixteen-digit card in full, with no group left visible', () => {
    ['4111 1111 1111 1111', '4111-1111-1111-1111', '5500 0000 0000 0004', '4111111111111111'].forEach((card) => {
      const r = screen(`card ${card}`);
      expect(r.kinds, card).toEqual(['account-or-card']);
      expect(digitsOf(r.display), card).toBe('');
    });
  });
  it('labels exactly twelve digits in groups of four as Aadhaar-shaped, and any other long number as account or card', () => {
    expect(screen('1234 5678 9012').kinds).toEqual(['aadhaar']);
    expect(screen('123456789012').kinds).toEqual(['account-or-card']);
    expect(screen('1234 5678 9012 3').kinds).toEqual(['account-or-card']);
    expect(screen('1234 5678 9012 34').kinds).toEqual(['account-or-card']);
  });
  it('flags and hides numbers longer than nineteen digits too', () => {
    ['1'.repeat(20), '9'.repeat(25), '1234 5678 9012 3456 7890 12'.replace(/ /g, '')].forEach((n) => {
      const r = screen(`ref ${n}`);
      expect(r.blocked, n).toBe(true);
      expect(digitsOf(r.display), n).toBe('');
    });
  });
  it('does not flag runs of eleven digits or fewer, dates, or comma-grouped amounts', () => {
    ['12345678901', '1234567890', '12-10-2026', '2026 10 12', '1,00,00,00,000', '50,00,000', '100000, 200000', '100000 or 200000'].forEach((t) => expect(screen(t).blocked, t).toBe(false));
  });
  it('does not read two separate short numbers as one long number', () => {
    expect(screen('call 9876543210 or 9123456780').blocked).toBe(false);
    expect(screen('123456 and 789012').blocked).toBe(false);
    expect(screen('9876543210 12').blocked).toBe(false);
  });
  it('reports both kinds when both an Aadhaar-shaped and an account-length number are present, and hides both', () => {
    const r = screen('1234 5678 9012 and 1234567890123456');
    expect(r.kinds).toEqual(['aadhaar', 'account-or-card']);
    expect(digitsOf(r.display)).toBe('');
  });
  it('leaves a mobile number alone when it sits beside a long number', () => {
    expect(screen('9876543210 and 123456789012').display).toBe('9876543210 and ••••••••••••');
  });
  it('reads groups separated by up to three spaces as one number, but four spaces as two', () => {
    expect(screen('1234  5678  9012').kinds).toEqual(['aadhaar']);
    expect(screen('1234    5678    9012').blocked).toBe(false);
  });
});

/* ================================================================== */
describe('the returned display never contains the original sensitive value', () => {
  it.each(SENSITIVE)('"$text"', ({ text, secret }) => {
    const r = screen(text);
    expect(r.blocked).toBe(true);
    expect(r.display).not.toContain(secret);
    expect(r.display.toLowerCase()).not.toContain(secret.toLowerCase());
    if (/\d{4}/.test(secret)) digitWindows(secret).forEach((w) => expect(digitsOf(r.display), `fragment ${w}`).not.toContain(w));
    expect(bullets(r.display)).toBeGreaterThan(0);
  });
  it('holds at every step, including in the JSON of the whole result', () => {
    STEPS.forEach((step) => {
      SENSITIVE.forEach(({ text, secret }) => {
        const r = screen(text, step);
        if (r.blocked && !r.truncated) {
          expect(r.display, `${step}: ${text}`).not.toContain(secret);
          expect(JSON.stringify(r), `${step}: ${text}`).not.toContain(secret);
        }
      });
    });
  });
  it('keeps the rest of the message readable', () => {
    expect(screen('my PAN is ABCDE1234F what is SIP').display).toBe('my PAN is •••••••••• what is SIP');
    expect(screen('my otp is 482913').display).toBe('my otp is ••••••');
    expect(screen('482913 is my otp').display).toBe('•••••• is my otp');
    expect(screen('my password is Hunter2 ok').display).toBe('my password is •••••• ok');
    expect(screen('account 123456789012').display).toBe('account ••••••••••••');
    expect(screen('card 4111 1111 1111 1111').display).toBe('card •••• •••• •••• ••••');
    expect(screen('aadhaar 1234 5678 9012').display).toBe('aadhaar •••• •••• ••••');
  });
  it('leaves nothing detectable in the display, and is idempotent', () => {
    SENSITIVE.forEach(({ text, secret }) => {
      const r = screen(text);
      expect(sensitiveKinds(r.display), text).toEqual([]);
      expect(leaked(r.display, secret, text), `${text} -> ${r.display}`).toBe(false);
      expect(screen(r.display).blocked, text).toBe(false);
      expect(redact(redact(text)), text).toBe(redact(text));
    });
  });
  it('shows a mobile number typed in free chat, as today, because it is not sensitive', () => {
    expect(screen('call me on 9876543210').display).toBe('call me on 9876543210');
    expect(redact('call me on 9876543210')).toBe('call me on 9876543210');
  });
  it('redacts the sensitive part and keeps a mobile number when both are present in free chat', () => {
    expect(screen('my pan is ABCDE1234F, call 9876543210').display).toBe('my pan is ••••••••••, call 9876543210');
  });
  it('masks the digits next to a blocked value at the phone step, keeping only the last four', () => {
    const r = screen('ABCDE1234F 98765432', 'phone');
    expect(r.blocked).toBe(true);
    expect(r.display).not.toContain('ABCDE1234F');
    expect(r.display).not.toContain('9876');
    expect(r.display.endsWith('5432')).toBe(true);
  });
  it('hides every digit of a grouped card in the common layouts, however the groups are separated', () => {
    const layouts = [[4, 4, 4, 4], [4, 4, 4, 4, 3], [4, 6, 5], [4, 6, 4], [4, 6, 6]];
    const seps = [' ', '-', '.', '/', '_', '  ', ' - '];
    const rnd = seeded(77);
    const digits = (n) => Array.from({ length: n }, () => 2 + Math.floor(rnd() * 8)).join('');
    for (let i = 0; i < 500; i += 1) {
      const layout = layouts[i % layouts.length];
      const sep = seps[Math.floor(rnd() * seps.length)];
      const card = layout.map(digits).join(sep);
      const text = `pay ${card} now`;
      const r = screen(text);
      expect(r.blocked, text).toBe(true);
      expect(digitsOf(r.display), `${text} -> ${r.display}`).toBe('');
      expect(r.display.startsWith('pay ') && r.display.endsWith(' now'), r.display).toBe(true);
      expect(leaked(r.display, card, text), r.display).toBe(false);
    }
  });
  it('hides every digit of a long digit sequence of 12 to 40 digits, and keeps the words around it', () => {
    for (let n = 12; n <= 40; n += 1) {
      const run = String(2 + (n % 8)) + '7'.repeat(n - 2) + '3';
      const r = screen(`ref ${run} done`);
      expect(r.blocked, `${n} digits`).toBe(true);
      expect(r.display, `${n} digits`).toBe(`ref ${'•'.repeat(n)} done`);
    }
    expect(digitsOf(screen('ref ' + '9'.repeat(25)).display)).toBe('');
  });
  it('shows no part of a recognised secret in the displayed text of a mixed message, and keeps the ordinary words', () => {
    const cases = [
      ['my card is 4111 1111 1111 1111 and my pan is ABCDE1234F please help with SIP', ['4111 1111 1111 1111', 'ABCDE1234F'], ['my card is', 'and my pan is', 'please help with SIP']],
      ['aadhaar 2345 6789 0123, account number 12345678901, otp 482913 thanks', ['2345 6789 0123', '12345678901', '482913'], ['aadhaar', 'account number', 'otp', 'thanks']],
      ['I earn 1.2 lakh, my pin is 5826 and I want to retire at 60', ['5826'], ['I earn 1.2 lakh', 'my pin is', 'and I want to retire at 60']],
      ['password is: hunter2 (call 9876543210 after 6 pm)', ['hunter2'], ['password is:', 'call 9876543210 after 6 pm']],
      ['card 4111 1111 1111 1111 12/26 cvv 739 for 50000 rupees', ['4111 1111 1111 1111', '739'], ['card', '/26', 'for 50000 rupees']],
    ];
    cases.forEach(([text, secrets, words]) => {
      const r = screen(text);
      expect(r.blocked, text).toBe(true);
      secrets.forEach((sec) => expect(leaked(r.display, sec, text), `"${sec}" in "${r.display}"`).toBe(false));
      words.forEach((w) => expect(r.display, text).toContain(w));
      expect(sensitiveKinds(r.display), r.display).toEqual([]);
    });
  });
});

/* ================================================================== */
describe('M1: no placeholder characters, no collisions, and source integrity', () => {
  const src = read('./chatPrivacy.js');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const allowedControls = new Set([9, 10, 13]);
  const badChars = (text) => [...text].map((c) => c.codePointAt(0)).filter((n) => (n < 32 && !allowedControls.has(n)) || (n >= 0x7f && n <= 0x9f) || (n >= 0x200b && n <= 0x200f) || (n >= 0x2028 && n <= 0x202e) || (n >= 0x2060 && n <= 0x206f) || (n >= 0xe000 && n <= 0xf8ff) || n === 0xfeff || n === 0xfffe || n === 0xffff);

  it('has no invisible, control or private-use characters anywhere in the source or in this test file', () => {
    expect(badChars(src)).toEqual([]);
    expect(badChars(read('./chatPrivacy.test.js'))).toEqual([]);
  });
  it('has no backslash-u escape sequences in the source, so a tool cannot silently turn them into raw characters', () => {
    const backslash = String.fromCharCode(92);
    expect(src.split(backslash + 'u').length - 1).toBe(0);
    expect(src.split(backslash + 'x').length - 1).toBe(0);
  });
  it('has no lookbehind and no imports', () => {
    expect(code).not.toMatch(/\(\?<[=!]/);
    expect(code).not.toMatch(/^\s*import\s/m);
  });
  it('shows no placeholder or "undefined" when a visitor types private-use characters, and repeats nothing', () => {
    const attempts = [
      `call 9876543210 ${PUA_START}0${PUA_END}`,
      `${PUA_START}3${PUA_END} my otp is 482913`,
      `x ${PUA_START}0${PUA_END} 9876543210 ${PUA_START}1${PUA_END}`,
      `${PUA_START}${PUA_START}0${PUA_END}${PUA_END} pin 4321`,
      `${PUA_END}0${PUA_START}`,
    ];
    attempts.forEach((t) => {
      const r = screen(t);
      expect(r.display, t).not.toContain('undefined');
      expect(r.display, t).not.toContain('NaN');
      expect((r.display.match(/9876543210/g) || []).length, t).toBeLessThanOrEqual(1);
      expect(redact(t), t).not.toContain('undefined');
    });
  });
  it('treats user-typed private-use characters as ordinary text and leaves them where they were', () => {
    expect(screen(`a${PUA_START}b`).display).toBe(`a${PUA_START}b`);
    expect(screen(`a${PUA_START}0${PUA_END}b`).blocked).toBe(false);
    expect(redact(`a ${PUA_START}0${PUA_END} b pin 4321`)).toBe(`a ${PUA_START}0${PUA_END} b pin ••••••`);
  });
  it('gives the same result however many private-use characters are mixed into a secret-bearing message (fuzz)', () => {
    let seed = 3;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < 1500; i += 1) {
      let t = '';
      const n = 1 + Math.floor(rnd() * 12);
      for (let k = 0; k < n; k += 1) t += [PUA_START, PUA_END, '0', '1', '9', ' ', 'pin 7391', '9876543210', 'abc'][Math.floor(rnd() * 9)] + ' ';
      const r = screen(t);
      expect(r.display).not.toContain('undefined');
      if (/(^|\s)pin 7391/.test(t)) expect(r.display).not.toContain('7391');
    }
  });
});

/* ================================================================== */
describe('truncation is surrogate-safe (L3)', () => {
  const lone = (s) => {
    for (let i = 0; i < s.length; i += 1) {
      const c = s.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff) { const n = s.charCodeAt(i + 1); if (!(n >= 0xdc00 && n <= 0xdfff)) return true; i += 1; } else if (c >= 0xdc00 && c <= 0xdfff) return true;
    }
    return false;
  };
  it('never splits an emoji at the limit, at any step and any offset', () => {
    STEPS.forEach((step) => {
      const limit = FIELD_LIMITS[step];
      [limit - 2, limit - 1, limit, limit + 1].forEach((prefixLength) => {
        const r = screen('a'.repeat(Math.max(prefixLength, 0)) + cp(0x1f600) + 'tail', step);
        expect(lone(r.display), `${step} ${prefixLength}`).toBe(false);
        expect(r.display.length, `${step} ${prefixLength}`).toBeLessThanOrEqual(limit);
        expect(r.truncated, `${step} ${prefixLength}`).toBe(true);
      });
    });
  });
  it('drops the half pair rather than showing a broken character', () => {
    const r = screen('a'.repeat(499) + cp(0x1f600) + 'y');
    expect(r.display).toBe('a'.repeat(499));
    expect(r.truncated).toBe(true);
  });
  it('keeps an emoji that fits, and counts it as two units of length like the input box does', () => {
    expect(screen(cp(0x1f600).repeat(250)).blocked).toBe(false);
    expect(screen(cp(0x1f600).repeat(251)).blocked).toBe(true);
  });
  it('never shows a lone surrogate for a blocked, redacted message either', () => {
    const r = screen('pin 4321 ' + cp(0x1f600).repeat(300));
    expect(lone(r.display)).toBe(false);
    expect(r.kinds).toEqual(['too-long', 'password']);
  });
});

/* ================================================================== */
describe('regex state safety (L5)', () => {
  it('gives the same result when the same input is screened repeatedly and between other inputs', () => {
    const inputs = ['pin 4321', 'ABCDE1234F', '1234 5678 9012 3456', 'hello', 'my otp is 482913', 'ABCDE 1234 F', 'password hunter2'];
    const first = inputs.map((t) => screen(t));
    for (let round = 0; round < 5; round += 1) {
      [...inputs].reverse().forEach((t) => screen(t));
      inputs.forEach((t, i) => expect(screen(t)).toEqual(first[i]));
    }
  });
  it('gives the same result for screen, redact and liveWarning in any order', () => {
    const t = 'pin 4321 and ABCDE1234F';
    const a = [screen(t), redact(t), liveWarning(t)];
    const b = [liveWarning(t), redact(t), screen(t)].reverse();
    expect(b).toEqual(a);
  });
  it('exports no regular expression object that could carry state between calls', () => {
    Object.entries(privacy).forEach(([name, value]) => expect(value instanceof RegExp, name).toBe(false));
  });
  it('audits patterns without the global or sticky flags, and builds fresh ones for every use', () => {
    auditablePatterns().forEach(([name, re]) => {
      expect(re.flags.includes('g'), name).toBe(false);
      expect(re.flags.includes('y'), name).toBe(false);
      expect(re.lastIndex, name).toBe(0);
    });
    const code = read('./chatPrivacy.js').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(code).not.toMatch(/^const [A-Z_]+_RE = \/.*\/[a-z]*g/m);
  });
});

/* ================================================================== */
describe('live warning', () => {
  it('warns while a complete sensitive value is typed, and not before', () => {
    expect(liveWarning('my pan is ABCDE1234F')).toBe(LIVE_WARNING);
    expect(liveWarning('my pan is ABCDE1234')).toBe('');
    expect(liveWarning('my otp is 482913')).toBe(LIVE_WARNING);
    expect(liveWarning('my otp is')).toBe('');
    expect(liveWarning('my password is Hunter2')).toBe(LIVE_WARNING);
    expect(liveWarning('pin 4321')).toBe(LIVE_WARNING);
    expect(liveWarning('account 123456789012')).toBe(LIVE_WARNING);
    expect(liveWarning(`card ${devanagari('4111 1111 1111 1111')}`)).toBe(LIVE_WARNING);
  });
  it('says nothing for normal text, amounts, phone numbers and emails', () => {
    ['', 'What is a SIP?', '50000', '1.1 lakh', '9876543210', 'call 9876543210', 'password is required', '5000 10000 15000'].forEach((t) => expect(liveWarning(t), t).toBe(''));
    expect(liveWarning('+91 98765 43210', { step: 'phone' })).toBe('');
    expect(liveWarning('priya.987654321012@gmail.com', { step: 'email' })).toBe('');
  });
  it('follows the same step rules as the screening', () => {
    expect(liveWarning('priya.987654321012@gmail.com', { step: 'chat' })).toBe(LIVE_WARNING);
    expect(liveWarning('4111111111111111', { step: 'phone' })).toBe(LIVE_WARNING);
    expect(liveWarning('12345678901234', { step: 'phone' })).toBe('');
    expect(liveWarning('378282246310005', { step: 'phone' })).toBe(LIVE_WARNING);
  });
  it('warns about length when the message is too long but otherwise safe, and about sensitive content first', () => {
    expect(liveWarning('a'.repeat(501))).toBe(LENGTH_WARNING);
    expect(liveWarning('a'.repeat(31), { step: 'hlv' })).toBe(LENGTH_WARNING);
    expect(liveWarning('a'.repeat(300) + ' pin 4321' + ' b'.repeat(200))).toBe(LIVE_WARNING);
  });
  it('agrees with screenUserText on every case: a warning exactly when the message is blocked', () => {
    [...SENSITIVE.map((s) => s.text), 'hello', '9876543210', 'john1234@example.com', '1.1 lakh', 'a'.repeat(600), 'pin is required', 'my password is hunter'].forEach((t) =>
      STEPS.forEach((step) => expect(liveWarning(t, { step }) !== '', `${step}: ${t.slice(0, 30)}`).toBe(screen(t, step).blocked)));
  });
});

/* ================================================================== */
describe('static texts', () => {
  const texts = { PRIVACY_HINT, LIVE_WARNING, FLOW_REMINDER, LENGTH_WARNING };
  it('contain no digits, currency or percent signs', () => {
    Object.entries(texts).forEach(([k, s]) => expect(s, k).not.toMatch(/[0-9₹%]/));
  });
  it('are fixed strings that cannot contain anything the visitor typed', () => {
    Object.entries(texts).forEach(([k, s]) => expect(typeof s, k).toBe('string'));
    const before = JSON.stringify(texts);
    screen('my pan is ABCDE1234F');
    liveWarning('my pan is ABCDE1234F');
    expect(JSON.stringify(texts)).toBe(before);
    expect(before).not.toContain('ABCDE');
  });
  it('name PAN, passwords, OTPs and account numbers, and use UK spelling', () => {
    expect(PRIVACY_HINT).toMatch(/PAN/);
    expect(PRIVACY_HINT).toMatch(/passwords/);
    expect(PRIVACY_HINT).toMatch(/OTPs/);
    expect(PRIVACY_HINT).toMatch(/account numbers/);
    expect(FLOW_REMINDER).toMatch(/I have not used it/);
    expect(LENGTH_WARNING).toMatch(/too long/);
    Object.values(texts).forEach((s) => expect(s).not.toMatch(/\b(color|center|authorized|organization|personalized)\b/i));
  });
  it('keep the hint short enough for one line on a phone, and never promise protection', () => {
    expect(PRIVACY_HINT.length).toBeLessThanOrEqual(70);
    expect(LIVE_WARNING.length).toBeLessThanOrEqual(80);
    expect(LENGTH_WARNING.length).toBeLessThanOrEqual(70);
    Object.values(texts).forEach((s) => expect(s).not.toMatch(/\b(always|guarantee|safe|secure|protected)\b/i));
  });
});

/* ================================================================== */
describe('maskPhoneDisplay', () => {
  it('keeps only the last four digits and every separator', () => {
    expect(maskPhoneDisplay('9876543210')).toBe('••••••3210');
    expect(maskPhoneDisplay('+91 98765 43210')).toBe('+•• ••••• •3210');
    expect(maskPhoneDisplay('1234')).toBe('1234');
    expect(maskPhoneDisplay('12345')).toBe('•2345');
    expect(maskPhoneDisplay('')).toBe('');
    expect(maskPhoneDisplay(null)).toBe('');
    expect(maskPhoneDisplay('no digits here')).toBe('no digits here');
  });
  it('counts any Unicode decimal digit', () => {
    expect(maskPhoneDisplay(devanagari('9876543210'))).toBe(`••••••${devanagari('3210')}`);
    expect(maskPhoneDisplay(fullwidthDigits('98765 43210'))).toBe(`••••• •${fullwidthDigits('3210')}`);
    expect(maskPhoneDisplay(arabicIndic('9876543210'))).toBe(`••••••${arabicIndic('3210')}`);
  });
});

/* ================================================================== */
describe('purity and pattern safety', () => {
  const src = read('./chatPrivacy.js');
  const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  it('touches no DOM, storage, network, timers or console, and does not import the knowledge content', () => {
    expect(code).not.toMatch(/\b(window|document|localStorage|sessionStorage|fetch|axios|XMLHttpRequest|setTimeout|setInterval|console|navigator)\b/);
    expect(code).not.toMatch(/chatKnowledge|chatRouter|SolahanaChat/);
  });
  it('has no unbounded wildcard, no nested unbounded quantifier and no lookbehind in any pattern', () => {
    const patterns = auditablePatterns();
    expect(patterns.length).toBeGreaterThanOrEqual(9);
    patterns.forEach(([name, re]) => {
      expect(re.source, name).not.toMatch(/(^|[^\\])\.[*+]/);
      expect(re.source, name).not.toMatch(/\((?:[^()\\]|\\.)*[*+]\)[*+]/);
      expect(re.source, name).not.toMatch(/\(\?<[=!]/);
    });
  });
  it('stays fast and bounded on adversarial input, at every step', () => {
    const inputs = {
      'digits x100000': '1234567890'.repeat(10000),
      'spaced digits': '12 34 56 78 90 '.repeat(7000),
      'dotted digits': '1.2.3.4.5.6.7.8.9.0.'.repeat(3000),
      'near-PAN': 'ABCDE1234 '.repeat(20000),
      'spaced near-PAN': 'ABCDE 1234 '.repeat(8000),
      'otp words': 'my otp '.repeat(30000),
      'otp digits': 'otp 1234 '.repeat(20000),
      'password words': 'my password is '.repeat(30000),
      'pin words': 'pin '.repeat(50000),
      'at signs': 'a@'.repeat(60000),
      dots: 'a.'.repeat(60000) + '@x',
      'expanding characters': cp(0x33af).repeat(60000),
      'zero-width flood': `1${ZWSP}`.repeat(60000),
      'unicode digits': devanagari('1234567890').repeat(8000),
      emoji: cp(0x1f600).repeat(60000),
    };
    Object.entries(inputs).forEach(([k, s]) => {
      STEPS.forEach((step) => {
        const t0 = performance.now();
        screen(s, step);
        liveWarning(s, { step });
        redact(s);
        expect(performance.now() - t0, `${k} / ${step}`).toBeLessThan(1500);
      });
    });
  });
  it('gives the same rejection for a huge message as for one just over the cap, without scanning the rest', () => {
    const just = screen('z'.repeat(SENSITIVE_SCAN_CAP + 1));
    const huge = screen('z'.repeat(2000000));
    expect(huge).toEqual(just);
    expect(huge.blocked).toBe(true);
  });
});

/* ================================================================== */
/* Second hardening stage                                              */
/* ================================================================== */
const alnum = (x) => x.replace(/[^\p{L}\p{N}]/gu, '');
/**
 * Whether any part of `secret` can still be read in `display`: verbatim; as the whole secret ignoring separators and case; as any
 * four letters or digits in a row of it (three if one of them is a digit); and, when `text` (the message as typed) is given and the display has the same length,
 * as even a single letter or digit left where the secret stood in the message. Fixtures keep ordinary digits out of the way, so
 * three in a row is a safe threshold.
 */
const leaked = (display, secret, text) => {
  if (display.includes(secret)) return true;
  const a = alnum(secret).toLowerCase();
  const d = alnum(display).toLowerCase();
  if (a.length >= 3 && d.includes(a)) return true;
  const shown = display.toLowerCase();
  for (let n = 3; n <= 4; n += 1) {
    for (let i = 0; i + n <= a.length; i += 1) {
      const g = a.slice(i, i + n);
      if ((n === 4 || /\d/.test(g)) && shown.includes(g)) return true; // three in a row if one is a digit, otherwise four, so that ordinary words do not match
    }
  }
  if (text !== undefined) {
    const typed = text.trim();
    const at = typed.indexOf(secret);
    if (at !== -1 && display.length === typed.length && /[\p{L}\p{N}]/u.test(display.slice(at, at + secret.length))) return true;
  }
  return false;
};
/** The sensitive kinds still found when a text is screened again (rejection kinds do not count). */
const sensitiveKinds = (t, step) => screen(t, step).kinds.filter((k) => !REJECTION_KINDS.includes(k));
const expectHidden = (text, secrets, step) => {
  const r = screen(text, step);
  expect(r.blocked, text).toBe(true);
  secrets.forEach((sec) => expect(leaked(r.display, sec, text), `"${sec}" is still readable in "${r.display}" (from "${text}")`).toBe(false));
  expect(sensitiveKinds(r.display, step), `re-screening "${r.display}"`).toEqual([]);
  expect(redact(redact(text)), text).toBe(redact(text));
  return r;
};
const seeded = (seed) => {
  let x = seed;
  return () => (x = (x * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
};

describe('second hardening: the leak check itself catches leaks', () => {
  it('reports a fully readable, a partly readable and a differently separated secret, and nothing for a masked one', () => {
    expect(leaked('card 4111 1111 1111 1111', '4111 1111 1111 1111')).toBe(true);
    expect(leaked('card •••• •••• •••• 1111', '4111 1111 1111 1111')).toBe(true);
    expect(leaked('card 4111-1111-1111-1111', '4111 1111 1111 1111')).toBe(true);
    expect(leaked('pan abcde1234f', 'ABCDE1234F')).toBe(true);
    expect(leaked('card •••• •••• •••• ••••', '4111 1111 1111 1111')).toBe(false);
    expect(leaked('card ••••••••••••', '4111 1111 1111 1111')).toBe(false);
  });
});

describe('second hardening, High 1 and 2: one secret never hides another, whatever sits next to it', () => {
  const CARD = '4111 1111 1111 1111';
  const CASES = [
    ['a card followed by its expiry month and year', `${CARD} 12/26`, [CARD]],
    ['a card followed by an expiry with a four-digit year', `${CARD} 12/2026`, [CARD]],
    ['a hyphenated card and a worded expiry', '4111-1111-1111-1111 exp 12/26', ['4111-1111-1111-1111']],
    ['a card after an amount', `limit 50000 ${CARD}`, [CARD]],
    ['a card after a single digit', `I have 2 ${CARD}`, [CARD]],
    ['a hyphenated card after a word that ends in a digit', 'Hunter2 4111-1111-1111-1111', ['4111-1111-1111-1111']],
    ['a card after a mobile number', `9876543210 ${CARD}`, [CARD]],
    ['a card before a mobile number', `${CARD} 9876543210`, [CARD]],
    ['an OTP followed by a card', `otp 123456 ${CARD}`, ['123456', CARD]],
    ['a card followed by an OTP', `${CARD} otp 123456`, ['123456', CARD]],
    ['a PIN followed by a card', `pin 5826 ${CARD}`, ['5826', CARD]],
    ['a card, an expiry and a CVV', `card ${CARD} 12/26 cvv 739`, [CARD, '739']],
    ['a twelve-digit number before an Aadhaar-like number', '123456789012 1234 5678 9012', ['123456789012', '1234 5678 9012']],
    ['an Aadhaar-like number before a sixteen-digit number', '1234 5678 9012 4111111111111111', ['1234 5678 9012', '4111111111111111']],
    ['an Aadhaar-like number before a twelve-digit number', '1234 5678 9012 987654321098', ['1234 5678 9012', '987654321098']],
    ['two cards in a row', `${CARD} 5500 0000 0000 0004`, [CARD, '5500 0000 0000 0004']],
    ['two cards separated by a hyphen', `${CARD} - 5500 0000 0000 0004`, [CARD, '5500 0000 0000 0004']],
    ['a card and an Aadhaar-like number', `${CARD} 2345 6789 0123`, [CARD, '2345 6789 0123']],
    ['an Aadhaar-like number followed by an amount', '2345 6789 0123 5000', ['2345 6789 0123']],
    ['an amount before an Aadhaar-like number', '5000 2345 6789 0123', ['2345 6789 0123']],
    ['a PAN beside a card', `ABCDE1234F ${CARD}`, ['ABCDE1234F', CARD]],
    ['a card beside a PAN', `${CARD} ABCDE1234F`, ['ABCDE1234F', CARD]],
    ['all five kinds at once', `PAN ABCDE1234F card ${CARD} 12/26 aadhaar 2345 6789 0123 pin 5826 otp 482913 acct 123456789012`, ['ABCDE1234F', CARD, '2345 6789 0123', '5826', '482913', '123456789012']],
  ];
  it.each(CASES)('%s', (label, text, secrets) => {
    expectHidden(text, secrets);
    ['name', 'hlv', 'email'].forEach((step) => {
      const r = screen(text, step);
      secrets.forEach((sec) => {
        if (!r.truncated) expect(leaked(r.display, sec), `${step}: ${sec} in ${r.display}`).toBe(false);
      });
    });
  });
  it('keeps a mobile number readable when it sits beside a card or an Aadhaar-like number', () => {
    expect(screen(`9876543210 ${CARD}`).display.startsWith('9876543210 ')).toBe(true);
    expect(screen(`${CARD} 9876543210`).display.endsWith(' 9876543210')).toBe(true);
    expect(screen('9876543210 2345 6789 0123').display.startsWith('9876543210 ')).toBe(true);
  });
  it('never hides everything: the words around the numbers stay readable', () => {
    expect(screen(`my card is ${CARD} 12/26 thanks`).display).toBe('my card is •••• •••• •••• •••• ••/26 thanks');
    expect(screen('limit 50000 4111 1111 1111 1111').display).toBe('limit 50000 •••• •••• •••• ••••');
  });
  it('is stable: a redacted message is not flagged again, and redacting twice changes nothing', () => {
    CASES.forEach(([, text]) => {
      const once = redact(text);
      expect(redact(once), text).toBe(once);
      expect(sensitiveKinds(once), once).toEqual([]);
    });
  });
});

describe('second hardening: random mixed-secret messages', () => {
  const PIECES = [
    { text: 'my PAN is ABCDE1234F', secrets: ['ABCDE1234F'] },
    { text: 'abcde-1234-f', secrets: ['abcde-1234-f'] },
    { text: 'ABCDE.1234.F', secrets: ['ABCDE.1234.F'] },
    { text: 'card 4111 1111 1111 1111', secrets: ['4111 1111 1111 1111'] },
    { text: 'card 5412-7534-0012-9348 exp 12/26', secrets: ['5412-7534-0012-9348'] },
    { text: '4731  2958  6074  9185', secrets: ['4731  2958  6074  9185'] },
    { text: '3714 496353 98431', secrets: ['3714 496353 98431'] },
    { text: 'aadhaar 2345 6789 0123', secrets: ['2345 6789 0123'] },
    { text: '9161 2345 7890', secrets: ['9161 2345 7890'] },
    { text: 'account 123456789012', secrets: ['123456789012'] },
    { text: 'acct no. 50100123456', secrets: ['50100123456'] },
    { text: 'my otp is 482913', secrets: ['482913'] },
    { text: '715284 is my otp', secrets: ['715284'] },
    { text: 'pin 5826', secrets: ['5826'] },
    { text: 'cvv number is 739', secrets: ['739'] },
    { text: 'password is: hunter2', secrets: ['hunter2'] },
    { text: 'passwd abc931', secrets: ['abc931'] },
    { text: `acct ${devanagari('731904825617')}`, secrets: ['731904825617'] },
    { text: `card ${fullwidthDigits('5105 1051 0510 5100')}`, secrets: ['5105 1051 0510 5100'] },
    { text: `pan ABC${ZWSP}DE5678K`, secrets: ['ABCDE5678K'] },
  ];
  const BENIGN = ['hello', 'what is a SIP', 'I earn 1.2 lakh a month', 'call 9876543210', '+91 98765 43210', 'Rs 50000', 'in 2026', '12/26', 'started 12-05-2024', '1,00,00,000', 'thanks', 'how much should I invest', 'my wife and kids', 'limit 50000', 'order 2'];
  const JOINERS = [' ', ', ', ' and ', '; ', ' - ', '  ', ' / '];
  it('hides every secret in 6000 random messages, whatever sits between them, and is stable when screened again', () => {
    const rnd = seeded(2026);
    for (let i = 0; i < 6000; i += 1) {
      const n = 1 + Math.floor(rnd() * 5);
      const chosen = [];
      for (let k = 0; k < n; k += 1) chosen.push(rnd() < 0.6 ? PIECES[Math.floor(rnd() * PIECES.length)] : { text: BENIGN[Math.floor(rnd() * BENIGN.length)], secrets: [] });
      let text = '';
      chosen.forEach((c, k) => { text += (k ? JOINERS[Math.floor(rnd() * JOINERS.length)] : '') + c.text; });
      const secrets = chosen.flatMap((c) => c.secrets);
      const r = screen(text);
      if (secrets.length) {
        expect(r.blocked, text).toBe(true);
        // ordinary pieces stay readable by design, so they are taken out before looking for leaked digits
        const shown = BENIGN.reduce((acc, b) => acc.split(b).join(' '), r.display);
        secrets.forEach((sec) => expect(leaked(shown, sec), `"${sec}" readable in "${r.display}" from "${text}"`).toBe(false));
      }
      expect(sensitiveKinds(r.display), `re-screening "${r.display}" from "${text}"`).toEqual([]);
      expect(redact(redact(text)), text).toBe(redact(text));
      if (!secrets.length) expect(r.blocked, `benign: ${text}`).toBe(false);
    }
  });
  it('does the same at the name and chat steps and for messages with no joiner but a space', () => {
    const rnd = seeded(77);
    for (let i = 0; i < 1500; i += 1) {
      const a = PIECES[Math.floor(rnd() * PIECES.length)];
      const b = PIECES[Math.floor(rnd() * PIECES.length)];
      const text = `${a.text} ${b.text}`;
      ['chat', 'name'].forEach((step) => {
        const r = screen(text, step);
        [...a.secrets, ...b.secrets].forEach((sec) => expect(leaked(r.display, sec), `${step}: "${sec}" readable in "${r.display}"`).toBe(false));
      });
    }
  });
});

describe('second hardening, Medium: separators', () => {
  const rnd = seeded(31);
  const pick = (list) => list[Math.floor(rnd() * list.length)];
  const PLAIN = [' ', '  ', '   ', '-', ' - ', '.', ' . ', '/', ' / ', '_', ' _ ', EN_DASH, EM_DASH, MINUS, NBSP, ZWSP, `${ZWSP} `, '\t', '\n'];
  it.each([
    ['a double space', '4111  1111  1111  1111'],
    ['three spaces', '4111   1111   1111   1111'],
    ['underscores', '4111_1111_1111_1111'],
    ['commas', '4111,1111,1111,1111'],
    ['commas with spaces', '4111, 1111, 1111, 1111'],
    ['slashes', '4111/1111/1111/1111'],
    ['dots', '4111.1111.1111.1111'],
    ['tabs', '4111\t1111\t1111\t1111'],
    ['a hyphen with spaces', '4111 - 1111 - 1111 - 1111'],
  ])('hides a card written with %s', (label, card) => {
    const r = expectHidden(`card ${card}`, [card]);
    expect(digitsOf(r.display)).toBe('');
  });
  it('hides 800 random cards and 800 random Aadhaar-like numbers written with random plain separators', () => {
    for (let i = 0; i < 800; i += 1) {
      const digits = (n) => Array.from({ length: n }, () => Math.floor(rnd() * 10)).join('');
      const card = [digits(4), digits(4), digits(4), digits(4)].reduce((acc, g, k) => acc + (k ? pick(PLAIN) : '') + g, '');
      const aadhaar = [digits(4), digits(4), digits(4)].reduce((acc, g, k) => acc + (k ? pick(PLAIN) : '') + g, '');
      expectHidden(`pay ${card} now`, [card]);
      expectHidden(`id ${aadhaar} ok`, [aadhaar]);
    }
  });
  it('hides a card written with commas only from four groups up, so three amounts are left alone', () => {
    expect(screen('1000, 2000, 3000').blocked).toBe(false);
    expect(screen('1000,2000,3000').blocked).toBe(false);
    expect(screen('1000, 2000, 3000, 4000').blocked).toBe(true);
  });
  it.each(['ABCDE.1234.F', 'ABCDE_1234_F', 'abcde/1234/f', 'abcde-1234-f', 'ABCDE - 1234 - F', 'abcde . 1234 . f', 'ABCDE 1234 F', 'ABCDE1234 F', 'ABCDE-1234F', 'abcde.1234f', 'ABCDE__1234__F'])(
    'hides the PAN "%s"',
    (pan) => {
      const r = expectHidden(`my pan is ${pan} ok`, [pan]);
      expect(r.kinds).toContain('pan');
    },
  );
  it('still leaves a lower-case PAN with spaces only, and a comma-separated one, as documented limits', () => {
    expect(screen('abcde 1234 f').blocked).toBe(false);
    expect(screen('ABCDE,1234,F').blocked).toBe(false);
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/capital letters/);
  });
  it('keeps ordinary words, dates and amounts readable', () => {
    ['Between 2024-05-12 and 2025-06-13 SIP 5000', 'invest 5000 monthly for 10 years', 'my SIP of 10,000 started on 12-05-2024', '12/26', 'expiry 12/2026', 'I need 1,00,00,000 cover', 'retire at 60 with 2,50,00,000 corpus'].forEach((t) => {
      const r = screen(t);
      expect(r.blocked, t).toBe(false);
      expect(r.display, t).toBe(t);
    });
  });
});

describe('second hardening, Medium: numbers that start with 91', () => {
  it('flags an Aadhaar-like number whose digits also read as 91 plus a mobile number', () => {
    ['9187 6543 2109', '9198 7654 3210', '9161 2345 6789', '9187-6543-2109'].forEach((n) => {
      expectHidden(`aadhaar ${n}`, [n]);
      expect(screen(n).kinds, n).toEqual(['aadhaar']);
      expect(screen(n, 'phone').blocked, `phone: ${n}`).toBe(true);
    });
  });
  it('flags a bare twelve digits that start 91 and a mobile outside the phone step, and not after a plus or at the phone step', () => {
    expect(screen('918765432109').kinds).toEqual(['account-or-card']);
    expect(screen('+919876543210').blocked).toBe(false);
    expect(screen('918765432109', 'phone').blocked).toBe(false);
    expect(screen('+919876543210', 'phone').blocked).toBe(false);
    expect(bookingAcceptsPhone('918765432109')).toBe(true);
  });
  it('flags 600 random Aadhaar-like numbers that start 91 and a digit from 6 to 9', () => {
    const rnd = seeded(91);
    for (let i = 0; i < 600; i += 1) {
      const rest = Array.from({ length: 9 }, () => Math.floor(rnd() * 10)).join('');
      const d = `91${6 + Math.floor(rnd() * 4)}${rest}`;
      const grouped = `${d.slice(0, 4)} ${d.slice(4, 8)} ${d.slice(8)}`;
      expect(screen(grouped).blocked, grouped).toBe(true);
      expect(digitsOf(screen(grouped).display), grouped).toBe('');
      expect(screen(grouped, 'phone').blocked, `phone ${grouped}`).toBe(true);
      expect(digitsOf(screen(`note ${d}`).display), d).toBe('');
    }
  });
  it('never blocks a valid booking phone number at the phone step, in 6000 random formats', () => {
    const rnd = seeded(5);
    const pick = (list) => list[Math.floor(rnd() * list.length)];
    const seps = ['', ' ', '-', '.', '/', '  ', ' - ', ' . ', '_', '(', ')', ',', NBSP, ZWSP, '\t'];
    const prefixes = ['', '+91', '+91 ', '+91-', '91', '91 ', '0', '0 ', '(+91) ', '+91 (0) ', '+91  '];
    let tested = 0;
    for (let i = 0; i < 6000; i += 1) {
      let d = String(6 + Math.floor(rnd() * 4));
      for (let k = 0; k < 9; k += 1) d += Math.floor(rnd() * 10);
      let body = '';
      for (let k = 0; k < d.length; k += 1) body += d[k] + (k < d.length - 1 && rnd() < 0.3 ? pick(seps) : '');
      const t = pick(prefixes) + body;
      if (!bookingAcceptsPhone(t) || t.trim().length > FIELD_LIMITS.phone) continue; // longer entries are rejected as too long by design
      tested += 1;
      const r = screen(t, 'phone');
      expect(r.blocked, `phone step: ${JSON.stringify(t)} -> ${JSON.stringify(r)}`).toBe(false);
      expect(digitsOf(r.display).length, t).toBeLessThanOrEqual(6);
    }
    expect(tested).toBeGreaterThan(3000);
  });
});

describe('second hardening, Medium: credentials', () => {
  it.each([
    ['password is: hunter2', ['hunter2']],
    ['password is:hunter2', ['hunter2']],
    ['my password is = hunter2', ['hunter2']],
    ['cvv number is 739', ['739']],
    ['CVV number: 739', ['739']],
    ['cvc number 739', ['739']],
    ['pin code is 5826', ['5826']],
    ['pin code: 5826', ['5826']],
    ['pw is abc931', ['abc931']],
    ['pw: hunter2', ['hunter2']],
    ['passwd abc931', ['abc931']],
    ['login pass: abc931', ['abc931']],
    ['my login pass is abc931', ['abc931']],
    ['password Hunter2!', ['Hunter2!']],
    ['password: Secret99!', ['Secret99!']],
    ['my pin is 5826!', ['5826']],
    ['password hunter2 and pin 5826 and cvv number is 739', ['hunter2', '5826', '739']],
  ])('hides the value in "%s"', (text, secrets) => {
    const r = expectHidden(text, secrets);
    expect(r.kinds).toContain('password');
    expect(r.display).not.toMatch(/[!]/);
  });
  it('leaves a postal code, and ordinary sentences about passwords, alone', () => {
    ['pin code 560001', 'pin code is 560001', 'what is my pin code', 'password is required', 'how do I reset my password?', 'is a pw manager safe', 'cvv is on the back of the card', 'pass the exam', 'a strong password is needed', 'the pin is a four digit number', 'passwd file on linux'].forEach((t) => {
      expect(screen(t).blocked, t).toBe(false);
    });
  });
  it('documents that words between the keyword and the value are not followed', () => {
    expect(screen('password for netflix: hunter2').blocked).toBe(false);
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/Words between the keyword and the value/);
  });
});

describe('second hardening, Medium: account numbers with a keyword', () => {
  it.each([
    ['account number 12345678901', '12345678901'],
    ['a/c 123456789', '123456789'],
    ['acct no. 50100123456', '50100123456'],
    ['Acct No 5010 0123 456', '5010 0123 456'],
    ['my account is 9876543210', '9876543210'],
    ['bank account number is 123456789012345', '123456789012345'],
    ['a/c no: 0012-3456-7890', '0012-3456-7890'],
    ['account 000123456789', '000123456789'],
  ])('hides the number in "%s"', (text, secret) => {
    const r = expectHidden(text, [secret]);
    expect(r.kinds).toContain('account-or-card');
  });
  it('leaves dates, small numbers and account words without a number alone', () => {
    ['account opened 12-05-2024', 'my account 2024', 'savings account 5000', 'a/c 12345', 'account balance 123456789', 'open an account', 'account number please', 'acct 12/05/2024'].forEach((t) => expect(screen(t).blocked, t).toBe(false));
  });
  it('documents that a bare account number of nine to eleven digits is not found without a keyword', () => {
    expect(screen('12345678901').blocked).toBe(false);
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/nine to eleven digits/);
  });
});

describe('second hardening, Medium: normalisation never stops short of the scan cap', () => {
  it('has a normalisation cap above the scan cap times the longest expansion of any single character', () => {
    let longest = 0;
    for (let c = 0; c <= 0x10ffff; c += 1) {
      if (c >= 0xd800 && c <= 0xdfff) continue;
      const n = String.fromCodePoint(c).normalize('NFKC').length;
      if (n > longest) longest = n;
    }
    expect(longest).toBeLessThanOrEqual(18);
    expect(SENSITIVE_SCAN_CAP * longest).toBeLessThan(NORM_CAP);
  });
  it('redacts secrets that come after thousands of expanding characters', () => {
    const expanding = cp(0xfdfa);
    [100, 1200, 2500, 4900].forEach((n) => {
      const text = `${expanding.repeat(n)} pin 5826 and ABCDE1234F and card 4111 1111 1111 1111 12/26`;
      const out = redact(text);
      ['5826', 'ABCDE1234F'].forEach((v) => expect(out, `${n}`).not.toContain(v));
      expect(digitsOf(out.replace(/\/26/, '')), `${n}`).toBe('');
      expect(redact(out), `${n}`).toBe(out);
    });
  });
  it('treats a message made only of expanding characters, with a secret inside the limit, as sensitive', () => {
    const r = screen(`${cp(0xfdfa).repeat(20)} pin 5826`);
    expect(r.kinds).toEqual(['password']);
    expect(r.display).not.toContain('5826');
  });
});

describe('second hardening: invalid options and the limits the audit listed', () => {
  it('screens without an options object, or with null, and gives the same answer', () => {
    const plain = { blocked: false, kinds: [], display: 'hello', truncated: false };
    expect(screen('hello')).toEqual(plain);
    expect(screenUserText('hello', null)).toEqual(plain);
    expect(screenUserText('hello', {})).toEqual(plain);
    expect(liveWarning('hello', null)).toBe('');
    expect(screenUserText('pin 5826', null).display).toBe('pin ••••••');
  });
  it('finds a card whose groups are separated only by invisible characters, as well as one split inside a group', () => {
    [`4111${ZWSP}1111${ZWSP}1111${ZWSP}1111`, `4111${ZWSP}1111 1111 1111`, `41${ZWSP}11 1111 11${ZWNJ}11 1111`, `1234${BOM}5678${SOFT_HYPHEN}9012`].forEach((n) => expectHidden(`card ${n}`, [n]));
  });
  it('lists the new limits and keeps the old ones true', () => {
    const all = KNOWN_LIMITATIONS.join(' ');
    expect(all).toMatch(/plus sign/);
    expect(all).toMatch(/two groups of six/);
    expect(all).toMatch(/1000 2000 3000/);
    expect(screen('1000 2000 3000').kinds).toEqual(['aadhaar']);
    expect(screen('123 456 789 012').blocked).toBe(false);
    expect(screen('123456 789012').blocked).toBe(false);
    expect(screen('4 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1').blocked).toBe(false);
    expect(screen('4111 x 1111 x 1111 x 1111').blocked).toBe(false);
  });
  it('is not a guarantee: a secret in an unrecognised shape stays readable, and the text says so', () => {
    expect(screen('my card is 4111 1111 1111 1111 1111 1111 1111 1111 oops').blocked).toBe(true);
    expect(screen('my secret word is tangerine').display).toBe('my secret word is tangerine');
    expect(KNOWN_LIMITATIONS[0]).toMatch(/heuristic/i);
  });
});

/* ================================================================== */
/* Third stage: email step, grouped account numbers, leak helper, OTP and credential forms, layouts, options */
/* ================================================================== */
describe('third stage, M1: the leak-check helper catches partial leaks (mutation tests)', () => {
  const FIXTURES = [
    ['a PAN', 'my pan is ABCDE1234F ok', 'ABCDE1234F'],
    ['a hyphenated PAN', 'pan abcde-1234-f', 'abcde-1234-f'],
    ['a card', 'card 4111 1111 1111 1111', '4111 1111 1111 1111'],
    ['a card with an expiry', 'card 4111 1111 1111 1111 12/26', '4111 1111 1111 1111'],
    ['an Amex card', 'amex 3714 496353 98431', '3714 496353 98431'],
    ['an Aadhaar-like number', 'aadhaar 2345 6789 0123', '2345 6789 0123'],
    ['a contiguous account number', 'account 123456789012', '123456789012'],
    ['a grouped account number', 'acct 12345 67890 12345', '12345 67890 12345'],
    ['an account number in short groups', 'a/c 123 456 789 012 345', '123 456 789 012 345'],
  ];
  it.each(FIXTURES)('flags %s when any single letter or digit of it is put back, and passes the real output', (label, text, secret) => {
    const r = screen(text);
    expect(r.display.length).toBe(text.length);
    expect(leaked(r.display, secret, text), `real output: ${r.display}`).toBe(false);
    const at = text.indexOf(secret);
    let restored = 0;
    for (let i = 0; i < secret.length; i += 1) {
      if (!/[\p{L}\p{N}]/u.test(secret[i])) continue;
      const mutated = r.display.slice(0, at + i) + text[at + i] + r.display.slice(at + i + 1);
      expect(leaked(mutated, secret, text), `one character restored at ${i}: ${mutated}`).toBe(true);
      restored += 1;
    }
    expect(restored).toBeGreaterThan(8);
  });
  it.each([
    ['an OTP, three digits', 'otp 482 •••', '482913'],
    ['an OTP, the last three digits', 'otp ••• 913', '482913'],
    ['an OTP, all of it', 'otp 482913', '482913'],
    ['a password, its start', 'password hunt•••', 'hunter2'],
    ['a password, its end', 'password ••••er2', 'hunter2'],
    ['a password with a symbol', 'password: ••••ret99!', 'Secret99!'],
    ['a PAN, its letters', 'pan ABCDE••••••', 'ABCDE1234F'],
    ['a PAN, its digits', 'pan •••••1234•', 'ABCDE1234F'],
    ['a card, the last four', 'card •••• •••• •••• 1111', '4111 1111 1111 1111'],
    ['an Aadhaar-like number, the last three digits', 'aadhaar •••• •••• 901', '2345 6789 0123'],
    ['an account number, its tail', 'acct ••••• ••••• 12345', '12345 67890 12345'],
    ['an account number, its tail in short groups', 'a/c ••• ••• ••• 012 345', '123 456 789 012 345'],
  ])('flags a partial leak of %s', (label, display, secret) => {
    expect(leaked(display, secret)).toBe(true);
  });
  it('does not flag fully masked output of any length', () => {
    [['otp ••••••', '482913'], ['password ••••••', 'hunter2'], ['pan ••••••••••', 'ABCDE1234F'], ['acct ••• ••• ••• ••• •••', '123 456 789 012 345']].forEach(([d, sec]) => expect(leaked(d, sec)).toBe(false));
  });
});

describe('third stage, H1: a valid email is never rejected because its local part looks like something else', () => {
  const EMAILS = [
    'ankit1995s@gmail.com', 'rahul1234k@yahoo.com', 'abcde1234f@gmail.com', 'ABCDE1234F@example.com', 'sarit1990a@outlook.com', 'otp.123456@x.com',
    'otp123456@x.com', 'pin1234@x.com', 'password.hunter2@x.com', 'pw.abc123@x.com', 'cvv123@x.com', '4111111111111111@x.com',
    '123456789012@x.com', 'a.1234.5678.9012@x.com', 'account123456789@x.com', 'acct.123456789@x.com', 'a/c.123456789@x.com',
    'priya.sharma@gmail.com', 'john@example.com', 'a_b-c+d@sub.domain.co.in', 'x@y.zz',
  ];
  it.each(EMAILS)('"%s" is accepted by the booking validator and passes the email step unchanged', (e) => {
    expect(bookingAcceptsEmail(e), 'booking validator').toBe(true);
    const r = screen(e, 'email');
    expect(r).toEqual({ blocked: false, kinds: [], display: e, truncated: false });
  });
  it('accepts an address with spaces around it, as the form trims it', () => {
    expect(screen('  ankit1995s@gmail.com  ', 'email')).toEqual({ blocked: false, kinds: [], display: 'ankit1995s@gmail.com', truncated: false });
  });
  it('accepts 5000 random addresses that look like a PAN, an OTP or a number', () => {
    const rnd = seeded(8);
    const letters = (n) => Array.from({ length: n }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(rnd() * 26)]).join('');
    const digits = (n) => Array.from({ length: n }, () => Math.floor(rnd() * 10)).join('');
    const shapes = [() => letters(5) + digits(4) + letters(1), () => letters(5).toUpperCase() + digits(4) + letters(1).toUpperCase(), () => `otp.${digits(6)}`, () => `${letters(3)}.${digits(12)}`, () => letters(4 + Math.floor(rnd() * 6)) + digits(2 + Math.floor(rnd() * 4))];
    for (let i = 0; i < 5000; i += 1) {
      const e = `${shapes[i % shapes.length]()}@gmail.com`;
      expect(bookingAcceptsEmail(e)).toBe(true);
      expect(screen(e, 'email').blocked, e).toBe(false);
    }
  });
  it('does not weaken screening for free chat or for the name step', () => {
    ['ankit1995s@gmail.com', 'ABCDE1234F@example.com', 'otp.123456@x.com'].forEach((e) => {
      ['chat', 'name'].forEach((step) => {
        const r = screen(e, step);
        expect(r.blocked, `${step}: ${e}`).toBe(true);
        expect(r.display, `${step}: ${e}`).not.toMatch(/ankit1995s|ABCDE1234F|123456/);
      });
    });
  });
  it('still screens everything at the email step that is not an email address', () => {
    ['my otp is 482913', 'pw is abc123', 'pan ABCDE1234F', 'ankit1995s @gmail.com', 'ankit1995s@', '@gmail.com ABCDE1234F', 'card 4111 1111 1111 1111', 'mail me at ankit1995s@gmail.com pin 5826'].forEach((t) => {
      const r = screen(t, 'email');
      expect(r.blocked, t).toBe(true);
      expect(r.display, t).not.toMatch(/482913|abc123|ABCDE1234F|ankit1995s |4111|5826/);
    });
  });
  it('still rejects an address over the email limit', () => {
    const long = `${'a'.repeat(250)}@x.com`;
    expect(screen(long, 'email')).toMatchObject({ blocked: true, truncated: true });
  });
});

describe('third stage, H2: a grouped account number is hidden completely', () => {
  it.each([
    'acct 12345 67890 12345', 'a/c 123 456 789 012 345', 'account 12 34 56 78 90 12 34 56', 'account no 1234-567890-12', 'my savings a/c is 123 456 789 012',
    'account 1 2 3 4 5 6 7 8 9 0 1 2', 'a/c 99999 99999 9999', 'account 12345 6789', 'account 1234 5678 9', 'a/c no: 0012-3456-7890', 'account number 123456 78901234',
    'bank account: 1234.5678.9012.3456', 'savings acct 123_456_789_012', 'acct123456789',
  ])('hides every digit of "%s"', (text) => {
    const r = screen(text);
    expect(r.kinds, text).toContain('account-or-card');
    expect(digitsOf(r.display), `${text} -> ${r.display}`).toBe('');
    expect(sensitiveKinds(r.display)).toEqual([]);
    expect(redact(redact(text))).toBe(redact(text));
  });
  it('hides each of 400 random grouped numbers after a keyword, whatever the group sizes', () => {
    const rnd = seeded(14);
    for (let i = 0; i < 400; i += 1) {
      const total = 9 + Math.floor(rnd() * 10);
      const groups = [];
      let left = total;
      while (left > 0) {
        const w = Math.min(left, 1 + Math.floor(rnd() * 6));
        groups.push(Array.from({ length: w }, () => 1 + Math.floor(rnd() * 9)).join(''));
        left -= w;
      }
      const number = groups.join(['-', ' ', '.', '/', '_', '  '][Math.floor(rnd() * 6)]);
      const text = `my ${['account', 'acct', 'a/c', 'account number', 'a/c no.'][Math.floor(rnd() * 5)]} ${['', 'is '][Math.floor(rnd() * 2)]}${number} thanks`;
      const r = screen(text);
      expect(digitsOf(r.display), `${text} -> ${r.display}`).toBe('');
      expect(r.display.endsWith(' thanks'), text).toBe(true);
    }
  });
  it('keeps dates, small numbers and account words without a number readable', () => {
    ['account opened 12-05-2024', 'account 12/05/2024', 'my account 2024', 'savings account 5000', 'a/c 12345', 'account balance 123456789', 'account ending 4321', 'open an account'].forEach((t) => {
      expect(screen(t).display, t).toBe(t);
    });
  });
});

describe('third stage, M2: OTPs in groups and in natural-language messages', () => {
  it.each([
    ['otp 123 456', '123 456'],
    ['OTP 12 34 56', '12 34 56'],
    ['otp 1 2 3 4 5 6', '1 2 3 4 5 6'],
    ['otp 12-34-56', '12-34-56'],
    ['otp 1234 5678', '1234 5678'],
    ['one time password 123 456', '123 456'],
    ['verification code: 482 913', '482 913'],
    ['otp received is 482913', '482913'],
    ['the otp I got was 482913', '482913'],
    ['your otp is 482913 thanks', '482913'],
    ['otp sent to me was 482913', '482913'],
    ['I got the verification code 482913 from the bank', '482913'],
    ['otp is: 482913', '482913'],
    ['my otp 482913', '482913'],
    ['123 456 is my otp', '123 456'],
    ['12 34 56 is my otp', '12 34 56'],
    ['1234 5678 is my otp', '1234 5678'],
    ['482913 is the otp', '482913'],
    ['otp482913', '482913'],
    ['otp:482913', '482913'],
  ])('hides the OTP in "%s"', (text, secret) => {
    const r = expectHidden(text, [secret]);
    expect(r.kinds).toContain('otp');
    expect(digitsOf(r.display)).toBe('');
  });
  it('leaves ordinary sentences that mention an OTP alone', () => {
    ['OTP 2026', 'otp is sent to your phone in 2026', 'OTP expires in 10 minutes', 'otp is a 6 digit code', 'otp 4 digits', 'Is my OTP safe?', 'never share your OTP', 'one time password is valid for 5 minutes', 'send otp 3 times'].forEach((t) => {
      expect(screen(t).display, t).toBe(t);
    });
  });
  it('documents what is still missed', () => {
    expect(screen('the code from my bank is 482913').blocked).toBe(false);
    expect(screen('482913 please use as my otp').blocked).toBe(false);
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/separated from its keyword by other words/);
  });
  it('is stable when an ordinary amount or year comes before the keyword (a regression found by fuzzing)', () => {
    [['invest 5000 monthly otp482913', 'invest 5000 monthly otp••••••'], ['2026\notp 123 456 - 12 34 56 is my otp', null], ['limit 2026 and the otp I got was 482913', 'limit 2026 and the otp I got was ••••••'], ['5000 monthly otp 482913', '5000 monthly otp ••••••']].forEach(([text, expected]) => {
      const r = screen(text);
      if (expected) expect(r.display).toBe(expected);
      expect(screen(r.display).display, text).toBe(r.display);
      expect(sensitiveKinds(r.display), text).toEqual([]);
      expect(redact(redact(text)), text).toBe(redact(text));
    });
    expect(screen('invest 5000 monthly otp 482913').display).not.toMatch(/••••••.*••••••/);
  });
});

describe('third stage, M3: split password values and keywords glued to the value', () => {
  it.each([
    ['password is hunter 2', 'hunter 2'],
    ['pin is 48 29', '48 29'],
    ['pin 48 29', '48 29'],
    ['cvv 1 2 3', '1 2 3'],
    ['cvv 12 3', '12 3'],
    ['atm pin: 4 8 2 9', '4 8 2 9'],
    ['password "correct horse battery"', 'correct horse battery'],
    ["password: 'my dog rex'", 'my dog rex'],
    ['pin4321', '4321'],
    ['my pin4321', '4321'],
    ['cvv123', '123'],
    ['cvv2123', '123'],
    ['pwd:hunter2', 'hunter2'],
    ['password=hunter2', 'hunter2'],
    ['pin:4321', '4321'],
  ])('hides the value in "%s"', (text, secret) => {
    const r = expectHidden(text, [secret]);
    expect(r.kinds).toContain('password');
  });
  it('does not absorb an unrelated number that follows a complete PIN, CVV or password', () => {
    expect(screen('pin 4321 5000').display).toBe('pin •••••• 5000');
    expect(screen('cvv 123 and 456').display).toBe('cvv •••••• and 456');
    expect(screen('password hunter2 023').display).toBe('password •••••• 023');
  });
  it('leaves sentences about passwords alone, including short and keyword-like words', () => {
    ['pin1', 'pwd2', 'password is required 24x7', 'how do I reset my password?', 'cvv is on the back', 'a pin is four digits', 'spin4321 times', 'the pin is'].forEach((t) => expect(screen(t).display, t).toBe(t));
  });
  it('documents what is still missed', () => {
    expect(screen('passwordhunter2').blocked).toBe(false);
    expect(screen('my password is correct horse battery').blocked).toBe(false);
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/passphrase of several plain words without quotes/);
  });
});

describe('third stage, L1 to L3: card layouts, 91-prefixed phone numbers and false positives', () => {
  it('recognises the 4-6-6 layout used by some Maestro cards, besides 4-4-4-4, 4-6-5 and 4-6-4', () => {
    ['6759 649826 438453', '3714 496353 98431', '3056 930902 5904', '5412 7534 0012 9348'].forEach((n) => expectHidden(`card ${n}`, [n]));
  });
  it('leaves a list of years, and a repeated amount, alone, but not three different amounts', () => {
    ['2019 2020 2021', 'between 2019 2020 2021', '1999 2000 2001 2002', 'dates 2024 2025 2026', '5000 5000 5000', '1000 1000 1000'].forEach((t) => expect(screen(t).blocked, t).toBe(false));
    expect(screen('1000 2000 3000').blocked).toBe(true);
    expect(screen('4111 1111 1111 1111').blocked).toBe(true);
    expect(screen('1111 1111 1111 1111').blocked).toBe(true);
  });
  it('documents the layouts that are still not recognised', () => {
    ['4222 2222 22222', '12345 12345 12345', '123456 789012', '123 456 789 012'].forEach((t) => expect(screen(t).blocked, t).toBe(false));
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/4-4-5, 5-5-5/);
  });
  it('treats 91 and a mobile number as a phone number at the phone step unless it is written in groups of four', () => {
    ['919876543210', '+919876543210', '91 9876543210', '91 98765 43210', '+91 9876 543210', '91-98765-43210'].forEach((n) => {
      expect(bookingAcceptsPhone(n)).toBe(true);
      expect(screen(n, 'phone').blocked, n).toBe(false);
    });
    ['9198 7654 3210', '9161 2345 7890', '9187-6543-2109'].forEach((n) => {
      expect(bookingAcceptsPhone(n)).toBe(true); // the booking form would accept it, but it is also a possible Aadhaar number
      expect(screen(n, 'phone')).toMatchObject({ blocked: true, kinds: ['aadhaar'] });
    });
  });
  it('blocks a valid booking phone format at the phone step only when it is 91 and a mobile number in groups of four, in 8000 random formats', () => {
    const rnd = seeded(66);
    const pick = (list) => list[Math.floor(rnd() * list.length)];
    const seps = ['', ' ', '-', '.', '/', '  ', ' - ', '_', ',', '(', ')', NBSP, ZWSP, '\t'];
    const prefixes = ['', '+91', '+91 ', '+91-', '91', '91 ', '0', '0 ', '(+91) ', '+91 (0) ', '(0) '];
    let blocked = 0;
    for (let i = 0; i < 8000; i += 1) {
      let d = String(6 + Math.floor(rnd() * 4));
      for (let k = 0; k < 9; k += 1) d += Math.floor(rnd() * 10);
      let body = '';
      for (let k = 0; k < d.length; k += 1) body += d[k] + (k < d.length - 1 && rnd() < 0.3 ? pick(seps) : '');
      const t = pick(prefixes) + body;
      if (!bookingAcceptsPhone(t) || t.trim().length > FIELD_LIMITS.phone) continue;
      const r = screen(t, 'phone');
      if (r.blocked) {
        blocked += 1;
        expect(r.kinds, t).toEqual(['aadhaar']);
        expect(digitsOf(t).startsWith('91') && digitsOf(t).length === 12, t).toBe(true);
      }
    }
    expect(blocked).toBeLessThan(40);
  });
  it('documents the trade-off and the other false positives', () => {
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/9198 7654 3210/);
    expect(screen('Apple-2024-a').kinds).toEqual(['pan']);
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/Apple-2024-a/);
  });
});

describe('third stage, L4: malformed options fail closed', () => {
  const secretText = 'my pin is 5826 and card 4111 1111 1111 1111';
  const BAD_OPTIONS = [
    ['a getter that throws', { get step() { throw new Error('boom'); } }],
    ['a Proxy that throws', new Proxy({}, { get() { throw new Error('boom'); } })],
    ['a revoked Proxy', (() => { const r = Proxy.revocable({}, {}); r.revoke(); return r.proxy; })()],
  ];
  it.each(BAD_OPTIONS)('does not throw for %s, and returns a rejection without the input', (label, options) => {
    let result;
    expect(() => { result = screenUserText(secretText, options); }).not.toThrow();
    expect(result).toEqual({ blocked: true, kinds: ['invalid-step'], display: '', truncated: false });
    expect(JSON.stringify(result)).not.toMatch(/5826|4111/);
    expect(() => liveWarning(secretText, options)).not.toThrow();
    expect(liveWarning(secretText, options)).toBe('');
  });
  it.each([[5], ['str'], [true], [[]], [() => 1], [Symbol('x')], [null], [undefined], [{}], [{ step: undefined }], [{ step: 'chat', extra: 1 }]])('screens normally and safely with options %s', (options) => {
    let result;
    expect(() => { result = screenUserText(secretText, options); }).not.toThrow();
    expect(result.blocked).toBe(true);
    expect(result.display).not.toMatch(/5826|4111/);
  });
  it.each([[{ step: Symbol('x') }], [{ step: {} }], [{ step: ['chat'] }], [{ step: 5 }], [{ step: '' }], [{ step: null }]])('rejects the invalid step in %s without the input', (options) => {
    const result = screenUserText(secretText, options);
    expect(result).toEqual({ blocked: true, kinds: ['invalid-step'], display: '', truncated: false });
  });
  it('never throws for odd raw input, and never returns the raw input as a field', () => {
    [Object.create(null), new Proxy({}, { get() { throw new Error('boom'); } }), { toString() { throw new Error('boom'); } }, () => {}, Symbol('x'), 10n ** 30n, NaN, -0, '\ud800', '\udc00\ud800', ' '.repeat(10)].forEach((v) => {
      let r;
      expect(() => { r = screenUserText(v); }).not.toThrow();
      expect(Object.keys(r).sort()).toEqual(['blocked', 'display', 'kinds', 'truncated']);
      expect(() => redact(v)).not.toThrow();
      expect(() => liveWarning(v)).not.toThrow();
      expect(() => maskPhoneDisplay(v)).not.toThrow();
    });
  });
});

describe('third stage: mixed messages with the new forms, 4000 random cases', () => {
  const PIECES = [
    { text: 'otp 123 456', secrets: ['123 456'] },
    { text: 'the otp I got was 715284', secrets: ['715284'] },
    { text: 'pin is 48 29', secrets: ['48 29'] },
    { text: 'password is hunter 2', secrets: ['hunter 2'] },
    { text: 'cvv739', secrets: ['739'] },
    { text: 'acct 12345 67890 12345', secrets: ['12345 67890 12345'] },
    { text: 'a/c 731 904 825 617 3', secrets: ['731 904 825 617 3'] },
    { text: 'card 5412 7534 0012 9348 exp 12/26', secrets: ['5412 7534 0012 9348'] },
    { text: '6759 649826 438453', secrets: ['6759 649826 438453'] },
    { text: 'aadhaar 2345 6789 0123', secrets: ['2345 6789 0123'] },
    { text: 'pan ABCDE.1234.F', secrets: ['ABCDE.1234.F'] },
    { text: `pw: "red fox jumps"`, secrets: ['red fox jumps'] },
  ];
  const BENIGN = ['hello', 'call 9876543210', 'Rs 50000', 'in 2026', '2019 2020 2021', 'thanks', 'what is a SIP'];
  const JOINERS = [' ', ', ', ' and ', '; ', ' - ', '  ', ' / '];
  it('hides every secret and is stable when screened again', () => {
    const rnd = seeded(404);
    for (let i = 0; i < 4000; i += 1) {
      const n = 1 + Math.floor(rnd() * 4);
      const chosen = [];
      for (let k = 0; k < n; k += 1) chosen.push(rnd() < 0.6 ? PIECES[Math.floor(rnd() * PIECES.length)] : { text: BENIGN[Math.floor(rnd() * BENIGN.length)], secrets: [] });
      let text = '';
      chosen.forEach((c, k) => { text += (k ? JOINERS[Math.floor(rnd() * JOINERS.length)] : '') + c.text; });
      const secrets = chosen.flatMap((c) => c.secrets);
      const r = screen(text);
      if (secrets.length) {
        expect(r.blocked, text).toBe(true);
        const shown = BENIGN.reduce((acc, b) => acc.split(b).join(' '), r.display);
        secrets.forEach((sec) => expect(leaked(shown, sec), `"${sec}" readable in "${r.display}" from "${text}"`).toBe(false));
      } else expect(r.blocked, text).toBe(false);
      expect(sensitiveKinds(r.display), `re-screening "${r.display}"`).toEqual([]);
      expect(redact(redact(text)), text).toBe(redact(text));
    }
  });
});

/* ================================================================== */
/* Integration stage 1: email narrowing, rejection messages, safe error logging, booking guard */
/* ================================================================== */
describe('integration stage 1: the email exemption still screens explicit credential assignments', () => {
  it.each([
    ['password=hunter2@a.bc', 'hunter2'],
    ['password:hunter2@a.bc', 'hunter2'],
    ['pwd=abc931@x.co', 'abc931'],
    ['pw=abc931@x.co', 'abc931'],
    ['pin:5826@x.co', '5826'],
    ['PIN=5826@x.co', '5826'],
    ['cvv=739@x.co', '739'],
    ['passwd:abc931@x.co', 'abc931'],
    ['otp=482913@x.co', '482913'],
    ['OTP:482913@x.co', '482913'],
    ['verification code=482913@x.co', '482913'],
  ])('screens "%s" at the email step even though it has the shape of an email address', (text, secret) => {
    const r = screen(text, 'email');
    expect(r.blocked, text).toBe(true);
    expect(leaked(r.display, secret, text), r.display).toBe(false);
    expect(sensitiveKinds(r.display, 'email'), r.display).toEqual([]);
  });
  const NORMAL = [
    'ankit1995s@gmail.com', 'rahul1234k@yahoo.com', 'abcde1234f@gmail.com', 'ABCDE1234F@example.com', 'sarit1990a@outlook.com', 'otp.123456@x.com', 'otp123456@x.com',
    'pin1234@x.com', 'pin.5826@x.com', 'pin-5826@x.com', 'password.hunter2@x.com', 'password_hunter2@x.com', 'pw.abc123@x.com', 'cvv123@x.com', 'cvv.739@x.com',
    '4111111111111111@x.co', '123456789012@x.com', 'a.1234.5678.9012@x.com', 'account123456789@x.com', 'priya.sharma@gmail.com', 'john@example.com', 'a_b-c+d@sub.domain.co.in',
  ];
  it.each(NORMAL)('leaves the normal valid address "%s" alone at the email step', (e) => {
    expect(bookingAcceptsEmail(e)).toBe(true);
    expect(screen(e, 'email')).toEqual({ blocked: false, kinds: [], display: e, truncated: false });
  });
  it('keeps screening every one of them in free chat, at the name step and at the phone step where it resembles a secret', () => {
    ['ankit1995s@gmail.com', 'ABCDE1234F@example.com', 'otp.123456@x.com', 'pin1234@x.com', '4111111111111111@x.co'].forEach((e) => {
      ['chat', 'name', 'phone'].forEach((step) => expect(screen(e, step).blocked, `${step}: ${e}`).toBe(true));
    });
  });
  it('documents what the exemption still does not cover', () => {
    expect(screen('4111111111111111@x.co', 'email').blocked).toBe(false);
    expect(screen('ABCDE1234F@x.co', 'email').blocked).toBe(false);
    expect(KNOWN_LIMITATIONS.join(' ')).toMatch(/explicit assignment inside it/);
  });
  it('does not turn an ordinary email-shaped line with spaces into an exemption', () => {
    ['my pin=5826 mail a@b.co', 'a@b.co pin 5826', 'ankit1995s @gmail.com', 'mail ankit1995s@gmail.com'].forEach((t) => expect(screen(t, 'email').blocked, t).toBe(true));
  });
});

describe('integration stage 1: field-specific rejection messages', () => {
  const FIELDS = [
    ['chat', 'chat', 'my pin is 5826'],
    ['name', 'name', 'ABCDE1234F'],
    ['phone', 'phone', '9198 7654 3210'],
    ['email', 'email', 'my pin is 5826'],
    ['hlv', 'hlv', 'card 4111 1111 1111 1111'],
    ['expenses', 'hlv', 'pin 5826'],
    ['liabilities', 'hlv', 'pin 5826'],
    ['cover', 'hlv', 'pin 5826'],
    ['years', 'years', 'pin 5826'],
  ];
  it.each(FIELDS)('the %s step gets its own wording for sensitive input, without repeating the input', (step, key, text) => {
    const r = screen(text, step);
    expect(r.blocked).toBe(true);
    const msg = rejectionMessage(r, step);
    expect(msg).toBe(REJECTION_TEXTS.sensitive[key]);
    expect(msg).not.toContain(text);
    expect(msg).not.toMatch(/5826|4111|ABCDE1234F|9198/);
  });
  it('uses six different wordings for the six fields', () => {
    expect(new Set(Object.values(REJECTION_TEXTS.sensitive)).size).toBe(6);
    expect(new Set(Object.values(REJECTION_TEXTS.length)).size).toBe(6);
    expect(Object.keys(REJECTION_TEXTS.sensitive).sort()).toEqual(['chat', 'email', 'hlv', 'name', 'phone', 'years']);
  });
  it('asks for the right thing at each field', () => {
    expect(REJECTION_TEXTS.sensitive.name).toMatch(/just your name/);
    expect(REJECTION_TEXTS.sensitive.phone).toMatch(/not grouped in fours/);
    expect(REJECTION_TEXTS.sensitive.email).toMatch(/only your email address/);
    expect(REJECTION_TEXTS.sensitive.hlv).toMatch(/just the amount/);
    expect(REJECTION_TEXTS.sensitive.years).toMatch(/number of years/);
    expect(REJECTION_TEXTS.sensitive.chat).toMatch(/PAN, passwords, OTPs or account numbers/);
  });
  it('gives the phone wording for a 91-prefixed mobile number written in groups of four', () => {
    const r = screen('9198 7654 3210', 'phone');
    expect(r).toMatchObject({ blocked: true, kinds: ['aadhaar'] });
    expect(rejectionMessage(r, 'phone')).toBe(REJECTION_TEXTS.sensitive.phone);
  });
  it.each(FIELDS)('the %s step gets its own too-long wording', (step, key) => {
    const r = screen('a'.repeat(FIELD_LIMITS[step === 'chat' ? 'chat' : ['expenses', 'liabilities', 'cover', 'years', 'hlv'].includes(step) ? 'hlv' : step] + 1), step);
    expect(r.kinds).toEqual(['too-long']);
    expect(rejectionMessage(r, step)).toBe(REJECTION_TEXTS.length[key]);
  });
  it('prefers the sensitive wording when a message is both too long and sensitive', () => {
    const r = screen(`pin 5826 ${'a'.repeat(100)}`, 'name');
    expect(r.kinds).toContain('too-long');
    expect(rejectionMessage(r, 'name')).toBe(REJECTION_TEXTS.sensitive.name);
  });
  it('gives a generic message for an unknown step or input that is not text, and nothing for a message that was not blocked', () => {
    expect(rejectionMessage(screen('hello', 'bogus'), 'bogus')).toBe(REJECTION_TEXTS.generic);
    expect(rejectionMessage(screen({}, 'chat'), 'chat')).toBe(REJECTION_TEXTS.generic);
    expect(rejectionMessage(screen('hello', 'chat'), 'chat')).toBe('');
    expect(rejectionMessage(null, 'chat')).toBe('');
    expect(rejectionMessage(undefined)).toBe('');
    expect(rejectionMessage({ blocked: true, kinds: 'x' }, 'chat')).toBe(REJECTION_TEXTS.sensitive.chat);
    expect(rejectionMessage({ blocked: true, kinds: ['pan'] }, Symbol('s'))).toBe(REJECTION_TEXTS.generic);
    expect(() => rejectionMessage({ get blocked() { throw new Error('x'); } }, 'chat')).not.toThrow();
  });
  it('keeps the planner wording, never repeats a number the visitor typed, and keeps the hidden bubble fixed', () => {
    const all = [...Object.values(REJECTION_TEXTS.sensitive), ...Object.values(REJECTION_TEXTS.length), REJECTION_TEXTS.generic, HIDDEN_BUBBLE_TEXT].join(' ');
    expect(all).not.toMatch(/advis[eo]r/i);
    expect(HIDDEN_BUBBLE_TEXT).toBe('Message hidden for your privacy');
    expect(HIDDEN_BUBBLE_TEXT).not.toMatch(/[\d•]/);
    expect(Object.isFrozen(REJECTION_TEXTS)).toBe(true);
    expect(Object.isFrozen(REJECTION_TEXTS.sensitive)).toBe(true);
  });
});

describe('integration stage 1: safe error information for the console', () => {
  const axiosLike = () => {
    const e = new Error('Request failed for ABCDE1234F, 9876543210, ankit1995s@gmail.com');
    e.name = 'AxiosError';
    e.code = 'ERR_BAD_RESPONSE';
    e.config = { url: '/api/consultations', data: JSON.stringify({ fullName: 'Ankit Sharma', phone: '9876543210', email: 'ankit1995s@gmail.com' }) };
    e.request = { body: 'phone=9876543210' };
    e.response = { status: 500, data: { message: 'bad phone 9876543210' }, config: { data: '{"phone":"9876543210"}' } };
    return e;
  };
  it('keeps only the name, the HTTP status and the short code of a request error', () => {
    const info = safeErrorInfo(axiosLike());
    expect(info).toEqual({ name: 'AxiosError', status: 500, code: 'ERR_BAD_RESPONSE' });
    expect(JSON.stringify(info)).not.toMatch(/9876543210|ABCDE1234F|ankit|Sharma|consultations/);
  });
  it('returns plain defaults for anything else, and never throws', () => {
    [null, undefined, 'ABCDE1234F', 42, true, Symbol('s'), [], {}, () => 1, new Proxy({}, { get() { throw new Error('boom'); } }), { get name() { throw new Error('boom'); } }, { response: { get status() { throw new Error('boom'); } } }].forEach((v) => {
      let info;
      expect(() => { info = safeErrorInfo(v); }).not.toThrow();
      expect(info).toEqual({ name: 'Error', status: null, code: null });
    });
  });
  it('refuses a name, status or code that could carry data', () => {
    const e = { name: 'ABCDE1234F', code: '9876543210 phone', response: { status: '500' } };
    expect(safeErrorInfo(e)).toEqual({ name: 'Error', status: null, code: null });
    expect(safeErrorInfo({ name: 'Error', response: { status: 99 } }).status).toBeNull();
    expect(safeErrorInfo({ name: 'Error', response: { status: 600 } }).status).toBeNull();
    expect(safeErrorInfo({ name: 'Error', response: { status: 500.5 } }).status).toBeNull();
    expect(safeErrorInfo({ name: 'x'.repeat(41) }).name).toBe('Error');
    expect(safeErrorInfo({ name: 'TypeError', code: 'ECONNABORTED', response: { status: 404 } })).toEqual({ name: 'TypeError', status: 404, code: 'ECONNABORTED' });
  });
  it('does not mutate or expose the error it is given', () => {
    const e = axiosLike();
    const before = JSON.stringify(Object.getOwnPropertyNames(e));
    safeErrorInfo(e);
    expect(JSON.stringify(Object.getOwnPropertyNames(e))).toBe(before);
    expect(Object.keys(safeErrorInfo(e)).sort()).toEqual(['code', 'name', 'status']);
  });
});

describe('integration stage 1: the last check before a booking is sent', () => {
  const GOOD = { fullName: 'Priya Sharma', phone: '9876543210', email: 'priya.sharma@gmail.com' };
  it('passes a normal booking, including an email that looks like a PAN', () => {
    expect(screenBookingFields(GOOD)).toBe(true);
    expect(screenBookingFields({ ...GOOD, email: 'ankit1995s@gmail.com' })).toBe(true);
    expect(screenBookingFields({ ...GOOD, fullName: 'Anne-Marie O’Neil' })).toBe(true);
  });
  it.each([
    ['a PAN as the name', { fullName: 'ABCDE1234F' }],
    ['a card number as the name', { fullName: '4111 1111 1111 1111' }],
    ['a password as the name', { fullName: 'password is hunter2' }],
    ['a name that is too long', { fullName: 'a'.repeat(81) }],
    ['a credential assignment as the email', { email: 'password=hunter2@a.bc' }],
    ['an email that is not an email', { email: 'my pin is 5826' }],
    ['an email that is too long', { email: `${'a'.repeat(250)}@x.com` }],
    ['a card number as the phone', { phone: '4111 1111 1111 1111' }],
    ['a PAN as the phone', { phone: 'ABCDE1234F' }],
    ['a phone number that is too long', { phone: '9'.repeat(21) }],
    ['a name that is not text', { fullName: 12345 }],
    ['a missing email', { email: undefined }],
  ])('refuses %s', (label, patch) => {
    expect(screenBookingFields({ ...GOOD, ...patch })).toBe(false);
  });
  it('refuses anything that is not an object of the three fields, and never throws', () => {
    [null, undefined, 'text', 5, [], {}, { fullName: 'a' }, { get fullName() { throw new Error('boom'); } }].forEach((v) => {
      let out;
      expect(() => { out = screenBookingFields(v); }).not.toThrow();
      expect(out).toBe(false);
    });
  });
});
