const express = require("express");
const router = express.Router();
const Roadmap = require("../../models/Roadmap"); // MongoDB model
require("dotenv").config();

// POST: Generate roadmap and save
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
    const roadmapText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No roadmap generated.";

    const newRoadmap = await Roadmap.create({
      user_email: email,
      prompt,
      roadmap: roadmapText
    });

    res.json({ success: true, roadmap: newRoadmap.roadmap });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.json({ success: false, message: "Gemini API error" });
  }
});

// GET roadmap history for a user
router.get("/history", async (req, res) => {
  try {
    const { email } = req.query;
    const history = await Roadmap.find({ user_email: email }).sort({ created_at: -1 });
    res.json({ success: true, history });
  } catch (err) {
    console.error("❌ DB Fetch Error:", err);
    res.json({ success: false });
  }
});

// DELETE a roadmap by id
router.delete("/history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Roadmap.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ DB Delete Error:", err);
    res.json({ success: false });
  }
});

module.exports = router;
