// Content of the footer pages (Privacy Policy, Terms of Use, Disclosures, Grievance Redressal, Contact).
// Wording is the approved copy; each section renders as a bold heading followed by its text.

export const CONTACT_EMAIL = 'online@solahana.com';
export const CONTACT_PHONE = '+91 98200 65944';
export const CONTACT_PHONE_HREF = 'tel:+919820065944';

export const IMPORTANT_INFORMATION =
  'Solahana functions as an integrated family office, financial planning, and distribution facilitation platform. Wealth management products, mutual funds, insurance, and institutional-partnered assets (PMS, AIF, SIF, Bonds, Equity execution) are channeled through authorized group entities, AMFI-registered structures, and registered institutional partners in strict compliance with applicable regulatory frameworks.';

export const LEGAL_PAGES = {
  privacy: {
    slug: 'privacy-policy',
    path: '/privacy-policy',
    title: 'Privacy Policy',
    tagline: 'Your information is safe with us.',
    eyebrow: 'Your data. Our responsibility',
    photo: 'mf',
    design: 'terms', // rendered by TermsLayout (banner + numbered rows)
    art: 'privacy',
    card: true,
    sections: [
      { heading: 'Information Collection', icons: ['file', 'number'], text: 'We collect personal information (Name, Phone Number, Email, City) and high-level financial goals strictly to provide tailored wealth diagnostic sessions, family office structuring, and communication.' },
      { heading: 'Data Protection & Security', icons: ['shield', 'number'], text: 'Your personal and financial data is protected using enterprise-grade encryption and security protocols.' },
      { heading: 'Data Sharing', icons: ['share', 'number'], text: 'We never sell or trade your personal data to third parties. Data is shared with regulated institutional partners only upon your explicit consent for product execution purposes.' },
      { heading: 'Your Rights', icons: ['user', 'number'], text: 'You may request access, correction, or deletion of your personal data by contacting us at online@solahana.com.' },
    ],
  },
  terms: {
    slug: 'terms-of-use',
    path: '/terms-of-use',
    title: 'Terms of Use',
    tagline: 'Our platform, your trust — with complete transparency.',
    photo: 'pms',
    design: 'terms', // rendered by TermsLayout (artwork banner + numbered rows)
    art: 'terms',
    effective: { date: 'October 2026', entity: 'Solahana Wealth Architecture & Family Office' },
    sections: [
      { heading: 'Acceptance of Terms', icons: ['file', 'number'], text: 'By accessing, browsing, or using solahana.com (“Platform”), you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please discontinue using the platform immediately.' },
      { heading: 'Nature of Platform & Services', icons: ['building', 'users'], text: 'Solahana operates strictly as a consultative family office, wealth architecture, financial planning, and distribution facilitation platform. We assist clients in diagnostic wealth analysis, asset allocation frameworks, tax optimization, risk management, and estate structuring.' },
      { heading: 'No Direct Custody or Portfolio Management', icons: ['file', 'shield'], text: 'Solahana does not directly manage funds, act as a fund custodian, or execute direct portfolio advisory/stock-broking services unless routed explicitly through pre-registered, licensed institutional channel partners and regulated intermediaries. All capital transactions and market executions occur strictly via respective regulated partners.' },
      { heading: 'Intellectual Property Rights', icons: ['copyright', 'copyright'], text: 'All content, logos, trademarks, visual graphics, designs, and branding elements displayed on solahana.com are the exclusive intellectual property of Solahana and are protected under applicable copyright and trademark laws.' },
    ],
  },
  disclosures: {
    slug: 'disclosures',
    path: '/disclosures',
    title: 'Regulatory Disclosures',
    titleAccent: 'Disclosures', // shown in gold
    eyebrow: 'Transparency',
    tagline: 'Clear information for informed decisions.',
    photo: 're',
    design: 'terms', // rendered by TermsLayout (artwork banner + numbered rows)
    art: 'disclosures',
    notice: 'Investments are subject to market risks. Please read all scheme-related or product-related documents carefully before investing, and evaluate your financial objectives, risk profile, and individual circumstances before making any financial decisions.',
    sections: [
      { heading: 'Distribution & Referral Model', icons: ['handshake', 'number'], text: 'Solahana works on a consultative distribution and facilitation model. We earn referral, distribution, or facilitation fees from registered product manufacturers, institutional distributors, and financial service providers when clients opt for products or services through our referred institutional network.' },
      { heading: 'Institutional Partner Execution', icons: ['chart', 'number'], text: 'Transactions related to Mutual Funds, PMS, AIF, Bonds, Equities, Loans, and Insurance are processed and executed through authorized institutional partners, AMFI-registered distributors, regulated brokers, and licensed financial partners as per their respective terms. Solahana does not collect or hold client funds directly for investment execution.' },
      { heading: 'Professional Credentials', icons: ['award', 'number'], text: 'References to Chartered Wealth Manager (CWM®) expertise represent the professional qualifications and competence of our core leadership team to deliver institutional-grade family office frameworks.' },
    ],
  },
  grievance: {
    slug: 'grievance-redressal',
    path: '/grievance-redressal',
    title: 'Grievance Redressal Policy',
    tagline: 'Your concerns matter to us.',
    eyebrow: 'We are here to listen',
    photo: 'bonds',
    design: 'terms', // rendered by TermsLayout (banner + intro + contact cards)
    art: 'grievance',
    intro: 'If you have any queries, concerns, or grievances regarding our platform services, facilitation, or coordination with our institutional partner network, you can reach out to our Grievance Redressal Officer:',
    sections: [],
    cards: [
      { icon: 'user', title: 'Grievance Redressal Officer', text: 'Compliance & Grievance Cell' },
      { icon: 'mail', title: 'Email', text: 'online@solahana.com', href: 'mailto:online@solahana.com' },
      { icon: 'phone', title: 'Contact Number', text: '7304442171', href: 'tel:+917304442171', big: true },
      { icon: 'clock', title: 'Resolution Timeline', text: 'All complaints will be acknowledged within 48 hours and resolved in coordination with respective regulated partners within 15 business days.' },
    ],
  },
  contact: {
    slug: 'contact-us',
    path: '/contact-us',
    title: 'Contact',
    tagline: 'We’re happy to hear from you.',
    photo: 'estate',
    design: 'contact', // rendered by ContactLayout
    sections: [],
  },
};

export const LEGAL_LINKS = [
  LEGAL_PAGES.privacy,
  LEGAL_PAGES.terms,
  LEGAL_PAGES.disclosures,
  LEGAL_PAGES.grievance,
  LEGAL_PAGES.contact,
];
