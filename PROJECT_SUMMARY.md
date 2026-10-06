# SOLAHANA: project summary (for a new chat / new developer)

Read this first. It explains what the project is, how to run it, how the code is organised, what was changed recently, and the working rules the owner expects.

---

## 1. What this is

SOLAHANA is a goal-based financial-planning website (India). Marketing site + calculators + consultation booking + admin CRM.

- **Frontend:** React 19, Vite, Tailwind CSS 4, Framer Motion, React Router 7, Recharts, lucide-react icons.
- **Backend:** Node + Express 5, MongoDB (Mongoose), Zod validation, JWT auth (cookie/Bearer), Helmet, CORS, rate limits.
- **Repo:** https://github.com/GITHUBkartik6578/Solahana (branch `main`). The project folder is `Solahana-main/` (git root is that folder, not its parent).
- **Other contributor:** `mohammed-hanzala` also pushes to `main` (planning guide pages, navbar). Always `git fetch` and check `HEAD..origin/main` before pushing.

## 2. Run it locally

```bash
cd Solahana-main
npm install
npm run dev        # frontend (Vite). The preview in this project uses port 5180:
                   #   npm run dev -- --port 5180 --strictPort
npm run server     # backend on http://localhost:5000  (needs .env)
npm run build      # production build check
npx oxlint src     # lint
```

- `.env` (git-ignored) needs at least: `PORT=5000`, `NODE_ENV=development`, `CLIENT_URL=http://localhost:5173` (add `http://localhost:5180` if you call the API directly), `MONGODB_URI=mongodb://localhost:27017/solahana`, `JWT_SECRET=<long random>`. Copy `.env.example` for the rest.
- A MongoDB 8.x Windows service is installed on this machine and runs on `localhost:27017`.
- Vite proxies `/api` to `localhost:5000` (`vite.config.js`), so the frontend works on any port.
- `.claude/launch.json` (repo parent) defines a preview server named `frontend` on **port 5180**. Ports 5173/5174 were taken by other copies of the project on the owner's machine.
- Admin user: `npm run create-admin` (reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` from `.env`). Not created yet.
- Windows machine, PowerShell and Git Bash both available. Large Bash heredocs containing quotes sometimes fail to parse; write big files with the Write tool.

## 3. Code map

```
src/
  App.jsx                      routes + HomePage composition
  components/
    Navbar.jsx                   (do not change layout; see rules)
    Hero.jsx                     home hero carousel (7 slides, 4.5 s autoplay)
    PlanningSlides.jsx           slides 2-7 data + PlanningSlide + SceneArt (also reused on planning pages)
    TrustStrip.jsx               "What we do" 8 service cards
    StagePlanningSection.jsx / ClientStories.jsx / FAQSection.jsx   rest of the home page
    Footer.jsx                   5-column footer with background SOLAHANA wordmark
    planning/                    Financial/Retirement planning pages (PlanningHero, HealthCheck, PlanningGuide, ...)
    investments/ tax/ risk/ estate/   each has its own *Hero.jsx
    calculators/                 SIP, EMI, Retirement, Goal, Lumpsum, FD, Inflation, LifeCalculator (+ CalculatorLayout)
  assets/
    hero-orbit.webp, hero-mascot.webp   home hero artwork (cropped 710x782 wheel + cut-out mascot)
    slides/*.webp                hero-carousel artwork (transparent backgrounds)
    services/*.webp              8 service-card illustrations
  services/                    axios wrappers (apiClient, consultation, newsletter, calculation, healthCheck, ...)
  utils/lifeCalculator.js        pure date maths for the Life Calculator
server/
  app.js, server.js
  models/ controllers/ routes/ validations/ middleware/
    Consultation, User, SavedCalculation, Blog, Newsletter, HealthCheckLead
```

Routes worth knowing: `/` home, `/financial-planning`, `/goals`, `/investments`, `/tax-planning`, `/risk-management`, `/estate-planning`, `/calculators`, `/calculators/{sip,emi,retirement,goal-planner,lumpsum,fd,inflation,life}`, `/our-process`, `/who-we-serve`, `/blogs`, `/about` (`/contact` redirects to `/about#book`), `/dashboard`, `/admin`.

API: `/api/auth`, `/api/consultations`, `/api/admin`, `/api/calculations`, `/api/blogs`, `/api/newsletter(s)`, `/api/users`, `/api/health`, and the new `/api/health-check` (see 5).

## 4. Home page: current state

Order: Hero carousel -> TrustStrip ("What we do") -> StagePlanningSection -> ClientStories -> FAQSection. (WhatIsFinancialPlanning and SolahanaServices were removed from the home page on request; the component files still exist.)

**Hero (`Hero.jsx`)**
- Slide 1 (`MainSlide`): ONE container, one 2-column grid. Left: heading "Your Money Deserves a Plan. / Not Just an Investment." (Playfair Display, navy + gold), "Get Started" button (-> `/contact`), small "Check your financial health now" chip (scrolls to `#health-check`), three small trust badges. Right: orbit artwork with six planning circles (clickable hotspots), SVG dashed orbit line that slowly rotates (`.orbit-flow`), mascot layer with a gentle shake (`.mascot-shake`). Keyframes live in `src/index.css`.
- Slides 2-7 come from `PlanningSlides.jsx` (`slides` array): Financial, Investment, Retirement, Risk, Tax, Estate. Each has copy + artwork; Investment/Tax use `SceneArt` with cream clickable circles; Estate has a six-icon pillar row.
- Dots below the hero are plain (no pill background). Autoplay pauses on hover.

**Service cards (`TrustStrip.jsx`)**: 4 x 2 grid, label "What we do", heading "Everything Your Wealth Needs. One Clear Plan." Cards are ~426 px tall (230 px artwork area) so the second row peeks in when scrolling. Artwork = blurred backdrop + masked foreground so any size looks seamless.

## 5. Features added in this engagement

- **Home hero carousel + planning hero pages:** Financial, Retirement, Investment, Tax, Risk and Estate page heroes reuse the same artwork as the carousel slides, with a big page title (h1), a smaller tagline (h2) and the owner's own copy. Container is `max-w-[1320px]` to align with the navbar.
- **Financial Planning page:** extra section "Eight areas, one connected plan" (`planning/PlanningCoverage.jsx`); "A clear route" section aligned (`planning/PlanningGuide.jsx`, written by the other contributor).
- **Human Life Calculator** (`/calculators/life`): exact age (years/months/days), days/weeks/months lived, statistical estimate (labelled "not a prediction"), progress bar, life-in-weeks grid, disclaimer, no storage and no network. India life-expectancy numbers are rounded estimates (male 69, female 72, default 70.5) in `src/utils/lifeCalculator.js`. Save/Share buttons hidden for it (`hideSave` prop on `CalculatorLayout`).
- **Health check lead capture** (home `#health-check` section): asks name + mobile first, then six questions. Saved to MongoDB collection `healthcheckleads`:
  - `POST /api/health-check` (public) -> creates a row (`status: started`), returns `{ id, token }`
  - `PATCH /api/health-check/:id/complete` (needs the token) -> stores answers, score, percent, verdict (`status: completed`)
  - `GET /api/health-check` (admin only) -> paginated list, searchable by name/phone
  - Rate-limited; phone must be a valid Indian mobile; there is no admin-dashboard screen for these yet.
- **Footer:** five-column layout (brand, planning services, who we serve, professional network, about) with "Important Information" strip and legal links. Newsletter card and phone/address list were removed to match the owner's reference image. Big gold/blue SOLAHANA wordmark sits behind the content.
- **Generic `#hash` scrolling** in `ScrollToTopAndSEO.jsx` (links like `/estate-planning#estate-solutions` land on that section).

## 6. Working rules the owner expects (important)

1. The owner writes in Hinglish. Reply in the same style, short, with what changed, what was verified, and what was NOT verified.
2. **Verify in the browser** (preview on port 5180) after every UI change: desktop (about 1366-1440), a wide screen (1920) and mobile (390). Measure alignment, do not guess.
3. **Do not change the navbar** unless asked. Do not touch sections the owner did not mention. Keep the existing website colours: navy `#0F1F45`, gold `#C9922E`, cream `#FEFDF9`, light blue.
4. Hero/section images and text must look aligned with each other (same container, centred together). The owner is sensitive to image-vs-text misalignment, cut-off faces/objects, visible image boxes (use transparent/cream backgrounds) and blurry images (upscale with Real-ESRGAN: ONNX model `realesr-general-x4v3` + `onnxruntime`, kept only in a temp folder).
5. Copy: use the owner's wording exactly when they paste it. Do not invent claims. Calculators and health check must not claim to predict anything.
6. **Git:** commit + `git push origin main` only when asked ("push kardo"). Commit trailer: `Co-Authored-By: Claude ... <noreply@anthropic.com>`. `.env` is git-ignored; never commit secrets.
7. After the owner pastes a long spec starting with an instruction block, follow its RULES (for example "do not move the right image") even if it conflicts with an earlier tweak.

## 7. Known gaps / ideas not done

- Admin screen to view health-check leads (API exists; no UI).
- Optional: send an email/WhatsApp when someone completes the health check (`server/services/emailService.js` exists; SMTP not configured).
- Debt Management and Emergency Planning cards on the Financial Planning page have no pages yet (info cards only).
- Footer "Privacy / Terms / Disclosures / Grievance" all point to the booking form because no policy pages exist.
- **Live frontend (Vercel): https://solahana-self.vercel.app/** . The Render API URL is not recorded here. For production set `VITE_API_URL` (Vercel build) and `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET` (Render). The new `/api/health-check` route only works after the backend is redeployed.
- `README.md` and `AUDIT-CHANGES.md` describe the original project and may be out of date.

## 8. Latest pushed commit

`dd8f2b9` on `main`: "Home service cards: shorter cards so the second row peeks in on scroll".
