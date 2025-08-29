const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  prompt: { type: String, required: true },
  roadmap: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
