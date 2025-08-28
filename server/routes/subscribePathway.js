const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");

// ✅ Subscribe or unsubscribe to a pathway
router.post("/pathway-subscribe", async (req, res) => {
  try {
    const { userEmail, pathwayId, subscribed } = req.body;

    if (!userEmail || !pathwayId) {
      return res.status(400).json({ error: "Missing userEmail or pathwayId" });
    }

    if (subscribed) {
      // Add subscription if it doesn't exist
      const existing = await Subscription.findOne({ user_email: userEmail, pathway_id: pathwayId });
      if (!existing) {
        await Subscription.create({ user_email: userEmail, pathway_id: pathwayId });
      }
      return res.status(200).json({ message: "Subscribed successfully" });
    } else {
      // Unsubscribe
      await Subscription.deleteOne({ user_email: userEmail, pathway_id: pathwayId });
      return res.status(200).json({ message: "Unsubscribed successfully" });
    }
  } catch (err) {
    console.error("Pathway subscribe error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ✅ Get all pathways subscribed by a user
router.get("/user-pathways", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const subscriptions = await Subscription.find({ user_email: email, pathway_id: { $exists: true } }).select("pathway_id");
    const pathwayIds = subscriptions.map(s => s.pathway_id);

    return res.status(200).json({ pathwayIds });
  } catch (err) {
    console.error("Fetch user pathways error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
