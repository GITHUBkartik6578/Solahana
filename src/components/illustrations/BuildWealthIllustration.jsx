import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function BuildWealthIllustration() {
  const bars = [16, 28, 48, 80, 124];
  const labels = ['5y', '10y', '15y', '20y', '25y'];
  return (
    <Frame title="Compounding: growth that builds on growth">
      <Backdrop />
      <Card x={30} y={34} w={262} h={212}>
        <T x={52} y={66} s={14} w={700}>Compounding at work</T>
        <T x={52} y={84} s={10} w={500} c={C.muted}>Growth that builds on growth</T>
        {bars.map((h, i) => (
          <g key={i}>
            <rect x={60 + i * 44} y={214 - h} width={28} height={h} rx={6} fill={i === bars.length - 1 ? C.blue : i >= 2 ? C.blueMid : C.blueLight} />
            <T x={74 + i * 44} y={232} s={9} w={600} c={C.muted} a="middle">{labels[i]}</T>
          </g>
        ))}
      </Card>
      <Coin cx={250} cy={76} r={18} />
      <Card x={276} y={128} w={106} h={62}>
        <Badge cx={302} cy={159} name="clock" />
        <T x={324} y={155} s={11} w={700}>Start</T>
        <T x={324} y={170} s={11} w={700}>early</T>
      </Card>
    </Frame>
  );
}
