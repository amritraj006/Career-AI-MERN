const express = require('express');
const router = express.Router();
const {
  generateAssessmentQuestions,
  evaluateAssessment,
  saveAssessment,
  getAssessment,
} = require('../controllers/assessmentController');

router.post('/generate-questions', generateAssessmentQuestions);
router.post('/evaluate', evaluateAssessment);
router.post('/', saveAssessment);
router.get('/', getAssessment);

module.exports = router;
