// routes/sendComparisonImage.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const nodemailer = require('nodemailer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { email } = req.body;
    const imageBuffer = req.file?.buffer;

    if (!email || !imageBuffer) {
      return res.status(400).json({ error: 'Missing email or image' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Career Comparison Snapshot',
      text: 'Attached is your career comparison snapshot.',
      attachments: [
        {
          filename: 'career-comparison.png',
          content: imageBuffer,
          contentType: 'image/png',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Image email sent successfully' });
  } catch (err) {
    console.error('Error sending image email:', err);
    res.status(500).json({ error: 'Failed to send image email' });
  }
});

module.exports = router;
