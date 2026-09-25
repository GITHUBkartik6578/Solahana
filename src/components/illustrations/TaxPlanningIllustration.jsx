import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function TaxPlanningIllustration() {
  return (
    <Frame title="Comparing the old and new tax regimes">
      <Backdrop />
      <Card x={36} y={36} w={256} h={208}>
        <Badge cx={66} cy={70} name="scale" />
        <T x={88} y={66} s={14} w={700}>Which tax regime?</T>
        <T x={88} y={82} s={10} w={500} c={C.muted}>We compare both for you</T>
        <T x={58} y={122} s={11} w={600}>Old regime</T>
        <Bar x={58} y={130} w={212} h={12} pct={0.78} color={C.blueLight} />
        <T x={58} y={172} s={11} w={600}>New regime</T>
        <Bar x={58} y={180} w={212} h={12} pct={0.56} color={C.blue} />
        <T x={270} y={122} s={9} w={600} c={C.muted} a="end">Tax payable</T>
        <Pill x={58} y={220} w={112} label="✓ Lower tax for you" tone="green" />
      </Card>
      <Card x={282} y={44} w={96} h={96}>
        <rect x={282} y={44} width={96} height={28} rx={14} fill={C.ink} />
        <rect x={282} y={58} width={96} height={14} fill={C.ink} />
        <T x={330} y={63} s={10} w={800} c={C.white} a="middle" ls="2">APRIL</T>
        <T x={330} y={116} s={30} w={800} a="middle">01</T>
      </Card>
      <T x={330} y={160} s={10} w={700} c={C.blue} a="middle">Plan early</T>
    </Frame>
  );
}
