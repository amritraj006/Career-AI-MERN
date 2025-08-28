const mongoose = require("mongoose");

const enrolledCourseSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  resource_id: { type: String, required: true }
});

module.exports = mongoose.model("EnrolledCourse", enrolledCourseSchema);
