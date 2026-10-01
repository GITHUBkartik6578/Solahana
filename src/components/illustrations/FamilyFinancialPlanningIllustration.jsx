import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Icon, Badge, Coin, Avatar, C, useKitId } from './kit';

export default function FamilyFinancialPlanningIllustration() {
  return (
    <Frame title="A family with nominees and a will in place">
      <Backdrop />
      <Card x={36} y={44} w={250} h={194}>
        <T x={58} y={76} s={14} w={700}>Family ready</T>
        <T x={58} y={94} s={10} w={500} c={C.muted}>Everything in order, for everyone</T>
        <Avatar cx={78} cy={134} r={17} hair={C.ink} shirt={C.blue} />
        <Avatar cx={118} cy={134} r={17} hair={C.ink} shirt={C.gold} />
        <Avatar cx={158} cy={134} r={17} hair="#D9D9D9" shirt={C.ink} />
        <Avatar cx={198} cy={134} r={17} hair={C.ink} shirt={C.blueLight} />
        <Tick cx={70} cy={182} />
        <T x={88} y={186} s={11} w={600}>Nominees updated</T>
        <Tick cx={70} cy={212} />
        <T x={88} y={216} s={11} w={600}>Will in place</T>
      </Card>
      <Card x={276} y={70} w={104} h={98}>
        <Badge cx={328} cy={104} size={36} name="doc" solid />
        <T x={328} y={142} s={10} w={700} a="middle">One place</T>
        <T x={328} y={156} s={10} w={700} a="middle">for all papers</T>
      </Card>
    </Frame>
  );
}
