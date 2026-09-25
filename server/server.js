import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Fail fast on a misconfigured production deployment instead of silently running insecure.
if (process.env.NODE_ENV === 'production') {
  const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`[Config] Missing required environment variable(s): ${missing.join(', ')}`);
    process.exit(1);
  }
  if (!process.env.CLIENT_URL) {
    console.warn('[Config] CLIENT_URL is not set — browsers on your deployed frontend will be blocked by CORS.');
  }
}

// Connect to MongoDB Atlas
connectDB();

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`
  =======================================================
   SOLAHANA Financial Planning Backend Engine Running!   
   Environment : ${process.env.NODE_ENV || 'development'}                
   Server Port : http://localhost:${PORT}                  
   Health Check: http://localhost:${PORT}/api/health       
  =======================================================
  [REGISTERED AUTHENTICATION ROUTES]
   POST   /api/auth/register
   POST   /api/auth/login
   POST   /api/auth/logout
   GET    /api/auth/me
   PATCH  /api/auth/profile
  =======================================================
  [REGISTERED CONSULTATION CRM ROUTES]
   POST   /api/consultations
   GET    /api/consultations/my
   PATCH  /api/consultations/:id/cancel
   GET    /api/admin/consultations
   PATCH  /api/admin/consultations/:id/status
   DELETE /api/admin/consultations/:id
  =======================================================
  `);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error(`[Uncaught Exception] Error: ${err.message}`);
  process.exit(1);
});
