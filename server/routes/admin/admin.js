const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');

// GET /api/admin/active-users
router.get('/active-users', adminController.getActiveUsers);

module.exports = router;