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

// Scenic photos run edge to edge on the right and fade out softly on their left side
const fadeLeft = {
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
  maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
};

// Softens the illustration edges so they blend into the slide background (scenic photos are shown as a rounded card instead).
const fadeAll = {
  WebkitMaskImage:
    'linear-gradient(to right, transparent 0%, black 28%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
  WebkitMaskComposite: 'source-in',
  maskImage:
    'linear-gradient(to right, transparent 0%, black 28%, black 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
  maskComposite: 'intersect',
};
// One slide of the hero carousel; same frame and copy alignment as the main hero slide
export function PlanningSlide({ slide }) {
  return (
    <div className="relative flex flex-col xl:flex-row xl:items-center xl:h-[clamp(460px,calc(100svh-124px),620px)] bg-[#FEFCF8]">
      {/* Illustrations share one box (same size and spot, right edge in line with the navbar);
          scenic photos instead run full height to the right edge and melt into the slide on the left */}
      <div
        className={`order-2 xl:order-none relative flex justify-center h-[230px] sm:h-[300px] xl:justify-end xl:absolute ${
          slide.fit === 'cover'
            ? 'xl:right-0 xl:top-0 xl:h-full xl:w-[52%]'
            : 'xl:h-[88%] xl:aspect-[1.2] xl:top-1/2 xl:-translate-y-1/2 xl:right-[max(2rem,calc((100vw-82.5rem)/2+2rem))]'
        }`}
      >
        <Link
          to={slide.route}
          aria-label={slide.label}
          className={`block ${slide.fit === 'cover' ? 'absolute inset-0' : 'relative h-full max-w-full'}`}
        >
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

      <div className="order-1 xl:order-none relative z-10 max-w-[1320px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 xl:py-0">
        <div className="@container w-full xl:w-[42%] text-center xl:text-left">
          <p className="font-sora text-[11px] sm:text-sm font-semibold tracking-[0.14em] text-[#C58A1B] uppercase leading-relaxed">
            {slide.label}
          </p>
          <h2
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="mt-4 text-[length:clamp(26px,6.8cqw,58px)] font-bold leading-[1.08] tracking-[-0.01em] text-[#0F1F45]"
          >
            <span className="block whitespace-nowrap">{slide.line1}</span>
            <span className="block whitespace-nowrap text-[#C9922E]">{slide.line2}</span>
          </h2>
          <p className="mt-4 max-w-[520px] mx-auto xl:mx-0 text-sm sm:text-[17px] text-[#55607A] font-inter leading-relaxed">
            {slide.body}
          </p>
          <Link
            to={slide.route}
            className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#0F1F45] px-9 py-4 text-sm sm:text-base font-medium text-white shadow-[0_10px_30px_rgba(15,31,69,0.3)] transition-all hover:shadow-[0_15px_40px_rgba(15,31,69,0.45)]"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
