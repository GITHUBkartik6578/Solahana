import React from 'react';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Badge, Coin, Avatar, C } from './kit';

/* ---------------- WHO WE SERVE ---------------- */

export function SalariedVisual() {
  const rows = [
    ['Salary credited', 'done', 'Day 1'],
    ['SIP auto-invested', 'done', 'Day 2'],
    ['Emergency fund top-up', 'done', 'Day 2'],
    ['Tax-saving on track', 'started', 'Yearly'],
  ];
  return (
    <Frame title="Salary day, handled automatically">
      <Backdrop />
      <Card x={26} y={40} w={250} h={200}>
        <T x={48} y={72} s={14} w={700}>Salary day</T>
        <T x={48} y={90} s={10} w={500} c={C.muted}>Everything moves on its own</T>
        {rows.map(([label, st, when], i) => (
          <g key={label}>
            <Tick cx={58} cy={118 + i * 30} state={st} />
            <T x={76} y={122 + i * 30} s={11} w={600}>{label}</T>
            <T x={256} y={122 + i * 30} s={9} w={600} c={C.muted} a="end">{when}</T>
          </g>
        ))}
      </Card>
      <Card x={286} y={96} w={100} h={62}>
        <Badge cx={312} cy={127} name="repeat" solid />
        <T x={332} y={123} s={11} w={700}>Every</T>
        <T x={332} y={138} s={11} w={700}>month</T>
      </Card>
    </Frame>
  );
}

export function BusinessVisual() {
  return (
    <Frame title="Business money and family money, kept apart">
      <Backdrop />
      <Card x={36} y={46} w={328} h={170}>
        <T x={58} y={78} s={14} w={700}>Two pots, clearly split</T>
        <T x={58} y={96} s={10} w={500} c={C.muted}>So a bad quarter never touches home</T>
        <g>
          <rect x={58} y={112} width={136} height={84} rx={12} fill={C.tint} />
          <T x={72} y={134} s={10} w={700} c={C.blue}>BUSINESS</T>
          <T x={72} y={152} s={9} w={500} c={C.body}>Working capital</T>
          <Bar x={72} y={160} w={108} pct={0.72} />
          <T x={72} y={184} s={9} w={500} c={C.body}>Tax set aside</T>
        </g>
        <g>
          <rect x={206} y={112} width={136} height={84} rx={12} fill="#FBF6EA" />
          <T x={220} y={134} s={10} w={700} c={C.gold}>FAMILY</T>
          <T x={220} y={152} s={9} w={500} c={C.body}>Your salary to yourself</T>
          <Bar x={220} y={160} w={108} pct={0.55} color={C.gold} track="#F3EAD4" />
          <T x={220} y={184} s={9} w={500} c={C.body}>Long-term wealth</T>
        </g>
      </Card>
      <Pill x={272} y={238} w={88} label="Kept separate" tone="green" />
    </Frame>
  );
}

export function FamiliesVisual() {
  const goals = [['Own home', 0.64], ["Kids' education", 0.42], ['Health cover', 1]];
  return (
    <Frame title="One plan for the whole family">
      <Backdrop />
      <Card x={40} y={36} w={236} h={208}>
        <T x={62} y={68} s={14} w={700}>Family goals</T>
        <T x={62} y={86} s={10} w={500} c={C.muted}>Each one with its own fund</T>
        {goals.map(([g, p], i) => (
          <g key={g}>
            <T x={62} y={118 + i * 38} s={11} w={600}>{g}</T>
            <T x={254} y={118 + i * 38} s={9} w={700} c={p === 1 ? C.green : C.blue} a="end">{p === 1 ? 'Covered' : 'On track'}</T>
            <Bar x={62} y={126 + i * 38} w={192} pct={p} color={p === 1 ? C.green : C.blue} />
          </g>
        ))}
      </Card>
      <Card x={250} y={120} w={120} h={78}>
        <Avatar cx={284} cy={152} />
        <Avatar cx={312} cy={152} hair="#3B2A20" shirt={C.gold} />
        <Avatar cx={298} cy={166} r={10} shirt={C.blueMid} />
        <T x={310} y={190} s={9} w={700} c={C.muted} a="middle">All covered</T>
      </Card>
    </Frame>
  );
}

export function NriVisual() {
  return (
    <Frame title="Earning abroad, planning for home">
      <Backdrop />
      <Card x={44} y={44} w={312} h={186}>
        <T x={66} y={76} s={14} w={700}>Abroad + India, in one view</T>
        <T x={66} y={94} s={10} w={500} c={C.muted}>Accounts, tax and investments together</T>
        {[['NRE account', 'Set up right'], ['NRO account', 'Set up right'], ['Same income taxed once', 'Checked']].map(([a, b], i) => (
          <g key={a}>
            <Tick cx={76} cy={124 + i * 30} />
            <T x={94} y={128 + i * 30} s={11} w={600}>{a}</T>
            <Pill x={250} y={126 + i * 30} w={84} label={b} tone="green" />
          </g>
        ))}
      </Card>
      <Coin cx={340} cy={52} r={18} />
    </Frame>
  );
}

export function YoungProVisual() {
  return (
    <Frame title="Your first real money plan">
      <Backdrop />
      <Card x={52} y={40} w={232} h={200}>
        <T x={74} y={72} s={14} w={700}>Your first plan</T>
        <T x={74} y={90} s={10} w={500} c={C.muted}>Small steps, started early</T>
        <Tick cx={84} cy={118} />
        <T x={102} y={122} s={11} w={600}>First SIP started</T>
        <Tick cx={84} cy={148} />
        <T x={102} y={152} s={11} w={600}>Term cover while it’s cheap</T>
        <T x={74} y={184} s={11} w={600}>Emergency fund</T>
        <T x={262} y={184} s={9} w={700} c={C.blue} a="end">Building</T>
        <Bar x={74} y={194} w={188} pct={0.4} />
      </Card>
      <Card x={258} y={128} w={112} h={62}>
        <Badge cx={286} cy={159} name="trend" solid />
        <T x={308} y={155} s={11} w={700}>Starts</T>
        <T x={308} y={170} s={11} w={700}>small</T>
      </Card>
    </Frame>
  );
}

export function RetireeVisual() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return (
    <Frame title="A steady monthly income after retirement">
      <Backdrop />
      <Card x={36} y={42} w={264} h={196}>
        <T x={58} y={74} s={14} w={700}>Income after 60</T>
        <T x={58} y={92} s={10} w={500} c={C.muted}>Paid to you, every month</T>
        {months.map((m, i) => (
          <g key={m}>
            <rect x={66 + i * 38} y={124} width={24} height={72} rx={6} fill={C.blue} opacity={0.85} />
            <T x={78 + i * 38} y={214} s={9} w={600} c={C.muted} a="middle">{m}</T>
          </g>
        ))}
      </Card>
      <Card x={266} y={120} w={108} h={62}>
        <Badge cx={293} cy={151} name="sun" />
        <T x={314} y={147} s={11} w={700}>Same,</T>
        <T x={314} y={162} s={11} w={700}>every month</T>
      </Card>
    </Frame>
  );
}

/* ---------------- OUR PROCESS ---------------- */

export function IntroCallVisual() {
  return (
    <Frame title="A short introductory call">
      <Backdrop />
      <Card x={50} y={50} w={300} h={176}>
        <T x={72} y={82} s={14} w={700}>Intro call</T>
        <T x={72} y={100} s={10} w={500} c={C.muted}>Get to know each other. No selling.</T>
        <Avatar cx={120} cy={152} r={20} />
        <Avatar cx={180} cy={152} r={20} hair="#3B2A20" shirt={C.gold} />
        <path d="M144 152h12" stroke={C.line} strokeWidth="2" strokeDasharray="3 3" />
        <Pill x={226} y={140} w={96} label="Free" tone="green" />
        <Pill x={226} y={168} w={96} label="Phone or video" />
        <T x={72} y={206} s={10} w={500} c={C.body}>What you want to achieve · Where you are today</T>
      </Card>
      <Badge cx={338} cy={56} size={34} name="clock" solid />
    </Frame>
  );
}

export function DiscussionVisual() {
  const rows = [['Income', 0.8], ['Expenses & EMIs', 0.55], ['Investments', 0.4], ['Insurance', 0.3]];
  return (
    <Frame title="Your complete money snapshot">
      <Backdrop />
      <Card x={44} y={36} w={260} h={208}>
        <T x={66} y={68} s={14} w={700}>Your money snapshot</T>
        <T x={66} y={86} s={10} w={500} c={C.muted}>Everything on one page</T>
        {rows.map(([l, p], i) => (
          <g key={l}>
            <T x={66} y={116 + i * 32} s={11} w={600}>{l}</T>
            <Bar x={66} y={123 + i * 32} w={214} pct={p} color={i === 0 ? C.blue : C.blueMid} />
          </g>
        ))}
      </Card>
      <Card x={292} y={142} w={96} h={60}>
        <Badge cx={316} cy={172} name="flag" />
        <T x={336} y={168} s={11} w={700}>Goals</T>
        <T x={336} y={183} s={11} w={700}>listed</T>
      </Card>
    </Frame>
  );
}

export function ReviewVisual() {
  const rows = [
    ['Asset mix', 'Fine', 'green'],
    ['Health & term cover', 'Gap found', 'amber'],
    ['Emergency fund', 'Too low', 'amber'],
    ['Tax-saving', 'Fine', 'green'],
  ];
  return (
    <Frame title="A plain-language review of gaps">
      <Backdrop />
      <Card x={46} y={38} w={308} h={204}>
        <T x={68} y={70} s={14} w={700}>Financial health check</T>
        <T x={68} y={88} s={10} w={500} c={C.muted}>What’s working, and what needs fixing</T>
        {rows.map(([l, v, tone], i) => (
          <g key={l}>
            <T x={68} y={122 + i * 30} s={11} w={600}>{l}</T>
            <Pill x={246} y={120 + i * 30} w={86} label={v} tone={tone} />
          </g>
        ))}
      </Card>
    </Frame>
  );
}

export function PlanDocVisual() {
  return (
    <Frame title="Your written financial plan">
      <Backdrop />
      <Card x={70} y={30} w={200} h={220}>
        <Badge cx={96} cy={60} name="doc" solid />
        <T x={118} y={56} s={13} w={700}>Your Financial</T>
        <T x={118} y={72} s={13} w={700}>Plan</T>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={90} y={100 + i * 18} width={i % 2 ? 120 : 160} height={7} rx={3.5} fill={C.track} />
        ))}
        <T x={90} y={216} s={10} w={600} c={C.muted}>Actions · Timelines · Numbers</T>
      </Card>
      <Card x={238} y={146} w={122} h={64}>
        <Tick cx={262} cy={178} />
        <T x={280} y={174} s={11} w={700}>Clear next</T>
        <T x={280} y={189} s={11} w={700}>steps</T>
      </Card>
    </Frame>
  );
}

export function OngoingVisual() {
  const q = [['Plan set up', 'done'], ['First review', 'done'], ['Yearly review', 'started'], ['Life change? Update', 'todo']];
  return (
    <Frame title="We stay with you and review regularly">
      <Backdrop />
      <Card x={46} y={38} w={262} h={204}>
        <T x={68} y={70} s={14} w={700}>We stay with you</T>
        <T x={68} y={88} s={10} w={500} c={C.muted}>Your plan keeps pace with your life</T>
        <line x1={80} y1={118} x2={80} y2={208} stroke={C.line} strokeWidth="2" />
        {q.map(([l, st], i) => (
          <g key={l}>
            <Tick cx={80} cy={118 + i * 30} state={st} />
            <T x={98} y={122 + i * 30} s={11} w={600} c={st === 'todo' ? C.muted : C.ink}>{l}</T>
          </g>
        ))}
      </Card>
      <Card x={276} y={126} w={100} h={62}>
        <Badge cx={302} cy={157} name="refresh" solid />
        <T x={322} y={153} s={11} w={700}>Every</T>
        <T x={322} y={168} s={11} w={700}>year</T>
      </Card>
    </Frame>
  );
}
