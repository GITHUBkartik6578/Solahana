import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function RetirementCoupleIllustration() {
  const saving = [22, 34, 46, 60, 76];
  return (
    <Frame title="Income that continues after retirement">
      <Backdrop />
      <Card x={30} y={46} w={262} h={190}>
        <T x={52} y={78} s={14} w={700}>Income after retirement</T>
        <T x={52} y={96} s={10} w={500} c={C.muted}>Paid to you, every month</T>
        {saving.map((h, i) => <rect key={i} x={54 + i * 17} y={206 - h} width={11} height={h} rx={3} fill={C.blueLight} />)}
        {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={149 + i * 17} y={152} width={11} height={54} rx={3} fill={C.blue} />)}
        <line x1={50} y1={208} x2={272} y2={208} stroke={C.line} strokeWidth={1.5} />
        <line x1={142} y1={120} x2={142} y2={208} stroke={C.muted} strokeWidth={1} strokeDasharray="3 4" />
        <T x={94} y={224} s={9} w={600} c={C.muted} a="middle">Working years</T>
        <T x={206} y={224} s={9} w={600} c={C.blue} a="middle">Retired</T>
      </Card>
      <Card x={262} y={28} w={120} h={66}>
        <Badge cx={288} cy={61} name="sun" />
        <T x={310} y={57} s={11} w={700}>Retire on</T>
        <T x={310} y={72} s={11} w={700}>your terms</T>
      </Card>
      <Card x={292} y={172} w={86} h={58} r={29}>
        <Avatar cx={322} cy={201} r={15} hair="#D9D9D9" shirt={C.blue} />
        <Avatar cx={348} cy={201} r={15} hair="#D9D9D9" shirt={C.gold} />
      </Card>
    </Frame>
  );
}
