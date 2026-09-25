import React, { useId } from 'react';
import { Icon } from './illustrations/kit';

// Category -> icon + tone. Unknown categories fall back to a neutral cover.
const MAP = {
  'SIP & Mutual Funds': ['repeat', 0],
  'Tax Planning': ['scale', 1],
  'Retirement Planning': ['sun', 2],
  'Wealth Creation': ['trend', 0],
  'Market Insights': ['trend', 1],
  'Financial Literacy': ['cap', 2],
  'Insurance': ['shield', 1],
  'Goal Planning': ['flag', 2],
};
const TONES = [
  ['#2F5BC7', '#4F86F2'],
  ['#0F1F45', '#1F3A7A'],
  ['#1A3170', '#6C9BF2'],
];

/**
 * Blog cover: shows an uploaded image when one exists, otherwise a clean
 * generated cover in the brand palette (no external stock photos).
 */
export default function BlogCover({ src, category, title, className = '' }) {
  const gid = useId().replace(/:/g, '');
  if (src && !src.includes('images.unsplash.com')) {
    return <img src={src} alt={title} className={`w-full h-full object-cover ${className}`} />;
  }
  const [icon, tone] = MAP[category] || ['doc', 0];
  const [c1, c2] = TONES[tone];
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className={`w-full h-full ${className}`} role="img" aria-label={title}>
      <defs>
        <linearGradient id={`bc${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#bc${gid})`} />
      <circle cx="330" cy="40" r="110" fill="#FFFFFF" opacity="0.07" />
      <circle cx="360" cy="190" r="60" fill="#FFFFFF" opacity="0.06" />
      <path d="M0 176 C 70 164, 110 186, 170 168 S 280 132, 400 142" stroke="#FFFFFF" strokeOpacity="0.28" strokeWidth="2" fill="none" />
      <rect x="262" y="66" width="88" height="88" rx="24" fill="#FFFFFF" opacity="0.14" />
      <rect x="274" y="78" width="64" height="64" rx="18" fill="#FFFFFF" />
      <Icon name={icon} cx={306} cy={110} size={32} color={c1} sw={2} />
    </svg>
  );
}
