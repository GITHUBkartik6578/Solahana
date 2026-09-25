import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  Calculator, 
  Activity, 
  Award, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock
} from 'lucide-react';

export default function AIWealthAdvisor() {
  const [messages, setMessages] = useState([
    {
      sender: 'user',
      text: 'How much should I invest monthly for retirement?',
      time: '9:41 AM',
    },
    {
      sender: 'ai',
      text: 'Based on your current income of ₹2.5L/mo and existing corpus of ₹45L, investing ₹12,500/month in our High-Growth Equity PMS could help you comfortably achieve your ₹10 Cr retirement goal by age 60.',
      time: '9:41 AM',
    },
    {
      sender: 'user',
      text: 'Can I save more tax this year?',
      time: '9:42 AM',
    },
    {
      sender: 'ai',
      text: 'Yes! I identified ₹24,000 in potential tax savings under Section 80C and Section 80D. Plus, harvesting ₹48,500 of LTCG equity before March 31st will incur 0% capital gains tax.',
      time: '9:42 AM',
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState('');

  const suggestedPrompts = [
    'Review My Portfolio',
    'Calculate Retirement Goal',
    'Save More Tax',
    'Start SIP',
    'Check My Risk Score',
  ];

  const handlePromptClick = (promptText) => {
    if (isTyping) return;
    
    // Add user message
    const userMsg = { sender: 'user', text: promptText, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiText = '';
      if (promptText.includes('Portfolio')) {
        aiText = 'Your overall portfolio health score is 92/100! Zero fund overlaps detected across your 4 active mutual funds andPMS.';
      } else if (promptText.includes('Retirement')) {
        aiText = 'Your FIRE retirement target of ₹10 Cr is currently 68% on track. Increasing your monthly SIP by ₹5,000 will shorten your timeline by 2.5 years.';
      } else if (promptText.includes('Tax')) {
        aiText = 'By allocating ₹50,000 in ELSS tax-saver funds and ₹50,000 in NPS Tier 1 under Sec 80CCD(1B), you save ₹31,200 in the 30% slab.';
      } else if (promptText.includes('SIP')) {
        aiText = 'I recommend a 15% annual step-up SIP starting at ₹25,000/mo split 60% Large Cap Growth, 25% Mid Cap Alpha, and 15% S&P 500 US Tech.';
      } else {
        aiText = 'Your current risk profile is Moderate Growth (Risk Score: 6.8/10). Ideal for compounding over a 7-10 year horizon.';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiText, time: 'Just now' }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    handlePromptClick(inputText);
    setInputText('');
  };

  // Feature highlight cards
  const featureHighlights = [
    {
      title: 'AI Portfolio Review',
      desc: 'Get instant 360° health analysis & overlap detection of your investments.',
      icon: Activity,
    },
    {
      title: 'Retirement Goal Planner',
      desc: 'Predict exact retirement timelines & FIRE milestones with machine learning.',
      icon: Target,
    },
    {
      title: 'Tax Optimizer Engine',
      desc: 'Identify Section 80C, 80D & LTCG tax-harvesting opportunities legally.',
      icon: Calculator,
    },
    {
      title: '24×7 Wealth Assistant',
      desc: 'Always-available AI financial co-pilot answering tax & market queries.',
      icon: Bot,
    },
  ];

  return (
    <section className="relative z-10 py-24 bg-gradient-to-b from-[#F7F8FB] via-[#F7F8FB] to-[#F7F8FB] border-t border-[#2F5BC7]/15 overflow-hidden">
      
      {/* Ambient Neural Network Glow & Radial Lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-[#2F5BC7]/12 via-[#5A7FD6]/8 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-blue-900/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Abstract Curved Orbital Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none stroke-[#2F5BC7]" viewBox="0 0 1440 900" fill="none">
        <path d="M-100 200 C300 100, 800 600, 1540 300" strokeWidth="1.5" strokeDasharray="6 6" />
        <path d="M-100 600 C400 800, 900 200, 1540 700" strokeWidth="1" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full gold-badge text-xs font-semibold text-[#5A7FD6] border border-[#2F5BC7]/30 shadow-[0_0_15px_rgba(26,49,112,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A7FD6] animate-pulse" />
            <span className="font-sora tracking-wide uppercase text-[11px]">AI Powered Financial Intelligence</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#F7F8FB] tracking-tight leading-[1.2] mb-6"
          >
            Meet Your Personal{' '}
            <span className="gold-gradient-text italic font-serif-luxury">
              AI Wealth Advisor
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#5B6B84] font-inter leading-relaxed"
          >
            An intelligent assistant that understands your income, expenses, investments, tax slabs, and long-term financial goals to create hyper-personalized wealth recommendations.
          </motion.p>
        </div>


        {/* SPLIT LAYOUT: CHAT INTERFACE (LEFT) & FUTURISTIC ORB / HOLOGRAPHIC CARDS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-20">
          
          {/* ========================================== */}
          {/* LEFT SIDE: INTERACTIVE AI CHAT CARD        */}
          {/* ========================================== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-3xl p-5 sm:p-6 bg-[#F7F8FB]/75 border border-[#2F5BC7]/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(2,11,45,0.9)] hover:shadow-[0_25px_70px_rgba(26,49,112,0.2)] transition-all duration-500 overflow-hidden">
              
              {/* Header Bar */}
              <div className="pb-4 mb-4 border-b border-[#2F5BC7]/20 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5A7FD6] to-[#1A3170] p-[1px] shadow-[0_0_15px_rgba(26,49,112,0.4)]">
                      <div className="w-full h-full rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#5A7FD6]">
                        <Sparkles className="w-5 h-5 fill-[#5A7FD6]" />
                      </div>
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#E4E8F0] rounded-full" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#F7F8FB] font-serif-luxury flex items-center gap-1.5">
                      Solahana AI Co-Pilot
                      <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-[#2F5BC7]/20 text-[#5A7FD6] border border-[#2F5BC7]/40 font-num">v3.5 PRO</span>
                    </div>
                    <div className="text-[11px] text-[#5B6B84] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>256-Bit Encrypted • SEBI Regulated</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-num text-[#2F5BC7] bg-[#FFFFFF]/60 px-2.5 py-1 rounded-full border border-[#2F5BC7]/20">
                  ⚡ Live Planning
                </div>
              </div>

              {/* Chat Messages Feed */}
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 text-xs sm:text-sm font-inter">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-[#1A3170] text-white flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(26,49,112,0.5)]">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#1A3170] to-[#1A3170] text-white font-medium rounded-tr-none shadow-lg'
                        : 'bg-[#FFFFFF]/80 border border-[#2F5BC7]/20 text-[#F7F8FB] rounded-tl-none shadow-inner'
                    }`}>
                      <p>{msg.text}</p>
                      <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-[#0F1F45]/70' : 'text-[#5B6B84]'}`}>
                        {msg.time}
                      </div>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-full bg-[#F7F8FB] border border-[#2F5BC7]/30 text-[#5A7FD6] flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 p-3 rounded-2xl bg-[#FFFFFF]/80 border border-[#2F5BC7]/20 text-[#2F5BC7] w-24"
                  >
                    <Bot className="w-4 h-4 animate-spin" />
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-[#1A3170] rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-[#1A3170] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-[#1A3170] rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Suggested Prompt Chips */}
              <div className="pt-4 mt-4 border-t border-[#2F5BC7]/15 space-y-2">
                <div className="text-[10px] uppercase font-semibold text-[#5B6B84] tracking-wider flex items-center gap-1 font-sora">
                  <Zap className="w-3 h-3 text-[#5A7FD6]" /> Click to Ask AI Co-Pilot:
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-[#5B6B84] hover:text-[#5A7FD6] bg-[#FFFFFF]/60 hover:bg-[#FFFFFF] border border-[#2F5BC7]/20 hover:border-[#2F5BC7]/50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      ✨ {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSend} className="mt-4 flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ask AI Advisor about your tax, SIPs, PMS, or FIRE target..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#FFFFFF]/90 border border-[#2F5BC7]/30 rounded-xl px-4 py-2.5 text-xs text-[#F7F8FB] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#5A7FD6] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isTyping || !inputText.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#5A7FD6] to-[#1A3170] text-white font-bold hover:shadow-[0_0_15px_rgba(26,49,112,0.5)] transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </motion.div>


          {/* ========================================== */}
          {/* RIGHT SIDE: FUTURISTIC AI ORB & CARDS     */}
          {/* ========================================== */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 relative flex items-center justify-center min-h-[460px]"
          >
            {/* Central Glowing Golden AI Orb */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full flex items-center justify-center">
              
              {/* Outer Pulsing Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2F5BC7]/40 via-[#5A7FD6]/20 to-blue-600/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-4 border border-[#5A7FD6]/30 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-10 border border-dashed border-[#2F5BC7]/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
              
              {/* Core Orb */}
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-[#5A7FD6] via-[#1A3170] to-[#1A3170] p-1 shadow-[0_0_50px_rgba(26,49,112,0.6)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#FFFFFF] flex flex-col items-center justify-center relative overflow-hidden text-center p-4">
                  <Sparkles className="w-10 h-10 text-[#5A7FD6] animate-pulse mb-1" />
                  <span className="text-xs font-serif-luxury font-bold text-[#F7F8FB]">Solahana Engine</span>
                  <span className="text-[9px] font-num text-[#2F5BC7]">99.8% Accuracy</span>
                </div>
              </div>
            </div>

            {/* 5 FLOATING HOLOGRAPHIC FINANCE CARDS */}

            {/* Holographic Card 1: Portfolio Health (Top Left) */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-2 left-0 sm:left-4 glass-card px-4 py-3 rounded-2xl border border-[#2F5BC7]/35 shadow-xl z-20 flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-num font-bold text-xs">
                92/100
              </div>
              <div>
                <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Portfolio Health</div>
                <div className="text-xs font-bold text-[#F7F8FB] flex items-center gap-1">
                  Excellent <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </motion.div>

            {/* Holographic Card 2: Tax Savings (Top Right) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              className="absolute top-4 -right-2 sm:right-4 glass-card px-4 py-3 rounded-2xl border border-[#2F5BC7]/35 shadow-xl z-20 flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#2F5BC7]/20 border border-[#2F5BC7]/40 flex items-center justify-center text-[#5A7FD6]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Tax Savings Detected</div>
                <div className="text-xs font-bold text-[#5A7FD6] font-num">
                  ₹24,000 Saved <span className="text-[9px] text-[#5B6B84]">Sec 80C</span>
                </div>
              </div>
            </motion.div>

            {/* Holographic Card 3: Risk Score (Middle Left) */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute top-1/2 -left-4 sm:left-0 -translate-y-1/2 glass-card px-4 py-3 rounded-2xl border border-blue-400/30 shadow-xl z-20 flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Risk Score Gauge</div>
                <div className="text-xs font-bold text-blue-300 font-num">
                  6.8 / 10 <span className="text-[9px] text-[#F7F8FB]">(Moderate Growth)</span>
                </div>
              </div>
            </motion.div>

            {/* Holographic Card 4: SIP Recommendation (Middle Right) */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 1.5 }}
              className="absolute top-1/2 -right-4 sm:right-0 -translate-y-1/2 glass-card px-4 py-3 rounded-2xl border border-purple-400/30 shadow-xl z-20 flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-[#5B6B84] font-sora uppercase">SIP Step-Up Alert</div>
                <div className="text-xs font-bold text-[#5A7FD6] font-num">
                  +₹5,000/mo <span className="text-[9px] text-emerald-400">(+18.2% XIRR)</span>
                </div>
              </div>
            </motion.div>

            {/* Holographic Card 5: FIRE Score (Bottom Center) */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 0.8 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass-card px-5 py-3 rounded-2xl border border-[#2F5BC7]/40 shadow-2xl z-20 flex items-center space-x-3"
            >
              <div className="w-9 h-9 rounded-full bg-[#1A3170] text-white flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-[#5B6B84] font-sora uppercase">Retirement Readiness</div>
                <div className="text-xs font-bold text-[#F7F8FB]">
                  FIRE Target <span className="text-[#5A7FD6] font-num">68% Complete</span>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>


        {/* FOUR FEATURE HIGHLIGHT CARDS (BELOW SPLIT LAYOUT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureHighlights.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-2xl bg-[#F7F8FB]/50 border border-[#2F5BC7]/20 hover:border-[#2F5BC7]/50 backdrop-blur-xl transition-all duration-300 group hover:shadow-[0_12px_35px_rgba(26,49,112,0.15)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2F5BC7]/15 border border-[#2F5BC7]/30 flex items-center justify-center text-[#5A7FD6] group-hover:bg-[#1A3170] group-hover:text-[#0F1F45] transition-colors duration-300 mb-4">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif-luxury font-bold text-[#F7F8FB] group-hover:text-[#5A7FD6] transition-colors mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#5B6B84] leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
