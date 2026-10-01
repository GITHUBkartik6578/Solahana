import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BackgroundEffects from './components/BackgroundEffects';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import WhatIsFinancialPlanning from './components/WhatIsFinancialPlanning';
import SolahanaServices from './components/SolahanaServices';
import ClientStories from './components/ClientStories';
import FAQSection from './components/FAQSection';
import FinalCTA from './components/FinalCTA';
import GlobalConsultationSection from './components/common/GlobalConsultationSection';
import SolahanaChat from './components/chat/SolahanaChat';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import AboutPage from './pages/AboutPage';
import FinancialPlanningPage from './pages/FinancialPlanningPage';
import GoalsPlanningPage from './pages/GoalsPlanningPage';
import InvestmentsPage from './pages/InvestmentsPage';
import TaxPlanningPage from './pages/TaxPlanningPage';
import RiskManagementPage from './pages/RiskManagementPage';
import EstatePlanningPage from './pages/EstatePlanningPage';
import PricingPage from './pages/PricingPage';
import WhoWeServePage from './pages/WhoWeServePage';
import OurProcessPage from './pages/OurProcessPage';
import { CalculatorsPage } from './pages/CalculatorsPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import ScrollToTopAndSEO from './components/ScrollToTopAndSEO';

// Calculators Module Imports
import CalculatorsLandingPage from './pages/calculators/CalculatorsLandingPage';
import SipCalculator from './components/calculators/SipCalculator';
import EmiCalculator from './components/calculators/EmiCalculator';
import RetirementCalculator from './components/calculators/RetirementCalculator';
import GoalPlanner from './components/calculators/GoalPlanner';
import LumpsumCalculator from './components/calculators/LumpsumCalculator';
import FdCalculator from './components/calculators/FdCalculator';
import InflationCalculator from './components/calculators/InflationCalculator';
import SavedCalculationsPage from './pages/calculators/SavedCalculationsPage';

// Blog Module Imports
import BlogsLandingPage from './pages/blogs/BlogsLandingPage';
import BlogDetailsPage from './pages/blogs/BlogDetailsPage';

// Invest Module Imports
import InvestDetailPage from './pages/invest/InvestDetailPage';
import MutualFundsPage from './pages/invest/MutualFundsPage';
import BondsPage from './pages/invest/BondsPage';
import DomesticEquityPage from './pages/invest/DomesticEquityPage';
import InternationalEquityPage from './pages/invest/InternationalEquityPage';
import IpoPage from './pages/invest/IpoPage';

import StagePlanningSection from './components/StagePlanningSection';



function HomePage({ onOpenSearch }) {
  return (
    <>
      {/* Full First Screen Hero Section */}
      <Hero onOpenSearch={onOpenSearch} />
      <TrustStrip />
      <WhatIsFinancialPlanning />
      <StagePlanningSection onOpenSearch={onOpenSearch} />
      <SolahanaServices />
      <ClientStories />
      <FAQSection />
    </>
  );
}

function AppContent() {

  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const showGlobalConsultation = 
    !pathname.startsWith('/admin') && 
    !pathname.startsWith('/dashboard') && 
    pathname !== '/login';

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#0F1F45] selection:bg-[#2F5BC7]/20 selection:text-[#1A3170]">
      {/* Background Visual Layer */}
      <BackgroundEffects />

      {/* Sticky Navbar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      {/* Main Content Area */}
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage onOpenSearch={() => setSearchOpen(true)} />} />
          <Route path="/about" element={<AboutPage onOpenSearch={() => setSearchOpen(true)} />} />
          <Route path="/who-we-serve" element={<WhoWeServePage />} />
          <Route path="/our-process" element={<OurProcessPage />} />
          <Route path="/financial-planning" element={<FinancialPlanningPage onOpenSearch={() => setSearchOpen(true)} />} />
          <Route path="/goals" element={<GoalsPlanningPage onOpenSearch={() => setSearchOpen(true)} />} />
          <Route path="/investments" element={<InvestmentsPage onOpenSearch={() => setSearchOpen(true)} />} />

          {/* Invest Module Routes */}
          <Route path="/invest/mutual-funds" element={<MutualFundsPage />} />
          <Route path="/invest/bonds" element={<BondsPage />} />
          <Route path="/invest/domestic-equity" element={<DomesticEquityPage />} />
          <Route path="/invest/international-equity" element={<InternationalEquityPage />} />
          <Route path="/invest/ipo" element={<IpoPage />} />
          <Route path="/invest/:category" element={<InvestDetailPage />} />


          <Route path="/tax-planning" element={<TaxPlanningPage onOpenSearch={() => setSearchOpen(true)} />} />
          <Route path="/risk-management" element={<RiskManagementPage onOpenSearch={() => setSearchOpen(true)} />} />
          <Route path="/estate-planning" element={<EstatePlanningPage onOpenSearch={() => setSearchOpen(true)} />} />

          <Route path="/pricing" element={<PricingPage onOpenSearch={() => setSearchOpen(true)} />} />
          {/* Financial Calculators Suite Routes */}
          <Route path="/calculators" element={<CalculatorsLandingPage />} />
          <Route path="/calculators/sip" element={<SipCalculator />} />
          <Route path="/calculators/emi" element={<EmiCalculator />} />
          <Route path="/calculators/retirement" element={<RetirementCalculator />} />
          <Route path="/calculators/goal-planner" element={<GoalPlanner />} />
          <Route path="/calculators/lumpsum" element={<LumpsumCalculator />} />
          <Route path="/calculators/fd" element={<FdCalculator />} />
          <Route path="/calculators/inflation" element={<InflationCalculator />} />

          {/* Financial Blog CMS Routes */}
          <Route path="/blogs" element={<BlogsLandingPage />} />
          <Route path="/blogs/:slug" element={<BlogDetailsPage />} />

          <Route path="/contact" element={<Navigate to="/about#book" replace />} />

          {/* User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/calculations"
            element={
              <ProtectedRoute>
                <SavedCalculationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-calculations"
            element={
              <ProtectedRoute>
                <SavedCalculationsPage />
              </ProtectedRoute>
            }
          />

          {/* Dedicated User Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dedicated Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/consultations"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/blogs"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/newsletters"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/newsletter"
            element={
              <AdminProtectedRoute>
                <AdminDashboardPage />
              </AdminProtectedRoute>
            }
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Consultation Booking Section before Footer */}
        {showGlobalConsultation && <GlobalConsultationSection />}
        {showGlobalConsultation && <SolahanaChat />}

        {/* Shared Footer across pages */}
        <Footer />
      </main>

      {/* Global Quick Command & Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Global Auth Modal for Login & Register */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTopAndSEO />
      <AppContent />
    </AuthProvider>
  );
}

