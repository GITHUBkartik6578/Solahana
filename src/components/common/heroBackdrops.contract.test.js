import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Source-contract tests for the hero sections. Zooming in only makes the page narrower, so a hero has to scale with the page width
 * (like a banner picture) instead of switching layout or leaving blurred / empty bands around the picture. These tests keep that:
 *  - banner pictures are shown whole, scaled to the width, from tablet width up;
 *  - live-text heroes are laid out once and scaled (ScaledStage), from tablet width up;
 *  - no blurred, enlarged copy of a hero picture is used as a backdrop.
 */
const read = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), 'utf8').replace(/\r\n/g, '\n');
const bannerFull = read('./HeroBanner.jsx');
const banner = bannerFull.slice(bannerFull.indexOf('*/') + 2); // code only, without the explanatory comment
const stage = read('./ScaledStage.jsx');
const template = read('../planning-pages/PlanningPageTemplate.jsx');
const who = read('../../pages/WhoWeServePage.jsx');
const fp = read('../../pages/FinancialPlanningPage.jsx');
const terms = read('../legal/TermsLayout.jsx');
const imgTags = (src) => src.match(/<img[\s\S]*?\/>/g) || [];

describe('banner heroes scale with the page width at every zoom level', () => {
  it('HeroBanner shows the whole picture at the page width (aspect-ratio box, no crop, no blur, no filler)', () => {
    expect(banner).toContain('style={{ aspectRatio: ratio.toFixed(4) }}');
    expect(banner).toContain('relative w-full overflow-hidden');
    expect(banner).not.toMatch(/max-w-\[1920px\]/); // no width cap: wider than 1920 must not leave side bands
    expect(banner).toContain('className="block h-full w-full select-none"');
    expect(banner).not.toMatch(/blur|scale-1[0-9]0|object-cover|mask-image|100svh|100vh/);
    imgTags(banner).forEach((tag) => expect(tag).not.toMatch(/blur|object-cover|scale-/));
  });

  it('HeroBanner is shown from tablet width (sm) up, not only on large screens', () => {
    expect(banner).toContain('relative hidden bg-[#0A1836] pt-[80px] sm:block any-pointer-fine:block');
    expect(banner).not.toContain('lg:block');
  });

  it('the live-text sections that sit beside a banner are hidden from tablet width up, so there is never a layout switch while zooming', () => {
    expect(template).toContain("${b ? ' sm:hidden any-pointer-fine:hidden' : ''}");
    const heroSrc = template.slice(template.indexOf('function Hero({ cfg })'), template.indexOf('function Philosophy({ cfg })'));
    expect(heroSrc).not.toContain("' lg:hidden'");
    expect(who).toContain('pt-[80px] sm:hidden any-pointer-fine:hidden">');
    expect(fp).toContain('pt-[80px] sm:hidden any-pointer-fine:hidden">');
    expect(who).not.toContain('pt-[80px] lg:hidden">');
    expect(fp).not.toContain('pt-[80px] lg:hidden">');
    expect(terms).toContain('className="hidden bg-[#0A1836] pt-[80px] sm:block any-pointer-fine:block"');
    expect(terms.split("${BANNERS[page.art] ? 'sm:hidden any-pointer-fine:hidden' : ''}").length - 1).toBe(2);
    expect(terms).not.toContain("'lg:hidden' : ''");
  });

  it('a panel laid over a banner picture is scaled with the picture (ScaledOverlay)', () => {
    expect(bannerFull).toContain("import { ScaledOverlay } from './ScaledStage';");
    expect(banner).toContain('<ScaledOverlay className="pointer-events-none z-20">');
  });
});

describe('live-text heroes are laid out once and scaled', () => {
  it('ScaledStage lays content out at a fixed design width and scales it to the available width, only from 640px up', () => {
    expect(stage).toContain('designWidth = 1440');
    expect(stage).toContain('minWidth = 640');
    expect(stage).toContain("matchMedia?.('(any-pointer: fine)')");
    expect(stage).toContain('const scale = width / designWidth;');
    expect(stage).toContain("transformOrigin: 'top left'");
    expect(stage).toContain('@container');
  });

  it('the planning hero is wrapped in ScaledStage and uses container variants, not viewport breakpoints', () => {
    const start = template.indexOf('function Hero({ cfg })');
    const hero = template.slice(start, template.indexOf('function Philosophy({ cfg })'));
    expect(hero).toContain('<ScaledStage>');
    expect(hero).toContain('</ScaledStage>');
    expect(hero).toContain('@5xl:');
    expect(hero).not.toMatch(/\blg:|\bsm:(?!hidden)/);
    expect(hero).not.toMatch(/100svh|vw,|clamp\(34px/);
  });

  it('no hero picture is used as a blurred, enlarged backdrop', () => {
    imgTags(template).forEach((tag) => expect(tag, tag.slice(0, 80)).not.toMatch(/blur-2xl|blur-xl|scale-125|scale-150/));
    expect(template).not.toContain('soft copy of the photo fills the space beside it');
  });

  it('the tall-photo variant fades its top and left edges into the navy instead of showing hard edges', () => {
    expect(template).toContain('linear-gradient(to right, transparent, black 22%), linear-gradient(to bottom, transparent, black 12%)');
  });
});

describe('footer and the other heroes are zoom-invariant too', () => {
  const footer = read('../Footer.jsx');
  const home = read('../Hero.jsx');
  const slides = read('../PlanningSlides.jsx');
  const process = read('../../pages/OurProcessPage.jsx');
  const heroFiles = [
    ['../goals/GoalsHero.jsx'],
    ['../investments/InvestmentsHero.jsx'],
    ['../calculators/CalculatorsHero.jsx'],
    ['../contact/ContactHero.jsx'],
  ].map(([f]) => [f, read(f)]);

  it('the footer is laid out once at the design width and scaled', () => {
    expect(footer).toContain("import ScaledStage from './common/ScaledStage';");
    expect(footer).toContain('<ScaledStage>');
    expect(footer).not.toMatch(/(?:sm|md|lg|xl):|\d+vw/);
  });

  it('the home hero and its slides use the stage, container variants and no viewport units', () => {
    expect(home).toContain('<ScaledStage>');
    expect(home).not.toMatch(/(?:sm|md|lg|xl):|\d+svh|\d+vw/);
    expect(slides).not.toMatch(/(?:sm|md|lg|xl):|\d+svh|\d+vw/);
  });

  it('the page heroes are wrapped in ScaledStage without viewport breakpoints', () => {
    heroFiles.forEach(([f, src]) => {
      expect(src, f).toContain('<ScaledStage>');
      expect(src, f).not.toMatch(/(?:sm|md|lg|xl):/);
    });
    const hero = process.slice(process.indexOf('function Hero() {'), process.indexOf('function Journey()'));
    expect(hero).toContain('<ScaledStage>');
    expect(hero).not.toMatch(/(?:sm|md|lg|xl):|\d+vw/);
  });
});

describe('investment page heroes are zoom-invariant', () => {
  const design = read('../invest/DesignSections.jsx');
  const detail = read('../../pages/invest/InvestDetailPage.jsx');

  it('PhotoHero and the invest detail hero use the stage with container variants and no viewport units', () => {
    const photo = design.slice(design.indexOf('export function PhotoHero'), design.indexOf('export function IconPhilosophy'));
    expect(photo).toContain('<ScaledStage>');
    expect(photo).not.toMatch(/(?:sm|md|lg|xl):|\d+vw|svh/);
    const hero = detail.slice(detail.indexOf('<ScaledStage>'), detail.indexOf('</ScaledStage>'));
    expect(hero.length).toBeGreaterThan(500);
    expect(hero).not.toMatch(/(?:sm|md|lg|xl):/);
  });
});

describe('phone-only hero photo framing (Real Estate, PMS, Financial Planning, Equities)', () => {
  const invest = read('../../data/investPages.js');
  const pageSrc = (name) => invest.slice(invest.indexOf(`export const ${name}`), invest.indexOf('export const', invest.indexOf(`export const ${name}`) + 10));
  const design = read('../invest/DesignSections.jsx');
  const fpPage = read('../../pages/FinancialPlanningPage.jsx');

  it('only Real Estate and PMS opt in to the whole-photo phone panel; the other pages keep their panels', () => {
    expect(pageSrc('REAL_ESTATE_PAGE')).toContain('mobileFullPhoto: true');
    expect(pageSrc('PMS_AIF_PAGE')).toContain('mobileFullPhoto: true');
    ['MUTUAL_FUNDS_PAGE', 'BONDS_PAGE', 'EQUITY_PAGE'].forEach((n) => expect(pageSrc(n), n).not.toContain('mobileFullPhoto'));
    expect(read('../../data/planningPages.js')).not.toContain('mobileFullPhoto');
  });

  it('the template gives an opted-in page a panel with the photo own aspect ratio on phones and restores the old sizes from the tablet container width up', () => {
    expect(template).toContain("cfg.mobileFullPhoto ? 'aspect-(--hero-ar) @2xl:aspect-auto' : 'h-[360px]'");
    expect(template).toContain("'--hero-ar': cfg.heroAspect");
    expect(template).toContain('inset-0 h-full w-full @2xl:inset-auto @2xl:inset-y-0 @2xl:right-0 @2xl:w-auto');
  });

  it('Equities: 370px phone panel framed from the top, tablet framing unchanged', () => {
    const photo = design.slice(design.indexOf('export function PhotoHero'), design.indexOf('export function IconPhilosophy'));
    expect(photo).toContain('h-[370px]');
    expect(photo).not.toContain('h-[320px]');
    expect(photo).toContain('object-[50%_0%] @2xl:object-[50%_28%]');
  });

  it('Financial Planning: phones use the text-free fp-hero.webp, the desktop banner still uses fp-hero-banner.webp', () => {
    expect(fpPage).toContain("import heroPhoto from '../assets/planning/fp-hero.webp'");
    expect(fpPage).toContain("import heroBanner from '../assets/planning/fp-hero-banner.webp'");
    expect(fpPage).toMatch(/src=\{heroPhoto\}[\s\S]{0,200}object-\[60%_40%\]/);
    expect(fpPage).toMatch(/<HeroBanner[\s\S]{0,60}src=\{heroBanner\}/);
  });
});
