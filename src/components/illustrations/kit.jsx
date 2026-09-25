import React, { createContext, useContext, useId } from 'react';

/*
 * Solahana "Clean Blue" illustration kit.
 * Every spot illustration is a small product-style vignette on a 400×280 canvas:
 * soft blue backdrop + one white main card + at most one or two floating cards.
 * No invented figures — labels only, so nothing reads as a promise of returns.
 */

export const C = {
  blue: '#2F5BC7',
  blueDark: '#1A3170',
  blueMid: '#7FA6F0',
  blueLight: '#BFD3F8',
  tint: '#EEF2FB',
  ink: '#0F1F45',
  body: '#475569',
  muted: '#8A96AB',
  line: '#E4E8F0',
  track: '#EEF2F8',
  gold: '#C89B3C',
  goldLight: '#F2D78C',
  green: '#16A34A',
  amber: '#D97706',
  skin: '#F2C99A',
  white: '#FFFFFF',
};

const ShadowCtx = createContext('none');
const FONT = 'Sora, Manrope, sans-serif';

export function Frame({ children, title }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 400 280" className="w-full h-full select-none" fill="none" role="img" aria-label={title}>
      <defs>
        <filter id={`sh${id}`} x="-25%" y="-25%" width="150%" height="170%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0F1F45" floodOpacity="0.09" />
        </filter>
        <linearGradient id={`area${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.blue} stopOpacity="0.22" />
          <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
        </linearGradient>
      </defs>
      <ShadowCtx.Provider value={id}>{children}</ShadowCtx.Provider>
    </svg>
  );
}

export const useKitId = () => useContext(ShadowCtx);

export function Backdrop({ cx = 200, cy = 145, r = 118 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.tint} />
      <circle cx={cx + r * 0.72} cy={cy - r * 0.78} r={r * 0.1} fill={C.blueLight} opacity="0.6" />
      <circle cx={cx - r * 0.9} cy={cy + r * 0.62} r={r * 0.06} fill={C.blueLight} opacity="0.8" />
    </g>
  );
}

export function Card({ x, y, w, h, r = 16, children }) {
  const id = useKitId();
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={C.white} stroke={C.line} strokeWidth="1.2" filter={`url(#sh${id})`} />
      {children}
    </g>
  );
}

export function T({ x, y, s = 12, w = 600, c = C.ink, a = 'start', children, ls }) {
  return (
    <text x={x} y={y} fontSize={s} fontWeight={w} fill={c} textAnchor={a} fontFamily={FONT} letterSpacing={ls}>
      {children}
    </text>
  );
}

/** Rounded progress / comparison bar */
export function Bar({ x, y, w, h = 8, pct = 0.6, color = C.blue, track = C.track }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={track} />
      <rect x={x} y={y} width={Math.max(h, w * pct)} height={h} rx={h / 2} fill={color} />
    </g>
  );
}

/** Status tick: done = filled blue, started = blue ring, todo = grey ring */
export function Tick({ cx, cy, r = 9, state = 'done' }) {
  if (state === 'done') {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill={C.blue} />
        <path d={`M${cx - r * 0.42} ${cy} l${r * 0.3} ${r * 0.32} l${r * 0.55} -${r * 0.62}`} stroke={C.white} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={r - 1} stroke={state === 'started' ? C.blue : C.line} strokeWidth="2" fill={C.white} />;
}

export function Pill({ x, y, w, label, tone = 'blue' }) {
  const tones = {
    blue: [C.tint, C.blue],
    grey: [C.track, C.muted],
    green: ['#E7F6EC', C.green],
    amber: ['#FDF1E2', C.amber],
  };
  const [bg, fg] = tones[tone];
  return (
    <g>
      <rect x={x} y={y - 11} width={w} height={18} rx={9} fill={bg} />
      <T x={x + w / 2} y={y + 2} s={9} w={700} c={fg} a="middle">{label}</T>
    </g>
  );
}

/* Minimal line icons on a 24px grid (paths adapted from the MIT-licensed Lucide set) */
const ICONS = {
  home: ['m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  cap: ['M22 10 12 5 2 10l10 5 10-5z', 'M6 12v5c3 2 9 2 12 0v-5'],
  heart: ['M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z'],
  shield: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'm9 12 2 2 4-4'],
  sun: ['M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M12 2v2', 'M12 20v2', 'm4.9 4.9 1.4 1.4', 'm17.7 17.7 1.4 1.4', 'M2 12h2', 'M20 12h2', 'm4.9 19.1 1.4-1.4', 'm17.7 6.3 1.4-1.4'],
  repeat: ['m17 2 4 4-4 4', 'M3 11v-1a4 4 0 0 1 4-4h14', 'm7 22-4-4 4-4', 'M21 13v1a4 4 0 0 1-4 4H3'],
  doc: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h5'],
  flag: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22v-7'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 6v6l4 2'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.9', 'M16 3.1a4 4 0 0 1 0 7.8'],
  refresh: ['M3 12a9 9 0 0 1 15-6.7L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-15 6.7L3 16', 'M8 16H3v5'],
  trend: ['M22 7 13.5 15.5 8.5 10.5 2 17', 'M16 7h6v6'],
  scale: ['m16 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1z', 'm2 16 3-8 3 8c-.9.7-1.9 1-3 1s-2.1-.3-3-1z', 'M7 21h10', 'M12 3v18', 'M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2'],
};

export function Icon({ name, cx, cy, size = 16, color = C.blue, sw = 2 }) {
  const s = size / 24;
  return (
    <g transform={`translate(${cx - size / 2} ${cy - size / 2}) scale(${s})`} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {(ICONS[name] || []).map((d, i) => <path key={i} d={d} />)}
    </g>
  );
}

/** Tinted rounded square with an icon — the standard icon badge */
export function Badge({ cx, cy, size = 30, name, solid = false }) {
  return (
    <g>
      <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={size * 0.3} fill={solid ? C.blue : C.tint} />
      <Icon name={name} cx={cx} cy={cy} size={size * 0.55} color={solid ? C.white : C.blue} />
    </g>
  );
}

export function Coin({ cx, cy, r = 16 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={C.gold} />
      <circle cx={cx} cy={cy} r={r * 0.78} fill={C.goldLight} />
      <T x={cx} y={cy + r * 0.36} s={r * 0.95} w={800} c="#8A6419" a="middle">₹</T>
    </g>
  );
}

export function Avatar({ cx, cy, r = 13, hair = C.ink, shirt = C.blue }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 2.5} fill={C.white} />
      <clipPath id={`av${cx}${cy}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath={`url(#av${cx}${cy})`}>
        <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={C.tint} />
        <circle cx={cx} cy={cy - r * 0.15} r={r * 0.42} fill={C.skin} />
        <path d={`M${cx - r * 0.44} ${cy - r * 0.28} q${r * 0.44} -${r * 0.62} ${r * 0.88} 0`} fill={hair} />
        <rect x={cx - r * 0.72} y={cy + r * 0.38} width={r * 1.44} height={r} rx={r * 0.5} fill={shirt} />
      </g>
    </g>
  );
}
