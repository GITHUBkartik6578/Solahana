/**
 * Typed-message detection for the chatbot's two self-check tools.
 * Returns 'diagnostic', 'hlv', or null. It only matches whole, specific phrases so ordinary
 * questions (fees, tax, "term plan") keep going through the chatbot's existing intent rules.
 */
const TOOL_RULES = [
  ['hlv', /\b(hlv|human life value|life cover(age)?|life insurance cover(age)?|cover gap)\b/],
  ['diagnostic', /\b(diagnos\w*|financial health|health check ?up)\b/],
];

export function detectTool(raw) {
  const t = String(raw ?? '').toLowerCase();
  const hit = TOOL_RULES.find(([, re]) => re.test(t));
  return hit ? hit[0] : null;
}
