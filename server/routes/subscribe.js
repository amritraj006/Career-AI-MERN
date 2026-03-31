const express = require("express");
const router = express.Router();
const subscribeController = require("../controllers/subscribeController");

// ✅ Subscribe an email
router.post("/email-subscribe", subscribeController.emailSubscribe);

module.exports = router;
