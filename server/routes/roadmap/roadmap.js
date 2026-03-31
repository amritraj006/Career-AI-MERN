const express = require("express");
const router = express.Router();
const roadmapController = require("../../controllers/roadmapController");

// POST: Generate roadmap and save
router.post("/", roadmapController.generateRoadmap);

// GET: Roadmap history
router.get("/history", roadmapController.getHistory);

// DELETE: Remove roadmap by id
router.delete("/history/:id", roadmapController.deleteRoadmap);

module.exports = router;
