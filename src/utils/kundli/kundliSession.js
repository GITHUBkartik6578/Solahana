/**
 * Keeps the Financial Kundli answers in JavaScript memory while the visitor moves around the site in the same tab, so
 * following a Navbar or footer link and coming back does not lose them.
 *
 * This is NOT storage: nothing is written to any browser storage, cookie or server. The value lives in this
 * module only, so a refresh, a closed tab or "Start over" clears it, exactly as the intro's privacy note says.
 */
let memory = { answers: null, sid: null, history: [] };

export function readSession() {
  return memory;
}

export function writeSession(answers, sid) {
  memory = { ...memory, answers, sid };
}

/** Past Kundlis loaded from the customer's own file (for the growth charts). */
export function writeHistory(history) {
  memory = { ...memory, history: Array.isArray(history) ? history : [] };
}

export function clearSession() {
  memory = { answers: null, sid: null, history: [] };
}
