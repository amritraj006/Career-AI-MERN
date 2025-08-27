const express = require('express');
const router = express.Router();
const { clerkClient } = require('@clerk/express'); // NEW

// GET /api/admin/active-users
router.get('/active-users', async (req, res) => {
  try {
    const users = await clerkClient.users.getUserList();
    const activeUsers = users.filter(user => !user.deletedAt); // ✅ filters out deleted accounts
    res.json({ count: activeUsers.length });
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
