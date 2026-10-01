import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Google 'G' Logo SVG Component
const GoogleGIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function ClientStories() {
  const testimonials = [
    {
      name: 'Rohan Sharma',
      role: 'Senior Software Architect',
      text: 'SOLAHANA brought total clarity to my personal finances. They structured my NPS, tax savings under Section 80C, and step-up SIPs. My early retirement roadmap is now 2 years ahead of plan.',
      rating: 5,
      date: '2 weeks ago',
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Tech Startup Founder',
      text: 'Managing corporate profits while structuring personal wealth was complex. SOLAHANA’s fee-only model gave us complete transparency and tax efficiency without high-commission sales pitches.',
      rating: 5,
      date: '1 month ago',
    },
    {
      name: 'Dr. Rajesh Gupta',
      role: 'Senior Cardiac Surgeon',
      text: 'With a hectic surgical schedule, I had no time to manage investments. SOLAHANA created an automated, inflation-protected passive income strategy for my family’s security.',
      rating: 5,
      date: '3 weeks ago',
    },
    {
      name: 'Priya Nair',
      role: 'Global HR Director',
      text: 'The estate and tax planning guidance was exceptional. They organized our international assets, private trust structures, and goal-based portfolios seamlessly.',
      rating: 5,
      date: '2 months ago',
    },
    {
      name: 'Vikramaditya Mehta',
      role: 'NRI Business Executive',
      text: 'Cross-border wealth management for NRIs is usually complicated, but SOLAHANA made it effortless. Highly professional, responsive, and truly client-first approach.',
      rating: 5,
      date: '1 month ago',
    },
    {
      name: 'Sanjay Kulkarni',
      role: 'Director of Engineering',
      text: 'Clear, unbiased financial planning with zero commission conflicts. Their annual portfolio rebalancing and risk assessment gave my family absolute peace of mind.',
      rating: 5,
      date: '3 weeks ago',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  // Swipe gesture state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Responsive card count tracking
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  // Clamp active index when itemsPerPage changes
  useEffect(() => {
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex);
    }
  }, [itemsPerPage, maxIndex, activeIndex]);

  // Auto-slide every 4.5 seconds (paused on hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, maxIndex]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  return (
    <section className="relative z-10 py-12 sm:py-16 lg:py-20 bg-[#F7F8FB] border-t border-[#2F5BC7]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimal Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-8 sm:mb-12">
          {/* Google Reviews Badge Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-sm text-xs font-semibold text-[#0F1F45]"
          >
            <GoogleGIcon className="w-4 h-4" />
            <span className="font-medium text-[#475569]">Google Reviews</span>
            <span className="text-[#2F5BC7] font-bold">4.9 ★★★★★</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#0F1F45] tracking-tight"
          >
            What Our Clients Say
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#475569] font-inter leading-relaxed line-clamp-1"
          >
            What families and professionals say after working with SOLAHANA.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Viewport & Sliding Track */}
          <div className="overflow-hidden py-2 px-1">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${activeIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-3 flex flex-col"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div className="bg-white rounded-[24px] border border-slate-100 shadow-lg shadow-slate-200/50 p-6 sm:p-7 flex flex-col justify-between h-full hover:shadow-xl transition-all duration-300 relative group border-t-2 hover:border-t-[#2F5BC7]">
                    
                    {/* Card Header: Google Badge & Rating */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GoogleGIcon className="w-5 h-5" />
                          <span className="text-xs font-semibold text-slate-500 tracking-wide">
                            Google Review
                          </span>
                        </div>
                        <Quote className="w-6 h-6 text-[#2F5BC7]/20 group-hover:text-[#2F5BC7]/40 transition-colors" />
                      </div>

                      {/* 5 Gold Stars */}
                      <div className="flex items-center space-x-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#C9A04F] text-[#C9A04F]" />
                        ))}
                      </div>

                      {/* Review Text (3-4 lines) */}
                      <p className="text-sm sm:text-base text-[#0F1F45]/90 font-inter leading-relaxed line-clamp-4 min-h-[96px]">
                        "{item.text}"
                      </p>
                    </div>

                    {/* Reviewer Profile */}
                    <div className="pt-5 mt-5 border-t border-slate-100 flex items-center space-x-3.5">
                      <span
                        aria-hidden="true"
                        className="w-11 h-11 rounded-full bg-[#EEF2FB] text-[#2F5BC7] font-bold text-sm flex items-center justify-center flex-shrink-0"
                      >
                        {item.name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-[#0F1F45] truncate font-serif-luxury">
                          {item.name}
                        </h4>
                        {item.role && (
                          <p className="text-xs text-[#64748B] truncate font-inter">
                            {item.role}
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls & Pagination */}
          <div className="flex items-center justify-between mt-8 max-w-xs mx-auto sm:max-w-none">
            
            {/* Left Arrow Button */}
            <button
              onClick={prevSlide}
              aria-label="Previous review"
              className="p-3 rounded-full bg-white border border-slate-200 text-[#0F1F45] shadow-md hover:bg-[#0F1F45] hover:text-[#2F5BC7] hover:border-[#0F1F45] transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to review slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? 'w-8 bg-[#1A3170]'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            {/* Right Arrow Button */}
            <button
              onClick={nextSlide}
              aria-label="Next review"
              className="p-3 rounded-full bg-white border border-slate-200 text-[#0F1F45] shadow-md hover:bg-[#0F1F45] hover:text-[#2F5BC7] hover:border-[#0F1F45] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

