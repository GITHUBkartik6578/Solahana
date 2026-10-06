import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

import w18 from '../assets/walker/age-18.webp';
import w24 from '../assets/walker/age-24.webp';
import w30 from '../assets/walker/age-30.webp';
import w38 from '../assets/walker/age-38.webp';
import w45 from '../assets/walker/age-45.webp';
import w53 from '../assets/walker/age-53.webp';
import w60 from '../assets/walker/age-60.webp';
import w68 from '../assets/walker/age-68.webp';

// One portrait per stage (all 300 px tall). hip / split = where the legs are cut (fractions of the image),
// so the two legs can lift in turn while he walks.
const FIGURES = [
  { src: w18, w: 106, hip: 0.57, split: 0.547 },
  { src: w24, w: 98, hip: 0.54, split: 0.546 },
  { src: w30, w: 107, hip: 0.59, split: 0.523 },
  { src: w38, w: 97, hip: 0.59, split: 0.562 },
  { src: w45, w: 117, hip: 0.6, split: 0.577 },
  { src: w53, w: 100, hip: 0.57, split: 0.535 },
  { src: w60, w: 98, hip: 0.58, split: 0.536, old: 0.8 },
  { src: w68, w: 83, hip: 0.79, split: 0.482, old: 0.6 },
];

const FIG_H = 118; // walker height on screen (px)
const LANE = FIG_H + 22; // free space between a card's bottom and the ground under it
const K = 1.1;
const EK = Math.exp(K) - 1;
const curve = (u) => (Math.exp(K * u) - 1) / EK;
const ribbonW = (u) => 3 + 44 * Math.pow(Math.min(1, Math.max(0, u)), 1.35);

const WALK_SPEED = 0.42; // stages per second
const JUMP_SPEED = 1.8;
const INTRO_WAIT = 0.8;
const CARD_WAIT = 1.4;
const END_WAIT = 3;
const STRIDE = 30; // px walked per step, drives the bob
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const r2 = (n) => Math.round(n * 100) / 100;

/**
 * A person who walks along the ribbon under the life-stage cards (desktop staircase only).
 * stages: [{ from, to, open }] ; wrapRef: positioned box that holds the grid ; gridRef: the card grid.
 */
export default function LifeJourneyWalker({ stages, wrapRef, gridRef }) {
  const N = stages.length;
  const [geo, setGeo] = useState(null);
  const [playing, setPlaying] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const geoRef = useRef(null);
  const walkerRef = useRef(null);
  const bobRef = useRef(null);
  const figRefs = useRef([]);
  const tagRef = useRef(null);
  const tagNumRef = useRef(null);
  const trailRectRef = useRef(null);
  const dotRefs = useRef([]);
  const state = useRef(null);

  // ---------- geometry from the real card positions ----------
  useEffect(() => {
    const wrap = wrapRef.current;
    const grid = gridRef.current;
    if (!wrap || !grid) return undefined;

    const compute = () => {
      const cards = Array.from(grid.children).slice(0, N);
      if (cards.length < N) return;
      const gx = grid.offsetLeft;
      const gy = grid.offsetTop;
      const boxes = cards.map((c) => ({
        l: gx + c.offsetLeft,
        r: gx + c.offsetLeft + c.offsetWidth,
        b: gy + c.offsetTop + c.offsetHeight,
      }));
      const W = wrap.clientWidth;
      const rise = Math.max(60, boxes[0].b - boxes[N - 1].b + 30);
      let G0 = -Infinity;
      boxes.forEach((bx) => { G0 = Math.max(G0, bx.b + LANE + rise * curve(bx.r / W)); });
      const groundY = (x) => G0 - rise * curve(x / W);

      // make room under the cards for the lane and the ribbon
      const H = Math.ceil(Math.max(G0 + ribbonW(0), groundY(W) + ribbonW(1)) + 26);
      const cur = parseFloat(grid.style.paddingBottom) || 0;
      const content = grid.offsetHeight - cur;
      const pad = Math.max(0, Math.ceil(H - gy - content));
      if (Math.abs(pad - cur) > 1) grid.style.paddingBottom = `${pad}px`;

      const top = [];
      const bot = [];
      for (let x = 0; x <= W; x += 10) {
        top.push([x, groundY(x)]);
        bot.push([x, groundY(x) + ribbonW(x / W)]);
      }
      top.push([W, groundY(W)]);
      bot.push([W, groundY(W) + ribbonW(1)]);
      const pts = (arr) => arr.map((p) => `${r2(p[0])} ${r2(p[1])}`).join('L');
      const edge = `M${pts(top)}`;
      const shape = `${edge}L${pts(bot.reverse())}Z`;

      const bounds = [boxes[0].l];
      for (let i = 1; i < N; i++) bounds.push((boxes[i - 1].r + boxes[i].l) / 2);
      bounds.push(boxes[N - 1].r);

      const g = {
        W,
        H,
        edge,
        shape,
        bounds,
        groundY,
        dots: boxes.map((bx) => {
          const x = (bx.l + bx.r) / 2;
          return { x, y: groundY(x) };
        }),
      };
      geoRef.current = g;
      setGeo((prev) => (prev && prev.W === g.W && prev.H === g.H && prev.edge === g.edge ? prev : g));
    };

    compute();
    const ro = new ResizeObserver(() => compute());
    ro.observe(wrap);
    Array.from(grid.children).forEach((c) => ro.observe(c));
    return () => {
      ro.disconnect();
      grid.style.paddingBottom = '';
    };
  }, [N, wrapRef, gridRef]);

  // ---------- the walk loop ----------
  useEffect(() => {
    const wrap = wrapRef.current;
    const grid = gridRef.current;
    if (!wrap || !grid) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const s = {
      J: reduce ? 0.5 : 0,
      target: reduce ? 0.5 : 0,
      vmax: WALK_SPEED,
      mode: reduce ? 'paused' : 'intro',
      t: INTRO_WAIT,
      idx: 0,
      energy: 0,
      phi: 0,
      stage: -1,
      fig: -1,
      shown: '',
      playing: !reduce,
      visible: false,
      hover: false,
      last: 0,
    };
    state.current = s;

    const links = Array.from(grid.children).slice(0, N).map((c) => c.querySelector('a'));

    const xOf = (J) => {
      const g = geoRef.current;
      const i = Math.min(N - 1, Math.floor(J));
      const t = J - i;
      return g.bounds[i] + t * (g.bounds[i + 1] - g.bounds[i]);
    };

    const setFaded = (on) => {
      if (walkerRef.current) walkerRef.current.style.opacity = on ? '0' : '1';
    };

    const autoStep = (dt) => {
      if (!s.playing || s.hover) return;
      if (s.mode === 'intro') {
        s.t -= dt;
        if (s.t <= 0) s.mode = 'walk';
      } else if (s.mode === 'walk') {
        s.target = s.idx + 0.5;
        s.vmax = WALK_SPEED;
        if (Math.abs(s.J - s.target) < 0.002) {
          s.mode = 'wait';
          s.t = s.idx >= N - 1 ? END_WAIT : CARD_WAIT;
        }
      } else if (s.mode === 'wait') {
        s.t -= dt;
        if (s.t <= 0) {
          if (s.idx >= N - 1) {
            s.mode = 'fade';
            s.t = 0.5;
            setFaded(true);
          } else {
            s.idx += 1;
            s.mode = 'walk';
          }
        }
      } else if (s.mode === 'fade') {
        s.t -= dt;
        if (s.t <= 0) {
          s.J = 0;
          s.target = 0;
          s.energy = 0;
          s.idx = 0;
          s.mode = 'appear';
          s.t = 0.9;
        }
      } else if (s.mode === 'appear') {
        s.t -= dt;
        if (s.t <= 0.5) setFaded(false);
        if (s.t <= 0) s.mode = 'walk';
      }
    };

    const render = () => {
      const g = geoRef.current;
      if (!g || !walkerRef.current) return;
      const J = clamp(s.J, 0, N);
      const i = Math.min(N - 1, Math.floor(J));
      const t = J - i;
      const st = stages[i];
      const shown = st.open ? `${st.from}+` : String(Math.min(st.to, Math.floor(st.from + t * (st.to - st.from + 1))));
      const X = xOf(J);
      const Y = g.groundY(X);

      // stage change: highlight the card and the passed milestones, swap the portrait
      if (i !== s.stage) {
        s.stage = i;
        links.forEach((a, k) => a && a.setAttribute('data-active', k === i ? 'true' : 'false'));
        dotRefs.current.forEach((d, k) => d && d.setAttribute('data-passed', k <= i ? 'true' : 'false'));
      }
      if (i !== s.fig) {
        s.fig = i;
        figRefs.current.forEach((f, k) => { if (f) f.box.style.opacity = k === i ? '1' : '0'; });
      }

      const e = s.energy;
      const sp = Math.sin(s.phi);
      const f = figRefs.current[i];
      const old = FIGURES[i].old || 1;
      const lift = FIG_H * 0.05 * e * old;
      if (f) {
        f.legL.style.transform = `translateY(${(-Math.max(0, sp) * lift).toFixed(2)}px)`;
        f.legR.style.transform = `translateY(${(-Math.max(0, -sp) * lift).toFixed(2)}px)`;
      }
      const bob = -2.2 * Math.abs(sp) * e;
      const rock = 1.1 * sp * e;
      walkerRef.current.style.transform = `translate3d(${r2(X)}px, ${r2(Y + 2)}px, 0)`;
      bobRef.current.style.transform = `translateY(${bob.toFixed(2)}px) rotate(${rock.toFixed(2)}deg)`;
      if (trailRectRef.current) trailRectRef.current.setAttribute('width', String(r2(X)));
      if (shown !== s.shown) {
        s.shown = shown;
        if (tagNumRef.current) tagNumRef.current.textContent = shown;
      }
    };

    let raf = 0;
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0);
      s.last = now;
      if (!s.visible || !geoRef.current) return;
      autoStep(dt);
      const d = s.target - s.J;
      let moving = false;
      if (Math.abs(d) > 0.0005) {
        const speed = s.vmax * clamp(Math.abs(d) / 0.22, 0.3, 1);
        const step = Math.sign(d) * Math.min(Math.abs(d), speed * dt);
        const x0 = xOf(clamp(s.J, 0, N));
        s.J += step;
        const x1 = xOf(clamp(s.J, 0, N));
        s.phi += (Math.abs(x1 - x0) / STRIDE) * Math.PI;
        moving = true;
      } else {
        s.J = s.target;
      }
      s.energy += ((moving ? 1 : 0) - s.energy) * Math.min(1, dt * 9);
      if (!moving && s.energy < 0.02) s.phi = 0;
      render();
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      s.last = 0;
    }, { threshold: 0.15 });
    io.observe(wrap);

    // hovering a card sends him there; leaving lets the auto walk carry on from that card
    const cards = Array.from(grid.children).slice(0, N);
    const enters = cards.map((c, k) => () => {
      if (s.mode === 'fade' || s.mode === 'appear') setFaded(false);
      s.hover = true;
      s.target = k + 0.5;
      s.vmax = JUMP_SPEED;
    });
    const leave = () => {
      s.hover = false;
      s.idx = clamp(Math.round(s.target - 0.5), 0, N - 1);
      s.mode = 'wait';
      s.t = CARD_WAIT;
      if (!s.playing) s.target = s.J;
    };
    cards.forEach((c, k) => {
      c.addEventListener('pointerenter', enters[k]);
      c.addEventListener('pointerleave', leave);
    });

    // first paint once geometry exists
    const first = setTimeout(render, 50);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(first);
      io.disconnect();
      cards.forEach((c, k) => {
        c.removeEventListener('pointerenter', enters[k]);
        c.removeEventListener('pointerleave', leave);
      });
      links.forEach((a) => a && a.removeAttribute('data-active'));
    };
  }, [N, stages, wrapRef, gridRef]);

  const togglePlay = () => {
    const s = state.current;
    if (!s) return;
    const on = !s.playing;
    s.playing = on;
    if (on) {
      if (s.mode === 'paused' || s.mode === 'intro') s.mode = 'walk';
      s.idx = clamp(Math.ceil(s.J - 0.5 - 0.01), 0, N - 1);
      if (s.mode !== 'fade' && s.mode !== 'appear') s.mode = 'walk';
    } else {
      if (s.mode === 'fade' || s.mode === 'appear') {
        if (walkerRef.current) walkerRef.current.style.opacity = '1';
        s.J = 0;
      }
      s.mode = 'paused';
      s.target = s.J;
    }
    setPlaying(on);
  };

  return (
    <>
      {geo && (
        <svg
          className="pointer-events-none absolute left-0 top-0"
          width={geo.W}
          height={geo.H}
          viewBox={`0 0 ${geo.W} ${geo.H}`}
          fill="none"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="life-trail-clip">
              <rect ref={trailRectRef} x="0" y="0" width="0" height={geo.H} />
            </clipPath>
            <linearGradient id="life-ribbon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#1A3170" stopOpacity="0.85" />
              <stop offset="1" stopColor="#0F1F45" />
            </linearGradient>
          </defs>
          <path d={geo.shape} fill="url(#life-ribbon)" />
          <path d={geo.edge} stroke="#C9922E" strokeOpacity="0.55" strokeWidth="2" />
          <path
            d={geo.edge}
            stroke="#E2B24E"
            strokeWidth="3.5"
            strokeLinecap="round"
            clipPath="url(#life-trail-clip)"
            style={{ filter: 'drop-shadow(0 0 4px rgba(226,178,78,0.7))' }}
          />
          {geo.dots.map((d, k) => (
            <circle
              key={k}
              ref={(el) => { dotRefs.current[k] = el; }}
              cx={r2(d.x)}
              cy={r2(d.y)}
              r="5"
              data-passed="false"
              className="fill-white stroke-[#C9922E] transition-colors duration-500 data-[passed=true]:fill-[#E2B24E]"
              strokeWidth="2"
            />
          ))}
        </svg>
      )}

      {/* the walker */}
      <div
        ref={walkerRef}
        className="pointer-events-none absolute left-0 top-0 z-10 transition-opacity duration-500 will-change-transform"
        style={{ opacity: geo ? 1 : 0 }}
        aria-hidden="true"
      >
        {/* soft shadow at his feet */}
        <span className="absolute left-0 top-0 h-2.5 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0F1F45]/30 blur-[3px]" />
        <div ref={bobRef} className="absolute left-0 top-0 origin-bottom" style={{ height: 0 }}>
          {FIGURES.map((f, k) => {
            const w = (FIG_H * f.w) / 300;
            const legTop = `${((f.hip - 0.04) * 100).toFixed(1)}%`;
            return (
              <div
                key={k}
                ref={(el) => {
                  if (!el) return;
                  const [legL, legR] = el.querySelectorAll('img');
                  figRefs.current[k] = { box: el, legL, legR };
                }}
                className="absolute bottom-0 transition-opacity duration-500"
                style={{ width: w, height: FIG_H, left: -w / 2, opacity: k === 0 ? 1 : 0 }}
              >
                <img src={f.src} alt="" draggable="false" className="absolute inset-0 h-full w-full" style={{ clipPath: `inset(${legTop} ${((1 - f.split) * 100).toFixed(1)}% 0 0)` }} />
                <img src={f.src} alt="" draggable="false" className="absolute inset-0 h-full w-full" style={{ clipPath: `inset(${legTop} 0 0 ${(f.split * 100).toFixed(1)}%)` }} />
                <img src={f.src} alt="" draggable="false" className="absolute inset-0 h-full w-full" style={{ clipPath: `inset(0 0 ${((1 - f.hip - 0.01) * 100).toFixed(1)}% 0)` }} />
              </div>
            );
          })}
        </div>

        {/* age tag beside his head */}
        <div
          ref={tagRef}
          className="absolute left-[34px] flex items-baseline gap-1 whitespace-nowrap rounded-full bg-[#0F1F45] px-2.5 py-1 shadow-[0_6px_14px_rgba(15,31,69,0.3)] ring-1 ring-[#C9922E]"
          style={{ top: -FIG_H + 2 }}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#E2B24E]">Age</span>
          <span ref={tagNumRef} className="font-sora text-[14px] font-bold leading-none text-white tabular-nums">
            {stages[0].from}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? 'Pause the walk' : 'Play the walk'}
        className="absolute bottom-1 right-0 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#C9922E]/60 bg-white text-[#0F1F45] shadow-md transition-colors hover:bg-[#FBF3E1]"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
    </>
  );
}
