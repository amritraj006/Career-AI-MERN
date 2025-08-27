const express = require("express");
const router = express.Router();
const { roadmapDB } = require("../../db/db"); // import connection
require("dotenv").config();

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

    roadmapDB.query(
      "INSERT INTO roadmaps (user_email, prompt, roadmap) VALUES (?, ?, ?)",
      [email, prompt, roadmap],
      (err) => {
        if (err) {
          console.error("❌ DB Insert Error:", err);
          return res.json({ success: false, message: "Database error" });
        }
        res.json({ success: true, roadmap });
      }
    );
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    res.json({ success: false, message: "Gemini API error" });
  }
});

// GET history
router.get("/history", (req, res) => {
  const { email } = req.query;

  roadmapDB.query(
    "SELECT * FROM roadmaps WHERE user_email = ? ORDER BY created_at DESC",
    [email],
    (err, results) => {
      if (err) {
        console.error("❌ DB Fetch Error:", err);
        return res.json({ success: false });
      }
      res.json({ success: true, history: results });
    }
  );
});

// DELETE history by id
router.delete("/history/:id", (req, res) => {
  const { id } = req.params;

  roadmapDB.query("DELETE FROM roadmaps WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ DB Delete Error:", err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

module.exports = router;
