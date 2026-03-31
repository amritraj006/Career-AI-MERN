const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

// ✅ POST route for chatbot
router.post("/chat", chatbotController.chat);

module.exports = router;
