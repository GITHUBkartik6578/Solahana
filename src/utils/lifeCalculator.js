/**
 * Human Life Calculator: pure date maths, no network and no storage.
 *
 * Everything about the person's actual age (years / months / days, total days / weeks / months lived)
 * is exact calendar arithmetic on the user's LOCAL date. Life expectancy is a rounded statistical
 * average, NOT a prediction for any individual.
 */

// Approximate life expectancy at birth for India (rounded national averages, in years).
// Published figures vary by source and year, so these are deliberately rounded and labelled as estimates.
export const LIFE_EXPECTANCY = {
  male: 69,
  female: 72,
  unspecified: 70.5,
};

export const MIN_BIRTH_YEAR = 1900;
const WEEKS_PER_YEAR = 52;
const DAYS_PER_YEAR = 365.2425;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

const pad = (n) => String(n).padStart(2, '0');

/** Today's date in the user's local time zone as a plain { y, m, d } (m is 1-12). */
export function localToday(now = new Date()) {
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

/** "YYYY-MM-DD" for <input type="date" max>, in local time. */
export function toInputDate({ y, m, d }) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** Parses "YYYY-MM-DD" into { y, m, d } or returns null when it is not a real calendar date. */
export function parseInputDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) return null;
  return { y, m, d };
}

const isAfter = (a, b) => a.y > b.y || (a.y === b.y && (a.m > b.m || (a.m === b.m && a.d > b.d)));
const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate(); // m is 1-12

/** Returns an error message, or '' when the birth date is fine. */
export function validateBirthDate(value, today = localToday()) {
  if (!value) return 'Please enter your date of birth.';
  const dob = parseInputDate(value);
  if (!dob) return 'That does not look like a valid date. Please check the day, month and year.';
  if (isAfter(dob, today)) return 'Date of birth cannot be in the future.';
  if (dob.y < MIN_BIRTH_YEAR) return `Please enter a year ${MIN_BIRTH_YEAR} or later.`;
  return '';
}

/** Whole calendar days between two { y, m, d } dates (DST-safe: uses UTC midnights). */
export function daysBetween(from, to) {
  return Math.round((Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d)) / 86400000);
}

/** Exact age as years, months and days (month-end birthdays roll to the last day of shorter months). */
export function exactAge(dob, today) {
  const anniversary = (months) => {
    const total = dob.y * 12 + (dob.m - 1) + months;
    const y = Math.floor(total / 12);
    const m = (total % 12) + 1;
    return { y, m, d: Math.min(dob.d, daysInMonth(y, m)) };
  };
  let months = (today.y - dob.y) * 12 + (today.m - dob.m);
  if (isAfter(anniversary(months), today)) months -= 1;
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: daysBetween(anniversary(months), today),
  };
}

/**
 * Full calculation.
 * @param {string} dobValue "YYYY-MM-DD"
 * @param {'male'|'female'|'unspecified'} gender
 */
export function calculateLife(dobValue, gender = 'unspecified', today = localToday()) {
  const dob = parseInputDate(dobValue);
  const age = exactAge(dob, today);
  const daysLived = daysBetween(dob, today);
  const weeksLived = Math.floor(daysLived / 7);
  const monthsLived = age.years * 12 + age.months;

  const expectancyYears = LIFE_EXPECTANCY[gender] ?? LIFE_EXPECTANCY.unspecified;
  const expectancyDays = Math.round(expectancyYears * DAYS_PER_YEAR);
  const pastAverage = daysLived >= expectancyDays;

  const daysRemaining = pastAverage ? 0 : expectancyDays - daysLived;
  const weeksRemaining = Math.floor(daysRemaining / 7);
  const monthsRemaining = Math.round(daysRemaining / DAYS_PER_MONTH);
  const yearsRemaining = daysRemaining / DAYS_PER_YEAR;

  const progress = Math.min(1, daysLived / expectancyDays);

  // Life-in-weeks grid: one row per year of the estimated span (52 weeks each).
  const totalGridWeeks = Math.ceil(expectancyYears) * WEEKS_PER_YEAR;
  const livedCells = Math.min(totalGridWeeks, Math.floor(progress * totalGridWeeks) + 1);

  return {
    age,
    daysLived,
    weeksLived,
    monthsLived,
    expectancyYears,
    pastAverage,
    yearsRemaining,
    monthsRemaining,
    weeksRemaining,
    daysRemaining,
    progress,
    grid: { total: totalGridWeeks, lived: livedCells, perRow: WEEKS_PER_YEAR },
  };
}
