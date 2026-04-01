const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    domain: { type: String, required: true },
    level: { type: String, required: true },
    percentage: { type: Number, required: true },
    totalScore: { type: Number, required: true },
    maxPossibleScore: { type: Number, required: true },
    recommendation: { type: String },
    strengths: { type: [String] },
    areas_for_improvement: { type: [String] },
    next_steps: { type: [String] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', AssessmentSchema);
