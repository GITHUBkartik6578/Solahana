import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { INVEST_OPTIONS } from '../../data/investData';
import InvestHeroIllustration from '../../components/invest/InvestHeroIllustration';

export default function InvestDetailPage({ optionKey }) {
  const navigate = useNavigate();
  const params = useParams();
  
  const key = optionKey || params.category || 'mutual-funds';
  const data = INVEST_OPTIONS[key] || INVEST_OPTIONS['mutual-funds'];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `${data.title} Investment Planning | SOLAHANA — Wealth Management`;
  }, [key, data.title]);

  const scrollToConsultation = () => {
    const el = document.getElementById('global-consultation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#0F1F45] font-inter">
      {/* ========================================================= */}
      {/* 1. HERO SECTION WITH HUMAN MINIATURE / ILLUSTRATION       */}
      {/* ========================================================= */}
      <section className="relative pt-24 pb-14 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#F7F8FB] to-[#FFFFFF] border-b border-[#2F5BC7]/15">
        {/* Glow backlight */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#2F5BC7]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-6">
            <button onClick={() => navigate('/')} className="hover:text-[#2F5BC7] transition-colors">Home</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#2F5BC7]" />
            <button onClick={() => navigate('/investments')} className="hover:text-[#2F5BC7] transition-colors">Invest</button>
            <ChevronRight className="w-3.5 h-3.5 text-[#2F5BC7]" />
            <span className="text-[#1A3170] font-bold">{data.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-5 text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEF2FB] text-xs font-mono font-bold uppercase tracking-widest text-[#1A3170]">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A04F]" />
                <span>{data.tag}</span>
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0F1F45] leading-tight tracking-tight">
                {data.headline}
              </h1>

              <p className="text-base sm:text-lg text-[#475569] font-normal leading-relaxed max-w-xl line-clamp-2">
                {data.description}
              </p>

              {/* Key Highlights Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-[#E4E8F0]/60">
                {data.keyStats.map((stat, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#E4E8F0]/80 shadow-sm">
                    <div className="text-base sm:text-xl font-bold font-mono text-[#1A3170]">{stat.value}</div>
                    <div className="text-[11px] sm:text-xs text-[#64748B] mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={scrollToConsultation}
                  className="gold-glow-button px-8 py-4 rounded-full text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/contact')}
                  className="px-7 py-4 rounded-full border border-[#2F5BC7] text-xs sm:text-sm font-bold text-[#0F1F45] bg-white hover:bg-[#2F5BC7]/10 transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#2F5BC7]" />
                  <span>Talk to Fiduciary Advisor</span>
                </button>
              </div>

            </motion.div>

            {/* Right Illustration Column (Enlarged Container) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-6 flex justify-center"
            >
              <div className="relative w-full max-w-[500px] sm:max-w-[560px] lg:max-w-[640px] p-6 rounded-3xl bg-white/80 border border-[#2F5BC7]/30 shadow-2xl backdrop-blur-xl overflow-hidden flex items-center justify-center">
                <InvestHeroIllustration type={data.slug} />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. WHY INVEST IN THIS ASSET CLASS (FEATURE MATRIX)        */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2F5BC7]/10 border border-[#2F5BC7]/30 text-xs font-mono font-bold text-[#1A3170]">
            <Zap className="w-3.5 h-3.5 text-[#2F5BC7]" />
            <span>FINANCIAL ADVANTAGES</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#0F1F45]">
            Why Choose {data.title} with SOLAHANA
          </h2>
          <p className="text-sm sm:text-base text-[#64748B]">
            Engineered for high risk-adjusted returns, complete transparency, and fiduciary protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-3xl bg-white border border-[#E4E8F0] hover:border-[#CBD6EE] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(11,27,63,0.09)] shadow-md hover:shadow-xl transition-all duration-300 text-left flex items-start gap-5 group"
            >
              <div className="p-3.5 rounded-2xl bg-[#2F5BC7]/10 text-[#1A3170] group-hover:bg-[#1A3170] group-hover:text-white transition-colors shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#0F1F45] group-hover:text-[#1A3170] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. FIDUCIARY TRUST BANNER                                 */}
      {/* ========================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="rounded-3xl bg-gradient-to-r from-[#0F1F45] via-[#1E293B] to-[#0F1F45] p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#1A3170] to-transparent rounded-full" />
          
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2F5BC7]/20 border border-[#2F5BC7] flex items-center justify-center text-[#E4E8F0]">
            <Award className="w-8 h-8" />
          </div>

          <h3 className="font-serif-luxury text-2xl sm:text-4xl font-bold">
            Zero Commission. 100% Fiduciary Responsibility.
          </h3>

          <p className="text-xs sm:text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
            SOLAHANA operates on a zero-commission model. Every investment recommendation is selected strictly for your net-worth compounding with no hidden distributor kickbacks.
          </p>

          <button
            onClick={scrollToConsultation}
            className="gold-glow-button px-9 py-4 rounded-full text-xs sm:text-sm font-bold text-white tracking-wide inline-flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-all"
          >
            <span>Start Your Plan Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
