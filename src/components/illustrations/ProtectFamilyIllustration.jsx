import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function ProtectFamilyIllustration() {
  const items = ['Health cover', 'Term life cover', 'Emergency fund'];
  return (
    <Frame title="A family protected by insurance and savings">
      <Backdrop cx={150} cy={146} r={112} />
      <path d="M130 34 L206 60 V132 C206 186 172 220 130 240 C88 220 54 186 54 132 V60 Z" fill={C.blue} />
      <path d="M130 50 L192 71 V132 C192 176 164 205 130 222 C96 205 68 176 68 132 V71 Z" fill={C.blueDark} opacity="0.35" />
      <circle cx={104} cy={126} r={13} fill={C.skin} />
      <rect x={90} y={142} width={28} height={40} rx={12} fill={C.white} />
      <circle cx={156} cy={126} r={13} fill={C.skin} />
      <rect x={142} y={142} width={28} height={40} rx={12} fill={C.goldLight} />
      <circle cx={130} cy={150} r={10} fill={C.skin} />
      <rect x={119} y={163} width={22} height={27} rx={10} fill={C.blueLight} />
      {items.map((label, i) => (
        <Card key={label} x={220} y={62 + i * 60} w={160} h={46} r={14}>
          <Tick cx={244} cy={85 + i * 60} />
          <T x={262} y={89 + i * 60} s={11} w={700}>{label}</T>
        </Card>
      ))}
    </Frame>
  );
}
