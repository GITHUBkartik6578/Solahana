import React from 'react';

/**
 * Full-width hero banner image, aligned with the rest of the site.
 *
 * - The text drawn inside the picture starts at the same left edge as the navbar logo and the
 *   page sections (the 1320px container). Any spare room on the left is filled by a soft blurred
 *   copy of the picture (its left side is dark navy anyway).
 * - The hero height follows the viewport (clamped), so heading, text and buttons fit on one screen.
 * - The invisible click areas stay glued to the buttons drawn inside the picture.
 *
 * ratio    image width / height
 * fit      share of the image height (0-1, centred) that must stay visible: text + buttons
 * minH     smallest hero height in px
 * capped   true = the hero is never taller than the `fit` part of the picture (keeps tall pictures close to the other heroes' height)
 * hotspots [{ label, onClick, style }]  style = % box inside the image (left/top/width/height);
 *          the first hotspot's left edge is taken as the picture's text-left edge.
 */
const CONTAINER = 'calc(max(0px, (100cqw - 1320px) / 2) + 32px)'; // left edge of the site container
const CONTAINER_VW = 'calc(max(0px, (100vw - 1320px) / 2) + 32px)';

export default function HeroBanner({ src, alt, ratio, fit = 0.9, minH = 400, capped = false, hotspots = [] }) {
  const R = ratio.toFixed(4);
  const f = (parseFloat(hotspots[0]?.style?.left) || 4) / 100; // text-left as a share of the image width
  const k = (1 / ((1 - f) * ratio)).toFixed(4); // image height / (viewport width - container left)
  return (
    <section className="relative hidden bg-[#0A1836] pt-[80px] lg:block">
      <div
        className="relative mx-auto w-full max-w-[1920px] overflow-hidden [container-type:size]"
        // height = the screen's height, but never so short that the picture would have to shrink (that would leave
        // empty bands at the sides): the floor is the picture's own full-width height, cropped to the `fit` part
        style={{ height: capped ? `max(${minH}px, calc((100vw - ${CONTAINER_VW}) * ${k} * ${fit}))` : `max(${minH}px, calc((100vw - ${CONTAINER_VW}) * ${k} * ${fit}), min(calc(100svh - 80px), calc((100vw - ${CONTAINER_VW}) * ${k})))` }}
      >
        <img src={src} alt="" aria-hidden="true" draggable="false" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-90 blur-2xl" />
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            '--w': `min(calc((100cqw - ${CONTAINER}) / ${(1 - f).toFixed(4)}), calc(100cqh * ${R} / ${fit}))`,
            width: 'var(--w)',
            left: `calc(${CONTAINER} - var(--w) * ${f})`,
            aspectRatio: R,
          }}
        >
          {/* spare room on the right: the picture's last pixel column stretched sideways and softened, so it
              continues the scene smoothly and fades into the navy hero background (no seam, no duplicate objects) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-full top-0 h-full w-[100cqw] overflow-hidden blur-[18px] [mask-image:linear-gradient(to_right,black,black_30%,transparent_90%)]"
          >
            <div className="h-full w-px origin-left scale-x-[2400] overflow-hidden">
              <img src={src} alt="" draggable="false" className="h-full max-w-none" style={{ width: 'var(--w)', marginLeft: 'calc(1px - var(--w))' }} />
            </div>
          </div>
          <img
            src={src}
            alt={alt}
            draggable="false"
            className="relative block h-full w-full select-none [mask-image:linear-gradient(to_right,transparent,black_3%)]"
          />
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
