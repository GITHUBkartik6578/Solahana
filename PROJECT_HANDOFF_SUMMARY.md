# SOLAHANA — PROJECT HANDOFF SUMMARY

Last updated: 2026-10-06 (footer now 543 px tall so it fits under the navbar on 1366x640). This file is the bridge between chats. Read it first, then `PROJECT_SUMMARY.md` (longer background), then inspect the code. If this file and the code disagree, trust the code and fix this file.

## Current Status

SOLAHANA is an India-focused, goal-based financial-planning website (marketing site + planning pages + calculators + consultation booking + lead capture + admin CRM).

- Home page = 7-slide hero carousel, "What we do" cards, Stage planning, Client stories, FAQ, dark navy/gold footer.
- Live frontend: https://solahana-self.vercel.app/ (Vercel). The live site has NO backend behind `/api/*` right now (POST `/api/health-check` returns 405), so forms that save data only work locally until the Render backend is deployed and `VITE_API_URL` is set.
- Everything below is committed and pushed. Working tree was clean at the last check.

## Current Task

None in progress. The last request was a footer height reduction; it is finished and pushed.

## Last Completed Work

1. Footer redesigned to the owner's reference image: dark navy + gold, five columns (brand, Our Planning Services, Who We Serve, Our Professional Network, About Solahana), "Important Information" strip, legal links, **Calculators button** added, big SOLAHANA "hologram" wordmark behind the content (gold -> light blue). The owner's own navy logo sits on a cream plate so it stays readable on dark. Height cut from 830 px to about 633 px at 1440 wide.
2. "What we do" cards (`TrustStrip.jsx`): 4 x 2, about 426 px tall, so the second row peeks in on scroll.
3. Hero: heading on two lines, smaller Get Started / health chip / trust badges, single grid layout.
4. Health check lead capture (name + mobile before the test, saved to MongoDB).
5. `PROJECT_SUMMARY.md` and this file created.

## Completed Features

- Home hero carousel (7 slides): slide 1 orbit wheel with clickable circles, rotating dashed line, shaking mascot; slides 2-7 from `PlanningSlides.jsx`.
- Planning hero pages with the same artwork and the owner's copy: Financial, Retirement (`/calculators/retirement`), Investment, Tax, Risk, Estate.
- Financial Planning page: coverage section (`PlanningCoverage.jsx`), planning guide (by another contributor).
- Calculators: SIP, EMI, Retirement, Goal, Lumpsum, FD, Inflation, **Human Life Calculator** (`/calculators/life`, client-side only, hides Save/Share).
- Health check: intro form -> 6 questions -> result; backend model `HealthCheckLead`.
- Generic `#hash` scrolling (`ScrollToTopAndSEO.jsx`), Estate slide pillars link to `/estate-planning#estate-solutions`.
- Auth, consultation booking, admin CRM, blogs, newsletter API (original project).

## Pending Features (verified against the code)

- Admin UI for health-check leads (API exists, no screen).
- Email / WhatsApp notification for new health-check leads (`server/services/emailService.js` exists, SMTP not configured).
- Debt Management and Emergency Planning pages (cards on the Financial Planning page are info-only).
- Policy pages (Privacy, Terms, Disclosures, Grievance); footer links currently go to the booking form.
- Newsletter sign-up is no longer in the footer (API still exists).
- Deploy backend (Render) with the latest code; set `VITE_API_URL` on Vercel and `CLIENT_URL` on Render.
- Admin user not created yet (`npm run create-admin`).

## Important Files

- `src/App.jsx` (routes, home composition)
- `src/components/Hero.jsx`, `PlanningSlides.jsx`, `TrustStrip.jsx`, `Footer.jsx`
- `src/components/planning/HealthCheck.jsx`, `PlanningHero.jsx`, `RetirementHero.jsx`; `investments/InvestmentsHero.jsx`, `tax/TaxHero.jsx`, `risk/RiskHero.jsx`, `estate/EstateHero.jsx`
- `src/components/calculators/LifeCalculator.jsx`, `CalculatorLayout.jsx`; `src/utils/lifeCalculator.js`
- `src/assets/hero-orbit.webp`, `hero-mascot.webp`, `slides/*.webp`, `services/*.webp`
- `src/index.css` (orbit and mascot animation keyframes)
- `src/services/healthCheckService.js`, `apiClient.js`
- `server/app.js`, `server/models/HealthCheckLead.js`, `server/controllers/healthCheckController.js`, `server/routes/healthCheckRoutes.js`, `server/validations/healthCheckValidation.js`
- `vite.config.js` (proxies `/api` to `localhost:5000`)

## APIs

- `POST /api/health-check` (public): `{ fullName, phone }` -> `{ id, token }`
- `PATCH /api/health-check/:id/complete` (public + token): `{ token, answers[] }` -> score/percent/verdict
- `GET /api/health-check` (admin): `?search=&status=&page=&limit=`
- Existing: `/api/auth`, `/api/consultations`, `/api/admin`, `/api/calculations`, `/api/blogs`, `/api/newsletter(s)`, `/api/users`, `/api/health`
- Public write endpoints (consultations, newsletter, health-check) share a rate limiter.

## UI Rules (mandatory)

- Do NOT change the Navbar.
- Keep the existing palette: navy `#0F1F45`, gold `#C9922E` (footer uses `#E2B24E` on dark), cream `#FEFDF9`, light blue. No new colours.
- Use the owner's copy exactly as pasted. Do not rewrite it.
- Keep text and images in one container so they align (planning heroes use `max-w-[1320px]` like the navbar).
- Use transparent/cream-matched artwork so no image box shows; avoid cut-off faces/objects and blurry images.
- Smallest clean change; reuse existing components; do not touch sections not mentioned.
- Owner writes Hinglish; reply short, point-wise, and say what was NOT verified.

## Responsive Verification

Check every UI change in the browser at **1366, 1440, 1920 and 390 px** wide: alignment, width/height, spacing, overflow (`scrollWidth == innerWidth`), text wrapping, buttons, cards, images, mobile stacking. Preview: `npm run dev -- --port 5180 --strictPort` (or the `frontend` entry in `.claude/launch.json`). The preview tab often closes between tasks; restart it with `preview_start`.

## Git State

- Current branch: `main`
- Latest commit: see `git log -1` (home now uses LifeStagesSection instead of StagePlanningSection)
- Uncommitted changes: none before this file was added (this file and any later edits are uncommitted until the owner says "push")
- Last push: `451d6d1` to https://github.com/GITHUBkartik6578/Solahana
- Rules: never push unless the owner says "push kardo"; run `git fetch` and check `HEAD..origin/main` first (another contributor, `mohammed-hanzala`, also pushes). Commit trailer: `Co-Authored-By: Claude ... <noreply@anthropic.com>`. `.env` is git-ignored.

## Known Issues

- Live (Vercel) site has no backend: health-check and other API features fail there until Render is set up.
- Footer is dark navy while the rest of the site is light; this is intentional (owner's request).
- Footer wordmark overlaps the "Important Information" text; it is kept faint so text stays readable.
- The dev preview server stops between tasks; restart it before testing.
- Large Bash heredocs containing quotes sometimes fail to parse on this machine; use the Write tool for big files.
- Footer legal links all go to the booking form (no policy pages).

## Next Action

Wait for the owner's next UI request. When it comes: find the controlling component, make the smallest change, verify at the four widths, report briefly in Hinglish, and update this file after significant work. Do not push without being told.

## CONTINUE FROM HERE

State: all work is pushed up to `451d6d1`, the dev app runs on port 5180 (frontend) and 5000 (backend, `npm run server`, MongoDB service on localhost:27017). No task is half-done. The likely next topics are deploying the backend for the live site, an admin screen for health-check leads, and policy/debt/emergency pages, but only start them if the owner asks. Read `PROJECT_SUMMARY.md` for the code map and background.
