import React from 'react';

/**
 * Illustrated people, drawn in the brand palette, so every age group sees
 * someone like them. Deliberately simple and warm — no stock-photo clichés.
 *
 * tone: skin tone, hair: hair colour, style: 'short' | 'bun' | 'braid' | 'bald'
 */
const SKIN = ['#E8B98F', '#D79F72', '#C0855A', '#F0C9A4'];

export function PersonAvatar({
  size = 96,
  tone = SKIN[0],
  hair = '#1C1917',
  style = 'short',
  beard = false,
  glasses = false,
  outfit = '#1A3170',
  accent = '#C9A04F',
  ring = true,
  className = '',
}) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role="img" aria-hidden="true">
      <defs>
        <clipPath id={`clip-${tone}-${hair}-${style}-${outfit}`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>

      {/* plate */}
      <circle cx="50" cy="50" r="48" fill="#F4F6FB" />
      {ring && <circle cx="50" cy="50" r="47" fill="none" stroke={accent} strokeOpacity="0.55" strokeWidth="1.6" />}

      <g clipPath={`url(#clip-${tone}-${hair}-${style}-${outfit})`}>
        {/* shoulders */}
        <path d="M14 100c0-19 16-30 36-30s36 11 36 30z" fill={outfit} />
        <path d="M41 73l9 11 9-11 4 2-13 16-13-16z" fill={accent} opacity="0.9" />

        {/* neck + head */}
        <rect x="43" y="56" width="14" height="14" rx="7" fill={tone} />
        <ellipse cx="50" cy="42" rx="17" ry="19" fill={tone} />

        {/* hair */}
        {style === 'short' && <path d="M32 42c0-13 8-20 18-20s18 7 18 20c0-7-6-10-18-10s-18 3-18 10z" fill={hair} />}
        {style === 'bun' && (
          <>
            <path d="M32 42c0-13 8-20 18-20s18 7 18 20c-2-8-8-11-18-11s-16 3-18 11z" fill={hair} />
            <circle cx="50" cy="17" r="7" fill={hair} />
          </>
        )}
        {style === 'braid' && (
          <>
            <path d="M31 44c0-14 8-22 19-22s19 8 19 22c-3-9-9-13-19-13s-16 4-19 13z" fill={hair} />
            <path d="M67 44c4 8 4 18 2 26-4-3-6-9-6-16z" fill={hair} />
          </>
        )}
        {style === 'bald' && <path d="M34 38c2-10 8-16 16-16s14 6 16 16c-4-5-9-7-16-7s-12 2-16 7z" fill={hair} opacity="0.85" />}

        {/* face */}
        <circle cx="43.5" cy="43" r="1.9" fill="#20242E" />
        <circle cx="56.5" cy="43" r="1.9" fill="#20242E" />
        <path d="M44.5 50.5c1.8 2 7.2 2 9 0" stroke="#20242E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {beard && <path d="M35 45c1 12 7 17 15 17s14-5 15-17c-3 8-8 11-15 11s-12-3-15-11z" fill={hair} opacity="0.9" />}

        {glasses && (
          <g stroke="#20242E" strokeWidth="1.6" fill="none" opacity="0.85">
            <circle cx="43.5" cy="43" r="6" />
            <circle cx="56.5" cy="43" r="6" />
            <path d="M49.5 43h1M37.5 42l-4-1M62.5 42l4-1" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
}

/** The six people used across the site, from first job to retired life. */
export const PEOPLE = [
  { key: 'first-job', age: '22–28', label: 'First job', props: { tone: SKIN[0], hair: '#1C1917', style: 'short', outfit: '#2F5BC7' } },
  { key: 'newly-married', age: '28–34', label: 'Newly married', props: { tone: SKIN[3], hair: '#241C18', style: 'bun', outfit: '#C9A04F', accent: '#1A3170' } },
  { key: 'parents', age: '32–45', label: 'Young parents', props: { tone: SKIN[1], hair: '#1C1917', style: 'short', beard: true, outfit: '#1A3170' } },
  { key: 'peak', age: '40–50', label: 'Peak earning years', props: { tone: SKIN[2], hair: '#2A2320', style: 'braid', outfit: '#24408A' } },
  { key: 'pre-retirement', age: '50–60', label: 'Nearing retirement', props: { tone: SKIN[0], hair: '#6B6B6B', style: 'short', glasses: true, beard: true, outfit: '#0F1F45' } },
  { key: 'retired', age: '60+', label: 'Retired', props: { tone: SKIN[3], hair: '#9A9A9A', style: 'bun', glasses: true, outfit: '#A67C2E', accent: '#0F1F45' } },
];

export default PersonAvatar;
