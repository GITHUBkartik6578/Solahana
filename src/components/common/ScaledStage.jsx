import React, { useLayoutEffect, useRef, useState } from 'react';

/**
 * Keeps a hero looking the same at every zoom level (like a banner picture does): its content is laid out once, at `designWidth`,
 * and the whole thing is scaled down to the width it is given when that is narrower than `designWidth`. Zooming in only makes the page
 * narrower, so the hero shrinks with it instead of switching to a different layout. At `designWidth` and wider it is not scaled at all,
 * so it looks exactly like the normal fluid layout. Below `minWidth` (phones) nothing is scaled and the content
 * keeps its normal responsive layout. Any mouse / trackpad (even on a touch laptop) is never treated as a phone, so zooming a desktop browser to any level keeps the scaled layout.
 *
 * The content is wrapped in a CSS container, so inside it use container variants (`@2xl:`, `@5xl:`) instead of `sm:` / `lg:`.
 */
export default function ScaledStage({ designWidth = 1440, minWidth = 640, className = '', children }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const [view, setView] = useState({ scale: 1, height: null });

  useLayoutEffect(() => {
    const el = outer.current;
    const content = inner.current;
    if (!el || !content) return undefined;
    const measure = () => {
      const width = el.clientWidth;
      const finePointer = typeof window !== 'undefined' && window.matchMedia?.('(any-pointer: fine)').matches;
      // Phones, and any page at least as wide as the design width, use the normal fluid layout (so wide screens look the
      // same as the rest of the site); only widths between minWidth and designWidth are scaled down.
      if ((width < minWidth && !finePointer) || width >= designWidth) {
        setView((v) => (v.height === null ? v : { scale: 1, height: null }));
        return;
      }
      const scale = width / designWidth;
      const height = content.offsetHeight * scale;
      setView((v) => (v.scale === scale && v.height === height ? v : { scale, height }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(content);
    return () => ro.disconnect();
  }, [designWidth, minWidth]);

  const scaled = view.height !== null;
  return (
    <div ref={outer} className="w-full" style={scaled ? { height: view.height, overflow: 'hidden' } : undefined}>
      <div
        ref={inner}
        className={`@container/stage ${className}`}
        style={scaled ? { width: designWidth, transform: `scale(${view.scale})`, transformOrigin: 'top left' } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Same idea for real HTML laid over a picture: it is laid out at `designWidth` and scaled to the width of the picture, so it stays
 * in the same place on the picture at every zoom level. Fills its (positioned) parent.
 */
export function ScaledOverlay({ designWidth = 1440, className = '', children }) {
  const outer = useRef(null);
  const [view, setView] = useState({ scale: 1, height: null });

  useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return undefined;
    const measure = () => {
      const scale = el.clientWidth / designWidth;
      const height = el.clientHeight / scale;
      setView((v) => (v.scale === scale && v.height === height ? v : { scale, height }));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div ref={outer} className={`absolute inset-0 ${className}`}>
      {view.height !== null && (
        <div style={{ width: designWidth, height: view.height, transform: `scale(${view.scale})`, transformOrigin: 'top left' }}>{children}</div>
      )}
    </div>
  );
}
