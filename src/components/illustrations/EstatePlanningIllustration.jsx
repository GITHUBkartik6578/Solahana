import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function EstatePlanningIllustration() {
  return (
    <Frame title="A will and nominees for the family">
      <Backdrop />
      <Card x={52} y={30} w={190} h={220}>
        <Badge cx={80} cy={62} name="doc" />
        <T x={102} y={67} s={15} w={800}>My Will</T>
        {[98, 114, 130, 146, 162].map((y, i) => <rect key={y} x={72} y={y} width={i === 4 ? 90 : 150} height={6} rx={3} fill={C.track} />)}
        <path d="M76 214 c 10 -16 18 8 26 -6 s 12 -12 18 4 s 14 -8 22 -2" stroke={C.blue} strokeWidth={2} strokeLinecap="round" />
        <line x1={72} y1={222} x2={170} y2={222} stroke={C.line} strokeWidth={1.2} />
        <Pill x={176} y={216} w={50} label="Signed" tone="green" />
      </Card>
      <Card x={224} y={112} w={158} h={128}>
        <T x={303} y={138} s={10} w={700} a="middle">Nominees</T>
        <path d="M303 166 V180 M266 180 H340 M266 180 V190 M340 180 V190" stroke={C.blueLight} strokeWidth={2} />
        <Avatar cx={303} cy={160} r={13} hair={C.ink} shirt={C.ink} />
        <Avatar cx={266} cy={206} r={13} hair={C.ink} shirt={C.blue} />
        <Avatar cx={340} cy={206} r={13} hair={C.ink} shirt={C.gold} />
      </Card>
    </Frame>
  );
}
