import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';
import { serif } from './aboutStyles';

const fade = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
};

/* soft misty mountain range, sits in the bottom-right of the Mission card */
function MountainArt() {
  return (
    <svg aria-hidden="true" viewBox="0 0 420 150" preserveAspectRatio="xMaxYMax slice" className="pointer-events-none absolute bottom-0 right-0 h-[62%] w-[62%]">
      <defs>
        <linearGradient id="mv-m1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8EA3C9" stopOpacity="0.85" />
          <stop offset="1" stopColor="#C9D3E6" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="mv-m2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5F7BAE" stopOpacity="0.95" />
          <stop offset="1" stopColor="#B4C2DE" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="mv-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="mv-mask"><rect width="420" height="150" fill="url(#mv-fade)" /></mask>
      </defs>
      <g mask="url(#mv-mask)">
        <path d="M0 150 L40 112 L82 126 L130 78 L176 112 L214 92 L262 40 L300 76 L332 54 L372 18 L420 62 L420 150 Z" fill="url(#mv-m1)" />
        <path d="M120 150 L178 102 L214 120 L270 68 L300 96 L348 44 L420 96 L420 150 Z" fill="url(#mv-m2)" />
        <path d="M262 40 L248 62 L262 58 L272 70 L284 56 L300 76 L282 52 Z" fill="#fff" fillOpacity="0.5" />
        <path d="M372 18 L356 42 L368 38 L380 50 L392 36 L420 62 L396 34 Z" fill="#fff" fillOpacity="0.5" />
      </g>
    </svg>
  );
}

const TOWERS = [
  // [x, width, height]
  [236, 8, 18], [248, 10, 28], [262, 8, 22], [276, 12, 36], [292, 8, 26], [306, 12, 44], [322, 10, 30],
  [338, 14, 58], [356, 10, 38], [370, 16, 80], [390, 12, 54], [406, 14, 104], [424, 10, 62], [438, 12, 128],
];

/* hazy skyline with a bridge, bottom of the Vision card */
function SkylineArt() {
  return (
    <svg aria-hidden="true" viewBox="0 0 460 160" preserveAspectRatio="xMaxYMax slice" className="pointer-events-none absolute bottom-0 right-0 h-[80%] w-[70%] opacity-90">
      <defs>
        <linearGradient id="mv-t" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4F78B8" />
          <stop offset="1" stopColor="#B8C7E2" />
        </linearGradient>
        <linearGradient id="mv-haze" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="mv-sky-mask"><rect width="460" height="160" fill="url(#mv-haze)" /></mask>
      </defs>
      <g mask="url(#mv-sky-mask)">
        {/* far hills */}
        <path d="M0 150 L50 128 L90 142 L130 120 L170 140 L210 126 L250 150 Z" fill="#C7D1E6" fillOpacity="0.6" />
        {/* bridge */}
        <path d="M0 148 H260" stroke="#9FB1D3" strokeWidth="2" />
        <path d="M60 148 V118 M60 118 Q110 140 160 148 M60 118 Q20 138 0 148" stroke="#9FB1D3" strokeWidth="1.4" fill="none" />
        {TOWERS.map(([x, w, h]) => (
          <g key={x}>
            <rect x={x} y={160 - h} width={w} height={h} fill="url(#mv-t)" />
            <rect x={x + 2} y={160 - h + 6} width={w - 4} height={h - 6} fill="#fff" fillOpacity="0.16" />
          </g>
        ))}
        <rect x="0" y="152" width="460" height="8" fill="#B8C7E2" fillOpacity="0.55" />
      </g>
    </svg>
  );
}

function Card({ icon: Icon, title, children, art }) {
  return (
    <motion.article
      {...fade}
      className="relative overflow-hidden rounded-2xl border border-[#E7EAF2] bg-gradient-to-br from-white via-[#FBFBFD] to-[#F1F4FA] px-6 py-6 shadow-[0_14px_34px_rgba(15,31,69,0.1)] sm:px-8 sm:py-7"
    >
      {art}
      <div className="relative flex items-start gap-5 sm:gap-6">
        <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#0A1836] text-[#E2B24E] shadow-[0_8px_20px_rgba(10,24,54,0.35)] sm:h-[84px] sm:w-[84px]">
          <Icon className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={1.6} />
        </span>
        <div className="min-w-0">
          <h2 style={serif} className="text-[30px] font-semibold leading-none text-[#0F1F45] sm:text-[34px]">{title}</h2>
          <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.6] text-[#334155] sm:text-[15px]">{children}</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function AboutMissionVisionCards() {
  return (
    <section aria-label="Mission and vision" className="bg-white py-6 sm:py-7">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 px-5 sm:px-8 lg:grid-cols-2 lg:gap-6 lg:px-10">
        <Card icon={Target} title="Our Mission" art={<MountainArt />}>
          “To engineer absolute financial clarity and multi-generational prosperity for families by providing objective, zero-bias strategic guidance, completely free from the pressures of product-pushing and corporate sales quotas.”
        </Card>
        <Card icon={Eye} title="Our Vision" art={<SkylineArt />}>
          “To set the gold standard in independent Family Office architecture, where every client relationship is anchored on uncompromising integrity, institutional rigor, and long-term fiduciary dedication.”
        </Card>
      </div>
    </section>
  );
}
