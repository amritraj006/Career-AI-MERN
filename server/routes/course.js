const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

const Course = require("../models/Course");
const EnrolledCourse = require("../models/EnrolledCourse");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Toggle course enrollment (add/remove from cart)
router.post("/course-toggle", async (req, res) => {
  try {
    const { userEmail, resourceId, addedToCart } = req.body;

    if (!userEmail || !resourceId) {
      return res.status(400).json({ error: "Missing userEmail or resourceId" });
    }

    if (addedToCart) {
      // Add to cart if not already exists
      const existing = await Course.findOne({ user_email: userEmail, resource_id: resourceId });
      if (!existing) {
        await Course.create({ user_email: userEmail, resource_id: resourceId });
      }
      return res.status(200).json({ message: "Enrolled successfully" });
    } else {
      // Remove from cart
      await Course.deleteOne({ user_email: userEmail, resource_id: resourceId });
      return res.status(200).json({ message: "Unenrolled successfully" });
    }
  } catch (err) {
    console.error("Course toggle error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ✅ Get total count of courses in cart
router.post("/course/count", async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ error: "Missing userEmail" });

    const count = await Course.countDocuments({ user_email: userEmail });
    return res.status(200).json({ count });
  } catch (err) {
    console.error("Course count error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ✅ Clear all courses from cart
router.post("/course/clear", async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ error: "Missing userEmail" });

    await Course.deleteMany({ user_email: userEmail });
    return res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    console.error("Clear cart error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ✅ Finalize payment and move courses to enrolled + send email
router.post("/course/finalize-payment", async (req, res) => {
  try {
    const { userEmail, totalAmount } = req.body;
    if (!userEmail || !totalAmount) {
      return res.status(400).json({ error: "Missing userEmail or totalAmount" });
    }

    // Get all courses in cart
    const courses = await Course.find({ user_email: userEmail });

    // Move to enrolled_courses
    const enrolledDocs = courses.map(c => ({ user_email: c.user_email, resource_id: c.resource_id }));
    if (enrolledDocs.length > 0) {
      await EnrolledCourse.insertMany(enrolledDocs);
    }

    // Clear cart
    await Course.deleteMany({ user_email: userEmail });

    // Send email
    const now = new Date();
    const formattedDate = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "🎉 Payment Successful - Course Enrollment",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #6366f1;">Thank you for your payment!</h2>
          <p>Hello,</p>
          <p>Your payment of <strong>$${parseFloat(totalAmount).toFixed(2)}</strong> has been successfully processed.</p>
          <p><strong>Payment Time:</strong> ${formattedDate}</p>
          <p>You are now enrolled in the selected courses. Happy learning! 🚀</p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">If you didn’t make this payment, please contact support immediately.</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (emailErr, info) => {
      if (emailErr) {
        console.error("Email send error:", emailErr);
        return res.status(500).json({ error: "Payment completed, but email failed to send" });
      }
      return res.status(200).json({ message: "Payment finalized and email sent successfully" });
    });
  } catch (err) {
    console.error("Finalize payment error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

// ✅ Get enrolled course IDs
router.post("/course/enrolled-ids", async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) return res.status(400).json({ error: "Missing userEmail" });

    const enrolledCourses = await EnrolledCourse.find({ user_email: userEmail }).select("resource_id");
    const enrolledIds = enrolledCourses.map(c => c.resource_id);

    return res.status(200).json({ enrolledIds });
  } catch (err) {
    console.error("Fetch enrolled IDs error:", err);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
