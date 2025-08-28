const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription"); // Only model you have

// ✅ Subscribe an email
router.post("/email-subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    // Check if email already exists (any subscription with this email)
    const existing = await Subscription.findOne({ user_email: email });
    if (existing) {
      return res.status(400).json({ error: "Email already subscribed." });
    }

    // Create new subscription with no pathway (for general email subscription)
    await Subscription.create({ user_email: email });
    return res.status(200).json({ message: "Email subscribed successfully." });
  } catch (err) {
    console.error("Email subscribe error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
