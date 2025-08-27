const express = require("express");
const router = express.Router();
const Course = require("../models/Course"); // Cart courses model

// ✅ Get all courses in cart for a user
router.post("/enrolled", async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ error: "Missing userEmail" });
    }

    const courses = await Course.find({ user_email: userEmail }).select("resource_id");
    const resourceIds = courses.map(c => c.resource_id);

    return res.status(200).json({ resourceIds });
  } catch (err) {
    console.error("Fetch enrolled courses error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
