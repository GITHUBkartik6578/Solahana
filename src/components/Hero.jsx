import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Star, 
  Coins, 
  Umbrella, 
  HeartHandshake, 
  FileText, 
  Building2, 
  Heart, 
  GraduationCap,
  Calculator,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  PieChart,
  Shield,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import HeroFintechIllustration from './illustrations/HeroFintechIllustration';
import PlanningMascotIllustration from './illustrations/PlanningMascotIllustration';
import WealthCreationMascotIllustration from './illustrations/WealthCreationMascotIllustration';
import RetirementMascotIllustration from './illustrations/RetirementMascotIllustration';
import GoalsMascotIllustration from './illustrations/GoalsMascotIllustration';
import TaxMascotIllustration from './illustrations/TaxMascotIllustration';
import InsuranceMascotIllustration from './illustrations/InsuranceMascotIllustration';

// Time each slide stays on screen before auto-advancing
const AUTOPLAY_INTERVAL_MS = 3500;

export default function Hero({ onOpenSearch }) {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(() => document.hidden);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Client-Approved Premium Storytelling Slides
  const heroSlides = [
    {
      id: 'slide-1',
      badge: 'WELCOME TO SOLAHANA',
      titleLine1: 'Your Money Deserves a Plan.',
      titleLine2: 'Not Just an Investment.',
      scriptText: 'Every Goal, One Plan.',
      subtitle: 'From marriage to retirement, education to wealth creation — one personalised plan for every goal.',
      ctaText: 'Start Your Comprehensive Plan',
      ctaRoute: '/contact',
      emotion: 'Hope. Ambition. Future.'
    },
    {
      id: 'slide-2',
      badge: 'FINANCIAL PLANNING',
      titleLine1: 'Five Apps. Three Policies.',
      titleLine2: 'Still No Plan.',
      scriptText: 'Let’s Fix That.',
      subtitle: 'Most people own products, not a plan. We bring your income, savings, loans, cover and goals into one roadmap.',
      ctaText: 'Build My Plan',
      ctaRoute: '/financial-planning',
      emotion: 'Clarity. Control.'
    },
    {
      id: 'slide-3',
      badge: 'WEALTH CREATION',
      titleLine1: "Your Salary Isn't the Problem.",
      titleLine2: 'Where It Goes Is.',
      scriptText: 'Let Every Rupee Work.',
      subtitle: "Rent, EMIs, UPI spends — by the 25th, nothing's left. We turn your salary into a SIP plan that quietly compounds.",
      ctaText: 'Make My Money Work',
      ctaRoute: '/investments',
      emotion: 'Growth. Confidence.'
    },
    {
      id: 'slide-4',
      badge: 'RETIREMENT PLANNING',
      titleLine1: 'Your Salary Stops One Day.',
      titleLine2: "Your Bills Don't.",
      scriptText: 'Retire On Your Terms.',
      subtitle: 'Medicines, bills, family — life keeps costing after 60. We plan a corpus that pays you every month.',
      ctaText: 'Plan My Retirement',
      ctaRoute: '/calculators/retirement',
      emotion: 'Peace. Freedom.'
    },
    {
      id: 'slide-5',
      badge: 'FINANCIAL GOALS',
      titleLine1: 'Wedding. College.',
      titleLine2: 'Your Own Home.',
      scriptText: 'One Plan For All of It.',
      subtitle: 'Big goals arrive together and all need money at once. We give each one its own fund and timeline.',
      ctaText: 'Plan My Family Goals',
      ctaRoute: '/goals',
      emotion: 'Security. Family. Future.'
    },
    {
      id: 'slide-6',
      badge: 'TAX PLANNING',
      titleLine1: 'No More March',
      titleLine2: 'Tax-Saving Panic.',
      scriptText: 'Plan It in April.',
      subtitle: 'Last-minute 80C buys often lock you into the wrong product. We plan your tax savings around your goals.',
      ctaText: 'Plan My Tax Savings',
      ctaRoute: '/tax-planning',
      emotion: 'Confidence. Savings.'
    },
    {
      id: 'slide-7',
      badge: 'FINANCIAL SECURITY',
      titleLine1: 'One Hospital Bill',
      titleLine2: 'Can Wipe Out Years of Savings.',
      scriptText: "Protect What You've Built.",
      subtitle: 'Most families find out their cover is too small at the hospital counter. We fix that before it happens.',
      ctaText: 'Check My Protection',
      ctaRoute: '/contact',
      emotion: 'Protection. Trust.'
    }
  ];

  // Pause while a mouse/pen is over the hero, a finger is on it, or the tab is hidden
  const isPaused = isHovered || isTouching || isTabHidden;

  useEffect(() => {
    const onVisibilityChange = () => setIsTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // Autoplay: one-shot timer per slide. Depending on activeSlide means any slide
  // change (auto, arrows, dots, swipe) restarts the full interval, and the cleanup
  // clears the timer on unmount / pause / slide change so nothing leaks.
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [activeSlide, isPaused, heroSlides.length]);

  // Hover applies to mouse/pen only. Touch devices emit emulated mouse events after a
  // tap, which used to leave "hovered" stuck on and stop autoplay on phones.
  const handlePointerEnter = (e) => {
    if (e.pointerType !== 'touch') setIsHovered(true);
  };
  const handlePointerLeave = (e) => {
    if (e.pointerType !== 'touch') setIsHovered(false);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setIsTouching(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Swiped Left -> Next Slide
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    } else if (distance < -50) {
      // Swiped Right -> Previous Slide
      setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const currentSlide = heroSlides[activeSlide];

  // 7 Orbital Nodes (Estate Planning Removed Completely to Eliminate Figure Overlap)
  // Perfectly Symmetrical Circular Placement with Zero Collision
  const orbitalNodes = [
    { title: 'Wealth Creation', icon: Coins, x: 0, y: -215 },
    { title: 'Retirement', icon: Umbrella, x: 170, y: -130 },
    { title: 'Tax Planning', icon: FileText, x: 215, y: 20 },
    { title: 'Health Insurance', icon: Heart, x: 150, y: 150 },
    { title: 'Property', icon: Building2, x: -150, y: 150 },
    { title: 'Marriage', icon: HeartHandshake, x: -215, y: 20 },
    { title: 'Education', icon: GraduationCap, x: -170, y: -130 },
  ];  return (
    <section 
      className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] pt-24 sm:pt-24 lg:pt-20 pb-6 sm:pb-8 lg:pb-10 bg-white overflow-hidden flex flex-col justify-between select-none"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      
      {/* ------------------------------------------------------------- */}
      {/* BACKGROUND: one soft blue wash, nothing else (clean) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F6FB] via-white to-white" />
        <div className="absolute -top-40 right-[-10%] w-[720px] h-[720px] rounded-full bg-[#1A3170]/[0.06] blur-[120px]" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CAROUSEL SLIDE CONTAINER (Stacked Vertically on Mobile)  */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: TYPOGRAPHY & STORYTELLING COPY               */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[42%] text-left space-y-3 sm:space-y-4 shrink-0">
            {/* Left Column Text Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, y: 15, x: -10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -15, x: 10 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="space-y-2.5 sm:space-y-3"
              >
                {/* Eyebrow Category Label */}
                <div className="inline-flex items-center space-x-2">
                  <span className="text-[11px] sm:text-xs font-sora font-semibold tracking-widest text-[#64748B] uppercase">
                    {currentSlide.badge}
                  </span>
                </div>

                {/* Editorial Luxury Headline with Increased Whitespace */}
                <h1 className="text-3xl sm:text-[44px] lg:text-[52px] font-serif-luxury font-bold text-[#0F1F45] leading-[1.12] tracking-tight my-2 sm:my-3">
                  {currentSlide.titleLine1} <br />
                  <span>{currentSlide.titleLine2}</span> <br />
                  <span className="font-alex-brush text-[28px] sm:text-[36px] lg:text-[42px] text-[#2F5BC7] font-bold block mt-2 sm:mt-3">
                    {currentSlide.scriptText}
                  </span>
                </h1>

                {/* Description (Restricted to max 2 lines for clean minimal look) */}
                <p className="text-xs sm:text-base lg:text-lg text-[#475569] leading-relaxed max-w-xl font-inter font-normal line-clamp-2">
                  {currentSlide.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Primary Action Button (Single Gold CTA Button) */}
            <div className="pt-2 sm:pt-3">
              <Link
                to={currentSlide.ctaRoute}
                className="gold-glow-button px-7 sm:px-9 py-3.5 sm:py-4 rounded-full text-xs sm:text-sm font-bold text-white tracking-wide inline-flex items-center justify-center space-x-2.5 sm:space-x-3 group shadow-[0_10px_30px_rgba(26,49,112,0.35)] cursor-pointer hover:shadow-[0_15px_40px_rgba(26,49,112,0.5)] transition-all"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>

            {/* Compact Trust Strip Indicator */}
            <div className="pt-3 sm:pt-4 border-t border-[#2F5BC7]/20 flex items-center flex-wrap sm:flex-nowrap gap-x-3 gap-y-2 sm:gap-4 text-[11px] sm:text-xs text-[#0F1F45] font-inter whitespace-nowrap scrollbar-none">
              <div className="flex items-center space-x-1.5 sm:space-x-2 group cursor-pointer transition-transform hover:scale-105 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2F5BC7] shrink-0" />
                <span className="font-semibold">Trusted <span className="text-[#64748B] font-normal">by Thousands</span></span>
              </div>
              <span className="text-[#2F5BC7]/40 shrink-0">|</span>
              <div className="flex items-center space-x-1.5 sm:space-x-2 group cursor-pointer transition-transform hover:scale-105 shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2F5BC7] shrink-0" />
                <span className="font-semibold">Transparent <span className="text-[#64748B] font-normal">Process</span></span>
              </div>
              <span className="text-[#2F5BC7]/40 shrink-0">|</span>
              <div className="flex items-center space-x-1.5 sm:space-x-2 group cursor-pointer transition-transform hover:scale-105 shrink-0">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C9A04F] shrink-0" />
                <span className="font-semibold">Personalised <span className="text-[#64748B] font-normal">For You</span></span>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: ILLUSTRATION FOCUS                           */}
          {/* ========================================================= */}
          <div className="w-full lg:w-[58%] relative flex items-center justify-center min-h-[350px] sm:min-h-[460px] lg:min-h-[620px] -mt-2 sm:mt-0 lg:mt-0">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 0.97, x: 15 }}
                animate={{ opacity: 1, scale: 1.0, x: 0 }}
                exit={{ opacity: 0, scale: 0.97, x: -15 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="w-full max-w-[390px] sm:max-w-[480px] lg:max-w-[620px] aspect-square relative flex items-center justify-center overflow-visible"
              >
                {activeSlide === 0 && <HeroFintechIllustration onOpenSearch={onOpenSearch} />}
                {activeSlide === 1 && <PlanningMascotIllustration />}
                {activeSlide === 2 && <WealthCreationMascotIllustration />}
                {activeSlide === 3 && <RetirementMascotIllustration />}
                {activeSlide === 4 && <GoalsMascotIllustration />}
                {activeSlide === 5 && <TaxMascotIllustration />}
                {activeSlide === 6 && <InsuranceMascotIllustration />}
              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* HERO FOOTER TICKER BANNER                                 */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 pt-2 pb-6 sm:pb-2">
        <div className="border-t border-[#2F5BC7]/20 pt-3 sm:pt-4 flex items-center justify-between text-[11px] sm:text-xs font-inter text-[#64748B]">
          
          {/* Ticker Banner & Emotion Label */}
          <div className="flex items-center space-x-2 sm:space-x-3 font-sora font-semibold tracking-widest text-[#0F1F45] uppercase">
            <span>PLAN TODAY</span>
            <span className="text-[#2F5BC7]">|</span>
            <span>SECURE TOMORROW</span>
            <span className="text-[#2F5BC7] hidden md:inline">•</span>
            <span className="text-[#2F5BC7] font-serif-luxury lowercase tracking-normal text-sm hidden md:inline">
              {currentSlide.emotion}
            </span>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* CENTERED BOTTOM CAROUSEL NAVIGATION INDICATOR (MOBILE FIX) */}
      {/* ========================================================= */}
      <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 sm:space-x-2.5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#2F5BC7]/30 shadow-md">
        {heroSlides.map((slide, idx) => (
          <button
            key={`single-dot-${slide.id}`}
            onClick={() => setActiveSlide(idx)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
              activeSlide === idx
                ? 'bg-[#1A3170] w-5 sm:w-7 shadow-[0_0_10px_rgba(26,49,112,0.5)]'
                : 'bg-[#2F5BC7]/30 hover:bg-[#2F5BC7]/70 w-2 sm:w-2.5'
            }`}
            title={`Slide ${idx + 1}: ${slide.badge}`}
          />
        ))}
      </div>

    </section>
  );
}

