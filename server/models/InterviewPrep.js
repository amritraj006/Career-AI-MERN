const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    tip: { type: String },
  },
  { _id: false }
);

const interviewPrepSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, default: '' },
  question_type: { type: String, required: true },
  difficulty: { type: String, default: 'Medium' },
  experience_level: { type: String, default: 'Mid-level' },
  questions: { type: [qaSchema], required: true },
  created_at: { type: Date, default: Date.now },
});

interviewPrepSchema.index({ user_email: 1, created_at: -1 });

module.exports = mongoose.model('InterviewPrep', interviewPrepSchema);
