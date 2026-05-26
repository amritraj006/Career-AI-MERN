const express = require('express');
const router = express.Router();
const {
  generateAssessmentQuestions,
  evaluateAssessment,
  saveAssessment,
  getAssessment,
  getAssessmentHistory,
  deleteAssessmentHistory,
} = require('../controllers/assessmentController');

router.post('/generate-questions', generateAssessmentQuestions);
router.post('/evaluate', evaluateAssessment);
router.post('/', saveAssessment);
router.get('/', getAssessment);
router.get('/history', getAssessmentHistory);
router.delete('/history/:id', deleteAssessmentHistory);

module.exports = router;
