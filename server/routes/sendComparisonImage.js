// routes/sendComparisonImage.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sendComparisonImageController = require('../controllers/sendComparisonImageController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), sendComparisonImageController.sendComparisonImage);

module.exports = router;
