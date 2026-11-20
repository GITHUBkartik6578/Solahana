import React from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { formatRupeesExact } from '../../utils/healthCheckInsights';
import { GROWTH } from '../../utils/kundli/kundliCopy';
import { CHART_COLORS as C } from '../../utils/kundli/kundliChartTheme';
import { shortDate } from '../../utils/kundli/kundliDates';
import { LineChart } from './KundliCharts';

// A negative net worth is said in words, never as a minus sign
const money = (paise) => (paise === null ? GROWTH.notAvailable : paise < 0 ? `${formatRupeesExact(-paise)} more owed than owned` : formatRupeesExact(paise));

function Delta({ now, prev, kind, prevDate }) {
  if (now === null || prev === null || prev === undefined) return null;
  const diff = now - prev;
  // For every tile here, up is the good direction
  const dir = diff > 0 ? 'up' : diff < 0 ? 'down' : 'same';
  const ui = {
    up: { Icon: TrendingUp, color: C.good, word: GROWTH.up },
    down: { Icon: TrendingDown, color: C.critical, word: GROWTH.down },
    same: { Icon: Minus, color: C.axisText, word: GROWTH.same },
  }[dir];
  const amount = kind === 'score' ? GROWTH.points(Math.abs(diff)) : formatRupeesExact(Math.abs(diff));
  return (
    <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[12.5px] font-semibold" style={{ color: ui.color }}>
      <ui.Icon className="h-4 w-4" aria-hidden="true" />
      <span>
        {ui.word}
        {dir !== 'same' && ` ${amount}`}
      </span>
      <span className="font-normal text-[#5B6B84]">{GROWTH.since(prevDate)}</span>
    </p>
  );
}

/** Four headline tiles. With an earlier Kundli each also shows the change since then (icon + word + amount, never colour alone). */
export function AtAGlance({ now, prev }) {
  const nwKnown = now.netWorth !== null;
  const tiles = [
    { key: 'score', label: GROWTH.score, value: now.score === null ? GROWTH.notAvailable : `${now.score} / 100`, now: now.score, prev: prev?.score, kind: 'score' },
    nwKnown
      ? { key: 'nw', label: GROWTH.netWorth, value: money(now.netWorth), now: now.netWorth, prev: prev?.netWorth }
      : { key: 'ka', label: GROWTH.knownAssets, value: money(now.knownAssets), now: now.knownAssets, prev: prev?.knownAssets },
    { key: 'sav', label: GROWTH.savings, value: money(now.monthlySavings), now: now.monthlySavings, prev: prev?.monthlySavings },
    { key: 'inv', label: GROWTH.investing, value: money(now.monthlyInvesting), now: now.monthlyInvesting, prev: prev?.monthlyInvesting },
  ];
  return (
    <section aria-labelledby="kundli-glance" className="kundli-card">
      <h2 id="kundli-glance" className="sr-only">
        {GROWTH.glanceTitle}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.key} className="rounded-2xl border border-[#E4E8F0] bg-white px-4 py-4">
            <p className="text-[12.5px] font-semibold text-[#5B6B84]">{t.label}</p>
            <p className="mt-1 text-[22px] font-bold leading-tight text-[#0F1F45]">{t.value}</p>
            {prev && <Delta now={t.now} prev={t.prev} kind={t.kind} prevDate={shortDate(prev.date)} />}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Then-and-now charts, shown once there is at least one earlier Kundli from the customer's file. */
export function ProgressCharts({ series }) {
  if (!series || series.length < 2) return null;
  const xs = series.map((_, i) => i);
  const fmt = (i) => shortDate(series[i].date);
  const rupees = (p) => (p === null ? null : p / 100);
  const anyMoney = series.some((s) => s.knownAssets !== null || s.knownLiabilities !== null);
  return (
    <section aria-labelledby="kundli-progress" className="kundli-card rounded-2xl border border-[#E4E8F0] bg-white p-5 sm:p-6">
      <h2 id="kundli-progress" className="font-serif-luxury text-[20px] font-bold text-[#0F1F45]">
        {GROWTH.progressTitle}
      </h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-[#5B6B84]">{GROWTH.progressNote(series.length - 1, fmt(0))}</p>
      <div className="grid gap-x-8 lg:grid-cols-2">
        <LineChart
          title={GROWTH.scoreTrend}
          xLabel="Kundli date"
          xFormat={fmt}
          xs={xs}
          yTop={100}
          yFormat={(t) => String(Math.round(t))}
          height={230}
          series={[{ key: 'score', label: GROWTH.seriesScore, short: 'score', color: C.line1, values: series.map((s) => s.score) }]}
          tableHead={['Date', GROWTH.seriesScore]}
          tableRows={series.map((s) => [shortDate(s.date), s.score === null ? GROWTH.notAvailable : `${s.score} / 100`])}
        />
        {anyMoney && (
          <LineChart
            title={GROWTH.moneyTrend}
            xLabel="Kundli date"
            xFormat={fmt}
            xs={xs}
            height={230}
            series={[
              { key: 'assets', label: GROWTH.seriesAssets, short: 'known assets', color: C.trend.assets, values: series.map((s) => rupees(s.knownAssets)) },
              { key: 'liab', label: GROWTH.seriesLiabilities, short: 'known liabilities', color: C.trend.liabilities, values: series.map((s) => rupees(s.knownLiabilities)) },
              { key: 'nw', label: GROWTH.seriesNetWorth, short: 'net worth', color: C.trend.netWorth, values: series.map((s) => (s.netWorth === null || s.netWorth < 0 ? null : rupees(s.netWorth))) },
            ]}
            tableHead={['Date', GROWTH.seriesAssets, GROWTH.seriesLiabilities, GROWTH.seriesNetWorth]}
            tableRows={series.map((s) => [shortDate(s.date), money(s.knownAssets), money(s.knownLiabilities), s.netWorth === null ? GROWTH.notAvailable : money(s.netWorth)])}
          />
        )}
      </div>
    </section>
  );
}
