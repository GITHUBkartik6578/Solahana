import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import mascotImage from '../../assets/solahana-mascot.png';

/**
 * Frameless hero scene shared by every homepage carousel slide:
 * soft glow + ground line + the SOLAHANA mascot on the left (presenting with its open hand)
 * + floating chips. Each slide passes its own right-side "prop" as children.
 *
 * chips: [{ label, sub, icon, pos, delay, drift }]
 *   pos  -> Tailwind position classes (can include sm: overrides)
 */
export default function MascotScene({ alt, chips = [], children }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full h-full select-none">
      {/* Warm glow so the scene melts into the hero background (no frame) */}
      <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(26,49,112,0.07)_0%,rgba(250,246,238,0)_68%)] pointer-events-none" />

      {/* Ground line the whole scene stands on */}
      <div className="absolute left-[6%] right-[2%] bottom-[14%] h-px bg-gradient-to-r from-transparent via-[#2F5BC7]/25 to-transparent" />

      {/* Slide-specific prop (right side) */}
      {typeof children === 'function' ? children(reduce) : children}

      {/* Mascot presenting the scene with its open hand */}
      <motion.div
        initial={reduce ? false : { opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute left-[0%] bottom-[12%] w-[54%]"
      >
        <img
          src={mascotImage}
          alt={alt}
          width={640}
          height={614}
          draggable={false}
          className={`w-full h-auto drop-shadow-[0_22px_30px_rgba(11,27,63,0.18)] ${reduce ? '' : 'animate-float'}`}
        />
      </motion.div>

      {/* Floating glass chips */}
      {chips.map((c) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, c.drift ?? -5, 0] }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    opacity: { delay: c.delay ?? 1.2, duration: 0.5 },
                    y: { delay: c.delay ?? 1.2, duration: 5, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            className={`absolute ${c.pos} z-20 flex items-center gap-2 sm:gap-2.5 pl-1.5 sm:pl-2 pr-3 sm:pr-3.5 py-1.5 sm:py-2 rounded-2xl bg-white border border-[#E4E8F0] shadow-[0_8px_24px_rgba(11,27,63,0.08)]`}
          >
            <span className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#EEF2FB] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#2F5BC7]" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] sm:text-[13px] font-bold text-[#0F1F45] font-sora whitespace-nowrap">{c.label}</span>
              <span className="hidden sm:block text-[11px] text-[#64748B] font-inter whitespace-nowrap">{c.sub}</span>
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
