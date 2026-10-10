import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye } from 'lucide-react';

import missionScene from '../../assets/about-mission-scene.webp';
import visionScene from '../../assets/about-vision-scene.webp';

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const CARDS = [
  {
    key: 'mission',
    title: 'Our Mission',
    icon: Target,
    scene: missionScene,
    sceneAlt: 'Sunlit mountain range',
    text: '“To engineer absolute financial clarity and multi-generational prosperity for families by providing objective, zero-bias strategic guidance, completely free from the pressures of product-pushing and corporate sales quotas.”',
    tint: 'from-[#FFFBF6] via-[#FEFBF7] to-[#FBF3EA]',
  },
  {
    key: 'vision',
    title: 'Our Vision',
    icon: Eye,
    scene: visionScene,
    sceneAlt: 'City skyline at sunset',
    text: '“To set the gold standard in independent Family Office architecture, where every client relationship is anchored on uncompromising integrity, institutional rigor, and long-term fiduciary dedication.”',
    tint: 'from-[#EEF4FF] via-[#F8F4EE] to-[#FCEBDD]',
  },
];

export default function AboutMissionVision() {
  return (
    <section className="relative overflow-hidden bg-white py-6 sm:py-7" aria-label="Our mission and vision">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.article
                key={c.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className={`relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl border border-[#E7E2D6] bg-gradient-to-br ${c.tint} shadow-[0_14px_36px_rgba(15,31,69,0.10)] sm:min-h-[370px]`}
              >
                <div className="relative z-10 flex gap-5 p-6 sm:gap-6 sm:p-8">
                  <span className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full bg-[#0F1F45] text-[#E2B24E] ring-[3px] ring-[#C9922E] shadow-[0_8px_20px_rgba(15,31,69,0.25)] sm:h-[88px] sm:w-[88px]">
                    <Icon className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={1.7} />
                  </span>
                  <span aria-hidden="true" className="hidden w-px shrink-0 bg-[#C9922E]/60 sm:block" />
                  <div className="min-w-0">
                    <h2 style={serif} className="text-[32px] font-semibold leading-tight text-[#0F1F45] sm:text-[38px]">
                      {c.title}
                    </h2>
                    <p className="[text-wrap:pretty] mt-2 text-[15px] leading-relaxed text-[#1E293B] sm:text-[16.5px]">{c.text}</p>
                  </div>
                </div>

                <img
                  src={c.scene}
                  alt={c.sceneAlt}
                  loading="lazy"
                  draggable="false"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent,black_30%)]"
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
