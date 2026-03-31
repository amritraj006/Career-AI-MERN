const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// ✅ Finalize payment and enroll directly + send email
router.post("/course/finalize-payment", courseController.finalizePayment);

// ✅ Get enrolled course IDs
router.post("/course/enrolled-ids", courseController.getEnrolledIds);

module.exports = router;
