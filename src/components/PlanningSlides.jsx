import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import financialImg from '../assets/slides/financial.webp';
import investmentImg from '../assets/slides/investment.webp';
import retirementImg from '../assets/slides/retirement.webp';
import riskImg from '../assets/slides/risk.webp';
import taxImg from '../assets/slides/tax.webp';
import estateImg from '../assets/slides/estate.webp';

export const slides = [
  {
    id: 'financial',
    fit: 'contain',
    label: 'Financial Planning',
    line1: 'Your Money',
    line2: 'Deserves a Plan.',
    body: "From today's goals to tomorrow's legacy, a goal-based financial planning approach to help you grow wealth, stay protected, and live the life you aspire for.",
    route: '/financial-planning',
    image: financialImg,
    alt: 'Person planning finances on a laptop surrounded by goal icons',
  },
  {
    id: 'investment',
    fit: 'contain',
    label: 'Investment Planning',
    line1: 'Grow Your Wealth',
    line2: 'with Discipline.',
    body: 'A goal-based investment plan to help you build, grow and preserve your wealth across market cycles.',
    route: '/investments',
    image: investmentImg,
    alt: 'Person reviewing investments with a rising growth chart and shield',
  },
  {
    id: 'retirement',
    fit: 'cover',
    label: 'Retirement Planning',
    line1: 'A Confident',
    line2: 'Tomorrow.',
    body: 'Plan today for a financially independent and fulfilling retirement.',
    route: '/calculators/retirement',
    image: retirementImg,
    alt: 'Couple relaxing on beach chairs watching the sunset',
  },
  {
    id: 'risk',
    fit: 'contain',
    label: 'Risk Planning',
    line1: 'Be Ready',
    line2: "for Life's Uncertainties.",
    body: 'Protect what matters most with a comprehensive risk plan for you and your family.',
    route: '/risk-management',
    image: riskImg,
    alt: 'Family protected inside a shield',
  },
  {
    id: 'tax',
    fit: 'contain',
    label: 'Tax Planning',
    line1: 'Trim the Tax.',
    line2: 'Boost the Benefits!',
    body: 'A strategic tax planning approach to legally reduce your tax outgo and build long-term wealth.',
    route: '/tax-planning',
    image: taxImg,
    alt: 'Person reviewing tax documents with a calculator',
  },
  {
    id: 'estate',
    fit: 'cover',
    label: 'Estate Planning',
    line1: 'A Legacy',
    line2: 'That Lives On.',
    body: 'Create a plan to transfer your wealth smoothly and securely to future generations.',
    route: '/estate-planning',
    image: estateImg,
    alt: 'Parent and child sitting under a tree looking at the family home',
  },
];

// Softens the illustration edges so they blend into the slide background.
// Scenic slides fill their half edge to edge, so only their left edge is faded.
const fadeAll = {
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, black 18%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
  WebkitMaskComposite: 'source-in',
  maskImage:
    'linear-gradient(to right, transparent 0%, black 18%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
  maskComposite: 'intersect',
};
const fadeLeft = {
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
  maskImage: 'linear-gradient(to right, transparent 0%, black 22%)',
};

// One slide of the hero carousel; same frame and copy alignment as the main hero slide
export function PlanningSlide({ slide }) {
  return (
    <div className="relative flex flex-col xl:flex-row xl:items-center xl:h-[clamp(460px,calc(100svh-124px),620px)] bg-[#F6F8FB]">
      <div className="order-2 xl:order-none relative flex justify-center xl:justify-end h-[230px] sm:h-[300px] xl:h-full xl:absolute xl:right-0 xl:top-0 xl:w-[52%]">
        {/* Illustrations keep their own box so the edge fade lands on the picture itself; scenic ones fill the half */}
        <Link to={slide.route} aria-label={slide.label} className={slide.fit === 'cover' ? 'absolute inset-0' : 'h-full max-w-full'}>
        <img
          src={slide.image}
          alt={slide.alt}
          className={`select-none ${
            slide.fit === 'cover'
              ? 'absolute inset-0 h-full w-full object-cover object-center xl:object-right'
              : 'h-full w-auto max-w-full'
          }`}
          style={slide.fit === 'cover' ? fadeLeft : fadeAll}
          draggable="false"
        />
        </Link>
      </div>

      <div className="order-1 xl:order-none relative z-10 max-w-[1320px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 xl:pt-10 xl:pb-0">
        <div className="@container w-full xl:w-[44%] text-center xl:text-left">
          <p className="font-sora text-[10px] sm:text-xs font-medium tracking-[0.26em] text-[#C58A1B] uppercase leading-relaxed">
            {slide.label}
          </p>
          <h2 className="mt-4 font-serif-luxury text-[length:clamp(28px,8cqw,64px)] leading-[1.05] tracking-tight text-[#0F1F45]">
            <span className="block">{slide.line1}</span>
            <span className="block text-[#C58A1B]">{slide.line2}</span>
          </h2>
          <p className="mt-4 max-w-md mx-auto xl:mx-0 text-sm sm:text-lg text-[#1E2A4A] font-inter leading-relaxed">
            {slide.body}
          </p>
          <Link
            to={slide.route}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#0F1F45] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,31,69,0.35)] transition-all hover:shadow-[0_15px_40px_rgba(15,31,69,0.5)]"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
