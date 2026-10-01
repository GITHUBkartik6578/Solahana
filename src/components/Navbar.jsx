import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowRight, 
  User, 
  LogOut,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Calculator,
  FileText,
  Building2,
  Sparkles,
  Award,
  Scroll,
  BarChart3,
  Landmark,
  Rocket,
  Globe
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scrollToConsultation } from '../utils/consultation';
import solahanaLogo from '../assets/solahana-logo.png';

export default function Navbar({ onOpenSearch }) {
  const { user, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const isAdminRoute = pathname.startsWith('/admin');

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  const [mobilePlanningOpen, setMobilePlanningOpen] = useState(false);
  const [mobileInvestOpen, setMobileInvestOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetPath) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setActiveDropdown(null);

    // Booking: go straight to the consultation form (on this page if it's here)
    if (targetPath === 'contact') {
      if (!scrollToConsultation()) navigate('/about#book');
      return;
    }

    const pathMap = {
      'home': '/',
      'about': '/about',
      'who-we-serve': '/who-we-serve',
      'our-process': '/our-process',
      'planning': '/financial-planning',
      'solutions': '/financial-planning',
      'services': '/financial-planning',
      'resources': '/blogs',
      'calculators': '/calculators',
      'investments': '/investments',
      'tax-planning': '/tax-planning',
      'pricing': '/pricing',
      'contact': '/about',
      'dashboard': '/dashboard',
      'admin': '/admin/dashboard',
      'admin-login': '/admin/login',
    };

    const dest = pathMap[targetPath] || targetPath;
    navigate(dest);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnterDropdown = (menuName) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuName);
  };

  const handleMouseLeaveDropdown = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleAdminLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Dropdown Configurations (SOLAHANA Core Planning & Investment Options)
  const dropdownData = {
    planning: [
      { title: 'Financial Planning', path: '/financial-planning', desc: 'Comprehensive 360° financial roadmap', icon: PieChart },
      { title: 'Retirement Planning', path: '/calculators/retirement', desc: 'Inflation-adjusted retirement freedom & SWP', icon: Award },
      { title: 'Investment Planning', path: '/investments', desc: 'Personalised compounding wealth portfolios', icon: TrendingUp },
      { title: 'Tax Planning', path: '/tax-planning', desc: 'Optimize Section 80C, 80D & NPS savings', icon: FileText },
      { title: 'Risk Management', path: '/risk-management', desc: 'Comprehensive health, life & family cover', icon: ShieldCheck },
      { title: 'Estate Planning', path: '/estate-planning', desc: 'Legacy, Will & Private Family Trust succession', icon: Scroll },
    ],
    invest: [
      { title: 'Mutual Funds', path: '/invest/mutual-funds', desc: 'Direct SIP & Lumpsum equity/debt schemes', icon: TrendingUp },
      { title: 'Bonds', path: '/invest/bonds', desc: 'High-yield government & corporate bonds', icon: Landmark },
      { title: 'Domestic Equity', path: '/invest/domestic-equity', desc: 'Curated Indian equity model portfolios', icon: BarChart3 },
      { title: 'International Equity', path: '/invest/international-equity', desc: 'Global stock portfolios & US equity exposure', icon: Globe },
      { title: 'IPO', path: '/invest/ipo', desc: 'Early bidding in high-growth listings', icon: Rocket },
    ],
    resources: [
      { title: 'Financial Calculators', path: '/calculators', desc: 'SIP, Retirement & Tax calculators', icon: Calculator },
      { title: 'Knowledge Center', path: '/blogs', desc: 'Expert financial insights & guides', icon: Sparkles },
    ],
  };


  const isPlanningActive = 
    pathname === '/financial-planning' || 
    pathname === '/investments' || 
    pathname === '/tax-planning' || 
    pathname === '/goals' || 
    pathname.startsWith('/calculators/retirement');

  const isInvestActive = pathname.startsWith('/invest');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div
        className={`h-[80px] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFFFFF]/95 backdrop-blur-xl border-b border-[#2F5BC7]/30 shadow-[0_10px_30px_rgba(26,49,112,0.12)]'
            : 'bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#2F5BC7]/20'
        }`}
      >
        <div className="max-w-[1320px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* ========================================================= */}
          {/* LEFT: SOLAHANA LOGO (FIXED FAR LEFT)                      */}
          {/* ========================================================= */}
          <button 
            onClick={(e) => handleNavClick(e, 'home')} 
            className="flex items-center shrink-0 cursor-pointer group py-1 text-left"
            title="SOLAHANA Home"
            aria-label="SOLAHANA Home"
          >
            <img 
              src={solahanaLogo} 
              alt="SOLAHANA" 
              className="h-[50px] sm:h-[55px] lg:h-[57px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>

          {/* ========================================================= */}
          {/* CENTER-RIGHT: FINTOO-STYLE NAVIGATION LINKS               */}
          {/* ORDER: Planning ▼ | Invest ▼ | Pricing | Resources ▼ | Contact Us | About Us */}
          {/* ========================================================= */}
          {isAdminRoute ? (
            <div className="hidden lg:flex items-center gap-2 px-5 py-2 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-xs font-bold text-[#1A3170] whitespace-nowrap ml-auto mr-4">
              <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
              <span>ADMINISTRATOR GOVERNANCE DESK</span>
            </div>
          ) : (
            <nav className="hidden lg:flex items-center gap-0.5 lg:gap-1 xl:gap-2 font-inter text-xs xl:text-[13px] font-semibold text-[#0F1F45] whitespace-nowrap ml-auto mr-3 xl:mr-5">
              
              {/* 1. Planning (Dropdown with 6 Options) */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnterDropdown('planning')}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <button
                  onClick={(e) => handleNavClick(e, 'planning')}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 relative whitespace-nowrap ${
                    isPlanningActive ? 'text-[#2F5BC7] font-bold' : 'hover:text-[#2F5BC7]'
                  }`}
                >
                  <span className="whitespace-nowrap">Planning</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'planning' ? 'rotate-180 text-[#2F5BC7]' : ''}`} />
                  {isPlanningActive && (
                    <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#1A3170] rounded-full" />
                  )}
                </button>

                {/* Premium Fintech Planning Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === 'planning' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-[#2F5BC7]/30 shadow-xl p-3 z-50 space-y-1"
                    >
                      {dropdownData.planning.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.title}
                            onClick={(e) => handleNavClick(e, item.path)}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-[#F7F8FB] transition-colors flex items-start gap-3 group cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-[#2F5BC7]/10 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors shrink-0">
                              <Icon className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-[#64748B] leading-snug mt-0.5">
                                {item.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. Invest (Clean Compact Dropdown: Icon + Name Only) */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnterDropdown('invest')}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <button
                  onClick={(e) => handleNavClick(e, '/invest/mutual-funds')}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 relative whitespace-nowrap ${
                    isInvestActive ? 'text-[#2F5BC7] font-bold' : 'hover:text-[#2F5BC7]'
                  }`}
                >
                  <span className="whitespace-nowrap">Invest</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'invest' ? 'rotate-180 text-[#2F5BC7]' : ''}`} />
                  {isInvestActive && (
                    <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#1A3170] rounded-full" />
                  )}
                </button>

                {/* Clean Compact SOLAHANA Invest Dropdown */}
                <AnimatePresence>
                  {activeDropdown === 'invest' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-full left-0 mt-2 w-56 sm:w-60 bg-white rounded-2xl border border-[#2F5BC7]/30 shadow-xl p-2 z-50 space-y-1"
                    >
                      {dropdownData.invest.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.title}
                            onClick={(e) => handleNavClick(e, item.path)}
                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F7F8FB] transition-colors flex items-center gap-3 group cursor-pointer"
                          >
                            <div className="p-1.5 rounded-lg bg-[#2F5BC7]/10 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors whitespace-nowrap">
                              {item.title}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Pricing */}
              <button
                onClick={(e) => handleNavClick(e, 'pricing')}
                className={`px-3 py-2 rounded-lg transition-all relative whitespace-nowrap ${
                  pathname === '/pricing' ? 'text-[#2F5BC7] font-bold' : 'hover:text-[#2F5BC7]'
                }`}
              >
                <span className="whitespace-nowrap">Pricing</span>
                {pathname === '/pricing' && (
                  <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#1A3170] rounded-full" />
                )}
              </button>

              {/* 4. Resources (With Dropdown) */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnterDropdown('resources')}
                onMouseLeave={handleMouseLeaveDropdown}
              >
                <button
                  onClick={(e) => handleNavClick(e, 'resources')}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1 relative whitespace-nowrap ${
                    pathname.startsWith('/blogs') || pathname.startsWith('/calculators')
                      ? 'text-[#2F5BC7]'
                      : 'hover:text-[#2F5BC7]'
                  }`}
                >
                  <span className="whitespace-nowrap">Resources</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-[#2F5BC7]' : ''}`} />
                  {(pathname.startsWith('/blogs') || pathname.startsWith('/calculators')) && (
                    <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#1A3170] rounded-full" />
                  )}
                </button>

                <AnimatePresence>
                  {activeDropdown === 'resources' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-[#2F5BC7]/30 shadow-xl p-3 z-50 space-y-1"
                    >
                      {dropdownData.resources.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.title}
                            onClick={(e) => handleNavClick(e, item.path)}
                            className="w-full text-left p-2.5 rounded-xl hover:bg-[#F7F8FB] transition-colors flex items-start gap-3 group cursor-pointer"
                          >
                            <div className="p-2 rounded-lg bg-[#2F5BC7]/10 text-[#2F5BC7] group-hover:bg-[#1A3170] group-hover:text-white transition-colors shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">{item.title}</div>
                              <div className="text-[11px] text-[#64748B] leading-snug">{item.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Who We Serve / Our Process */}
              <button
                onClick={(e) => handleNavClick(e, 'who-we-serve')}
                className={`px-3 py-2 rounded-lg transition-all relative whitespace-nowrap ${
                  pathname === '/who-we-serve' ? 'text-[#2F5BC7] font-bold' : 'hover:text-[#2F5BC7]'
                }`}
              >
                <span className="whitespace-nowrap">Who We Serve</span>
                {pathname === '/who-we-serve' && (
                  <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#1A3170] rounded-full" />
                )}
              </button>

              <button
                onClick={(e) => handleNavClick(e, 'our-process')}
                className={`px-3 py-2 rounded-lg transition-all relative whitespace-nowrap ${
                  pathname === '/our-process' ? 'text-[#2F5BC7] font-bold' : 'hover:text-[#2F5BC7]'
                }`}
              >
                <span className="whitespace-nowrap">Our Process</span>
                {pathname === '/our-process' && (
                  <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#1A3170] rounded-full" />
                )}
              </button>

              {/* 5. About Us */}
              <button
                onClick={(e) => handleNavClick(e, 'about')}
                className={`px-3 py-2 rounded-lg transition-all relative whitespace-nowrap ${
                  pathname === '/about' ? 'text-[#2F5BC7] font-bold' : 'hover:text-[#2F5BC7]'
                }`}
              >
                <span className="whitespace-nowrap">About Us</span>
                {pathname === '/about' && (
                  <motion.div layoutId="activeUnderline" className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#1A3170] rounded-full" />
                )}
              </button>

            </nav>
          )}

          {/* ========================================================= */}
          {/* RIGHT: SEARCH, PROFILE & GOLD CTA BUTTON (SPACED FIX)     */}
          {/* ========================================================= */}
          <div className="hidden lg:flex items-center gap-2.5 lg:gap-3 shrink-0 whitespace-nowrap">
            {isAdminRoute ? (
              <div className="flex items-center gap-3 whitespace-nowrap">
                {user && (
                  <span className="text-xs font-semibold text-[#1A3170] px-3 py-1.5 rounded-xl bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 whitespace-nowrap">
                    {user.name} (Admin)
                  </span>
                )}
                {user ? (
                  <button
                    onClick={handleAdminLogout}
                    className="px-3.5 py-1.5 text-xs text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl border border-red-200 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold whitespace-nowrap"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/admin/login')}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#0F1F45] hover:bg-[#1A3170] rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    Admin Login
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Search Icon Button */}
                <button
                  onClick={onOpenSearch}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#2F5BC7]/30 hover:border-[#2F5BC7] text-[#0F1F45] hover:text-[#2F5BC7] shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105 shrink-0"
                  title="Search financial goals, tools & blogs"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Profile / Login Icon Button */}
                {user ? (
                  <button
                    onClick={(e) => handleNavClick(e, 'dashboard')}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#2F5BC7]/30 hover:border-[#2F5BC7] text-[#0F1F45] hover:text-[#2F5BC7] shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105 shrink-0"
                    title={`My Dashboard (${user.name})`}
                    aria-label="User Profile"
                  >
                    <User className="w-4 h-4 text-[#2F5BC7]" />
                  </button>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#2F5BC7]/30 hover:border-[#2F5BC7] text-[#0F1F45] hover:text-[#2F5BC7] shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-105 shrink-0"
                    title="Login / Register"
                    aria-label="Login"
                  >
                    <User className="w-4 h-4" />
                  </button>
                )}

                {/* Primary Gold CTA Button (Pinned far right with 20-24px breathing space from profile icon) */}
                <button
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="gold-glow-button ml-5 lg:ml-5.5 xl:ml-6 px-4.5 lg:px-5 py-2.5 rounded-full text-xs font-bold text-white tracking-wide flex items-center space-x-2 group cursor-pointer shadow-md whitespace-nowrap shrink-0 hover:scale-[1.02] transition-transform"
                >
                  <span className="whitespace-nowrap">Book a Free Call</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </>
            )}
          </div>


          {/* Mobile Hamburger Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            {!isAdminRoute && (
              <button
                onClick={onOpenSearch}
                className="w-9 h-9 rounded-full bg-white border border-[#2F5BC7]/30 text-[#2F5BC7] flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-white border border-[#2F5BC7]/30 text-[#0F1F45] flex items-center justify-center shadow-sm"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#2F5BC7]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Out Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0F1F45]/40 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Slide-out White Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl border-l border-[#2F5BC7]/30 z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden"
            >
              <div className="space-y-6">
                {/* Mobile Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#2F5BC7]/20">
                  <img src={solahanaLogo} alt="SOLAHANA" className="h-12 w-auto object-contain" />
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 text-[#0F1F45]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-1 font-inter text-sm font-semibold text-[#0F1F45]">
                  
                  {/* 1. Planning Expandable Mobile Submenu */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobilePlanningOpen(!mobilePlanningOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F7F8FB] hover:text-[#2F5BC7] transition-colors text-left"
                    >
                      <span>Planning</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobilePlanningOpen ? 'rotate-180 text-[#2F5BC7]' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {mobilePlanningOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-1 overflow-hidden"
                        >
                          {dropdownData.planning.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.title}
                                onClick={(e) => handleNavClick(e, item.path)}
                                className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#F7F8FB] text-xs font-semibold text-[#475569] hover:text-[#2F5BC7] flex items-center gap-2.5 transition-colors"
                              >
                                <Icon className="w-3.5 h-3.5 text-[#2F5BC7]" />
                                <span>{item.title}</span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 2. Invest Expandable Mobile Submenu */}
                  <div className="space-y-1">
                    <button
                      onClick={() => setMobileInvestOpen(!mobileInvestOpen)}
                      className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F7F8FB] hover:text-[#2F5BC7] transition-colors text-left"
                    >
                      <span>Invest</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileInvestOpen ? 'rotate-180 text-[#2F5BC7]' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {mobileInvestOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 space-y-1 overflow-hidden"
                        >
                          {dropdownData.invest.map((item) => {
                            const Icon = item.icon;
                            return (
                              <button
                                key={item.title}
                                onClick={(e) => handleNavClick(e, item.path)}
                                className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#F7F8FB] text-xs font-semibold text-[#475569] hover:text-[#2F5BC7] flex items-center gap-2.5 transition-colors"
                              >
                                <Icon className="w-3.5 h-3.5 text-[#2F5BC7]" />
                                <span>{item.title}</span>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    onClick={(e) => handleNavClick(e, 'pricing')}
                    className="text-left py-2.5 px-3 rounded-xl hover:bg-[#F7F8FB] hover:text-[#2F5BC7] transition-colors"
                  >
                    Pricing
                  </button>

                  <button
                    onClick={(e) => handleNavClick(e, 'resources')}
                    className="text-left py-2.5 px-3 rounded-xl hover:bg-[#F7F8FB] hover:text-[#2F5BC7] transition-colors"
                  >
                    Resources & Calculators
                  </button>

                  <button
                    onClick={(e) => handleNavClick(e, 'who-we-serve')}
                    className="text-left py-2.5 px-3 rounded-xl hover:bg-[#F7F8FB] hover:text-[#2F5BC7] transition-colors"
                  >
                    Who We Serve
                  </button>

                  <button
                    onClick={(e) => handleNavClick(e, 'our-process')}
                    className="text-left py-2.5 px-3 rounded-xl hover:bg-[#F7F8FB] hover:text-[#2F5BC7] transition-colors"
                  >
                    Our Process
                  </button>

                  <button
                    onClick={(e) => handleNavClick(e, 'about')}
                    className="text-left py-2.5 px-3 rounded-xl hover:bg-[#F7F8FB] hover:text-[#2F5BC7] transition-colors"
                  >
                    About Us
                  </button>
                </div>
              </div>

              {/* Mobile Drawer Bottom Actions */}
              <div className="pt-6 border-t border-[#2F5BC7]/20 space-y-3">
                {user ? (
                  <button
                    onClick={(e) => handleNavClick(e, 'dashboard')}
                    className="w-full py-2.5 rounded-full border border-[#2F5BC7] text-xs font-bold text-[#0F1F45] bg-white flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#2F5BC7]" />
                    <span>My Dashboard ({user.name.split(' ')[0]})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 rounded-full border border-[#2F5BC7]/40 text-xs font-bold text-[#0F1F45] bg-white flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#2F5BC7]" />
                    <span>Login / Register</span>
                  </button>
                )}

                <button
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="w-full gold-glow-button text-center py-3 rounded-full text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <span>Book a Free Call</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

