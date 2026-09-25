import mongoose from 'mongoose';

const savedCalculationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    calculatorType: {
      type: String,
      required: [true, 'Calculator type is required'],
      enum: ['SIP', 'EMI', 'RETIREMENT', 'GOAL_PLANNER', 'LUMPSUM', 'FD', 'INFLATION', 'sip', 'emi', 'retirement', 'goal-planner', 'goal_planner', 'lumpsum', 'fd', 'inflation'],
    },
    calculationName: {
      type: String,
      required: [true, 'Calculation name is required'],
      trim: true,
      maxlength: [120, 'Calculation name cannot exceed 120 characters'],
    },
    inputs: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Calculation inputs are required'],
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Calculation results are required'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for backward compatibility with title
savedCalculationSchema.virtual('title').get(function () {
  return this.calculationName;
});

savedCalculationSchema.set('toJSON', { virtuals: true });
savedCalculationSchema.set('toObject', { virtuals: true });

const SavedCalculation = mongoose.model('SavedCalculation', savedCalculationSchema, 'savedcalculations');
export default SavedCalculation;
