import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route Imports
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import calculationRoutes from './routes/calculationRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Render/Vercel/most PaaS hosts sit behind a reverse proxy. Without this, every visitor shares the
// proxy's IP and the rate limiters below would throttle all users together.
if (process.env.NODE_ENV === 'production') {
  const hops = Number(process.env.TRUST_PROXY_HOPS || 1);
  app.set('trust proxy', Number.isFinite(hops) ? hops : 1);
}

// 1. Helmet Security Headers
app.use(helmet());

// 2. CORS Configuration — explicit allow-list. CLIENT_URL may hold several comma-separated origins
//    (e.g. "https://solahana.vercel.app,https://www.solahana.com").
const normalizeOrigin = (value) => String(value || '').trim().replace(/\/+$/, '');

const allowedOrigins = [
  ...String(process.env.CLIENT_URL || '').split(','),
  ...(process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173', 'http://127.0.0.1:5173']),
]
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header = same-origin / server-to-server / curl / health checks.
      if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. JSON & Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Cookie Parser
app.use(cookieParser());

// 5. Morgan Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Stricter limits on abuse-prone endpoints (brute-force logins, lead / newsletter spam that also triggers emails)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, success: false, message: 'Too many attempts. Please try again in 15 minutes.' },
});
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, success: false, message: 'Too many submissions from this network. Please try again later.' },
});
const onlyPost = (limiterFn) => (req, res, next) => (req.method === 'POST' ? limiterFn(req, res, next) : next());

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/consultations', onlyPost(publicWriteLimiter));
app.use('/api/newsletter', onlyPost(publicWriteLimiter));
app.use('/api/newsletters', onlyPost(publicWriteLimiter));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SOLAHANA Financial Planning API',
    health: '/api/health',
    auth: '/api/auth',
  });
});

// 6. API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/calculations', calculationRoutes);
app.use('/api/calculators', calculationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/users', userRoutes);

// 7. 404 & Global Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
