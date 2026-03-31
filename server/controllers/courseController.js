const nodemailer = require("nodemailer");
require("dotenv").config();

const EnrolledCourse = require("../models/EnrolledCourse");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.finalizePayment = async (req, res) => {
  try {
    const { userEmail, totalAmount, resourceId, courseName } = req.body;
    if (!userEmail || !totalAmount || !resourceId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Direct insert to EnrolledCourse
    const existing = await EnrolledCourse.findOne({ user_email: userEmail, resource_id: resourceId });
    if (!existing) {
      await EnrolledCourse.create({ user_email: userEmail, resource_id: resourceId });
    }

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
          <p>Your payment of <strong>$${parseFloat(totalAmount).toFixed(2)}</strong> for the course <strong>${courseName || "selected course"}</strong> has been successfully processed.</p>
          <p><strong>Payment Time:</strong> ${formattedDate}</p>
          <p>You are now enrolled. Happy learning! 🚀</p>
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
};

exports.getEnrolledIds = async (req, res) => {
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
};
