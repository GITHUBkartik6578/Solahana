import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Coins,
  Sprout,
  Umbrella,
  FileText,
  ShieldCheck,
  Home,
  Target,
  Users,
  User,
  Briefcase,
  Gem,
  Globe,
  Shield,
  Calculator,
  Scale,
  Settings,
  Cog,
  Award,
  BookOpen,
  Phone,
  Mail,
  Leaf,
} from 'lucide-react';

import solahanaLogo from '../assets/solahana-logo.png';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const SERVICES = [
  { name: 'Financial Planning', icon: BarChart3, key: 'financial-planning' },
  { name: 'Wealth Planning', icon: Coins, key: 'goals' },
  { name: 'Investment Planning', icon: Sprout, key: 'investments' },
  { name: 'Retirement Planning', icon: Umbrella, key: 'retirement' },
  { name: 'Tax Planning', icon: FileText, key: 'tax-planning' },
  { name: 'Risk Planning', icon: ShieldCheck, key: 'risk-management' },
  { name: 'Estate Planning', icon: Home, key: 'estate-planning' },
  { name: 'Goal Planning', icon: Target, key: 'goals' },
];
// Each link opens its own guide on the Who We Serve page
const WHO = [
  { name: 'Individuals & Families', icon: Users, key: '/who-we-serve#families' },
  { name: 'Professionals', icon: User, key: '/who-we-serve#salaried' },
  { name: 'Business Owners', icon: Briefcase, key: '/who-we-serve#business-owners' },
  { name: 'HNI Families', icon: Gem, key: 'who-we-serve' },
  { name: 'NRIs', icon: Globe, key: '/who-we-serve#nri' },
];
// Partner types: informational only, there is no page for them
const NETWORK = [
  { name: 'Mutual Fund Partners', icon: BarChart3 },
  { name: 'Insurance Partners', icon: Shield },
  { name: 'Loan & Credit Partners', icon: FileText },
  { name: 'CA & Tax Professionals', icon: Calculator },
  { name: 'Legal & Estate Professionals', icon: Scale },
  { name: 'Other Specialists', icon: Users },
];
const ABOUT = [
  { name: 'Our Approach', icon: Settings, key: 'about' },
  { name: 'Our Process', icon: Cog, key: 'our-process' },
  { name: 'Our Experts', icon: Award, key: 'our-experts' },
  { name: 'Knowledge Centre', icon: BookOpen, key: 'blogs' },
  { name: 'Contact Us', icon: Phone, key: 'contact' },
];
const LEGAL = [
  { name: 'Privacy Policy', key: 'contact' },
  { name: 'Terms of Use', key: 'contact' },
  { name: 'Disclosures', key: 'contact' },
  { name: 'Grievance Redressal', key: 'contact' },
  { name: 'Contact', key: 'contact' },
];
const SOCIAL = [
  { title: 'LinkedIn', href: 'https://www.linkedin.com/company/solahana', path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z' },
  { title: 'Instagram', href: 'https://www.instagram.com/solahana.wealth', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  { title: 'WhatsApp', href: 'https://wa.me/917304442171', path: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.146 4.187 4.289-1.126z' },
];

const pathMap = {
  home: '/',
  about: '/about',
  'who-we-serve': '/who-we-serve',
  'our-process': '/our-process',
  'our-experts': '/our-experts',
  'financial-planning': '/financial-planning',
  goals: '/goals',
  investments: '/investments',
  'tax-planning': '/tax-planning',
  contact: '/contact',
  blogs: '/blogs',
  'risk-management': '/risk-management',
  'estate-planning': '/estate-planning',
  retirement: '/calculators/retirement',
  calculators: '/calculators',
};

const roundBtn =
  'w-9 h-9 rounded-full border border-[#E2B24E]/70 flex items-center justify-center text-[#E2B24E] hover:bg-[#E2B24E] hover:text-[#0F1F45] hover:-translate-y-0.5 transition-all';

export default function Footer() {
  const navigate = useNavigate();

  const go = (key) => {
    const path = pathMap[key] || key;
    navigate(path);
    // Links with a #section are scrolled into place by ScrollToTopAndSEO
    if (!path.includes('#')) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ColumnTitle = ({ children }) => (
    <>
      <h3 style={serif} className="text-[17px] font-bold leading-tight text-white">
        {children}
      </h3>
      <span className="mt-2.5 block h-[2px] w-9 rounded-full bg-[#E2B24E]" />
    </>
  );

  const IconRow = ({ item }) => {
    const Icon = item.icon;
    const inner = (
      <>
        <Icon className="w-[18px] h-[18px] shrink-0 text-[#E2B24E]" strokeWidth={1.6} />
        <span>{item.name}</span>
      </>
    );
    return item.key ? (
      <button onClick={() => go(item.key)} className="flex items-center gap-2.5 text-left text-[13.5px] text-[#D4DCEC] hover:text-[#E2B24E] transition-colors cursor-pointer">
        {inner}
      </button>
    ) : (
      <div className="flex items-center gap-2.5 text-[13.5px] text-[#D4DCEC]">{inner}</div>
    );
  };

  const Column = ({ title, items, children }) => (
    <div>
      <ColumnTitle>{title}</ColumnTitle>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.name}>
            <IconRow item={item} />
          </li>
        ))}
      </ul>
      {children}
    </div>
  );

  return (
    <footer className="relative z-20 overflow-hidden bg-gradient-to-b from-[#0C1C42] via-[#0A1836] to-[#07122B] text-white font-inter">
      {/* gold hairline + logo-ring motif */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A04F]/60 to-transparent" />
      <svg className="absolute -top-40 -right-40 w-[560px] h-[560px] pointer-events-none" viewBox="0 0 560 560" fill="none" aria-hidden="true">
        {[110, 160, 210, 260].map((r, i) => (
          <circle key={r} cx="280" cy="280" r={r} stroke="#C9A04F" strokeOpacity={0.3 - i * 0.06} strokeWidth="1.5" />
        ))}
      </svg>
      <div className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full bg-[#2F5BC7]/[0.18] blur-[120px] pointer-events-none" />

      {/* Oversized brand wordmark: sits behind the footer content, so it adds depth without adding height */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[2%] flex justify-center select-none pointer-events-none">
        <p
          className="font-serif-luxury font-extrabold leading-[0.8] tracking-[-0.04em] text-[17vw] whitespace-nowrap bg-clip-text text-transparent [-webkit-background-clip:text] [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)]"
          style={{
            // left half warm gold, right half light blue, meeting in a soft blend at the middle
            backgroundImage:
              'linear-gradient(to right, rgba(226,178,78,0.34) 0%, rgba(226,178,78,0.30) 44%, rgba(120,165,235,0.30) 56%, rgba(120,165,235,0.34) 100%)',
          }}
        >
          SOLAHANA
        </p>
      </div>

      <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.25fr_0.95fr_0.9fr_1.3fr_0.95fr] gap-10 xl:gap-0">
          {/* Brand */}
          <div className="sm:col-span-2 xl:col-span-1 xl:pr-8">
            <button onClick={() => go('home')} className="group block cursor-pointer" title="SOLAHANA Home" aria-label="SOLAHANA Home">
              <span className="inline-block rounded-2xl bg-[#FEFDF9] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] ring-1 ring-[#E2B24E]/40">
                <img src={solahanaLogo} alt="SOLAHANA" className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]" />
              </span>
            </button>
            <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.3em] text-[#AEBBD3]">Financial Planning Platform</p>

            <p style={serif} className="mt-3 text-[20px] font-bold leading-[1.14] text-white">
              Plan with <span className="text-[#E2B24E]">Clarity.</span>
              <br />
              Build with <span className="text-[#E2B24E]">Purpose.</span>
              <br />
              Live with <span className="text-[#E2B24E]">Confidence.</span>
            </p>
            <span className="mt-3 block h-[2px] w-10 rounded-full bg-[#E2B24E]" />

            <p className="mt-2.5 text-[12.5px] text-[#C8D2E6] leading-relaxed max-w-sm">
              Solahana is a financial planning platform that helps individuals, families, professionals, business owners and HNIs create a comprehensive financial plan with the
              expertise of Chartered Wealth Managers (CWM).
            </p>

            <div className="mt-3 flex items-center gap-2.5">
              {SOCIAL.map((item) => (
                <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" title={item.title} aria-label={item.title} className={roundBtn}>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d={item.path} />
                  </svg>
                </a>
              ))}
              <a href="mailto:info@solahana.com" title="Email us" aria-label="Email us" className={roundBtn}>
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns, separated by a hairline on desktop */}
          <div className="xl:border-l xl:border-white/15 xl:px-6">
            <Column title="Our Planning Services" items={SERVICES} />
          </div>
          <div className="xl:border-l xl:border-white/15 xl:px-6">
            <Column title="Who We Serve" items={WHO} />
          </div>
          <div className="xl:border-l xl:border-white/15 xl:px-6">
            <Column title="Our Professional Network" items={NETWORK}>
              <p className="mt-3 text-[11px] leading-snug text-[#AEBBD3]">
                We work with a network of trusted professionals and product partners, as per their respective terms and conditions, to help you implement your financial plan.
              </p>
            </Column>
          </div>
          <div className="xl:border-l xl:border-white/15 xl:pl-6">
            <Column title="About Solahana" items={ABOUT}>
              <button
                onClick={() => go('contact')}
                className="group mt-4 inline-flex w-full items-center justify-between gap-3 rounded-xl bg-gradient-to-br from-[#EAD08F] via-[#C9A04F] to-[#A67C2E] px-4 py-2 text-sm font-bold text-[#0F1F45] shadow-[0_10px_24px_rgba(166,124,46,0.3)] hover:brightness-105 transition cursor-pointer"
              >
                <span>Start Your Financial Plan</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => go('calculators')}
                className="group mt-2 inline-flex w-full items-center justify-between gap-3 rounded-xl border border-[#E2B24E]/70 px-4 py-2 text-sm font-bold text-[#E2B24E] hover:bg-[#E2B24E] hover:text-[#0F1F45] transition cursor-pointer"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Calculator className="w-4 h-4" />
                  Calculators
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Column>
          </div>
        </div>

        {/* Important information strip */}
        <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#E2B24E]/50 to-transparent" />
        <div className="py-3 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-center">
          <div className="flex items-start gap-4">
            <Shield className="w-7 h-7 shrink-0 text-[#E2B24E]" strokeWidth={1.4} />
            <div>
              <h4 style={serif} className="text-base font-bold text-white">
                Important Information
              </h4>
              <p className="mt-0.5 text-[11.5px] leading-snug text-[#AEBBD3]">
                Solahana provides financial planning services with the expertise of qualified Chartered Wealth Managers (CWM). We work with regulated product partners, including
                Mutual Fund Distributors, Insurance Partners, Loan Providers, CA &amp; Tax Professionals, Legal Experts and other professionals, as per their respective terms and
                conditions. Investment products are subject to market risks. Please consider your financial objectives, risk profile and circumstances before making any financial
                decisions.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:border-l lg:border-white/15 lg:pl-10">
            <Leaf className="w-7 h-7 shrink-0 text-[#E2B24E]" strokeWidth={1.4} />
            <p style={serif} className="text-[15px] leading-snug text-white">
              Professional Planning.
              <br />
              A Brighter Financial Future.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="py-2.5 flex flex-col md:flex-row items-center justify-between gap-4 text-[12.5px] text-[#AEBBD3]">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="Legal">
            {LEGAL.map((l, i) => (
              <React.Fragment key={l.name}>
                {i > 0 && <span className="text-[#E2B24E]/50">|</span>}
                <button onClick={() => go(l.key)} className="hover:text-[#E2B24E] transition-colors cursor-pointer">
                  {l.name}
                </button>
              </React.Fragment>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} Solahana. All Rights Reserved.</p>
        </div>
      </div>

    </footer>
  );
}
