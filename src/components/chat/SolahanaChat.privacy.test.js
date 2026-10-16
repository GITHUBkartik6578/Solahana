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
  it('keeps the WhatsApp text, which the visitor sends themselves with one tap, as it was', () => {
    expect(src).toContain('`Name: ${d.fullName}\\nMobile: ${d.phone}\\nEmail: ${d.email}\\nInterested in: ${d.goal}\\nBest time to call: ${d.preferredTime}`');
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
