import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, TrendingUp, Target } from 'lucide-react';
import MascotScene from './MascotScene';

// Rising coin stacks: small, steady amounts that keep building up
const STACKS = [
  { coins: 4, left: '53%' },
  { coins: 7, left: '64%' },
  { coins: 10, left: '75%' },
  { coins: 14, left: '86%' },
];

const COIN_H = 17; // visible thickness of one coin (svg units)
const COIN_W = 100;

function CoinStack({ coins, delay, reduce, withSapling }) {
  const uid = React.useId().replace(/:/g, '');
  const sideId = `coinSide${uid}`;
  const topId = `coinTop${uid}`;
  const bodyH = coins * COIN_H;
  const topY = 30; // room for the top face + sapling
  const saplingH = withSapling ? 70 : 0;
  const h = saplingH + topY + bodyH + 16;
  const baseY = h - 16;

  return (
    <svg viewBox={`0 0 ${COIN_W + 8} ${h}`} className="w-full h-auto overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={sideId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9A7326" />
          <stop offset="35%" stopColor="#E5C158" />
          <stop offset="70%" stopColor="#C89B3C" />
          <stop offset="100%" stopColor="#8A6419" />
        </linearGradient>
        <radialGradient id={topId} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFF1C2" />
          <stop offset="60%" stopColor="#E5C158" />
          <stop offset="100%" stopColor="#B8862B" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx={COIN_W / 2 + 4} cy={baseY + 8} rx={56} ry={8} fill="#14224F" opacity="0.12" />

      {Array.from({ length: coins }).map((_, i) => {
        const y = baseY - (i + 1) * COIN_H;
        return (
          <motion.g
            key={i}
            initial={reduce ? false : { opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: delay + i * 0.06, ease: 'easeOut' }}
          >
            <path
              d={`M4 ${y + 8} L4 ${y + COIN_H + 8} A${COIN_W / 2} 9 0 0 0 ${COIN_W + 4} ${y + COIN_H + 8} L${COIN_W + 4} ${y + 8} Z`}
              fill={`url(#${sideId})`}
            />
            <path
              d={`M4 ${y + COIN_H + 8} A${COIN_W / 2} 9 0 0 0 ${COIN_W + 4} ${y + COIN_H + 8}`}
              stroke="#7A5712"
              strokeOpacity="0.35"
              strokeWidth="1.2"
              fill="none"
            />
            <ellipse cx={COIN_W / 2 + 4} cy={y + 8} rx={COIN_W / 2} ry={9} fill={`url(#${topId})`} stroke="#B8862B" strokeWidth="1" />
          </motion.g>
        );
      })}

      {/* ₹ embossed on the top coin */}
      <motion.text
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + coins * 0.06 + 0.1 }}
        x={COIN_W / 2 + 4}
        y={baseY - coins * COIN_H + 12}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="#8A6419"
      >
        ₹
      </motion.text>

      {withSapling && (
        <motion.g
          initial={reduce ? false : { opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: delay + coins * 0.06 + 0.3, ease: 'backOut' }}
          style={{ transformOrigin: `${COIN_W / 2 + 4}px ${baseY - coins * COIN_H}px` }}
        >
          <path
            d={`M${COIN_W / 2 + 4} ${baseY - coins * COIN_H + 2} C ${COIN_W / 2 + 6} ${baseY - coins * COIN_H - 30}, ${COIN_W / 2 + 2} ${baseY - coins * COIN_H - 45}, ${COIN_W / 2 + 4} ${baseY - coins * COIN_H - 62}`}
            stroke="#14224F"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M${COIN_W / 2 + 4} ${baseY - coins * COIN_H - 30} c -26 -4 -34 -22 -30 -32 c 18 -2 30 12 30 32 Z`}
            fill="#14224F"
          />
          <path
            d={`M${COIN_W / 2 + 4} ${baseY - coins * COIN_H - 44} c 24 -6 32 -24 28 -34 c -18 0 -30 14 -28 34 Z`}
            fill="#C89B3C"
          />
          <path
            d={`M${COIN_W / 2 + 4} ${baseY - coins * COIN_H - 60} c -14 -6 -16 -18 -12 -24 c 10 2 14 12 12 24 Z`}
            fill="#14224F"
          />
        </motion.g>
      )}
    </svg>
  );
}

const CHIPS = [
  { label: 'Monthly SIP', sub: 'Auto-invested, every month', icon: Repeat, pos: 'top-[13%] left-[8%]', delay: 1.2, drift: -6 },
  { label: 'Compounding', sub: 'Growth on your growth', icon: TrendingUp, pos: 'top-[7%] right-[12%] sm:right-[0%]', delay: 1.4, drift: 6 },
  { label: 'Goal-linked', sub: 'Home · Education · Retirement', icon: Target, pos: 'bottom-[1%] right-[6%]', delay: 1.6, drift: -5 },
];

export default function WealthCreationMascotIllustration() {
  return (
    <MascotScene alt="SOLAHANA rupee mascot pointing to growing stacks of coins" chips={CHIPS}>
      {(reduce) => (
        <>
          {/* Growth path rising over the stacks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <marker id="wealthArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill="#2F5BC7" />
              </marker>
            </defs>
            <motion.path
              d="M 51 52 C 62 50, 70 40, 80 34 S 90 27, 93 24"
              stroke="#C89B3C"
              strokeWidth="0.45"
              strokeDasharray="1.4 1.4"
              strokeLinecap="round"
              fill="none"
              markerEnd="url(#wealthArrow)"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            />
          </svg>

          {/* Ground line the whole scene stands on */}
          <div className="absolute left-[6%] right-[2%] bottom-[14%] h-px bg-gradient-to-r from-transparent via-[#C89B3C]/50 to-transparent" />

          {/* Rising coin stacks */}
          {STACKS.map((s, i) => (
            <div key={i} className="absolute bottom-[13.2%] w-[11%]" style={{ left: s.left }}>
              <CoinStack coins={s.coins} delay={0.3 + i * 0.18} reduce={reduce} withSapling={i === STACKS.length - 1} />
            </div>
          ))}
        </>
      )}
    </MascotScene>
  );
}
