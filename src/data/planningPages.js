import {
  Armchair, BarChart3, Briefcase, Building2, CalendarCheck, ClipboardList, Coins, FileText, FolderOpen, Gauge, Gavel,
  Globe, Handshake, HeartPulse, Home, Landmark, Lock, PieChart, Receipt, RefreshCw, Scale, Search, Settings, ShieldCheck,
  Sprout, Stethoscope, Target, Telescope, TrendingUp, Umbrella, Users, Wallet, KeyRound, Layers, Heart, Eye, Hourglass,
  BookOpenCheck, Sunrise, UserCheck, ScrollText, TreeDeciduous,
} from 'lucide-react';

// Copy for the five planning pages (Retirement, Investment, Tax, Risk, Estate).
// Every page uses the same layout (components/planning-pages/PlanningPageTemplate).

const CLIENT_ALIGNED = { icon: Users, label: '100% Client-Aligned Planning Framework' };
const REGULATED = { icon: Handshake, label: 'Seamless Execution via Regulated Partners' };

export const RETIREMENT_PAGE = {
  id: 'retirement',
  art: 'retire',
  heroAspect: 1000 / 1152,
  banner: {
    file: 'retire-banner',
    alt: 'Retirement Planning. Retirement Architecture. Design freedom, not just a corpus.',
    ratio: 1600 / 600,
    fit: 0.92,
    maxVw: 37.5,
    minH: 400,
    primary: { left: '4.9%', top: '70.3%', width: '20.2%', height: '7.4%' },
    secondary: { left: '26%', top: '70.3%', width: '18.2%', height: '7.4%' },
  },
  taglineBox: null, // the new retirement hero already has a clean tagline in the photo
  stewardDark: true,
  goal: 'Retirement Planning',
  calculatorId: 'retirement-calculator',
  eyebrow: 'Retirement Planning',
  titleGold: ['Retirement', 'Architecture.'],
  titleWhite: ['Design Freedom,', 'Not Just a Corpus.'],
  text: 'True retirement isn’t just about stopping work; it’s about ensuring your capital outlives you while sustaining your exact lifestyle. Solahana engineers inflation-adjusted retirement freedom and precise SWP frameworks — free from product-pushing.',
  primaryCta: 'Calculate Your Retirement Corpus',
  tagline: ['A Richer Tomorrow', 'On Your Terms'],
  trust: [CLIENT_ALIGNED, { icon: Hourglass, label: 'Inflation-Resilient Corpus Planning' }, REGULATED],
  philosophy: {
    eyebrow: 'The Bigger Picture',
    title: ['Moving Beyond Fixed', 'Deposits and Guesswork'],
    text: 'Most retirees rely on ad-hoc fixed income or arbitrary savings targets that get decimated by inflation and medical costs. Our approach treats retirement as a multi-decade cash-flow engineering problem — with clarity, data and discipline.',
    cards: [
      { icon: Coins, title: 'Inflation Shielding', desc: 'Structuring assets to outpace healthcare and lifestyle inflation.' },
      { icon: ShieldCheck, title: 'Longevity Risk Management', desc: 'Ensuring your wealth lasts through decades of post-work life.' },
      { icon: TrendingUp, title: 'Dynamic Income Flow', desc: 'Transitioning from accumulation to a structured distribution and SWP framework.' },
    ],
  },
  pillars: {
    eyebrow: 'The Four Corners of Retirement Security',
    title: 'A Structured Approach for a Confident Tomorrow.',
    items: [
      { icon: Target, title: 'Corpus Calculation & Milestone Mapping', desc: 'Advanced diagnostic modeling factoring in your current age, desired lifestyle and life expectancy horizons.' },
      { icon: Sprout, title: 'SWP & Income Stream Engineering', desc: 'Designing tax-efficient Systematic Withdrawal Plans across growth and debt assets to replace salary paychecks reliably.' },
      { icon: Stethoscope, title: 'Healthcare & Emergency Buffering', desc: 'Creating dedicated medical and contingency reservoirs so health shocks never cannibalize your core retirement compounding.' },
      { icon: Armchair, title: 'Post-Retirement Asset Allocation', desc: 'Rebalancing portfolios dynamically from growth to stable, yield-generating asset classes as you cross milestones.' },
    ],
  },
  stewardship: {
    title: 'Holistic Post-Work Stewardship',
    text: 'Retirement is more than a financial event — it’s a new chapter. We help you manage this phase with a broader family office perspective, ensuring continuity, independence and peace of mind.',
    items: [
      { icon: Users, title: 'Intergenerational Cash Flow Transition', desc: 'Aligning your retirement distribution phase with the financial independence milestones of the next generation.' },
      { icon: Receipt, title: 'Tax-Optimized Drawdowns', desc: 'Minimizing capital gains and tax liabilities on your monthly or annual cash withdrawals.' },
      { icon: Gauge, title: 'Periodic Stress-Testing', desc: 'Running annual macro-economic simulations to protect your corpus against market downturns and shifting interest rate cycles.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Retirement Planning Lifecycle',
    title: 'A 4-Step Retirement Blueprint Process',
    text: 'A disciplined and transparent process to build your customized retirement plan and help you stay on track through every market cycle.',
    steps: [
      { icon: ClipboardList, title: 'Lifestyle & Expense Audit', desc: 'Mapping your current and projected future cash-flow needs.' },
      { icon: BarChart3, title: 'Gap & Inflation Analysis', desc: 'Calculating the exact shortfall between your current assets and future required corpus under CWM® diagnostic standards.' },
      { icon: FileText, title: 'Master Blueprint Delivery', desc: 'Presenting your custom accumulation and SWP distribution roadmap.' },
      { icon: Settings, title: 'Ongoing Stewardship & Review', desc: 'Regular monitoring of cash flows and portfolio adjustments via registered execution partners.' },
    ],
  },
  cta: {
    eyebrow: 'Next Chapter',
    title: ['Secure Your Financial', 'Independence Today.'],
    text: 'Take the first step toward absolute peace of mind. No product pitching, no charges — just pure architectural clarity.',
    button: 'Schedule Your Complimentary Retirement Audit',
    benefits: [
      { icon: Sunrise, label: 'Freedom to Live Life on Your Terms' },
      { icon: Wallet, label: 'Sustainable Income for Life' },
      { icon: Users, label: 'Legacy for the Next Generation' },
    ],
  },
};

export const INVESTMENT_PAGE = {
  id: 'investment',
  art: 'invest',
  heroAspect: 1000 / 1165,
  banner: {
    file: 'invest-banner',
    alt: 'Investment Planning. Institutional-Grade Investment Architecture. Compounding engineered for generations.',
    ratio: 1600 / 684,
    fit: 0.9,
    maxVw: 42.75,
    minH: 400,
    primary: { left: '4.2%', top: '73%', width: '20.5%', height: '7.7%' },
    secondary: { left: '25.9%', top: '73%', width: '19.8%', height: '7.7%' },
  },
  taglineBox: null, // the new investment hero already has a clean tagline in the photo
  goal: 'Investment Planning',
  calculatorId: 'investment-calculator',
  eyebrow: 'Investment Planning',
  titleGold: ['Institutional-Grade', 'Investment Architecture.'],
  titleWhite: ['Compounding Engineered', 'for Generations.'],
  text: 'True wealth creation isn’t about chasing hot tips or random product-pushing. Solahana builds personalized, multi-asset portfolios across Mutual Funds, PMS, AIFs and Fixed Income — rigorously aligned with your long-term goals and risk horizon.',
  primaryCta: 'Build My Portfolio Blueprint',
  tagline: ['Disciplined', 'Investing for', 'a Brighter', 'Tomorrow'],
  trust: [CLIENT_ALIGNED, { icon: Layers, label: 'Multi-Asset Core-Satellite Allocation' }, REGULATED],
  philosophy: {
    eyebrow: 'The Investment Philosophy',
    title: ['Moving Beyond Retail', 'Product-Pushing'],
    text: 'Most investors end up with cluttered portfolios containing dozens of overlapping funds. Our Family Office framework implements a disciplined Core-Satellite Strategy to optimize risk-adjusted returns.',
    cards: [
      { icon: Coins, title: 'Core Stability', desc: 'Anchoring long-term wealth in disciplined index funds, large caps and high-quality fixed income.' },
      { icon: TrendingUp, title: 'Satellite Growth', desc: 'Capturing alpha through tactical allocations in high-conviction mutual funds, PMS and alternative assets.' },
      { icon: Search, title: 'Institutional Monitoring', desc: 'Utilizing advanced analytics to constantly monitor portfolio health and rebalance when necessary.' },
    ],
  },
  pillars: {
    eyebrow: 'The Investment Architecture',
    title: 'Spectrum of Asset Classes We Architect',
    items: [
      { icon: BarChart3, title: 'Mutual Funds & Index Portfolios', desc: 'Structuring SIPs and lumpsum deployments across equity, debt and hybrid categories with complete transparency.' },
      { icon: Briefcase, title: 'Portfolio Management Services (PMS)', desc: 'Curating high-end discretionary and non-discretionary PMS strategies for high-net-worth capital growth.' },
      { icon: Building2, title: 'Alternative Investment Funds (AIF)', desc: 'Accessing institutional-grade private equity, venture debt and structured real estate opportunities for sophisticated investors.' },
      { icon: Landmark, title: 'Fixed Income & Yield Instruments', desc: 'Deploying capital into corporate bonds, government securities and arbitrage funds to protect downside and generate stable cash flows.' },
    ],
  },
  stewardship: {
    title: 'Sophisticated Portfolio Stewardship',
    text: 'We go beyond one-time allocation. Our ongoing stewardship helps you stay on track through changing market cycles, tax rules and evolving life goals.',
    items: [
      { icon: Receipt, title: 'Tax-Efficient Capital Gains Management', desc: 'Structuring redemptions and switches to minimize tax drag and enhance post-tax returns.' },
      { icon: Target, title: 'Goal-Based Asset Allocation', desc: 'Synchronizing your portfolio risk profile dynamically as you transition across life stages.' },
      { icon: RefreshCw, title: 'Periodic Macro Rebalancing', desc: 'Quarterly and annual portfolio health audits to insulate your wealth from market volatility.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Investment Planning Lifecycle',
    title: 'A 4-Step Portfolio Engineering Process',
    text: 'A disciplined and transparent process to build and manage your portfolio with clarity and confidence.',
    steps: [
      { icon: FileText, title: 'Risk Profiling & Audit', desc: 'Deep analysis of your existing investments, overlap checks and risk tolerance evaluation under CWM® standards.' },
      { icon: PieChart, title: 'Blueprint Architecture', desc: 'Designing your custom multi-asset allocation matrix with zero product bias.' },
      { icon: Settings, title: 'Facilitated Execution', desc: 'Secure transaction routing through our SEBI and AMFI-registered institutional channel partners.' },
      { icon: BarChart3, title: 'Ongoing Stewardship', desc: 'Continuous tracking, performance reviews and disciplined rebalancing.' },
    ],
  },
  cta: {
    eyebrow: 'Your Next Chapter',
    title: ['Transform Your Portfolio', 'Architecture Today.'],
    text: 'Stop guessing and start compounding with precision. No product pitches, no charges — just pure fiduciary clarity.',
    button: 'Schedule Your Complimentary Portfolio Review',
    benefits: [
      { icon: Sprout, label: 'Long-Term Wealth Creation' },
      { icon: Receipt, label: 'Tax-Efficient Investing' },
      { icon: Scale, label: 'Risk-Adjusted Returns' },
      { icon: Users, label: 'Generational Legacy' },
    ],
  },
};

export const TAX_PAGE = {
  id: 'tax',
  art: 'tax',
  heroAspect: 964 / 936,
  banner: {
    file: 'tax-banner',
    alt: 'Tax Planning. Strategic Tax Architecture. Retain more, grow faster.',
    ratio: 1600 / 540,
    fit: 0.95,
    maxVw: 33.75,
    minH: 400,
    primary: { left: '4.5%', top: '73.7%', width: '19.4%', height: '8.4%' },
    secondary: { left: '25.2%', top: '73.7%', width: '18.6%', height: '8.4%' },
  },
  taglineBox: { x: 0.6, y: 0.18, w: 0.3, align: 'left' },
  goal: 'Tax Planning',
  calculatorId: 'tax-calculator',
  eyebrow: 'Tax Planning',
  titleGold: ['Strategic Tax', 'Architecture.'],
  titleWhite: ['Retain More,', 'Grow Faster.'],
  text: 'Tax optimization isn’t just a March-end scramble; it is a year-round cash flow strategy. Solahana engineers proactive tax frameworks across regimes, deductions and capital gains — maximizing your disposable wealth legally and efficiently.',
  primaryCta: 'Optimize My Taxes Now',
  tagline: ['Smart', 'Tax Strategy', 'for a Richer', 'Tomorrow'],
  trust: [CLIENT_ALIGNED, { icon: BookOpenCheck, label: 'Proactive Regime & Deduction Optimization' }, REGULATED],
  philosophy: {
    eyebrow: 'The Bigger Picture',
    title: ['Moving Beyond', 'Last-Minute Tax Saving'],
    text: 'Most taxpayers react in February or March by buying random products just to save tax. Our Family Office approach treats tax planning as an integrated component of overall wealth architecture — designed with foresight, data and discipline.',
    cards: [
      { icon: Scale, title: 'Regime Analysis', desc: 'Objective evaluation of Old vs. New tax regimes based on your unique salary and investment structures.' },
      { icon: FileText, title: 'Exhaustive Deductions', desc: 'Maximizing legitimate deductions under Section 80C, 80D, NPS, home loan interest and more.' },
      { icon: TrendingUp, title: 'Capital Gains Mitigation', desc: 'Structuring equity, mutual fund and real estate transactions smartly to minimize tax drag.' },
    ],
  },
  pillars: {
    eyebrow: 'The Four Pillars of Solahana Tax Engineering',
    title: 'A Structured Approach to Tax Efficiency',
    items: [
      { icon: Landmark, title: 'Old vs. New Regime Simulation', desc: 'Detailed comparative analysis to determine which tax regime yields maximum annual savings for your specific income bracket.' },
      { icon: Coins, title: 'Deductions & Exemption Structuring', desc: 'Optimizing statutory limits across Section 80C, 80D, HRA, LTA and corporate NPS contributions.' },
      { icon: BarChart3, title: 'Capital Gains & Investment Tax Efficiency', desc: 'Managing STCG and LTCG through strategic timing, indexation benefits and tax-efficient investment structures.' },
      { icon: Building2, title: 'Business & Professional Tax Optimization', desc: 'Structuring business cash flows, professional expenses and corporate-personal tax harmonizations for entrepreneurs and partners.' },
    ],
  },
  stewardship: {
    title: 'Comprehensive Multi-Year Tax Stewardship',
    text: 'We go beyond annual tax filing. Our ongoing stewardship helps you stay ahead of regulatory changes while optimizing your tax outflow for the long term.',
    items: [
      { icon: Users, title: 'Family Income Splitting & Trusts', desc: 'Exploring legal frameworks like Private Family Trusts to optimize tax liabilities across generations.' },
      { icon: Home, title: 'Real Estate Tax Structuring', desc: 'Managing stamp duty, capital gains exemptions (Sec 54/54F) and holding structures for property assets.' },
      { icon: CalendarCheck, title: 'Year-Round Compliance Tracking', desc: 'Continuous monitoring of tax law amendments to ensure your financial blueprint remains compliant and efficient.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Tax Planning Lifecycle',
    title: 'A 4-Step Tax Architecture Process',
    text: 'A disciplined and transparent process to build your customized tax strategy and help you retain more of what you earn.',
    steps: [
      { icon: FileText, title: 'Income & Outflow Audit', desc: 'Deep dive into your salary slips, business receipts and existing deductions.' },
      { icon: Search, title: 'Diagnostic Gap Analysis', desc: 'Identifying missed tax-saving opportunities under CWM® standards.' },
      { icon: BarChart3, title: 'Master Blueprint Presentation', desc: 'Delivering a personalized tax-saving roadmap for the financial year.' },
      { icon: Settings, title: 'Facilitated Implementation', desc: 'Executing tax-saving instruments or allocations through our registered institutional partners.' },
    ],
  },
  cta: {
    eyebrow: 'Your Next Chapter',
    title: ['Stop Overpaying Taxes.', 'Start Architecting Wealth.'],
    text: 'Take control of your annual tax outflow with a disciplined, zero-fee advisory approach.',
    button: 'Schedule Your Complimentary Tax Review',
    benefits: [
      { icon: Receipt, label: 'Lower Tax Outflow' },
      { icon: Wallet, label: 'Higher Investable Surplus' },
      { icon: Sprout, label: 'Long-Term Wealth Creation' },
      { icon: Sunrise, label: 'Greater Financial Freedom' },
    ],
  },
};

export const RISK_PAGE = {
  id: 'risk',
  art: 'risk',
  heroAspect: 996 / 892,
  banner: {
    file: 'risk-banner',
    ratio: 1600 / 900,
    maxVw: 42.75,
    fit: 0.69,
    minH: 400,
    alt: 'Risk Management. Comprehensive Risk Architecture. Shielding your wealth from the unforeseen.',
    primary: { left: '3.5%', top: '75.7%', width: '20.6%', height: '7.4%' },
    secondary: { left: '25.2%', top: '75.7%', width: '23.3%', height: '7.4%' },
  },
  taglineBox: null,
  pillarBadge: true,
  goal: 'Risk Management',
  calculatorId: 'risk-calculator',
  eyebrow: 'Risk Management',
  titleGold: ['Comprehensive', 'Risk Architecture.'],
  titleWhite: ['Shielding Your Wealth', 'From the Unforeseen.'],
  text: 'True wealth creation means nothing if a single medical shock or life uncertainty can dismantle your family’s financial future. Solahana engineers robust health, life, and liability shields — ensuring your master blueprint remains unshakeable.',
  primaryCta: 'Audit My Risk Exposure',
  tagline: [],
  trust: [CLIENT_ALIGNED, { icon: HeartPulse, label: 'Comprehensive Health & Liability Audits' }, REGULATED],
  philosophy: {
    eyebrow: 'The Bigger Picture',
    title: ['Moving Beyond Agent-Driven', 'Token Policies'],
    text: 'Most people buy insurance policies based on tax-saving tips or agent commissions rather than hard mathematical gap analysis. Our Family Office approach treats risk mitigation as an essential balance-sheet defense mechanism.',
    cards: [
      { icon: Users, title: 'Human Life Value (HLV) Mapping', desc: 'Calculating the exact financial cover required to replace your income and sustain your family’s lifestyle indefinitely.' },
      { icon: HeartPulse, title: 'Comprehensive Healthcare Buffers', desc: 'Structuring high-sum-insured health covers and super top-ups to beat medical inflation.' },
      { icon: Lock, title: 'Liability Insulation', desc: 'Protecting your mortgages, business loans, and assets from being liquidated during distress.' },
    ],
  },
  pillars: {
    eyebrow: 'The Four Shields of Family Office Protection',
    title: 'A Complete Shield for Every Life Stage',
    items: [
      { icon: ShieldCheck, title: 'Life & Income Replacement Shield', desc: 'Pure term architecture engineered to clear all liabilities and fund long-term family goals seamlessly in your absence.' },
      { icon: Stethoscope, title: 'Advanced Health & Critical Care Covers', desc: 'Comprehensive hospitalization, critical illness, and OPD structuring to insulate savings from modern healthcare costs.' },
      { icon: Briefcase, title: 'Disability & Business Continuity Protection', desc: 'Income protection plans and key-man risk structuring for entrepreneurs and working professionals.' },
      { icon: Umbrella, title: 'Liability & Asset Shielding', desc: 'Protecting real estate and investment portfolios from forced distress sales due to unforeseen financial liabilities.' },
    ],
  },
  stewardship: {
    title: 'Sophisticated Risk Stewardship',
    text: 'Our ongoing stewardship ensures your coverage keeps pace with your evolving wealth, family responsibilities and real-world risks.',
    items: [
      { icon: Search, title: 'Policy Audit & Overlap Analysis', desc: 'Reviewing existing legacy policies to eliminate redundant premiums and plug hidden coverage gaps.' },
      { icon: Scale, title: 'Trust-Protected Insurance Structuring', desc: 'Using legal frameworks like Married Women’s Property (MWP) Act or trusts to secure payouts for intended beneficiaries.' },
      { icon: Gauge, title: 'Annual Risk Stress-Testing', desc: 'Periodic evaluations to scale up covers as your net worth, liabilities, and family responsibilities grow.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Risk Management Lifecycle',
    title: 'A 4-Step Protection Engineering Process',
    text: 'A disciplined and transparent process to build your family’s protection blueprint and keep it on track.',
    steps: [
      { icon: FileText, title: 'Exposure & Gap Audit', desc: 'Thorough diagnostic review of your current life, health, and asset insurance under CWM® standards.' },
      { icon: Settings, title: 'Master Blueprint Design', desc: 'Customizing the precise coverage matrix required for your family profile.' },
      { icon: Users, title: 'Facilitated Placement', desc: 'Securing policies transparently through our registered institutional channel partners.' },
      { icon: BarChart3, title: 'Annual Policy Governance', desc: 'Ongoing tracking, renewals, claim support and coverage upgrades.' },
    ],
  },
  cta: {
    eyebrow: 'Your Family. Our Priority.',
    title: ['Is Your Family Fully Shielded', 'Against the Unexpected?'],
    text: 'Eliminate guesswork from your insurance portfolio with a rigorous, zero-fee diagnostic audit.',
    button: 'Schedule Your Complimentary Risk Audit',
    benefits: [
      { icon: ShieldCheck, label: 'Financial Security for Your Family' },
      { icon: HeartPulse, label: 'Protection Against Medical Emergencies' },
      { icon: Briefcase, label: 'Business Continuity' },
      { icon: KeyRound, label: 'Preserve Your Assets' },
    ],
  },
};

export const ESTATE_PAGE = {
  id: 'estate',
  art: 'estate',
  heroAspect: 996 / 924,
  banner: {
    file: 'estate-banner',
    alt: 'Estate Planning. Generational Estate Architecture. Preserving legacy, securing succession.',
    ratio: 1600 / 900,
    fit: 0.82,
    capped: true,
    minH: 400,
    primary: { left: '5.7%', top: '69.9%', width: '21.3%', height: '6.4%' },
    secondary: { left: '28.3%', top: '69.9%', width: '19.3%', height: '6.4%' },
  },
  taglineBox: { x: 0.77, y: 0.1, w: 0.22, align: 'left' },
  pillarBadge: true,
  goal: 'Estate Planning',
  calculatorId: null,
  eyebrow: 'Estate Planning',
  titleGold: ['Generational', 'Estate Architecture.'],
  titleWhite: ['Preserving Legacy,', 'Securing Succession.'],
  text: 'Wealth creation is only half the journey; ensuring it transitions seamlessly across generations without legal friction, disputes, or tax drag is the true mark of a Family Office. Solahana engineers precise Wills, Private Family Trusts, and succession protocols.',
  primaryCta: 'Draft Your Succession Roadmap',
  tagline: ['Today’s', 'Planning.', 'Tomorrow’s', 'Legacy.'],
  trust: [
    { icon: Users, label: '100% Client-Aligned Advisory (Zero Fee Diagnostics)' },
    { icon: TreeDeciduous, label: 'Seamless Intergenerational Wealth Transmission' },
    { icon: Handshake, label: 'Facilitated Execution via Legal & Institutional Partners' },
  ],
  philosophy: {
    eyebrow: 'The Estate Philosophy',
    title: ['Moving Beyond Informal &', 'Fragmented Inheritance'],
    text: 'Without structured estate planning, families often face frozen assets, prolonged probate litigation, and bitter succession disputes. Our Family Office approach treats estate structuring as the ultimate protective shield for your family’s future harmony.',
    cards: [
      { icon: Gavel, title: 'Probate Avoidance', desc: 'Structuring ownership and holding entities to bypass cumbersome legal delays after lifetime transitions.' },
      { icon: Users, title: 'Family Governance', desc: 'Establishing clear charters, voting rights, and asset control mechanisms across generations.' },
      { icon: ShieldCheck, title: 'Asset Protection', desc: 'Shielding family wealth from external liabilities, business shocks, and unintended third-party claims.' },
    ],
  },
  pillars: {
    eyebrow: 'The Four Pillars of Solahana Succession Engineering',
    title: 'A Stronger Legacy for Generations',
    items: [
      { icon: ScrollText, title: 'Precision Will Drafting & Registration', desc: 'Legally watertight last testaments ensuring your movable and immovable assets are distributed exactly as intended.' },
      { icon: Landmark, title: 'Private Family Trusts (PFT)', desc: 'Sophisticated institutional structures to manage multi-generational wealth, safeguard minors, and protect vulnerable beneficiaries.' },
      { icon: FolderOpen, title: 'Nomination & Asset Title Harmonization', desc: 'Aligning bank accounts, demat accounts, real estate titles, and corporate holdings with your master succession plan.' },
      { icon: Building2, title: 'Business Succession & Continuity', desc: 'Structuring voting control, equity transfers, and management transitions for family-owned enterprises and LLPs.' },
    ],
  },
  stewardship: {
    title: 'Comprehensive Legacy Stewardship',
    text: 'Our ongoing stewardship ensures your legacy adapts to changing family dynamics, business environments and evolving legal and tax frameworks.',
    items: [
      { icon: Heart, title: 'Charitable & Philanthropic Structuring', desc: 'Setting up enduring trusts or endowments to institutionalize your family’s social impact and philanthropic goals.' },
      { icon: Globe, title: 'Cross-Border Asset Succession', desc: 'Managing legal and regulatory frameworks for families holding multi-jurisdictional assets or properties.' },
      { icon: Eye, title: 'Periodic Trust & Will Audits', desc: 'Routine reviews to update your succession blueprint as family dynamics, assets, and tax laws evolve.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Estate Planning Lifecycle',
    title: 'A 4-Step Succession Architecture Process',
    text: 'A disciplined and transparent process to build a legacy that lasts, with clarity, legal robustness and family harmony.',
    steps: [
      { icon: FileText, title: 'Asset Mapping & Inventory', desc: 'Comprehensive cataloging of all financial assets, real estate holdings, and business interests under CWM® standards.' },
      { icon: Settings, title: 'Succession Blueprint Design', desc: 'Customizing the ideal legal framework (Will vs. Trust) tailored to your family’s unique dynamics.' },
      { icon: Users, title: 'Facilitated Legal Execution', desc: 'Partnering with top-tier institutional legal counsels to draft, execute, and register instruments securely.' },
      { icon: BarChart3, title: 'Ongoing Stewardship', desc: 'Safe custody protocols, periodic reviews, and family governance alignment.' },
    ],
  },
  cta: {
    eyebrow: 'Your Legacy. Our Commitment.',
    title: ['Protect Your Family’s Harmony', 'and Hard-Earned Legacy.'],
    text: 'Take proactive control of your succession planning with a rigorous, zero-fee consultative approach.',
    button: 'Schedule Your Complimentary Estate Audit',
    benefits: [
      { icon: Home, label: 'Preserve Family Wealth' },
      { icon: UserCheck, label: 'Ensure Smooth Succession' },
      { icon: Gavel, label: 'Minimize Legal Disputes' },
      { icon: Telescope, label: 'Create a Lasting Legacy' },
    ],
  },
};
