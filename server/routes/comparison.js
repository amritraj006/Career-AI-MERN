const express = require('express');
const { generateComparisonInsights } = require('../controllers/comparisonController');

const router = express.Router();

router.post('/ai-insights', generateComparisonInsights);

module.exports = router;
