import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatRupeesExact } from '../../utils/healthCheckInsights';
import { niceTicks, shortInr, STANDING } from '../../utils/kundli/kundliCharts';
import { CHART_COLORS as C, textOn } from '../../utils/kundli/kundliChartTheme';
import { CHARTS } from '../../utils/kundli/kundliCopy';

/* Shared ------------------------------------------------------------------------------------------------------------ */

/** Width of a container, so SVG text keeps its real size on phones (no scaled-down labels). */
function useWidth(fallback = 640) {
  const ref = useRef(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(260, Math.round(entry.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

const STATUS_UI = {
  good: { label: STANDING.good, color: C.good, tint: C.goodTint, Icon: CheckCircle2 },
  partial: { label: STANDING.partial, color: C.warningText, tint: C.warningTint, Icon: TrendingUp },
  issue: { label: STANDING.issue, color: C.critical, tint: C.criticalTint, Icon: AlertTriangle },
};

function StatusChip({ status }) {
  const s = STATUS_UI[status];
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] font-bold" style={{ color: s.color, borderColor: s.color, background: '#fff' }}>
      <s.Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {s.label}
    </span>
  );
}

/** Every chart's numbers, reachable without hovering (accessibility and colour-independent reading). */
function NumbersTable({ caption, head, rows }) {
  return (
    <details className="kundli-noprint mt-3 text-[13px] text-[#475569]">
      <summary className="inline-flex min-h-[40px] cursor-pointer items-center font-semibold text-[#2F5BC7]">{CHARTS.showNumbers}</summary>
      <div className="mt-2 max-h-72 overflow-auto rounded-xl border border-[#E4E8F0]">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 bg-[#F7F8FB]">
            <tr>
              {head.map((h) => (
                <th key={h} scope="col" className="px-3 py-2 font-semibold text-[#0F1F45]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-[#EEF1F6]">
                {r.map((c, j) => (
                  <td key={j} className={`px-3 py-1.5 ${j > 0 ? 'tabular-nums' : ''}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/* 1. Where you stand ------------------------------------------------------------------------------------------------- */

function zones(row) {
  const [a, b] = row.marks;
  if (row.marks.length === 1) return [{ from: 0, to: a, s: 'issue' }, { from: a, to: row.scaleMax, s: 'good' }];
  return row.higherIsBetter
    ? [{ from: 0, to: a, s: 'issue' }, { from: a, to: b, s: 'partial' }, { from: b, to: row.scaleMax, s: 'good' }]
    : [{ from: 0, to: a, s: 'good' }, { from: a, to: b, s: 'partial' }, { from: b, to: row.scaleMax, s: 'issue' }];
}

function StandingRow({ row, prev }) {
  const pct = (v) => `${(Math.min(v, row.scaleMax) / row.scaleMax) * 100}%`;
  const at = pct(row.value);
  return (
    <li className="py-3.5 first:pt-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[14px] font-semibold text-[#0F1F45]">{row.label}</span>
        <span className="flex items-center gap-2">
          <span className="text-[14px] font-bold tabular-nums text-[#0F1F45]">{row.display}</span>
          <StatusChip status={row.status} />
        </span>
      </div>
      {prev && prev.display !== row.display && (
        <p className="mt-0.5 text-right text-[12px] text-[#5B6B84]">{CHARTS.wasThen(prev.display, STATUS_UI[prev.status].label)}</p>
      )}
      <div className="relative mt-2.5 h-3" role="img" aria-label={`${row.label}: ${row.display}. ${STATUS_UI[row.status].label}. ${CHARTS.referenceAria(row)}`}>
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {zones(row).map((z, i, all) => (
            <span
              key={i}
              className="absolute inset-y-0"
              style={{
                left: `calc(${(z.from / row.scaleMax) * 100}% + ${i === 0 ? 0 : 1}px)`,
                width: `calc(${((z.to - z.from) / row.scaleMax) * 100}% - ${(i === 0 ? 0 : 1) + (i === all.length - 1 ? 0 : 1)}px)`,
                background: STATUS_UI[z.s].tint,
              }}
            />
          ))}
        </div>
        {prev && prev.display !== row.display && (
          <span
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white"
            style={{ left: pct(prev.value), borderColor: C.marker }}
            title={CHARTS.wasThen(prev.display, STATUS_UI[prev.status].label)}
            aria-hidden="true"
          />
        )}
        <span
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_3px_rgba(15,31,69,0.35)]"
          style={{ left: at, background: C.marker }}
          title={`${row.label}: ${row.display}`}
        />
      </div>
      <div className="relative mt-1 h-4 text-[11px] tabular-nums text-[#5B6B84]" aria-hidden="true">
        {row.marks.map((m) => (
          <span key={m} className="absolute -translate-x-1/2" style={{ left: pct(m) }}>
            {row.unit === 'lakh' ? `₹${m} L` : `${m}${row.unit === 'months' ? ' mo' : row.unit}`}
          </span>
        ))}
        {row.beyondScale && <span className="absolute right-0">{CHARTS.beyond}</span>}
      </div>
    </li>
  );
}

export function StandingChart({ rows, prev, prevDate }) {
  if (!rows?.length) return null;
  const counts = { good: 0, partial: 0, issue: 0 };
  rows.forEach((r) => {
    counts[r.status] += 1;
  });
  return (
    <section aria-labelledby="kundli-standing" className="kundli-card rounded-2xl border border-[#E4E8F0] bg-white p-5 sm:p-6">
      <h2 id="kundli-standing" className="font-serif-luxury text-[20px] font-bold text-[#0F1F45]">
        {CHARTS.standingTitle}
      </h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-[#5B6B84]">{CHARTS.standingNote}</p>
      {prev && (
        <p className="mt-2 flex items-center gap-2 text-[12.5px] text-[#475569]">
          <span className="inline-block h-3 w-3 rounded-full border-2 bg-white" style={{ borderColor: C.marker }} aria-hidden="true" />
          {CHARTS.thenKey(prevDate)}
          <span className="ml-2 inline-block h-3 w-3 rounded-full" style={{ background: C.marker }} aria-hidden="true" />
          {CHARTS.nowKey}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {['good', 'partial', 'issue'].map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold text-[#0F1F45]" style={{ background: STATUS_UI[s].tint }}>
            {React.createElement(STATUS_UI[s].Icon, { className: 'h-3.5 w-3.5', 'aria-hidden': true, style: { color: STATUS_UI[s].color } })}
            {STATUS_UI[s].label}: {counts[s]}
          </span>
        ))}
      </div>
      <ul className="mt-4 divide-y divide-[#EEF1F6]">
        {rows.map((r) => (
          <StandingRow key={r.id} row={r} prev={prev?.[r.id]} />
        ))}
      </ul>
      <NumbersTable
        caption={CHARTS.standingTitle}
        head={prev ? ['Area', 'Then', 'Now', 'Reference levels', 'Status now'] : ['Area', 'Your figure', 'Reference levels', 'Status']}
        rows={rows.map((r) => [
          r.label,
          ...(prev ? [prev[r.id] ? `${prev[r.id].display} (${STATUS_UI[prev[r.id].status].label})` : '—'] : []),
          r.display,
          r.marks.map((m) => (r.unit === 'lakh' ? `₹${m} lakh` : `${m}${r.unit === 'months' ? ' months' : r.unit}`)).join(' and '),
          STATUS_UI[r.status].label,
        ])}
      />
    </section>
  );
}

/* 2. Segmented bars (cash flow, assets) ------------------------------------------------------------------------------ */

function SegmentedBar({ title, parts, colorFor, ariaLabel, marker, note }) {
  return (
    <figure className="mt-4">
      <figcaption className="text-[13.5px] font-semibold text-[#0F1F45]">{title}</figcaption>
      <div className="relative mt-2">
        <div className="flex h-7 w-full gap-[2px]" role="img" aria-label={ariaLabel}>
          {parts.map((p) => {
            const w = p.share * 100;
            return (
              <span
                key={p.id}
                className="flex h-full items-center overflow-visible rounded-[4px] pl-1.5 text-[11.5px] font-bold"
                style={{ width: `${w}%`, background: colorFor(p.id), color: textOn(colorFor(p.id)) }}
                title={`${p.label}: ${formatRupeesExact(p.paise)} (${(p.share * 100).toFixed(1)}%)`}
              >
                {w >= 9 ? `${Math.floor(p.share * 100)}%` : ''}
              </span>
            );
          })}
        </div>
        {marker && (
          <span className="absolute -top-1 bottom-[-4px] w-[2px] bg-[#0F1F45]" style={{ left: `${marker.at * 100}%` }} aria-hidden="true">
            <span className="absolute left-1 top-full mt-0.5 whitespace-nowrap text-[11px] font-semibold text-[#0F1F45]">{marker.label}</span>
          </span>
        )}
      </div>
      <ul className={`${marker ? 'mt-6' : 'mt-3'} grid gap-x-4 gap-y-1.5 text-[12.5px] text-[#475569] sm:grid-cols-2`}>
        {parts.map((p) => (
          <li key={p.id} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: colorFor(p.id) }} aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">{p.label}</span>
            <span className="font-semibold tabular-nums text-[#0F1F45]">{shortInr(p.paise / 100)}</span>
          </li>
        ))}
      </ul>
      {note && <p className="mt-2 text-[12.5px] font-semibold text-[#0F1F45]">{note}</p>}
    </figure>
  );
}

export function CashFlowChart({ data }) {
  if (!data || data.parts.length === 0) return null;
  const parts = data.parts.map((p) => ({ ...p, share: p.shareOfTotal }));
  const over = data.overByPaise > 0;
  return (
    <div>
      <SegmentedBar
        title={CHARTS.cashFlowTitle}
        parts={parts}
        colorFor={(id) => C.cash[id]}
        ariaLabel={`${CHARTS.cashFlowTitle}: ${parts.map((p) => `${p.label} ${formatRupeesExact(p.paise)}`).join(', ')}`}
        marker={over ? { at: data.incomePaise / data.totalPaise, label: CHARTS.incomeMarker } : null}
        note={over ? CHARTS.overIncome(formatRupeesExact(data.overByPaise)) : !data.otherKnown ? CHARTS.otherMissing : null}
      />
      <NumbersTable
        caption={CHARTS.cashFlowTitle}
        head={['Part', 'Amount', 'Share of income']}
        rows={[...data.parts.map((p) => [p.label, formatRupeesExact(p.paise), `${(p.pctOfIncomeTenths / 10).toFixed(1)}%`]), ['Monthly in-hand income', formatRupeesExact(data.incomePaise), '100.0%']]}
      />
    </div>
  );
}

export function AssetsChart({ data }) {
  if (!data || data.parts.length === 0) return null;
  const max = Math.max(data.assetsPaise, data.liabilitiesPaise || 0, 1);
  return (
    <div>
      <SegmentedBar
        title={CHARTS.assetsTitle}
        parts={data.parts}
        colorFor={(id) => C.assets[id]}
        ariaLabel={`${CHARTS.assetsTitle}: ${data.parts.map((p) => `${p.label} ${formatRupeesExact(p.paise)}`).join(', ')}`}
      />
      {data.liabilitiesPaise !== null && (
        <figure className="mt-5">
          <figcaption className="text-[13.5px] font-semibold text-[#0F1F45]">{CHARTS.ownVsOwe}</figcaption>
          {[
            { label: 'What you own (known)', paise: data.assetsPaise, color: C.own },
            { label: 'What you owe (known)', paise: data.liabilitiesPaise, color: C.owe },
          ].map((b) => (
            <div key={b.label} className="mt-2 grid grid-cols-[minmax(0,130px)_1fr] items-center gap-3 sm:grid-cols-[170px_1fr]">
              <span className="text-[12.5px] text-[#475569]">{b.label}</span>
              <div className="flex items-center gap-2">
                <span className="h-5 rounded-r-[4px]" style={{ width: `${Math.max((b.paise / max) * 100, b.paise > 0 ? 0.5 : 0)}%`, background: b.color }} title={`${b.label}: ${formatRupeesExact(b.paise)}`} />
                <span className="whitespace-nowrap text-[12.5px] font-semibold tabular-nums text-[#0F1F45]">{shortInr(b.paise / 100)}</span>
              </div>
            </div>
          ))}
        </figure>
      )}
      <NumbersTable
        caption={CHARTS.assetsTitle}
        head={['Item', 'Amount', 'Share of known assets']}
        rows={[
          ...data.parts.map((p) => [`${p.label}${p.estimate ? ' (your estimate)' : ''}`, formatRupeesExact(p.paise), `${(p.share * 100).toFixed(1)}%`]),
          ['Known assets', formatRupeesExact(data.assetsPaise), '100.0%'],
          ...(data.liabilitiesPaise !== null ? [['Known liabilities', formatRupeesExact(data.liabilitiesPaise), '']] : []),
        ]}
      />
    </div>
  );
}

/* 3. Line charts (goals, retirement) ---------------------------------------------------------------------------------- */

/**
 * A small line chart: one shared x axis, one y axis in ₹, a crosshair + tooltip that follows the pointer (or the arrow keys),
 * a legend with line keys, and the numbers table. Values below zero by float noise only are drawn at zero.
 */
export function LineChart({ title, xLabel, xFormat, series, xs, vline, endNote, tableHead, tableRows, yFormat = shortInr, yTop, height: chartHeight = 250 }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const height = chartHeight;
  const pad = { l: 64, r: 22, t: 14, b: 44 };
  const plotW = Math.max(120, width - pad.l - pad.r);
  const plotH = height - pad.t - pad.b;
  const clean = (v) => (v === null || v === undefined ? null : Math.abs(v) < 0.5 ? 0 : v);
  const has = (v) => v !== null && v !== undefined;
  const maxY = Math.max(1, ...series.flatMap((s) => s.values.filter(has).map(clean)));
  const ticks = yTop ? niceTicks(yTop) : niceTicks(maxY);
  const top = ticks[ticks.length - 1];
  const x0 = xs[0];
  const x1 = xs[xs.length - 1];
  const X = (x) => pad.l + (x1 === x0 ? 0 : ((x - x0) / (x1 - x0)) * plotW);
  const Y = (v) => pad.t + plotH - (Math.max(0, clean(v)) / top) * plotH;
  // A missing value (null) breaks the line instead of being drawn as zero
  const path = (vals) => {
    let d = '';
    let pen = false;
    vals.forEach((v, i) => {
      if (!has(v)) {
        pen = false;
        return;
      }
      d += `${pen ? 'L' : 'M'}${X(xs[i]).toFixed(1)},${Y(v).toFixed(1)} `;
      pen = true;
    });
    return d.trim();
  };
  const xTickEvery = Math.max(1, Math.ceil(xs.length / Math.max(2, Math.floor(plotW / 56))));
  const pick = (clientX, rect) => {
    const px = clientX - rect.left - pad.l;
    const i = Math.round((px / plotW) * (xs.length - 1));
    return Math.max(0, Math.min(xs.length - 1, i));
  };
  // The tooltip opens on the side away from the pointer, so it never covers the point being read
  const TIP_W = 210;
  const tipLeft = hover === null ? 0 : X(xs[hover]) > width / 2 ? Math.max(0, X(xs[hover]) - TIP_W - 12) : Math.min(width - TIP_W, X(xs[hover]) + 12);

  return (
    <figure className="mt-4">
      <figcaption className="text-[13.5px] font-semibold text-[#0F1F45]">{title}</figcaption>
      {series.length > 1 && (
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[#475569]">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span className="h-[3px] w-4 rounded-full" style={{ background: s.color }} aria-hidden="true" />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <div ref={ref} className="relative mt-2 w-full">
        <svg
          width={width}
          height={height}
          className="block max-w-full touch-none outline-none focus-visible:ring-2 focus-visible:ring-[#2F5BC7]/40"
          role="img"
          aria-label={`${title}. ${endNote || ''}`}
          tabIndex={0}
          onPointerMove={(e) => setHover(pick(e.clientX, e.currentTarget.getBoundingClientRect()))}
          onPointerLeave={() => setHover(null)}
          onFocus={() => setHover(xs.length - 1)}
          onBlur={() => setHover(null)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setHover((h) => Math.max(0, (h ?? xs.length - 1) - 1));
            if (e.key === 'ArrowRight') setHover((h) => Math.min(xs.length - 1, (h ?? 0) + 1));
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={pad.l + plotW} y1={Y(t)} y2={Y(t)} stroke={C.grid} strokeWidth="1" />
              <text x={pad.l - 8} y={Y(t) + 4} textAnchor="end" fontSize="11" fill={C.axisText}>
                {yFormat(t)}
              </text>
            </g>
          ))}
          {xs.map((x, i) =>
            i === xs.length - 1 || (i % xTickEvery === 0 && X(xs[xs.length - 1]) - X(x) >= 52) ? (
              <text key={x} x={X(x)} y={height - 24} textAnchor={i === 0 ? 'start' : i === xs.length - 1 ? 'end' : 'middle'} fontSize="11" fill={C.axisText}>
                {xFormat(x)}
              </text>
            ) : null,
          )}
          <text x={pad.l + plotW / 2} y={height - 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={C.axisText}>
            {xLabel}
          </text>
          {vline && (
            <g>
              <rect x={X(vline.x)} y={pad.t} width={Math.max(0, pad.l + plotW - X(vline.x))} height={plotH} fill={C.phaseTint} />
              <line x1={X(vline.x)} x2={X(vline.x)} y1={pad.t} y2={pad.t + plotH} stroke={C.axisText} strokeWidth="1" />
              <text x={X(vline.x) + 4} y={pad.t + 12} fontSize="11" fill={C.axisText}>
                {vline.label}
              </text>
            </g>
          )}
          {series.map((s) => (
            <path key={s.key} d={path(s.values)} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {series.map((s) =>
            s.values.map((v, i) =>
              has(v) && (i === s.values.length - 1 || xs.length <= 12) ? <circle key={`${s.key}-${i}`} cx={X(xs[i])} cy={Y(v)} r="4.5" fill={s.color} stroke="#fff" strokeWidth="2" /> : null,
            ),
          )}
          {hover !== null && (
            <g className="kundli-noprint">
              <line x1={X(xs[hover])} x2={X(xs[hover])} y1={pad.t} y2={pad.t + plotH} stroke={C.marker} strokeWidth="1" />
              {series.map((s) =>
                has(s.values[hover]) ? <circle key={s.key} cx={X(xs[hover])} cy={Y(s.values[hover])} r="5.5" fill={s.color} stroke="#fff" strokeWidth="2" /> : null,
              )}
            </g>
          )}
        </svg>
        {hover !== null && (
          <div className="kundli-noprint pointer-events-none absolute top-2 z-10 rounded-lg border border-[#E4E8F0] bg-white px-3 py-2 text-[12px] shadow-[0_8px_20px_rgba(15,31,69,0.15)]" style={{ left: tipLeft, width: TIP_W }} aria-live="polite">
            <p className="font-semibold text-[#5B6B84]">{xFormat(xs[hover])}</p>
            {series.map((s) => (
              <div key={s.key} className="mt-1.5 flex items-start gap-2">
                <span className="mt-[7px] h-[3px] w-3 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="whitespace-nowrap text-[13.5px] font-bold text-[#0F1F45]">{has(s.values[hover]) ? yFormat(clean(s.values[hover])) : '—'}</p>
                  <p className="text-[11.5px] leading-snug text-[#5B6B84]">{s.short || s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {endNote && <p className="mt-1 text-[12.5px] leading-relaxed text-[#475569]">{endNote}</p>}
      <NumbersTable caption={title} head={tableHead} rows={tableRows} />
    </figure>
  );
}

export function GoalChart({ path, title }) {
  if (!path) return null;
  const xs = path.points.map((p) => p.x);
  const last = path.points[path.points.length - 1];
  return (
    <LineChart
      title={CHARTS.goalTitle(title)}
      xLabel={CHARTS.yearsFromNow}
      xFormat={(x) => (x === 0 ? 'Now' : `Yr ${x}`)}
      xs={xs}
      series={[
        { key: 'cost', label: CHARTS.goalCost, short: 'goal cost', color: C.line2, values: path.points.map((p) => p.cost) },
        { key: 'money', label: CHARTS.goalMoney, short: 'your money', color: C.line1, values: path.points.map((p) => p.money) },
      ]}
      endNote={path.covered ? CHARTS.goalCoveredNote(shortInr(last.money), shortInr(last.cost)) : CHARTS.goalMeetsNote(path.years, shortInr(last.cost))}
      tableHead={['Year', 'Goal cost', 'Your money']}
      tableRows={path.points.map((p) => [p.x === 0 ? 'Now' : `Year ${p.x}`, shortInr(p.cost), shortInr(Math.max(0, p.money))])}
    />
  );
}

export function RetirementChart({ path }) {
  if (!path) return null;
  const xs = path.points.map((p) => p.x);
  const end = path.points[path.points.length - 1];
  return (
    <LineChart
      title={CHARTS.retTitle}
      xLabel={CHARTS.age}
      xFormat={(x) => `Age ${x}`}
      xs={xs}
      vline={{ x: path.retireAge, label: CHARTS.retireLabel(path.retireAge) }}
      series={[{ key: 'money', label: CHARTS.retMoney, short: 'retirement money', color: C.line1, values: path.points.map((p) => p.money) }]}
      endNote={path.covered ? CHARTS.retCoveredNote(shortInr(Math.max(0, end.money)), end.x) : CHARTS.retNote(shortInr(path.corpus), path.retireAge, end.x)}
      tableHead={['Age', 'Retirement money', 'Stage']}
      tableRows={path.points.map((p) => [`Age ${p.x}`, shortInr(Math.max(0, Math.abs(p.money) < 0.5 ? 0 : p.money)), p.phase === 'build' ? 'Building up' : 'Paying spending'])}
    />
  );
}
