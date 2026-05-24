const express = require('express');
const router = express.Router();
const {
  generateInterviewQuestions,
  generateMoreQuestions,
  getInterviewHistory,
  getInterviewSession,
  deleteInterviewHistory,
} = require('../controllers/interviewController');

router.post('/generate', generateInterviewQuestions);
router.post('/generate-more', generateMoreQuestions);
router.get('/history', getInterviewHistory);
router.get('/session/:id', getInterviewSession);
router.delete('/history/:id', deleteInterviewHistory);

module.exports = router;
