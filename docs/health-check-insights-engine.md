# Health Check-up insight engine (PR-A)

Technical reference for `src/utils/healthCheckInsights.js`. PR-A is calculation only: no screen, no copy, no stylesheet, no server and
no database change. Nothing in the app imports the engine yet (PR-B does).

## What it is, and what it is not

- **Pure functions** on the validated amounts (whole **paise**, as `validateInputs` in `financialHealthCheck.js` returns them) and on the
  existing **hc-v1** score. The score, its weights and its thresholds stay in `financialHealthCheck.js`; the engine only calls
  `scoreHealthCheck`, it never changes or replaces it.
- **Browser only.** It is never imported by the server or by the lead payload code. It reads no browser state, makes no network
  call, uses no clock and no randomness, and has no logging.
- **No new questions.** It uses the nine inputs the check-up already asks.
- **No conclusions it has no inputs for.** There is no retirement, net worth, savings rate, needs-based insurance requirement or
  recommendation in the output. The life figure is a *benchmark* (a multiple of take-home income) and the health figure is a *reference level*.

## Privacy boundary

- `buildInsights` returns the person's own amounts (in paise) inside `figures`, `alerts[].detail` and `steps[].params`. That output
  stays in the browser. It must never be passed to `buildLeadPayload`, the lead service, browser storage, a URL, a log or any
  analytics. The lead payload is unchanged: contact details, the consent record and the score summary only.
- Error messages never repeat a value (they name the field only).
- The tests prove that the module imports nothing but the scoring module, mentions no storage, network, analytics, payment, clock,
  randomness or logging, runs with the browser, clock and network globals made to throw, and is not reached by the server or the payload.
  These checks show that **the engine** sends and stores nothing; they do not (and cannot) show that nothing else can read the page.

## Units, rounding and formatters

| Quantity | Unit | Rounding |
|---|---|---|
| Money | whole paise (integers) | every comparison is integer arithmetic, never floating point |
| Ratios | whole **tenths** (`188` = 18.8) | EMI share rounds **up**; term multiple, runway months and investment share round **down** |
| Amounts to be reached (gaps, needs, top-ups, set-asides) | paise, shown rounded **up** to a whole rupee | never understate what is required |
| Limits (the EMI that would still earn a level) | paise, shown rounded **down** to a whole rupee | never overstate what is allowed |

With these directions a displayed one-decimal value never crosses a scoring threshold that the exact value has not crossed.

Formatters: `formatPercentTenths(188)` is `18.8%`, `formatMultipleTenths(52)` is `5.2×`, `formatMonthsTenths(85)` is `8.5` (a symbol where
there is one, never a unit word: the sentence adds "months"). Above the **display ceilings** in `DISPLAY_CEILINGS` (1,000% / 1,000× / 1,200 months)
they return `more than 1,000%`, `more than 1,000×` and `more than 1,200`; the tier is always decided on exact paise, never on the text.
`formatRupeesExact` writes what was entered or computed (`₹80,000`, `-₹1,500.50`, Indian grouping, paise only when present),
`formatRupeesCeil` and `formatRupeesFloor` write whole rupees rounded up or down. The existing `formatInr` is not used: it shortens to "₹3.33 lakh" and can understate an amount.

`monthlySetAside12(gapPaise)` is what to put aside each month to cover a gap in 12 months: `ceil(ceil(gap / 100) / 12)` rupees, returned in paise, with no returns assumed.

`divFloor` and `divCeil` are the exact integer divisions behind all of this (they refuse anything that is not a whole number).

`MAX_AMOUNT_PAISE` is the largest amount accepted in any field: the form's Rs 100 crore balance limit (`LIMITS.balanceMaxRupees`) in paise. The engine refuses to load if that limit were ever raised
so far that `limit × 1000` (the largest multiplier it uses) could pass 2^53. At the current limit the largest product is 10^14 against 9 × 10^15.

## Figures (`computeFigures`)

Reference levels are in `TARGETS` and repeat the thresholds inside `scoreHealthCheck`; the tests compare every tier with the points the scoring function awards.

| Group | Ratio shown | Partial level | Full level | Gap fields |
|---|---|---|---|---|
| `emi` | EMI ÷ take-home income | EMI ≤ 45% | EMI ≤ 30% | `reductionToPartialPaise`, `reductionToFullPaise`; limits `partialLimitPaise`, `fullLimitPaise` (rounded down) |
| `lifeBenchmark` | term cover ÷ annual take-home income | 5× | 10× | `gapToPartialPaise`, `gapToFullPaise`; needs `partialNeedPaise`, `fullNeedPaise` |
| `runway` | liquid savings ÷ fixed expenses (EMI **not** included, as in the score) | 3 months | 6 months | same pattern; `applies: false` and nulls when there are no fixed expenses |
| `investmentRate` | monthly investments ÷ income | 10% | 20% | `topUpToPartialPaise`, `topUpToFullPaise`; needs rounded up |
| `healthReference` | cover vs the reference level | n/a | Rs 10 lakh | `gapPaise` |
| `cashFlow` | the monthly budget (below) | | | |

A gap is 0 once its level is reached. `partialDistinct` is false when, for an income of a few paise, the partial and full levels are the same
number of paise, so only the full level is worth showing. Income is **take-home** income throughout (not gross).

### The monthly budget (`cashFlow`)

`incomePaise`, `essentialsPaise` (the "fixed expenses" field), `emiPaise`, `investmentsPaise`, `essentialsPlusEmiPaise`, `committedPaise` (essentials + EMIs + investments),
`unallocatedPaise` (income − committed, may be negative; an **indicative** amount that ignores discretionary, irregular and tax costs, not a surplus), `exceedsIncome`,
`overByPaise` (how far committed is above income), `essentialsAndEmiOverByPaise` (how far essentials + EMIs **alone** are above income) and `roomBeforeInvestmentsPaise`
(what is left of the income after essentials + EMIs, 0 when they already exceed it).

### Information only: `informationalRunway`

How long the savings last when EMIs are counted with the fixed expenses. Shown only when there are both EMIs and fixed expenses. Nothing else in the module reads it, and it is not what the score uses.
In `buildInsights` it is `info: { withEmiRunway: { applies, monthsTenths } }` (`monthsTenths` is null when `applies` is false).

## Alerts (`buildAlerts`)

Each alert is `{ id, tier, categoryId, severity, detail }`; `detail` is null except for A3. Alerts read the category points and the amounts, **never the overall score or band**, so a strong score can still carry an alert.

| Id | Meaning | Tier | Severity (table) |
|---|---|---|---|
| A1 | emergency fund below 3 months of fixed expenses | priority | `emergency` at 0 points: high |
| A2 | EMIs above 45% of income | priority | `emi` at 0 points: high |
| A3 | monthly cash-flow mismatch (below) | by kind | by kind |
| R1 | term cover below 5× annual income | review | `term` at 0 points: medium |
| R2 | health cover below the reference level | review | `health` at 0 points: medium |

### A3: the monthly cash-flow mismatch

A3 looks at the three monthly amounts together: **essentials + EMIs + investments against income**. It fires when the total exceeds income, and its **kind** says what the mismatch needs:

- `essentialsAndEmi` (tier **priority**, severity **high**): essentials + EMIs alone are above income. The budget does not close even before any investing.
- `investments` (tier **review**, severity **medium**): essentials + EMIs fit within income and only the investing pushes the total over. Investing is a choice, so this is a planning point. It is not described as debt, and nothing in the engine calls it a danger.

`detail` carries every amount of the mismatch: `kind`, `incomePaise`, `essentialsPaise`, `emiPaise`, `investmentsPaise`, `essentialsPlusEmiPaise`, `committedPaise`,
`overByPaise`, `essentialsAndEmiOverByPaise`, `roomBeforeInvestmentsPaise`. Copy can therefore state the exact mismatch: for `essentialsAndEmi`, "essentials and EMIs are ₹X above your income"
(`essentialsAndEmiOverByPaise`); for `investments`, "your plan is ₹X above your income, and ₹Y of income is left after essentials and EMIs" (`overByPaise`, `roomBeforeInvestmentsPaise`).

Worked examples (income Rs 50,000):

| Essentials | EMI | Investments | Result |
|---|---|---|---|
| 30,000 | 25,000 | 10,000 | essentials + EMI = 55,000 > 50,000: **high**, over by 15,000 in total, 5,000 from essentials + EMI alone |
| 30,000 | 10,000 | 15,000 | essentials + EMI = 40,000 fits, total 55,000: **medium**, over by 5,000, room 10,000 before investing |
| 30,000 | 20,000 | 0 | exactly 50,000: no alert (one paisa more investing gives a medium alert with room 0) |
| 10,000 | 50,000 + 1 paisa | 5,000 | EMI alone above income: **no A3** (A2 says it) |

**Suppression rule.** A3 is left out when the **EMI alone is above income**. A2 then already states that, and A3 would only repeat the same cause in another alert. When the EMI is high but still
below income (for example 60% of income) both are kept, because the cost total is a different problem from the EMI share. The rule is tested on every case of the boundary matrix and on a grid.

## Severity

Severity says **how urgent** a finding is, not how many points it cost. It is decided by the category and the state it is in (zero points, partial points) and never by the overall score.

- **high**: the monthly budget or the safety net is already strained; it can hurt within weeks or months.
- **medium**: a protection or planning gap that matters if something happens, a partial shortfall in a core category, or voluntary investing that pushes the plan over income.
- **low**: a long-term refinement or good practice; nothing that strains the household now.

A partial state is one step below the zero state of the same category (never below low). Investing is voluntary and is never rated above medium.

| Category | Zero points | Partial points |
|---|---|---|
| `emi` | high | medium |
| `emergency` | high | medium |
| `term` | medium | low |
| `health` | medium | (no partial) |
| `investment` | low | low |
| `overlap` | low | (no partial) |
| `shielding` | low | (no partial) |
| `cashFlow` | `essentialsAndEmi`: high | `investments`: medium |

The levels live in `SEVERITY_TABLE`; `SEVERITY_RATIONALE` has the reason for every entry (same shape). Both are frozen. To change a level, change the table (or pass another table to
`severityFor`, `severityForCashFlow`, `buildAlerts` or `rankFindings`); nothing else depends on a particular level, and there is no approval switch in the code. `severityFor(categoryId, points)`
returns `null` for full points and for a category that does not apply. A table with a missing or invalid level is refused with a `RangeError`.

## Findings, reasons and next steps

- `rankFindings(result)`: up to three **strengths** (categories with full points, largest first) and three **improvements** (categories that lost points, most severe first, then most points lost, then the fixed category order). Categories that do not apply are in neither list.
- `scoreReasons(result)`: `{ earned, applicable, score, scaled, notApplicable, lost: [{ id, points, max, lost }] }` with `earned + sum(lost) = applicable`.
- `selectNextSteps(figures, result, alerts)`: one step for every category that lost points, and one cash-flow step when `alerts` has A3. Steps are `{ id, horizon, categoryId, params }`: numbers only, no text (the wording is PR-B's copy). At most eight (seven categories + the cash-flow step), so there is no cap.

| Step | Horizon | Params (all paise unless named otherwise) |
|---|---|---|
| `CASH-ESS` | now | the nine amounts of the A3 `detail` (without `kind`) |
| `CASH-INV` | d90 | the same nine amounts |
| `EM-0` | now | `monthsTenths`, `gapToPartialPaise`, `gapToFullPaise`, `setAsideToPartialPaise`, `setAsideToFullPaise` |
| `EMI-0` | now | `pctTenths`, `partialLimitPaise`, `fullLimitPaise`, `reductionToPartialPaise`, `reductionToFullPaise` |
| `TERM-0` | d90 | `multipleTenths`, `coverPaise`, `partialNeedPaise`, `fullNeedPaise` |
| `HEALTH-0` | d90 | `coverPaise`, `gapPaise` |
| `INV-0` | d90 | `pctTenths`, `partialNeedPaise`, `fullNeedPaise`, `topUpToPartialPaise`, `topUpToFullPaise` |
| `OVERLAP-0`, `SHIELD-0` | d90 | none |
| `EM-1` | m12 | `monthsTenths`, `gapToFullPaise`, `setAsideToFullPaise` |
| `EMI-1` | m12 | `pctTenths`, `fullLimitPaise`, `reductionToFullPaise` |
| `TERM-1` | m12 | `multipleTenths`, `fullNeedPaise`, `gapToFullPaise` |
| `INV-1` | m12 | `pctTenths`, `fullNeedPaise`, `topUpToFullPaise` |

Horizons: **now** = a strained budget or safety net, **d90** = no points elsewhere or investing over income, **m12** = partial points. Order: horizon, then points lost, then the fixed category order.
Without alerts (`null`, `undefined` or `[]`) there is no cash-flow step. A cash-flow alert without a valid `kind` is refused (`InsightsInputError`, code `alert-invalid`).

## The output of `buildInsights(values)`

One argument: the validated amounts. The hc-v1 score is calculated inside by `scoreHealthCheck`, so the figures and the score cannot come from different inputs. The output is frozen all the way down.

```
{
  version:  'hc-insights-v1',                       // INSIGHTS_VERSION
  figures:  { emi, lifeBenchmark, runway, investmentRate, healthReference, cashFlow },
  alerts:   [{ id, tier, categoryId, severity, detail }],
  findings: { strengths: [categoryId], improvements: [categoryId] },
  reasons:  { earned, applicable, score, scaled, notApplicable, lost },
  steps:    [{ id, horizon, categoryId, params }],
  severity: { [categoryId]: 'high' | 'medium' | 'low' | null },   // only categories that apply; null = full points
  info:     { withEmiRunway: { applies, monthsTenths } },        // information only
}
```

## Errors, and handling them safely

`buildInsights` throws `InsightsInputError` (a `RangeError`) for an amount or choice it cannot use. It has a stable `code` and a `field`:
`amount-invalid` (not a whole number of paise, or negative), `amount-too-large` (above `MAX_AMOUNT_PAISE`), `income-required` (income is 0), `choice-invalid` (`overlap` or `business`), `result-invalid`, `alert-invalid`.
The message names the field and never repeats a value.

UI code that must not throw uses `tryBuildInsights(values)`: it returns `{ ok: true, insights }` or `{ ok: false, error: { code, field, message } }`, both frozen.
Anything unexpected (even a hostile object whose properties throw) comes back as `code: 'unexpected'` with a fixed message and no internal detail.

## Exports

`INSIGHTS_VERSION`, `InsightsInputError`, `MAX_AMOUNT_PAISE`, `TARGETS`, `DISPLAY_CEILINGS`, `SEVERITY_TABLE`, `SEVERITY_RATIONALE`, `divFloor`, `divCeil`, `formatPercentTenths`, `formatMultipleTenths`,
`formatMonthsTenths`, `formatRupeesExact`, `formatRupeesCeil`, `formatRupeesFloor`, `monthlySetAside12`, `computeFigures`, `informationalRunway`, `severityFor`, `severityForCashFlow`, `buildAlerts`,
`rankFindings`, `scoreReasons`, `selectNextSteps`, `buildInsights`, `tryBuildInsights`. A test fails if an export is added or removed without updating this list and the guard test.

## Tests

- `src/utils/healthCheckInsights.test.js`: the worked example (Rs 80,000, score 66); every threshold and gap against `scoreHealthCheck`; edge incomes of 1 to 5 paise; the Rs 100 crore limit; the A3 kinds, boundaries and suppression; every severity mapping and its reason; alerts, findings, reasons and steps on a 76,510-case boundary matrix; step params by value; null alerts; invalid input and `tryBuildInsights`; the documented output shapes.
- `src/utils/healthCheckGuards.test.js`: the existing score unchanged (63,000-case digest plus six hand-written cases), the questions, consent and payload unchanged, the import allow-list, the export list, the source scan (storage, cookies, page and window, network, analytics, payment, logging, clock and randomness, dynamic code), the runtime guard, and this document naming every export.
- Run: `npx vitest run src/utils/healthCheckInsights.test.js src/utils/healthCheckGuards.test.js`, or `npm test` for everything.

## Known limitations

- The engine repeats the scoring thresholds (so scoring stays untouched). The tests compare every tier with the points `scoreHealthCheck` awards, so a drift is caught, but both must be changed together if a threshold ever changes.
- A source scan cannot see indirection or code in another module; that is why it sits beside the import allow-list and the runtime guard. None of this proves that nothing else on the page can read the amounts.
- The golden digest detects any change to the score; it does not prove the score is right (the hand-written cases and the existing scoring tests do that).
- Ratios use take-home income; the runway excludes EMIs (as the score does); the life and health figures are benchmarks and references, not needs.
- Browser support for the display is not part of this PR: the formatters do their own Indian grouping and do not depend on `Intl`.

## For PR-B

- Every figure, alert detail and step param is a number in paise or tenths; the copy turns them into text with the formatters above.
- The D5 wording for the old single `CASH` step has to be replaced by two texts, one per kind (`CASH-ESS`, `CASH-INV`). The `investments` text must present investing as a choice, with the exact amounts from `detail`, and must not call it debt.
- The hide-amounts print mode must build its text from a model that has no rupee amounts in it, not hide text with a stylesheet.
- Call `tryBuildInsights` (or catch `InsightsInputError`) so that an invalid value never blanks the result page.
