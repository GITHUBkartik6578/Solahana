import React from 'react';
import { Link } from 'react-router-dom';
import aboutHero from '../../assets/about-hero-banner.webp';

/* Desktop About hero: the approved picture, edge to edge across the full screen width, at its own 3:2 ratio
   (nothing cropped, no side margins). Invisible links sit over the six planning icons drawn in the picture.
   Tablet / mobile use the live-text hero. */
const W = 1600;
const H = 1066;
// The wording block in the picture was re-centred inside the white panel (shrunk to 90% about its centre),
// so the icon positions below are the original ones passed through the same transform.
const tx = (x) => 1136 + (x - 1178) * 0.9;
const ty = (y) => 300 + (y - 300) * 0.9;
const box = (x0, y0, x1, y1) => ({
  left: `${((tx(x0) / W) * 100).toFixed(3)}%`,
  top: `${((ty(y0) / H) * 100).toFixed(3)}%`,
  width: `${(((tx(x1) - tx(x0)) / W) * 100).toFixed(3)}%`,
  height: `${(((ty(y1) - ty(y0)) / H) * 100).toFixed(3)}%`,
});

const LINKS = [
  { label: 'Financial Planning', to: '/financial-planning', style: box(822, 436, 934, 574) },
  { label: 'Investment Planning', to: '/investments', style: box(942, 436, 1054, 574) },
  { label: 'Retirement Planning', to: '/calculators/retirement', style: box(1062, 436, 1174, 574) },
  { label: 'Risk Planning', to: '/risk-management', style: box(1182, 436, 1294, 574) },
  { label: 'Tax Planning', to: '/tax-planning', style: box(1302, 436, 1414, 574) },
  { label: 'Estate Planning', to: '/estate-planning', style: box(1422, 436, 1534, 574) },
];

export default function AboutHeroImage() {
  return (
    <section aria-label="About SOLAHANA" className="hidden bg-[#0B1530] pt-[80px] lg:block">
      <h1 className="sr-only">About SOLAHANA: Amit R. Pandey, Chartered Wealth Manager (CWM)</h1>
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <img
          src={aboutHero}
          alt="Amit R. Pandey, Chartered Wealth Manager (CWM), MBA, Ex-Banker, 25+ years of experience in financial services. Qualified and experienced, comprehensive approach, ethical and transparent, long-term partnership."
          width={W}
          height={H}
          draggable="false"
          fetchpriority="high"
          className="absolute inset-0 h-full w-full select-none"
        />
        {LINKS.map((l) => (
          <Link
            key={l.label}
            to={l.to}
            aria-label={l.label}
            className="absolute rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#E2B24E]"
            style={l.style}
          />
        ))}
      </div>
    </section>
  );
}
