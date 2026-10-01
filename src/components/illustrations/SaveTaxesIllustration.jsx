import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function SaveTaxesIllustration() {
  const rows = [
    ['80C', 'ELSS · PPF · EPF'],
    ['80D', 'Health insurance'],
    ['NPS', 'Extra deduction'],
  ];
  return (
    <Frame title="Tax saved legally through planned deductions">
      <Backdrop />
      <Receipt />
      <T x={72} y={62} s={14} w={700}>Tax saved, legally</T>
      <T x={72} y={80} s={10} w={500} c={C.muted}>Planned from April</T>
      {rows.map(([code, note], i) => (
        <g key={code}>
          <Tick cx={82} cy={114 + i * 36} />
          <T x={100} y={112 + i * 36} s={12} w={800}>{code}</T>
          <T x={100} y={126 + i * 36} s={9} w={500} c={C.muted}>{note}</T>
          {i < 2 && <line x1={72} y1={134 + i * 36} x2={232} y2={134 + i * 36} stroke={C.track} />}
        </g>
      ))}
      <Pill x={72} y={212} w={108} label="Linked to your goals" tone="blue" />
      <Coin cx={300} cy={150} r={26} />
      <Coin cx={332} cy={188} r={18} />
      <Coin cx={286} cy={200} r={14} />
    </Frame>
  );
}

function Receipt() {
  const id = useKitId();
  return (
    <path d="M52 30 H250 V226 l-11 10 -11 -10 -11 10 -11 -10 -11 10 -11 -10 -11 10 -11 -10 -11 10 -11 -10 -11 10 -11 -10 -11 10 -11 -10 -11 10 -11 -10 -11 10 -11 -10 Z" fill={C.white} stroke={C.line} strokeWidth={1.2} filter={`url(#sh${id})`} />
  );
}
