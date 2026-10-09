import React from 'react';

/**
 * Full-width hero banner image that always fits on screen: the hero height follows the
 * viewport (clamped), the picture is scaled so its important part (`fit` of the image
 * height, centred) fits that height, and any spare room at the sides is filled with a soft
 * blurred copy. The invisible click areas stay glued to the buttons drawn inside the picture.
 *
 * ratio    image width / height
 * fit      share of the image height (0-1, centred) that must stay visible: text + buttons
 * maxVw    tallest the hero may get, as a % of viewport width
 * minH     smallest hero height in px
 * hotspots [{ label, onClick, style }]  style = % box inside the image (left/top/width/height)
 */
export default function HeroBanner({ src, alt, ratio, fit = 0.9, maxVw, minH = 440, hotspots = [] }) {
  const R = ratio.toFixed(4);
  return (
    <section className="relative hidden bg-[#0A1836] pt-[80px] lg:block">
      <div
        className="relative mx-auto w-full max-w-[1920px] overflow-hidden [container-type:size]"
        style={{ height: `clamp(${minH}px, calc(100svh - 80px), ${maxVw}vw)` }}
      >
        <img src={src} alt="" aria-hidden="true" draggable="false" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-90 blur-2xl" />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: `min(calc(100cqh * ${R} / ${fit}), max(100cqw, calc(100cqh * ${R})))`, aspectRatio: R }}
        >
          <img src={src} alt={alt} draggable="false" className="block h-full w-full select-none [mask-image:linear-gradient(to_right,transparent,black_2.5%,black_97.5%,transparent)]" />
          {hotspots.map((h) => (
            <button
              key={h.label}
              type="button"
              onClick={h.onClick}
              aria-label={h.label}
              className="absolute cursor-pointer rounded-md"
              style={h.style}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
