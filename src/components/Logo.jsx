import React from 'react';

/**
 * SOLAHANA wordmark — "S" + a rupee symbol nested inside concentric rings
 * standing in for the "O" + "LAHANA" + a TM mark, matching the brand's
 * physical signage/logo.
 *
 * variant: 'dark'  -> for use on the navy background (light wordmark, gold rings)
 *          'light' -> for use on light/white backgrounds (navy wordmark)
 * size:    'sm' | 'md' | 'lg'
 */
export default function Logo({ variant = 'dark', size = 'md', className = '' }) {
  const wordColor = variant === 'dark' ? '#F8F7F3' : '#12224F';
  const ringOuter = variant === 'dark' ? '#F8F7F3' : '#12224F';
  const tmColor = variant === 'dark' ? '#BAC6DA' : '#5B6B8C';

  const sizes = {
    sm: { text: 'text-base', ring: 26, tm: '7px' },
    md: { text: 'text-xl', ring: 34, tm: '9px' },
    lg: { text: 'text-3xl', ring: 46, tm: '11px' },
  };
  const s = sizes[size] || sizes.md;
  const gradId = `solahanaRing-${variant}-${size}`;

  return (
    <span className={`inline-flex items-center leading-none select-none whitespace-nowrap ${className}`}>
      <span
        className={`font-serif-luxury font-bold tracking-tight ${s.text}`}
        style={{ color: wordColor }}
      >
        S
      </span>

      <svg
        width={s.ring}
        height={s.ring}
        viewBox="0 0 40 40"
        className="-mx-[1px] shrink-0"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C878" />
            <stop offset="50%" stopColor="#C8A24A" />
            <stop offset="100%" stopColor="#B8862B" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="none" stroke={ringOuter} strokeWidth="1.4" opacity="0.8" />
        <circle cx="20" cy="20" r="13.4" fill="none" stroke={`url(#${gradId})`} strokeWidth="1.6" />
        <circle cx="20" cy="20" r="8.8" fill="none" stroke={`url(#${gradId})`} strokeWidth="2.1" />
        <text
          x="20.5"
          y="21.5"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="700"
          fontFamily="'Sora', sans-serif"
          fill={`url(#${gradId})`}
        >
          ₹
        </text>
      </svg>

      <span
        className={`font-serif-luxury font-bold tracking-tight ${s.text}`}
        style={{ color: wordColor }}
      >
        LAHANA
      </span>

      <sup
        className="ml-0.5 font-sora font-semibold"
        style={{ fontSize: s.tm, color: tmColor }}
      >
        TM
      </sup>
    </span>
  );
}
