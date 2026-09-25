import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function InvestmentPortfolioIllustration() {
  const legend = [
    ['Equity', C.blue],
    ['Debt', C.blueLight],
    ['Gold', C.gold],
  ];
  return (
    <Frame title="A diversified investment portfolio">
      <Backdrop />
      <Card x={30} y={40} w={262} h={200}>
        <T x={52} y={72} s={14} w={700}>Your portfolio</T>
        <T x={52} y={90} s={10} w={500} c={C.muted}>Diversified for your goals</T>
        <circle cx={112} cy={166} r={42} stroke={C.track} strokeWidth={18} />
        <circle cx={112} cy={166} r={42} stroke={C.blue} strokeWidth={18} strokeDasharray="145 264" transform="rotate(-90 112 166)" />
        <circle cx={112} cy={166} r={42} stroke={C.blueLight} strokeWidth={18} strokeDasharray="79 264" strokeDashoffset="-145" transform="rotate(-90 112 166)" />
        <circle cx={112} cy={166} r={42} stroke={C.gold} strokeWidth={18} strokeDasharray="40 264" strokeDashoffset="-224" transform="rotate(-90 112 166)" />
        {legend.map(([label, color], i) => (
          <g key={label}>
            <rect x={184} y={134 + i * 26} width={12} height={12} rx={4} fill={color} />
            <T x={204} y={144 + i * 26} s={11} w={600}>{label}</T>
          </g>
        ))}
      </Card>
      <Card x={258} y={50} w={124} h={62}>
        <Badge cx={284} cy={81} name="refresh" solid />
        <T x={306} y={77} s={11} w={700}>Rebalanced</T>
        <T x={306} y={92} s={9} w={500} c={C.muted}>Every year</T>
      </Card>
    </Frame>
  );
}
