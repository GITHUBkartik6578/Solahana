import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import * as privacy from '../../utils/chatPrivacy';

/**
 * Source-contract tests for the privacy integration in SolahanaChat.jsx. The repo has no DOM test tooling, so these read the component
 * source (line endings normalised) and check the properties that keep typed text private. They are drift guards: they fail if the early
 * screening gate is moved, bypassed or weakened, or if a flow that must stay unchanged is edited.
 */
const src = readFileSync(fileURLToPath(new URL('./SolahanaChat.jsx', import.meta.url)), 'utf8').replace(/\r\n/g, '\n');

const between = (text, from, to) => {
  const i = text.indexOf(from);
  const j = text.indexOf(to, i + from.length);
  if (i < 0 || j < 0) throw new Error(`markers not found: ${from} | ${to}`);
  return text.slice(i, j);
};
const sha = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);
const count = (text, needle) => text.split(needle).length - 1;

const onSend = between(src, '  const onSend = (e) => {', '  const liveText = ');
const gate = between(onSend, 'const screened = screenUserText(', 'pushUser(screened.display);');

describe('the early screening gate in onSend', () => {
  it('screens the typed text once, before anything else can see it', () => {
    expect(count(onSend, 'screenUserText(')).toBe(1);
    const order = [
      "const text = input.trim();",
      'screenUserText(text, { step })',
      "setInput('')",
      'if (screened.blocked) {',
      'pushUser(screened.display);',
      'handleHlvInput(text)',
      'handleLeadInput(text)',
      'detect(text)',
    ].map((needle) => onSend.indexOf(needle));
    order.forEach((i, k) => expect(i, `step ${k} is present`).toBeGreaterThan(-1));
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
  it('uses the step of the field the text goes into: an HLV question, a lead field, or chat', () => {
    const fn = between(src, '  const inputStep = () => {', '  const onSend');
    expect(fn).toContain('if (hlv) return hlv.step;');
    expect(fn).toContain("['name', 'phone', 'email'].includes(lead.step)");
    expect(fn).toContain("return 'chat';");
    expect(onSend).toContain('const step = inputStep();');
  });
  it('clears the input for every message, then ends the blocked branch with a return before any handler runs', () => {
    expect(count(onSend, "setInput('')")).toBe(1);
    expect(gate).toContain('if (screened.blocked) {');
    expect(gate).toMatch(/return pushBot\(/);
    expect(gate.indexOf("setInput('')")).toBeLessThan(gate.indexOf('if (screened.blocked) {'));
  });
  it('shows only the fixed placeholder for a blocked message, never the text or a redacted copy', () => {
    const blocked = between(onSend, 'if (screened.blocked) {', 'pushUser(screened.display);');
    expect(blocked).toContain('pushUser(HIDDEN_BUBBLE_TEXT, { hidden: true });');
    expect(blocked).not.toMatch(/screened\.display/);
    // the typed text is not used inside the blocked branch (comments aside, "text" appears only as the key of the reply object)
    expect(blocked.replace(/\/\/.*$/gm, '')).not.toMatch(/\btext\b(?!:)/);
  });
  it('does not touch lead, HLV or diagnostic state, a handler, the router or the backend in the blocked branch', () => {
    const blocked = between(onSend, 'if (screened.blocked) {', 'pushUser(screened.display);');
    ['setLead', 'setHlv', 'setDiag', 'handleHlvInput', 'handleLeadInput', 'detect(', 'detectTool', 'runIntent', 'submitLead', 'startBooking', 'consultationService', 'navigate('].forEach((name) => {
      expect(blocked, name).not.toContain(name);
    });
  });
  it('replies with the field-specific rejection, and keeps the same question open', () => {
    const blocked = between(onSend, 'if (screened.blocked) {', 'pushUser(screened.display);');
    expect(blocked).toContain('text: rejectionMessage(screened, step)');
    expect(blocked).toContain("hint: hlv ? 'hlv' : lead ? 'lead' : undefined");
    expect(blocked).toContain("yearsChip: hlv?.step === 'years'");
  });
  it('echoes only the screened display for a message that was allowed, and the old phone regex is gone', () => {
    expect(src).not.toMatch(/pushUser\(\s*text\s*\)/);
    expect(src).not.toContain('replace(/\\d(?=\\d{4})/g');
    const calls = [...src.matchAll(/pushUser\(([^;]*)\);/g)].map((m) => m[1].trim());
    calls.forEach((a) => expect(['option.label', 'chip.label', 'slot', '`${DEFAULT_YEARS} years`', 'HIDDEN_BUBBLE_TEXT, { hidden: true }', 'screened.display']).toContain(a));
  });
  it('only passes the typed text to a handler after the gate, and the other calls use fixed values', () => {
    expect(src.indexOf('handleHlvInput(text)')).toBeGreaterThan(src.indexOf('screenUserText(text'));
    expect(count(src, 'handleHlvInput(text)')).toBe(1);
    expect(count(src, 'handleLeadInput(text)')).toBe(1);
    expect(count(src, 'detect(text)')).toBe(1);
    expect(src).toContain('handleHlvInput(String(DEFAULT_YEARS))');
  });
  it('is the only place the typed text is read, and the only call to screenUserText', () => {
    expect(count(src, 'const text = input.trim();')).toBe(1);
    expect(count(src, 'screenUserText(')).toBe(1);
    expect(count(src.replace(onSend, ''), 'screenUserText(')).toBe(0);
  });
});

describe('the booking guard, logging and confirmation', () => {
  it('checks the booking fields before anything is sent, and before the lead moves to the sending state', () => {
    const fn = between(src, '  const submitLead = async (data) => {', '  const handleLeadInput');
    expect(fn.indexOf('screenBookingFields(data)')).toBeGreaterThan(-1);
    expect(fn.indexOf('screenBookingFields(data)')).toBeLessThan(fn.indexOf("setLead({ ...data, step: 'sending' })"));
    expect(fn.indexOf('screenBookingFields(data)')).toBeLessThan(fn.indexOf('consultationService.bookConsultation'));
    expect(fn).toMatch(/if \(!screenBookingFields\(data\)\) \{[\s\S]*?return pushBot\(/);
  });
  it('logs only the safe description of an error, and uses no other console output', () => {
    const calls = src.match(/console\.\w+\([^\n]*/g) || [];
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain("console.error('[Chat booking failed]', safeErrorInfo(err));");
    expect(src).not.toMatch(/console\.\w+\(.*\berr\b[^)]*\)/s.source.replace('.*', '[^\\n]*') === '' ? /x^/ : /console\.error\('[^']*',\s*err\)/);
  });
  it('shows only the last four digits of the phone number in the confirmation, and never the full number in a chat bubble', () => {
    expect(src).toContain('will call you on ${maskPhoneDisplay(data.phone)} in the');
    expect(src).not.toMatch(/call you on \$\{data\.phone\}/);
  });
  describe('the WhatsApp message', () => {
    const submit = between(src, '  const submitLead = async (data) => {', '  const handleLeadInput');
    const [success, failure] = submit.split('    } catch (err) {');
    const load = (name) => new Function('ADVISOR_FIRST', `${between(src, 'const bookingSummary', 'const TIME_SLOTS')}; return ${name};`)('Amit');
    const booking = { fullName: 'Test Visitor', phone: '9000000001', email: 'test.visitor@example.com', goal: 'Financial Planning', preferredTime: 'Morning (9 AM - 12 PM)' };
    it('leaves the mobile number out after a successful booking, and keeps every other line', () => {
      const text = load('bookingSummary')(booking, false);
      expect(text).toBe('Hi Amit, I just booked a free consultation on the Solahana website.\nName: Test Visitor\nEmail: test.visitor@example.com\nInterested in: Financial Planning\nBest time to call: Morning (9 AM - 12 PM)');
      expect(text).not.toMatch(/Mobile|9000000001/);
    });
    it('still builds the full message, as before, when the mobile line is asked for (the failure bubble)', () => {
      const text = load('bookingSummary')(booking);
      expect(text).toBe('Hi Amit, I just booked a free consultation on the Solahana website.\nName: Test Visitor\nMobile: 9000000001\nEmail: test.visitor@example.com\nInterested in: Financial Planning\nBest time to call: Morning (9 AM - 12 PM)');
      expect(load('bookingSummary')(booking, true)).toBe(text);
    });
    it('uses the message without the mobile on the success bubble only, and shows the notice there', () => {
      expect(success).toContain('waText: bookingSummary(data, false),');
      expect(success).toContain('waNotice: WA_SHARE_NOTICE,');
      expect(success).not.toContain('bookingSummary(data),');
      expect(count(src, 'bookingSummary(')).toBe(2); // called only for the success bubble and the failure bubble
    });
    it('leaves the failure bubble as it was, with the full message, and only adds its own notice', () => {
      expect(failure).toContain('waText: bookingSummary(data),');
      expect(failure).toContain('waNotice: WA_FAILURE_NOTICE,');
      expect(failure).not.toContain('WA_SHARE_NOTICE');
      expect(failure).toContain('Tap WhatsApp below: your details are already filled in, so ${ADVISOR} gets them straight away. Or call ${PHONE_DISPLAY}.');
      expect(failure).toContain('actions: true,');
      expect(failure).not.toContain('success: true');
      expect(success).not.toContain('WA_FAILURE_NOTICE');
    });
    it('tells the visitor, after a failed booking, that the message includes the mobile number and email, and why', () => {
      const notice = load('WA_FAILURE_NOTICE');
      expect(notice).toBe('Because the booking did not go through, this message includes your mobile number and email so Amit can reach you.');
      expect(notice).not.toMatch(/\d/);
      expect(notice).not.toMatch(/never|always|guarantee|anonymous|private/i);
    });
    it('tells the visitor what the button shares, in plain words, without promising more than it can', () => {
      const notice = load('WA_SHARE_NOTICE');
      expect(notice).toMatch(/name, email, interest and preferred call time/);
      expect(notice).toMatch(/mobile number is not typed into it/);
      expect(notice).toMatch(/Amit will see the number you send it from/);
      expect(notice).not.toMatch(/\d/);
      expect(notice).not.toMatch(/never|always|guarantee|anonymous|private/i);
    });
    it('renders the notice under the call and WhatsApp buttons, in the existing muted text colour', () => {
      expect(src).toContain('{m.waNotice && <p className="text-[11px] leading-snug text-[#5B6B84]">{m.waNotice}</p>}');
      expect(src.indexOf('{m.waNotice &&')).toBeGreaterThan(src.indexOf('href={waLink(m.waText)}'));
    });
    it('keeps the confirmation text and the WhatsApp link builder as they were', () => {
      expect(src).toContain('will call you on ${maskPhoneDisplay(data.phone)} in the');
      expect(src).toContain('Want to reach him sooner? Send your details on WhatsApp in one tap.');
      expect(src).toContain("const waLink = (text) => (text ? `${WHATSAPP}?text=${encodeURIComponent(text)}` : WHATSAPP);");
    });
  });
  it('uses storage only for the greeting teaser flag', () => {
    expect(src).not.toContain('localStorage');
    (src.match(/sessionStorage\.\w+\([^\n]*/g) || []).forEach((line) => expect(line).toContain('sol_chat_teaser'));
  });
});

describe('the input field', () => {
  const field = between(src, '<input\n', '/>\n                <button');
  it('limits the length to the field, and switches off autofill history, autocorrect and spellcheck', () => {
    expect(field).toContain('maxLength={fieldLimit(inputStep())}');
    expect(field).toContain("autoComplete={lead?.step === 'name' ? 'name' : lead?.step === 'phone' ? 'tel' : lead?.step === 'email' ? 'email' : 'off'}");
    expect(field).toContain("autoCapitalize={lead?.step === 'name' ? 'words' : 'none'}");
    expect(field).toContain('autoCorrect="off"');
    expect(field).toContain('spellCheck={false}');
    expect(field).toContain('enterKeyHint="send"');
    expect(field).toContain('data-1p-ignore');
    expect(field).toContain('data-lpignore="true"');
  });
  it('keeps the existing attributes', () => {
    expect(field).toContain('aria-label="Type your message"');
    expect(field).toContain('placeholder={placeholder}');
    expect(field).toContain("disabled={lead?.step === 'time' || lead?.step === 'sending' || Boolean(diag)}");
    expect(field).toContain("inputMode={hlv ? 'decimal' : lead?.step === 'phone' ? 'tel' : lead?.step === 'email' ? 'email' : 'text'}");
  });
  it('shows a live warning and the privacy hint, both static texts from the utility', () => {
    expect(src).toContain('const liveText = liveWarning(input, { step: inputStep() });');
    expect(src).toMatch(/\{liveText && <p role="status"[^>]*>\{liveText\}<\/p>\}/);
    expect(src).toContain('{PRIVACY_HINT}');
  });
  it('clears unsent input when the panel closes (Escape, the close button, the launcher) and does not clear the transcript', () => {
    expect(between(src, "const onKey = (e) => {", '    window.addEventListener')).toContain("setInput('')");
    expect(between(src, 'onClick={() => { setOpen(false);', 'aria-label="Close chat"')).toContain("setInput('')");
    expect(src).toContain("onClick={() => { if (open) setInput(''); setOpen((o) => !o); }}");
    expect(src).not.toMatch(/setMessages\(\[\]\)/);
  });
});

describe('what the integration must not change', () => {
  it('imports only names that the utility exports, and no knowledge or router module', () => {
    const imported = between(src, 'import { HIDDEN_BUBBLE_TEXT', " } from '../../utils/chatPrivacy'").replace('import { ', '').split(',').map((n) => n.trim());
    imported.forEach((name) => expect(privacy[name], name).toBeDefined());
    expect(src).not.toMatch(/chatKnowledge|chatRouter|data\/chatKnowledge/);
  });
  it('keeps the booking validators exactly as they were', () => {
    expect(src).toContain("const digits = v.replace(/\\D/g, '').replace(/^(91|0)(?=\\d{10}$)/, '');");
    expect(src).toContain('if (!/^[6-9]\\d{9}$/.test(digits))');
    expect(src).toContain('if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/.test(v))');
  });
  // Hashes of the source regions that must stay byte-for-byte as they were before the integration (taken from the commit before it).
  it.each([
    ['the time slots', ['const TIME_SLOTS', '\n\n'], '2bcf9431ec838397'],
    ['the HLV questions', ['const HLV_STEPS = {', '\nconst ANSWERS'], '00aa6beec2e5266a'],
    ['the approved answers', ['const ANSWERS = {', '// Matching order matters'], '8a9e7b79a150231c'],
    ['the topic and intent rules and detect()', ['// Matching order matters', 'let uid = 0;'], '4b6ee8f25133053a'],
    ['the lead (booking) input handler', ['  const handleLeadInput = (text) => {', '  /* ------------------------------ HLV gap calculator'], '59d568066d250a42'],
    ['the HLV calculator flow', ['  /* ------------------------------ HLV gap calculator', '  /* ------------------------------ financial health diagnostic'], '55a2e68ae5ecbb8e'],
    ['the financial health diagnostic flow', ['  /* ------------------------------ financial health diagnostic', '  /* ------------------------------ routing'], '93d54e0e3c0a25e1'],
    ['the routing, chip and time-slot handlers', ['  /* ------------------------------ routing', '  /* The field the next typed message goes into.'], '0ccd06ab1d605f3b'],
  ])('leaves %s unchanged', (label, [from, to], hash) => {
    expect(sha(between(src, from, to))).toBe(hash);
  });
});
