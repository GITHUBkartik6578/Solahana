import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function AchieveGoalsIllustration() {
  const steps = [
    { label: 'Emergency', icon: 'shield', done: true },
    { label: 'Home', icon: 'home', done: true },
    { label: 'Education', icon: 'cap', done: false },
    { label: 'Retire', icon: 'sun', done: false },
  ];
  return (
    <Frame title="Life milestones reached one by one">
      <Backdrop cx={200} cy={150} r={122} />
      <Card x={24} y={56} w={352} h={170}>
        <T x={48} y={88} s={14} w={700}>Your milestones</T>
        <T x={48} y={106} s={10} w={500} c={C.muted}>Reached one by one, on schedule</T>
        <line x1={78} y1={176} x2={330} y2={176} stroke={C.line} strokeWidth={4} strokeLinecap="round" />
        <line x1={78} y1={176} x2={170} y2={176} stroke={C.blue} strokeWidth={4} strokeLinecap="round" />
        {steps.map((s, i) => {
          const x = 78 + i * 84;
          return (
            <g key={s.label}>
              <Badge cx={x} cy={142} size={30} name={s.icon} solid={s.done} />
              <Tick cx={x} cy={176} r={7} state={s.done ? 'done' : 'todo'} />
              <T x={x} y={204} s={10} w={700} c={s.done ? C.ink : C.muted} a="middle">{s.label}</T>
            </g>
          );
        })}
      </Card>
    </Frame>
  );
}
