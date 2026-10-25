import mongoose from 'mongoose';

export const HEALTH_STATUS = ['started', 'completed'];

/** Legacy 6-question check: one row per answered question (kept readable; no new row has this). */
const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true, trim: true },
    area: { type: String, trim: true, default: '' },
    question: { type: String, trim: true, default: '' },
    answer: { type: String, trim: true, default: '' },
    score: { type: Number, min: 0, max: 2, required: true },
  },
  { _id: false }
);

/** The consent the person gave to be called back, with the version and hash of the exact wording they were shown. */
const consentSchema = new mongoose.Schema(
  {
    callback: { type: Boolean, required: true },
    textVersion: { type: String, required: true, trim: true, maxlength: 40 },
    textHash: { type: String, required: true, trim: true, maxlength: 64 },
    acceptedAt: { type: Date, required: true },
  },
  { _id: false }
);

/**
 * The score summary of a Financial Health Check-up. Only points and flags: no income, expense, savings, cover or any
 * other rupee amount is ever stored. The score is calculated in the person's browser and checked for consistency on the
 * server, so treat it as self-reported.
 */
const resultSchema = new mongoose.Schema(
  {
    scoringVersion: { type: String, required: true, trim: true, maxlength: 20 },
    shieldingApplicable: { type: Boolean, required: true },
    emergencyMeasurable: { type: Boolean, required: true },
    points: {
      emi: { type: Number, required: true, min: 0, max: 20 },
      term: { type: Number, required: true, min: 0, max: 20 },
      emergency: { type: Number, default: null, min: 0, max: 20 },
      investment: { type: Number, required: true, min: 0, max: 15 },
      health: { type: Number, required: true, min: 0, max: 15 },
      overlap: { type: Number, required: true, min: 0, max: 5 },
      shielding: { type: Number, default: null, min: 0, max: 5 },
    },
    earned: { type: Number, required: true, min: 0, max: 100 },
    applicable: { type: Number, required: true, min: 1, max: 100 },
    score: { type: Number, required: true, min: 0, max: 100 },
    band: { type: String, required: true, enum: ['strong', 'good', 'attention'] },
  },
  { _id: false }
);

/**
 * One row per callback request from the Financial Health Check-up (schemaVersion 2). Older rows (schemaVersion 1, or no
 * schemaVersion) come from the earlier 6-question check and keep their own fields; they are shown as "Legacy 6-question".
 */
const healthCheckLeadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9][0-9]{9}$/, 'Please enter a valid 10-digit Indian mobile number.'],
      index: true,
    },
    status: { type: String, enum: HEALTH_STATUS, default: 'started', index: true },
    source: { type: String, trim: true, default: 'home_health_check' },
    schemaVersion: { type: Number, default: 1 },
    completedAt: { type: Date, default: null },

    // New (schemaVersion 2)
    consent: { type: consentSchema, default: undefined },
    result: { type: resultSchema, default: undefined },
    // When the record is due for deletion (24 months after the request). Only new rows carry it.
    deleteAfter: { type: Date, default: null },

    // Legacy 6-question fields
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, default: null },
    maxScore: { type: Number, default: null },
    percent: { type: Number, default: null },
    verdict: { type: String, default: '' },
    // Legacy: the secret that let the browser that started a 6-question check finish it. New rows have none.
    completionToken: { type: String, select: false },
  },
  { timestamps: true }
);

healthCheckLeadSchema.index({ createdAt: -1 });
// Automatic deletion: MongoDB's TTL monitor removes a row once its deleteAfter date has passed. The monitor runs about
// once a minute and the delete is not instant, so expiry is "shortly after", never exactly at the timestamp. Rows without
// deleteAfter (all legacy rows) are never touched by it.
healthCheckLeadSchema.index({ deleteAfter: 1 }, { expireAfterSeconds: 0 });

const HealthCheckLead = mongoose.model('HealthCheckLead', healthCheckLeadSchema);
export default HealthCheckLead;
