const { Clerk } = require('@clerk/clerk-sdk-node');

const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// GET /api/admin/active-users
exports.getActiveUsers = async (req, res) => {
  try {
    const users = await clerk.users.getUserList();
    const activeUsers = users.filter(user => !user.deletedAt); // ✅ filters out deleted accounts
    res.json({ count: activeUsers.length });
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
