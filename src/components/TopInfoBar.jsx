import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function TopInfoBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 bg-[#020B2D] border-b border-[#C8A24A]/15 overflow-hidden transition-all duration-500 ease-in-out ${
        isScrolled ? 'h-0 opacity-0' : 'h-9 opacity-100'
      }`}
    >
      <div className="max-w-7xl mx-auto h-9 px-4 sm:px-6 lg:px-8 flex items-center justify-between font-inter text-[11px] text-[#BAC6DA] whitespace-nowrap">
        {/* Left: Address + Email */}
        <div className="flex items-center gap-5 sm:gap-6 min-w-0">
          <span className="hidden sm:flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#C8A24A] shrink-0" />
            Andheri West, Mumbai - 400053
          </span>
          <span className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-[#C8A24A] shrink-0" />
            <span className="truncate">info@solahana.com</span>
          </span>
        </div>

        {/* Right: Hours + Social */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <span className="hidden md:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#C8A24A]" />
            Mon - Sat: 10:00am - 7:00pm
          </span>
          <div className="flex items-center gap-3 text-[#C8A24A]">
            <a href="#" aria-label="Facebook" className="hover:text-[#E8C878] transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[#E8C878] transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-[#E8C878] transition-colors">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
