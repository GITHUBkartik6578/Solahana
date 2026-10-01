# Solahana audit — changes made

Verified in the sandbox: calculator math (vs. closed-form formulas), hero autoplay (headless Chromium), email escaping (stubbed mailer), email regex, syntax of every src/server file, import/route/link consistency.
NOT verified (no network / credentials): `vite build`, real browser page tests, running the Express server, MongoDB Atlas, Vercel/Render.

## Run these on your machine
    npm install
    npm run lint
    npm run build
    npm run dev            # frontend  http://localhost:5173
    npm run server         # backend   needs .env with MONGODB_URI + JWT_SECRET

## Deployment checklist (important)
- Vercel env: `VITE_API_URL` = your Render API URL (no trailing slash). Without it, forms call the static site and fail.
- Render env: `CLIENT_URL` = your exact Vercel origin(s), comma-separated. CORS is now an allow-list.
- Render env: `JWT_SECRET` and `MONGODB_URI` are required; the server exits at startup without them in production.

## Files changed
Frontend: Hero.jsx (autoplay), LoginPage.jsx, AdminLoginPage.jsx (failed login no longer navigates), PricingPage.jsx (lead payload + phone), AdminDashboardPage.jsx (admin-only buttons), ScrollToTopAndSEO.jsx, calculatorEngine.js, index.html, public/robots.txt, vercel.json, .env.example, render.yaml
Server: app.js, server.js, middleware/{auth,admin,error}Middleware.js, utils/{generateToken,escapeRegex}.js, controllers/{auth,admin,blog,consultation,newsletter,calculation}Controller.js, routes/{admin,adminConsultation,blog,health}Routes.js, models/{User,Newsletter}.js, validations/{consultation,newsletter}Validation.js, services/emailService.js

## Known remaining
- SIP calculator truncates fractional years (2.5 -> 2).
- og:image is a hotlinked Unsplash photo; no canonical URLs / sitemap (need your domain).
- ~53 unimported components, unused calculatorRoutes.js/controller, unused large assets (safe to delete, left untouched).
- Zod `error:` option change is untested at runtime (zod not installable here).
