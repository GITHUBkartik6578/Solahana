import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Guards against claims that SOLAHANA itself, or its advisers, are SEBI-registered, an RIA, or a SEBI/IRDA-regulated or
 * -aligned fiduciary. SOLAHANA has no SEBI registration of its own. These tests read the active source (line endings
 * normalised) and fail if such a claim comes back.
 *
 * They deliberately do NOT cover claims about third-party partners ("SEBI/AMFI-registered institutional partners",
 * "SEBI-registered brokerages", "SEBI-regulated Category I, II and III AIFs"): those are a separate, open review item,
 * listed in ALLOWED_PARTNER_CLAIMS so that nothing new of that kind appears unnoticed.
 */
const root = fileURLToPath(new URL('../../', import.meta.url));
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = `${dir}${name}`;
    if (statSync(full).isDirectory()) return name === 'node_modules' || name === 'assets' ? [] : walk(`${full}/`);
    return [full];
  });
const read = (f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

const sources = [...walk(`${root}src/`), ...walk(`${root}server/`)].filter((f) => /\.(jsx?|html)$/.test(f) && !/\.test\.js$/.test(f));
const rel = (f) => f.slice(root.length).replace(/\\/g, '/');

// Claims about SOLAHANA / its advisers. Each must match nothing in any active source file.
const FORBIDDEN = [
  ['SEBI-registered + adviser/fiduciary/planning/RIA/standard', /SEBI[- ]registered\s+(?:wealth\s+|SOLAHANA\s+)?(?:advis|fiduciar|plann|RIA|standard|team|firm)/i],
  ['SEBI Registered RIA', /SEBI[- ]registered\s+RIA/i],
  ['registered adviser wording', /\bregistered\s+(?:SOLAHANA\s+)?(?:wealth\s+)?advis[eo]r/i],
  ['RIA as a standalone claim', /\bRIA\b/],
  ['SEBI Registered Standards / Planning Standard', /SEBI[- ]registered\s+(?:standards|planning)/i],
  ['SEBI fiduciary', /SEBI\s+fiduciary/i],
  ['SEBI regulated (said of Solahana)', /SEBI[- ]regulated(?!\s+Category)/i],
  ['SEBI/IRDA aligned', /SEBI(?:\/IRDA)?[- ]aligned/i],
  ['SEBI compliance standards', /SEBI\s+compliance/i],
  ['fiduciary offering', /fiduciary\s+offering/i],
  ['registered with / regulated by / authorised by SEBI', /(?:registered|regulated|authori[sz]ed|licen[sc]ed|approved)\s+(?:with|by)\s+(?:the\s+)?SEBI/i],
  ['SEBI licensed / authorised / approved', /SEBI[- ](?:licen[sc]ed|authori[sz]ed|approved|recogni[sz]ed)/i],
  ['IRDA / IRDAI registered or aligned (said of Solahana or its advisers)', /IRDAI?[- ](?:registered|regulated|licen[sc]ed|authori[sz]ed|aligned|approved)/i],
  ['AMFI registered adviser / planner / Solahana', /AMFI[- ]registered\s+(?:solahana|advis|plann|wealth|RIA|team|firm|entity)/i],
];

describe('no claim that SOLAHANA or its advisers are SEBI-registered, an RIA, or SEBI-regulated', () => {
  it('scans a real set of source files', () => {
    expect(sources.length).toBeGreaterThan(150);
    expect(sources.some((f) => f.endsWith('Footer.jsx'))).toBe(true);
    expect(sources.some((f) => rel(f).startsWith('server/'))).toBe(true);
  });

  FORBIDDEN.forEach(([name, re]) => {
    it(`no active source file contains: ${name}`, () => {
      const hits = sources.filter((f) => re.test(read(f))).map(rel);
      expect(hits).toEqual([]);
    });
  });

  it('the pattern set catches the exact claims that were removed', () => {
    const removed = [
      'SEBI registered fiduciary offering goal-based financial planning',
      'Talk to a SEBI registered wealth advisor',
      'SEBI-Registered Fiduciary',
      'SEBI Registered RIA',
      'certified SEBI Registered RIA advisor',
      'SEBI Registered SOLAHANA Wealth Advisor',
      'SEBI-Registered Planning Standard',
      'SEBI Registered Planning • Zero Conflict',
      'SEBI-registered fiduciary model',
      'SEBI Fiduciary',
      'SEBI Regulated',
      'SEBI Registered Standards',
      'SEBI/IRDA aligned fiduciary advice',
      'Legal & SEBI-aligned fiduciary model',
      'SEBI compliance standards',
    ];
    removed.forEach((text) => expect(FORBIDDEN.some(([, re]) => re.test(text)), text).toBe(true));
  });
});

describe('SEO metadata and page titles', () => {
  const html = read(`${root}index.html`);
  const seo = read(`${root}src/components/ScrollToTopAndSEO.jsx`);

  it('index.html mentions neither SEBI, an RIA, nor fiduciary status', () => {
    expect(html).not.toMatch(/SEBI|\bRIA\b|fiduciar/i);
  });

  it('the description and Open Graph description state what the site offers, not a registration', () => {
    const description = html.match(/<meta name="description" content="([^"]*)"/)[1];
    const og = html.match(/<meta property="og:description" content="([^"]*)"/)[1];
    expect(description).toContain('Goal-based financial planning tools and educational resources');
    expect(og).toContain('Goal-based financial planning tools and educational resources');
    [description, og].forEach((t) => expect(t).not.toMatch(/registered|regulated|licen[sc]ed|fiduciar|certified|SEBI/i));
  });

  it('the title, og:title and twitter:title are the same neutral title', () => {
    const title = html.match(/<title>([^<]*)<\/title>/)[1];
    expect(title).toBe('SOLAHANA — Financial Planning for Indian Families');
    expect(html).toContain(`<meta property="og:title" content="${title}" />`);
    expect(html).toContain(`<meta name="twitter:title" content="${title}" />`);
  });

  it('the per-page document titles carry no fiduciary or registration wording', () => {
    expect(seo).not.toMatch(/fiduciar|SEBI|registered/i);
    expect(seo).toContain("'SOLAHANA — Financial Planning for Indian Families'");
    expect(seo).toContain("document.title = 'SOLAHANA — Financial Planning';");
  });
});

describe('the replacement wording does not itself make a registration claim, and does not claim to be unregistered', () => {
  const replacements = [
    'Goal-Based Financial Planning',
    'Talk to a Solahana planner about your life goals',
    'with a Solahana planner.',
    'Client-first planning model',
    'Client-first insurance planning',
    'Client-first planning framework',
  ];
  it('uses plain descriptive wording', () => {
    replacements.forEach((t) => {
      expect(t).not.toMatch(/registered|regulated|licen[sc]ed|SEBI|AMFI|IRDA|RIA|unregistered|not registered/i);
    });
  });

  it('no active source file says SOLAHANA is unregistered or exempt (that would be a separate, unverified legal statement)', () => {
    const hits = sources.filter((f) => /(?:not|un)[- ]?registered\s+with\s+SEBI|exempt from (?:SEBI )?registration/i.test(read(f))).map(rel);
    expect(hits).toEqual([]);
  });
});

describe('third-party partner and regulator mentions: an exact register, with nothing left over on the same line', () => {
  // Claims about unnamed third parties or about product categories. They are NOT endorsed here: they are open items for
  // owner and legal review. Each entry is an exact snippet in an exact file. The line may contain nothing else that names a
  // regulator, so a false clause cannot be appended to an allowed line without failing the test.
  const REGISTER = [
    ['src/components/home/HomeSections.jsx', 'Execution via SEBI/AMFI'],
    ['src/data/investPages.js', 'SEBI/AMFI-registered partners'],
    ['src/data/investPages.js', 'SEBI-regulated Category I, II, and III AIFs'], // a fact about the AIF product category
    ['src/data/investPages.js', 'SEBI/AMFI-registered institutional partners'],
    ['src/data/investPages.js', 'SEBI-registered brokerages'],
    ['src/data/planningPages.js', 'SEBI and AMFI-registered institutional channel partners'],
    ['src/data/legalPages.js', 'AMFI-registered structures'], // legal text, counsel only
    ['src/data/legalPages.js', 'AMFI-registered distributors'], // legal text, counsel only
    ['src/pages/OurProcessPage.jsx', 'SEBI and AMFI-registered institutional channel partners'],
    ['src/pages/WhoWeServePage.jsx', 'SEBI and AMFI-registered channel partners'],
  ];
  const REGULATOR = /SEBI|AMFI|IRDAI?|PFRDA/;
  const textFiles = [...sources, `${root}index.html`, `${root}README.md`, `${root}public/robots.txt`];

  it('every line naming SEBI, AMFI, IRDA or PFRDA is a registered snippet, and nothing else on that line names a regulator', () => {
    const problems = [];
    textFiles.forEach((f) => {
      (read(f).match(/[^\n]*(?:SEBI|AMFI|IRDAI?|PFRDA)[^\n]*/g) || []).forEach((line) => {
        const hits = REGISTER.filter(([file, snippet]) => file === rel(f) && line.includes(snippet));
        if (hits.length === 0) return problems.push(`${rel(f)}: not registered: ${line.trim().slice(0, 100)}`);
        const rest = hits.reduce((l, [, snippet]) => l.split(snippet).join(''), line);
        if (REGULATOR.test(rest)) problems.push(`${rel(f)}: extra regulator mention on a registered line: ${line.trim().slice(0, 100)}`);
      });
    });
    expect(problems).toEqual([]);
  });

  it('every register entry still exists, so a removed or reworded claim is noticed and the entry is deleted', () => {
    REGISTER.forEach(([file, snippet]) => expect(read(`${root}${file}`), `${file}: ${snippet}`).toContain(snippet));
  });

  it('no register entry says anything about SOLAHANA itself', () => {
    REGISTER.forEach(([, snippet]) => expect(snippet).not.toMatch(/solahana|our |we |advis|plann|fiduciar|RIA\b/i));
  });
});

describe('absolute safety, security and return promises are not used', () => {
  // These phrases promise an outcome or a level of security that cannot be backed. Each must match nothing in active source.
  const PROMISES = [
    ['bank-grade', /bank[- ]grade/i],
    ['100% secured / safe', /100%\s+(?:secured|safe)\b/i],
    ['beat inflation effortlessly', /beat\s+inflation\s+effortlessly/i],
    ['unshakeable', /unshakea?ble\s+yields?/i],
    ['uncompromising safety', /uncompromising\s+safety/i],
    ['guaranteed coupon / yield / returns', /guaranteed\s+(?:coupon|yield|returns?)/i],
    ['capital-guaranteed', /capital[- ]guaranteed/i],
    ['sovereign-guaranteed / risk-free assets', /sovereign[- ]guaranteed|risk-free\s+assets/i],
    ['zero equity volatility risk', /zero\s+equity\s+volatility\s+risk/i],
    ['precision forecasting / precision calculators', /precision\s+(?:forecasting|calculators)/i],
    ['guarantees that ...', /\bguarantees\s+that\b/i],
    ['ensures a promised outcome', /\bensur(?:es|ing)\s+(?:complete|maximum|total|every\s+rupee|you\s+pay\s+only|your\s+(?:family|coverage|legacy|equity\s+portfolio|real\s+estate)|only\s+capital)/i],
    ['100% on track / fulfilled / inflation protected', /stay\s+100%|100%\s+(?:fulfilled|on\s+track|inflation\s+protected)/i],
    ['alpha promises', /(?:high|superior)[- ]alpha|alpha\s+for\s+your|domestic\s+alpha|high-conviction\s+alpha|your\s+alpha\./i],
    ['zero product bias / zero bias / zero product pushing', /zero[- ](?:product[- ])?(?:bias|pushing)/i],
    ['maximum capital safety', /maximum\s+(?:capital\s+safety|savings\s+without|net\s+worth\s+accumulation)/i],
    ['complete safety and compliance', /complete\s+safety/i],
    ['absolute financial clarity', /absolute\s+financial\s+clarity|absolute\s+clarity/i],
    ['total / complete peace of mind', /(?:total|complete)\s+peace\s+of\s+mind/i],
    ['safe with us (absolute data-safety promise)', /safe\s+with\s+us/i],
  ];
  PROMISES.forEach(([name, re]) => {
    it(`no active source file contains: ${name}`, () => {
      const hits = [...sources, `${root}index.html`].filter((f) => re.test(read(f))).map(rel);
      expect(hits).toEqual([]);
    });
  });

  it('the pattern set catches the exact wording that was removed', () => {
    [
      'Maintain Your Lifestyle & Beat Inflation Effortlessly',
      'Unshakeable Yields, Capital Preservation.',
      'optimizing regular cash flows with uncompromising safety',
      'with bank-grade safety',
      'Bank-Grade 256-Bit SSL',
      'status: \'100% Secured\'',
      'Guaranteed Coupon',
      'capital-guaranteed debt yields',
      'Sovereign-guaranteed risk-free assets',
      'Zero equity volatility risk',
      'Precision Forecasting',
      'A structured estate plan guarantees that your lifelong wealth',
      'Human Life Value (HLV) modeling ensures your family receives adequate financial replacement',
      'A structured retirement strategy ensures complete financial independence',
      'Our ongoing stewardship ensures your real estate portfolio generates optimal yields',
      'seeking superior alpha',
      'Unlock Institutional-Grade Alpha for Your Portfolio',
      'High-alpha portfolio management services',
      'Zero product bias; we do not manufacture',
      'Zero Product Bias',
      'Engineered for Absolute Clarity and Zero Bias',
      '100% Inflation Protected',
      'stay 100% on track',
      '100% government-backed fixed income securities for maximum capital safety',
      'for complete safety and compliance',
      'To engineer absolute financial clarity',
      'Complete Peace of Mind for Your Loved Ones',
    ].forEach((text) => expect(PROMISES.some(([, re]) => re.test(text)), text).toBe(true));
  });

  it('the Principal Officer title is gone from active source, including the founder image alt text (the founder is described as "Founder" elsewhere in the same source)', () => {
    expect(sources.filter((f) => /Principal Officer/.test(read(f))).map(rel)).toEqual([]);
  });
});

describe('the three live issues from the Stage 1 review stay fixed', () => {
  const sha = (file) => createHash('sha256').update(readFileSync(`${root}${file}`)).digest('hex');

  it('the bonds hero no longer uses the baked-text banner picture (the original file is kept, unreferenced)', () => {
    const invest = read(`${root}src/data/investPages.js`);
    const bonds = invest.slice(invest.indexOf('export const BONDS_PAGE'), invest.indexOf('export const', invest.indexOf('export const BONDS_PAGE') + 10));
    expect(bonds).not.toMatch(/banner:\s*\{[^}]*file:\s*'bonds-banner'/);
    expect(invest).not.toContain("file: 'bonds-banner'");
    expect(existsSync(`${root}src/assets/planning/bonds-banner.webp`)).toBe(true); // originals are never deleted
    expect(bonds).toContain("titleWhite: ['Understanding Yields,', 'Risks and Stability.']");
  });

  it('the sign-in dialog makes no encryption or security-level claim', () => {
    expect(read(`${root}src/components/AuthModal.jsx`)).not.toMatch(/\b256\b|SSL|TLS|encrypt|protected by/i);
  });

  it('the founder note image is not the old one with the Principal Officer title, and its alt text says Founder', () => {
    expect(sha('src/assets/about-founder-note.webp')).not.toBe('0a8049dd27107d81f07b996e0a72d5aa19c743f52a805ba319f517f69a13ad96');
    const note = read(`${root}src/components/about/FounderNote.jsx`);
    expect(note).toContain('Amit R. Pandey, CWM®, Founder.');
    expect(note).not.toMatch(/Principal Officer|Wealth Architect/);
  });
});

describe('the two live-text sections applied after review: /about Standard and the /risk-management hero', () => {
  it('/about renders the live-text AboutStandard section, not the baked-text artwork component', () => {
    const page = read(`${root}src/pages/AboutPage.jsx`);
    expect(page).toContain("import AboutStandard from '../components/about/AboutStandard';");
    expect(page).toContain('<AboutStandard />');
    expect(page).not.toContain('SolahanaStandard');
  });

  it('the AboutStandard section names no regulator, no registered partner, and no independence or bias promise', () => {
    const std = read(`${root}src/components/about/AboutStandard.jsx`);
    expect(std).not.toMatch(/SEBI|AMFI|IRDA|registered|regulated|verified/i);
    expect(std).not.toMatch(/independence|unbiased|zero product bias|100%/i);
    expect(std).toContain('Please check each provider’s registration with the regulator before you invest.');
  });

  it('the risk page uses the live-text hero (no banner entry) and neutral badges, and no longer says "regulated partners" or "100% client-aligned"', () => {
    const planning = read(`${root}src/data/planningPages.js`);
    const start = planning.indexOf('export const RISK_PAGE');
    const risk = planning.slice(start, planning.indexOf('philosophy:', start));
    expect(risk).not.toMatch(/banner:\s*\{/);
    expect(risk).not.toContain('risk-banner');
    expect(risk).not.toContain('CLIENT_ALIGNED');
    expect(risk).not.toContain('REGULATED');
    expect(risk).toContain("label: 'Goal-Based Planning Framework'");
    expect(risk).toContain("label: 'Transactions via Third-Party Providers'");
    expect(risk).not.toMatch(/unshakea?ble|regulated|registered/i);
  });

  it('the original images and the privacy banner are untouched by this step (they stay in the repo)', () => {
    ['src/assets/about-standard.webp', 'src/assets/planning/risk-banner.webp', 'src/assets/privacy-hero-banner.webp'].forEach((f) => expect(existsSync(`${root}${f}`), f).toBe(true));
    const sha = createHash('sha256').update(readFileSync(`${root}src/assets/privacy-hero-banner.webp`)).digest('hex');
    expect(sha).toBe('fcd9186697f8abe07352916ea38fc005d555ab7dab825876fa837f814b3f8df5');
  });
});
