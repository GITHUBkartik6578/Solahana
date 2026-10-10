// Content of the footer pages (Privacy Policy, Terms of Use, Disclosures, Grievance Redressal, Contact).
// Wording is the approved copy; each section renders as a bold heading followed by its text.

export const CONTACT_EMAIL = 'online@solahana.com';
export const CONTACT_PHONE = '+91 98200 65944';
export const CONTACT_PHONE_HREF = 'tel:+919820065944';

export const IMPORTANT_INFORMATION =
  'Solahana operates as a comprehensive family office, financial planning, and distribution facilitation platform, leveraging the expertise of qualified Chartered Wealth Managers (CWM). We collaborate with regulated institutional partners, AMFI-registered Mutual Fund Distributors, insurance partners, loan providers, CA & tax professionals, legal & estate professionals, and authorized market intermediaries as per their respective terms and conditions. Investment products are subject to market risks. Please read all scheme-related or product-related documents carefully before investing, and evaluate your financial objectives, risk profile, and individual circumstances before making any financial decisions.';

export const LEGAL_PAGES = {
  privacy: {
    slug: 'privacy-policy',
    path: '/privacy-policy',
    title: 'Privacy Policy',
    tagline: 'How we collect, use and protect your information.',
    photo: 'mf',
    sections: [
      { heading: 'Data Collection', text: 'We collect personal, contact, and financial details strictly for the purpose of custom financial planning, family office structuring, and facilitating connections with appropriate product partners.' },
      { heading: 'Data Security', text: 'Your data is protected using enterprise-grade security standards and is never sold or unauthorizedly shared with third parties. It is only shared with authorized institutional partners with your explicit consent for product execution.' },
    ],
  },
  terms: {
    slug: 'terms-of-use',
    path: '/terms-of-use',
    title: 'Terms of Use',
    tagline: 'The terms that apply when you use the Solahana platform.',
    photo: 'pms',
    sections: [
      { heading: 'Acceptance of Terms', text: 'By accessing and using solahana.com, you agree to comply with and be bound by these Terms of Use. If you do not agree, please refrain from using the platform.' },
      { heading: 'Nature of Services', text: 'Solahana provides financial planning, wealth structuring, and distribution facilitation services. The platform acts as an intermediary connecting clients with registered institutional partners, AMFI-registered distributors, and authorized service providers for product execution.' },
      { heading: 'No Direct Portfolio Management / Investment Advisory (SEBI Compliance)', text: 'Solahana does not directly manage funds, execute direct portfolio advisory, or provide direct stock-broking services unless explicitly channeled through pre-registered, licensed institutional channel partners and brokers. All direct market executions occur via respective regulated partners.' },
      { heading: 'Intellectual Property', text: 'All content, trademarks, logos, and branding elements on this website are the intellectual property of Solahana and protected under applicable laws.' },
    ],
  },
  disclosures: {
    slug: 'disclosures',
    path: '/disclosures',
    title: 'Disclosures',
    tagline: 'How our business model works, stated plainly.',
    photo: 're',
    sections: [
      { heading: 'Distribution & Referral Model', text: 'Solahana earns referral, distribution, or facilitation fees from registered product partners, institutional distributors, and financial service providers when clients opt for products through our referred network.' },
      { heading: 'Partner Execution', text: 'Transactions relating to Mutual Funds, PMS, AIF, SIF, Bonds, and Equities are processed and executed through our authorized institutional partners and regulated intermediaries. Solahana does not hold client funds directly for trading or investment purposes.' },
      { heading: 'Professional Credentials', text: 'References to Chartered Wealth Manager (CWM) expertise reflect the professional qualifications and core competence of our core planning team, designed to deliver high-end family office advisory frameworks.' },
    ],
  },
  grievance: {
    slug: 'grievance-redressal',
    path: '/grievance-redressal',
    title: 'Grievance Redressal',
    tagline: 'Reach our Grievance Officer for any concern.',
    photo: 'bonds',
    sections: [
      { heading: 'Grievance Officer', text: 'In case of any grievances regarding platform services, facilitation, or coordination with our partner network, you can reach out to our Grievance Officer at online@solahana.com or call us at +91 98200 65944. We ensure timely resolution of all queries in coordination with our respective institutional partners.' },
    ],
    contactCards: true,
  },
  contact: {
    slug: 'contact-us',
    path: '/contact-us',
    title: 'Contact',
    tagline: 'We’re happy to hear from you.',
    photo: 'estate',
    sections: [
      { heading: 'Get in Touch', text: 'Write to us or call, and our team will respond. To start a conversation about your plan, you can also book a free consultation.' },
    ],
    contactCards: true,
    bookCta: true,
  },
};

export const LEGAL_LINKS = [
  LEGAL_PAGES.privacy,
  LEGAL_PAGES.terms,
  LEGAL_PAGES.disclosures,
  LEGAL_PAGES.grievance,
  LEGAL_PAGES.contact,
];
