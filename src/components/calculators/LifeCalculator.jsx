import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hourglass, CalendarDays, RotateCcw, Calculator, Info, AlertCircle, Sparkles } from 'lucide-react';
import CalculatorLayout from './CalculatorLayout';
import {
  calculateLife,
  localToday,
  toInputDate,
  validateBirthDate,
  MIN_BIRTH_YEAR,
} from '../../utils/lifeCalculator';

const GENDERS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'unspecified', label: 'Prefer not to say' },
];

const fmt = (n) => Math.round(n).toLocaleString('en-IN');

const DISCLAIMER =
  "This calculator provides a statistical estimate for educational and entertainment purposes only. It cannot predict an individual's actual lifespan.";

function StatCard({ label, value, hint, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-2xl p-5 border bg-white border-[#E4E8F0] text-[#0F1F45] shadow-[0_8px_24px_rgba(15,31,69,0.06)]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
      <p className="mt-2 font-serif-luxury text-3xl sm:text-4xl font-bold tabular-nums leading-none">{value}</p>
      {hint && <p className="mt-2 text-xs text-[#64748B]">{hint}</p>}
    </motion.div>
  );
}

/** Life in weeks: one dot per week, one row per year. Lived = navy, this week = gold, ahead = soft blue. */
function WeeksGrid({ grid }) {
  const cells = useMemo(
    () =>
      Array.from({ length: grid.total }, (_, i) => {
        if (i < grid.lived - 1) return 'lived';
        if (i === grid.lived - 1) return 'now';
        return 'ahead';
      }),
    [grid.total, grid.lived]
  );
  const cls = {
    lived: 'bg-[#1A3170]',
    now: 'bg-[#C9922E] ring-2 ring-[#C9922E]/40 scale-125',
    ahead: 'bg-[#DCE6F6]',
  };
  return (
    <div
      role="img"
      aria-label={`Life in weeks: about ${fmt(grid.lived)} of ${fmt(grid.total)} estimated weeks have passed.`}
      className="grid gap-[2px] sm:gap-[3px]"
      style={{ gridTemplateColumns: `repeat(${grid.perRow}, minmax(0, 1fr))` }}
    >
      {cells.map((state, i) => (
        <span key={i} className={`aspect-square rounded-[2px] ${cls[state]}`} />
      ))}
    </div>
  );
}

export default function LifeCalculator() {
  const maxDate = toInputDate(localToday());

  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('unspecified');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e?.preventDefault();
    const message = validateBirthDate(dob, localToday());
    if (message) {
      setError(message);
      setResult(null);
      return;
    }
    setError('');
    setResult(calculateLife(dob, gender, localToday()));
  };

  const handleReset = () => {
    setDob('');
    setGender('unspecified');
    setError('');
    setResult(null);
  };

  const pct = result ? Math.round(result.progress * 1000) / 10 : 0;

  return (
    <CalculatorLayout
      title="Human Life Calculator"
      subtitle="See how much time you have lived so far, in years, months, weeks and days, alongside a gentle statistical estimate of what may lie ahead."
      icon={Hourglass}
      onReset={handleReset}
      hideSave
    >
      <div className="space-y-8 text-left">
        {/* Input card */}
        <form
          onSubmit={handleCalculate}
          noValidate
          className="rounded-3xl bg-white border border-[#E4E8F0] shadow-[0_12px_32px_rgba(15,31,69,0.07)] p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 border-b border-[#E4E8F0] pb-4">
            <CalendarDays className="w-5 h-5 text-[#2F5BC7]" />
            <h3 className="font-serif-luxury text-lg font-bold text-[#0F1F45]">Tell us a little about you</h3>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="life-dob" className="block text-sm font-semibold text-[#0F1F45]">
                Date of birth
              </label>
              <input
                id="life-dob"
                type="date"
                value={dob}
                min={`${MIN_BIRTH_YEAR}-01-01`}
                max={maxDate}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (error) setError('');
                }}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'life-dob-error' : undefined}
                className={`mt-2 w-full rounded-xl border bg-[#F7F8FB] px-4 py-3 text-base text-[#0F1F45] focus:outline-none focus:ring-2 focus:ring-[#2F5BC7]/30 ${
                  error ? 'border-red-400' : 'border-[#E4E8F0] focus:border-[#2F5BC7]'
                }`}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    id="life-dob-error"
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 flex items-start gap-1.5 text-sm text-red-600"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <fieldset>
              <legend className="block text-sm font-semibold text-[#0F1F45]">
                Gender <span className="font-normal text-[#64748B]">(optional)</span>
              </legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <label
                    key={g.id}
                    className={`cursor-pointer rounded-xl border px-2 py-3 text-center text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#2F5BC7]/40 ${
                      gender === g.id
                        ? 'bg-[#0F1F45] border-[#0F1F45] text-white'
                        : 'bg-[#F7F8FB] border-[#E4E8F0] text-[#334155] hover:border-[#2F5BC7]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="life-gender"
                      value={g.id}
                      checked={gender === g.id}
                      onChange={() => setGender(g.id)}
                      className="sr-only"
                    />
                    {g.label}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-[#64748B]">Only used to pick a statistical average. Nothing is stored or sent anywhere.</p>
            </fieldset>
          </div>

          <div className="mt-7 flex flex-col-reverse sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2F5BC7]/40 px-6 py-3 text-sm font-semibold text-[#0F1F45] hover:bg-[#F7F8FB] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F1F45] px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_26px_rgba(15,31,69,0.3)] hover:shadow-[0_14px_34px_rgba(15,31,69,0.42)] transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              Calculate
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={`${dob}-${gender}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
              aria-live="polite"
            >
              {/* 1. Actual age: exact calendar facts */}
              <section aria-labelledby="life-age-h" className="space-y-4">
                <div>
                  <h3 id="life-age-h" className="font-serif-luxury text-xl font-bold text-[#0F1F45]">
                    Your age, exactly
                  </h3>
                  <p className="text-sm text-[#64748B]">Worked out from today&apos;s date on your device. These numbers are exact.</p>
                </div>

                <div className="rounded-3xl bg-[#0F1F45] text-white p-6 sm:p-8 shadow-[0_18px_44px_rgba(15,31,69,0.25)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E6C27A]">Current age</p>
                  <p className="mt-3 font-serif-luxury font-bold leading-tight text-[clamp(26px,6vw,46px)]">
                    {result.age.years} <span className="text-[0.55em] font-semibold text-[#AEBBD3]">years</span>{' '}
                    {result.age.months} <span className="text-[0.55em] font-semibold text-[#AEBBD3]">months</span>{' '}
                    {result.age.days} <span className="text-[0.55em] font-semibold text-[#AEBBD3]">days</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard index={1} label="Days lived" value={fmt(result.daysLived)} />
                  <StatCard index={2} label="Weeks lived" value={fmt(result.weeksLived)} />
                  <StatCard index={3} label="Months lived" value={fmt(result.monthsLived)} />
                </div>
              </section>

              {/* 2. Statistical estimate: clearly separated from the facts above */}
              <section aria-labelledby="life-est-h" className="space-y-4">
                <div>
                  <h3 id="life-est-h" className="font-serif-luxury text-xl font-bold text-[#0F1F45] flex flex-wrap items-center gap-2">
                    A statistical estimate
                    <span className="rounded-full bg-[#EEF2FB] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#2F5BC7]">
                      Not a prediction
                    </span>
                  </h3>
                  <p className="text-sm text-[#64748B]">
                    Based on an average life expectancy of about {result.expectancyYears} years (a rounded national average for India). Real lives vary widely, and health,
                    habits and circumstances all matter.
                  </p>
                </div>

                {result.pastAverage ? (
                  <div className="rounded-2xl bg-[#FFF8E8] border border-[#F0DDB0] p-5 flex gap-3">
                    <Sparkles className="w-5 h-5 text-[#C9922E] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#5B4A1E]">
                      You have already passed the statistical average of {result.expectancyYears} years. Averages say little about any one person, so there is no meaningful
                      estimate of time remaining. Every additional day is a good one.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard index={1} label="Years remaining" value={`~${result.yearsRemaining.toFixed(1)}`} hint="estimated" />
                    <StatCard index={2} label="Months remaining" value={`~${fmt(result.monthsRemaining)}`} hint="estimated" />
                    <StatCard index={3} label="Weeks remaining" value={`~${fmt(result.weeksRemaining)}`} hint="estimated" />
                    <StatCard index={4} label="Days remaining" value={`~${fmt(result.daysRemaining)}`} hint="estimated" />
                  </div>
                )}

                {/* Progress bar */}
                <div className="rounded-3xl bg-white border border-[#E4E8F0] p-6 shadow-[0_8px_24px_rgba(15,31,69,0.06)]">
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-sm font-semibold text-[#0F1F45]">Life progress</p>
                    <p className="font-serif-luxury text-2xl font-bold text-[#1A3170] tabular-nums">{pct}%</p>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                    aria-label="Share of the estimated average lifespan that has passed"
                    className="mt-3 h-4 w-full overflow-hidden rounded-full bg-[#E8EEF9]"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#1A3170] to-[#2F5BC7]"
                    />
                  </div>
                  <p className="mt-3 text-xs text-[#64748B]">
                    Roughly this share of an average {result.expectancyYears}-year lifespan has passed. It is a way to think about time, not a countdown.
                  </p>
                </div>
              </section>

              {/* 3. Life in weeks */}
              <section aria-labelledby="life-weeks-h" className="space-y-4">
                <div>
                  <h3 id="life-weeks-h" className="font-serif-luxury text-xl font-bold text-[#0F1F45]">
                    Your life in weeks
                  </h3>
                  <p className="text-sm text-[#64748B]">Each dot is one week and each row is one year. A small reminder that time is worth planning well.</p>
                </div>

                <div className="rounded-3xl bg-white border border-[#E4E8F0] p-4 sm:p-6 shadow-[0_8px_24px_rgba(15,31,69,0.06)]">
                  <WeeksGrid grid={result.grid} />
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#475569]">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-[3px] bg-[#1A3170]" /> Weeks lived
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-[3px] bg-[#C9922E]" /> This week
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-[3px] bg-[#DCE6F6]" /> Estimated weeks ahead
                    </span>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer: always visible */}
        <div className="flex gap-3 rounded-2xl border border-[#E4E8F0] bg-[#F7F8FB] p-4 sm:p-5">
          <Info className="w-5 h-5 text-[#2F5BC7] shrink-0 mt-0.5" />
          <p className="text-sm text-[#475569] leading-relaxed">
            <strong className="text-[#0F1F45]">Disclaimer: </strong>
            {DISCLAIMER}
          </p>
        </div>
        <p className="text-xs text-[#64748B]">Your date of birth stays on your device. It is not saved, stored or sent to any server.</p>
      </div>
    </CalculatorLayout>
  );
}
