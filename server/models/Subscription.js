const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  pathway_id: { type: String, required: true },
  subscribed_at: { type: Date, default: Date.now }
});

// Prevent duplicate subscriptions
subscriptionSchema.index({ user_email: 1, pathway_id: 1 }, { unique: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
