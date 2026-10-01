import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Mail, Phone, MapPin, Clock, Loader2, Check } from 'lucide-react';

import newsletterService from '../services/newsletterService';
import solahanaLogo from '../assets/solahana-logo.png';

export default function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    try {
      await newsletterService.subscribe(email, 'website_footer');
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      console.error('[Newsletter Subscribe Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (e, target) => {
    e.preventDefault();
    const pathMap = {
      'home': '/',
      'about': '/about',
      'who-we-serve': '/who-we-serve',
      'our-process': '/our-process',
      'financial-planning': '/financial-planning',
      'goals': '/goals',
      'investments': '/investments',
      'tax-planning': '/tax-planning',
      'calculators': '/calculators',
      'pricing': '/pricing',
      'contact': '/contact',
      'dashboard': '/dashboard',
      'blogs': '/blogs',
      'risk-management': '/risk-management',
      'estate-planning': '/estate-planning',
    };
    const dest = pathMap[target] || target;
    navigate(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SERVICES = [
    { name: 'Financial Planning', key: 'financial-planning' },
    { name: 'Retirement Planning', key: 'goals' },
    { name: 'Investments', key: 'investments' },
    { name: 'Tax Planning', key: 'tax-planning' },
    { name: 'Risk Management', key: 'risk-management' },
    { name: 'Estate Planning', key: 'estate-planning' },
  ];
  const COMPANY = [
    { name: 'About Us', key: 'about' },
    { name: 'Who We Serve', key: 'who-we-serve' },
    { name: 'Our Process', key: 'our-process' },
    { name: 'Pricing', key: 'pricing' },
    { name: 'Calculators', key: 'calculators' },
    { name: 'Resources', key: 'blogs' },
  ];
  const CONTACT = [
    { icon: Phone, label: 'Call us', value: '+91 73044 42171', href: 'tel:+917304442171' },
    { icon: Mail, label: 'Email', value: 'info@solahana.com', href: 'mailto:info@solahana.com' },
    { icon: MapPin, label: 'Visit', value: 'Andheri West, Mumbai 400053' },
    { icon: Clock, label: 'Hours', value: 'Mon – Sat, 10am – 7pm' },
  ];
  const SOCIAL = [
    { title: 'LinkedIn', href: 'https://www.linkedin.com/company/solahana', path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z' },
    { title: 'Instagram', href: 'https://www.instagram.com/solahana.wealth', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { title: 'WhatsApp', href: 'https://wa.me/917304442171', path: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.146 4.187 4.289-1.126z' },
  ];

  const LinkList = ({ title, items }) => (
    <div>
      <h3 className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#0F1F45]">
        <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-[#E6C27A] to-[#C9A04F]" />
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item.key}>
            <button
              onClick={(e) => handleLinkClick(e, item.key)}
              className="group inline-flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#1A3170] transition-colors cursor-pointer"
            >
              <span>{item.name}</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-[#C9A04F] transition-all" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="relative z-20 overflow-hidden bg-gradient-to-b from-white via-[#FAFBFD] to-[#F1F4FA] font-inter">
      {/* gold hairline + logo-ring motif */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A04F]/60 to-transparent" />
      <svg className="absolute -top-40 -right-40 w-[560px] h-[560px] pointer-events-none" viewBox="0 0 560 560" fill="none" aria-hidden="true">
        {[110, 160, 210, 260].map((r, i) => (
          <circle key={r} cx="280" cy="280" r={r} stroke="#C9A04F" strokeOpacity={0.16 - i * 0.03} strokeWidth="1.5" />
        ))}
      </svg>
      <div className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full bg-[#2F5BC7]/[0.05] blur-[110px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <button onClick={(e) => handleLinkClick(e, 'home')} className="group cursor-pointer" title="SOLAHANA Home" aria-label="SOLAHANA Home">
              <img src={solahanaLogo} alt="SOLAHANA" className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-[1.02]" />
            </button>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[#A67C2E]">Your Complete Financial Partner</p>
            <p className="mt-4 text-sm text-[#475569] leading-relaxed max-w-sm">
              Simple, goal-based financial planning for Indian families, built around your life, not around products.
            </p>

            <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {CONTACT.map((c) => {
                const Icon = c.icon;
                const body = (
                  <>
                    <span className="w-10 h-10 rounded-xl bg-white border border-[#E4E8F0] shadow-[0_1px_2px_rgba(15,31,69,0.05)] flex items-center justify-center shrink-0 text-[#1A3170] group-hover:bg-[#1A3170] group-hover:text-[#E6C27A] group-hover:border-[#1A3170] transition-colors">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="leading-tight">
                      <span className="block text-[11px] text-[#8A96AB] font-semibold">{c.label}</span>
                      <span className="block text-sm font-semibold text-[#0F1F45]">{c.value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={c.label}>
                    {c.href ? (
                      <a href={c.href} className="group flex items-center gap-3">{body}</a>
                    ) : (
                      <div className="group flex items-center gap-3">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Links */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 lg:pl-6">
            <LinkList title="Services" items={SERVICES} />
            <LinkList title="Company" items={COMPANY} />
          </div>

          {/* Newsletter card + social */}
          <div className="lg:col-span-4">
            <div className="bg-ink-band rounded-3xl p-6 sm:p-7 overflow-hidden shadow-[0_24px_60px_rgba(15,31,69,0.25)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#E6C27A]">Stay informed</p>
              <h3 className="mt-2 text-xl font-bold text-white leading-snug">Practical money tips, once a week.</h3>
              <p className="mt-2 text-sm text-[#AEBBD3]">Tax, SIPs and planning ideas in plain language. No spam.</p>

              <form onSubmit={handleSubscribe} className="mt-5 flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.07] border border-white/15 focus-within:border-[#E6C27A]/60 transition-colors">
                <Mail className="w-4 h-4 text-[#AEBBD3] ml-2 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email address"
                  required
                  className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-[#7F8DA8] focus:outline-none py-2"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#0F1F45] bg-gradient-to-br from-[#EAD08F] via-[#C9A04F] to-[#A67C2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] hover:brightness-105 disabled:opacity-60 transition cursor-pointer"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : subscribed ? <><Check className="w-3.5 h-3.5" /> Done</> : <>Subscribe <ArrowRight className="w-3.5 h-3.5" /></>}
                </button>
              </form>
              {subscribed && <p className="mt-2 text-xs text-[#E6C27A]">Thanks! You’re on the list.</p>}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-xs font-semibold text-[#8A96AB] mr-1">Follow us</span>
              {SOCIAL.map((sItem) => (
                <a
                  key={sItem.title}
                  href={sItem.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={sItem.title}
                  aria-label={sItem.title}
                  className="w-10 h-10 rounded-full bg-white border border-[#E4E8F0] flex items-center justify-center text-[#1A3170] hover:bg-[#1A3170] hover:text-[#E6C27A] hover:border-[#1A3170] hover:-translate-y-0.5 transition-all shadow-[0_1px_2px_rgba(15,31,69,0.05)]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d={sItem.path} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 h-px bg-gradient-to-r from-transparent via-[#CBD6EE] to-transparent" />
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#5B6B84]">
          <p>© {new Date().getFullYear()} SOLAHANA Financial Planning. All rights reserved.</p>
          <nav className="flex items-center gap-5" aria-label="Legal">
            <a href="/contact" className="hover:text-[#1A3170] transition-colors">Privacy Policy</a>
            <a href="/contact" className="hover:text-[#1A3170] transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-[#1A3170] transition-colors">Disclosures</a>
          </nav>
        </div>
        <p className="pb-6 text-[11px] text-[#8A96AB] text-center max-w-3xl mx-auto leading-relaxed">
          Disclaimer: Investments are subject to market risks. Read all scheme related documents carefully before investing. Past performance is not indicative of future returns.
        </p>
      </div>

      {/* Oversized brand wordmark */}
      <div aria-hidden="true" className="relative select-none pointer-events-none -mb-[3.2vw]">
        <p className="text-center font-serif-luxury font-extrabold leading-[0.8] tracking-[-0.04em] text-[18vw] lg:text-[16vw] bg-gradient-to-b from-[#1A3170]/[0.13] via-[#1A3170]/[0.06] to-transparent bg-clip-text text-transparent">
          SOLAHANA
        </p>
      </div>
    </footer>
  );
}
