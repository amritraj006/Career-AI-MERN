const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  prompt: { type: String, required: true },
  roadmap: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Create compound index for querying history
roadmapSchema.index({ user_email: 1, created_at: -1 });

module.exports = mongoose.model("Roadmap", roadmapSchema);
