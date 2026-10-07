import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PROCESS_STEPS } from '../../data/whoWeServe';

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-serif-luxury text-[28px] font-bold leading-tight text-[#0F1F45] [text-wrap:balance] sm:text-[34px]">
              Five steps, whoever you are
            </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-12 rounded-full" style={{ background: 'var(--grad-gold)' }} />
            <p className="mt-4 leading-relaxed text-[#475569]">
              The process is the same for everyone. What changes is what we focus on.
            </p>
          </div>
          <Link
            to="/our-process"
            className="btn-luxury-outline inline-flex shrink-0 items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm lg:self-auto"
          >
            See our full process <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ol className="relative mt-12 grid gap-8 lg:grid-cols-5 lg:gap-6">
          {/* connecting line */}
          <span aria-hidden="true" className="absolute bottom-5 left-5 top-5 w-px bg-[#E4E8F0] lg:hidden" />
          <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-5 hidden h-px bg-[#E4E8F0] lg:block" />

          {PROCESS_STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif-luxury text-[15px] font-bold ${
                  i === 0 ? 'bg-[#1A3170] text-white' : 'border-2 border-[#1A3170] bg-white text-[#1A3170]'
                }`}
              >
                {i + 1}
              </span>
              <div className="pt-1.5 lg:mt-5 lg:pt-0">
                <h3 className="font-serif-luxury text-[17px] font-bold text-[#0F1F45]">{step.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#475569] lg:mx-auto lg:max-w-[22ch]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
