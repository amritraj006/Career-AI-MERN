const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmapHistory, deleteRoadmapHistory } = require('../controllers/roadmapController');

router.post('/', generateRoadmap);
router.get('/history', getRoadmapHistory);
router.delete('/history/:id', deleteRoadmapHistory);

module.exports = router;
