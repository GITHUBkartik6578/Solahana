/**
 * Creates (or promotes) the first admin account.
 *
 *   npm run create-admin -- "amit@solahana.com" "StrongPassword123" "Amit Pandey"
 *
 * Or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in .env and run: npm run create-admin
 * Safe to re-run: an existing user with that email is promoted to admin instead of duplicated.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const [, , argEmail, argPassword, ...argName] = process.argv;

const email = (argEmail || process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const password = argPassword || process.env.ADMIN_PASSWORD || '';
const name = (argName.join(' ') || process.env.ADMIN_NAME || 'Solahana Admin').trim();

const fail = (message) => {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
};

if (!email || !password) {
  fail('Usage: npm run create-admin -- "email@solahana.com" "password" "Full Name"');
}
if (password.length < 8) {
  fail('Choose a password of at least 8 characters.');
}
if (!process.env.MONGODB_URI) {
  fail('MONGODB_URI is missing. Add it to your .env file first.');
}

try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = 'admin';
    existing.password = password; // re-hashed by the User model's pre-save hook
    await existing.save();
    console.log(`✓ Existing account promoted to admin: ${email}`);
  } else {
    await User.create({ name, email, password, role: 'admin', isVerified: true });
    console.log(`✓ Admin account created: ${email}`);
  }

  console.log('→ Sign in at /admin/login\n');
  process.exit(0);
} catch (error) {
  fail(`Could not create the admin account: ${error.message}`);
}
