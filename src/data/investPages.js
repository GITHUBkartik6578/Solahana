import {
  Layers, Users, Handshake, TrendingUp, Target, Coins, BarChart3, ShieldCheck, Landmark, Building2, Gauge, Search,
  FileText, PieChart, Settings, RefreshCw, Wallet, Receipt, Scale, Globe, Rocket, Home, Sprout, Briefcase, Eye,
  CalendarCheck, LineChart, Activity, KeyRound, Banknote, Hourglass,
} from 'lucide-react';

// Copy for the five Invest pages (Mutual Funds, PMS/AIF/SIF, Real Estate, Bonds, Equities).
// Rendered by components/planning-pages/PlanningPageTemplate, same layout as the planning pages.

const ALIGNED = { icon: Users, label: '100% Client-Aligned Advisory (Zero-Fee Diagnostics)' };
const PARTNERS = { icon: Handshake, label: 'Seamless Execution via Regulated Institutional Partners' };
const COMMON = {
  goal: 'Investment Planning',
  calculatorId: null,
  taglineBox: null,
  ctaFile: 'invest-cta',
  tagline: [],
};

export const MUTUAL_FUNDS_PAGE = {
  ...COMMON,
  id: 'mutual-funds',
  heroAspect: 785 / 745,
  banner: {
    file: 'mf-banner',
    alt: 'Mutual Funds and SIPs. Disciplined Mutual Fund Architecture. Compounding powered by precision.',
    ratio: 1600 / 600,
    fit: 0.98,
    minH: 400,
    primary: { left: '6.3%', top: '75.2%', width: '16.5%', height: '8%' },
    secondary: { left: '23.6%', top: '75.2%', width: '17.2%', height: '8%' },
  },
  art: 'mf',
  eyebrow: 'Mutual Funds & SIPs',
  titleGold: ['Disciplined Mutual Fund', 'Architecture.'],
  titleWhite: ['Compounding Powered', 'by Precision.'],
  text: 'Wealth isn’t built by chasing market noise or random fund hopping. Solahana structures goal-based systematic investment plans (SIPs), liquid reserves, and core equity/debt allocations — backed by rigorous IIFL Research and MFU analytics, with execution routed safely through SEBI/AMFI-registered partners.',
  primaryCta: 'Build My SIP Strategy',
  trust: [ALIGNED, { icon: Layers, label: 'Core-Satellite Asset Allocation Matrix' }, PARTNERS],
  philosophy: {
    eyebrow: 'The Investment Philosophy',
    title: ['Moving Beyond', 'Unstructured Portfolios'],
    text: 'Most retail investors hold 15-20 overlapping mutual funds with zero strategic direction. Our Family Office framework organizes your mutual fund holdings into distinct tactical buckets to optimize risk-adjusted compounding.',
    cards: [
      { icon: Target, title: 'Goal-Based Mapping', desc: 'Aligning every SIP directly to specific life milestones (retirement, children’s education, wealth creation).' },
      { icon: Layers, title: 'Overlap & Style Analysis', desc: 'Eliminating fund duplication using institutional analytics tools to ensure true diversification across large, mid, and small caps.' },
      { icon: BarChart3, title: 'Systematic Rebalancing', desc: 'Dynamic portfolio adjustments based on market cycles and valuation parameters.' },
    ],
  },
  pillars: {
    eyebrow: 'The Four Corners of Mutual Fund Engineering',
    title: 'A Comprehensive Approach to Wealth Creation',
    items: [
      { icon: Sprout, title: 'Core Equity Allocations', desc: 'Long-term compounding engines anchored in flexi-cap, large & mid-cap, and institutional index strategies.' },
      { icon: Target, title: 'Tactical & Satellite Growth', desc: 'High-conviction sector or thematic allocations monitored via rigorous quantitative research frameworks.' },
      { icon: Hourglass, title: 'Debt & Liquid Reserves', desc: 'Managing short-term cash flows, emergency buffers, and capital protection through high-quality arbitrage and debt funds.' },
      { icon: TrendingUp, title: 'Systematic Transfer & Withdrawal (STP/SWP)', desc: 'Structuring disciplined capital deployment from liquid funds into equities and tax-efficient regular cash-flow withdrawals.' },
    ],
  },
  stewardship: {
    title: 'Sophisticated Portfolio Stewardship',
    text: 'We go beyond one-time investments. Our ongoing stewardship helps you stay ahead through changing market cycles, tax rules and evolving life goals.',
    items: [
      { icon: Receipt, title: 'Tax-Optimized Switch Formulations', desc: 'Managing capital gains triggers and switching strategies legally and efficiently.' },
      { icon: PieChart, title: 'Consolidated Portfolio Tracking', desc: 'Single-view tracking and analytics leveraging digital platforms like MF Utilities (MFU).' },
      { icon: Search, title: 'Periodic Health Audits', desc: 'Quarterly diagnostic reviews of fund manager performance, expense ratios, and tracking errors.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Mutual Fund Lifecycle',
    title: 'A 4-Step Fund Architecture Process',
    text: 'A disciplined and transparent process to build your customized mutual fund strategy and keep it on track.',
    steps: [
      { icon: FileText, title: 'Existing Portfolio Audit', desc: 'Comprehensive review of your current folios, asset overlaps, and performance gaps under CWM® standards.' },
      { icon: PieChart, title: 'Blueprint Design', desc: 'Customizing your target core-satellite mutual fund matrix.' },
      { icon: Settings, title: 'Facilitated Execution', desc: 'Secure transaction placement, switch forms, and SIP setups routed through our registered institutional channel partners.' },
      { icon: BarChart3, title: 'Ongoing Stewardship', desc: 'Continuous monitoring and disciplined annual reviews.' },
    ],
  },
  cta: {
    eyebrow: 'Your Next Chapter',
    title: ['Transform Your', 'Mutual Fund Portfolio Today.'],
    text: 'Eliminate clutter and build a disciplined compounding engine with zero-fee advisory guidance.',
    button: 'Schedule Your Complimentary Portfolio Audit',
    benefits: [
      { icon: Target, label: 'Goal-Aligned Investing' },
      { icon: TrendingUp, label: 'Disciplined Compounding' },
      { icon: Scale, label: 'Risk-Adjusted Returns' },
      { icon: Users, label: 'Financial Freedom for Generations' },
    ],
  },
};

export const PMS_AIF_PAGE = {
  ...COMMON,
  id: 'pms-aif-sif',
  heroAspect: 880 / 500,
  banner: {
    file: 'pms-banner',
    alt: 'PMS, AIF and SIF. Alternative and Strategic Wealth Architecture. Beyond conventional horizons.',
    ratio: 1600 / 600,
    fit: 0.97,
    minH: 400,
    primary: { left: '5.5%', top: '72.4%', width: '18.6%', height: '8%' },
    secondary: { left: '25.6%', top: '72.4%', width: '18.6%', height: '8%' },
  },
  art: 'pms',
  eyebrow: 'PMS, AIF & SIF',
  titleGold: ['Alternative & Strategic', 'Wealth Architecture.'],
  titleWhite: ['Beyond Conventional', 'Horizons.'],
  text: 'For ultra-high-net-worth portfolios seeking superior alpha, conventional mutual funds are only part of the equation. Solahana structures bespoke Portfolio Management Services (PMS), Alternative Investment Funds (AIF), and Strategic Investment Funds (SIF) — bridging sophisticated capital with institutional-grade opportunities.',
  primaryCta: 'Explore Alternative Strategies',
  trust: [ALIGNED, { icon: BarChart3, label: 'High-Alpha Discretionary & Non-Discretionary Strategies' }, PARTNERS],
  philosophy: {
    eyebrow: 'The Alternative Philosophy',
    title: ['Elevating Your Portfolio', 'Beyond Retail Boundaries'],
    text: 'Ultra-HNI wealth requires sophisticated asset classes that operate outside standard market correlations. Our Family Office approach evaluates and integrates alternative vehicles to enhance long-term compounding and risk-adjusted returns.',
    cards: [
      { icon: BarChart3, title: 'High-Conviction Alpha', desc: 'Accessing concentrated equity portfolios and specialized management expertise through elite PMS houses.' },
      { icon: Sprout, title: 'Private Market Access', desc: 'Participating in venture debt, private equity, and structured debt through SEBI-regulated Category I, II, and III AIFs.' },
      { icon: Search, title: 'Institutional Due Diligence', desc: 'Rigorous qualitative and quantitative filtering to select top-tier fund managers with proven historical track records.' },
    ],
  },
  pillars: {
    eyebrow: 'The Spectrum of Strategic & Alternative Funds',
    title: 'Institutional Opportunities for Sustainable Wealth',
    items: [
      { icon: Briefcase, title: 'Discretionary & Non-Discretionary PMS', desc: 'Tailored equity mandates designed for concentrated growth, focused strategies, and personalized tax harvesting.' },
      { icon: Building2, title: 'Category I & II AIFs (Venture Debt & PE)', desc: 'Institutional participation in emerging businesses, unlisted equities, and structured real estate credit funds.' },
      { icon: LineChart, title: 'Category III AIFs (Long-Short & Structured)', desc: 'Sophisticated hedging strategies and absolute return models designed to navigate market volatility.' },
      { icon: Layers, title: 'Strategic Investment Funds (SIF)', desc: 'Specialized theme-based and sector-focused pooled vehicles for targeted high-growth exposure.' },
    ],
  },
  stewardship: {
    title: 'Sophisticated Alternative Stewardship',
    text: 'We provide end-to-end stewardship to help you access, allocate, and monitor alternative investments with clarity, discipline and institutional rigor.',
    items: [
      { icon: Hourglass, title: 'Ticket Size & Liquidity Structuring', desc: 'Managing capital lock-ins, cash flow drawdowns, and milestone-based commitments for AIF structures.' },
      { icon: Receipt, title: 'Tax-Efficient Holding Frameworks', desc: 'Structuring alternative investments through optimal corporate, individual, or trust vehicles.' },
      { icon: Activity, title: 'Deep Performance & Risk Tracking', desc: 'Continuous institutional tracking of manager strategies, portfolio drawdowns, and benchmark relative returns.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Alternative Investment Lifecycle',
    title: 'A 4-Step Alternative Architecture Process',
    text: 'A disciplined and transparent process to help you access the right strategies while managing risk and liquidity.',
    steps: [
      { icon: FileText, title: 'Sophistication & Risk Audit', desc: 'Evaluating your net worth eligibility, liquidity horizon, and risk appetite under CWM® standards.' },
      { icon: Users, title: 'Manager Selection & Blueprint Design', desc: 'Matching your wealth profile with the industry’s premier PMS and AIF managers.' },
      { icon: Handshake, title: 'Facilitated Placement', desc: 'Secure onboarding, documentation, and capital deployment routed through our SEBI/AMFI-registered institutional partners.' },
      { icon: BarChart3, title: 'Ongoing Stewardship', desc: 'Regular performance monitoring, capital call management, and portfolio rebalancing.' },
    ],
  },
  cta: {
    eyebrow: 'Your Alpha. Our Expertise.',
    title: ['Unlock Institutional-Grade', 'Alpha for Your Portfolio.'],
    text: 'Navigate the complex world of PMS and AIFs with objective, zero-fee consultative guidance.',
    button: 'Schedule Your Complimentary Alternative Strategy Audit',
    benefits: [
      { icon: Landmark, label: 'Institutional Access' },
      { icon: Scale, label: 'Superior Risk-Adjusted Returns' },
      { icon: PieChart, label: 'Diversification Beyond Public Markets' },
      { icon: Sprout, label: 'Long-Term Wealth Creation' },
    ],
  },
};

export const REAL_ESTATE_PAGE = {
  ...COMMON,
  id: 'real-estate',
  heroAspect: 840 / 662,
  banner: {
    file: 're-banner',
    alt: 'Real Estate, REITs and Fractional Ownership. Real Estate Architecture. Tangible assets, liquid yields.',
    ratio: 1600 / 792,
    fit: 0.93,
    minH: 400,
    primary: { left: '4.1%', top: '73.4%', width: '20.9%', height: '7.8%' },
    secondary: { left: '26.3%', top: '73.4%', width: '20.1%', height: '7.8%' },
  },
  art: 're',
  eyebrow: 'Real Estate, REITs & Fractional Ownership',
  titleGold: ['Real Estate', 'Architecture.'],
  titleWhite: ['Tangible Assets,', 'Liquid Yields.'],
  text: 'Real estate has traditionally been illiquid, capital-heavy, and fragmented. Solahana engineers modern real estate portfolios combining prime physical assets, high-yield REITs, and institutional fractional ownership — optimizing rental yields and capital appreciation without the management headaches.',
  primaryCta: 'Explore Property Strategies',
  trust: [ALIGNED, { icon: BarChart3, label: 'High-Yield Commercial & REIT Allocation' }, PARTNERS],
  philosophy: {
    eyebrow: 'The Real Estate Philosophy',
    title: ['Modernizing Real Estate', 'Investment for Ultra-HNIs'],
    text: 'Buying random plots or residential apartments often results in low rental yields (1-2%) and massive liquidity lock-in. Our Family Office approach shifts focus toward commercial yield generation and liquid property instruments.',
    cards: [
      { icon: Building2, title: 'Commercial REITs', desc: 'Accessing institutional-grade office spaces and retail parks with regular dividend distributions and stock-market liquidity.' },
      { icon: PieChart, title: 'Fractional Ownership', desc: 'Co-owning high-value Grade-A commercial real estate with low entry barriers and predictable rental cash flows.' },
      { icon: Landmark, title: 'Strategic Land & Asset Advisory', desc: 'Structuring long-term property acquisitions with clear title audits and succession compliance.' },
    ],
  },
  pillars: {
    eyebrow: 'The Four Pillars of Solahana Property Engineering',
    title: 'Diverse Real Estate Opportunities for Every Goal',
    items: [
      { icon: Building2, title: 'Real Estate Investment Trusts (REITs)', desc: 'Liquid, professionally managed real estate instruments designed for steady dividend yields and capital growth.' },
      { icon: Users, title: 'Fractional Commercial Real Estate', desc: 'Securing fractional stakes in premium leased commercial properties managed by institutional operators.' },
      { icon: Home, title: 'Residential & Land Portfolio Structuring', desc: 'Aligning physical property holdings with overall net-worth goals and long-term liquidity horizons.' },
      { icon: Landmark, title: 'Property Tax & Holding Efficiency', desc: 'Structuring property purchases and rentals through optimal legal and tax-efficient corporate or trust entities.' },
    ],
  },
  stewardship: {
    title: 'Comprehensive Property Stewardship',
    text: 'Our ongoing stewardship ensures your real estate portfolio generates optimal yields, remains legally secure, and stays aligned with your long-term wealth goals.',
    items: [
      { icon: Receipt, title: 'Capital Gains Reinvestment Strategies', desc: 'Structuring Section 54/54F exemptions to legally defer taxes on property sales.' },
      { icon: Search, title: 'Title Due Diligence & Legal Audit', desc: 'Working with top-tier legal counsels to verify clean titles and dispute-free acquisitions.' },
      { icon: TrendingUp, title: 'Liquidity & Exit Planning', desc: 'Managing timely exits from legacy property assets to redeploy capital into high-compounding vehicles.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Real Estate Lifecycle',
    title: 'A 4-Step Property Architecture Process',
    text: 'A disciplined and transparent process to help you build a resilient real estate portfolio with income, growth, and liquidity.',
    steps: [
      { icon: FileText, title: 'Portfolio & Exposure Audit', desc: 'Evaluating your current real estate weightage, liquidity constraints, and rental yields under CWM® standards.' },
      { icon: PieChart, title: 'Asset Allocation Design', desc: 'Customizing the ideal mix of REITs, fractional assets, and physical holdings.' },
      { icon: Handshake, title: 'Facilitated Onboarding', desc: 'Secure document execution and transaction routing through our registered institutional partners.' },
      { icon: BarChart3, title: 'Ongoing Stewardship', desc: 'Regular yield tracking, dividend monitoring, and portfolio rebalancing.' },
    ],
  },
  cta: {
    eyebrow: 'Your Properties. Our Perspective.',
    title: ['Unlock High-Yield Real Estate', 'Without the Hassle.'],
    text: 'Transform your property portfolio with objective, zero-fee family office guidance.',
    button: 'Schedule Your Complimentary Real Estate Audit',
    benefits: [
      { icon: Banknote, label: 'Steady Rental Income' },
      { icon: Landmark, label: 'Institutional-Grade Opportunities' },
      { icon: PieChart, label: 'Portfolio Diversification' },
      { icon: ShieldCheck, label: 'Long-Term Wealth Preservation' },
    ],
  },
};

export const BONDS_PAGE = {
  ...COMMON,
  id: 'bonds',
  heroAspect: 2360 / 2088,
  heroClear: true,
  art: 'bonds',
  eyebrow: 'Bonds, NCDs & Fixed Income',
  titleGold: ['Fixed Income', 'Architecture.'],
  titleWhite: ['Unshakeable Yields,', 'Capital Preservation.'],
  text: 'True wealth requires a secure anchor. Solahana structures institutional-grade fixed-income portfolios across tax-free bonds, high-yield corporate NCDs, government securities, and structured fixed deposits — optimizing regular cash flows with uncompromising safety.',
  primaryCta: 'Explore Fixed Income Yields',
  trust: [ALIGNED, { icon: BarChart3, label: 'High-Yield Corporate & Tax-Free Bond Allocation' }, PARTNERS],
  philosophy: {
    eyebrow: 'The Fixed Income Philosophy',
    title: ['Moving Beyond Low-Yield', 'Bank Fixed Deposits'],
    text: 'Standard bank fixed deposits often fail to beat inflation after accounting for high tax slabs. Our Family Office approach diversifies your fixed income into high-quality rated bonds and secure institutional instruments to maximize post-tax yields.',
    cards: [
      { icon: Receipt, title: 'Tax-Free Bond Yields', desc: 'Locking in long-term tax-free coupon payments through PSU and government-backed infrastructure bonds.' },
      { icon: Coins, title: 'High-Yield Corporate NCDs', desc: 'Accessing carefully vetted, high-credit-rated non-convertible debentures for superior regular payouts.' },
      { icon: Gauge, title: 'Liquidity & Safety Balancing', desc: 'Structuring maturities dynamically to match your near-term and long-term liquidity milestones.' },
    ],
  },
  pillars: {
    eyebrow: 'The Four Pillars of Solahana Yield Engineering',
    title: 'A Stronger Foundation for Your Wealth',
    items: [
      { icon: Landmark, title: 'Tax-Free Government & PSU Bonds', desc: 'Long-duration, AAA-rated secure bonds offering tax-free interest cash flows.' },
      { icon: Building2, title: 'High-Yield Corporate NCDs & Bonds', desc: 'Vetted corporate debt instruments offering enhanced risk-adjusted yields with strong underlying collateral.' },
      { icon: ShieldCheck, title: 'Government Securities & Treasury Bills', desc: 'Sovereign-guaranteed risk-free assets anchoring the foundation of your fixed-income allocation.' },
      { icon: Hourglass, title: 'Arbitrage & Short-Term Debt Instruments', desc: 'Liquid vehicles designed for tax-efficient parking of short-term business or personal capital reserves.' },
    ],
  },
  stewardship: {
    title: 'Comprehensive Debt Stewardship',
    text: 'Our ongoing stewardship helps you generate consistent income, manage risk, and adapt to changing interest rate cycles and market opportunities.',
    items: [
      { icon: Search, title: 'Credit Rating & Risk Filtering', desc: 'Rigorous evaluation of issuer balance sheets, credit ratings, and default probabilities under CWM® standards.' },
      { icon: TrendingUp, title: 'Laddering Strategies', desc: 'Structuring bond maturities across varying timelines (1 to 10 years) to eliminate reinvestment risk and maintain steady cash flows.' },
      { icon: LineChart, title: 'Secondary Market Bond Optimization', desc: 'Identifying undervalued listed bonds to capture capital appreciation alongside regular interest yields.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Fixed Income Lifecycle',
    title: 'A 4-Step Yield Architecture Process',
    text: 'A disciplined and transparent process to help you build a resilient fixed-income portfolio with steady income, liquidity, and capital preservation.',
    steps: [
      { icon: FileText, title: 'Cash Flow & Yield Audit', desc: 'Evaluating your current income requirements, tax brackets, and fixed-deposit weightage.' },
      { icon: PieChart, title: 'Blueprint Design', desc: 'Customizing your target debt matrix balancing safety, liquidity, and yield.' },
      { icon: Handshake, title: 'Facilitated Placement', desc: 'Secure bond onboarding and transaction routing through our registered institutional partners.' },
      { icon: CalendarCheck, title: 'Ongoing Stewardship', desc: 'Coupon tracking, maturity alerts, and reinvestment planning.' },
    ],
  },
  cta: {
    eyebrow: 'Your Income. Your Peace of Mind.',
    title: ['Optimize Your Cash Flows', 'with Institutional Fixed Income.'],
    text: 'Move beyond ordinary bank deposits with objective, zero-fee advisory guidance.',
    button: 'Schedule Your Complimentary Yield Audit',
    benefits: [
      { icon: Wallet, label: 'Regular Income Generation' },
      { icon: ShieldCheck, label: 'Capital Preservation' },
      { icon: Receipt, label: 'Tax-Efficient Growth' },
      { icon: Users, label: 'Financial Stability for Generations' },
    ],
  },
};

export const EQUITY_PAGE = {
  ...COMMON,
  id: 'equities',
  heroAspect: 912 / 1096,
  art: 'eq',
  eyebrow: 'Equities, International Investing & IPOs',
  titleGold: ['Direct Equity &', 'Global Architecture.'],
  titleWhite: ['High-Conviction Growth,', 'Worldwide Reach.'],
  text: 'True equity investing goes beyond market noise. Solahana structures direct domestic equity mandates, international market diversification, and primary market IPO allocations through trusted, authorized institutional partners — ensuring rigorous research and execution integrity.',
  primaryCta: 'Explore Equity Strategies',
  trust: [ALIGNED, { icon: Globe, label: 'Global Diversification & Domestic Alpha' }, { icon: Handshake, label: 'Seamless Execution via Authorized Institutional Partners' }],
  philosophy: {
    eyebrow: 'The Equity Philosophy',
    title: ['Moving Beyond Speculative', 'Trading to Long-Term Ownership'],
    text: 'Most retail participants trade momentum and burn capital in short-term volatility. Our Family Office approach treats equities as fractional ownership in great businesses, augmented by global geographical diversification.',
    cards: [
      { icon: BarChart3, title: 'Core Domestic Mandates', desc: 'Building high-conviction portfolios of established market leaders and emerging structural growth stories.' },
      { icon: Globe, title: 'International Exposure', desc: 'Hedging currency risk and capturing global tech and consumption growth through direct foreign equities.' },
      { icon: Rocket, title: 'Primary Market (IPO) Curation', desc: 'Rigorous financial and valuation auditing before participating in high-profile initial public offerings.' },
    ],
  },
  pillars: {
    eyebrow: 'The Four Pillars of Solahana Equity Engineering',
    title: 'Diversified Opportunities Across Global Markets',
    items: [
      { icon: Landmark, title: 'Direct Domestic Equity Portfolios', desc: 'Curated stock baskets based on fundamental valuation, strong balance sheets, and consistent ROCE metrics.' },
      { icon: Globe, title: 'Global & International Investing', desc: 'Seamless access to international stock exchanges, global tech giants, and diversified overseas indices.' },
      { icon: Rocket, title: 'IPO & Primary Market Curation', desc: 'Objective diagnostic filtering of upcoming IPOs to separate hype from intrinsic fundamental value.' },
      { icon: Eye, title: 'Active Portfolio Monitoring', desc: 'Continuous tracking of corporate earnings, governance standards, and valuation re-ratings.' },
    ],
  },
  stewardship: {
    title: 'Sophisticated Equity Stewardship',
    text: 'Our ongoing stewardship ensures your equity portfolio stays well-researched, tax-efficient, and aligned with your long-term wealth goals.',
    items: [
      { icon: Receipt, title: 'Tax-Loss Harvesting & Gain Management', desc: 'Structuring strategic equity sales to offset capital gains legally and efficiently.' },
      { icon: Handshake, title: 'Authorized Partner Execution', desc: 'Facilitating all trades and depository accounts strictly through leading SEBI-registered brokerages and institutional partners.' },
      { icon: KeyRound, title: 'Corporate Action Governance', desc: 'Managing rights issues, buybacks, dividend tracking, and other corporate actions seamlessly across your portfolio.' },
    ],
  },
  lifecycle: {
    eyebrow: 'Our Equity Lifecycle',
    title: 'A 4-Step Equity Architecture Process',
    text: 'A disciplined and transparent process to help you build a resilient equity portfolio with global exposure and long-term compounding potential.',
    steps: [
      { icon: FileText, title: 'Risk & Holding Audit', desc: 'Reviewing your current stock holdings, sector concentrations, and beta exposure under CWM® standards.' },
      { icon: PieChart, title: 'Blueprint Design', desc: 'Designing your customized domestic and international equity allocation matrix.' },
      { icon: Settings, title: 'Facilitated Execution', desc: 'Secure order placement and account routing through our authorized institutional partners.' },
      { icon: RefreshCw, title: 'Ongoing Stewardship', desc: 'Quarterly performance reviews, earnings analysis, and disciplined rebalancing.' },
    ],
  },
  cta: {
    eyebrow: 'Global Ideas. Long-Term Wealth.',
    title: ['Architect Your Global and Domestic', 'Equity Portfolio Today.'],
    text: 'Eliminate speculative guesswork with rigorous, zero-fee consultative advisory.',
    button: 'Schedule Your Complimentary Equity Audit',
    benefits: [
      { icon: Globe, label: 'Domestic & Global Opportunities' },
      { icon: Search, label: 'Data-Driven Research' },
      { icon: Scale, label: 'Disciplined Investing' },
      { icon: Users, label: 'Compounding for Generations' },
    ],
  },
};
