import React, { useEffect } from 'react';
import { ContactHero } from '../components/contact/ContactHero';
import { ContactOptionsGrid } from '../components/contact/ContactOptionsGrid';
import { BookConsultationForm } from '../components/contact/BookConsultationForm';
import { ConsultationJourneyTimeline } from '../components/contact/ConsultationJourneyTimeline';
import { OfficeWorkingHours } from '../components/contact/OfficeWorkingHours';
import { ContactFAQ } from '../components/contact/ContactFAQ';
import { ContactNewsletter } from '../components/contact/ContactNewsletter';

export const ContactPage = ({ onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact & Book Consultation | SOLAHANA — Wealth Planning";
  }, []);

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#0F1F45] selection:bg-[#2F5BC7]/20 selection:text-[#1A3170]">
      {/* 1. Hero Banner */}
      <ContactHero />

      {/* 2. Choose How You'd Like To Connect */}
      <ContactOptionsGrid />

      {/* 3. Book Consultation Form */}
      <BookConsultationForm onNavigateToDashboard={() => onNavigate && onNavigate('dashboard')} />

      {/* 4. What Happens After You Book? */}
      <ConsultationJourneyTimeline />

      {/* 5. Office & Working Hours */}
      <OfficeWorkingHours />

      {/* 6. Frequently Asked Questions */}
      <ContactFAQ />

      {/* 7. Newsletter */}
      <ContactNewsletter />
    </main>
  );
};
