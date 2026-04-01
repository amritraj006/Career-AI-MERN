const express = require('express');
const router = express.Router();
const { saveAssessment, getAssessment } = require('../controllers/assessmentController');

router.post('/', saveAssessment);
router.get('/', getAssessment);

module.exports = router;
