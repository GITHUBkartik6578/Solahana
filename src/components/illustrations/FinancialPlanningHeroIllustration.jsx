import React from 'react';
import { Frame, Backdrop, T, C, useKitId } from './kit';

/**
 * Financial plan dashboard, drawn with depth: layered shadows, soft gradients
 * and a glossy badge — the premium 3D feel, with text that stays crisp and
 * readable at any screen size.
 */
export default function FinancialPlanningHeroIllustration() {
  const id = useKitId();

  return (
    <Frame title="A financial plan dashboard: net worth, asset mix, goals and cover">
      <defs>
        {/* depth + glass */}
        <linearGradient id={`panel${id}`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F3F6FC" />
        </linearGradient>
        <linearGradient id={`area${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.blue} stopOpacity="0.28" />
          <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`line${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#5A7FD6" />
          <stop offset="100%" stopColor="#1A3170" />
        </linearGradient>
        <linearGradient id={`gloss${id}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#4C74D8" />
          <stop offset="55%" stopColor="#1A3170" />
          <stop offset="100%" stopColor="#0F1F45" />
        </linearGradient>
        <linearGradient id={`goldArc${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAD08F" />
          <stop offset="100%" stopColor="#A67C2E" />
        </linearGradient>
        <linearGradient id={`blueArc${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5A7FD6" />
          <stop offset="100%" stopColor="#1A3170" />
        </linearGradient>
        <filter id={`soft${id}`} x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0F1F45" floodOpacity="0.14" />
        </filter>
        <filter id={`lift${id}`} x="-60%" y="-60%" width="220%" height="240%">
          <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#0F1F45" floodOpacity="0.20" />
        </filter>
        <filter id={`inner${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F1F45" floodOpacity="0.16" />
        </filter>
      </defs>

      <Backdrop cx={196} cy={146} r={128} />

      {/* main panel */}
      <g filter={`url(#soft${id})`}>
        <rect x={24} y={30} width={256} height={222} rx={22} fill={`url(#panel${id})`} stroke="#E7ECF6" />
        <rect x={24} y={30} width={256} height={222} rx={22} fill="none" stroke="#FFFFFF" strokeOpacity="0.9" />
      </g>

      <T x={46} y={60} s={10} w={700} c={C.muted}>Net worth</T>
      <T x={46} y={82} s={18} w={800}>Growing steadily</T>

      {/* trend */}
      <g>
        <path d="M46 124 C 80 122, 100 112, 130 110 S 190 96, 258 84 L258 132 L46 132 Z" fill={`url(#area${id})`} />
        <path d="M46 124 C 80 122, 100 112, 130 110 S 190 96, 258 84" stroke={`url(#line${id})`} strokeWidth={3.4} strokeLinecap="round" fill="none" />
        <circle cx={236} cy={88} r={5.5} fill="#FFFFFF" stroke={C.blue} strokeWidth={3} filter={`url(#inner${id})`} />
      </g>

      {/* asset mix */}
      <g filter={`url(#inner${id})`}>
        <rect x={46} y={142} width={106} height={94} rx={14} fill="#FFFFFF" stroke="#E7ECF6" />
      </g>
      <circle cx={99} cy={182} r={21} stroke="#E9EEF7" strokeWidth={11} fill="none" />
      <circle cx={99} cy={182} r={21} stroke={`url(#blueArc${id})`} strokeWidth={11} strokeLinecap="round" strokeDasharray="70 132" transform="rotate(-90 99 182)" fill="none" />
      <circle cx={99} cy={182} r={21} stroke={`url(#goldArc${id})`} strokeWidth={11} strokeLinecap="round" strokeDasharray="24 132" strokeDashoffset="-74" transform="rotate(-90 99 182)" fill="none" />
      <T x={99} y={226} s={9} w={700} a="middle">Asset mix</T>

      {/* goals */}
      <g filter={`url(#inner${id})`}>
        <rect x={160} y={142} width={100} height={94} rx={14} fill="#FFFFFF" stroke="#E7ECF6" />
      </g>
      <T x={172} y={163} s={9} w={800} c={C.muted}>Goals</T>
      {[
        { p: 0.74, label: 'Home' },
        { p: 0.48, label: 'Education' },
        { p: 0.26, label: 'Retirement' },
      ].map((g, i) => (
        <g key={g.label}>
          <T x={172} y={181 + i * 19} s={7.5} w={600} c={C.muted}>{g.label}</T>
          <rect x={172} y={185 + i * 19} width={70} height={6} rx={3} fill="#E9EEF7" />
          <rect x={172} y={185 + i * 19} width={70 * g.p} height={6} rx={3} fill={`url(#blueArc${id})`} />
        </g>
      ))}

      {/* floating: family covered */}
      <g filter={`url(#lift${id})`}>
        <rect x={246} y={36} width={140} height={72} rx={18} fill="#FFFFFF" stroke="#E7ECF6" />
      </g>
      <g filter={`url(#inner${id})`}>
        <rect x={260} y={56} width={32} height={32} rx={10} fill={`url(#gloss${id})`} />
        <path d="M276 63l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8v-5z" fill="#FFFFFF" fillOpacity="0.95" />
        <path d="M273.5 72.5l2 2 4-4.5" stroke="#1A3170" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M260 56h32v10c-6 3-26 3-32 0z" fill="#FFFFFF" fillOpacity="0.16" />
      </g>
      <T x={300} y={69} s={11} w={800}>Family covered</T>
      <T x={300} y={84} s={9} w={500} c={C.muted}>Health · Term</T>

      {/* floating: reviewed */}
      <g filter={`url(#lift${id})`}>
        <rect x={268} y={190} width={118} height={62} rx={18} fill="#FFFFFF" stroke="#E7ECF6" />
      </g>
      <circle cx={293} cy={221} r={12} fill={`url(#blueArc${id})`} filter={`url(#inner${id})`} />
      <path d="M288 221l3.5 3.5 6.5-7" stroke="#FFFFFF" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <T x={313} y={217} s={11} w={800}>Reviewed</T>
      <T x={313} y={232} s={9} w={500} c={C.muted}>Every year</T>
    </Frame>
  );
}
