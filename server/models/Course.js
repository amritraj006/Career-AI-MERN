// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  user_email: { type: String },
  resource_id: { type: String },
  course_name: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
