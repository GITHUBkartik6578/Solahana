import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CircleAlert } from 'lucide-react';

/**
 * Alternating content row: copy on one side, a visual on the other.
 * Pass `photo` (an imported image) to show a real photograph instead of the illustrated visual.
 */
export default function FeatureRow({
  id,
  index,
  eyebrow,
  title,
  lead,
  problems,
  problemsTitle = 'Sounds familiar?',
  points,
  pointsTitle = 'How we help',
  outcome,
  cta,
  ctaTo = '#global-consultation-section',
  Visual,
  photo,
  photoAlt = '',
}) {
  const flip = index % 2 === 1;

  return (
    <section id={id} className={`scroll-mt-28 py-14 sm:py-20 ${flip ? 'bg-[#F7F8FB]' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className={flip ? 'lg:order-2' : ''}
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#2F5BC7]">{eyebrow}</p>
          <h2 className="mt-3 text-[28px] sm:text-[34px] font-serif-luxury font-bold text-[#0F1F45] leading-tight [text-wrap:balance]">{title}</h2>
          {lead && <p className="mt-4 text-base text-[#475569] leading-relaxed">{lead}</p>}

          <div className={`mt-7 grid gap-6 ${problems ? 'sm:grid-cols-2' : ''}`}>
            {problems && (
              <div>
                <p className="text-sm font-bold text-[#0F1F45]">{problemsTitle}</p>
                <ul className="mt-3 space-y-2.5">
                  {problems.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-[#475569] leading-snug">
                      <CircleAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#C9A04F]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {points && (
              <div>
                <p className="text-sm font-bold text-[#0F1F45]">{pointsTitle}</p>
                <ul className="mt-3 space-y-2.5">
                  {points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-[#0F1F45] leading-snug">
                      <span className="w-4 h-4 mt-0.5 shrink-0 rounded-full bg-[#2F5BC7] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" strokeWidth={3.5} />
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {outcome && (
            <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#EEF2FB] px-4 py-2.5 text-sm">
              <span className="font-bold text-[#1A3170]">You get:</span>
              <span className="text-[#0F1F45]">{outcome}</span>
            </div>
          )}

          {cta && (
            <div className="mt-8">
              {ctaTo.startsWith('#') ? (
                <a
                  href={ctaTo}
                  onClick={(e) => {
                    const el = document.querySelector(ctaTo);
                    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
                  }}
                  className="gold-glow-button group"
                >
                  <span>{cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              ) : (
                <Link to={ctaTo} className="gold-glow-button group">
                  <span>{cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          )}
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={flip ? 'lg:order-1' : ''}
        >
          <div className="relative rounded-3xl border border-[#E4E8F0] bg-gradient-to-br from-white to-[#F4F6FB] p-4 sm:p-6 shadow-[0_1px_2px_rgba(15,31,69,0.04),0_18px_44px_rgba(15,31,69,0.07)] overflow-hidden">
            {photo ? (
              <img src={photo} alt={photoAlt} loading="lazy" className="w-full aspect-[10/7] object-cover rounded-2xl" />
            ) : (
              <div className="aspect-[10/7]">{Visual && <Visual />}</div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
