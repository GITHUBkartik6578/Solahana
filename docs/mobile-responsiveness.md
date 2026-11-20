# Mobile responsiveness improvements

Phone-only polish across the site. **Desktop is unchanged:** every change is either gated to small screens (`sm:` for the viewport, `@2xl:` / `@3xl:` for the container-query layouts) or is invisible (a larger tap area around a control that keeps its look).

## What changed

| Area | Phone before | Phone after | How desktop is kept |
|---|---|---|---|
| Footer links (every page) | 22px tall, 13.5px text | about 35px tall, 14px text | `@2xl:py-0 @2xl:text-[13.5px]` |
| Footer small text | 9px tagline, 11px sub-lines and network note | 10.5px, 12px and 12.5px | `@2xl:` restores 9px / 11px |
| Footer legal links | covered by the floating chat button | extra bottom space below the legal row; each link is 2× taller | `@3xl:pb-2.5 @3xl:py-0` |
| `/financial-planning` wealth-map orbit | nodes 1px past the screen edge (sideways scroll) | nodes inside the screen | node width 88px on phones; `sm:w-[110px]` unchanged |
| Carousel dots (Home hero, Invest Solutions, Client Stories, Retirement Guide) | 8px tap target | same 8px dot, about 32px invisible tap area | pseudo-element only; nothing visible changes |
| Our Process picture labels | 9px minimum | 10.5px minimum | `max(10.5px, 2.5cqw)`: desktop widths already pick the larger cqw value |
| Home "Life Stages" text | 10.5px | 12px | `sm:text-[10.5px]` |
| Calculators "Back to All Calculators" | 16px tall | 44px tall, 13px text | `sm:min-h-0 sm:text-xs` |
| Calculator Reset / Save / share buttons (SIP and the other calculator pages, Retirement, Investments, Risk) | 34px tall | 40px tall | `sm:min-h-0` (and `sm:min-w-0`) |
| Login password-visibility button | 16 × 16px | 32 × 32px; the icon stays in the same place | `right-2 p-2` instead of `right-4` |
| `/calculators/life` browser title | generic site title | "Life Cover (HLV) Calculator — SOLAHANA" | not layout |

No logic, data, props, handlers, routes or API calls changed (only `className` / `style` values, plus one entry in the page-title table). The Navbar is not touched.

## How it was verified

- **Overflow audit:** 35 public routes at 375px and 14 key routes at 390px (touch emulation, i.e. the real phone layout). No page scrolls sideways.
- **Desktop regression check at 1366px:** eight pages were measured on an untouched copy of `main` and on this branch: page height, every footer button's position and size, footer text sizes, the carousel dots, the orbit nodes, the Back button and the password icon. They match exactly.
- **Tests:** `npx vitest run`, 1396 tests (1394 pass, 2 todo), on top of the main branch that already has the Financial Health Check-up and its contact screen.
- **Lint:** `npx oxlint`, 0 errors and no new warnings (242, all pre-existing).
- **Build:** `npx vite build` succeeds.
- **Screenshots** at 375px and 390px: Home, Financial Planning orbit, footer, SIP calculator, Login.

## Left as is (by choice)

- Small uppercase "eyebrow" labels (10px, mono) in the calculators and the Kundli. They are part of the design and readable on phones.
- Filter chips on `/calculators` and `/blogs` (32–34px) and the phone-number links on About. They work; they could be enlarged in a follow-up.
