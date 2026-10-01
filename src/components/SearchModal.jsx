import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Target, ShieldCheck, ArrowRight, Calculator, PieChart } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, onSelectAction }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickPrompts = [
    { title: 'Calculate Tax Savings for FY 2025-26', category: 'Tax Optimization', icon: Calculator, link: 'tax' },
    { title: 'Simulate Early Retirement FIRE Target at 48', category: 'Goal Planner', icon: Target, link: 'planning' },
    { title: 'Section 80C & 80D Investment Placement', category: 'Tax Strategy', icon: ShieldCheck, link: 'tax' },
    { title: 'NRI DTAA Tax Benefit & FEMA Regulations', category: 'NRI Wealth', icon: ShieldCheck, link: 'nri' },
    { title: 'Explore Multi-Asset Mutual Funds & SIPs', category: 'Investments', icon: PieChart, link: 'invest' },
  ];

  const filteredPrompts = query
    ? quickPrompts.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
    : quickPrompts;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-white border border-[#E4E8F0] rounded-2xl shadow-2xl overflow-hidden text-left z-10"
          >
            {/* Input Header */}
            <div className="flex items-center px-5 py-4 border-b border-[#E4E8F0] bg-[#FFFFFF]">
              <Search className="w-5 h-5 text-[#2F5BC7] mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search SOLAHANA financial strategies or calculators..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-[#0F1F45] placeholder-[#475569]/60 focus:outline-none text-base font-inter"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 text-[#475569] hover:text-[#0F1F45] mr-2">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-[#475569] bg-[#F7F8FB] border border-[#E4E8F0] rounded font-mono">
                ESC
              </kbd>
            </div>

            {/* Content Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#475569]">
                <span>Financial Planning Topics</span>
                <span className="text-[#2F5BC7] font-sora font-bold">SOLAHANA Wealth Desk</span>
              </div>

              <div className="space-y-2">
                {filteredPrompts.length > 0 ? (
                  filteredPrompts.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (onSelectAction) onSelectAction(item);
                          onClose();
                        }}
                        className="w-full text-left p-3.5 rounded-xl border border-[#E4E8F0] bg-[#FFFFFF] hover:bg-[#F7F8FB] hover:border-[#2F5BC7] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3.5">
                          <div className="p-2 rounded-lg bg-[#2F5BC7]/10 border border-[#E4E8F0] group-hover:bg-[#1A3170] group-hover:text-white transition-colors text-[#2F5BC7]">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0F1F45] group-hover:text-[#2F5BC7] transition-colors">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-[#475569] font-mono">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#475569] group-hover:text-[#2F5BC7] group-hover:translate-x-1 transition-all" />
                      </button>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-[#475569]">
                    No matching financial tools or topics found.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
