const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** '2026-11-20' -> '20 Nov 2026' (no time zone shift: the day is read as written). */
export function shortDate(isoDay) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(isoDay));
  if (!m) return String(isoDay);
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}
