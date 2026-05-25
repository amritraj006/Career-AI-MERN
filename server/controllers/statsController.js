const Assessment = require('../models/Assessment');
const Roadmap = require('../models/Roadmap');
const InterviewPrep = require('../models/InterviewPrep');

exports.getStats = async (req, res) => {
  try {
    const [assessmentsCount, roadmapsCount, interviewsCount, usersCount] = await Promise.all([
      Assessment.countDocuments(),
      Roadmap.countDocuments(),
      InterviewPrep.countDocuments(),
      Assessment.distinct('email').then(users => users.length) // approximating active users based on assessments
    ]);

    // Add some base numbers so it doesn't look completely empty on a fresh DB, 
    // or just return the real stats. The prompt said "use real stats in whole project".
    res.status(200).json({
      success: true,
      stats: {
        users: usersCount,
        assessments: assessmentsCount,
        roadmaps: roadmapsCount,
        interviews: interviewsCount
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};
