import React from 'react';
import { motion } from 'framer-motion';
import { Layers, RefreshCw, MessageCircle } from 'lucide-react';
import MascotScene from './MascotScene';
import { Frame, Backdrop, Card, T, Bar, Tick, Pill, Badge, C } from './kit';

const CHIPS = [
  { label: 'All in one place', sub: 'Money, cover and goals together', icon: Layers, pos: 'top-[18%] left-[2%] sm:top-[13%] sm:left-[8%]', delay: 1.2, drift: -6 },
  { label: 'Reviewed yearly', sub: 'Your plan keeps up with life', icon: RefreshCw, pos: 'top-[4%] right-[12%] sm:top-[7%] sm:right-[0%]', delay: 1.4, drift: 6 },
  { label: 'Plain language', sub: 'No jargon, ever', icon: MessageCircle, pos: 'bottom-[1%] right-[6%]', delay: 1.6, drift: -5 },
];

// Everything a plan covers, in the order an advisor actually fixes it
const ROWS = [
  { label: 'Cash flow', state: 'done', note: 'Sorted' },
  { label: 'Emergency fund', state: 'done', note: 'Sorted' },
  { label: 'Health & term cover', state: 'started', note: 'In progress', pct: 0.6 },
  { label: 'Investments & goals', state: 'started', note: 'In progress', pct: 0.45 },
  { label: 'Tax planning', state: 'todo', note: 'Next' },
  { label: 'Will & nominees', state: 'todo', note: 'Next' },
];

function PlanCard({ reduce }) {
  return (
    <Frame title="One financial plan covering every area">
      <Backdrop />
      <Card x={30} y={26} w={276} h={230}>
        <T x={52} y={56} s={14} w={700}>Your Financial Plan</T>
        <T x={52} y={74} s={10} w={500} c={C.muted}>One roadmap, built around your life</T>

        {ROWS.map((r, i) => (
          <g key={r.label}>
            <motion.g
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.12 }}
            >
              <Tick cx={62} cy={104 + i * 26} state={r.state} />
              <T x={80} y={108 + i * 26} s={11} w={600} c={r.state === 'todo' ? C.muted : C.ink}>{r.label}</T>
              {r.pct ? (
                <Bar x={206} y={101 + i * 26} w={78} pct={r.pct} />
              ) : (
                <T x={284} y={108 + i * 26} s={9} w={700} c={r.state === 'done' ? C.green : C.muted} a="end">{r.note}</T>
              )}
            </motion.g>
          </g>
        ))}
      </Card>

      <Badge cx={322} cy={54} size={38} name="doc" solid />
      <Pill x={40} y={268} w={104} label="Reviewed yearly" tone="green" />
      <Pill x={158} y={268} w={118} label="Everything connected" />
    </Frame>
  );
}

export default function PlanningMascotIllustration() {
  return (
    <MascotScene alt="SOLAHANA rupee mascot presenting one financial plan that covers every area" chips={CHIPS}>
      {(reduce) => (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute right-[3%] bottom-[15%] w-[47%] drop-shadow-[0_24px_34px_rgba(15,31,69,0.18)]"
        >
          <PlanCard reduce={reduce} />
        </motion.div>
      )}
    </MascotScene>
  );
}
