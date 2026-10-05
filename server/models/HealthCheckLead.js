import mongoose from 'mongoose';

export const HEALTH_STATUS = ['started', 'completed'];

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

/**
 * One row per attempt at the "How healthy is your money?" self-check.
 * The lead (name + phone) is saved the moment the user starts; the answers and score are added when they finish.
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
    answers: { type: [answerSchema], default: [] },
    score: { type: Number, default: null },
    maxScore: { type: Number, default: null },
    percent: { type: Number, default: null },
    verdict: { type: String, default: '' },
    completedAt: { type: Date, default: null },
    source: { type: String, trim: true, default: 'home_health_check' },
    // Secret returned only to the browser that started the check, so nobody else can overwrite this row.
    // (select: false keeps it out of every query result, including the admin list.)
    completionToken: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

healthCheckLeadSchema.index({ createdAt: -1 });

const HealthCheckLead = mongoose.model('HealthCheckLead', healthCheckLeadSchema);
export default HealthCheckLead;
