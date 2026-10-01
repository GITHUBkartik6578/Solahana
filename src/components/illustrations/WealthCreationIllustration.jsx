import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function WealthCreationIllustration() {
  return (
    <Frame title="Wealth growing through monthly SIPs">
      <Backdrop />
      <Card x={30} y={36} w={264} h={196}>
        <T x={52} y={68} s={14} w={700}>Your wealth, growing</T>
        <T x={52} y={86} s={10} w={500} c={C.muted}>Invested every month, automatically</T>
        {[120, 150, 180].map((y) => <line key={y} x1={52} y1={y} x2={272} y2={y} stroke={C.track} strokeWidth={1} />)}
        <AreaChart />
      </Card>
      <Card x={244} y={176} w={138} h={58}>
        <Badge cx={272} cy={205} name="repeat" solid />
        <T x={296} y={201} s={11} w={700}>Monthly SIP</T>
        <T x={296} y={216} s={9} w={500} c={C.muted}>Auto-invested</T>
      </Card>
      <Coin cx={318} cy={62} r={20} />
    </Frame>
  );
}

function AreaChart() {
  const id = useKitId();
  const line = 'M52 206 C 96 202, 130 194, 160 178 S 222 136, 272 104';
  return (
    <g>
      <path d={`${line} L272 212 L52 212 Z`} fill={`url(#area${id})`} />
      <path d={line} stroke={C.blue} strokeWidth={2.6} strokeLinecap="round" />
      <circle cx={272} cy={104} r={9} fill={C.blue} opacity="0.18" />
      <circle cx={272} cy={104} r={4.5} fill={C.blue} stroke={C.white} strokeWidth={2} />
    </g>
  );
}
