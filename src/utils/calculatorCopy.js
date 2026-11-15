/**
 * Wording for the risk and assumption notes shown under the investment calculators. Kept here, apart from the
 * components, so it can be tested. These are plain-language notes, not legal text: the owner should have them
 * reviewed (compliance) before relying on them.
 */

export const MARKET_RISK_NOTE =
  'Illustration only, not a forecast or a guarantee. The return is an assumption you choose; actual returns will vary and can be negative. Figures are before tax and costs. Mutual fund and other market-linked investments are subject to market risk.';

/** How calculateSIP treats instalments and the yearly rate (annuity-due, rate / 12 each month). */
export const SIP_CONVENTION_NOTE =
  'Each instalment is assumed to be invested at the start of the month, and the yearly rate is applied as one-twelfth each month, so the effective yearly return is a little higher than the rate entered.';

export const RETIREMENT_NOTE =
  'Assumes 25 years of spending after retirement, withdrawals at the end of each year, and the same return before and after retirement. Inflation and returns are assumptions, not guarantees. Results are before tax and market risk applies. Returns above 30% a year are treated as 30%.';

/** The Lumpsum, FD and Goal engines keep the yearly return between 0.1% and 30%; the note says so instead of letting a typed 0% look exact. */
export const RATE_LIMIT_NOTE = 'Rates below 0.1% or above 30% a year are treated as 0.1% or 30%.';

export const FD_NOTE =
  'Illustration that assumes the rate stays fixed for the whole tenure and the deposit is held to maturity. Actual terms vary by bank: withdrawing early can reduce the return, and interest is taxable. Figures are before tax.';

export const SAMPLE_FIGURES_NOTE =
  'Sample figures are illustrations at the assumed returns shown. They are not guarantees or forecasts.';

const pct = (n) => {
  if (n === '' || n === null || n === undefined) return null; // Number('') and Number(null) are 0, which would show a made-up "0%"
  const x = Number(n);
  return Number.isFinite(x) ? String(Math.round(x * 100) / 100) : null;
};

/** Goal planner assumptions. Always states the 6% inflation the engine applies to the goal's cost. */
export function goalAssumptionNote(returnPct, inflationPct = 6) {
  const ret = pct(returnPct);
  const inf = pct(inflationPct);
  const growth = ret === null ? 'your chosen return' : `${ret}%`;
  return `Assumes the goal's cost rises ${inf}% a year and your investments grow ${growth} a year, both steady. Actual costs and returns will differ.`;
}
