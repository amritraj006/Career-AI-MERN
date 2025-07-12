// 📁 routes/roadmap/roadmap.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.ROADMAP_DB_NAME,
});

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
    const roadmap = data.candidates?.[0]?.content?.parts?.[0]?.text || "No roadmap generated.";

    db.query(
      "INSERT INTO roadmaps (user_email, prompt, roadmap) VALUES (?, ?, ?)",
      [email, prompt, roadmap],
      (err) => {
        if (err) return res.json({ success: false, message: "Database error" });
        res.json({ success: true, roadmap });
      }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.json({ success: false, message: "Gemini API error" });
  }
});

// GET /api/roadmap/history?email=user@example.com
router.get("/history", (req, res) => {
  const { email } = req.query;

  db.query(
    "SELECT * FROM roadmaps WHERE user_email = ? ORDER BY created_at DESC",
    [email],
    (err, results) => {
      if (err) return res.json({ success: false });
      res.json({ success: true, history: results });
    }
  );
});

router.delete("/history/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM roadmaps WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    }
  );
});


module.exports = router;
