import mongoose from 'mongoose';

export const GOAL_ENUM = [
  'Financial Planning',
  'Retirement Planning',
  'Investment Planning',
  'Tax Planning',
  'Risk Management',
  'Estate Planning',
  'Custom Wealth Planning',
  'Dream Home',
  'Emergency Fund',
  'Wealth Creation',
  'Child Education',
  'General Financial Planning',
];

export const MODE_ENUM = ['Video Call', 'Phone Call', 'Office Visit'];

export const STATUS_ENUM = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

const consultationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    goal: {
      type: String,
      required: [true, 'Financial goal is required'],
      default: 'Financial Planning',
    },
    consultationMode: {
      type: String,
      default: 'Phone Call',
    },
    preferredDate: {
      type: Date,
      default: Date.now,
    },
    preferredTime: {
      type: String,
      default: 'Morning (9 AM - 12 PM)',
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: STATUS_ENUM,
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
    },
    meetingLink: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and sorting
consultationSchema.index({ user: 1, createdAt: -1 });
consultationSchema.index({ status: 1, createdAt: -1 });

const Consultation = mongoose.model('Consultation', consultationSchema, 'consultation_requests');
export default Consultation;

