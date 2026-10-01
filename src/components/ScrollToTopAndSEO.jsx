import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToConsultation, CONSULT_HASH, CONSULT_SECTION_ID } from '../utils/consultation';

const ROUTE_TITLES = {
  '/': 'SOLAHANA — Fiduciary Wealth Management & Financial Planning',
  '/about': 'About Us — SOLAHANA Financial Planning',
  '/who-we-serve': 'Who We Serve — SOLAHANA Financial Planning',
  '/our-process': 'Our Process — SOLAHANA Financial Planning',
  '/financial-planning': 'Financial Planning Services — SOLAHANA',
  '/goals': 'Life Goal Roadmap — SOLAHANA',
  '/investments': 'Goal-Based Investment Planning — SOLAHANA',
  '/tax-planning': 'Tax Optimization & Harvesting — SOLAHANA',
  '/risk-management': 'Risk & Insurance Planning — SOLAHANA',
  '/estate-planning': 'Estate & Succession Planning — SOLAHANA',
  '/pricing': 'Planning Fees & Pricing — SOLAHANA',
  '/calculators': 'Financial Calculators Suite — SOLAHANA Desk',
  '/calculators/sip': 'SIP Calculator — SOLAHANA',
  '/calculators/emi': 'EMI Calculator — SOLAHANA',
  '/calculators/retirement': 'FIRE Retirement Calculator — SOLAHANA',
  '/calculators/goal-planner': 'Goal Planner — SOLAHANA',
  '/calculators/lumpsum': 'Lumpsum Investment Calculator — SOLAHANA',
  '/calculators/fd': 'FD Return Calculator — SOLAHANA',
  '/calculators/inflation': 'Inflation Impact Calculator — SOLAHANA',
  '/blogs': 'Financial Intelligence & Insights — SOLAHANA Blog',
  '/contact': 'Schedule Fiduciary Consultation — SOLAHANA',
  '/dashboard': 'Client Wealth Portal — SOLAHANA',
  '/dashboard/calculations': 'Saved Calculations — SOLAHANA',
  '/saved-calculations': 'Saved Calculations — SOLAHANA',
  '/login': 'Client Login — SOLAHANA',
  '/admin/login': 'Admin Portal Sign In — SOLAHANA',
  '/admin/dashboard': 'Admin Analytics Desk — SOLAHANA',
  '/admin/consultations': 'Client Booking CRM — SOLAHANA Admin',
  '/admin/users': 'User Governance — SOLAHANA Admin',
  '/admin/blogs': 'Editorial CMS — SOLAHANA Admin',
  '/admin/newsletters': 'Newsletter Subscribers — SOLAHANA Admin',
};

export default function ScrollToTopAndSEO() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Keep the document title in sync on EVERY navigation — including links that carry the #book hash
    // (e.g. /contact -> /about#book), which previously kept the previous page's title.
    if (ROUTE_TITLES[pathname]) {
      document.title = ROUTE_TITLES[pathname];
    } else if (pathname.startsWith('/blogs/')) {
      document.title = 'Financial Article — SOLAHANA Insights';
    } else if (pathname.startsWith('/admin')) {
      document.title = 'Admin Portal — SOLAHANA';
    } else if (!pathname.startsWith('/invest/')) {
      // /invest/* pages set their own, more specific title.
      document.title = 'SOLAHANA — Fiduciary Financial Planning';
    }

    // "#book" (or the section id) means: take the visitor straight to the consultation form.
    // Otherwise, a new page starts at the top.
    if (hash === CONSULT_HASH || hash === `#${CONSULT_SECTION_ID}`) {
      let tries = 0;
      let timer;
      const attempt = () => {
        if (scrollToConsultation()) return;
        if (tries++ < 30) timer = window.setTimeout(attempt, 50); // wait for the page to render
      };
      // Start just after the page's own effects have run, so nothing scrolls us back up.
      timer = window.setTimeout(attempt, 120);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
