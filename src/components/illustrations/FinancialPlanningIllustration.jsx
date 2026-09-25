import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function FinancialPlanningIllustration() {
  const rows = [
    { label: 'Emergency fund', state: 'done', pill: 'Done', tone: 'blue' },
    { label: 'Health & term cover', state: 'done', pill: 'Done', tone: 'blue' },
    { label: 'Monthly SIPs', state: 'started', pill: 'Started', tone: 'blue' },
    { label: 'Retirement corpus', state: 'todo', pill: 'Planned', tone: 'grey' },
  ];
  return (
    <Frame title="A personal financial plan checklist">
      <Backdrop />
      <Card x={36} y={34} w={246} h={212}>
        <T x={58} y={66} s={14} w={700}>Your Financial Plan</T>
        <T x={58} y={84} s={10} w={500} c={C.muted}>Built around your goals</T>
        {rows.map((r, i) => (
          <g key={r.label}>
            <Tick cx={67} cy={116 + i * 34} state={r.state} />
            <T x={84} y={120 + i * 34} s={11} w={600} c={C.ink}>{r.label}</T>
            <Pill x={214} y={117 + i * 34} w={50} label={r.pill} tone={r.tone} />
          </g>
        ))}
      </Card>
      <Card x={270} y={112} w={112} h={116}>
        <circle cx={326} cy={158} r={26} stroke={C.track} strokeWidth={11} />
        <circle cx={326} cy={158} r={26} stroke={C.blue} strokeWidth={11} strokeDasharray="90 164" transform="rotate(-90 326 158)" />
        <circle cx={326} cy={158} r={26} stroke={C.blueLight} strokeWidth={11} strokeDasharray="46 164" strokeDashoffset="-90" transform="rotate(-90 326 158)" />
        <circle cx={326} cy={158} r={26} stroke={C.gold} strokeWidth={11} strokeDasharray="20 164" strokeDashoffset="-136" transform="rotate(-90 326 158)" />
        <T x={326} y={211} s={10} w={700} a="middle">Asset mix</T>
      </Card>
    </Frame>
  );
}
