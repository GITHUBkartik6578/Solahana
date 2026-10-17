import React from 'react';
import { ScaledOverlay } from './ScaledStage';

/**
 * Full-width hero banner picture, shown the way a banner is on any good website: the whole picture is scaled to the page width, so
 * it looks the same at every zoom level (zooming in only makes the page narrower, the banner shrinks with it). Nothing is cropped,
 * stretched out of ratio, blurred or filled in around the picture.
 *
 * Phones (touch screens narrower than 640px) get the live-text hero instead, so the copy stays readable there.
 *
 * ratio    image width / height
 * overlay  optional real HTML shown over the picture (e.g. a side panel). It is laid out for a 1440px-wide banner and scaled with
 *          the picture, so it stays in the same place on it.
 * hotspots [{ label, onClick, style }]  invisible click areas glued to the buttons drawn inside the picture;
 *          style = % box inside the image (left/top/width/height).
 */
export default function HeroBanner({ src, alt, ratio, overlay = null, hotspots = [] }) {
  return (
    <section className="relative hidden bg-[#0A1836] pt-[80px] sm:block any-pointer-fine:block">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: ratio.toFixed(4) }}>
        <img src={src} alt={alt} draggable="false" className="block h-full w-full select-none" />
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
        {overlay && (
          <ScaledOverlay className="pointer-events-none z-20">
            <div className="relative mx-auto h-full max-w-[1320px] px-8">{overlay}</div>
          </ScaledOverlay>
        )}
      </div>
    </section>
  );
}
