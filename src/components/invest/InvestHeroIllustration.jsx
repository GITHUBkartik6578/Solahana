import React from 'react';

export default function InvestHeroIllustration({ type = 'mutual-funds' }) {
  switch (type) {
    case 'domestic-equity':
      return (
        <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-2xl select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background Glow */}
          <circle cx="250" cy="200" r="180" fill="url(#stockGlow)" opacity="0.4" />
          {/* Chart Board */}
          <rect x="60" y="60" width="380" height="260" rx="24" fill="#0F1F45" stroke="#2F5BC7" strokeWidth="2.5" />
          {/* Grid lines */}
          <line x1="100" y1="120" x2="400" y2="120" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="100" y1="180" x2="400" y2="180" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="100" y1="240" x2="400" y2="240" stroke="#1E293B" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Stock Growth Trend Line */}
          <path d="M100 250 L160 210 L220 230 L300 130 L350 150 L400 90" stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Glowing Stock Nodes */}
          <circle cx="160" cy="210" r="6" fill="#2F5BC7" />
          <circle cx="220" cy="230" r="6" fill="#2F5BC7" />
          <circle cx="300" cy="130" r="6" fill="#2F5BC7" />
          <circle cx="400" cy="90" r="9" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
          {/* Indian Investor Miniature Character */}
          <g transform="translate(180, 210)">
            <path d="M40 100 C40 70, 100 70, 100 100 L100 130 L40 130 Z" fill="#1E293B" />
            <path d="M55 75 L70 100 L85 75" stroke="#2F5BC7" strokeWidth="3" fill="none" />
            <circle cx="70" cy="50" r="22" fill="#D97706" />
            <path d="M48 45 C48 25, 92 25, 92 45 C85 30, 55 30, 48 45" fill="#0F1F45" />
            <rect x="58" y="44" width="10" height="8" rx="2" stroke="#2F5BC7" strokeWidth="1.5" fill="none" />
            <rect x="72" y="44" width="10" height="8" rx="2" stroke="#2F5BC7" strokeWidth="1.5" fill="none" />
            <line x1="68" y1="48" x2="72" y2="48" stroke="#2F5BC7" strokeWidth="1.5" />
          </g>
          {/* Floating Bullish Pill */}
          <rect x="280" y="70" width="130" height="36" rx="18" fill="#10B981" />
          <text x="345" y="93" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">DOMESTIC +2.4% ↑</text>
          
          <defs>
            <radialGradient id="stockGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(250 200) scale(180)">
              <stop stopColor="#2F5BC7" />
              <stop offset="1" stopColor="#2F5BC7" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="goldGrad" x1="100" y1="250" x2="400" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1A3170" />
              <stop offset="0.5" stopColor="#2F5BC7" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'international-equity':
      return (
        <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-2xl select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="200" r="170" fill="#3B82F6" opacity="0.12" />
          {/* Global Globe Grid */}
          <circle cx="250" cy="200" r="130" fill="#0F1F45" stroke="#2F5BC7" strokeWidth="3" />
          <ellipse cx="250" cy="200" rx="130" ry="50" fill="none" stroke="#1E293B" strokeWidth="2" />
          <ellipse cx="250" cy="200" rx="50" ry="130" fill="none" stroke="#1E293B" strokeWidth="2" />
          <line x1="120" y1="200" x2="380" y2="200" stroke="#1E293B" strokeWidth="2" />
          <line x1="250" y1="70" x2="250" y2="330" stroke="#1E293B" strokeWidth="2" />
          
          {/* US Tech Stock Pins */}
          <circle cx="200" cy="160" r="18" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
          <text x="200" y="164" fill="#0F1F45" fontSize="10" fontWeight="bold" textAnchor="middle">AAPL</text>

          <circle cx="300" cy="150" r="18" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
          <text x="300" y="154" fill="#0F1F45" fontSize="10" fontWeight="bold" textAnchor="middle">MSFT</text>

          <circle cx="270" cy="240" r="18" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          <text x="270" y="244" fill="#0F1F45" fontSize="10" fontWeight="bold" textAnchor="middle">NVDA</text>

          {/* USD Currency Hedge Pill */}
          <rect x="130" y="40" width="240" height="42" rx="21" fill="#2F5BC7" />
          <text x="250" y="66" fill="#0F1F45" fontSize="12" fontWeight="bold" textAnchor="middle">USD CURRENCY HEDGE 🌐</text>
        </svg>
      );

    case 'bonds':
      return (
        <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-2xl select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="200" r="170" fill="#2F5BC7" opacity="0.1" />
          {/* Bond Certificate Card */}
          <rect x="70" y="70" width="360" height="240" rx="20" fill="#FFFFFF" stroke="#2F5BC7" strokeWidth="3" />
          <rect x="85" y="85" width="330" height="210" rx="14" fill="#F7F8FB" stroke="#E4E8F0" strokeWidth="1.5" strokeDasharray="6 4" />
          {/* Certificate Stamp */}
          <circle cx="360" cy="140" r="35" fill="#2F5BC7" opacity="0.15" />
          <circle cx="360" cy="140" r="28" fill="none" stroke="#2F5BC7" strokeWidth="2" strokeDasharray="3 3" />
          <text x="360" y="145" fill="#1A3170" fontSize="11" fontWeight="bold" textAnchor="middle">AAA RATED</text>
          {/* Bond Text lines */}
          <rect x="110" y="110" width="160" height="14" rx="4" fill="#0F1F45" />
          <rect x="110" y="138" width="200" height="8" rx="2" fill="#94A3B8" />
          <rect x="110" y="154" width="140" height="8" rx="2" fill="#94A3B8" />
          {/* Coupon Rate Badge */}
          <rect x="110" y="190" width="180" height="60" rx="14" fill="#0F1F45" />
          <text x="130" y="215" fill="#94A3B8" fontSize="10">Guaranteed Coupon</text>
          <text x="130" y="238" fill="#F59E0B" fontSize="20" fontWeight="bold">11.50% p.a.</text>
        </svg>
      );

    case 'ipo':
      return (
        <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-2xl select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="200" r="170" fill="#3B82F6" opacity="0.1" />
          {/* Rocket Ship */}
          <path d="M250 80 C290 140, 290 220, 250 270 C210 220, 210 140, 250 80 Z" fill="#0F1F45" stroke="#2F5BC7" strokeWidth="3" />
          <circle cx="250" cy="160" r="22" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="3" />
          {/* Rocket Thrust Flames */}
          <path d="M230 270 L250 330 L270 270 Z" fill="#F59E0B" />
          <path d="M240 270 L250 310 L260 270 Z" fill="#EF4444" />
          {/* Floating IPO Bidding Badges */}
          <rect x="70" y="140" width="120" height="44" rx="12" fill="#FFFFFF" stroke="#E4E8F0" strokeWidth="2" />
          <text x="130" y="166" fill="#0F1F45" fontSize="11" fontWeight="bold" textAnchor="middle">100% UPI Apply</text>
          <rect x="310" y="180" width="130" height="44" rx="12" fill="#10B981" />
          <text x="375" y="206" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">LISTING GAIN ↑</text>
        </svg>
      );

    // Default: Mutual Funds
    default:
      return (
        <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-2xl select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="250" cy="200" r="180" fill="#2F5BC7" opacity="0.12" />
          {/* Main Portfolio Sphere */}
          <rect x="80" y="80" width="340" height="240" rx="24" fill="#0F1F45" stroke="#2F5BC7" strokeWidth="2.5" />
          {/* Bars */}
          <rect x="120" y="220" width="40" height="60" rx="8" fill="#3B82F6" />
          <rect x="180" y="180" width="40" height="100" rx="8" fill="#10B981" />
          <rect x="240" y="140" width="40" height="140" rx="8" fill="#2F5BC7" />
          <rect x="300" y="110" width="40" height="170" rx="8" fill="#F59E0B" />
          {/* Curved Growth Line */}
          <path d="M110 240 Q 200 190, 340 100" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="340" cy="100" r="8" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          {/* Badge */}
          <rect x="260" y="50" width="160" height="40" rx="20" fill="#10B981" />
          <text x="340" y="75" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">0% COMMISSION SIP</text>
        </svg>
      );
  }
}
