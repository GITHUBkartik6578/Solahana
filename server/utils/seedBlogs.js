import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/Blog.js';

dotenv.config();

const sampleBlogs = [
  {
    title: 'Mastering Systematic Investment Plans (SIP): How Compounding Creates Long-Term Wealth in India',
    slug: 'mastering-sip-mutual-funds-compounding-wealth-india',
    excerpt: 'Discover how disciplined monthly investing through SIPs harnesses rupee cost averaging and exponential compounding to reach your long-term wealth milestones.',
    category: 'SIP & Mutual Funds',
    author: 'Rohan Sharma, Chief Investment Strategist',
    featuredImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200',
    readTime: '6 min read',
    status: 'published',
    content: `
# Mastering Systematic Investment Plans (SIP)

Systematic Investment Plans (SIPs) have revolutionized financial planning for Indian investors over the past decade. By committing a fixed amount every month into equity or hybrid mutual funds, investors can systematically accumulate wealth without worrying about market timing.

---

## 1. The Power of Compounding & Rupee Cost Averaging

When markets dip, your fixed SIP installment buys more units; when markets rally, those accumulated units compound in value. This self-balancing mechanism is known as **Rupee Cost Averaging**.

### The 15x15x15 Rule of Wealth Creation
- **Investment**: ₹15,000 / month
- **Tenure**: 15 years
- **Expected CAGR**: 15% per annum
- **Total Invested**: ₹27 Lakhs
- **Estimated Future Value**: **₹1.01 Crore**

---

## 2. Choosing the Right Fund Categories

For optimal risk-adjusted returns, structure your SIP allocations based on your time horizon:

1. **Large Cap & Flexi Cap Funds** (Core Holding: 50%): Ideal for stability and steady compounded growth.
2. **Mid & Small Cap Funds** (Growth Driver: 30%): Delivers alpha returns during economic expansion phases.
3. **Hybrid & Sectoral Funds** (Satellite Holding: 20%): Provides downside protection and targeted industry exposure.

---

## 3. Step-Up SIP: Supercharging Your Net Worth

Incrementing your monthly SIP by just **10% annually** in tandem with salary hikes can increase your terminal retirement portfolio by up to **80%**.

> "Do not save what is left after spending, but spend what is left after saving." — Warren Buffett

At **SOLAHANA Wealth Advisory**, our advisors build personalized mutual fund portfolios tailored to your financial goals, risk appetite, and tax efficiency.
`,
  },
  {
    title: 'The Ultimate Guide to Early Retirement (FIRE) in India: Building Your Corpus Post-Inflation',
    slug: 'guide-to-early-retirement-fire-india-corpus-inflation',
    excerpt: 'Calculate your target retirement nest egg, account for healthcare inflation, and design a sustainable 4% withdrawal rate for financial independence in India.',
    category: 'Retirement Planning',
    author: 'Priya Mehta, Principal Retirement Advisor',
    featuredImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200',
    readTime: '8 min read',
    status: 'published',
    content: `
# Financial Independence, Retire Early (FIRE) in India

Retiring at age 45 or 50 is no longer a pipedream. With disciplined equity allocation, strict expense tracking, and inflation-indexed planning, achieving financial freedom early is well within reach for salaried professionals and entrepreneurs alike.

---

## 1. Estimating Your Target Retirement Corpus

To estimate your target retirement corpus, calculate your annual living expenses and adjust for projected inflation.

### The Rule of 25 to 30
If your current annual household expenditure is **₹12 Lakhs** and you plan to retire in 15 years:
- **Inflation-Adjusted Monthly Expense (at 6% inflation)**: ~₹2.87 Lakhs/month
- **Required Target Corpus**: **₹8.5 Crores to ₹10 Crores**

---

## 2. Managing Post-Retirement Inflation Risks

India's retail inflation averages 5.5% - 6.5%, while **medical inflation grows at 12-14% annually**. A naive debt-only portfolio will exhaust its corpus prematurely.

### Dual-Bucket Strategy
- **Bucket 1 (Liquid & Debt)**: 3-5 years of living expenses in High Quality Liquid Funds & Corporate Bonds.
- **Bucket 2 (Equity Growth)**: 65% of remaining corpus in Diversified Equity Funds to beat inflation over multi-decade horizons.

---

## 3. Systematic Withdrawal Plans (SWP) for Monthly Tax-Efficient Cash Flow

Unlike traditional fixed deposit interest taxed at marginal income rates, SWPs from mutual funds trigger long-term capital gains tax (Section 112A), dramatically lowering tax drain during your golden years.
`,
  },
  {
    title: 'Navigating New vs. Old Tax Regimes: Strategic Deductions and Wealth-Saving Tips for FY 2026-27',
    slug: 'navigating-new-vs-old-tax-regimes-fy2026',
    excerpt: 'Compare tax slabs under Section 115BAC, evaluate ELSS vs NPS benefits, and optimize your taxable income legally with personalized wealth advisory.',
    category: 'Tax Planning',
    author: 'Vikramaditya Solanki, Tax & Legal Strategist',
    featuredImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200',
    readTime: '7 min read',
    status: 'published',
    content: `
# Tax Optimization: New vs. Old Tax Regime

Choosing between the Old Tax Regime (with deductions) and the New Tax Regime (Section 115BAC with lower tax slabs) requires precise mathematical modeling based on your investments and exemptions.

---

## 1. Break-Even Analysis for High Earners

If your gross total income exceeds **₹15 Lakhs**, the Old Regime becomes beneficial only if your total annual eligible deductions exceed **₹3.75 Lakhs**.

### Key Old Regime Deductions
- **Section 80C**: Up to ₹1.5 Lakhs (ELSS, EPF, PPF, Home Loan Principal)
- **Section 80CCD(1B)**: Additional ₹50,000 in National Pension System (NPS)
- **Section 80D**: Up to ₹75,000 for Health Insurance (Self + Senior Citizen Parents)
- **Section 24(b)**: Up to ₹2 Lakhs Home Loan Interest Deduction
- **HRA / LTA Exemptions**: Based on rent paid and salary structure

---

## 2. Tax Harvesting in Equity Mutual Funds

Under current tax regulations, Long-Term Capital Gains (LTCG) on equity investments up to **₹1.25 Lakhs per financial year** are exempt from tax. 

> Pro Tip: Re-investing your gains annually allows you to step up your cost base legally without paying capital gains tax.
`,
  },
  {
    title: 'Asset Allocation Masterclass: Balancing Equity, Debt, and Gold for High-Net-Worth Portfolios',
    slug: 'asset-allocation-equity-debt-gold-hnw-portfolios',
    excerpt: 'Learn how institutional asset allocation strategies protect portfolio drawdown while outperforming inflation through market cycles.',
    category: 'Wealth Creation',
    author: 'SOLAHANA Research Desk',
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200',
    readTime: '5 min read',
    status: 'published',
    content: `
# Strategic & Dynamic Asset Allocation

Studies show that over **90% of long-term investment performance** is driven by asset allocation rather than individual stock selection.

---

## 1. Core Portfolio Framework

A resilient wealth management portfolio balances three key asset classes:

1. **Growth Assets (Equity - 60%)**: Indian Large, Mid, Small Cap Equity & Global Tech ETFs.
2. **Stability Assets (Debt & Fixed Income - 30%)**: Target Maturity Debt Funds, Sovereign Bonds & Arbitrage Funds.
3. **Hedge Assets (Gold & Commodities - 10%)**: Gold ETFs & Sovereign Gold Bonds to hedge geopolitical uncertainty.

---

## 2. Portfolio Rebalancing Rules

Set annual or threshold-based triggers (e.g., when an asset class shifts by >5% from target allocation). Sell high and buy low systematically without emotional bias.
`,
  },
  {
    title: 'Term Insurance vs. Investment Plans: Protecting Your Family’s Financial Legacy',
    slug: 'term-insurance-vs-investment-plans-family-legacy',
    excerpt: 'Demystify pure term life insurance vs ULIPs. Learn how to calculate adequate human life value (HLV) coverage without overpaying for unnecessary riders.',
    category: 'Insurance',
    author: 'Ananya Deshmukh, Wealth Protection Specialist',
    featuredImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200',
    readTime: '6 min read',
    status: 'published',
    content: `
# Protecting Your Family's Financial Future

Insurance is designed to replace lost income in the event of an untimely demise, whereas investments build asset bases. Mixing both through endowment or unit-linked insurance plans often results in sub-optimal returns and inadequate cover.

---

## 1. Human Life Value (HLV) Calculation

Your life insurance cover should equal **15 to 20 times your annual income** plus outstanding liabilities (like home loans).

### Sample HLV Formula
\`\`\`
Required Term Cover = (Annual Income x 15) + Total Liabilities - Existing Liquid Net Worth
\`\`\`

---

## 2. Key Term Insurance Checklists

- **Claim Settlement Ratio (CSR)**: Look for insurers with >98% CSR and high Benefit Amount Settlement ratios.
- **Married Women's Property (MWP) Act**: Register term policies under MWP Act to ensure policy proceeds go exclusively to wife & children, protected from creditors.
`,
  },
  {
    title: 'Indias Macroeconomic Growth Engine: Key Trends Driving Equity Markets in 2026',
    slug: 'indias-macroeconomic-growth-engine-equity-markets-2026',
    excerpt: 'Analyze capital expenditure cycles, domestic institutional inflows (DII), and emerging sector themes positioning India as a global investment hub.',
    category: 'Market Insights',
    author: 'SOLAHANA Macro Research Team',
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
    readTime: '7 min read',
    status: 'published',
    content: `
# India Macroeconomic & Market Outlook

India continues to shine as one of the world's fastest-growing major economies, backed by robust domestic consumption, private capital expenditure expansion, and favorable demographic dividends.

---

## Key Secular Growth Drivers

1. **Digital Public Infrastructure (DPI)**: UPI, ONDC, and Account Aggregator networks streamlining credit access and formalizing the economy.
2. **Manufacturing & Capex Boom**: PLI (Production-Linked Incentive) schemes driving electronics, defense, renewable energy, and semiconductor fabrication investments.
3. **Retailization of Indian Equities**: Systematic monthly DII inflows exceeding ₹25,000 Crores cushion Indian stock markets against volatile foreign capital outflows.

Stay invested in high-quality businesses with strong return on equity (RoE) and zero debt balance sheets through SOLAHANA's curated wealth solutions.
`,
  },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/solahana';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    for (const blogData of sampleBlogs) {
      await Blog.findOneAndUpdate(
        { slug: blogData.slug },
        { ...blogData, publishedAt: new Date() },
        { upsert: true, new: true }
      );
      console.log(`[Seed] Synced blog: ${blogData.title}`);
    }

    console.log('[Seed] Successfully seeded 6 financial articles!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

seed();
