import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function InsuranceProtectionIllustration() {
  const rows = [
    { label: 'Term life cover', pill: 'Covered', tone: 'green' },
    { label: 'Health + top-up', pill: 'Covered', tone: 'green' },
    { label: 'Critical illness', pill: 'Review', tone: 'amber' },
  ];
  return (
    <Frame title="An insurance cover check under an umbrella">
      <Backdrop cx={200} cy={156} r={116} />
      <path d="M200 100 V112" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
      <path d="M72 100 C 84 44, 140 22, 200 22 C 260 22, 316 44, 328 100 C 312 90, 294 90, 285 100 C 270 90, 252 90, 242 100 C 228 90, 214 90, 200 100 C 186 90, 172 90, 158 100 C 148 90, 130 90, 115 100 C 106 90, 88 90, 72 100 Z" fill={C.blue} />
      <path d="M200 22 C 176 40, 162 70, 158 100 M200 22 C 224 40, 238 70, 242 100" stroke={C.blueDark} strokeWidth={1.5} opacity="0.6" />
      <Card x={92} y={112} w={216} h={140}>
        <T x={112} y={140} s={13} w={700}>Cover check</T>
        {rows.map((r, i) => (
          <g key={r.label}>
            <T x={112} y={172 + i * 28} s={11} w={600}>{r.label}</T>
            <Pill x={234} y={169 + i * 28} w={56} label={r.pill} tone={r.tone} />
          </g>
        ))}
      </Card>
    </Frame>
  );
}
