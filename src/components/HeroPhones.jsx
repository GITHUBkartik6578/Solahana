import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  PieChart, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  Award,
  Zap,
  Target,
  Bell
} from 'lucide-react';

export default function HeroPhones() {
  const [activeTabPhone1, setActiveTabPhone1] = useState('allocation');

  return (
    <div className="relative w-full h-[620px] lg:h-[680px] flex items-center justify-center perspective-1000 select-none">
      
      {/* Central Golden Lighting Backdrop Glow */}
      <div className="absolute w-[450px] h-[450px] bg-gradient-to-tr from-[#2F5BC7]/20 via-[#5A7FD6]/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

      {/* ========================================== */}
      {/* PHONE 2: LEFT TILTED (Goal Tracker)       */}
      {/* ========================================== */}
      <motion.div
        initial={{ opacity: 0, x: -60, y: 30, rotateY: 25, rotateZ: -8 }}
        animate={{ opacity: 1, x: 0, y: 0, rotateY: 18, rotateZ: -6 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 sm:left-4 lg:-left-6 top-16 sm:top-12 w-[240px] sm:w-[270px] h-[480px] sm:h-[530px] rounded-[42px] p-3 bg-gradient-to-b from-[#333a4d] via-[#111827] to-[#F7F8FB] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-[#2F5BC7]/30 phone-tilt-left z-10 hidden sm:block"
      >
        {/* Outer Phone Bezel & Screen Container */}
        <div className="w-full h-full rounded-[32px] bg-[#FFFFFF] border border-[#E4E8F0] overflow-hidden flex flex-col relative text-left">
          
          {/* iPhone Dynamic Island / Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full flex items-center justify-end px-2 z-30">
            <div className="w-2 h-2 rounded-full bg-[#2F5BC7]/60 animate-pulse" />
          </div>

          {/* Status Bar */}
          <div className="pt-3 px-5 flex items-center justify-between text-[10px] text-[#5B6B84] font-num z-20">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <span>5G</span>
              <div className="w-4 h-2 border border-[#E4E8F0] rounded-sm p-[1px]">
                <div className="w-full h-full bg-[#1A3170]" />
              </div>
            </div>
          </div>

          {/* Phone Content Header */}
          <div className="p-4 pt-2 border-b border-[#2F5BC7]/15 bg-gradient-to-b from-[#F7F8FB] to-[#F7F8FB]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#5B6B84] uppercase tracking-wider font-sora">
                Wealth Goals
              </span>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#2F5BC7]/20 text-[#5A7FD6] border border-[#2F5BC7]/40">
                3 Active
              </span>
            </div>
            <div className="text-base font-serif-luxury font-bold text-[#F7F8FB] mt-1 flex items-center justify-between">
              <span>FIRE Tracker</span>
              <Target className="w-4 h-4 text-[#2F5BC7]" />
            </div>
          </div>

          {/* Goal Cards */}
          <div className="p-3.5 space-y-3 flex-1 overflow-hidden">
            {/* Goal 1: Early Retirement */}
            <div className="p-3 rounded-xl bg-[#F7F8FB]/60 border border-[#2F5BC7]/25 space-y-2">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <div className="font-semibold text-[#F7F8FB]">Early Retirement (Age 48)</div>
                  <div className="text-[10px] text-[#5B6B84] font-num">₹6.8 Cr / ₹10.0 Cr Target</div>
                </div>
                <span className="text-xs font-bold text-[#5A7FD6] font-num">68%</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden border border-[#2F5BC7]/20">
                <div className="h-full bg-gradient-to-r from-[#5A7FD6] via-[#1A3170] to-[#1A3170] rounded-full w-[68%] shadow-[0_0_10px_#2F5BC7]" />
              </div>
              <div className="flex justify-between text-[9px] text-[#5B6B84]">
                <span>On Track • +2 Yrs Ahead</span>
                <span className="text-emerald-400 font-semibold">+14.2% p.a.</span>
              </div>
            </div>

            {/* Goal 2: Children Education */}
            <div className="p-3 rounded-xl bg-[#F7F8FB]/40 border border-[#E4E8F0]/15 space-y-2">
              <div className="flex justify-between items-start text-xs">
                <div>
                  <div className="font-semibold text-[#F7F8FB]">Ivy League Education</div>
                  <div className="text-[10px] text-[#5B6B84] font-num">₹41.0L / ₹50.0L Target</div>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-num">82%</span>
              </div>
              <div className="w-full h-2 bg-[#FFFFFF] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[82%]" />
              </div>
            </div>

            {/* Goal 3: Goa Villa */}
            <div className="p-3 rounded-xl bg-[#F7F8FB]/30 border border-[#E4E8F0]/10 space-y-1.5 opacity-80">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-[#F7F8FB]">Goa Luxury Villa</span>
                <span className="text-xs text-[#5B6B84] font-num">45%</span>
              </div>
              <div className="w-full h-1.5 bg-[#FFFFFF] rounded-full overflow-hidden">
                <div className="h-full bg-[#2F5BC7]/60 rounded-full w-[45%]" />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="p-3 bg-[#F7F8FB]/80 border-t border-[#2F5BC7]/15 text-center text-[10px] text-[#2F5BC7] font-semibold flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 fill-[#2F5BC7]" /> Auto-compounding with SIP ₹50,000/mo
          </div>
        </div>
      </motion.div>


      {/* ========================================== */}
      {/* PHONE 1: CENTER FRONT (Portfolio Overview) */}
      {/* ========================================== */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-[270px] sm:w-[300px] h-[540px] sm:h-[590px] rounded-[46px] p-3 bg-gradient-to-b from-[#5A7FD6]/40 via-[#2F5BC7]/30 to-[#F7F8FB] shadow-[0_30px_90px_rgba(26,49,112,0.25)] border-2 border-[#5A7FD6]/50 phone-tilt-center z-30"
      >
        {/* Screen Container */}
        <div className="w-full h-full rounded-[36px] bg-[#FFFFFF] border border-[#2F5BC7]/40 overflow-hidden flex flex-col relative text-left">
          
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full flex items-center justify-between px-3 z-30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#1A3170]" />
          </div>

          {/* Status Bar */}
          <div className="pt-3 px-6 flex items-center justify-between text-[11px] text-[#5B6B84] font-num z-20">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5">
              <Bell className="w-3 h-3 text-[#5A7FD6]" />
              <span>5G</span>
            </div>
          </div>

          {/* Top Wealth Card Header */}
          <div className="p-4 pt-3 bg-gradient-to-b from-[#F7F8FB] to-[#F7F8FB] border-b border-[#2F5BC7]/20 relative">
            <div className="flex items-center justify-between text-[11px] text-[#5B6B84]">
              <span className="font-sora uppercase tracking-wider font-semibold">Total Portfolio Net Worth</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-num font-bold text-[10px] flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +14.2%
              </span>
            </div>

            {/* Currency Big Number */}
            <div className="mt-1 text-2xl font-num font-bold text-[#F7F8FB] tracking-tight flex items-baseline gap-1">
              <span className="text-[#2F5BC7] text-lg font-normal">₹</span>1,84,50,000
            </div>
            <div className="text-[10px] text-[#5B6B84] font-num flex items-center gap-2 mt-0.5">
              <span>Abs Return: <span className="text-[#5A7FD6]">+₹22.8L</span></span>
              <span>•</span>
              <span>XIRR: <span className="text-emerald-400">18.6%</span></span>
            </div>

            {/* Toggle Tabs */}
            <div className="mt-3 flex p-0.5 rounded-lg bg-[#FFFFFF]/80 border border-[#2F5BC7]/20 text-[10px]">
              <button
                onClick={() => setActiveTabPhone1('allocation')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  activeTabPhone1 === 'allocation' ? 'bg-[#1A3170] text-white' : 'text-[#5B6B84]'
                }`}
              >
                Allocation
              </button>
              <button
                onClick={() => setActiveTabPhone1('holdings')}
                className={`flex-1 py-1 rounded-md font-semibold transition-all ${
                  activeTabPhone1 === 'holdings' ? 'bg-[#1A3170] text-white' : 'text-[#5B6B84]'
                }`}
              >
                Top Assets
              </button>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="p-4 space-y-3 flex-1 overflow-hidden">
            {activeTabPhone1 === 'allocation' ? (
              <>
                {/* Asset Allocation Bar Visual */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-[#F7F8FB]">
                    <span className="font-medium">Multi-Asset Distribution</span>
                    <span className="text-[#2F5BC7] font-num">100% Balanced</span>
                  </div>
                  {/* Multi color bar */}
                  <div className="h-3 w-full rounded-full overflow-hidden flex p-[1px] bg-black/40 border border-[#2F5BC7]/30">
                    <div className="h-full bg-gradient-to-r from-[#5A7FD6] to-[#1A3170] w-[55%]" title="Equities 55%" />
                    <div className="h-full bg-blue-500 w-[20%]" title="Fixed Income 20%" />
                    <div className="h-full bg-purple-500 w-[15%]" title="US Tech 15%" />
                    <div className="h-full bg-emerald-400 w-[10%]" title="Gold & Real Estate 10%" />
                  </div>
                </div>

                {/* Legend Chips */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded-lg bg-[#F7F8FB]/60 border border-[#2F5BC7]/20 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#5A7FD6]" />
                      <span className="text-[#F7F8FB]">Indian Equities</span>
                    </div>
                    <span className="font-num text-[#2F5BC7] font-bold">55%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F7F8FB]/60 border border-blue-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-[#F7F8FB]">Corporate Bonds</span>
                    </div>
                    <span className="font-num text-blue-300 font-bold">20%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F7F8FB]/60 border border-purple-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-[#F7F8FB]">US Tech (S&P)</span>
                    </div>
                    <span className="font-num text-purple-300 font-bold">15%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F7F8FB]/60 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[#F7F8FB]">Sovereign Gold</span>
                    </div>
                    <span className="font-num text-emerald-300 font-bold">10%</span>
                  </div>
                </div>

                {/* AI Rebalance Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#F7F8FB] to-[#F7F8FB] border border-[#2F5BC7]/35 flex items-center space-x-3 shadow-lg">
                  <div className="p-2 rounded-lg bg-[#1A3170] text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#5A7FD6]">Solahana AI Rebalance</div>
                    <div className="text-[10px] text-[#5B6B84]">Shift +₹2.5L to Mid-cap PMS for optimal 19% alpha</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                {[
                  { name: 'Solahana Alpha PMS', value: '₹52,40,000', return: '+24.6%', color: 'text-emerald-400' },
                  { name: 'Nifty 50 Direct Index', value: '₹38,10,000', return: '+14.1%', color: 'text-[#5A7FD6]' },
                  { name: 'Nasdaq 100 Tech ETF', value: '₹28,50,000', return: '+28.2%', color: 'text-purple-400' },
                  { name: 'AAA Rated Corporate Bond', value: '₹32,00,000', return: '+8.9%', color: 'text-blue-400' },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#F7F8FB]/60 border border-[#2F5BC7]/15 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#F7F8FB]">{item.name}</div>
                      <div className="text-[10px] text-[#5B6B84] font-num">{item.value}</div>
                    </div>
                    <div className={`text-xs font-bold font-num ${item.color}`}>{item.return}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phone Footer CTA */}
          <div className="p-3 bg-[#F7F8FB] border-t border-[#2F5BC7]/20 flex items-center justify-between text-xs">
            <span className="text-[10px] text-[#5B6B84]">SEBI-Registered Fiduciary</span>
            <button className="px-3 py-1 rounded-full bg-[#1A3170] text-white font-bold text-[10px] hover:bg-[#5A7FD6] transition-colors">
              Invest Now
            </button>
          </div>
        </div>
      </motion.div>


      {/* ========================================== */}
      {/* PHONE 3: RIGHT TILTED (AI Wealth Insights) */}
      {/* ========================================== */}
      <motion.div
        initial={{ opacity: 0, x: 60, y: 30, rotateY: -25, rotateZ: 8 }}
        animate={{ opacity: 1, x: 0, y: 0, rotateY: -18, rotateZ: 6 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 sm:right-4 lg:-right-6 top-16 sm:top-12 w-[240px] sm:w-[270px] h-[480px] sm:h-[530px] rounded-[42px] p-3 bg-gradient-to-b from-[#333a4d] via-[#111827] to-[#F7F8FB] shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-[#2F5BC7]/30 phone-tilt-right z-10 hidden sm:block"
      >
        {/* Outer Phone Bezel & Screen Container */}
        <div className="w-full h-full rounded-[32px] bg-[#FFFFFF] border border-[#E4E8F0] overflow-hidden flex flex-col relative text-left">
          
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full flex items-center justify-center z-30">
            <div className="w-2 h-2 rounded-full bg-[#5A7FD6] animate-ping" />
          </div>

          {/* Status Bar */}
          <div className="pt-3 px-5 flex items-center justify-between text-[10px] text-[#5B6B84] font-num z-20">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-[#5A7FD6]" />
            </div>
          </div>

          {/* Header */}
          <div className="p-4 pt-2 border-b border-[#2F5BC7]/15 bg-gradient-to-b from-[#F7F8FB] to-[#F7F8FB]">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#1A3170] flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5 fill-[#0F1F45]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F7F8FB]">Solahana AI Co-Pilot</div>
                <div className="text-[9px] text-emerald-400 font-num">Active • Tax Optimization Engine</div>
              </div>
            </div>
          </div>

          {/* Chat / Insights Content */}
          <div className="p-3.5 space-y-3 flex-1 overflow-hidden text-xs">
            {/* Message Bubble 1 */}
            <div className="p-3 rounded-2xl bg-[#F7F8FB]/80 border border-[#2F5BC7]/25 space-y-2 text-[11px] text-[#F7F8FB]">
              <div className="flex items-center justify-between text-[#2F5BC7] font-semibold">
                <span>💡 Tax Loss Harvesting Opportunity</span>
                <span className="text-[9px] text-[#5B6B84]">Just now</span>
              </div>
              <p className="text-[#5B6B84] leading-tight">
                I identified <strong className="text-[#5A7FD6]">₹48,500</strong> in LTCG tax savings before March 31st by harvesting underperforming equity units.
              </p>
              <button className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#5A7FD6] to-[#1A3170] text-white font-bold text-[10px] hover:opacity-90 transition-opacity">
                Execute Tax-Harvest Now
              </button>
            </div>

            {/* Message Bubble 2 */}
            <div className="p-3 rounded-2xl bg-[#F7F8FB]/50 border border-[#E4E8F0]/15 space-y-1.5 text-[11px] text-[#F7F8FB]">
              <div className="flex items-center justify-between text-emerald-400 font-semibold">
                <span>📈 Market Volatility Alert</span>
              </div>
              <p className="text-[#5B6B84] text-[10px] leading-tight">
                Nifty 50 PE ratio corrected to 21.4x. Recommended step: Increase monthly SIP by ₹10,000 in Large Cap Growth strategy.
              </p>
            </div>

            {/* Security Badge */}
            <div className="p-2 rounded-xl bg-[#FFFFFF] border border-[#2F5BC7]/20 flex items-center space-x-2 text-[10px] text-[#5B6B84]">
              <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
              <span>Zero commissions • Bank-grade AES 256</span>
            </div>
          </div>

          {/* Bottom input simulation */}
          <div className="p-2.5 bg-[#F7F8FB] border-t border-[#2F5BC7]/15">
            <div className="w-full px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#2F5BC7]/30 text-[10px] text-[#5B6B84] flex items-center justify-between">
              <span>Ask Solahana AI anything...</span>
              <Sparkles className="w-3 h-3 text-[#5A7FD6]" />
            </div>
          </div>
        </div>
      </motion.div>


      {/* ========================================== */}
      {/* 5 FLOATING GLASS WIDGETS AROUND THE PHONES */}
      {/* ========================================== */}

      {/* Widget 1: Portfolio +12.6% (Top Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute -top-4 -left-2 sm:left-2 lg:left-[-35px] glass-card px-4 py-2.5 rounded-2xl flex items-center space-x-3 z-40 animate-float shadow-xl"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora font-medium uppercase tracking-wider">Annual Yield</div>
          <div className="text-sm font-num font-bold text-emerald-400 flex items-center gap-1">
            Portfolio +12.6% <span className="text-[10px] text-[#5B6B84] font-normal">this Q3</span>
          </div>
        </div>
      </motion.div>

      {/* Widget 2: Tax Saved ₹24,000 (Top Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute top-2 -right-2 sm:right-2 lg:right-[-35px] glass-card px-4 py-2.5 rounded-2xl flex items-center space-x-3 z-40 animate-float-delayed shadow-xl"
      >
        <div className="w-9 h-9 rounded-xl bg-[#2F5BC7]/20 border border-[#2F5BC7]/50 flex items-center justify-center text-[#5A7FD6]">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora font-medium uppercase tracking-wider">Tax Saved FY25</div>
          <div className="text-sm font-num font-bold text-[#5A7FD6]">
            ₹24,000 <span className="text-[10px] text-[#5B6B84] font-normal">Sec 80C/80D</span>
          </div>
        </div>
      </motion.div>

      {/* Widget 3: SIP Active (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="absolute bottom-12 -left-4 sm:left-4 lg:left-[-40px] glass-card px-4 py-2.5 rounded-2xl flex items-center space-x-3 z-40 animate-float-delayed shadow-xl"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Zap className="w-5 h-5 fill-blue-400" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#E4E8F0] animate-ping" />
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora font-medium uppercase tracking-wider">Smart Auto-SIP</div>
          <div className="text-sm font-num font-bold text-[#F7F8FB]">
            SIP Active <span className="text-xs text-[#2F5BC7]">₹50,000/mo</span>
          </div>
        </div>
      </motion.div>

      {/* Widget 4: AI Recommendation (Middle Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-36 -right-4 sm:right-2 lg:right-[-45px] glass-card px-4 py-2.5 rounded-2xl flex items-center space-x-3 z-40 animate-float shadow-xl border-l-4 border-l-[#5A7FD6]"
      >
        <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
          <Sparkles className="w-5 h-5 fill-purple-300" />
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora font-medium uppercase tracking-wider">AI Co-Pilot Alert</div>
          <div className="text-xs font-semibold text-[#5A7FD6]">
            Rebalance Equity (+5%)
          </div>
        </div>
      </motion.div>

      {/* Widget 5: Retirement Goal 68% Complete (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute -bottom-2 right-4 sm:right-10 lg:right-4 glass-card px-4 py-2.5 rounded-2xl flex items-center space-x-3 z-40 animate-float-delayed shadow-xl"
      >
        <div className="w-9 h-9 rounded-full bg-[#2F5BC7]/15 border-2 border-[#2F5BC7] flex items-center justify-center text-[#5A7FD6] font-num font-bold text-xs">
          68%
        </div>
        <div>
          <div className="text-[10px] text-[#5B6B84] font-sora font-medium uppercase tracking-wider">Retirement Goal</div>
          <div className="text-xs font-bold text-[#F7F8FB] font-num">
            68% Complete <span className="text-[10px] text-emerald-400">On Track</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
