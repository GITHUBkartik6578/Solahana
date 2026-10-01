import React from 'react';
import { ArrowRight, ShieldCheck, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import heroScene from '../assets/hero-scene.webp';

const trustPoints = [
  { icon: ShieldCheck, lines: ['Trusted', 'Process'] },
  { icon: Users, lines: ['Personalised', 'for You'] },
  { icon: BarChart3, lines: ['Long-Term', 'Focus'] },
];

// Soft top and bottom edges so the banner melts into the navbar and the next section instead of ending in hard lines
const fadeBottom = {
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 72%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, transparent 0%, black 16%, black 72%, transparent 100%)',
};

export default function Hero() {
  return (
    <section className="bg-white pt-20 xl:pt-24">
      <div className="relative flex flex-col xl:flex-row xl:items-center xl:aspect-[1600/553] xl:min-h-[470px]">
        {/* One continuous banner: sits behind the copy on desktop, under it on phones/tablets */}
        <img
          src={heroScene}
          alt="Six steps of financial planning: financial, wealth, investment, tax, risk and estate planning"
          className="order-2 block w-full aspect-[4/3] sm:aspect-[16/9] object-cover object-[78%_center] xl:absolute xl:inset-0 xl:h-full xl:aspect-auto xl:object-right select-none pointer-events-none"
          style={fadeBottom}
          draggable="false"
        />

        <div className="order-1 relative z-10 max-w-[1320px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-4 xl:pt-10 xl:pb-0">
          <div className="@container w-full xl:w-[44%] text-center xl:text-left">
            <p className="font-sora text-[10px] sm:text-xs font-medium tracking-[0.26em] text-[#C58A1B] uppercase leading-relaxed">
              A Complete Financial Plan
              <br />
              For a Brighter Tomorrow
            </p>

            <h1 className="mt-4 font-serif-luxury text-[length:clamp(28px,8cqw,64px)] leading-[1.05] tracking-tight text-[#0F1F45]">
              <span className="block">Plan Today.</span>
              <span className="block">Protect Always.</span>
              <span className="block whitespace-nowrap text-[#C58A1B]">Grow for Generations.</span>
            </h1>

            <p className="mt-4 text-sm sm:text-lg text-[#1E2A4A] font-inter">
              Your complete financial journey, all in one place.
            </p>

            <Link
              to="/contact"
              className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#0F1F45] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,31,69,0.35)] transition-all hover:shadow-[0_15px_40px_rgba(15,31,69,0.5)]"
            >
              <span>Start Your Financial Plan</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>

            <div className="mt-8 flex flex-wrap items-center justify-center xl:justify-start gap-x-5 gap-y-4">
              {trustPoints.map(({ icon: Icon, lines }, i) => (
                <React.Fragment key={lines[0]}>
                  {i > 0 && <span className="hidden sm:block h-9 w-px bg-[#C58A1B]/30" />}
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#C58A1B]" strokeWidth={1.5} />
                    <span className="text-xs sm:text-sm leading-tight text-[#0F1F45] font-inter text-left">
                      {lines[0]}
                      <br />
                      {lines[1]}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
