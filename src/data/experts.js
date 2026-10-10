import amitPandey from '../assets/expert-amit-pandey.webp';
import amitPandeyAvatar from '../assets/expert-amit-pandey-avatar.webp';
import abhishekPandey from '../assets/expert-abhishek-pandey.webp';
import abhishekPandeyAvatar from '../assets/expert-abhishek-pandey-avatar.webp';

// One entry per expert. Add the next expert here and the "Our Experts" page lists them automatically.
// Only put facts the owner has confirmed.
// Optional fields (credential, location, qualifications, summary, phone*, whatsapp, hours) can be left out;
// the page hides whatever an expert does not have.
export const EXPERTS = [
  {
    id: 'amit-pandey',
    name: 'Amit R. Pandey',
    credential: 'Chartered Wealth Manager (CWM®)',
    photo: amitPandey,
    avatar: amitPandeyAvatar,
    years: 25,
    location: 'Mumbai',
    role: 'Chartered Wealth Manager',
    photoAlt: 'Amit R. Pandey, Chartered Wealth Manager (CWM)',
    headline: 'MBA | Ex-Banker | 25+ Years of Experience in Financial Services',
    summary:
      'Amit R. Pandey is a Chartered Wealth Manager with 25+ years of experience in financial services. He helps families plan across investments, risk, tax, retirement and estate planning, with advice that is client-first, unbiased and compliant.',
    qualifications: ['Chartered Wealth Manager (CWM®)', 'MBA', 'Ex-Banker'],
    stats: [
      { value: '25+', label: 'Years in financial services' },
      { value: 'CWM®', label: 'Chartered Wealth Manager' },
      { value: 'MBA', label: 'Post-graduate degree' },
      { value: '6', label: 'Planning areas covered' },
    ],
    expertise: [
      { label: 'Financial Planning', to: '/financial-planning' },
      { label: 'Investment Planning', to: '/investments' },
      { label: 'Retirement Planning', to: '/calculators/retirement' },
      { label: 'Risk Planning', to: '/risk-management' },
      { label: 'Tax Planning', to: '/tax-planning' },
      { label: 'Estate Planning', to: '/estate-planning' },
    ],
    approach: [
      { title: 'Qualified & Experienced', text: 'Chartered Wealth Manager with 25+ years in financial services.' },
      { title: 'Comprehensive Approach', text: 'Integrated planning across investments, risk, tax, retirement and estate planning.' },
      { title: 'Ethical & Transparent', text: 'Client-first, unbiased and compliant financial planning.' },
      { title: 'Long-Term Partnership', text: 'Focused on your goals, priorities and financial well-being at every life stage.' },
    ],
    phoneDisplay: '+91 73044 42171',
    phoneTel: 'tel:+917304442171',
    whatsapp: 'https://wa.me/917304442171?text=' + encodeURIComponent('Hi Amit, I found you on the Solahana website and would like to talk.'),
    hours: 'Monday to Saturday, 10 AM to 7 PM',
  },
  {
    id: 'abhishek-pandey',
    name: 'Abhishek Pandey',
    photo: abhishekPandey,
    avatar: abhishekPandeyAvatar,
    years: 20,
    role: 'Risk Planning & Investment Specialist',
    photoAlt: 'Abhishek Pandey, Risk Planning & Investment Specialist',
    summary: 'Abhishek Pandey is a Risk Planning & Investment Specialist with 20+ years of experience.',
    expertise: [
      { label: 'Risk Planning', to: '/risk-management' },
      { label: 'Investment Planning', to: '/investments' },
    ],
  },
];
