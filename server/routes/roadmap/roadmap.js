// routes/roadmap/roadmap.js
const express = require("express");
const router = express.Router();
const Roadmap = require("../../models/Roadmap"); // Mongoose model
require("dotenv").config();

// POST: generate roadmap and save
router.post("/", async (req, res) => {
  const { prompt, email } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate a roadmap to: ${prompt}` }] }],
        }),
      }
    );

    const data = await response.json();
    const roadmap =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No roadmap generated.";

    // Save to MongoDB
    const newRoadmap = new Roadmap({
      user_email: email,
      prompt,
      roadmap,
    });

    await newRoadmap.save();

    res.json({ success: true, roadmap, id: newRoadmap._id });
  } catch (error) {
    console.error("❌ Error generating roadmap:", error);
    res.json({ success: false, message: "Error generating roadmap" });
  }
});

// GET history for a user
router.get("/history", async (req, res) => {
  const { email } = req.query;

  try {
    const history = await Roadmap.find({ user_email: email }).sort({ created_at: -1 });
    res.json({ success: true, history });
  } catch (err) {
    console.error("❌ DB Fetch Error:", err);
    res.json({ success: false });
  }
});

// DELETE history by _id
router.delete("/history/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) throw new Error("No ID provided");
    await Roadmap.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting roadmap:", err);
    res.json({ success: false });
  }
});

module.exports = router;
