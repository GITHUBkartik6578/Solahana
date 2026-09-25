import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function GoalPlanningIllustration() {
  const goals = [
    { label: 'Own home', icon: 'home', pct: 0.72, note: 'On track' },
    { label: "Child's education", icon: 'cap', pct: 0.46, note: 'On track' },
    { label: 'Wedding', icon: 'heart', pct: 0.24, note: 'Started' },
  ];
  return (
    <Frame title="Life goals with their own progress">
      <Backdrop />
      <Card x={30} y={34} w={262} h={212}>
        <T x={52} y={66} s={14} w={700}>Your goals</T>
        <T x={52} y={84} s={10} w={500} c={C.muted}>Each one with its own fund</T>
        {goals.map((g, i) => (
          <g key={g.label}>
            <Badge cx={68} cy={120 + i * 44} size={30} name={g.icon} />
            <T x={92} y={116 + i * 44} s={11} w={600}>{g.label}</T>
            <T x={270} y={116 + i * 44} s={9} w={700} c={g.note === 'On track' ? C.blue : C.muted} a="end">{g.note}</T>
            <Bar x={92} y={124 + i * 44} w={178} h={7} pct={g.pct} />
          </g>
        ))}
      </Card>
      <Card x={278} y={56} w={104} h={92}>
        <Badge cx={330} cy={88} size={34} name="flag" solid />
        <T x={330} y={124} s={10} w={700} a="middle">A timeline</T>
        <T x={330} y={138} s={10} w={700} a="middle">for every goal</T>
      </Card>
    </Frame>
  );
}
